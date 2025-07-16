import {
  initializeAppCheck,
  ReactNativeFirebaseAppCheckProvider,
} from "@react-native-firebase/app-check";
import { ANDROID_TOKEN, APPLE_TOKEN } from "./DebugTokens";
import { getApp } from "@react-native-firebase/app";

export async function initializeFirebaseAppCheck() {

  try {
    const rnfbProvider = new ReactNativeFirebaseAppCheckProvider();
    rnfbProvider.configure({
      android: {
        provider: __DEV__ ? "debug" : "playIntegrity",
        debugToken: ANDROID_TOKEN,
      },
      apple: {
        provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback",
        debugToken: APPLE_TOKEN,
      },
      web: {
        provider: "reCaptchaV3",
        siteKey: "",
      },
    });

    const appCheck = await initializeAppCheck(getApp(), {
      provider: rnfbProvider,
      isTokenAutoRefreshEnabled: true,
    });

    const { token } = await appCheck.getToken(true);

    if (token.length > 0) {
      console.log("AppCheck verification passed");
    }
  } catch (error) {
    console.error("❌ App Check initialization failed:", error);
  }
}
