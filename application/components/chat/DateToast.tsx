import { YStack, Text, AnimatePresence } from "tamagui";

export const DateToast = ({
  date,
  visible,
}: {
  date: string;
  visible: boolean;
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <YStack
          position="absolute"
          top={16}
          alignSelf="center"
          backgroundColor="$onyx"
          zIndex={100}
          padding={7}
          borderRadius={10}
          opacity={0.7}
          animation="quick"
          enterStyle={{
            opacity: 0,
            y: -8,
          }}
          exitStyle={{
            opacity: 0,
            y: -8,
          }}
        >
          <Text color="white" fontSize="12">
            {date}
          </Text>
        </YStack>
      )}
    </AnimatePresence>
  );
};
