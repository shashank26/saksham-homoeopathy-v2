import { useRouter } from "expo-router";
import { UserList } from "../common/UserList";
import { ChatUserInfo } from "./ChatUserInfo";
import { useContext } from "react";
import { ChatMetadataContext } from "./ChatContext";
import { MomentService } from "@/services/Moment.service";
import { useAuth } from "../auth/hooks/useAuth";

export const DoctorChatScreen = () => {
  const router = useRouter();
  const { profile } = useAuth();
  const chatMetadata = useContext(ChatMetadataContext);
  return (
    <UserList
      sort={(a, b) => {
        const aMeta = chatMetadata?.get(a.id);
        const bMeta = chatMetadata?.get(b.id);

        return MomentService.dateDiffInMs(
          bMeta?.lastMessageAt && bMeta?.lastMessage
            ? bMeta.lastMessageAt
            : new Date(0),
          aMeta?.lastMessageAt && aMeta?.lastMessage
            ? aMeta.lastMessageAt
            : new Date(0),
        );
      }}
      Renderer={ChatUserInfo}
      onPress={(user) => {
        router.push({
          pathname: `/authorized/home/chat/[id]`,
          params: { id: `${user.id}-${profile?.id}` },
        });
      }}
    />
  );
};
