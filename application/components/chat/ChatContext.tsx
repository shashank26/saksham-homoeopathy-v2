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
  const { id: chatId } = useLocalSearchParams();
  const { profile: authProfile } = useAuth();
  const [chatInitiated, setChatInitiated] = useState<-1 | 0 | 1>(-1);
  const [userA, userB] = (chatId as string).split("-");
  console.log("got this chat Id:", chatId);

  useEffect(() => {
    if (!authProfile || !chatId) return;
    ChatService.createChat(chatId as string, userA, userB)
      .then(() => {
        setChatInitiated(1);
      })
      .catch((err) => {
        console.error("Error initiating chat", err);
        setChatInitiated(0);
      });
  }, [chatId]);

  if (chatInitiated === -1 || !chatId) {
    return null;
  }

  return (
    <ChatContext.Provider
      value={{
        chatId: chatId as string,
        userId: authProfile?.id as string,
        receiverId: userA === authProfile?.id ? userB : userA,
        chatInitiated,
        profile: authProfile as UserProfile,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
