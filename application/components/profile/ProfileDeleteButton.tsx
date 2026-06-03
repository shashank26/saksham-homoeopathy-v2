import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

type ProfileDeleteButtonProps = {
  onDelete: () => Promise<void>;
  disabled?: boolean;
};

export const ProfileDeleteButton: FC<ProfileDeleteButtonProps> = ({
  onDelete,
  disabled,
}) => {
  const handlePress = () => {
    Alert.alert(
      "Delete account",
      "This permanently deletes your profile, bookings, chat history, and medicine records from our systems. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            void onDelete();
          },
        },
      ],
    );
  };

  return (
    <Pressable
      onPress={handlePress}
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
          <Text style={styles.label}>Delete account</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  pressable: {
    width: "100%",
    marginTop: loginSpacing.stackSm,
  },
  button: {
    width: "100%",
    minHeight: 48,
    borderRadius: loginRadius.md,
    borderWidth: 1,
    borderColor: loginColors.error,
    backgroundColor: loginColors.surfaceContainerLowest,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: loginSpacing.stackMd,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    backgroundColor: "rgba(186, 26, 26, 0.08)",
  },
  label: {
    ...loginTypography.labelMd,
    color: loginColors.error,
  },
});
