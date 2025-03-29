import { Auth } from "@/components/auth/Auth";
import { AuthProvider } from "@/components/auth/hooks/useAuth";
import { LoaderScreen } from "@/components/LoaderScreen";
import { themes } from "@/themes/themes";
import { defaultConfig } from "@tamagui/config/v4";
import { createTamagui, TamaguiProvider } from "@tamagui/core";
import { ToastProvider } from "@tamagui/toast";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { SafeAreaView } from "react-native";

const config = createTamagui({ ...defaultConfig, themes });

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JosefinSans-Bold": require("@/assets/fonts/JosefinSans-Bold.ttf"),
    "JosefinSans-Regular": require("@/assets/fonts/JosefinSans-Regular.ttf"),
    "JosefinSans-SemiBold": require("@/assets/fonts/JosefinSans-SemiBold.ttf"),
    "JosefinSans-Light": require("@/assets/fonts/JosefinSans-Light.ttf"),
    "JosefinSans-Thin": require("@/assets/fonts/JosefinSans-Thin.ttf"),
    "JosefinSans-ExtraLight": require("@/assets/fonts/JosefinSans-ExtraLight.ttf"),
    "JosefinSans-Medium": require("@/assets/fonts/JosefinSans-Medium.ttf"),
    "JosefinSans-BoldItalic": require("@/assets/fonts/JosefinSans-BoldItalic.ttf"),
    "JosefinSans-ExtraLightItalic": require("@/assets/fonts/JosefinSans-ExtraLightItalic.ttf"),
    "JosefinSans-Italic": require("@/assets/fonts/JosefinSans-Italic.ttf"),
    "JosefinSans-LightItalic": require("@/assets/fonts/JosefinSans-LightItalic.ttf"),
    "JosefinSans-MediumItalic": require("@/assets/fonts/JosefinSans-MediumItalic.ttf"),
    "JosefinSans-SemiBoldItalic": require("@/assets/fonts/JosefinSans-SemiBoldItalic.ttf"),
    "JosefinSans-ThinItalic": require("@/assets/fonts/JosefinSans-ThinItalic.ttf"),
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AuthProvider>
        <TamaguiProvider config={config} defaultTheme="light">
          <ToastProvider>{getUI()}</ToastProvider>
        </TamaguiProvider>
      </AuthProvider>
    </SafeAreaView>
  );
}
