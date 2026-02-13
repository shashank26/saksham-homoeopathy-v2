import { ChatMetadata, ChatService } from "@/services/Chat.service";
import { Role } from "@/services/Firebase.service";
import { createContext, useEffect, useState } from "react";
import { useAuth } from "../auth/hooks/useAuth";
import { UserProfile } from "@/services/Auth.service";
import { useLocalSearchParams } from "expo-router";

export type ChatContextType = {
  chatId: string;
  userId: string;
  receiverId: string;
  chatInitiated: -1 | 0 | 1;
  profile: UserProfile;
};

export const ChatContext = createContext<ChatContextType | null>(null);

export const ChatMetadataContext = createContext<Map<string, ChatMetadata>>(
  new Map(),
);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const { user: id } = useLocalSearchParams();
  const { role, profile: authProfile } = useAuth();
  const [chatInitiated, setChatInitiated] = useState<-1 | 0 | 1>(-1);

  const chatId =
    id && authProfile?.id
      ? role === Role.DOCTOR
        ? `${id}-${authProfile?.id}`
        : `${authProfile?.id}-${id}`
      : null;

  useEffect(() => {
    if (!authProfile || !chatId) return;
    ChatService.createChat(chatId, authProfile.id, id as string)
      .then(() => {
        setChatInitiated(1);
      })
      .catch((err) => {
        console.error("Error initiating chat", err);
        setChatInitiated(0);
      });
  }, [authProfile, chatId]);

  if (chatInitiated === -1 || !authProfile || !chatId || !id) {
    return null;
  }

  return (
    <ChatContext.Provider
      value={{
        chatId,
        userId: authProfile?.id as string,
        receiverId: id as string,
        chatInitiated,
        profile: authProfile as UserProfile,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
