import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { LoginPrimaryButton } from "./LoginPrimaryButton";

type PhoneNumberFormProps = {
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  onSendOtp: () => void;
  isLoading: boolean;
  statusMessage?: string;
  disabled?: boolean;
  otpSent?: boolean;
};

export const PhoneNumberForm: FC<PhoneNumberFormProps> = ({
  phoneNumber,
  onPhoneNumberChange,
  onSendOtp,
  isLoading,
  statusMessage,
  disabled,
  otpSent,
}) => {
  const [phoneFocused, setPhoneFocused] = useState(false);
  const isFetching = false; //statusMessage === "Fetching OTP...";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login with Phone Number</Text>
      <Text style={styles.subtitle}>
        We'll send you a one-time password to verify your account.
      </Text>

      <Text style={styles.label}>Phone Number</Text>
      <View style={styles.phoneRow}>
        <View style={styles.countryCodeBox}>
          <Text style={styles.countryCodeText}>+91</Text>
        </View>
        <TextInput
          style={[styles.phoneInput, phoneFocused && styles.inputFocused]}
          value={phoneNumber}
          onChangeText={(text) =>
            onPhoneNumberChange(text.replace(/[^0-9]/g, "").slice(0, 10))
          }
          keyboardType="phone-pad"
          placeholder="Enter your mobile number"
          placeholderTextColor={loginColors.outlineVariant}
          maxLength={10}
          editable={!disabled && !isLoading && !otpSent}
          onFocus={() => setPhoneFocused(true)}
          onBlur={() => setPhoneFocused(false)}
        />
      </View>

      {!otpSent ? (
        <LoginPrimaryButton
          label="Send OTP"
          loadingLabel="Sending..."
          onPress={onSendOtp}
          disabled={phoneNumber.length !== 10 || disabled}
          loading={isLoading}
        />
      ) : null}

      {statusMessage ? (
        <Text
          style={[
            styles.statusText,
            isFetching ? styles.statusNeutral : styles.statusError,
          ]}
        >
          {statusMessage}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  title: {
    ...loginTypography.headlineMd,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackSm,
  },
  subtitle: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackMd,
  },
  label: {
    ...loginTypography.labelMd,
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackSm,
  },
  phoneRow: {
    flexDirection: "row",
    marginBottom: loginSpacing.stackMd,
  },
  countryCodeBox: {
    minWidth: 72,
    height: 48,
    marginRight: loginSpacing.stackSm,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    borderRadius: loginRadius.md,
    backgroundColor: loginColors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.85,
  },
  countryCodeText: {
    ...loginTypography.labelMd,
    color: loginColors.onSurface,
  },
  phoneInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    borderRadius: loginRadius.md,
    backgroundColor: loginColors.surface,
    paddingHorizontal: loginSpacing.stackMd,
    ...loginTypography.labelMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
  },
  inputFocused: {
    borderColor: loginColors.primary,
    borderWidth: 2,
  },
  statusText: {
    ...loginTypography.labelSm,
    textAlign: "center",
    marginTop: loginSpacing.stackSm,
  },
  statusNeutral: {
    color: loginColors.onSurfaceVariant,
  },
  statusError: {
    color: loginColors.error,
  },
});
