import { MaterialIcons } from "@expo/vector-icons";
import { toast } from "burnt";
import { useState } from "react";
import { Button, Input, XStack } from "tamagui";

export const MessageTextBox = ({
  onSend,
}: {
  onSend: (message: string) => Promise<any>;
}) => {
  const [text, setText] = useState("");
  return (
    <XStack justifyContent="center" gap={5} alignContent="center" style={{
      position: 'fixed',
      bottom: 0
    }}>
      <Input
        fontFamily={"$js5"}
        style={{ flex: 1 }}
        fontSize={14}
        placeholder="Type a message..."
        value={text}
        onChangeText={(text) => {
          setText(text);
        }}
      />
      <Button
        onPress={async () => {
          if (!text.trim()) return;
          try {
            await onSend(text.trim());
            setText("");
          } catch (e) {
            toast({
              title: "Failed to send message",
              preset: "error",
            });
          }
          
        }}
        height={42}
        padding={0}
        width={42}
        borderRadius={21}
        backgroundColor={"$accent"}
      >
        <MaterialIcons name={"send"} size={18} color={"white"} />
      </Button>
    </XStack>
  );
};
