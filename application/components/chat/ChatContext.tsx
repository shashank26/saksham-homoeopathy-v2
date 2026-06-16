import { LoaderScreen } from "@/components/LoaderScreen";
import { ChatMetadata, ChatService } from "@/services/Chat.service";
import { Role } from "@/services/Firebase.service";
import { createContext, useEffect, useState } from "react";
import { useAuth } from "../auth/hooks/useAuth";
import { UserProfile } from "@/services/Auth.service";
import { useLocalSearchParams } from "expo-router";
import { UserService } from "@/services/User.service";

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
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    const patient = chatId as string;
    UserService.getDoctors().then((doctors) => {
      const participants = [];
      participants.push(...doctors.map((doctor) => doctor.id));
      participants.push(patient);
      setParticipants(participants);
    });
  }, [chatId]);

  useEffect(() => {
    if (!authProfile || participants.length === 0) return;
    ChatService.createChat(chatId as string, participants)
      .then(() => {
        setChatInitiated(1);
      })
      .catch((err) => {
        console.error("Error initiating chat", err);
        setChatInitiated(0);
      });
  }, [participants, authProfile]);

  if (chatInitiated === -1 || !chatId) {
    return <LoaderScreen />;
  }

  return (
    <ChatContext.Provider
      value={{
        chatId: chatId as string,
        userId: authProfile?.id as string,
        receiverId:
          authProfile?.id === chatId ? Role.DOCTOR : (chatId as string),
        chatInitiated,
        profile: authProfile as UserProfile,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
