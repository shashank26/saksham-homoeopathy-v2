import { LegalLinks } from "@/components/common/LegalLinks";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const LoginFooter: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: Math.max(insets.bottom, loginSpacing.stackMd),
          borderTopColor: loginColors.outlineVariant,
        },
      ]}
    >
      <Text style={styles.copyright}>
        © 2024 Saksham Homoeopathy. For clinical guidance only.
      </Text>
      <LegalLinks horizontal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: "auto",
    paddingTop: loginSpacing.stackMd,
    paddingHorizontal: loginSpacing.containerMargin,
    backgroundColor: loginColors.surfaceContainerLow,
    borderTopWidth: 1,
    alignItems: "center",
    gap: loginSpacing.stackSm,
  },
  copyright: {
    ...loginTypography.labelMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
    textAlign: "center",
  },
});
