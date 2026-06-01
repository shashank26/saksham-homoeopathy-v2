import { Image, ImageStyle } from "expo-image";
import { FC } from "react";
import { StyleProp } from "react-native";

const logoSource = require("@/assets/images/image.png");

export type LogoProps = {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
};

export const Logo: FC<LogoProps> = ({
  width = 160,
  height = 160,
  style,
}) => (
  <Image
    source={logoSource}
    contentFit="contain"
    style={[{ width, height }, style]}
    accessibilityLabel="Saksham Homoeopathy logo"
  />
);
