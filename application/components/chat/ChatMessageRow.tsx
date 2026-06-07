import { ChatMessage } from "@/services/Chat.service";
import { MomentService } from "@/services/Moment.service";
import { themeColors } from "@/themes/themes";
import { Pressable, Text } from "react-native";
import { YStack } from "tamagui";

export const ChatMessageRow = ({
  message,
  isOwnMessage,
  senderLabel,
  onLongPress,
}: {
  message: ChatMessage;
  isOwnMessage: boolean;
  senderLabel: string;
  onLongPress?: () => void;
}) => {
  const bubble = (
    <YStack
      maxWidth="80%"
      paddingHorizontal={10}
      paddingVertical={8}
      borderRadius={15}
      backgroundColor={
        isOwnMessage ? themeColors.accent : themeColors.lightGray
      }
      gap={2}
    >
      <Text
        style={{
          fontSize: 11,
          color: isOwnMessage
            ? "rgba(255,255,255,0.75)"
            : "rgba(0,0,0,0.5)",
        }}
      >
        {senderLabel}
      </Text>
      <Text style={{ color: isOwnMessage ? themeColors.light : themeColors.onyx }}>
        {message.message}
      </Text>
    </YStack>
  );

  return (
    <YStack
      alignItems={isOwnMessage ? "flex-end" : "flex-start"}
      marginBottom={10}
      gap={4}
    >
      {!isOwnMessage && onLongPress ? (
        <Pressable onLongPress={onLongPress}>{bubble}</Pressable>
      ) : (
        bubble
      )}
      <Text style={{ fontSize: 10, color: "#888" }}>
        {MomentService.getTimeHHMM(message.sentAt)}
      </Text>
    </YStack>
  );
};
