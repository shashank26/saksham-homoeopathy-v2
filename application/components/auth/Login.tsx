import { LoaderScreen } from "@/components/LoaderScreen";
import { DEFAULT_PHONE_COUNTRY } from "@/constants/phoneCountries";
import { Monitoring } from "@/services/Monitoring.service";
import { loginColors, loginSpacing } from "@/themes/loginDesign";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as burnt from "burnt";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useAuth } from "./hooks/useAuth";
import { LoginBrandSection } from "./login/LoginBrandSection";
import { LoginCard } from "./login/LoginCard";
import { LoginDisclaimer } from "./login/LoginDisclaimer";
import { LoginFooter } from "./login/LoginFooter";
import { LoginHeader } from "./login/LoginHeader";
import { LoginSectionDivider } from "./login/LoginSectionDivider";
import { OtpVerificationForm } from "./login/OtpVerificationForm";
import { PhoneNumberForm } from "./login/PhoneNumberForm";
import { useLoginFonts } from "./login/useLoginFonts";

export const Login: FC = () => {
  const fontsLoaded = useLoginFonts();
  const { isLoading, signIn } = useAuth();
  const [fetchingOTP, setFetchingOTP] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(DEFAULT_PHONE_COUNTRY);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const requestOtp = useCallback(async () => {
    if (isLoading || !signIn || !phoneNumber) return;
    try {
      setStatusMessage("Fetching OTP...");
      setFetchingOTP(true);
      const confirmation = await signIn(selectedCountry.dialCode, phoneNumber);
      setConfirm(confirmation);
      setStatusMessage("");
    } catch (err) {
      console.log(err);
      Monitoring.captureException(err, { area: "auth", action: "requestOtp" });
      burnt.toast({
        title: "Error",
        message: "Login failed!",
        preset: "error",
        duration: 4,
      });
      setStatusMessage("Failed to fetch OTP. Please try again.");
    }
    setFetchingOTP(false);
  }, [isLoading, phoneNumber, selectedCountry.dialCode, signIn]);

  useEffect(() => {
    if (!confirm) return;
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 150);
    return () => clearTimeout(timer);
  }, [confirm]);

  if (!fontsLoaded) {
    return <LoaderScreen />;
  }

  return (
    <View style={styles.screen}>
      <LoginHeader />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.main}>
            <LoginBrandSection />
            <LoginCard>
              <PhoneNumberForm
                country={selectedCountry}
                onCountryChange={setSelectedCountry}
                phoneNumber={phoneNumber}
                onPhoneNumberChange={setPhoneNumber}
                disabled={isLoading}
                otpSent={!!confirm}
                isLoading={fetchingOTP || isLoading}
                statusMessage={statusMessage}
                onSendOtp={requestOtp}
              />
              {confirm ? (
                <>
                  <LoginSectionDivider />
                  <OtpVerificationForm
                    key={confirm.verificationId}
                    confirm={confirm}
                    onResend={requestOtp}
                  />
                </>
              ) : null}
            </LoginCard>
            <LoginDisclaimer />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <LoginFooter />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: loginColors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: loginSpacing.containerMargin,
    paddingVertical: loginSpacing.stackLg,
    alignItems: "center",
  },
  main: {
    width: "100%",
    maxWidth: 480,
    alignItems: "center",
  },
});
