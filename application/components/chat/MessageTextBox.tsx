import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { toast } from "burnt";
import { useRef, useState } from "react";
import { Button, Input, XStack } from "tamagui";

export const MessageTextBox = ({
  onSend,
  disabled = false,
}: {
  onSend: (message: string) => Promise<any>;
  disabled?: boolean;
}) => {
  const [text, setText] = useState("");
  const sendingRef = useRef(false);

  return (
    <XStack
      justifyContent="center"
      paddingTop={8}
      borderTopWidth={1}
      borderColor={themeColors.lightGray}
      gap={5}
      alignContent="center"
      style={{
        position: "fixed",
        bottom: 0,
      }}
    >
      <Input
        fontFamily={"$js5"}
        borderWidth={0}
        style={{ flex: 1, backgroundColor: themeColors.plat }}
        fontSize={14}
        placeholder={
          disabled ? "Messaging disabled" : "Type a message..."
        }
        value={text}
        editable={!disabled}
        onChangeText={(text) => {
          setText(text);
        }}
      />
      <Button
        onPress={async () => {
          if (!text.trim() || disabled || sendingRef.current) return;
          const trimmed = text.trim();
          setText("");
          sendingRef.current = true;
          try {
            await onSend(trimmed);
          } catch {
            toast({
              title: "Failed to send message",
              preset: "error",
            });
          } finally {
            sendingRef.current = false;
          }
        }}
        height={42}
        padding={0}
        width={42}
        borderRadius={21}
        backgroundColor={"$accent"}
        disabled={disabled}
        opacity={disabled ? 0.5 : 1}
      >
        <MaterialIcons name={"send"} size={18} color={"white"} />
      </Button>
    </XStack>
  );
};
