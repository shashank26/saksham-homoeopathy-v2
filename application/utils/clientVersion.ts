import * as Application from "expo-application";
import Constants from "expo-constants";
import { Platform } from "react-native";

export type ClientVersion = {
  version: string;
  buildNumber: string;
  platform: "ios" | "android";
};

export function getClientVersion(): ClientVersion {
  const platform: ClientVersion["platform"] =
    Platform.OS === "ios" ? "ios" : "android";
  return {
    platform,
    version:
      Application.nativeApplicationVersion ??
      Constants.expoConfig?.version ??
      "0.0.0",
    buildNumber: Application.nativeBuildVersion ?? "0",
  };
}
