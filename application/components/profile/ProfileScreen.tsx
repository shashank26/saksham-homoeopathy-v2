import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import { BookingTextField } from "@/components/bookings/user/BookingTextField";
import { LegalLinks } from "@/components/common/LegalLinks";
import { LoaderScreen } from "@/components/LoaderScreen";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import { UserProfile } from "@/services/Auth.service";
import { Monitoring } from "@/services/Monitoring.service";
import { UserService } from "@/services/User.service";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import Constants from "expo-constants";
import { FC, useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useAuth } from "../auth/hooks/useAuth";
import { OverlayActivityIndicator } from "../common/Alert";
import { DrawerSheet } from "../common/DrawerSheet";
import { ImagePicker, MediaPickerResult } from "../common/MediaPicker";
import { ProfileAvatarSection } from "./ProfileAvatarSection";
import { ProfileDeleteButton } from "./ProfileDeleteButton";
import { ProfileDetailsCard } from "./ProfileDetailsCard";
import { ProfilePhoneRow } from "./ProfilePhoneRow";
import { ProfileSignOutButton } from "./ProfileSignOutButton";

function getInitialName(profile: UserProfile | null | undefined): string {
  if (!profile?.displayName) return "";
  if (profile.displayName.trim() === profile.phoneNumber) return "";
  return profile.displayName;
}

type ProfileScreenProps = {
  variant?: "default" | "onboarding";
};

export const ProfileScreen: FC<ProfileScreenProps> = ({
  variant = "default",
}) => {
  const fontsLoaded = useVitalityFonts();
  const { profile, updateProfile, signOut, deleteAccount } = useAuth();
  const appVersion = Constants.expoConfig?.version ?? "1.0.0";
  const [name, setName] = useState(() => getInitialName(profile));
  const [popup, setPopup] = useState({
    visible: false,
    description: "",
    title: "",
  });

  useEffect(() => {
    setName(getInitialName(profile));
  }, [profile?.displayName, profile?.phoneNumber]);

  const setLoading = (visible: boolean, title: string, description: string) => {
    setPopup({ visible, title, description });
  };

  const handleUpdate = async (updated: UserProfile) => {
    setLoading(true, "Please wait", "Updating your profile...");
    try {
      await updateProfile?.(updated);
    } catch (err) {
      Monitoring.captureException(err, {
        area: "profile",
        action: "updateProfile",
      });
    }
    setLoading(false, "", "");
  };

  if (!fontsLoaded) {
    return <LoaderScreen />;
  }

  const isOnboarding = variant === "onboarding";

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View pointerEvents={popup.visible ? "none" : "auto"}>
          <Text style={styles.pageTitle}>
            {isOnboarding ? "Complete your profile" : ""}
          </Text>
          {isOnboarding ? (
            <Text style={styles.subtitle}>
              Add your name and photo so we can personalize your care.
            </Text>
          ) : null}

          <DrawerSheet<MediaPickerResult>
            FC={ProfileAvatarSection}
            Child={ImagePicker}
            onClose={async (data) => {
              if (!data || !profile || "error" in data) return;
              setLoading(true, "Please wait", "Updating your profile picture...");
              try {
                const storageUrl = await UserService.uploadProfileImage(
                  profile.id,
                  data.blob as Blob,
                );
                await updateProfile?.({
                  ...profile,
                  photoUrl: storageUrl as string,
                });
              } catch (err) {
                Monitoring.captureException(err, {
                  area: "profile",
                  action: "uploadProfileImage",
                });
              }
              setLoading(false, "", "");
            }}
          />

          <ProfileDetailsCard>
            <BookingTextField
              label="Display name"
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              required
            />
            <ProfilePhoneRow phoneNumber={profile?.phoneNumber} />
            <LoginPrimaryButton
              label="Save changes"
              disabled={!name.trim()}
              onPress={() => {
                if (!profile || !name.trim()) return;
                void handleUpdate({ ...profile, displayName: name.trim() });
              }}
            />
            <ProfileSignOutButton
              disabled={popup.visible}
              onPress={async () => {
                if (!signOut) return;
                setLoading(true, "Please wait", "Signing out...");
                await signOut();
                setLoading(false, "", "");
              }}
            />
            <ProfileDeleteButton
              disabled={popup.visible || !deleteAccount}
              onDelete={async () => {
                if (!deleteAccount) return;
                setLoading(true, "Please wait", "Deleting your account...");
                try {
                  await deleteAccount();
                } catch (err) {
                  Monitoring.captureException(err, {
                    area: "profile",
                    action: "deleteAccount",
                  });
                  Alert.alert(
                    "Deletion failed",
                    "We could not delete your account. Please try again or email support.",
                  );
                } finally {
                  setLoading(false, "", "");
                }
              }}
            />
            <Text style={styles.version}>App version {appVersion}</Text>
            <View style={styles.legal}>
              <LegalLinks horizontal />
            </View>
          </ProfileDetailsCard>
        </View>
      </ScrollView>
      <OverlayActivityIndicator
        description={popup.description}
        title={popup.title}
        icon={<></>}
        visible={popup.visible}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: loginColors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: loginSpacing.containerMargin,
    paddingVertical: loginSpacing.stackLg,
    paddingBottom: loginSpacing.sectionGap,
  },
  pageTitle: {
    ...loginTypography.headlineLgMobile,
    color: loginColors.onSurface,
    marginBottom: loginSpacing.stackSm,
  },
  subtitle: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackLg,
  },
  version: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
    marginTop: loginSpacing.stackLg,
  },
  legal: {
    marginTop: loginSpacing.stackMd,
    alignItems: "center",
  },
});
