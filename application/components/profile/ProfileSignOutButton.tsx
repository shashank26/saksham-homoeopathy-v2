import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ProfileSignOutButtonProps = {
  onPress: () => void;
  disabled?: boolean;
};

export const ProfileSignOutButton: FC<ProfileSignOutButtonProps> = ({
  onPress,
  disabled,
}) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={styles.pressable}
  >
    {({ pressed }) => (
      <View
        style={[
          styles.button,
          disabled && styles.buttonDisabled,
          pressed && !disabled && styles.buttonPressed,
        ]}
      >
        <Text style={styles.label}>Sign out</Text>
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
    minHeight: 48,
    borderRadius: loginRadius.md,
    borderWidth: 1,
    borderColor: loginColors.outline,
    backgroundColor: loginColors.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: loginSpacing.stackMd,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    backgroundColor: loginColors.surfaceContainerLow,
  },
  label: {
    ...loginTypography.labelMd,
    color: loginColors.onSurface,
  },
});
