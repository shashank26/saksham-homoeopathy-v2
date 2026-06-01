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
    "https://sakshamhomoeopathy.com/privacy-policy",
  terms: legalExtra.termsUrl ?? "https://sakshamhomoeopathy.com/terms",
  feedback:
    legalExtra.feedbackUrl ??
    "mailto:support@sakshamhomoeopathy.com?subject=Saksham%20Homoeopathy%20App%20Feedback",
  supportEmail: legalExtra.supportEmail ?? "support@sakshamhomoeopathy.com",
};

export const HEALTH_DISCLAIMER =
  "This app supports appointment booking and communication with Saksham Homoeopathy. It does not provide emergency care or replace an in-person medical consultation. For emergencies, call local emergency services or visit the nearest hospital.";
