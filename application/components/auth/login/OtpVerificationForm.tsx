import { Monitoring } from "@/services/Monitoring.service";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as burnt from "burnt";
import { FC, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { LoginPrimaryButton } from "./LoginPrimaryButton";
import { OtpInputRow } from "./OtpInputRow";
import { useOtpResendTimer } from "./useOtpResendTimer";

type OTPAuthCode = "auth/invalid-verification-code" | "auth/code-expired";
type OTPAuthMessage = { code: OTPAuthCode; message: string } | null;

type OtpVerificationFormProps = {
  confirm: FirebaseAuthTypes.ConfirmationResult;
  onResend: () => Promise<void>;
  onClearOtp?: () => void;
};

export const OtpVerificationForm: FC<OtpVerificationFormProps> = ({
  confirm,
  onResend,
  onClearOtp,
}) => {
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const { setError } = useAuth();
  const [message, setMessage] = useState<OTPAuthMessage>(null);
  const { secondsLeft, canResend, resetTimer } = useOtpResendTimer(true);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setMessage(null);
  };

  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    try {
      await onResend();
      setOtp("");
      onClearOtp?.();
      setMessage(null);
      resetTimer();
      burnt.toast({
        title: "OTP sent",
        message: "A new verification code has been sent.",
        preset: "done",
        duration: 3,
      });
    } catch (err) {
      Monitoring.captureException(err, { area: "auth", action: "resendOtp" });
      burnt.toast({
        title: "Error",
        message: "Failed to resend OTP. Please try again.",
        preset: "error",
        duration: 4,
      });
    }
    setResending(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Identity</Text>
      <Text style={styles.subtitle}>
        Enter the 6-digit code sent to your mobile device.
      </Text>

      <OtpInputRow
        value={otp}
        onChange={handleOtpChange}
        disabled={verifying || resending}
        autoFocus
      />

      <LoginPrimaryButton
        label="Verify & Continue"
        loadingLabel="Logging in..."
        disabled={otp.length !== 6 || verifying || resending}
        loading={verifying}
        onPress={async () => {
          if (verifying) return;
          setVerifying(true);
          try {
            await confirm.confirm(otp);
          } catch (err: unknown) {
            const error = err as { code?: OTPAuthCode; message?: string };
            Monitoring.captureException(err, {
              area: "auth",
              action: "verifyOtp",
              code: error.code,
            });
            let errorMessage = "Login failed!";
            if (error.code === "auth/invalid-verification-code") {
              errorMessage = "Invalid OTP. Please try again.";
            } else if (error.code === "auth/code-expired") {
              errorMessage = "OTP expired. Please request a new OTP.";
            }
            setError?.(error as FirebaseAuthTypes.PhoneAuthError);
            setMessage({
              code: error.code as OTPAuthCode,
              message: errorMessage,
            });
            burnt.toast({
              title: "Error",
              message: errorMessage,
              preset: "error",
              shouldDismissByDrag: true,
              duration: 10,
            });
          }
          setVerifying(false);
        }}
      />

      <Pressable
        onPress={handleResend}
        disabled={!canResend || resending}
        style={styles.resendButton}
      >
        <Text
          style={[
            styles.resendText,
            (!canResend || resending) && styles.resendTextDisabled,
          ]}
        >
          {canResend
            ? "Resend OTP"
            : `Resend OTP (${secondsLeft}s)`}
        </Text>
      </Pressable>

      {message ? <Text style={styles.errorText}>{message.message}</Text> : null}
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
    marginBottom: loginSpacing.stackSm,
  },
  resendButton: {
    alignSelf: "center",
    marginTop: loginSpacing.stackMd,
    paddingVertical: loginSpacing.stackSm,
  },
  resendText: {
    ...loginTypography.labelMd,
    color: loginColors.secondary,
    textDecorationLine: "underline",
  },
  resendTextDisabled: {
    color: loginColors.onSurfaceVariant,
    textDecorationLine: "none",
  },
  errorText: {
    ...loginTypography.labelSm,
    color: loginColors.error,
    textAlign: "center",
    marginTop: loginSpacing.stackSm,
  },
});
