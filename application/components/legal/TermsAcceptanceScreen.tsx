import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import { LEGAL_URLS } from "@/constants/legal";
import { TermsAcceptanceService } from "@/services/TermsAcceptance.service";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Href, router } from "expo-router";
import { FC, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type TermsAcceptanceScreenProps = {
  onAccepted: () => void;
};

export const TermsAcceptanceScreen: FC<TermsAcceptanceScreenProps> = ({
  onAccepted,
}) => {
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleContinue = async () => {
    if (!checked || submitting) return;
    setSubmitting(true);
    try {
      await TermsAcceptanceService.acceptCurrentTerms();
      onAccepted();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Terms of Use</Text>
        <Text style={styles.body}>
          Before using Saksham Homoeopathy, please review and accept our Terms
          of Use and Privacy Policy.
        </Text>
        <Text style={styles.body}>
          This app includes messaging between patients and clinic staff. We have
          zero tolerance for objectionable content, harassment, spam, or abusive
          behavior. You can report messages and block users at any time.
        </Text>
        <View style={styles.links}>
          <Pressable onPress={() => router.push("/legal/terms" as Href)}>
            <Text style={styles.link}>Read Terms of Use</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/legal/privacy" as Href)}>
            <Text style={styles.link}>Read Privacy Policy</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/legal/contact" as Href)}>
            <Text style={styles.link}>Contact Us</Text>
          </Pressable>
        </View>
        <Pressable
          style={styles.checkboxRow}
          onPress={() => setChecked((prev) => !prev)}
        >
          <MaterialIcons
            name={checked ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={checked ? loginColors.secondary : loginColors.onSurfaceVariant}
          />
          <Text style={styles.checkboxLabel}>
            I agree to the Terms of Use and Privacy Policy
          </Text>
        </Pressable>
      </ScrollView>
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <LoginPrimaryButton
          label="Continue"
          loadingLabel="Saving..."
          disabled={!checked}
          loading={submitting}
          onPress={handleContinue}
        />
        <Text style={styles.footerNote}>
          Support: {LEGAL_URLS.supportEmail}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: loginColors.background,
  },
  content: {
    padding: loginSpacing.containerMargin,
    paddingBottom: loginSpacing.sectionGap,
  },
  title: {
    ...loginTypography.headlineLgMobile,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackMd,
  },
  body: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackMd,
  },
  links: {
    gap: loginSpacing.stackSm,
    marginBottom: loginSpacing.stackLg,
  },
  link: {
    ...loginTypography.labelMd,
    color: loginColors.secondary,
    textDecorationLine: "underline",
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: loginSpacing.stackSm,
  },
  checkboxLabel: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurface,
    flex: 1,
  },
  footer: {
    paddingHorizontal: loginSpacing.containerMargin,
    paddingTop: loginSpacing.stackMd,
    borderTopWidth: 1,
    borderTopColor: loginColors.outlineVariant,
    gap: loginSpacing.stackSm,
  },
  footerNote: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
  },
});
