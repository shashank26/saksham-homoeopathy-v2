import { SlotTime } from "./Booking.service";

export class MomentService {
  static timeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return `${interval} years ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return `${interval} months ago`;
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return `${interval} days ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 24 && interval < 48) return `A day ago`;
    if (interval > 1) return `${interval} hours ago`;
    interval = Math.floor(seconds / 60);
    if (interval > 1) return `${interval} minutes ago`;
    return `${Math.floor(seconds)} seconds ago`;
  }

  static getTimeHHMM(date: Date): string {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  static getDDMMMYYY(date: Date): string {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  static isSlotExpired(date: Date, slot: SlotTime): boolean {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const [slotHours, slotMinutes] = slot.split(":").map(Number);
    if (date.toDateString() === new Date().toDateString()) {
      if (
        hours > slotHours ||
        (hours === slotHours && minutes >= slotMinutes)
      ) {
        return true;
      }
    }
    return false;
  }

  static formatTimeMeridian(date: Date): string {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const diffTime = today.getTime() - dateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    // If today, return HH:MM
    if (diffDays === 0) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    }

    // If yesterday
    if (diffDays === 1) {
      return "Yesterday";
    }

    // If within last 6 days, return weekday name
    if (diffDays <= 6) {
      return date.toLocaleString("default", { weekday: "long" });
    }

    // If older than 6 days, return DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  static getDateWithoutTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  static dateDiffInMs(date1: Date, date2: Date): number {
    const d1 = this.getDateWithoutTime(date1);
    const d2 = this.getDateWithoutTime(date2);
    return d1.getTime() - d2.getTime();
  }
}
