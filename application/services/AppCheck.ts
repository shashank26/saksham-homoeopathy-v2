import { Monitoring } from "@/services/Monitoring.service";
import { initializeAppCheck } from "@react-native-firebase/app-check";
import ReactNativeFirebaseAppCheckProvider from "@react-native-firebase/app-check/dist/module/ReactNativeFirebaseAppCheckProvider.js";
import { getApp } from "@react-native-firebase/app";

export async function initializeFirebaseAppCheck() {
  try {
    const rnfbProvider = new ReactNativeFirebaseAppCheckProvider();
    const debugToken = __DEV__
      ? "F83545C7-7215-4355-B5E9-A0887742D3D2"
      : undefined;

    rnfbProvider.configure({
      android: {
        provider: __DEV__ ? "debug" : "playIntegrity",
        ...(debugToken ? { debugToken } : {}),
      },
      apple: {
        provider: __DEV__ ? "debug" : "appAttestWithDeviceCheckFallback",
        ...(debugToken ? { debugToken } : {}),
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
    Monitoring.captureException(error, { area: "appCheck", action: "init" });
    Monitoring.logError("App Check initialization failed");
  }
}
