import { Auth } from "@/components/auth/Auth";
import { AuthProvider } from "@/components/auth/hooks/useAuth";
import { LoaderScreen } from "@/components/LoaderScreen";
import { initializeFirebaseAppCheck } from "@/services/AppCheck";
import { getFonts, themeColors, themes } from "@/themes/themes";
import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, TamaguiProvider } from "@tamagui/core";
import { ToastProvider } from "@tamagui/toast";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { PortalProvider } from "tamagui";

const config = createTamagui({
  ...defaultConfig,
  themes,
  tokens: {
    ...defaultConfig.tokens,
    color: {
      ...themeColors,
    },
  },
  fonts: {
    ...getFonts(),
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    JosefinSans: require("@/assets/fonts/JosefinSans-Regular.ttf"),
    "JosefinSans-100": require("@/assets/fonts/JosefinSans-Thin.ttf"),
    "JosefinSans-200": require("@/assets/fonts/JosefinSans-ExtraLight.ttf"),
    "JosefinSans-300": require("@/assets/fonts/JosefinSans-Light.ttf"),
    "JosefinSans-400": require("@/assets/fonts/JosefinSans-Regular.ttf"),
    "JosefinSans-500": require("@/assets/fonts/JosefinSans-Medium.ttf"),
    "JosefinSans-600": require("@/assets/fonts/JosefinSans-SemiBold.ttf"),
    "JosefinSans-700": require("@/assets/fonts/JosefinSans-Bold.ttf"),
  });

  const getUI = () => {
    if (!fontsLoaded) {
      return <LoaderScreen />;
    }
    return (
      <Auth>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </Auth>
    );
  };

  const [appCheckInitialized, setAppCheckInitialized] = useState(false);

  useEffect(() => {
    initializeFirebaseAppCheck().finally(() => {
      console.log("AppCheck initialized");
      setAppCheckInitialized(true);
    });
  }, []);

  if (!appCheckInitialized) {
    return <></>;
  }

  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <TamaguiProvider config={config} defaultTheme="light">
          <PortalProvider>
            <ToastProvider>{getUI()}</ToastProvider>
          </PortalProvider>
        </TamaguiProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
