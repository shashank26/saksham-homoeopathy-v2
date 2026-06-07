import { ChatMessage } from "@/services/Chat.service";
import { MomentService } from "@/services/Moment.service";

export type MessageListItem =
  | { type: "message"; id: string; data: ChatMessage }
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

export function buildMessageListItems(
  messages: ChatMessage[],
): MessageListItem[] {
  if (messages.length === 0) return [];

  const items: MessageListItem[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i];
    items.push({ type: "message", id: messageId(msg), data: msg });

    const next = messages[i + 1];
    const isLastOfDay = !next || !isSameDay(msg.sentAt, next.sentAt);
    if (isLastOfDay) {
      items.push({
        type: "date",
        id: `date-${MomentService.getDateWithoutTime(msg.sentAt).getTime()}`,
        label: MomentService.getChatDateLabel(msg.sentAt),
      });
    }
  }

  return items;
}
