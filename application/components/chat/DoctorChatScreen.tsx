import { MomentService } from "@/services/Moment.service";
import { useRouter } from "expo-router";
import { useContext, useEffect } from "react";
import { UserList } from "../common/UserList";
import { ChatMetadataContext } from "./ChatContext";
import { ChatUserInfo } from "./ChatUserInfo";

export const DoctorChatScreen = () => {
  const router = useRouter();
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
          params: { id: `${user.id}` },
        });
      }}
    />
  );
};
