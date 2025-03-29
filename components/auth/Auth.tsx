import { FC, PropsWithChildren } from "react";
import { Login } from "./Login";
import { useAuth } from "./hooks/useAuth";
import { Text } from "@tamagui/core";
import { LoaderScreen } from "../LoaderScreen";

export const Auth: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading, error } = useAuth();

  if (isLoading) {
    return <LoaderScreen />;
  }

  if (error) {
    return <Text>Error occurred</Text>;
  }

  if (!user) {
    return <Login />;
  }

  return <>{children}</>;
};
