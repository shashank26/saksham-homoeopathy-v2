import * as Notifications from "expo-notifications";

type PermissionSettings = Notifications.NotificationPermissionsStatus & {
  granted?: boolean;
};

function isNotificationPermissionGranted(settings: PermissionSettings) {
  return (
    settings.granted === true ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.AUTHORIZED ||
    settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function registerForPushNotifications() {
  let token;

  const existingSettings =
    (await Notifications.getPermissionsAsync()) as PermissionSettings;
  let granted = isNotificationPermissionGranted(existingSettings);

  if (!granted) {
    const requestedSettings =
      (await Notifications.requestPermissionsAsync()) as PermissionSettings;
    granted = isNotificationPermissionGranted(requestedSettings);
  }

  if (!granted) {
    return null;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;

  return token;
}
