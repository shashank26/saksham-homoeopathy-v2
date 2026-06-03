import { loginColors, loginSpacing } from "@/themes/loginDesign";
import { FC } from "react";
import { StyleSheet, View } from "react-native";

type VitalityProgressBarProps = {
  progress: number;
};

export const VitalityProgressBar: FC<VitalityProgressBarProps> = ({
  progress,
}) => {
  const clamped = Math.min(Math.max(progress, 0), 1);

  return (
    <View style={styles.track}>
      <View style={[styles.fill, { width: `${clamped * 100}%` }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 192,
    height: 4,
    marginTop: loginSpacing.stackLg,
    borderRadius: 2,
    backgroundColor: loginColors.surfaceContainer,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: loginColors.primaryContainer,
    borderRadius: 2,
  },
});
