import { MaterialIcons } from "@expo/vector-icons";
import { Pressable } from "react-native-gesture-handler";

export const renderRightActions = (onDelete: () => void) => (
  <Pressable
    onPress={onDelete}
    style={{
      justifyContent: "center",
      alignItems: "center",
      width: 80,
    }}
  >
    <MaterialIcons name="delete" size={32} color={"#ff0000"} />
  </Pressable>
);
