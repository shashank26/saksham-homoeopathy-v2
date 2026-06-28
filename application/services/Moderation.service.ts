import { ReportReason } from "@/constants/moderation";
import { Monitoring } from "@/services/Monitoring.service";
import { NotificationService } from "@/services/Notification.service";
import { UserService } from "@/services/User.service";
import { serverTimestamp } from "@react-native-firebase/firestore";
import { Role } from "./Firebase.service";
import { db } from "./Firebase.service";

export type ReportType = "message" | "user";

export type ModerationReport = {
  id?: string;
  type: ReportType;
  reason: ReportReason;
  details?: string;
  reporterId: string;
  reporterPhone: string;
  reportedUserId: string;
  chatId: string;
  messageId?: string;
  messageText?: string;
  createdAt?: Date;
};

export type UserBlock = {
  id?: string;
  blockerId: string;
  blockedId: string;
  chatId: string;
  createdAt?: Date;
};

type SubmitReportInput = {
  type: ReportType;
  reason: ReportReason;
  details?: string;
  reporterId: string;
  reporterPhone: string;
  reportedUserIds: string[];
  chatId: string;
  messageId?: string;
  messageText?: string;
};

export class ModerationService {
  private static REPORTS_COLLECTION = db.collection("moderation_reports");
  private static BLOCKS_COLLECTION = db.collection("user_blocks");

  private static blockKey(blockerId: string, blockedId: string): string {
    return `${blockerId}_${blockedId}`;
  }

  private static async notifyAdminsOfReport(
    type: ReportType,
    reason: ReportReason,
  ): Promise<void> {
    const doctors = await UserService.getDoctors();
    const message = `New chat report: ${type} — ${reason}`;
    await Promise.all(
      doctors
        .filter((doctor) => doctor.phoneNumber)
        .map((doctor) =>
          NotificationService.addNotification(doctor.phoneNumber, message),
        ),
    );
  }

  static async submitReport(input: SubmitReportInput): Promise<boolean> {
    try {
      await Promise.all(
        input.reportedUserIds.map((reportedUserId) =>
          this.REPORTS_COLLECTION.add({
            type: input.type,
            reason: input.reason,
            details: input.details?.trim() || null,
            reporterId: input.reporterId,
            reporterPhone: input.reporterPhone,
            reportedUserId,
            chatId: input.chatId,
            messageId: input.messageId ?? null,
            messageText: input.messageText ?? null,
            createdAt: serverTimestamp(),
          }),
        ),
      );
      await this.notifyAdminsOfReport(input.type, input.reason);
      return true;
    } catch (err) {
      console.error("Error submitting report:", err);
      Monitoring.captureException(err, {
        area: "moderation",
        action: "submitReport",
      });
      return false;
    }
  }

  static async submitMessageReport(params: {
    reason: ReportReason;
    details?: string;
    reporterId: string;
    reporterPhone: string;
    reportedUserId: string;
    chatId: string;
    messageId: string;
    messageText: string;
  }): Promise<boolean> {
    return this.submitReport({
      type: "message",
      reason: params.reason,
      details: params.details,
      reporterId: params.reporterId,
      reporterPhone: params.reporterPhone,
      reportedUserIds: [params.reportedUserId],
      chatId: params.chatId,
      messageId: params.messageId,
      messageText: params.messageText,
    });
  }

  static async submitUserReport(params: {
    reason: ReportReason;
    details?: string;
    reporterId: string;
    reporterPhone: string;
    reportedUserIds: string[];
    chatId: string;
  }): Promise<boolean> {
    return this.submitReport({
      type: "user",
      reason: params.reason,
      details: params.details,
      reporterId: params.reporterId,
      reporterPhone: params.reporterPhone,
      reportedUserIds: params.reportedUserIds,
      chatId: params.chatId,
    });
  }

  static async blockUser(
    blockerId: string,
    blockedId: string,
    chatId: string,
  ): Promise<boolean> {
    try {
      await this.BLOCKS_COLLECTION.doc(this.blockKey(blockerId, blockedId)).set({
        blockerId,
        blockedId,
        chatId,
        createdAt: serverTimestamp(),
      });
      return true;
    } catch (err) {
      console.error("Error blocking user:", err);
      Monitoring.captureException(err, {
        area: "moderation",
        action: "blockUser",
      });
      return false;
    }
  }

  static async blockUsers(
    blockerId: string,
    blockedIds: string[],
    chatId: string,
  ): Promise<boolean> {
    const results = await Promise.all(
      blockedIds.map((blockedId) =>
        this.blockUser(blockerId, blockedId, chatId),
      ),
    );
    return results.every(Boolean);
  }

  static async unblockUser(
    blockerId: string,
    blockedId: string,
  ): Promise<boolean> {
    try {
      await this.BLOCKS_COLLECTION.doc(
        this.blockKey(blockerId, blockedId),
      ).delete();
      return true;
    } catch (err) {
      console.error("Error unblocking user:", err);
      Monitoring.captureException(err, {
        area: "moderation",
        action: "unblockUser",
      });
      return false;
    }
  }

