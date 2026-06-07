import { ChatService } from "@/services/Chat.service";
import { ModerationService } from "@/services/Moderation.service";
import { useHeaderHeight } from "@react-navigation/elements";
import { toast } from "burnt";
import { useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text } from "react-native";
import { YStack } from "tamagui";
import { ChatContext } from "./ChatContext";
import { MessageList } from "./MessageList";
import { MessageTextBox } from "./MessageTextBox";

export const ChatContainer = () => {
  const { chatId, receiverId, userId } = useContext(ChatContext)!;
  const headerHeight = useHeaderHeight();
  const offset = headerHeight;
  const [interactionBlocked, setInteractionBlocked] = useState(false);

  useEffect(() => {
    const unsub = ModerationService.onChatInputDisabledUpdate(
      userId,
      receiverId,
      setInteractionBlocked,
    );
    return unsub;
  }, [chatId, receiverId, userId]);

  const handleSend = async (text: string) => {
    const canInteract = await ModerationService.canInteract(
      userId,
      receiverId,
      chatId,
    );

    if (!canInteract) {
      toast({
        title: "Message not sent",
        message: "You can't send messages in this chat.",
        preset: "error",
      });
      return;
    }

    return ChatService.send(text, chatId, receiverId);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={offset}
    >
      <YStack flex={1} padding={5}>
        <MessageList chatId={chatId} />
        {interactionBlocked ? (
          <Text
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: 13,
              paddingVertical: 8,
            }}
          >
            You can&apos;t send messages in this chat.
          </Text>
        ) : null}
        <MessageTextBox
          onSend={handleSend}
          disabled={interactionBlocked}
        />
      </YStack>
    </KeyboardAvoidingView>
  );
};
