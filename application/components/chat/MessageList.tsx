import { ChatMessage, ChatService } from "@/services/Chat.service";
import { MomentService } from "@/services/Moment.service";
import { UserService } from "@/services/User.service";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Text } from "react-native";
import { View, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";
import { ChatMessageRow } from "./ChatMessageRow";
import { DateSeparator } from "./DateSeparator";
import { DateToast } from "./DateToast";
import {
  buildMessageListItems,
  MessageListItem,
} from "./messageListUtils";

export const MessageList = ({ chatId }: { chatId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { profile } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const [visibleDate, setVisibleDate] = useState("");
  const [showDate, setShowDate] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastDocRef = useRef<any>(null);
  const loadingOlder = useRef(false);
  const [senderLabels, setSenderLabels] = useState<Map<string, string>>(
    new Map(),
  );

  const listItems = useMemo(
    () => buildMessageListItems(messages),
    [messages],
  );

  useEffect(() => {
    const unsub = ChatService.listenToLatestMessages(
      chatId,
      30,
      (messages, lastDoc) => {
        setMessages(messages);
        lastDocRef.current = lastDoc;
      },
    );
    return () => {
      unsub();
    };
  }, [chatId]);

  useEffect(() => {
    if (!messages.length) return;

    const senderIds = [...new Set(messages.map((m) => m.sender))];
    let cancelled = false;

    const resolveSenders = async () => {
      const labels = new Map<string, string>();

      await Promise.all(
        senderIds.map(async (senderId) => {
          if (senderId === profile?.id) {
            labels.set(senderId, "You");
            return;
          }

          const user = await UserService.getUser(senderId);
          const label =
            user?.displayName || user?.phoneNumber || "Unknown";
          labels.set(senderId, label);
        }),
      );

      if (!cancelled) {
        setSenderLabels(labels);
      }
    };

    resolveSenders();

    return () => {
      cancelled = true;
    };
  }, [messages, profile?.id]);

  const loadOlderMessages = async () => {
    if (!lastDocRef.current || loadingOlder.current) return;

    loadingOlder.current = true;

    const olderMessages = await ChatService.fetchOlderMessages(
      chatId,
      lastDocRef.current,
    );

    if (olderMessages.length) {
      setMessages((prev) => [...prev, ...olderMessages]);
      lastDocRef.current = lastDocRef.current;
    }

    loadingOlder.current = false;
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (!viewableItems.length) return;

    const topVisible = viewableItems[viewableItems.length - 1]?.item as
      | MessageListItem
      | undefined;
    if (!topVisible) return;

    const date =
      topVisible.type === "message"
        ? MomentService.getDDMMMYYY(topVisible.data.sentAt)
        : topVisible.label;

    setVisibleDate(date);
    setShowDate(true);

    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setShowDate(false);
    }, 800);
  }).current;

  const getSenderLabel = (senderId: string) => {
    if (senderId === profile?.id) return "You";
    return senderLabels.get(senderId) ?? "…";
  };

  if (messages.length === 0) {
    return (
      <YStack style={{ flex: 1 }} justifyContent="center" alignItems="center">
        <Text style={{ color: "#999", fontSize: 16 }}>No messages yet</Text>
      </YStack>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <DateToast date={visibleDate} visible={showDate} />

      <FlatList
        ref={flatListRef}
        data={listItems}
        inverted={true}
        keyExtractor={(item) => item.id}
        onEndReached={loadOlderMessages}
        onEndReachedThreshold={0.1}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 20 }}
        renderItem={({ item }: { item: MessageListItem }) => {
          if (item.type === "date") {
            return <DateSeparator label={item.label} />;
          }

          const isOwnMessage = item.data.sender === profile?.id;
          return (
            <ChatMessageRow
              message={item.data}
              isOwnMessage={isOwnMessage}
              senderLabel={getSenderLabel(item.data.sender)}
            />
          );
        }}
      />
    </View>
  );
};
