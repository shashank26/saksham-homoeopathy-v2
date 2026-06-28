import { TermsAcceptanceScreen } from "@/components/legal/TermsAcceptanceScreen";
import { TermsAcceptanceService } from "@/services/TermsAcceptance.service";
import { themeColors } from "@/themes/themes";
import { Text } from "@tamagui/core";
import { useSegments } from "expo-router";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { YStack } from "tamagui";
import { LoaderScreen } from "../LoaderScreen";
import { ProfileScreen } from "../profile/ProfileScreen";
import { Login } from "./Login";
import { useAuth } from "./hooks/useAuth";

export const Auth: FC<PropsWithChildren> = ({ children }) => {
  const { user, isLoading, error, profile } = useAuth();
  const segments = useSegments();
  const isLegalRoute = (segments as string[]).includes("legal");
  const [termsChecked, setTermsChecked] = useState<boolean | null>(null);

  useEffect(() => {
    TermsAcceptanceService.hasAcceptedCurrentTerms()
      .then(setTermsChecked)
      .catch(() => setTermsChecked(false));
  }, []);

  if (isLegalRoute) {
    return <>{children}</>;
  }

  if (termsChecked === null) {
    return <LoaderScreen />;
  }

  if (!termsChecked) {
    return (
      <TermsAcceptanceScreen
        onAccepted={() => setTermsChecked(true)}
      />
    );
  }

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
    return <ProfileScreen variant="onboarding" />;
  }

  return <>{children}</>;
};
