import { LoaderScreen } from "@/components/LoaderScreen";
import { ReportReasonSheet } from "@/components/moderation/ReportReasonSheet";
import {
  ChatMessage,
  ChatService,
  PendingChatMessage,
} from "@/services/Chat.service";
import { Role } from "@/services/Firebase.service";
import { ModerationService } from "@/services/Moderation.service";
import { MomentService } from "@/services/Moment.service";
import { UserService } from "@/services/User.service";
import {
  getStaffDisplayLabel,
  isStaffUser,
} from "@/utils/userDisplay";
import { toast } from "burnt";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";
import { ChatMessageRow } from "./ChatMessageRow";
import { EditMessageSheet } from "./EditMessageSheet";
import { DateSeparator } from "./DateSeparator";
import { DateToast } from "./DateToast";
import {
  buildMessageListItems,
  MessageListItem,
} from "./messageListUtils";

type MessageListProps = {
  chatId: string;
  userId: string;
  pendingMessages: PendingChatMessage[];
  onPendingResolved: (clientIds: string[]) => void;
  onRetry: (clientId: string) => void;
};

export const MessageList = ({
  chatId,
  userId,
  pendingMessages,
  onPendingResolved,
  onRetry,
}: MessageListProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasInitialSnapshot, setHasInitialSnapshot] = useState(false);
  const { profile } = useAuth();
  const flatListRef = useRef<FlatList>(null);
  const [visibleDate, setVisibleDate] = useState("");
  const [showDate, setShowDate] = useState(false);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastDocRef = useRef<any>(null);
  const loadingOlder = useRef(false);
  const prevMessageIdsRef = useRef<Set<string>>(new Set());
  const isFirstSnapshotRef = useRef(true);
  const [senderLabels, setSenderLabels] = useState<Map<string, string>>(
    new Map(),
  );
  const [reportSheetOpen, setReportSheetOpen] = useState(false);
  const [reportingMessage, setReportingMessage] = useState<ChatMessage | null>(
    null,
  );
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<ChatMessage | null>(null);

  const listItems = useMemo(
    () => buildMessageListItems(messages, pendingMessages),
    [messages, pendingMessages],
  );

  useEffect(() => {
    setHasInitialSnapshot(false);
    isFirstSnapshotRef.current = true;
    prevMessageIdsRef.current = new Set();
  }, [chatId]);

  useEffect(() => {
    const unsub = ChatService.listenToLatestMessages(
      chatId,
      30,
      (messages, lastDoc) => {
        setMessages(messages);
        lastDocRef.current = lastDoc;
        setHasInitialSnapshot(true);
      },
    );
    return () => {
      unsub();
    };
  }, [chatId]);

  useEffect(() => {
    if (!hasInitialSnapshot) return;

    const currentIds = new Set(
      messages.map((m) => m.id).filter((id): id is string => Boolean(id)),
    );

    if (isFirstSnapshotRef.current) {
      prevMessageIdsRef.current = currentIds;
      isFirstSnapshotRef.current = false;

      const sendingPending = [...pendingMessages]
        .filter((p) => p.status === "sending")
        .reverse();
      const ownMessages = messages.filter((m) => m.sender === userId);
      const usedMessageIds = new Set<string>();
      const resolvedIds: string[] = [];

      for (const pending of sendingPending) {
        const match = ownMessages.find(
          (m) =>
            m.message === pending.message &&
            m.id &&
            !usedMessageIds.has(m.id),
        );
        if (match?.id) {
          resolvedIds.push(pending.clientId);
          usedMessageIds.add(match.id);
        }
      }

      if (resolvedIds.length > 0) {
        onPendingResolved(resolvedIds);
      }
      return;
    }

    const newIds = [...currentIds].filter(
      (id) => !prevMessageIdsRef.current.has(id),
    );
    prevMessageIdsRef.current = currentIds;

    if (newIds.length === 0) return;

    const newOwnCount = messages.filter(
      (m) => m.id && newIds.includes(m.id) && m.sender === userId,
    ).length;

    if (newOwnCount === 0) return;

    const sendingPending = pendingMessages.filter((p) => p.status === "sending");
    const resolvedIds = sendingPending
      .slice(-newOwnCount)
      .map((p) => p.clientId);

    if (resolvedIds.length > 0) {
      onPendingResolved(resolvedIds);
    }
  }, [messages, hasInitialSnapshot, userId, pendingMessages, onPendingResolved]);

  useEffect(() => {
    const allSenders = [
      ...messages.map((m) => m.sender),
      ...pendingMessages.map((p) => p.sender),
    ];
    if (!allSenders.length) return;

    const senderIds = [...new Set(allSenders)];
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
          const label = isStaffUser(user)
            ? getStaffDisplayLabel(user)
            : user?.displayName || user?.phoneNumber || "Unknown";
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
  }, [messages, pendingMessages, profile?.id]);

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
      topVisible.type === "message" || topVisible.type === "pending"
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

  const handleReportMessage = async (
    reason: Parameters<typeof ModerationService.submitMessageReport>[0]["reason"],
    details?: string,
  ) => {
    if (!reportingMessage?.id || !profile) return false;

    const success = await ModerationService.submitMessageReport({
      reason,
      details,
      reporterId: profile.id,
      reporterPhone: profile.phoneNumber,
      reportedUserId: reportingMessage.sender,
      chatId,
      messageId: reportingMessage.id,
      messageText: reportingMessage.message,
    });

    if (success) {
      toast({
        title: "Report submitted",
        message: "The clinic administrator has been notified.",
        preset: "done",
      });
      setReportingMessage(null);
    } else {
      toast({
        title: "Could not submit report",
        preset: "error",
      });
    }

    return success;
  };

  if (!hasInitialSnapshot) {
    return (
      <View style={{ flex: 1 }}>
        <LoaderScreen />
      </View>
    );
  }

  if (messages.length === 0 && pendingMessages.length === 0) {
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

          if (item.type === "pending") {
            return (
              <ChatMessageRow
                message={{
                  message: item.data.message,
                  sender: item.data.sender,
                  sentAt: item.data.sentAt,
                }}
                isOwnMessage={true}
                senderLabel={getSenderLabel(item.data.sender)}
                deliveryStatus={item.data.status}
                onPress={
                  item.data.status === "failed"
                    ? () => onRetry(item.data.clientId)
                    : undefined
                }
              />
            );
          }

          const isOwnMessage = item.data.sender === profile?.id;
          const isPrescription = item.data.messageType === "prescription";
          const canEditOwnMessage =
            isOwnMessage &&
            profile?.role === Role.DOCTOR &&
            !isPrescription;

          return (
            <ChatMessageRow
              message={item.data}
              isOwnMessage={isOwnMessage}
              senderLabel={getSenderLabel(item.data.sender)}
              onPrescriptionPress={
                isPrescription
                  ? () => {
                      if (profile?.role === Role.USER) {
                        router.navigate("/authorized/home/history");
                      } else {
                        router.navigate({
                          pathname: "/authorized/home/history/[user]",
                          params: { user: chatId },
                        });
                      }
                    }
                  : undefined
              }
              onLongPress={
                isPrescription
                  ? undefined
                  : canEditOwnMessage
                    ? () => {
                        Alert.alert("Message", undefined, [
                          {
                            text: "Edit",
                            onPress: () => {
                              setEditingMessage(item.data);
                              setEditSheetOpen(true);
                            },
                          },
                          { text: "Cancel", style: "cancel" },
                        ]);
                      }
                    : !isOwnMessage
                      ? () => {
                          setReportingMessage(item.data);
                          setReportSheetOpen(true);
                        }
                      : undefined
              }
            />
          );
        }}
      />

      <ReportReasonSheet
        open={reportSheetOpen}
        onOpenChange={(open) => {
          setReportSheetOpen(open);
          if (!open) setReportingMessage(null);
        }}
        title="Report Message"
        onSubmit={handleReportMessage}
      />
      <EditMessageSheet
        chatId={chatId}
        message={editingMessage}
        open={editSheetOpen}
        onOpenChange={(open) => {
          setEditSheetOpen(open);
          if (!open) setEditingMessage(null);
        }}
      />
    </View>
  );
};
