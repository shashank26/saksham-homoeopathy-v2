import { YStack } from "tamagui";
import { HealthDisclaimer } from "../common/HealthDisclaimer";
import { LegalLinks } from "../common/LegalLinks";
import { StaticData } from "../common/StaticData";

export const AboutUs: React.FC = () => {
  return (
    <YStack flex={1} gap="$4">
      <StaticData docId="about-us" />
      <YStack padding="$4" gap="$3">
        <HealthDisclaimer />
        <LegalLinks compact />
      </YStack>
    </YStack>
  );
};
