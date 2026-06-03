import {
  LOGIN_DISCLAIMER_TEXT,
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

export const LoginDisclaimer: FC = () => (
  <View style={styles.container}>
    <Text style={styles.text}>
      <Text style={styles.bold}>Disclaimer: </Text>
      {LOGIN_DISCLAIMER_TEXT}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginTop: loginSpacing.stackLg,
    padding: loginSpacing.stackMd,
    backgroundColor: loginColors.surfaceContainer,
    borderRadius: loginRadius.lg,
    borderWidth: 1,
    borderColor: `${loginColors.outlineVariant}4D`,
    width: "100%",
    maxWidth: 480,
  },
  text: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
    lineHeight: 18,
  },
  bold: {
    fontFamily: "Manrope_700Bold",
    color: loginColors.onSurface,
  },
});
