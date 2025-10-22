import { db } from "./Firebase.service";
import { NotificationService } from "./Notification.service";

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

export type BookingType = {
  phoneNumber: string;
  date: Date;
  slot: SlotTime;
  id?: string; // Optional ID for the booking
  cancelled?: boolean;
  person: {
    name: string;
    age: string;
    sex: string;
  };
};

export class BookingService {
  private static BOOKING_COLLECTION = db.collection("bookings");

  private static BOOKING_META_COLLECTION = db.collection("booking_meta");

  private static BLOCKED_BOOKINGS = db.collection("blocked_bookings");

  private static bookingHash = new Map<string, BookingType>();

  static onBookingUpdate(
    callback: (bookings: BookingType[]) => void,
    phoneNumber?: string
  ) {
    let collectionRef;
    if (phoneNumber) {
      collectionRef = this.BOOKING_COLLECTION.where(
        "phoneNumber",
        "==",
        phoneNumber
      ).where("date", ">=", new Date());
    } else {
      collectionRef = this.BOOKING_COLLECTION;
    }
    const unsub = collectionRef.onSnapshot((snapshot) => {
      snapshot?.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const data = change.doc.data();
          const newBooking: BookingType = {
            phoneNumber: data.phoneNumber,
            date: data.date.toDate(),
            slot: data.slot as SlotTime,
            id: change.doc.id, // Include the document ID
            cancelled: data.cancelled || false,
            person: {
              name: data.person?.name,
              age: data.person?.age,
              sex: data.person?.sex,
            },
          };
          this.bookingHash.set(change.doc.id, newBooking);
        } else if (change.type === "removed") {
          this.bookingHash.delete(change.doc.id);
        }
      });
      callback(Array.from(this.bookingHash.values()));
    });
    return unsub;
  }

  static async addBooking(booking: BookingType) {
    try {
      const isAvailable = await this.isSlotAvailable(
        booking.date,
        booking.slot
      );
      if (!isAvailable) {
        console.warn("Slot is not available");
        return null;
      }
      const res = await this.BOOKING_COLLECTION.add({
        phoneNumber: booking.phoneNumber,
        date: booking.date,
        slot: booking.slot,
        person: {
          ...booking.person,
        },
      });
      return res;
    } catch (err) {
      console.error("Error adding booking:", err);
      return null;
    }
  }
  static isSlotAvailable(date: Date, slot: string) {
    return this.BOOKING_COLLECTION.where("date", "==", date)
      .where("slot", "==", slot)
      .get()
      .then((querySnapshot) => {
        return querySnapshot.empty;
      })
      .catch((error) => {
        console.error("Error checking slot availability: ", error);
        return false;
      });
  }

  static async deleteBooking(id: string) {
    try {
      await this.BOOKING_COLLECTION.doc(id).delete();
      return true;
    } catch (err) {
      console.error("Error deleting booking:", err);
      return false;
    }
  }

  static async cancelBooking(booking: BookingType) {
    try {
      await this.BOOKING_COLLECTION.doc(booking.id).update({ cancelled: true });
      await NotificationService.addNotification(
        booking.phoneNumber,
        `Your booking has been cancelled for ${booking.date.toLocaleDateString()} at ${
          booking.slot
        }.`
      );
      return true;
    } catch (err) {
      console.error("Error cancelling booking:", err);
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

  static async getBlockedSlots(date: Date): Promise<SlotTime[]> {
    const doc = await this.BLOCKED_BOOKINGS.doc(date.toDateString()).get();
    const data = doc.data();
    const blockedSlots: SlotTime[] = data?.slots || [];
    return blockedSlots;
  }

  static getBlockedSlotsUpdate(
    date: Date,
    cb: (slots: SlotTime[]) => void
  ): () => void {
    const unsub = this.BLOCKED_BOOKINGS.doc(date.toDateString()).onSnapshot(
      (doc) => {
        const data = doc.data();
        const blockedSlots: SlotTime[] = data?.slots || [];
        cb(blockedSlots);
      }
    );
    return unsub;
  }

  static async blockBooking(date: Date, slots: SlotTime[]) {
    this.BLOCKED_BOOKINGS.doc(date.toDateString()).set({
      slots: slots,
    });
  }

  static async unblockBooking(date: Date, slots: SlotTime[]) {
    const doc = await this.BLOCKED_BOOKINGS.doc(date.toDateString()).get();
    const data = doc.data();
    const blockedSlots: SlotTime[] = data?.slots || [];
    const updatedSlots = blockedSlots.filter((s) => !slots.includes(s));
    this.BLOCKED_BOOKINGS.doc(date.toDateString()).set({
      slots: updatedSlots,
    });
  }
}
