import { Monitoring } from "@/services/Monitoring.service";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { db } from "./Firebase.service";
import { NotificationService } from "./Notification.service";
import { MomentService } from "./Moment.service";

export type SlotTime =
  | "11:30"
  | "11:45"
  | "12:00"
  | "12:15"
  | "12:30"
  | "12:45";

export const slots: { label: string; value: SlotTime }[] = [
  { label: "11.30 AM", value: "11:30" },
  { label: "11.45 PM", value: "11:45" },
  { label: "12.00 PM", value: "12:00" },
  { label: "12.15 PM", value: "12:15" },
  { label: "12.30 PM", value: "12:30" },
  { label: "12.45 PM", value: "12:45" },
];

export type BookingSlotStatus = "booked" | "cancelled" | "blocked";

export type SlotStatusMap = Partial<Record<SlotTime, BookingSlotStatus>>;

export type BookingType = {
  phoneNumber: string;
  date: Date;
  slot: SlotTime;
  id?: string;
  cancelled?: boolean;
  status?: BookingSlotStatus;
  person: {
    name: string;
    age: string;
    sex: string;
  };
};

export class BookingService {
  private static SLOT_COLLECTION = db.collection("booking_slots");

  private static BOOKING_META_COLLECTION = db.collection("booking_meta");

  private static slotHash = new Map<string, BookingType>();

  static formatSlotKey(date: Date, slot: SlotTime): string {
    const normalizedDate = MomentService.getDateWithoutTime(date);
    return `${MomentService.formatDateKey(normalizedDate)}_${slot}`;
  }

  static isSlotSelectable(status: BookingSlotStatus | undefined): boolean {
    return !status || status === "cancelled";
  }

  static isSlotUnavailable(status: BookingSlotStatus | undefined): boolean {
    return status === "booked" || status === "blocked";
  }

  private static mapSlotDoc(
    id: string,
    data: FirebaseFirestoreTypes.DocumentData,
  ): BookingType {
    const status = data.status as BookingSlotStatus;
    return {
      id,
      phoneNumber: data.phoneNumber ?? "",
      date: data.date.toDate(),
      slot: data.slot as SlotTime,
      status,
      cancelled: status === "cancelled",
      person: data.person ?? { name: "", age: "", sex: "other" },
    };
  }

  private static buildSlotStatusMap(
    docs: FirebaseFirestoreTypes.QueryDocumentSnapshot[],
  ): SlotStatusMap {
    const map: SlotStatusMap = {};
    docs.forEach((doc) => {
      const slot = doc.data().slot as SlotTime;
      map[slot] = doc.data().status as BookingSlotStatus;
    });
    return map;
  }

  static getSlotsForDateUpdate(
    date: Date,
    cb: (statusBySlot: SlotStatusMap) => void,
  ): () => void {
    const normalizedDate = MomentService.getDateWithoutTime(date);
    return this.SLOT_COLLECTION.where("date", "==", normalizedDate).onSnapshot(
      (snapshot) => {
        cb(this.buildSlotStatusMap(snapshot.docs));
      },
      (error) => {
        console.error("Error in slots for date listener:", error);
        Monitoring.captureException(error, {
          area: "booking",
          action: "getSlotsForDateUpdate",
        });
        cb({});
      },
    );
  }

  static onBookingUpdate(
    callback: (bookings: BookingType[]) => void,
    phoneNumber?: string,
  ) {
    let collectionRef: FirebaseFirestoreTypes.Query =
      this.SLOT_COLLECTION.where("status", "==", "booked");

    if (phoneNumber) {
      collectionRef = collectionRef
        .where("phoneNumber", "==", phoneNumber)
        .where("date", ">=", MomentService.getDateWithoutTime(new Date()));
    }

    const unsub = collectionRef.onSnapshot(
      (snapshot) => {
        snapshot?.docChanges().forEach((change) => {
          if (change.type === "added" || change.type === "modified") {
            const booking = this.mapSlotDoc(change.doc.id, change.doc.data());
            this.slotHash.set(change.doc.id, booking);
          } else if (change.type === "removed") {
            this.slotHash.delete(change.doc.id);
          }
        });
        callback(Array.from(this.slotHash.values()));
      },
      (error) => {
        console.error("Error in booking update listener:", error);
        Monitoring.captureException(error, {
          area: "booking",
          action: "onBookingUpdate",
        });
      },
    );
    return unsub;
  }

