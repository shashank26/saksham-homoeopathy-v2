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
          <SizableText fontFamily="$js4" fontSize="$4" padding={"$2"}>Sending...</SizableText>
        </View>
      ) : (
        <Paragraph fontSize="$4" fontFamily="$js4">
          {text}
        </Paragraph>
      )}
    </CButton>
  );
};
