import { ChatMessage } from "@/services/Chat.service";
import { MomentService } from "@/services/Moment.service";
import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text } from "react-native";
import { XStack, YStack } from "tamagui";

export const ChatMessageRow = ({
  message,
  isOwnMessage,
  senderLabel,
  deliveryStatus,
  onLongPress,
  onPress,
  onPrescriptionPress,
}: {
  message: ChatMessage;
  isOwnMessage: boolean;
  senderLabel: string;
  deliveryStatus?: "sending" | "failed";
  onLongPress?: () => void;
  onPress?: () => void;
  onPrescriptionPress?: () => void;
}) => {
  const isGhost = deliveryStatus === "sending";
  const isFailed = deliveryStatus === "failed";
  const isPrescription = message.messageType === "prescription";

  const prescriptionCard = (
    <YStack
      maxWidth="85%"
      paddingHorizontal={12}
      paddingVertical={10}
      borderRadius={12}
      backgroundColor={
        isOwnMessage ? themeColors.accent : themeColors.lightGray
      }
      gap={6}
      borderWidth={1}
      borderColor={
        isOwnMessage ? "rgba(255,255,255,0.3)" : themeColors.accent
      }
    >
      <XStack alignItems="center" gap={8}>
        <MaterialIcons
          name="medication"
          size={22}
          color={isOwnMessage ? themeColors.light : themeColors.accent}
        />
        <Text
          style={{
            fontSize: 11,
            color: isOwnMessage
              ? "rgba(255,255,255,0.75)"
              : "rgba(0,0,0,0.5)",
          }}
        >
          {senderLabel}
        </Text>
      </XStack>
      <Text
        style={{
          color: isOwnMessage ? themeColors.light : themeColors.onyx,
          fontSize: 14,
        }}
      >
        {message.message}
      </Text>
      {onPrescriptionPress ? (
        <Text
          style={{
            fontSize: 11,
            color: isOwnMessage ? "rgba(255,255,255,0.85)" : themeColors.accent,
            fontWeight: "600",
          }}
        >
          Tap to view prescription
        </Text>
      ) : null}
    </YStack>
  );

  const textBubble = (
    <YStack
      maxWidth="80%"
      paddingHorizontal={10}
      paddingVertical={8}
      borderRadius={15}
      backgroundColor={
        isOwnMessage ? themeColors.accent : themeColors.lightGray
      }
      gap={2}
      opacity={isGhost ? 0.55 : 1}
      borderWidth={isFailed ? 1 : 0}
      borderColor={isFailed ? themeColors.accent : "transparent"}
    >
      <Text
        style={{
          fontSize: 11,
          color: isOwnMessage
            ? "rgba(255,255,255,0.75)"
            : "rgba(0,0,0,0.5)",
        }}
      >
        {senderLabel}
      </Text>
      <Text style={{ color: isOwnMessage ? themeColors.light : themeColors.onyx }}>
        {message.message}
      </Text>
    </YStack>
  );

  const bubble = isPrescription ? prescriptionCard : textBubble;

  const wrappedBubble =
    isFailed && onPress ? (
      <Pressable onPress={onPress}>{bubble}</Pressable>
    ) : isPrescription && onPrescriptionPress ? (
      <Pressable onPress={onPrescriptionPress}>{bubble}</Pressable>
    ) : onLongPress ? (
      <Pressable onLongPress={onLongPress}>{bubble}</Pressable>
    ) : (
      bubble
    );

  return (
    <YStack
      alignItems={isOwnMessage ? "flex-end" : "flex-start"}
      marginBottom={10}
      gap={4}
    >
      {wrappedBubble}
      {isFailed ? (
        <Text style={{ fontSize: 10, color: themeColors.accent }}>
          Tap to try again
        </Text>
      ) : (
        <Text style={{ fontSize: 10, color: "#888" }}>
          {MomentService.getTimeHHMM(message.sentAt)}
          {message.editedAt ? " (edited)" : ""}
        </Text>
      )}
    </YStack>
  );
};
