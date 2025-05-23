import { themeColors } from "@/themes/themes";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { Text, View } from "@tamagui/core";
import { useRouteInfo } from "expo-router/build/hooks";
import React from "react";

export const DrawerHeaderTitle = ({
  route,
}: {
  route: RouteProp<ParamListBase, string>;
}) => {
  const info = useRouteInfo();
  const title =
    info.segments.length > 2
      ? info.segments[2]
      : ((route?.params as any)?.title as string) || route?.name;
  return (
    <View alignItems="flex-end">
      <Text fontFamily="$js7" fontSize="$10" color="$onyx" textTransform="capitalize">
        {title}
      </Text>
      <View
        borderRadius={2}
        height={5}
        width={"70%"}
        backgroundColor={themeColors.accent}
      />
    </View>
  );
};
