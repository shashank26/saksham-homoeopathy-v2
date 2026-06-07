export type ReportReason = "harassment" | "spam" | "inappropriate" | "other";

export const REPORT_REASON_OPTIONS: { label: string; value: ReportReason }[] = [
  { label: "Harassment", value: "harassment" },
  { label: "Spam", value: "spam" },
  { label: "Inappropriate Content", value: "inappropriate" },
  { label: "Other", value: "other" },
];
