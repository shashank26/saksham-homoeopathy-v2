import { useAuth } from "@/components/auth/hooks/useAuth";
import { NotificationService } from "@/services/Notification.service";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Text, XStack, YStack } from "tamagui";

export default function Alerts() {
  const { notifications } = useAuth();

  return (
    <FlatList
      data={notifications}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => {
            NotificationService.markAsRead(item.id as string);
          }}
        >
          <XStack
            backgroundColor={"$plat"}
            padding={10}
            margin={10}
            borderRadius={5}
            justifyContent="space-between"
          >
            <Text
              fontFamily={"$js4"}
              fontWeight={"$4"}
              fontSize={"$3"}
              color={"$onyx"}
            >
              {item.message}
            </Text>
            {!item.read && (
              <Ionicons name="alert-circle" size={16} color="red" />
            )}
          </XStack>
        </TouchableOpacity>
      )}
    />
  );
}
