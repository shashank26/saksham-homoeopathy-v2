import { FC } from "react";
import { useAuth } from "./auth/hooks/useAuth";
import { Text } from "react-native";

export const HelloText: FC = () => {
  const { user } = useAuth();
  return <Text>Hello guys, I am {user?.phoneNumber}</Text>;
};
