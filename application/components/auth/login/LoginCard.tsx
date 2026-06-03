import {
  loginColors,
  loginRadius,
  loginShadow,
  loginSpacing,
} from "@/themes/loginDesign";
import { FC, PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export const LoginCard: FC<PropsWithChildren> = ({ children }) => (
  <View style={styles.card}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 480,
    backgroundColor: loginColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    borderRadius: loginRadius.xl,
    padding: loginSpacing.stackLg,
    ...loginShadow.card,
  },
});
