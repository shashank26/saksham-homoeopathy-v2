import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { AuthService } from "./Auth.service";
import { db } from "./Firebase.service";

export type ChatMessage = {
  message: string;
  sender: string;
  sentAt: Date;
};

export class ChatService {
  static collection = db.collection("chat");

  static listenToLatestMessages(
    chatId: string,
    limitCount: number,
    callback: (messages: ChatMessage[], lastDoc: any) => void,
  ) {
    const chatRef = this.collection.doc(chatId);

    return chatRef
      .collection("messages")
      .orderBy("sentAt", "desc")
      .limit(limitCount)
      .onSnapshot((snapshot) => {
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
      });
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

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        message: data.message,
        sender: data.sender,
        sentAt: data.sentAt.toDate(),
      };
    });
  }

  static async send(message: string, chatId: string) {
    const chatRef = this.collection.doc(chatId);
    const messageData: ChatMessage = {
      message,
      sender: AuthService.getUser().uid,
      sentAt: new Date(),
    };
    return chatRef.collection("messages").add(messageData);
  }
}
