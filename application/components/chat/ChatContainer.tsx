import { ChatService } from "@/services/Chat.service";
import { KeyboardAvoidingView } from "react-native";
import { YStack } from "tamagui";
import { MessageList } from "./MessageList";
import { MessageTextBox } from "./MessageTextBox";
import { ChatContext } from "./ChatContext";
import { useContext } from "react";
import { Platform } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

export const ChatContainer = () => {
  const { chatId, receiverId } = useContext(ChatContext)!;
  const headerHeight = useHeaderHeight();
  const offset = headerHeight;
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={offset}
    >
      <YStack flex={1} padding={5}>
        <MessageList chatId={chatId} />
        <MessageTextBox
          onSend={(text) => {
            return ChatService.send(text, chatId, receiverId);
          }}
        />
      </YStack>
    </KeyboardAvoidingView>
  );
};
