import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

type PostContentFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  label?: string;
  placeholder?: string;
};

export const PostContentField: FC<PostContentFieldProps> = ({
  value,
  onChangeText,
  maxLength = 500,
  label = "Content",
  placeholder = "Share your clinical observations or remedy insights...",
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, focused && styles.inputFocused]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={loginColors.outlineVariant}
        maxLength={maxLength}
        multiline
        textAlignVertical="top"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <Text style={styles.count}>
        {value.length}/{maxLength}
      </Text>
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
  input: {
    minHeight: 144,
    borderWidth: 1,
    borderColor: loginColors.outline,
    borderRadius: loginRadius.md,
    backgroundColor: loginColors.surfaceContainerLowest,
    paddingHorizontal: loginSpacing.stackMd,
    paddingVertical: loginSpacing.stackMd,
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
