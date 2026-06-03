import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type BookingTextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
  keyboardType?: "default" | "numeric" | "phone-pad";
};

export const BookingTextField: FC<BookingTextFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  maxLength,
  showCount,
  keyboardType = "default",
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={loginColors.outlineVariant}
        maxLength={maxLength}
        keyboardType={keyboardType}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      {showCount && maxLength ? (
        <Text style={styles.count}>
          {value.length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: loginSpacing.stackMd,
  },
  label: {
    ...loginTypography.labelMd,
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackSm,
  },
  required: {
    color: loginColors.error,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: loginColors.outline,
    borderRadius: loginRadius.md,
    backgroundColor: loginColors.surfaceContainerLowest,
    paddingHorizontal: loginSpacing.stackMd,
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
  },
  inputFocused: {
    borderColor: loginColors.primaryContainer,
    borderWidth: 2,
  },
  count: {
    ...loginTypography.labelSm,
    color: loginColors.primary,
    textAlign: "right",
    marginTop: loginSpacing.stackSm,
  },
});
