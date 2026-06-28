import { BackHeader } from "@/components/common/BackHeader";
import { LoaderScreen } from "@/components/LoaderScreen";
import { loginColors } from "@/themes/loginDesign";
import { themeColors } from "@/themes/themes";
import { FC, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";

type LegalWebViewScreenProps = {
  title: string;
  url: string;
};

export const LegalWebViewScreen: FC<LegalWebViewScreenProps> = ({
  title,
  url,
}) => {
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <BackHeader title={<Text style={styles.headerTitle}>{title}</Text>} />
      {loading ? (
        <View style={styles.loader}>
          <LoaderScreen />
        </View>
      ) : null}
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: loginColors.background,
  },
  headerTitle: {
    fontFamily: "Manrope_600SemiBold",
    fontSize: 16,
    color: themeColors.onyx,
    marginLeft: 4,
  },
  webview: {
    flex: 1,
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
});
