import { Auth } from "@/components/auth/Auth";
import { HelloText } from "@/components/Hello";
import { themes } from "@/themes/themes";
import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, TamaguiProvider } from "tamagui";
import "../global.css";
import { Toast, ToastProvider } from "@tamagui/toast";

const config = createTamagui({ ...defaultConfig, themes });

export default function Index() {
  return (
    <TamaguiProvider config={config}>
      <ToastProvider>
        <Auth>
          <HelloText />
        </Auth>
        <Toast />
      </ToastProvider>
    </TamaguiProvider>
  );
}
