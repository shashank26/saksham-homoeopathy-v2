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

type LoginPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: string;
  style?: ViewStyle;
};

export const LoginPrimaryButton: FC<LoginPrimaryButtonProps> = ({
  label,
  onPress,
  disabled,
  loading,
  loadingLabel,
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
          <View style={styles.loadingRow}>
            <ActivityIndicator color={loginColors.onPrimary} size="small" />
            <Text style={styles.label}>{loadingLabel ?? label}</Text>
          </View>
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
    marginTop: loginSpacing.stackMd,
  },
  button: {
    width: "100%",
    minHeight: 52,
    backgroundColor: loginColors.primaryContainer,
    borderRadius: loginRadius.md,
    paddingVertical: loginSpacing.stackMd,
    alignItems: "center",
    justifyContent: "center",
    ...loginShadow.button,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    backgroundColor: loginColors.onPrimaryFixedVariant,
    transform: [{ scale: 0.98 }],
  },
  label: {
    ...loginTypography.labelMd,
    color: loginColors.onPrimary,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: loginSpacing.stackSm,
  },
});
