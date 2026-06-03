import { loginColors } from "@/themes/loginDesign";
import { FC, useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const SPINNER_SIZE = 64;
const BORDER_WIDTH = 4;

export const VitalityLoadingSpinner: FC = () => {
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    );
    loop.start();
    return () => loop.stop();
  }, [spin]);

  const rotate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      <View style={styles.track} />
      <Animated.View
        style={[styles.arc, { transform: [{ rotate }] }]}
      />
      <View style={styles.dot} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  track: {
    position: "absolute",
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    borderRadius: SPINNER_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderColor: loginColors.outlineVariant,
    opacity: 0.25,
  },
  arc: {
    position: "absolute",
    width: SPINNER_SIZE,
    height: SPINNER_SIZE,
    borderRadius: SPINNER_SIZE / 2,
    borderWidth: BORDER_WIDTH,
    borderTopColor: loginColors.primaryContainer,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: loginColors.primary,
  },
});
