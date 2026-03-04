import { ChatArea } from "@/components/chat/ChatArea";
import { ChatProvider } from "@/components/chat/ChatContext";

const ChatScreen = () => {
  return (
    <ChatProvider>
      <ChatArea />
    </ChatProvider>
  );
};

export default ChatScreen;
