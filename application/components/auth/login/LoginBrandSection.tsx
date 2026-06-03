import { Logo } from "@/components/Images";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

export const LoginBrandSection: FC = () => (
  <View style={styles.container}>
    <Logo width={96} height={96} style={styles.logo} />
    <Text style={styles.headline}>Welcome to Saksham</Text>
    <Text style={styles.tagline}>Clinical homoeopathy at your fingertips.</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginBottom: loginSpacing.stackLg,
  },
  logo: {
    borderRadius: loginSpacing.stackMd,
    marginBottom: loginSpacing.stackMd,
  },
  headline: {
    ...loginTypography.headlineLgMobile,
    color: loginColors.onBackground,
    textAlign: "center",
  },
  tagline: {
    ...loginTypography.bodyMd,
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
    marginTop: loginSpacing.stackSm,
  },
});
