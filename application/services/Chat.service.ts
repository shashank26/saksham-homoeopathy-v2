import {
  FirebaseFirestoreTypes,
  increment,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import { AuthService } from "./Auth.service";
import { db } from "./Firebase.service";

export type ChatMessage = {
  message: string;
  sender: string;
  sentAt: Date;
};

export type ChatMetadata = {
  participants: string[];
  lastMessage: string;
  lastMessageAt: Date;
  unreadCount: { [userId: string]: number };
};

export class ChatService {
  static collection = db.collection("chat");

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
            const data = doc.data();
            messages.push({
              message: data.message,
              sender: data.sender,
              sentAt: data.sentAt.toDate(),
            });
          });

          callback(messages, snapshot.docs[snapshot.docs.length - 1]);
        },
        (error) => {
          console.error("Error fetching messages: ", error);
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

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        message: data.message,
        sender: data.sender,
        sentAt: data.sentAt.toDate(),
      };
    });
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
        const data = snapshot.docs.map((doc) => doc.data());
        callback(
          new Map(
            data.map((d) => [
              d.participants.find((p: string) => p !== currentUserId) ||
                "Unknown",
              {
                lastMessage: d.lastMessage,
                lastMessageAt: d?.lastMessageAt?.toDate(),
                participants: d.participants,
                unreadCount: d.unreadCount,
              },
            ]),
          ),
        );
      },
      (error) => {
        console.error("Error fetching chat metadata: ", error);
      },
    );
  }

  static async createChat(chatId: string, userA: string, userB: string) {
    const participants = [userA, userB];
    const currentUser = AuthService.getUser().uid;

    const chatDoc = await this.collection.doc(chatId).get();
    if (chatDoc.exists()) {
      return this.collection.doc(chatId).update({
        participants,
        unreadCount: {
          [currentUser]: 0,
        },
      });
    }

    return this.collection.doc(chatId).set(
      {
        participants,
        createdAt: serverTimestamp(),
        lastMessage: "",
        lastMessageAt: serverTimestamp(),
        unreadCount: {
          [userA]: 0,
          [userB]: 0,
        },
      },
      {
        merge: true,
      },
    );
  }

  static async send(message: string, chatId: string, receiverId: string) {
    const chatRef = this.collection.doc(chatId);
    console.log('Sending message to chatId:', chatId)
    const messageData: ChatMessage = {
      message,
      sender: AuthService.getUser().uid,
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
      console.error("Error sending message: ", error);
    }
  }
}
