import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC, useEffect, useRef } from "react";
import {
  NativeSyntheticEvent,
  Platform,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

const OTP_LENGTH = 6;

type OtpInputRowProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  autoFocus?: boolean;
};

export const OtpInputRow: FC<OtpInputRowProps> = ({
  value,
  onChange,
  disabled,
  autoFocus,
}) => {
  const inputsRef = useRef<(TextInput | null)[]>([]);
  const autofillRef = useRef<TextInput | null>(null);
  const digits = value.padEnd(OTP_LENGTH, " ").slice(0, OTP_LENGTH).split("");

  useEffect(() => {
    if (autoFocus) {
      autofillRef.current?.focus();
    }
  }, [autoFocus]);

  const applyOtp = (text: string) => {
    const filtered = text.replace(/[^0-9]/g, "").slice(0, OTP_LENGTH);
    onChange(filtered);
  };

  const updateDigit = (index: number, digit: string) => {
    const next = [...digits];
    next[index] = digit;
    applyOtp(next.join("").replace(/\s/g, ""));
  };

  const handleChange = (index: number, text: string) => {
    const filtered = text.replace(/[^0-9]/g, "");
    if (filtered.length > 1) {
      applyOtp(filtered);
      if (filtered.length >= OTP_LENGTH) {
        inputsRef.current[OTP_LENGTH - 1]?.blur();
      }
      return;
    }
    if (!filtered) {
      updateDigit(index, "");
      return;
    }
    const char = filtered.slice(-1);
    updateDigit(index, char);
    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (
    index: number,
    event: NativeSyntheticEvent<TextInputKeyPressEventData>,
  ) => {
    if (event.nativeEvent.key !== "Backspace") return;
    if (digits[index]?.trim()) {
      updateDigit(index, "");
      return;
    }
    if (index > 0) {
      inputsRef.current[index - 1]?.focus();
      updateDigit(index - 1, "");
    }
  };

  return (
    <View style={styles.wrapper}>
      <TextInput
        ref={autofillRef}
        style={styles.hiddenAutofill}
        value={value}
        onChangeText={applyOtp}
        keyboardType="number-pad"
        maxLength={OTP_LENGTH}
        editable={!disabled}
        textContentType="oneTimeCode"
        autoComplete={Platform.OS === "android" ? "sms-otp" : "one-time-code"}
        importantForAutofill="yes"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View style={styles.row}>
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              inputsRef.current[index] = ref;
            }}
            style={[
              styles.box,
              digits[index]?.trim() ? styles.boxFilled : null,
            ]}
            value={digits[index]?.trim() ? digits[index] : ""}
            onChangeText={(text) => handleChange(index, text)}
            onKeyPress={(event) => handleKeyPress(index, event)}
            keyboardType="number-pad"
            maxLength={index === 0 ? OTP_LENGTH : 1}
            editable={!disabled}
            selectTextOnFocus
            textContentType={index === 0 ? "oneTimeCode" : "none"}
            autoComplete={
              index === 0 && Platform.OS === "android" ? "sms-otp" : "off"
            }
            accessibilityLabel={`OTP digit ${index + 1}`}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginTop: loginSpacing.stackMd,
  },
  hiddenAutofill: {
    position: "absolute",
    width: 1,
    height: 1,
    opacity: 0,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: loginSpacing.stackSm,
  },
  box: {
    flex: 1,
    maxWidth: 48,
    height: 56,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    borderRadius: loginRadius.md,
    backgroundColor: loginColors.surface,
    textAlign: "center",
    ...loginTypography.otpDigit,
    color: loginColors.onSurface,
  },
  boxFilled: {
    borderColor: loginColors.primary,
  },
});