  static async isBlocked(
    blockerId: string,
    blockedId: string,
  ): Promise<boolean> {
    const doc = await this.BLOCKS_COLLECTION.doc(
      this.blockKey(blockerId, blockedId),
    ).get();
    return doc.exists();
  }

  static async getDoctorUserIds(): Promise<string[]> {
    const doctors = await UserService.getDoctors();
    return doctors.map((doctor) => doctor.id);
  }

  static async resolveReportedUserIds(
    receiverId: string,
  ): Promise<string[]> {
    if (receiverId === Role.DOCTOR) {
      return this.getDoctorUserIds();
    }
    return [receiverId];
  }

  static async canInteract(
    senderId: string,
    receiverId: string,
    _chatId: string,
  ): Promise<boolean> {
    if (receiverId === Role.DOCTOR) {
      const doctorIds = await this.getDoctorUserIds();
      for (const doctorId of doctorIds) {
        if (await this.isBlocked(doctorId, senderId)) {
          return false;
        }
      }
      return true;
    }

    const blockedByReceiver = await this.isBlocked(receiverId, senderId);
    const blockedBySender = await this.isBlocked(senderId, receiverId);
    return !blockedByReceiver && !blockedBySender;
  }

  static async isChatInputDisabled(
    userId: string,
    receiverId: string,
  ): Promise<boolean> {
    if (receiverId === Role.DOCTOR) {
      const doctorIds = await this.getDoctorUserIds();
      for (const doctorId of doctorIds) {
        if (await this.isBlocked(doctorId, userId)) {
          return true;
        }
      }
      return false;
    }

    const blockedByReceiver = await this.isBlocked(receiverId, userId);
    const blockedBySender = await this.isBlocked(userId, receiverId);
    return blockedByReceiver || blockedBySender;
  }

  static onChatInputDisabledUpdate(
    userId: string,
    receiverId: string,
    callback: (disabled: boolean) => void,
  ): () => void {
    const evaluate = async () => {
      callback(await this.isChatInputDisabled(userId, receiverId));
    };

    void evaluate();

    return this.BLOCKS_COLLECTION.onSnapshot(
      () => {
        void evaluate();
      },
      (error) => {
        console.error("Error in chat input disabled listener:", error);
        Monitoring.captureException(error, {
          area: "moderation",
          action: "onChatInputDisabledUpdate",
        });
        callback(false);
      },
    );
  }

  static onReportsUpdate(
    callback: (reports: ModerationReport[]) => void,
  ): () => void {
    return this.REPORTS_COLLECTION.orderBy("createdAt", "desc")
      .limit(100)
      .onSnapshot(
        (snapshot) => {
          const reports = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              type: data.type as ReportType,
              reason: data.reason as ReportReason,
              details: data.details,
              reporterId: data.reporterId,
              reporterPhone: data.reporterPhone,
              reportedUserId: data.reportedUserId,
              chatId: data.chatId,
              messageId: data.messageId,
              messageText: data.messageText,
              createdAt: data.createdAt?.toDate(),
            };
          });
          callback(reports);
        },
        (error) => {
          console.error("Error in reports listener:", error);
          Monitoring.captureException(error, {
            area: "moderation",
            action: "onReportsUpdate",
          });
        },
      );
  }

  static onBlocksUpdate(callback: (blocks: UserBlock[]) => void): () => void {
    return this.BLOCKS_COLLECTION.orderBy("createdAt", "desc")
      .limit(100)
      .onSnapshot(
        (snapshot) => {
          const blocks = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              blockerId: data.blockerId,
              blockedId: data.blockedId,
              chatId: data.chatId,
              createdAt: data.createdAt?.toDate(),
            };
          });
          callback(blocks);
        },
        (error) => {
          console.error("Error in blocks listener:", error);
          Monitoring.captureException(error, {
            area: "moderation",
            action: "onBlocksUpdate",
          });
        },
      );
  }

  static onChatBlockUpdate(
    userId: string,
    otherUserIds: string[],
    callback: (isBlocked: boolean) => void,
  ): () => void {
    if (otherUserIds.length === 0) {
      callback(false);
      return () => {};
    }

    const keys = new Set<string>();
    otherUserIds.forEach((otherId) => {
      keys.add(this.blockKey(userId, otherId));
      keys.add(this.blockKey(otherId, userId));
    });

    return this.BLOCKS_COLLECTION.onSnapshot(
      (snapshot) => {
        const blocked = snapshot.docs.some((doc) => keys.has(doc.id));
        callback(blocked);
      },
      (error) => {
        console.error("Error in chat block listener:", error);
        Monitoring.captureException(error, {
          area: "moderation",
          action: "onChatBlockUpdate",
        });
        callback(false);
      },
    );
  }
}
