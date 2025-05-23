import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { AuthService } from "./Auth.service";

export type ChatMessage = {
  message: string;
  sender: string;
  sentAt: Date;
};

export class ChatService {
  static collection = firestore().collection("chat");

  static async send(message: string, receiverId: string) {
    const chatRef = this.collection.doc(receiverId);
    const messageData: ChatMessage = {
      message,
      sender: AuthService.getUser().uid,
      sentAt: new Date(),
    };
    return chatRef.collection("messages").add(messageData);
  }

  static listenToMessages(
    chatId: string,
    callback: (messages: ChatMessage[]) => void
  ) {
    
  }

  
}
