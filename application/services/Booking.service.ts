import { db } from "./Firebase.service";

export type SlotTime =
  | "11:30"
  | "11:45"
  | "12:00"
  | "12:15"
  | "12:30"
  | "12:45";

export type BookingType = {
  phoneNumber: string;
  date: Date;
  slot: SlotTime;
  id?: string; // Optional ID for the booking
};

export class BookingService {
  private static BOOKING_COLLECTION = db.collection("bookings");

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
      );
    } else {
      collectionRef = this.BOOKING_COLLECTION;
    }
    const unsub = collectionRef.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const data = change.doc.data();
          const newBooking: BookingType = {
            phoneNumber: data.phoneNumber,
            date: data.date.toDate(),
            slot: data.slot as SlotTime,
            id: change.doc.id, // Include the document ID
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
      const res = await this.BOOKING_COLLECTION.add({
        phoneNumber: booking.phoneNumber,
        date: booking.date,
        slot: booking.slot,
      });
      return res;
    } catch (err) {
      console.error("Error adding booking:", err);
      return null;
    }
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
}
