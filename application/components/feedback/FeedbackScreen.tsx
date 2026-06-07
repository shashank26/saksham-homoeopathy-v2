import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import { PostContentField } from "@/components/posts/create/PostContentField";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import {
  FeedbackCategory,
  FeedbackService,
} from "@/services/Feedback.service";
import { Monitoring } from "@/services/Monitoring.service";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { toast } from "burnt";
import Constants from "expo-constants";
import { router } from "expo-router";
import { FC, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../auth/hooks/useAuth";
import { LoaderScreen } from "../LoaderScreen";
import { FeedbackCategorySelect } from "./FeedbackCategorySelect";

export const FeedbackScreen: FC = () => {
  const fontsLoaded = useVitalityFonts();
  const { profile, role } = useAuth();
  const [category, setCategory] = useState<FeedbackCategory | "">("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit =
    category !== "" && message.trim().length > 0 && !submitting;

  const handleSubmit = async () => {
    if (!canSubmit || !profile || category === "") return;

    setSubmitting(true);
    try {
      const success = await FeedbackService.submit({
        userId: profile.id,
        displayName: profile.displayName,
        phoneNumber: profile.phoneNumber,
        role,
        category,
        message: message.trim(),
        appVersion: Constants.expoConfig?.version ?? "1.0.0",
        platform: Platform.OS === "ios" ? "ios" : "android",
      });

      if (success) {
        toast({
          title: "Feedback submitted",
          message: "Thank you for helping us improve.",
          preset: "done",
          duration: 4,
        });
        setCategory("");
        setMessage("");
        router.back();
      } else {
        toast({
          title: "Submission failed",
          message: "Please try again later.",
          preset: "error",
          duration: 4,
        });
      }
    } catch (err) {
      Monitoring.captureException(err, {
        area: "feedback",
        action: "handleSubmit",
      });
      toast({
        title: "Submission failed",
        message: "Please try again later.",
        preset: "error",
        duration: 4,
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!fontsLoaded) {
    return <LoaderScreen />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.heading}>Send Feedback</Text>
        <Text style={styles.subheading}>
          Share bugs, feature ideas, or general feedback. We read every
          submission.
        </Text>

        <FeedbackCategorySelect
          value={category}
          onValueChange={setCategory}
          required
        />

        <PostContentField
          value={message}
          onChangeText={setMessage}
          maxLength={1000}
          label="Your feedback"
          placeholder="Describe your feedback in detail..."
        />

        <LoginPrimaryButton
          label="Submit feedback"
          disabled={!canSubmit}
          loading={submitting}
          loadingLabel="Submitting..."
          onPress={handleSubmit}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: loginColors.surfaceContainerLowest,
  },
  scrollContent: {
    padding: loginSpacing.containerMargin,
    paddingBottom: loginSpacing.stackLg,
  },
  heading: {
    ...loginTypography.headlineMd,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackSm,
  },
  subheading: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackLg,
  },
});
