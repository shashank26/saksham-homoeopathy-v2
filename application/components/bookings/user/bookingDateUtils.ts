import { slots, SlotTime } from "@/services/Booking.service";
import { MomentService } from "@/services/Moment.service";

export function getLatestSlotTime(): SlotTime {
  return slots[slots.length - 1].value;
}

export function isTodayPastLatestSlot(): boolean {
  const latest = getLatestSlotTime();
  const [slotHours, slotMinutes] = latest.split(":").map(Number);
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  return hours > slotHours || (hours === slotHours && minutes >= slotMinutes);
}

export function getBookingDateRange(): Date[] {
  const today = MomentService.getDateWithoutTime(new Date());
  const maxDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  let start = new Date(today);
  if (isTodayPastLatestSlot()) {
    start.setDate(start.getDate() + 1);
  }
  const days: Date[] = [];
  const current = new Date(start);
  while (current.getTime() <= maxDate.getTime()) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export function getAdminBookingDateRange(): Date[] {
  const today = MomentService.getDateWithoutTime(new Date());
  const maxDate = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
  const days: Date[] = [];
  const current = new Date(today);
  while (current.getTime() <= maxDate.getTime()) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return days;
}

export function getDefaultAdminBookingDate(): Date {
  const range = getAdminBookingDateRange();
  return range[0] ?? MomentService.getDateWithoutTime(new Date());
}

export function getDefaultBookingDate(): Date {
  const range = getBookingDateRange();
  return range[0] ?? MomentService.getDateWithoutTime(new Date());
}

export function isDateInBookingRange(date: Date): boolean {
  return getBookingDateRange().some((d) => isSameCalendarDay(d, date));
}

export function formatWeekdayShort(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function formatDayNumber(date: Date): string {
  return String(date.getDate());
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return MomentService.getDDMMMYYY(a) === MomentService.getDDMMMYYY(b);
}
