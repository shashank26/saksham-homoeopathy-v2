import {
  loginColors,
  loginRadius,
  loginShadow,
  loginSpacing,
} from "@/themes/loginDesign";
import { FC, PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export const ProfileDetailsCard: FC<PropsWithChildren> = ({ children }) => (
  <View style={styles.card}>{children}</View>
);

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: loginColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    borderRadius: loginRadius.lg,
    padding: loginSpacing.stackLg,
    ...loginShadow.card,
  },
});
