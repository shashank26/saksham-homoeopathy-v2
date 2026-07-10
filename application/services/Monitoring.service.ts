import { getClientVersion } from "@/utils/clientVersion";
import * as Sentry from "@sentry/react-native";

type MonitoringContext = Record<string, unknown>;

type MonitoringUser = {
  id: string;
  role?: string;
};

function isActive() {
  return !__DEV__;
}

function getClientVersionContext() {
  const client = getClientVersion();
  return {
    appVersion: client.version,
    buildNumber: client.buildNumber,
    platform: client.platform,
  };
}

export class Monitoring {
  static captureException(error: unknown, context?: MonitoringContext) {
    if (!isActive()) return;
    Sentry.captureException(error, context ? { extra: context } : undefined);
  }

  static logInfo(message: string, data?: MonitoringContext) {
    if (!isActive()) return;
    Sentry.logger.info(message, data);
    Sentry.addBreadcrumb({
      category: "app",
      message,
      level: "info",
      data,
    });
  }

  static logWarning(message: string, data?: MonitoringContext) {
    if (!isActive()) return;
    Sentry.logger.warn(message, data);
    Sentry.addBreadcrumb({
      category: "app",
      message,
      level: "warning",
      data,
    });
  }

  static logError(message: string, data?: MonitoringContext) {
    if (!isActive()) return;
    Sentry.logger.error(message, data);
    Sentry.addBreadcrumb({
      category: "app",
      message,
      level: "error",
      data,
    });
  }

  static logAppOpen(
    trigger: "cold_start" | "foreground",
    data?: MonitoringContext,
  ) {
    this.logInfo("app_opened", {
      trigger,
      openedAt: new Date().toISOString(),
      ...getClientVersionContext(),
      ...data,
    });
  }

  static setUser(user: MonitoringUser) {
    if (!isActive()) return;
    const client = getClientVersion();
    Sentry.setUser({
      id: user.id,
      role: user.role,
      appVersion: client.version,
      buildNumber: client.buildNumber,
      platform: client.platform,
    });
  }

  static clearUser() {
    if (!isActive()) return;
    Sentry.setUser(null);
  }

  static setClientVersionTags() {
    if (!isActive()) return;
    const client = getClientVersion();
    Sentry.setTag("app.version", client.version);
    Sentry.setTag("app.build", client.buildNumber);
    Sentry.setTag("app.platform", client.platform);
  }
}
