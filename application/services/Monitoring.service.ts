import * as Sentry from "@sentry/react-native";

type MonitoringContext = Record<string, unknown>;

type MonitoringUser = {
  id: string;
  role?: string;
};

function isActive() {
  return !__DEV__;
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

  static setUser(user: MonitoringUser) {
    if (!isActive()) return;
    Sentry.setUser({ id: user.id, role: user.role });
  }

  static clearUser() {
    if (!isActive()) return;
    Sentry.setUser(null);
  }
}
