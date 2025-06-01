import { themeColors } from "@/themes/themes";
import { Text } from "@tamagui/core";
import { View } from "react-native";

export function HistoryScreen() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: themeColors.plat,
      }}
    >
      <Text>History</Text>
    </View>
  );
}
