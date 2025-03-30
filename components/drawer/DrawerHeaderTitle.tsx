import { themeColors } from "@/themes/themes";
import { ParamListBase, RouteProp } from "@react-navigation/native";
import { Text, View } from "@tamagui/core";
import { RouteParams, useNavigation, usePathname } from "expo-router";
import React from "react";

export const DrawerHeaderTitle = ({
  route,
}: {
  route: RouteProp<ParamListBase, string>;
}) => {
  return (
    <View alignItems="flex-end">
      <Text fontFamily="$js7" fontSize="$10" color="$onyx">
        {(route?.params as any)?.title as string || route?.name}
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
