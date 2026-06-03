import { loginSpacing } from "@/themes/loginDesign";
import { BlurView } from "expo-blur";
import { FC, PropsWithChildren } from "react";
import { Animated, Modal, Platform, StyleSheet, View } from "react-native";

type VitalityOverlayScrimProps = PropsWithChildren<{
  showOverlay: boolean;
  scrimOpacity: Animated.Value;
  contentOpacity: Animated.Value;
  contentScale: Animated.Value;
}>;

export const VitalityOverlayScrim: FC<VitalityOverlayScrimProps> = ({
  showOverlay,
  scrimOpacity,
  contentOpacity,
  contentScale,
  children,
}) => (
  <Modal visible={showOverlay} transparent animationType="none">
    <Animated.View style={[styles.overlay, { opacity: scrimOpacity }]}>
      <BlurView
        intensity={Platform.OS === "ios" ? 40 : 80}
        tint="light"
        style={StyleSheet.absoluteFill}
        experimentalBlurMethod={
          Platform.OS === "android" ? "dimezisBlurView" : undefined
        }
      />
      <View style={styles.tint} />
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentOpacity,
            transform: [{ scale: contentScale }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Animated.View>
  </Modal>
);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    padding: loginSpacing.containerMargin,
  },
  tint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 320,
    width: "100%",
  },
});
