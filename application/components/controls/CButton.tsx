import { FC, useEffect, useRef } from "react";
import { Animated } from "react-native";
import { Button, ButtonProps } from "tamagui";

export type CButtonProps = ButtonProps;

export const CButton: FC<ButtonProps> = ({ children, ...props }) => {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: props.disabled ? 0.5 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [props.disabled]);

  return (
    <Animated.View style={{ opacity }}>
      <Button {...props}>{children}</Button>
    </Animated.View>
  );
};
