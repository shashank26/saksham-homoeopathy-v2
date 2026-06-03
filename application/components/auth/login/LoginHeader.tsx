import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const LoginHeader: FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          borderBottomColor: loginColors.outlineVariant,
        },
      ]}
    >
      <View style={styles.inner}>
        <MaterialIcons
          name="medical-services"
          size={24}
          color={loginColors.primary}
        />
        <Text style={styles.title}>Saksham Homoeopathy</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: loginColors.surfaceContainerLowest,
    borderBottomWidth: 1,
    width: "100%",
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: loginSpacing.stackSm,
    height: 56,
    paddingHorizontal: loginSpacing.gutter,
  },
  title: {
    ...loginTypography.headlineMd,
    fontSize: 18,
    color: loginColors.primary,
  },
});
