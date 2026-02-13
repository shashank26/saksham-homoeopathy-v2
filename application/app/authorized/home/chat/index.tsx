import { useAuth } from "@/components/auth/hooks/useAuth";
import { ChatMetadataContext } from "@/components/chat/ChatContext";
import { DoctorChatScreen } from "@/components/chat/DoctorChatScreen";
import { PatientChatScreen } from "@/components/chat/PatientChatScreen";
import { ChatMetadata, ChatService } from "@/services/Chat.service";
import { Role } from "@/services/Firebase.service";
import { useEffect, useState } from "react";

const Index: React.FC = () => {
  const { role, profile } = useAuth();
  const [chatMetadata, setChatMetadata] = useState<Map<string, ChatMetadata>>(
    new Map(),
  );
  useEffect(() => {
    if (!profile?.id) return;
    ChatService.listenToChatMetadata(profile?.id, (metadata) => {
      if (!metadata) return;
      setChatMetadata(metadata);
    });
  }, [profile?.id]);

  return (
    <ChatMetadataContext.Provider value={chatMetadata}>
      {role === Role.DOCTOR ? <DoctorChatScreen /> : <PatientChatScreen />}
    </ChatMetadataContext.Provider>
  );
};

export default Index;
