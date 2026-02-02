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
      if (hours > slotHours || (hours === slotHours && minutes >= slotMinutes)) {
        return true;
      }
    }
    return false;
  }
}
