import { themeColors } from "@/themes/themes";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet, View } from "react-native";

export const FloatingRoundButton = ({
  onPress,
  icon = <Ionicons name="add" size={24} color="white" />,
}: {
  onPress: () => void;
  icon?: JSX.Element;
}) => {
  return (
    <View style={styles.floatingButtonContainer}>
      <TouchableOpacity style={styles.floatingButton} onPress={onPress}>
        {icon}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButtonContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: themeColors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
