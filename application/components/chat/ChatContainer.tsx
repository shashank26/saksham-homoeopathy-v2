import { ChatService } from "@/services/Chat.service";
import { useHeaderHeight } from "@react-navigation/elements";
import { useContext } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { YStack } from "tamagui";
import { ChatContext } from "./ChatContext";
import { MessageList } from "./MessageList";
import { MessageTextBox } from "./MessageTextBox";

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
