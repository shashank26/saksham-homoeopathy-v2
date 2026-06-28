import { useRouter } from "expo-router";
import { useContext } from "react";
import { UserList } from "../common/UserList";
import { ChatMetadataContext } from "./ChatContext";
import { ChatUserInfo } from "./ChatUserInfo";

export const DoctorChatScreen = () => {
  const router = useRouter();
  const chatMetadata = useContext(ChatMetadataContext);

  return (
    <UserList
      sort={(a, b) => {
        const aTime = chatMetadata?.get(a.id)?.lastMessageAt?.getTime() ?? 0;
        const bTime = chatMetadata?.get(b.id)?.lastMessageAt?.getTime() ?? 0;
        return bTime - aTime;
      }}
      Renderer={ChatUserInfo}
      onPress={(user) => {
        router.push({
          pathname: `/authorized/home/chat/[id]`,
          params: { id: `${user.id}` },
        });
      }}
    />
  );
};
