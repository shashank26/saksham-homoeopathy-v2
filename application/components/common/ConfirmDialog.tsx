import {
  loginColors,
  loginRadius,
  loginShadow,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { StyleSheet, Text, View } from "react-native";
import type { OverlayActivityIndicatorProps } from "./OverlayActivityIndicator";
import { useOverlayAnimation } from "./overlay/useOverlayAnimation";
import { VitalityOverlayButton } from "./overlay/VitalityOverlayButton";
import { VitalityOverlayScrim } from "./overlay/VitalityOverlayScrim";

export type ConfirmDialogProps = OverlayActivityIndicatorProps & {
  onConfirm: (confirm: boolean) => void;
};

function isDestructiveAction(title: string): boolean {
  return title.toLowerCase().includes("delete");
}

export function ConfirmDialog({
  icon,
  title,
  description,
  visible,
  onConfirm,
}: ConfirmDialogProps) {
  const { showOverlay, scrimOpacity, contentOpacity, contentScale } =
    useOverlayAnimation(visible);
  const destructive = isDestructiveAction(title);

  return (
    <VitalityOverlayScrim
      showOverlay={showOverlay}
      scrimOpacity={scrimOpacity}
      contentOpacity={contentOpacity}
      contentScale={contentScale}
    >
      <View style={styles.card}>
        <View style={styles.header}>
          {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
          <Text style={styles.title}>{title}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        <View style={styles.actions}>
          <VitalityOverlayButton
            label="Cancel"
            variant="outlined"
            onPress={() => onConfirm(false)}
          />
          <VitalityOverlayButton
            label="Confirm"
            variant={destructive ? "destructive" : "primary"}
            onPress={() => onConfirm(true)}
          />
        </View>
      </View>
    </VitalityOverlayScrim>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: loginColors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: loginColors.outlineVariant,
    borderRadius: loginRadius.lg,
    padding: loginSpacing.stackLg,
    ...loginShadow.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: loginSpacing.stackMd,
  },
  iconWrap: {
    marginRight: loginSpacing.stackSm,
  },
  title: {
    ...loginTypography.headlineMd,
    color: loginColors.onSurface,
    textAlign: "center",
  },
  description: {
    ...loginTypography.bodyMd,
    fontFamily: "Manrope_400Regular",
    color: loginColors.onSurfaceVariant,
    textAlign: "center",
    marginBottom: loginSpacing.stackLg,
  },
  actions: {
    flexDirection: "row",
    marginHorizontal: -loginSpacing.stackSm / 2,
  },
});
