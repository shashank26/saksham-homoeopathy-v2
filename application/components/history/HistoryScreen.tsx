import { View } from "react-native";
import { Text } from "@tamagui/core";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { themeColors } from "@/themes/themes";
import { FloatingRoundButton } from "../common/FloatingRoundButton";

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
      <FloatingRoundButton
        onPress={() => console.log("Add new history item")}
      />
    </View>
  );
}
