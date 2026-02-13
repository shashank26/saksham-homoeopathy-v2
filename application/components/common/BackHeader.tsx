import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { XStack } from "tamagui";

export const BackHeader = ({ title }: { title: JSX.Element }) => {
  const router = useRouter();

  return (
    <XStack
      style={{
        backgroundColor: themeColors.plat,
        margin: 5,
        alignItems: 'center',
        borderRadius: 10
      }}
    >
      <TouchableOpacity
        style={{
          borderRadius: 100,
          padding: 5,
        }}
        onPress={() => {
          router.back();
        }}
      >
        <MaterialIcons name="arrow-back" size={24} color={themeColors.accent} />
      </TouchableOpacity>
      {title}
    </XStack>
  );
};
