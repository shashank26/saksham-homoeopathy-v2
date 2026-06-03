import {
  loginColors,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { Children, ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useOverlayAnimation } from "./overlay/useOverlayAnimation";
import { VitalityLoadingSpinner } from "./overlay/VitalityLoadingSpinner";
import { VitalityOverlayScrim } from "./overlay/VitalityOverlayScrim";
import { VitalityProgressBar } from "./overlay/VitalityProgressBar";

export type OverlayActivityIndicatorProps = {
  icon: ReactNode;
  title: string;
  description: string;
  visible: boolean;
  progress?: number;
};

function shouldShowIcon(icon: ReactNode): boolean {
  if (icon == null || icon === false) return false;
  return Children.count(icon) > 0;
}

export function OverlayActivityIndicator({
  icon,
  title,
  description,
  visible,
  progress,
}: OverlayActivityIndicatorProps) {
  const { showOverlay, scrimOpacity, contentOpacity, contentScale } =
    useOverlayAnimation(visible);

  return (
    <VitalityOverlayScrim
      showOverlay={showOverlay}
      scrimOpacity={scrimOpacity}
      contentOpacity={contentOpacity}
      contentScale={contentScale}
    >
      <VitalityLoadingSpinner />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
      {shouldShowIcon(icon) ? <View style={styles.iconSlot}>{icon}</View> : null}
      {progress != null ? <VitalityProgressBar progress={progress} /> : null}
    </VitalityOverlayScrim>
  );
}

const styles = StyleSheet.create({
  title: {
    ...loginTypography.labelMd,
    color: loginColors.onSurface,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    textAlign: "center",
    marginTop: loginSpacing.stackMd,
  },
  description: {
    ...loginTypography.labelSm,
    color: loginColors.onSurfaceVariant,
    opacity: 0.7,
    textAlign: "center",
    marginTop: loginSpacing.stackSm,
  },
  iconSlot: {
    marginTop: loginSpacing.stackMd,
    alignItems: "center",
  },
});
