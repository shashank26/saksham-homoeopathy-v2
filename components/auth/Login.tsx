import { AuthService } from "@/services/Auth.service";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FC, useState } from "react";
import { Button, KeyboardAvoidingView, TextInput, View } from "react-native";

const OTPAuth: FC<{ confirm: FirebaseAuthTypes.ConfirmationResult }> = ({
  confirm,
}) => {
  const [otp, setOtp] = useState<string>("");

  return (
    <>
      <TextInput
        placeholder="OTP"
        onChangeText={(e) => {
          if (e.trim().length !== 6) return;
          setOtp(e);
        }}
      />
      <Button
        title="Login"
        onPress={() => {
          confirm.confirm(otp);
        }}
      />
    </>
  );
};

export const Login: FC = () => {
  const [phoneNumber, setPhoneNumber] = useState<number>(0);
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  return (
    <View className="flex-1 items-center justify-center">
      <KeyboardAvoidingView>
        <TextInput
          placeholder="Phone number"
          defaultValue="9643018020"
          onChangeText={(e) => {
            const value = Number(e);
            if (isNaN(value)) return;
            if ((value + "").length !== 10) return;
            setPhoneNumber(value);
          }}
        />
        {confirm ? (
          <OTPAuth confirm={confirm}></OTPAuth>
        ) : (
          <Button
            onPress={async () => {
              const confirm = await AuthService.signIn(
                "+91",
                phoneNumber || 9643018020
              );
              setConfirm(confirm);
            }}
            title="Sign In"
          />
        )}
      </KeyboardAvoidingView>
    </View>
  );
};
