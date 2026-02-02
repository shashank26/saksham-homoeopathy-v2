import { themeColors } from "@/themes/themes";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Text } from "tamagui";

// 🔹 Define TabItem Props
interface TabItemProps {
  focused: boolean;
  iconName: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress: () => void;
}

// 🔹 TabItem Component with Animation
const TabItem: React.FC<TabItemProps> = ({
  focused,
  iconName,
  label,
  onPress,
}) => {
  const scale = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    scale.value = withTiming(focused ? 1 : 0, { duration: 300 });
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value * 0.1 + 1 }],
    backgroundColor: focused ? themeColors.accent : themeColors.plat,
  }));

  return (
    <TouchableOpacity onPress={onPress} style={styles.tabItem}>
      <Animated.View style={[styles.tabContainer, animatedStyle]}>
        <MaterialIcons
          name={iconName}
          size={20}
          color={focused ? themeColors.plat : themeColors.onyx}
        />
        <Text
          fontFamily={"$js4"}
          fontWeight={"$4"}
          fontSize={"$1"}
          color={focused ? themeColors.plat : themeColors.onyx}
        >
          {label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// 🔹 Custom Tab Bar Component
const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;

        return (
          <TabItem
            key={route.key}
            label={label}
            iconName={
              options.tabBarIconName as keyof typeof MaterialIcons.glyphMap
            }
            focused={isFocused}
            onPress={() => navigation.navigate(route.name)}
          />
        );
      })}
    </View>
  );
};

// 🔹 Main Tab Layout
export default function RootLayout() {
  return (
    <Tabs tabBar={(props) => <CustomTabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIconName: "home-filled",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIconName: "chat-bubble-outline",
          headerShown: false,

        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIconName: "history",
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: "Alerts",
          tabBarIconName: "notifications",
          headerShown: false,

        }}
      />
    </Tabs>
  );
}

// 🔹 Styles
const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: themeColors.plat,
    height: 80,
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingTop: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabContainer: {
    width: 70,
    height: 45,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});
