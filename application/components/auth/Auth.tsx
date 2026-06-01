import { themeColors } from "@/themes/themes";
import { Text } from "@tamagui/core";
import { FC, PropsWithChildren } from "react";
import { YStack } from "tamagui";
import { LoaderScreen } from "../LoaderScreen";
import { ProfileScreen } from "../profile/ProfileScreen";
import { Login } from "./Login";
import { useAuth } from "./hooks/useAuth";

export const Auth: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading, error, profile } = useAuth();

  if (isLoading) {
    return <LoaderScreen />;
  }

  if (error) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        padding="$4"
        backgroundColor={themeColors.plat}
      >
        <Text fontFamily="$js5" fontSize="$5" textAlign="center">
          Something went wrong while signing you in. Please close the app and
          try again. If the problem continues, contact support from the login
          screen.
        </Text>
      </YStack>
    );
  }

  if (!user) {
    return <Login />;
  }

  if (user && !profile) {
    return <LoaderScreen />;
  }

  if (
    !profile?.displayName.trim() ||
    profile.displayName.trim() === profile.phoneNumber
  ) {
    return (
      <YStack
        flex={1}
        justifyContent="center"
        alignContent="center"
        alignItems="center"
        paddingTop={100}
        backgroundColor={themeColors.plat}
      >
        <ProfileScreen />
      </YStack>
    );
  }

  return <>{children}</>;
};
