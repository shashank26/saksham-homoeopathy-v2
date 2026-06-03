import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type VitalityOverlayButtonVariant = "primary" | "outlined" | "destructive";

type VitalityOverlayButtonProps = {
  label: string;
  onPress: () => void;
  variant?: VitalityOverlayButtonVariant;
};

export const VitalityOverlayButton: FC<VitalityOverlayButtonProps> = ({
  label,
  onPress,
  variant = "primary",
}) => (
  <Pressable onPress={onPress} style={styles.pressable}>
    {({ pressed }) => (
      <View
        style={[
          styles.button,
          variant === "primary" && styles.primary,
          variant === "outlined" && styles.outlined,
          variant === "destructive" && styles.destructive,
          pressed && styles.pressed,
        ]}
      >
        <Text
          style={[
            styles.label,
            variant === "primary" && styles.labelPrimary,
            variant === "outlined" && styles.labelOutlined,
            variant === "destructive" && styles.labelDestructive,
          ]}
        >
          {label}
        </Text>
      </View>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    marginHorizontal: loginSpacing.stackSm / 2,
  },
  button: {
    minHeight: 44,
    borderRadius: loginRadius.md,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: loginSpacing.stackMd,
    paddingHorizontal: loginSpacing.stackMd,
  },
  primary: {
    backgroundColor: loginColors.primary,
  },
  outlined: {
    backgroundColor: loginColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: loginColors.outline,
  },
  destructive: {
    backgroundColor: loginColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: loginColors.error,
  },
  pressed: {
    opacity: 0.9,
  },
  label: {
    ...loginTypography.labelMd,
  },
  labelPrimary: {
    color: loginColors.onPrimary,
  },
  labelOutlined: {
    color: loginColors.onSurface,
  },
  labelDestructive: {
    color: loginColors.error,
  },
});
