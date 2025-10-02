import {
  initializeAppCheck,
  ReactNativeFirebaseAppCheckProvider,
} from "@react-native-firebase/app-check";
import { getApp } from "@react-native-firebase/app";

export async function initializeFirebaseAppCheck() {

  try {
    const rnfbProvider = new ReactNativeFirebaseAppCheckProvider();
    rnfbProvider.configure({
      android: {
        provider: __DEV__ ? "debug" : "playIntegrity",
        debugToken: "F83545C7-7215-4355-B5E9-A0887742D3D2",
      },
      apple: {
        provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback",
        debugToken: "F83545C7-7215-4355-B5E9-A0887742D3D2",
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
