import { useAuth } from "@/components/auth/hooks/useAuth";
import { ChatContainer } from "@/components/chat/ChatContainer";
import { MessageList } from "@/components/chat/MessageList";
import { MessageTextBox } from "@/components/chat/MessageTextBox";
import { BackHeader } from "@/components/common/BackHeader";
import { UserInfo } from "@/components/common/UserList";
import { AddMedicine } from "@/components/history/admin/AddMedicine";
import { UserHistoryScreen } from "@/components/history/user/UserHistoryScreen";
import { ChatService } from "@/services/Chat.service";
import { Role } from "@/services/Firebase.service";
import { UserService } from "@/services/User.service";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const ChatScreen = () => {
  const { user: id } = useLocalSearchParams();
  const profile = UserService.getUser(id as string);
  const { role, profile: authProfile } = useAuth();
  if (!profile) {
    return <></>;
  }
  const chatId =
    role === Role.DOCTOR ? (id as string) : (authProfile?.id as string);
  return (
    <View style={{ flex: 1 }}>
      <BackHeader title={<UserInfo user={profile} />} />
      <ChatContainer chatId={chatId} />
    </View>
  );
};

export default ChatScreen;
