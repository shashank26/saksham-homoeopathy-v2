import { themeColors } from "@/themes/themes";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { Text, View } from "@tamagui/core";
import { Link } from "expo-router";
import { useRouteInfo } from "expo-router/build/hooks";
import React from "react";
import { XStack, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";

export const DrawerHeaderTitle = ({
  route,
}: {
  route: RouteProp<ParamListBase, string>;
}) => {
  const info = useRouteInfo();
  const { notifications } = useAuth();
  const unreadNotifications = notifications?.filter((n) => !n.read);
  const title =
    info.segments.length > 2
      ? info.segments[2]
      : ((route?.params as any)?.title as string) || route?.name;
  return (
    <View alignItems="flex-end">
      <XStack alignContent="space-between" gap={10}>
        <YStack>
          <Text
            fontFamily="$js7"
            fontSize="$10"
            color={themeColors.onyx}
            textTransform="capitalize"
          >
            {title}
          </Text>
          <View
            borderRadius={2}
            height={5}
            width={"70%"}
            backgroundColor={themeColors.accent}
          />
        </YStack>
        {unreadNotifications?.length && (
          <Link href={"/authorized/home/alerts"}>
            <View
              style={{
                backgroundColor: "#d00",
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                height: 20,
                width: 20,
              }}
            >
              <Text
                fontFamily="$js4"
                fontSize={"$4"}
                color="#fff"
                style={{ textAlign: "center" }}
              >
                {unreadNotifications.length}
              </Text>
            </View>
          </Link>
        )}
      </XStack>
    </View>
  );
};
