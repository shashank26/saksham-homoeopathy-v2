import LogoSvg from "@/assets/images/svg/logo.svg";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as burnt from "burnt";
import { FC, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { LoaderButton } from "../controls/LoaderButton";
import { useAuth } from "./hooks/useAuth";
import { H2, Input, YStack } from "tamagui";

const OTPAuth: FC<{ confirm: FirebaseAuthTypes.ConfirmationResult }> = ({
  confirm,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const { setError } = useAuth();

  return (
    <>
      <Input
        fontFamily="$js4"
        borderWidth={2}
        fontSize="$4"
        keyboardType="numeric"
        placeholder="OTP"
        maxLength={6}
        onChangeText={(e) => {
          const filteredValue = e.replace(/[^0-9]/g, "");
          setOtp(filteredValue);
        }}
      />
      <LoaderButton
        isLoading={verifying}
        message="Logging in..."
        text="Login"
        disabled={otp.length !== 6}
        theme={"accent"}
        onPress={async () => {
          if (verifying) return;
          setVerifying(true);
          try {
            const resp = await confirm.confirm(otp);
          } catch (err) {
            // TODO: Log to crashylitics
            console.log(err);
            setError?.(err as any);
            burnt.toast({
              title: "Error",
              message: "Login failed!",
              preset: "error",
              duration: 4,
            });
            return;
          }
          setVerifying(false);
        }}
      ></LoaderButton>
    </>
  );
};

export const Login: FC = () => {
  const { isLoading, signIn } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [otpLoading, setOtpLoading] = useState<boolean>(false);
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

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
          fontFamily="$js4"
          fontSize="$4"
          borderWidth={2}
          keyboardType="numeric"
          placeholder="Phone number"
          onChangeText={(e: string) => {
            const filteredValue = e.replace(/[^0-9]/g, "");
            setPhoneNumber(filteredValue);
          }}
          maxLength={10}
          value={phoneNumber + ''}
        />
        {confirm ? (
          <OTPAuth confirm={confirm}></OTPAuth>
        ) : (
          <LoaderButton
            disabled={phoneNumber.length !== 10}
            theme={"accent"}
            message="Sending..."
            text="Get OTP"
            isLoading={otpLoading}
            onPress={async () => {
              if (otpLoading || !signIn) return;
              try {
                setOtpLoading(true);
                const confirm = await signIn(
                  parseInt(phoneNumber) || 9643018020
                );
                setConfirm(confirm);
              } catch (err) {
                console.log(err);
              }
              setOtpLoading(false);
            }}
          ></LoaderButton>
        )}
      </YStack>
    </KeyboardAvoidingView>
  );
};
