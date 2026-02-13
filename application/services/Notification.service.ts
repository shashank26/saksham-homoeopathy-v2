import { serverTimestamp } from "@react-native-firebase/firestore";
import { db } from "./Firebase.service";

export type NotificationType = {
  message: string;
  read: boolean;
  userId: string;
  id?: string;
  timestamp?: Date;
};

export class NotificationService {
  private static NOTIFICATION_COLLECTION = db.collection("notifications");

  static async addNotification(userId: string, message: string) {
    try {
      await this.NOTIFICATION_COLLECTION.add({
        userId,
        message,
        read: false,
        timestamp: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.error("Error adding notification:", err);
      return false;
    }
  }

  static async markAsRead(notificationId: string) {
    try {
      await this.NOTIFICATION_COLLECTION.doc(notificationId).update({
        read: true,
      });
      return true;
    } catch (err) {
      console.error("Error marking notification as read:", err);
      return false;
    }
  }

  static onNotificationsUpdate(
    userId: string,
    cb: (notifications: NotificationType[]) => void
  ) {
    const query = this.NOTIFICATION_COLLECTION.where("userId", "==", userId);
    const unsub = query.onSnapshot((snapshot) => {
      const notifications: NotificationType[] = [];
      if (!snapshot) return;
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const doc = change.doc;
          const data = doc.data();
          notifications.push({
            id: doc.id,
            message: data.message,
            read: data.read,
            userId: data.userId,
            timestamp: data.timestamp ? data.timestamp.toDate() : undefined,
          });
        }
      });
      cb(notifications);
    });
    return unsub;
  }
}
