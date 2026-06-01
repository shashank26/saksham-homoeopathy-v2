import { LEGAL_URLS } from "@/constants/legal";
import { themeColors } from "@/themes/themes";
import { openExternalUrl } from "@/utils/openUrl";
import { Text } from "@tamagui/core";
import { FC } from "react";
import { Pressable } from "react-native";
import { YStack } from "tamagui";

type LegalLinkItem = {
  label: string;
  url: string;
};

const links: LegalLinkItem[] = [
  { label: "Privacy policy", url: LEGAL_URLS.privacyPolicy },
  { label: "Terms of use", url: LEGAL_URLS.terms },
  { label: "Send feedback", url: LEGAL_URLS.feedback },
];

export const LegalLinks: FC<{ compact?: boolean }> = ({ compact }) => (
  <YStack gap={compact ? "$2" : "$3"} alignItems={compact ? "flex-start" : "center"}>
    {links.map((item) => (
      <Pressable key={item.label} onPress={() => openExternalUrl(item.url)}>
        <Text
          fontFamily="$js4"
          fontSize={compact ? "$3" : "$4"}
          color={themeColors.accent}
          textDecorationLine="underline"
        >
          {item.label}
        </Text>
      </Pressable>
    ))}
  </YStack>
);
