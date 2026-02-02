import { ChatService } from "@/services/Chat.service";
import { KeyboardAvoidingView } from "react-native";
import { YStack } from "tamagui";
import { MessageList } from "./MessageList";
import { MessageTextBox } from "./MessageTextBox";

export const ChatContainer = ({ chatId }: { chatId: string }) => {
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <YStack
        flex={1}
        padding={5}
        justifyContent="space-between"
        alignItems="stretch"
      >
        <MessageList chatId={chatId} />
        <MessageTextBox
          onSend={(text) => {
            return ChatService.send(text, chatId);
          }}
        />
      </YStack>
    </KeyboardAvoidingView>
  );
};
