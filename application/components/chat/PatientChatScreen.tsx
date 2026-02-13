import { Role } from "@/services/Firebase.service";
import { UserList } from "../common/UserList";
import { useRouter } from "expo-router";
import { ChatMetadataContext } from "./ChatContext";
import { useContext } from "react";
import { MomentService } from "@/services/Moment.service";
import { ChatUserInfo } from "./ChatUserInfo";

export const PatientChatScreen = () => {
  const router = useRouter();
  const chatMetadata = useContext(ChatMetadataContext);
  return (
    <UserList
      filter={(user) => user.role === Role.DOCTOR}
      sort={(a, b) => {
        const aMeta = chatMetadata.get(a.id);
        const bMeta = chatMetadata.get(b.id);

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
          pathname: "/authorized/home/chat/[user]",
          params: {
            user: user.id,
          },
        });
      }}
    />
  );
};
