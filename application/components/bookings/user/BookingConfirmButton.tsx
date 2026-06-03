import {
  loginColors,
  loginRadius,
  loginShadow,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type BookingConfirmButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

export const BookingConfirmButton: FC<BookingConfirmButtonProps> = ({
  label,
  onPress,
  disabled,
  loading,
  style,
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || loading}
    style={[styles.pressable, style]}
  >
    {({ pressed }) => (
      <View
        style={[
          styles.button,
          (disabled || loading) && styles.buttonDisabled,
          pressed && !disabled && !loading && styles.buttonPressed,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={loginColors.onPrimary} size="small" />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </View>
    )}
  </Pressable>
);

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    marginTop: loginSpacing.sectionGap,
  },
  button: {
    width: "100%",
    minHeight: 52,
    backgroundColor: loginColors.primaryContainer,
    borderRadius: loginRadius.lg,
    paddingVertical: loginSpacing.stackMd,
    alignItems: "center",
    justifyContent: "center",
    ...loginShadow.button,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  label: {
    ...loginTypography.labelMd,
    fontFamily: "Manrope_600SemiBold",
    color: loginColors.onPrimary,
  },
});
