import {
  isValidNationalNumber,
  PhoneCountry,
} from "@/constants/phoneCountries";
import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { CountryCodeSelect } from "./CountryCodeSelect";
import { LoginPrimaryButton } from "./LoginPrimaryButton";

type PhoneNumberFormProps = {
  country: PhoneCountry;
  onCountryChange: (country: PhoneCountry) => void;
  phoneNumber: string;
  onPhoneNumberChange: (value: string) => void;
  onSendOtp: () => void;
  isLoading: boolean;
  statusMessage?: string;
  disabled?: boolean;
  otpSent?: boolean;
};

export const PhoneNumberForm: FC<PhoneNumberFormProps> = ({
  country,
  onCountryChange,
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
        <CountryCodeSelect
          value={country}
          onValueChange={(nextCountry) => {
            onCountryChange(nextCountry);
            if (phoneNumber.length > nextCountry.maxLength) {
              onPhoneNumberChange(phoneNumber.slice(0, nextCountry.maxLength));
            }
          }}
          disabled={disabled || isLoading || otpSent}
        />
        <TextInput
          style={[styles.phoneInput, phoneFocused && styles.inputFocused]}
          value={phoneNumber}
          onChangeText={(text) =>
            onPhoneNumberChange(
              text.replace(/[^0-9]/g, "").slice(0, country.maxLength),
            )
          }
          keyboardType="phone-pad"
          placeholder={country.placeholder ?? "Enter your mobile number"}
          placeholderTextColor={loginColors.outlineVariant}
          maxLength={country.maxLength}
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
          disabled={!isValidNationalNumber(country, phoneNumber) || disabled}
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
