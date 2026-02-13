import { FC } from "react";
import { ButtonProps, Paragraph, SizableText, Spinner, Text, View } from "tamagui";
import { CButton } from "./CButton";

export type LoaderButtonProps = {
  message: string;
  isLoading: boolean;
  text: string;
} & ButtonProps;

export const LoaderButton: FC<LoaderButtonProps> = ({
  message,
  isLoading,
  text,
  children,
  ...props
}) => {
  return (
    <CButton {...props}>
      {isLoading ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Spinner color={"$red1"} />
          <Text padding={"$2"} fontFamily={"$js4"} fontSize={"$4"}>{message}</Text>
        </View>
      ) : (
        <Text fontFamily={"$js4"} fontSize="$4">
          {text}
        </Text>
      )}
    </CButton>
  );
};
