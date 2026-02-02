import { ChatMessage, ChatService } from "@/services/Chat.service";
import { MomentService } from "@/services/Moment.service";
import { useEffect, useRef, useState } from "react";
import { FlatList } from "react-native";
import { Text, View, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";
import { DateToast } from "./DateToast";

export const MessageList = ({ chatId }: { chatId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { profile } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const [visibleDate, setVisibleDate] = useState("");
  const [showDate, setShowDate] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastDocRef = useRef<any>(null);
  const loadingOlder = useRef(false);

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

  const loadOlderMessages = async () => {
    if (!lastDocRef.current || loadingOlder.current) return;

    loadingOlder.current = true;

    const olderMessages = await ChatService.fetchOlderMessages(
      chatId,
      lastDocRef.current,
    );

    if (olderMessages.length) {
      setMessages((prev) => [...prev, ...olderMessages]);
      lastDocRef.current = lastDocRef.current; // updated internally by Firestore
    }

    loadingOlder.current = false;
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (!viewableItems.length) return;

    const firstItem = viewableItems[viewableItems.length - 1].item;
    const date = MomentService.getDDMMMYYY(firstItem.sentAt);

    setVisibleDate(date);
    setShowDate(true);

    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    hideTimeout.current = setTimeout(() => {
      setShowDate(false);
    }, 800);
  }).current;

  return (
    <View style={{ flex: 1 }}>
      <DateToast date={visibleDate} visible={showDate} />

      <FlatList
        ref={flatListRef}
        data={messages}
        inverted={true}
        onEndReached={loadOlderMessages}
        onEndReachedThreshold={0.1}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 20 }}
        renderItem={({ item, index }) => {
          const isOwnMessage = item.sender === profile?.id;
          return (
            <YStack alignItems={isOwnMessage ? "flex-end" : "flex-start"} key={index} marginBottom={10} gap={4}>
              <Text
                maxWidth={"70%"}
                paddingHorizontal={10}
                paddingVertical={5}
                borderRadius={15}
                backgroundColor={isOwnMessage ? "$accent" : "$onyx"}
                color={"$light"}
                key={index}
              >
                {item.message}
              </Text>
              <Text fontSize={"10"} color={"#999"}>
                {MomentService.getTimeHHMM(item.sentAt)}
              </Text>
            </YStack>
          );
        }}
      />
    </View>
  );
};
