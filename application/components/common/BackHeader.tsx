import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { XStack } from "tamagui";

export const BackHeader = ({
  title,
  onPress,
}: {
  title: JSX.Element;
  onPress?: () => void;
}) => {
  const router = useRouter();

  return (
    <XStack
      style={{
        backgroundColor: themeColors.plat,
        margin: 5,
        alignItems: "center",
        borderRadius: 10,
      }}
    >
      <TouchableOpacity
        style={{
          borderRadius: 100,
          padding: 5,
        }}
        onPress={() => {
          if (onPress) {
            onPress();
            return;
          }
          router.back();
        }}
      >
        <MaterialIcons name="arrow-back" size={24} color={themeColors.accent} />
      </TouchableOpacity>
      {title}
    </XStack>
  );
};
