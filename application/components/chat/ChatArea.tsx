import { UserProfile } from "@/services/Auth.service";
import { UserService } from "@/services/User.service";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { BackHeader } from "../common/BackHeader";
import { UserInfo } from "../common/UserList";
import { ChatContainer } from "./ChatContainer";
import { ChatContext } from "./ChatContext";
import { Role } from "@/services/Firebase.service";
import { themeColors } from "@/themes/themes";

export const ChatArea = () => {
  const { chatInitiated, receiverId } = useContext(ChatContext)!;
  const [receiverProfile, setReceiverProfile] = useState<UserProfile | null>(
    null,
  );

  useEffect(() => {
    if (receiverId === Role.DOCTOR) {
      UserService.getDoctors().then((doctors) => {
        const doctorProfile: UserProfile = {
          displayName:
            doctors.find((doc) => doc.displayName)?.displayName || "Doctor",
          id: Role.DOCTOR,
          phoneNumber: doctors.map((doc) => doc.phoneNumber).join(", "),
          photoUrl: doctors.find((doc) => doc.photoUrl)?.photoUrl || "",
          role: Role.DOCTOR,
        };
        setReceiverProfile(doctorProfile);
      });
    } else {
      UserService.getUser(receiverId).then((patient) => {
        setReceiverProfile(patient as UserProfile);
      });
    }
  }, [receiverId]);

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
    <View style={{ flex: 1, backgroundColor: themeColors.light }}>
      {receiverId !== Role.DOCTOR ? (
        <BackHeader
          title={<UserInfo user={receiverProfile} />}
          onPress={() => {
            router.navigate("/authorized/home/chat");
          }}
        />
      ) : (
        <UserInfo user={receiverProfile} />
      )}
      <ChatContainer />
    </View>
  );
};
