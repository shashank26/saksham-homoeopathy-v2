import { UserProfile } from "@/services/Auth.service";
import { Role } from "@/services/Firebase.service";

export function hasCustomDisplayName(
  user: Pick<UserProfile, "displayName" | "phoneNumber">,
): boolean {
  const name = user.displayName?.trim();
  if (!name) return false;
  if (name === user.phoneNumber) return false;
  return true;
}

export function isStaffUser(user: Pick<UserProfile, "role"> | undefined): boolean {
  return user?.role === Role.DOCTOR || user?.role === Role.ADMIN;
}

export function getStaffDisplayLabel(
  user: Pick<UserProfile, "displayName" | "phoneNumber" | "role"> | undefined,
): string {
  if (!user) return "Unknown";
  if (hasCustomDisplayName(user)) return user.displayName.trim();
  return user.phoneNumber || "Unknown";
}

export function getAggregateStaffDisplayName(
  staff: Pick<UserProfile, "displayName" | "phoneNumber">[],
  fallback = "Doctor",
): string {
  const named = staff.find((member) => hasCustomDisplayName(member));
  if (named) return named.displayName.trim();

  const withDisplayName = staff.find((member) => member.displayName?.trim());
  if (withDisplayName) return withDisplayName.displayName.trim();

  return fallback;
}
