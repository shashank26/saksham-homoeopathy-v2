import { LegalWebViewScreen } from "@/components/legal/LegalWebViewScreen";
import { LEGAL_URLS } from "@/constants/legal";

export default function PrivacyRoute() {
  return (
    <LegalWebViewScreen title="Privacy Policy" url={LEGAL_URLS.privacyPolicy} />
  );
}
