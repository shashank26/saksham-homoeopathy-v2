import * as Notifications from "expo-notifications";
import { Redirect, useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
      const chatId = response.notification.request.content.data
        .chatId as string;

      router.navigate({
        pathname: "/authorized/home/chat/[user]",
        params: { user: chatId },
      });
    });
  }, []);
  return <Redirect href={"/authorized/home"} />;
}
