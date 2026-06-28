import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import { BackHeader } from "@/components/common/BackHeader";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import { LEGAL_URLS } from "@/constants/legal";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { themeColors } from "@/themes/themes";
import { openExternalUrl } from "@/utils/openUrl";
import { router } from "expo-router";
import { FC } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../auth/hooks/useAuth";

export const ContactUsScreen: FC = () => {
  const insets = useSafeAreaInsets();
  const fontsLoaded = useVitalityFonts();
  const { user } = useAuth();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <BackHeader title={<Text style={styles.headerTitle}>Contact Us</Text>} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.body}>
          For questions about appointments, your care, or this app, reach out to
          Saksham Homoeopathy.
        </Text>
        <Text style={styles.emailLabel}>Support email</Text>
        <Text style={styles.email}>{LEGAL_URLS.supportEmail}</Text>
        <LoginPrimaryButton
          label="Email support"
          onPress={() => openExternalUrl(LEGAL_URLS.feedback)}
          style={styles.button}
        />
        {user ? (
          <LoginPrimaryButton
            label="Send in-app feedback"
            onPress={() => router.push("/authorized/feedback")}
            style={styles.button}
          />
        ) : null}
      </ScrollView>
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
  content: {
    padding: loginSpacing.containerMargin,
    gap: loginSpacing.stackMd,
  },
  body: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
  },
  emailLabel: {
    ...loginTypography.labelMd,
    color: loginColors.onSurfaceVariant,
  },
  email: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_600SemiBold",
    fontSize: 18,
    color: loginColors.onSurface,
  },
  button: {
    marginTop: loginSpacing.stackSm,
  },
});