  static async addBooking(booking: BookingType) {
    const normalizedDate = MomentService.getDateWithoutTime(booking.date);
    const slotKey = this.formatSlotKey(normalizedDate, booking.slot);
    const slotRef = this.SLOT_COLLECTION.doc(slotKey);

    try {
      await db.runTransaction(async (transaction) => {
        const existing = await transaction.get(slotRef);
        const status = existing.data()?.status as BookingSlotStatus | undefined;

        if (existing.exists() && this.isSlotUnavailable(status)) {
          throw new Error("SLOT_UNAVAILABLE");
        }

        transaction.set(slotRef, {
          phoneNumber: booking.phoneNumber,
          date: normalizedDate,
          slot: booking.slot,
          status: "booked" satisfies BookingSlotStatus,
          person: {
            ...booking.person,
          },
        });
      });

      return slotRef;
    } catch (err) {
      if (err instanceof Error && err.message === "SLOT_UNAVAILABLE") {
        console.warn("Slot is not available");
        return null;
      }
      console.error("Error adding booking:", err);
      Monitoring.captureException(err, { area: "booking", action: "addBooking" });
      return null;
    }
  }

  static async deleteBooking(id: string) {
    try {
      await this.SLOT_COLLECTION.doc(id).delete();
      return true;
    } catch (err) {
      console.error("Error deleting booking:", err);
      Monitoring.captureException(err, {
        area: "booking",
        action: "deleteBooking",
      });
      return false;
    }
  }

  static async cancelBooking(booking: BookingType) {
    if (!booking.id) {
      return false;
    }

    try {
      await this.SLOT_COLLECTION.doc(booking.id).update({
        status: "cancelled" satisfies BookingSlotStatus,
      });
      await NotificationService.addNotification(
        booking.phoneNumber,
        `Your booking has been cancelled for ${booking.date.toLocaleDateString()} at ${
          booking.slot
        }.`,
      );
      return true;
    } catch (err) {
      console.error("Error cancelling booking:", err);
      Monitoring.captureException(err, {
        area: "booking",
        action: "cancelBooking",
      });
      return false;
    }
  }

  static async getDefaultSlots(): Promise<
    { label: string; value: SlotTime }[]
  > {
    const doc = await this.BOOKING_META_COLLECTION.doc("slot_info").get();
    const data = doc.data();
    if (!data) return [];
    return data.slots as { label: string; value: SlotTime }[];
  }

  static async blockBooking(date: Date, slotsToBlock: SlotTime[]) {
    const normalizedDate = MomentService.getDateWithoutTime(date);
    await Promise.all(
      slotsToBlock.map((slot) => {
        const slotKey = this.formatSlotKey(normalizedDate, slot);
        return this.SLOT_COLLECTION.doc(slotKey).set({
          date: normalizedDate,
          slot,
          status: "blocked" satisfies BookingSlotStatus,
        });
      }),
    );
  }

  static async unblockBooking(date: Date, slotsToUnblock: SlotTime[]) {
    const normalizedDate = MomentService.getDateWithoutTime(date);
    await Promise.all(
      slotsToUnblock.map(async (slot) => {
        const slotKey = this.formatSlotKey(normalizedDate, slot);
        const doc = await this.SLOT_COLLECTION.doc(slotKey).get();
        if (doc.exists() && doc.data()?.status === "blocked") {
          await this.SLOT_COLLECTION.doc(slotKey).delete();
        }
      }),
    );
  }
}
