import { AuthService } from "@/services/Auth.service";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as burnt from "burnt";
import { FC, useState } from "react";
import { KeyboardAvoidingView } from "react-native";
import { Input, YStack } from "tamagui";
import { LoaderButton } from "../controls/LoaderButton";

const OTPAuth: FC<{ confirm: FirebaseAuthTypes.ConfirmationResult }> = ({
  confirm,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [verifying, setVerifying] = useState<boolean>(false);

  return (
    <>
      <Input
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
            burnt.toast({
              title: "Error",
              message: "Login failed!",
              preset: "error",
              duration: 4000,
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
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [loadingOtp, setLoadingOtp] = useState<boolean>(false);

  return (
    <KeyboardAvoidingView style={{ flex: 1, height: "100%" }}>
      <YStack flex={1} padding={"$6"} gap={"$4"} justifyContent="center">
        <Input
          borderWidth={2}
          keyboardType="numeric"
          placeholder="Phone number"
          onChangeText={(e) => {
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
            text="Send OTP"
            isLoading={loadingOtp}
            onPress={async () => {
              if (loadingOtp) return;
              setLoadingOtp(true);
              const confirm = await AuthService.signIn(
                "+91",
                parseInt(phoneNumber) || 9643018020
              );
              setConfirm(confirm);
              setLoadingOtp(false);
            }}
          ></LoaderButton>
        )}
      </YStack>
    </KeyboardAvoidingView>
  );
};
