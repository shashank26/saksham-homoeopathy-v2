import { UpdateStatus } from "@/services/AppUpdate.service";
import {
  loginColors,
  loginRadius,
  loginShadow,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { FC } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useOverlayAnimation } from "../common/overlay/useOverlayAnimation";
import { VitalityOverlayButton } from "../common/overlay/VitalityOverlayButton";
import { VitalityOverlayScrim } from "../common/overlay/VitalityOverlayScrim";

type AppUpdatePromptProps = {
  visible: boolean;
  status: UpdateStatus;
  message: string;
  onUpdate: () => void;
  onLater?: () => void;
};

export const AppUpdatePrompt: FC<AppUpdatePromptProps> = ({
  visible,
  status,
  message,
  onUpdate,
  onLater,
}) => {
  const { showOverlay, scrimOpacity, contentOpacity, contentScale } =
    useOverlayAnimation(visible);
  const required = status === "required";

  return (
    <VitalityOverlayScrim
      showOverlay={showOverlay}
      scrimOpacity={scrimOpacity}
      contentOpacity={contentOpacity}
      contentScale={contentScale}
    >
      <View style={styles.card}>
        <Text style={styles.title}>
          {required ? "Update required" : "Update available"}
        </Text>
        <Text style={styles.description}>{message}</Text>
        <View style={styles.actions}>
          {!required && onLater ? (
            <VitalityOverlayButton
              label="Later"
              variant="outlined"
              onPress={onLater}
            />
          ) : null}
          <VitalityOverlayButton label="Update" onPress={onUpdate} />
        </View>
      </View>
    </VitalityOverlayScrim>
  );
};

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
  title: {
    ...loginTypography.headlineMd,
    color: loginColors.onSurface,
    textAlign: "center",
    marginBottom: loginSpacing.stackMd,
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
