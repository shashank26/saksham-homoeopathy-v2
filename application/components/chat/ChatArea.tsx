import { UserService } from "@/services/User.service";
import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { BackHeader } from "../common/BackHeader";
import { UserInfo } from "../common/UserList";
import { ChatContainer } from "./ChatContainer";
import { ChatContext } from "./ChatContext";
import { UserProfile } from "@/services/Auth.service";
import { Spinner } from "tamagui";
import { themeColors } from "@/themes/themes";
import { router } from "expo-router";

export const ChatArea = () => {
  const { chatInitiated, receiverId } = useContext(ChatContext)!;
  const [receiverProfile, setReceiverProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    UserService.getUser(receiverId as string)
      .then((profile) => {
        setReceiverProfile(profile);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [receiverId]);

  if (loading) {
    return <Spinner color={themeColors.plat} />;
  }

  if (chatInitiated === -1 || !receiverProfile) {
    return <></>;
  }

  if (chatInitiated === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <BackHeader
          title={<Text>Chat Unavailable</Text>}
          onPress={() => {
            router.navigate("/authorized/home/chat");
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <BackHeader
        title={<UserInfo user={receiverProfile} />}
        onPress={() => {
          router.navigate("/authorized/home/chat");
        }}
      />
      <ChatContainer />
    </View>
  );
};
