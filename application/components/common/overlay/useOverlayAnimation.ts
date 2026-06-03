import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export function useOverlayAnimation(visible: boolean) {
  const scrimOpacity = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0)).current;
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowOverlay(true);
      Animated.parallel([
        Animated.timing(scrimOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 1,
          delay: 300,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(contentScale, {
          toValue: 1,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scrimOpacity, {
          toValue: 0,
          duration: 200,
          delay: 250,
          useNativeDriver: true,
        }),
        Animated.timing(contentOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(contentScale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowOverlay(false);
      });
    }
  }, [visible, scrimOpacity, contentOpacity, contentScale]);

  return { showOverlay, scrimOpacity, contentOpacity, contentScale };
}
