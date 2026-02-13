import * as Notifications from "expo-notifications";

export async function registerForPushNotifications() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  token = (await Notifications.getExpoPushTokenAsync()).data;

  return token;
}
