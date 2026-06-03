import { useAuth } from "@/components/auth/hooks/useAuth";
import { ShimmerImage } from "@/components/common/ShimmerImage";
import {
  loginColors,
  loginShadow,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const AVATAR_SIZE = 120;

type ProfileAvatarSectionProps = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ProfileAvatarSection: FC<ProfileAvatarSectionProps> = ({
  setOpen,
}) => {
  const { profile } = useAuth();

  const openPicker = () => setOpen(true);

  if (!profile?.photoUrl) {
    return (
      <View style={styles.wrapper}>
        <Pressable onPress={openPicker}>
          {({ pressed }) => (
            <View style={[styles.placeholder, pressed && styles.pressed]}>
              <Ionicons
                name="camera-outline"
                size={32}
                color={loginColors.primary}
              />
              <Text style={styles.placeholderText}>Add photo</Text>
            </View>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.imageBorder}>
        <ShimmerImage
          onPress={openPicker}
          size={{ height: AVATAR_SIZE, width: AVATAR_SIZE }}
          borderRadius={AVATAR_SIZE / 2}
          url={profile.photoUrl}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    marginBottom: loginSpacing.stackLg,
  },
  placeholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    backgroundColor: loginColors.surfaceContainerLow,
    alignItems: "center",
    justifyContent: "center",
    ...loginShadow.card,
  },
  pressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  placeholderText: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
    marginTop: loginSpacing.stackSm,
  },
  imageBorder: {
    borderRadius: AVATAR_SIZE / 2,
    borderWidth: 2,
    borderColor: loginColors.outlineVariant,
    overflow: "hidden",
  },
});
