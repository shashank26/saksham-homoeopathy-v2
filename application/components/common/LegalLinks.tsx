import { LEGAL_URLS } from "@/constants/legal";
import { loginColors, loginTypography } from "@/themes/loginDesign";
import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { Text as TamaguiText } from "@tamagui/core";
import { Href, router } from "expo-router";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { XStack, YStack } from "tamagui";

type LegalLinkItem = {
  label: string;
  route?: Href;
};

const links: LegalLinkItem[] = [
  { label: "Privacy Policy", route: "/legal/privacy" as Href },
  { label: "Terms of Use", route: "/legal/terms" as Href },
  { label: "Contact Us", route: "/legal/contact" as Href },
];

const handleLinkPress = (item: LegalLinkItem) => {
  if (item.route) {
    router.push(item.route);
  }
};

export const LegalLinks: FC<{ compact?: boolean; horizontal?: boolean }> = ({
  compact,
  horizontal = true,
}) => {
  if (horizontal) {
    return (
      <View style={styles.horizontalRow}>
        {links.map((item, _i) => (
          <Pressable key={item.label} onPress={() => handleLinkPress(item)}>
            <XStack alignItems="center" gap={6}>
              <Text style={{ fontSize: 11, color: themeColors.gray }}>
                {item.label}
              </Text>
              {_i < links.length - 1 && (
                <MaterialIcons name="circle" size={6} color={themeColors.gray} />
              )}
            </XStack>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <YStack gap={compact ? "$2" : "$3"} alignItems={compact ? "flex-start" : "center"}>
      {links.map((item) => (
        <Pressable key={item.label} onPress={() => handleLinkPress(item)}>
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
