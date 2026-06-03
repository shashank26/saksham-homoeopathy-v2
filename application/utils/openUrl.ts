import * as WebBrowser from "expo-web-browser";
import { Linking } from "react-native";

export async function openExternalUrl(url: string) {
  if (url.startsWith("mailto:")) {
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
    return;
  }

  await WebBrowser.openBrowserAsync(url, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.AUTOMATIC,
  });
}
