import { loginColors, loginSpacing } from "@/themes/loginDesign";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

export const LoginSectionDivider: FC = () => (
  <View style={styles.container}>
    <View style={styles.line} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    marginVertical: loginSpacing.stackMd,
  },
  line: {
    height: 1,
    backgroundColor: loginColors.outlineVariant,
    width: "100%",
  },
});
