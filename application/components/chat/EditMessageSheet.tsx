import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import { BookingTextField } from "@/components/bookings/user/BookingTextField";
import { ChatMessage, ChatService } from "@/services/Chat.service";
import { loginSpacing } from "@/themes/loginDesign";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import { toast } from "burnt";
import { FC, useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  VitalityDrawerFooter,
  VitalityDrawerSheet,
} from "../common/VitalityDrawerSheet";
import { VitalityDrawerHeader } from "../common/VitalityDrawerHeader";

type EditMessageSheetProps = {
  chatId: string;
  message: ChatMessage | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const EditMessageForm: FC<{
  chatId: string;
  message: ChatMessage;
  onClose: () => void;
}> = ({ chatId, message, onClose }) => {
  const fontsLoaded = useVitalityFonts();
  const [text, setText] = useState(message.message);
  const [loading, setLoading] = useState(false);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.formRoot}>
      <VitalityDrawerHeader title="Edit Message" onClose={onClose} />
      <View style={styles.content}>
        <BookingTextField
          label="Message"
          value={text}
          onChangeText={setText}
          placeholder="Edit your message..."
        />
      </View>
      <VitalityDrawerFooter>
        <LoginPrimaryButton
          label="Save"
          loadingLabel="Saving..."
          disabled={!text.trim() || text.trim() === message.message}
          loading={loading}
          onPress={async () => {
            if (!message.id || !text.trim()) return;
            setLoading(true);
            try {
              await ChatService.updateMessage(
                chatId,
                message.id,
                text.trim(),
              );
              onClose();
            } catch {
              toast({
                title: "Could not edit message",
                preset: "error",
              });
            } finally {
              setLoading(false);
            }
          }}
        />
      </VitalityDrawerFooter>
    </View>
  );
};

export const EditMessageSheet: FC<EditMessageSheetProps> = ({
  chatId,
  message,
  open,
  onOpenChange,
}) => (
  <VitalityDrawerSheet<void>
    open={open}
    onOpenChange={onOpenChange}
    Child={({ onClose }) =>
      message ? (
        <EditMessageForm
          key={message.id}
          chatId={chatId}
          message={message}
          onClose={() => onClose()}
        />
      ) : null
    }
  />
);

const styles = StyleSheet.create({
  formRoot: {
    flexShrink: 1,
    maxHeight: "100%",
  },
  content: {
    paddingHorizontal: loginSpacing.containerMargin,
    paddingBottom: loginSpacing.stackMd,
  },
});
