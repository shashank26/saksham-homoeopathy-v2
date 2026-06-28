import { LegalWebViewScreen } from "@/components/legal/LegalWebViewScreen";
import { LEGAL_URLS } from "@/constants/legal";

export default function TermsRoute() {
  return <LegalWebViewScreen title="Terms of Use" url={LEGAL_URLS.terms} />;
}
