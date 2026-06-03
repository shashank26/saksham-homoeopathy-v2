import { HEALTH_DISCLAIMER } from "@/constants/legal";
import { themeColors } from "@/themes/themes";
import { Text } from "@tamagui/core";
import { FC } from "react";

export const HealthDisclaimer: FC = () => (
  <Text
    fontFamily="$js2"
    fontSize="$2"
    color={themeColors.onyx}
    opacity={0.75}
    textAlign="center"
    paddingHorizontal="$2"
  >
    {HEALTH_DISCLAIMER}
  </Text>
);
