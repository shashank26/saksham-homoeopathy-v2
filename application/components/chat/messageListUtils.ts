import {
  ChatMessage,
  PendingChatMessage,
} from "@/services/Chat.service";
import { MomentService } from "@/services/Moment.service";

export type MessageListItem =
  | { type: "message"; id: string; data: ChatMessage }
  | { type: "pending"; id: string; data: PendingChatMessage }
  | { type: "date"; id: string; label: string };

function isSameDay(a: Date, b: Date): boolean {
  return (
    MomentService.getDateWithoutTime(a).getTime() ===
    MomentService.getDateWithoutTime(b).getTime()
  );
}

function messageId(msg: ChatMessage): string {
  return msg.id ?? `${msg.sentAt.getTime()}-${msg.sender}`;
}

function appendDateSeparators(
  messages: { sentAt: Date; id: string }[],
  items: MessageListItem[],
): MessageListItem[] {
  const result: MessageListItem[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    const item = items[i];
    result.push(item);

    const next = messages[i + 1];
    const isLastOfDay = !next || !isSameDay(msg.sentAt, next.sentAt);
    if (isLastOfDay) {
      result.push({
        type: "date",
        id: `date-${MomentService.getDateWithoutTime(msg.sentAt).getTime()}`,
        label: MomentService.getChatDateLabel(msg.sentAt),
      });
    }
  }

  return result;
}

export function buildMessageListItems(
  messages: ChatMessage[],
  pendingMessages: PendingChatMessage[] = [],
): MessageListItem[] {
  if (messages.length === 0 && pendingMessages.length === 0) return [];

  const pendingAsMessages: ChatMessage[] = pendingMessages.map((p) => ({
    message: p.message,
    sender: p.sender,
    sentAt: p.sentAt,
    id: p.clientId,
  }));

  const merged = [...pendingAsMessages, ...messages].sort(
    (a, b) => b.sentAt.getTime() - a.sentAt.getTime(),
  );

  const messageItems: MessageListItem[] = merged.map((msg) => {
    const pending = pendingMessages.find((p) => p.clientId === msg.id);
    if (pending) {
      return { type: "pending", id: pending.clientId, data: pending };
    }
    return { type: "message", id: messageId(msg), data: msg };
  });

  return appendDateSeparators(merged, messageItems);
}
