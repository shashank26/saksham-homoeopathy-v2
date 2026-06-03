import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type VitalityDrawerHeaderProps = {
  title: string;
  onClose: () => void;
};

export const VitalityDrawerHeader: FC<VitalityDrawerHeaderProps> = ({
  title,
  onClose,
}) => (
  <View style={styles.row}>
    <Text style={styles.title}>{title}</Text>
    <Pressable onPress={onClose} accessibilityRole="button">
      {({ pressed }) => (
        <View style={[styles.closeBtn, pressed && styles.closePressed]}>
          <Ionicons
            name="close"
            size={24}
            color={loginColors.onSurfaceVariant}
          />
        </View>
      )}
    </Pressable>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: loginSpacing.containerMargin,
    paddingVertical: loginSpacing.stackMd,
  },
  title: {
    ...loginTypography.headlineLgMobile,
    color: loginColors.onSurface,
  },
  closeBtn: {
    padding: 8,
    borderRadius: 999,
  },
  closePressed: {
    backgroundColor: loginColors.surfaceContainerHigh,
  },
});
