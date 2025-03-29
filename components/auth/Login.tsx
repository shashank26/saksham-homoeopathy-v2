import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as burnt from "burnt";
import { FC, useState } from "react";
import { KeyboardAvoidingView, View } from "react-native";
import { H1, H2, Image, Input, YStack } from "tamagui";
import { LoaderButton } from "../controls/LoaderButton";
import { useAuth } from "./hooks/useAuth";
import LogoSvg from "@/assets/images/svg/logo.svg";
import { Svg } from "react-native-svg";

const OTPAuth: FC<{ confirm: FirebaseAuthTypes.ConfirmationResult }> = ({
  confirm,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);
  const { setError } = useAuth();

  return (
    <>
      <Input
        style={{
          fontFamily: "JosefinSans-Regular",
        }}
        borderWidth={2}
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
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  return (
    <KeyboardAvoidingView style={{ flex: 1, height: "100%" }}>
      <YStack flex={1} padding={"$6"} gap={"$4"}>
        <View
          style={{
            alignItems: "center",
          }}
        >
          <LogoSvg/>
        </View>
        <H2
          marginBottom={50}
          style={{
            fontFamily: "JosefinSans-Bold",
            textAlign: "center",
            color: "#ae4137",
          }}
        >
          Saksham Homoeopathy
        </H2>
        <Input
          style={{
            fontFamily: "JosefinSans-Regular",
          }}
          borderWidth={2}
          keyboardType="numeric"
          placeholder="Phone number"
          // autoFocus={true}
          onChangeText={(e: string) => {
            const filteredValue = e.replace(/[^0-9]/g, "");
            setPhoneNumber(filteredValue);
          }}
          maxLength={10}
          value={phoneNumber.toString()}
        />
        {confirm ? (
          <OTPAuth confirm={confirm}></OTPAuth>
        ) : (
          <LoaderButton
            disabled={phoneNumber.length !== 10}
            theme={"accent"}
            style={{
              fontSize: 20,
              fontWeight: "bold",
            }}
            message="Sending..."
            text="Get OTP"
            isLoading={isLoading}
            onPress={async () => {
              if (isLoading || !signIn) return;
              try {
                const confirm = await signIn(
                  parseInt(phoneNumber) || 9643018020
                );
                setConfirm(confirm);
              } catch (err) {
                console.log(err);
              }
            }}
          ></LoaderButton>
        )}
      </YStack>
    </KeyboardAvoidingView>
  );
};
