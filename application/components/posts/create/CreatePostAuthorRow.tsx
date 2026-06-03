import { useAuth } from "@/components/auth/hooks/useAuth";
import { ShimmerImage } from "@/components/common/ShimmerImage";
import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { Ionicons } from "@expo/vector-icons";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";

const AVATAR_SIZE = 40;

function formatDoctorName(displayName: string): string {
  const trimmed = displayName.trim();
  if (!trimmed) return "Doctor";
  if (/^dr\.?\s/i.test(trimmed)) return trimmed;
  return `Dr. ${trimmed}`;
}

export const CreatePostAuthorRow: FC = () => {
  const { profile } = useAuth();
  const name = formatDoctorName(profile?.displayName ?? "");

  return (
    <View style={styles.row}>
      {profile?.photoUrl ? (
        <View style={styles.avatarBorder}>
          <ShimmerImage
            size={{ height: AVATAR_SIZE, width: AVATAR_SIZE }}
            borderRadius={AVATAR_SIZE / 2}
            url={profile.photoUrl}
          />
        </View>
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Ionicons
            name="person"
            size={22}
            color={loginColors.onPrimaryFixedVariant}
          />
        </View>
      )}
      <View style={styles.textCol}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Practitioner</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: loginSpacing.stackLg,
  },
  avatarBorder: {
    borderRadius: AVATAR_SIZE / 2,
    overflow: "hidden",
    marginRight: loginSpacing.stackMd,
  },
  avatarPlaceholder: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    backgroundColor: loginColors.primaryContainer,
    alignItems: "center",
    justifyContent: "center",
    marginRight: loginSpacing.stackMd,
  },
  textCol: {
    flex: 1,
  },
  name: {
    ...loginTypography.labelMd,
    color: loginColors.onSurface,
    marginBottom: 4,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: loginColors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "Manrope_700Bold",
    color: loginColors.onSecondaryContainer,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
