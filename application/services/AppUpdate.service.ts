import { compareSemver, parseMajorMinor } from "@/utils/versionCompare";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Application from "expo-application";
import Constants from "expo-constants";
import { Platform } from "react-native";
import { db } from "./Firebase.service";

export type AppPlatform = "android" | "ios";

export type PlatformVersionConfig = {
  mandatory: boolean;
  major: number;
  minor: number;
};

export type AppVersionConfig = {
  android?: PlatformVersionConfig;
  ios?: PlatformVersionConfig;
};

export type InstalledVersion = {
  platform: AppPlatform;
  major: number;
  minor: number;
};

export type UpdateStatus = "none" | "optional" | "required";

export type UpdateEvaluation = {
  status: UpdateStatus;
  storeUrl: string;
  message: string;
  targetVersion: string;
};

const DISMISS_STORAGE_KEY = "appUpdate.dismissedVersion";

const DEFAULT_MESSAGE = "A new version of Saksham Homoeopathy is available.";

type StoreExtra = {
  android?: string;
  ios?: string;
};

const storeExtra = (Constants.expoConfig?.extra?.stores ?? {}) as StoreExtra;

function getPlatformConfig(
  config: AppVersionConfig,
  platform: AppPlatform,
): PlatformVersionConfig | undefined {
  return platform === "android" ? config.android : config.ios;
}

function getDefaultStoreUrl(platform: AppPlatform): string {
  if (platform === "android") {
    return (
      storeExtra.android ??
      "https://play.google.com/store/apps/details?id=com.arniparth.sakshamhomoeopathy"
    );
  }
  return storeExtra.ios ?? "";
}

function isBelowMajorMinor(
  installed: InstalledVersion,
  target: PlatformVersionConfig,
): boolean {
  if (installed.major < target.major) return true;
  if (installed.major > target.major) return false;
  return installed.minor < target.minor;
}

export class AppUpdateService {
  static getInstalledVersion(): InstalledVersion {
    const platform: AppPlatform = Platform.OS === "ios" ? "ios" : "android";
    const raw =
      Application.nativeApplicationVersion ??
      Constants.expoConfig?.version ??
      "0.0.0";
    const { major, minor } = parseMajorMinor(raw);
    return { platform, major, minor };
  }

  static evaluateUpdate(
    config: AppVersionConfig | null | undefined,
    installed: InstalledVersion,
    dismissedVersion: string | null,
  ): UpdateEvaluation {
    const none: UpdateEvaluation = {
      status: "none",
      storeUrl: getDefaultStoreUrl(installed.platform),
      message: "",
      targetVersion: "",
    };

    if (__DEV__ || !config) {
      return none;
    }

    const platformConfig = getPlatformConfig(config, installed.platform);
    if (!platformConfig) {
      return none;
    }

    if (!isBelowMajorMinor(installed, platformConfig)) {
      return none;
    }

    const storeUrl = getDefaultStoreUrl(installed.platform);
    const targetVersion = `${platformConfig.major}.${platformConfig.minor}`;

    if (platformConfig.mandatory) {
      return {
        status: "required",
        storeUrl,
        message: DEFAULT_MESSAGE,
        targetVersion,
      };
    }

    if (
      dismissedVersion &&
      compareSemver(dismissedVersion, targetVersion) >= 0
    ) {
      return none;
    }

    return {
      status: "optional",
      storeUrl,
      message: DEFAULT_MESSAGE,
      targetVersion,
    };
  }

  static async getDismissedVersion(
    platform: AppPlatform,
  ): Promise<string | null> {
    const value = await AsyncStorage.getItem(
      `${DISMISS_STORAGE_KEY}.${platform}`,
    );
    return value && value.trim() ? value : null;
  }

  static async markUpdateDismissed(
    platform: AppPlatform,
    version: string,
  ): Promise<void> {
    await AsyncStorage.setItem(`${DISMISS_STORAGE_KEY}.${platform}`, version);
  }

  static subscribeToVersionConfig(
    callback: (config: AppVersionConfig | null) => void,
  ): () => void {
    return db
      .collection("config")
      .doc("appCurrentVersion")
      .onSnapshot(
        (doc) => {
          callback(doc.exists() ? (doc.data() as AppVersionConfig) : null);
        },
        () => {
          callback(null);
        },
      );
  }
}
