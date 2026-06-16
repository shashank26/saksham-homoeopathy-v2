import { UserProfile } from "@/services/Auth.service";
import { Role } from "@/services/Firebase.service";
import { MomentService } from "@/services/Moment.service";
import { themeColors } from "@/themes/themes";
import EvilIcons from "@expo/vector-icons/build/EvilIcons";
import React, { useContext } from "react";
import { Text as Txt, TouchableOpacity, View } from "react-native";
import { Text, XStack, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";
import { ShimmerImage } from "../common/ShimmerImage";
import { ChatMetadataContext } from "./ChatContext";

export const ChatUserInfo = ({
  user,
  onPress,
}: {
  user: UserProfile;
  onPress?: () => void;
}) => {
  const { profile } = useAuth()!;
  const chatMetadataMap = useContext(ChatMetadataContext)!;
  const metaData = chatMetadataMap.get(user.id);
  const unreadCount =
    metaData?.unreadCount[
      profile?.role === Role.DOCTOR ? Role.DOCTOR : (profile?.id as string)
    ] || 0;
  const lastMessage = metaData?.lastMessage || "";
  const lastMessageAt = metaData?.lastMessageAt;

  const view = (
    <XStack
      gap={15}
      style={{
        backgroundColor: themeColors.plat,
        width: "100%",
        paddingHorizontal: 2,
        paddingVertical: 8,
        borderBottomColor: themeColors.lightGray,
        borderBottomWidth: 1,
      }}
    >
      {user.photoUrl ? (
        <ShimmerImage
          key={user.photoUrl}
          url={user.photoUrl}
          size={{
            height: 48,
            width: 48,
          }}
          borderRadius={24}
        />
      ) : (
        <View
          style={{
            height: 48,
            width: 48,
            borderRadius: 24,
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <EvilIcons name="user" color={themeColors.accent} size={48} />
        </View>
      )}
      <YStack justifyContent="center" gap={2} style={{ flex: 1 }}>
        <XStack justifyContent="space-between" alignItems="center">
          <Text
            fontFamily={"$js4"}
            fontSize={"$4"}
            color={themeColors.onyx}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {user.displayName}
          </Text>
          {lastMessageAt ? (
            <Txt
              style={{
                color: unreadCount > 0 ? themeColors.accent : "#999",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              {MomentService.formatTimeMeridian(lastMessageAt)}
            </Txt>
          ) : null}
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <Txt
            style={{ color: "#999" }}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {lastMessage || "Start a conversation"}
          </Txt>
          {unreadCount > 0 ? (
            <View
              style={{
                backgroundColor: themeColors.accent,
                borderRadius: 9,
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                minWidth: 20,
                paddingHorizontal: 4,
                marginLeft: 6,
              }}
            >
              <Txt
                style={{ textAlign: "center", fontSize: 12, color: "#fff" }}
              >
                {unreadCount}
              </Txt>
            </View>
          ) : null}
        </XStack>
      </YStack>
    </XStack>
  );
  return onPress ? (
    <TouchableOpacity onPress={onPress}>{view}</TouchableOpacity>
  ) : (
    view
  );
};
