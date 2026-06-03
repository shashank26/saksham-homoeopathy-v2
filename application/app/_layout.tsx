import { Auth } from "@/components/auth/Auth";
import { AuthProvider } from "@/components/auth/hooks/useAuth";
import { LoaderScreen } from "@/components/LoaderScreen";
import { initializeFirebaseAppCheck } from "@/services/AppCheck";
import { getFonts, themeColors, themes } from "@/themes/themes";
import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui } from "@tamagui/core";
import { PortalProvider } from "@tamagui/portal";
import { TamaguiProvider } from "tamagui";
import { ToastProvider } from "@tamagui/toast";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
    JosefinSans: require("@/assets/fonts/roboto/Roboto-Regular.ttf"),
    "JosefinSans-100": require("@/assets/fonts/roboto/Roboto-Thin.ttf"),
    "JosefinSans-200": require("@/assets/fonts/roboto/Roboto-ExtraLight.ttf"),
    "JosefinSans-300": require("@/assets/fonts/roboto/Roboto-Light.ttf"),
    "JosefinSans-400": require("@/assets/fonts/roboto/Roboto-Regular.ttf"),
    "JosefinSans-500": require("@/assets/fonts/roboto/Roboto-Medium.ttf"),
    "JosefinSans-600": require("@/assets/fonts/roboto/Roboto-SemiBold.ttf"),
    "JosefinSans-700": require("@/assets/fonts/roboto/Roboto-Bold.ttf"),
  });

  const getUI = () => {
    if (!fontsLoaded) {
      return <LoaderScreen />;
    }
    const content = (
      <Auth>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </Auth>
    );
    return content;
  };

  const [appCheckInitialized, setAppCheckInitialized] = useState(false);

  useEffect(() => {
    initializeFirebaseAppCheck().finally(() => {
      console.log("AppCheck initialized");
      setAppCheckInitialized(true);
    });
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <TamaguiProvider config={config} defaultTheme="light">
          <PortalProvider shouldAddRootHost>
            {Platform.OS === "android" && (
              <StatusBar
                barStyle="dark-content"
                translucent={false}
                backgroundColor="#fff"
              />
            )}
            <ToastProvider>
              {appCheckInitialized ? getUI() : null}
            </ToastProvider>
          </PortalProvider>
        </TamaguiProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
