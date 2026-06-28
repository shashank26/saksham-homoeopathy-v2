import {
  ChatService,
  PendingChatMessage,
} from "@/services/Chat.service";
import { ModerationService } from "@/services/Moderation.service";
import { useHeaderHeight } from "@react-navigation/elements";
import { toast } from "burnt";
import { useCallback, useContext, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Text } from "react-native";
import { YStack } from "tamagui";
import { ChatContext } from "./ChatContext";
import { MessageList } from "./MessageList";
import { MessageTextBox } from "./MessageTextBox";

function createClientId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const ChatContainer = () => {
  const { chatId, receiverId, userId } = useContext(ChatContext)!;
  const headerHeight = useHeaderHeight();
  const offset = headerHeight;
  const [interactionBlocked, setInteractionBlocked] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<PendingChatMessage[]>(
    [],
  );

  useEffect(() => {
    const unsub = ModerationService.onChatInputDisabledUpdate(
      userId,
      receiverId,
      setInteractionBlocked,
    );
    return unsub;
  }, [chatId, receiverId, userId]);

  const sendMessage = useCallback(
    async (text: string, clientId: string) => {
      try {
        await ChatService.send(text, chatId, receiverId);
      } catch {
        setPendingMessages((prev) =>
          prev.map((p) =>
            p.clientId === clientId ? { ...p, status: "failed" as const } : p,
          ),
        );
        throw new Error("send failed");
      }
    },
    [chatId, receiverId],
  );

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

    const clientId = createClientId();
    const pending: PendingChatMessage = {
      clientId,
      message: text,
      sender: userId,
      sentAt: new Date(),
      status: "sending",
    };

    setPendingMessages((prev) => [pending, ...prev]);
    await sendMessage(text, clientId);
  };

  const handleRetry = async (clientId: string) => {
    const pending = pendingMessages.find((p) => p.clientId === clientId);
    if (!pending || pending.status !== "failed") return;

    setPendingMessages((prev) =>
      prev.map((p) =>
        p.clientId === clientId ? { ...p, status: "sending" as const } : p,
      ),
    );

    try {
      await sendMessage(pending.message, clientId);
    } catch {
      toast({
        title: "Failed to send message",
        preset: "error",
      });
    }
  };

  const handlePendingResolved = useCallback((clientIds: string[]) => {
    if (clientIds.length === 0) return;
    setPendingMessages((prev) =>
      prev.filter((p) => !clientIds.includes(p.clientId)),
    );
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={offset}
    >
      <YStack flex={1} padding={5}>
        <MessageList
          chatId={chatId}
          userId={userId}
          pendingMessages={pendingMessages}
          onPendingResolved={handlePendingResolved}
          onRetry={handleRetry}
        />
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
