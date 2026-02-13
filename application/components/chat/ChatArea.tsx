import { useContext, useEffect, useState } from "react";
import { ChatContext } from "./ChatContext";
import { BackHeader } from "../common/BackHeader";
import { UserInfo } from "../common/UserList";
import { ChatContainer } from "./ChatContainer";
import { Text, View } from "react-native";
import { UserProfile } from "@/services/Auth.service";
import { UserService } from "@/services/User.service";

export const ChatArea = () => {
  const { chatInitiated, receiverId } = useContext(ChatContext)!;
  const receiverProfile = UserService.getUser(receiverId);

  if (chatInitiated === -1 || !receiverProfile) {
    return <></>;
  }

  if (chatInitiated === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <BackHeader title={<Text>Chat Unavailable</Text>} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
        <BackHeader title={<UserInfo user={receiverProfile} />} />
      <ChatContainer />
    </View>
  );
};
