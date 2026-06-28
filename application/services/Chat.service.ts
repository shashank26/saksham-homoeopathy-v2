import { Monitoring } from "@/services/Monitoring.service";
import { ModerationService } from "@/services/Moderation.service";
import {
  FirebaseFirestoreTypes,
  increment,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import { AuthService } from "./Auth.service";
import { db, Role } from "./Firebase.service";
import { UserService } from "./User.service";

export type ChatMessageType = "text" | "prescription";

export type ChatMessage = {
  id?: string;
  message: string;
  sender: string;
  sentAt: Date;
  editedAt?: Date;
  messageType?: ChatMessageType;
  historyId?: string;
};

export type PendingChatMessage = {
  clientId: string;
  message: string;
  sender: string;
  sentAt: Date;
  status: "sending" | "failed";
};

export type ChatMetadata = {
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: { [userId: string]: number };
};

export class ChatService {
  static collection = db.collection("chat");

  private static mapMessageDoc(
    doc: FirebaseFirestoreTypes.QueryDocumentSnapshot,
  ): ChatMessage {
    const data = doc.data();
    return {
      id: doc.id,
      message: data.message,
      sender: data.sender,
      sentAt: data.sentAt.toDate(),
      editedAt: data.editedAt?.toDate(),
      messageType: data.messageType ?? "text",
      historyId: data.historyId,
    };
  }

  static async ensureChatForPatient(patientId: string) {
    const doctors = await UserService.getDoctors();
    const participants = [
      ...doctors.map((doctor) => doctor.id),
      patientId,
    ];
    await this.createChat(patientId, participants);
  }

  static listenToLatestMessages(
    chatId: string,
    limitCount: number,
    callback: (messages: ChatMessage[], lastDoc: any) => void,
  ) {
    const chatRef = this.collection.doc(chatId);
    this.collection.doc(chatId).get();
    return chatRef
      .collection("messages")
      .orderBy("sentAt", "desc")
      .limit(limitCount)
      .onSnapshot(
        (snapshot) => {
          const messages: ChatMessage[] = [];
          snapshot.forEach((doc) => {
            messages.push(this.mapMessageDoc(doc));
          });

          callback(messages, snapshot.docs[snapshot.docs.length - 1]);
        },
        (error) => {
          console.error("Error fetching messages: ", error);
          Monitoring.captureException(error, {
            area: "chat",
            action: "listenToLatestMessages",
          });
        },
      );
  }

  static async fetchOlderMessages(
    chatId: string,
    lastDoc: FirebaseFirestoreTypes.QueryDocumentSnapshot,
    limitCount = 30,
  ) {
    const chatRef = this.collection.doc(chatId);

    const snapshot = await chatRef
      .collection("messages")
      .orderBy("sentAt", "desc")
      .startAfter(lastDoc)
      .limit(limitCount)
      .get();

    if (!snapshot || snapshot.empty) return [];

    return snapshot.docs.map((doc) => this.mapMessageDoc(doc));
  }

  static async listenToChatMetadata(
    currentUserId: string,
    callback: (data: Map<string, ChatMetadata>) => void,
  ) {
    const chatRef = this.collection
      .where("participants", "array-contains", currentUserId)
      .orderBy("lastMessageAt", "desc");

    return chatRef.onSnapshot(
      (snapshot) => {
        if (!snapshot || snapshot.empty) return new Map<string, ChatMetadata>();
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        callback(
          new Map(
            data.map((d) => [
              d.id as string,
              {
                lastMessage: d.data.lastMessage,
                lastMessageAt: d.data?.lastMessageAt?.toDate(),
                participants: d.data.participants,
                unreadCount: d.data.unreadCount,
              },
            ]),
          ),
        );
      },
      (error) => {
        console.error("Error fetching chat metadata: ", error);
        Monitoring.captureException(error, {
          area: "chat",
          action: "listenToChatMetadata",
        });
      },
    );
  }

  static async createChat(chatId: string, participants: string[]) {
    const currentUser = await AuthService.getUserProfile();
    const uid =
      currentUser?.role === Role.DOCTOR ? Role.DOCTOR : currentUser?.id;
    const participantObject: { [key: string]: number } = {};
    participants.forEach((p) => {
      participantObject[p] = 0;
    });

    const chatDoc = await this.collection.doc(chatId).get();
    if (chatDoc.exists()) {
      return this.collection.doc(chatId).update({
        participants,
        [`unreadCount.${uid}`]: 0,
      });
    }

    return this.collection.doc(chatId).set(
      {
        participants,
        createdAt: serverTimestamp(),
        lastMessage: "",
        lastMessageAt: serverTimestamp(),
        unreadCount: participantObject,
      },
      {
        merge: true,
      },
    );
  }

  static async send(message: string, chatId: string, receiverId: string) {
    const senderId = AuthService.getUser().uid;
    const canInteract = await ModerationService.canInteract(
      senderId,
      receiverId,
      chatId,
    );

    if (!canInteract) {
      throw new Error("INTERACTION_BLOCKED");
    }

    const chatRef = this.collection.doc(chatId);
    console.log("Sending message to chatId:", chatId);
    const messageData: ChatMessage = {
      message,
      sender: senderId,
      sentAt: serverTimestamp() as unknown as Date,
    };

    try {
      await db.runTransaction(async (transaction) => {
        transaction.set(chatRef.collection("messages").doc(), messageData);
        transaction.update(chatRef, {
          lastMessage: message,
          lastMessageAt: serverTimestamp(),
          [`unreadCount.${receiverId}`]: increment(1),
        });
      });

      console.log("Message sent successfully");
    } catch (error) {
      if (error instanceof Error && error.message === "INTERACTION_BLOCKED") {
        throw error;
      }
      console.error("Error sending message: ", error);
      Monitoring.captureException(error, { area: "chat", action: "send" });
      throw error;
    }
  }

  static async sendPrescription(
    chatId: string,
    receiverId: string,
    payload: { message: string; historyId: string },
  ) {
    const senderId = AuthService.getUser().uid;
    const canInteract = await ModerationService.canInteract(
      senderId,
      receiverId,
      chatId,
    );

    if (!canInteract) {
      throw new Error("INTERACTION_BLOCKED");
    }

    const chatRef = this.collection.doc(chatId);
    const messageData = {
      message: payload.message,
      sender: senderId,
      sentAt: serverTimestamp(),
      messageType: "prescription" as const,
      historyId: payload.historyId,
    };

    try {
      await db.runTransaction(async (transaction) => {
        transaction.set(chatRef.collection("messages").doc(), messageData);
        transaction.update(chatRef, {
          lastMessage: payload.message,
          lastMessageAt: serverTimestamp(),
          [`unreadCount.${receiverId}`]: increment(1),
        });
      });
    } catch (error) {
      if (error instanceof Error && error.message === "INTERACTION_BLOCKED") {
        throw error;
      }
      console.error("Error sending prescription message: ", error);
      Monitoring.captureException(error, {
        area: "chat",
        action: "sendPrescription",
      });
      throw error;
    }
  }

  static async updateMessage(
    chatId: string,
    messageId: string,
    newText: string,
  ) {
    const senderId = AuthService.getUser().uid;
    const chatRef = this.collection.doc(chatId);
    const messageRef = chatRef.collection("messages").doc(messageId);

    const messageDoc = await messageRef.get();
    if (!messageDoc.exists()) {
      throw new Error("MESSAGE_NOT_FOUND");
    }

    const data = messageDoc.data();
    if (data?.sender !== senderId) {
      throw new Error("NOT_MESSAGE_OWNER");
    }

    await messageRef.update({
      message: newText,
      editedAt: serverTimestamp(),
    });

    const chatDoc = await chatRef.get();
    const chatData = chatDoc.data();
    if (chatData?.lastMessage === data.message) {
      await chatRef.update({
        lastMessage: newText,
      });
    }
  }
}
