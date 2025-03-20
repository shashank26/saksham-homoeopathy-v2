import { FC } from "react";
import { ButtonProps, Paragraph, SizableText, Spinner, View } from "tamagui";
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
          <SizableText padding={"$2"}>Sending...</SizableText>
        </View>
      ) : (
        <Paragraph size="$5" fontWeight={"500"}>
          {text}
        </Paragraph>
      )}
    </CButton>
  );
};
