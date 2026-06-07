import { Monitoring } from "@/services/Monitoring.service";
import { serverTimestamp } from "@react-native-firebase/firestore";
import { db } from "./Firebase.service";

export type FeedbackCategory = "bug" | "feature" | "general" | "other";

export type FeedbackSubmitInput = {
  userId: string;
  displayName: string;
  phoneNumber: string;
  role?: string;
  category: FeedbackCategory;
  message: string;
  appVersion: string;
  platform: "ios" | "android";
};

export class FeedbackService {
  private static FEEDBACK_COLLECTION = db.collection("feedback");

  static async submit(input: FeedbackSubmitInput): Promise<boolean> {
    try {
      await this.FEEDBACK_COLLECTION.add({
        ...input,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.error("Error submitting feedback:", err);
      Monitoring.captureException(err, {
        area: "feedback",
        action: "submit",
      });
      return false;
    }
  }
}
