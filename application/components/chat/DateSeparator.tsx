import { YStack, Text } from "tamagui";

export const DateSeparator = ({ label }: { label: string }) => {
  return (
    <YStack alignItems="center" marginVertical={12}>
      <YStack
        backgroundColor="$onyx"
        paddingHorizontal={12}
        paddingVertical={6}
        borderRadius={10}
        opacity={0.7}
      >
        <Text color="white" fontSize={12} fontFamily={"$js4"}>
          {label}
        </Text>
      </YStack>
    </YStack>
  );
};
