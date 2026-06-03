import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

type ProfilePhoneRowProps = {
  phoneNumber?: string;
};

export const ProfilePhoneRow: FC<ProfilePhoneRowProps> = ({ phoneNumber }) => (
  <View style={styles.container}>
    <Text style={styles.label}>Phone number</Text>
    <Text style={styles.value}>{phoneNumber ?? "—"}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginBottom: loginSpacing.stackMd,
  },
  label: {
    ...loginTypography.labelMd,
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackSm,
  },
  value: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
  },
});
