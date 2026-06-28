import { LoaderScreen } from "@/components/LoaderScreen";
import { BlockDoctorPickerSheet } from "@/components/moderation/BlockDoctorPickerSheet";
import { ReportReasonSheet } from "@/components/moderation/ReportReasonSheet";
import { UserProfile } from "@/services/Auth.service";
import { Role } from "@/services/Firebase.service";
import { ModerationService } from "@/services/Moderation.service";
import { UserService } from "@/services/User.service";
import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { toast } from "burnt";
import { router } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { XStack } from "tamagui";
import { BackHeader } from "../common/BackHeader";
import { UserInfo } from "../common/UserList";
import { ChatContainer } from "./ChatContainer";
import { ChatContext } from "./ChatContext";

export const ChatArea = () => {
  const { chatInitiated, receiverId, chatId, profile } =
    useContext(ChatContext)!;
  const [receiverProfile, setReceiverProfile] = useState<UserProfile | null>(
    null,
  );
  const [reportSheetOpen, setReportSheetOpen] = useState(false);
  const [blockPickerOpen, setBlockPickerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  const blockPatient = () => {
    Alert.alert(
      "Block user?",
      "You will no longer be able to send messages to each other.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: async () => {
            const success = await ModerationService.blockUser(
              profile.id,
              receiverId,
              chatId,
            );
            if (success) {
              toast({ title: "User blocked", preset: "done" });
            } else {
              toast({ title: "Could not block user", preset: "error" });
            }
          },
        },
      ],
    );
  };

  const showActionsMenu = () => {
    setMenuOpen(true);
    Alert.alert("Chat actions", undefined, [
      {
        text: "Report User",
        onPress: () => setReportSheetOpen(true),
      },
      {
        text: "Block User",
        style: "destructive",
        onPress: () => {
          if (receiverId === Role.DOCTOR) {
            setBlockPickerOpen(true);
          } else {
            blockPatient();
          }
        },
      },
      { text: "Cancel", style: "cancel", onPress: () => setMenuOpen(false) },
    ]);
    setMenuOpen(false);
  };

  const handleReportUser = async (
    reason: Parameters<typeof ModerationService.submitUserReport>[0]["reason"],
    details?: string,
    reportedUserId?: string,
  ) => {
    const reportedUserIds = reportedUserId
      ? [reportedUserId]
      : [receiverId];
    const success = await ModerationService.submitUserReport({
      reason,
      details,
      reporterId: profile.id,
      reporterPhone: profile.phoneNumber,
      reportedUserIds,
      chatId,
    });

    if (success) {
      toast({
        title: "Report submitted",
        message: "The clinic administrator has been notified.",
        preset: "done",
      });
    } else {
      toast({
        title: "Could not submit report",
        preset: "error",
      });
    }

    return success;
  };

  if (chatInitiated === -1 || !receiverProfile) {
    return <LoaderScreen />;
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

  const headerTitle = (
    <XStack flex={1}>
      <View style={{ flex: 1, width: "90%" }}>
        <UserInfo user={receiverProfile} />
      </View>
      <Pressable
        onPress={showActionsMenu}
        style={{ padding: 8 }}
        disabled={menuOpen}
      >
        <MaterialIcons
          name="more-vert"
          size={24}
          color={themeColors.accent}
        />
      </Pressable>
    </XStack>
  );

  return (
    <View style={{ flex: 1, backgroundColor: themeColors.light }}>
      {receiverId !== Role.DOCTOR ? (
        <BackHeader
          title={headerTitle}
          onPress={() => {
            router.navigate("/authorized/home/chat");
          }}
        />
      ) : (
        <View style={{ margin: 5, height: 60 }}>
          {headerTitle}
        </View>
      )}
      <ChatContainer />
      <ReportReasonSheet
        open={reportSheetOpen}
        onOpenChange={setReportSheetOpen}
        title="Report User"
        showDoctorPicker={receiverId === Role.DOCTOR}
        onSubmit={handleReportUser}
      />
      <BlockDoctorPickerSheet
        open={blockPickerOpen}
        onOpenChange={setBlockPickerOpen}
        blockerId={profile.id}
        chatId={chatId}
      />
    </View>
  );
};
