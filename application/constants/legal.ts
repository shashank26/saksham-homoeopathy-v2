import Constants from "expo-constants";

type LegalExtra = {
  privacyPolicyUrl?: string;
  termsUrl?: string;
  feedbackUrl?: string;
  supportEmail?: string;
};

const legalExtra = (Constants.expoConfig?.extra?.legal ?? {}) as LegalExtra;

export const LEGAL_URLS = {
  privacyPolicy:
    legalExtra.privacyPolicyUrl ??
    "https://shashank26.github.io/saksham-homoeopathy-v2/",
  terms: legalExtra.termsUrl ?? "https://shashank26.github.io/saksham-homoeopathy-v2/terms.html",
  feedback:
    legalExtra.feedbackUrl ??
    "mailto:arniparth@gmail.com?subject=Saksham%20Homoeopathy%20App%20Feedback",
  supportEmail: legalExtra.supportEmail ?? "arniparth@gmail.com",
};

export const HEALTH_DISCLAIMER =
  "This app supports appointment booking and communication with Saksham Homoeopathy. It does not provide emergency care or replace an in-person medical consultation. For emergencies, call local emergency services or visit the nearest hospital.";
