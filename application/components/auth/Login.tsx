import LogoSvg from "@/assets/images/svg/logo.svg";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as burnt from "burnt";
import { FC, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { H2, Input, YStack } from "tamagui";
import { LoaderButton } from "../controls/LoaderButton";
import { useAuth } from "./hooks/useAuth";

type OTPAuthCode = "auth/invalid-verification-code" | "auth/code-expired";
type OTPAuthMessage = { code: OTPAuthCode; message: string } | null;

const OTPAuth: FC<{
  confirm: FirebaseAuthTypes.ConfirmationResult;
  onResendOTP: (message: string) => void;
}> = ({ confirm, onResendOTP }) => {
  const [otp, setOtp] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const { setError } = useAuth();
  const [message, setMessage] = useState<OTPAuthMessage>(null);

  return (
    <>
      <Input
        fontFamily={"$js4"}
        fontSize={"$4"}
        borderWidth={2}
        keyboardType="numeric"
        placeholder="OTP"
        maxLength={6}
        readOnly={verifying}
        secureTextEntry={true}
        onChangeText={(e) => {
          const filteredValue = e.replace(/[^0-9]/g, "");
          setOtp(filteredValue);
        }}
      />
      <LoaderButton
        isLoading={verifying}
        message="Logging in..."
        text="Login"
        disabled={otp.length !== 6 || verifying}
        theme={"accent"}
        onPress={async () => {
          if (verifying) return;
          setVerifying(true);
          try {
            const resp = await confirm.confirm(otp);
          } catch (err: any) {
            // TODO: Log to crashylitics
            console.log(err);
            let message = "Login failed!";
            if (err.code === "auth/invalid-verification-code") {
              message = "Invalid OTP. Please try again.";
            } else if (err.code === "auth/code-expired") {
              message = "OTP expired. Please request a new OTP.";
              onResendOTP(message);
            }
            setError?.(err);
            setMessage({
              code: err.code as OTPAuthCode,
              message,
            });
            burnt.toast({
              title: "Error",
              message,
              preset: "error",
              shouldDismissByDrag: true,
              duration: 10,
            });
          }
          setVerifying(false);
        }}
      ></LoaderButton>
      {message && (
        <>
          <H2
            fontFamily="$js6"
            color="$accent"
            size="$4"
            style={{
              textAlign: "center",
              color: "red",
            }}
          >
            {message.message}
          </H2>
        </>
      )}
    </>
  );
};

export const Login: FC = () => {
  const { isLoading, signIn } = useAuth();
  const [fetchingOTP, setFetchingOTP] = useState<boolean>(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [resendOTP, setResendOTP] = useState<string>("");

  return (
    <KeyboardAvoidingView style={{ flex: 1, height: "100%" }}>
      <YStack flex={1} padding={"$6"} gap={"$4"} justifyContent="center">
        <View
          style={{
            alignItems: "center",
          }}
        >
          <LogoSvg />
        </View>
        <H2
          marginBottom={50}
          fontFamily="$js6"
          color="$accent"
          size="$14"
          style={{
            textAlign: "center",
            lineHeight: "50",
          }}
        >
          Saksham Homoeopathy
        </H2>
        <Input
          fontFamily={"$js4"}
          fontSize={"$4"}
          borderWidth={2}
          readOnly={fetchingOTP || isLoading}
          keyboardType="numeric"
          placeholder="Phone number"
          onChangeText={(e: string) => {
            const filteredValue = e.replace(/[^0-9]/g, "");
            setPhoneNumber(filteredValue);
          }}
          maxLength={10}
          value={phoneNumber.toString()}
        />
        {confirm ? (
          <OTPAuth
            confirm={confirm}
            onResendOTP={(message) => {
              setConfirm(null);
              setResendOTP(message);
              setFetchingOTP(false);
            }}
          ></OTPAuth>
        ) : (
          <>
            <LoaderButton
              disabled={phoneNumber.length !== 10 || fetchingOTP || isLoading}
              theme={"accent"}
              style={{
                fontSize: 20,
                fontWeight: "bold",
              }}
              message="Sending..."
              text={"Get OTP"}
              isLoading={fetchingOTP || isLoading}
              onPress={async () => {
                if (isLoading || !signIn || !phoneNumber) return;
                try {
                  setResendOTP("Fetching OTP...");
                  setFetchingOTP(true);
                  const confirm = await signIn(parseInt(phoneNumber));
                  setConfirm(confirm);
                } catch (err) {
                  console.log(err);
                  burnt.toast({
                    title: "Error",
                    message: "Login failed!",
                    preset: "error",
                    duration: 4,
                  });
                }
                setFetchingOTP(false);
              }}
            ></LoaderButton>
            {resendOTP && (
              <>
                <H2
                  fontFamily="$js6"
                  color="$accent"
                  size="$4"
                  style={{
                    textAlign: "center",
                    color: "red",
                  }}
                >
                  {resendOTP}
                </H2>
              </>
            )}
          </>
        )}
      </YStack>
    </KeyboardAvoidingView>
  );
};
