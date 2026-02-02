import { Text } from "react-native";
import { ChatContainer } from "./ChatContainer";
import { useAuth } from "../auth/hooks/useAuth";

export const PatientChatScreen = () => {
  const { profile } = useAuth();
  if (!profile?.id) {
    return <Text>Loading...</Text>;
  }
  return <ChatContainer chatId={profile?.id} />;
};
