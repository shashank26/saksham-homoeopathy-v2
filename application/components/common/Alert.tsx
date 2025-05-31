import { themeColors } from "@/themes/themes";
import { Text } from "@tamagui/core";
import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Animated, Modal } from "react-native";
import { AlertDialog, Button, Spinner, XStack, YStack } from "tamagui";
export type OverlayActivityIndicatorProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  visible: boolean;
};

export function OverlayActivityIndicator({
  icon,
  title,
  description,
  visible,
}: OverlayActivityIndicatorProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (visible) {
      setShowOverlay(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 1,
          delay: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          delay: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowOverlay(false);
      });
    }
  }, [visible]);

  const view = (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Animated.View
        style={[{ transform: [{ scale }] }, { opacity: opacity2 }]}
      >
        <YStack
          alignItems="center"
          backgroundColor={themeColors.light}
          padding={10}
          borderRadius={10}
          elevation={5}
          shadowColor={themeColors.onyx}
          shadowOffset={{ width: 10, height: 10 }}
          shadowOpacity={0.25}
          shadowRadius={20}
          gap={10}
        >
          <XStack alignItems="center" justifyContent="center" gap={5}>
            <Spinner
              size="small"
              color={themeColors.accent}
              style={{ marginRight: 10 }}
            />
            <Text color={themeColors.onyx} fontSize={28} fontFamily={"$js5"}>
              {title}
            </Text>
          </XStack>
          <XStack alignItems="center" justifyContent="center" gap={10}>
            {icon}
            <Text color={themeColors.onyx} fontSize={16} fontFamily={"$js4"}>
              {description}
            </Text>
          </XStack>
        </YStack>
      </Animated.View>
    </Animated.View>
  );

  return (
    <Modal visible={showOverlay} transparent animationType="fade">
      {view}
    </Modal>
  );
}
export function ConfirmDialog({
  icon,
  title,
  description,
  visible,
  onConfirm,
}: OverlayActivityIndicatorProps & { onConfirm: (confirm: boolean) => void }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const opacity2 = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    if (visible) {
      setShowOverlay(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 1,
          delay: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          delay: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity2, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowOverlay(false);
      });
    }
  }, [visible]);

  const view = (
    <Animated.View style={[styles.overlay, { opacity }]}>
      <Animated.View
        style={[{ transform: [{ scale }] }, { opacity: opacity2 }]}
      >
        <YStack
          alignItems="center"
          backgroundColor={themeColors.light}
          padding={10}
          borderRadius={10}
          elevation={5}
          shadowColor={themeColors.onyx}
          shadowOffset={{ width: 10, height: 10 }}
          shadowOpacity={0.25}
          shadowRadius={20}
          gap={10}
        >
          <XStack alignItems="center" justifyContent="center" gap={10}>
            <Text color={themeColors.onyx} fontSize={28} fontFamily={"$js5"}>
              {icon}
              {title}
            </Text>
          </XStack>
          <XStack alignItems="center" justifyContent="center" gap={10}>
            <Text color={themeColors.onyx} fontSize={16} fontFamily={"$js4"}>
              {description}
            </Text>
          </XStack>
          <XStack gap={5}>
            <Button
              backgroundColor={themeColors.onyx}
              onPress={() => onConfirm(false)}
            >
              <Text color={"white"}>Cancel</Text>
            </Button>
            <Button
              backgroundColor={themeColors.accent}
              onPress={() => onConfirm(true)}
            >
              <Text color={"white"}>Confirm</Text>
            </Button>
          </XStack>
        </YStack>
      </Animated.View>
    </Animated.View>
  );

  return (
    <Modal visible={showOverlay} transparent animationType="fade">
      {view}
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 2, // make sure it's on top
    justifyContent: "center",
    padding: 20,
  },
});
