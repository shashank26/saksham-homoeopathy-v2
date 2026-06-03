import { LEGAL_URLS } from "@/constants/legal";
import { loginColors, loginTypography } from "@/themes/loginDesign";
import { themeColors } from "@/themes/themes";
import { openExternalUrl } from "@/utils/openUrl";
import { MaterialIcons } from "@expo/vector-icons";
import { Text as TamaguiText } from "@tamagui/core";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { XStack, YStack } from "tamagui";

type LegalLinkItem = {
  label: string;
  url: string;
};

const links: LegalLinkItem[] = [
  { label: "Privacy Policy", url: LEGAL_URLS.privacyPolicy },
  { label: "Terms of Use", url: LEGAL_URLS.terms },
  { label: "Send Feedback", url: LEGAL_URLS.feedback },
];

export const LegalLinks: FC<{ compact?: boolean; horizontal?: boolean }> = ({
  compact,
  horizontal = true,
}) => {
  if (horizontal) {
    return (
      <View style={styles.horizontalRow}>
        {links.map((item, _i) => (
          <Pressable key={item.label} onPress={() => openExternalUrl(item.url)}>
            <XStack alignItems="center" gap={6}>
              <Text style={styles.horizontalLink}>{item.label}</Text>
              {_i < links.length - 1 && <MaterialIcons name="circle" size={6} color={loginColors.onSurfaceVariant} />}
            </XStack>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <YStack gap={compact ? "$2" : "$3"} alignItems={compact ? "flex-start" : "center"}>
      {links.map((item) => (
        <Pressable key={item.label} onPress={() => openExternalUrl(item.url)}>
          <TamaguiText
            fontFamily="$js4"
            fontSize={compact ? "$3" : "$4"}
            color={themeColors.accent}
            textDecorationLine="underline"
          >
            {item.label}
          </TamaguiText>
        </Pressable>
      ))}
    </YStack>
  );
};

const styles = StyleSheet.create({
  horizontalRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  horizontalLink: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
  },
});
