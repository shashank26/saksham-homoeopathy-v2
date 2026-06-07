import { themeColors } from "@/themes/themes";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerToggleButton,
} from "@react-navigation/drawer";
import { Text } from "@tamagui/core";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Platform, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { XStack, YStack } from "tamagui";
import { Role } from "@/services/Firebase.service";
import { useAuth } from "../auth/hooks/useAuth";
import { ShimmerImage } from "../common/ShimmerImage";
import { DrawerHeaderTitle } from "./DrawerHeaderTitle";
import { LegalLinks } from "../common/LegalLinks";
import SocialMediaLinks from "../SocialMediaLinks";
import Constants from "expo-constants";
import { loginTypography } from "@/themes/loginDesign";

const drawerOptions = [
  {
    title: "Home",
    name: "home",
    label: "Home",
    icon: (focused: boolean) => (
      <MaterialIcons
        name="house"
        size={24}
        color={focused ? themeColors.onyx : themeColors.gray}
      />
    ),
  },
  {
    title: "Bookings",
    name: "bookings",
    label: "Bookings",
    icon: (focused: boolean) => (
      <MaterialIcons
        name="calendar-month"
        size={24}
        color={focused ? themeColors.onyx : themeColors.gray}
      />
    ),
  },
  {
    title: "About Us",
    name: "about",
    label: "About Us",
    icon: (focused: boolean) => (
      <MaterialIcons
        name="info"
        size={24}
        color={focused ? themeColors.onyx : themeColors.gray}
      />
    ),
  },
  {
    title: "Do's & Dont's",
    name: "dosAndDonts",
    label: "Do's & Dont's",
    icon: (focused: boolean) => (
      <MaterialIcons
        name="check-circle"
        size={24}
        color={focused ? themeColors.onyx : themeColors.gray}
      />
    ),
  },
  {
    title: "Awards & Accolades",
    name: "awards",
    label: "Awards & Accolades",
    icon: (focused: boolean) => (
      <MaterialIcons
        name="stars"
        size={24}
        color={focused ? themeColors.onyx : themeColors.gray}
      />
    ),
  },
  {
    title: "Send Feedback",
    name: "feedback",
    label: "Send Feedback",
    icon: (focused: boolean) => (
      <MaterialIcons
        name="feedback"
        size={24}
        color={focused ? themeColors.onyx : themeColors.gray}
      />
    ),
  },
  {
    title: "Moderation",
    name: "moderation",
    label: "Moderation",
    adminOnly: true,
    icon: (focused: boolean) => (
      <MaterialIcons name="shield" size={24} color={focused ? themeColors.onyx : themeColors.gray} />
    ),
  },
  {
    title: "Profile",
    name: "profile",
    label: "Profile",
    icon: (focused: boolean) => (
      <MaterialIcons
        name="person"
        size={24}
        color={focused ? themeColors.onyx : themeColors.gray}
      />
    ),
  },
];
const drawerButtonOptionsStyle = {
  drawerActiveTintColor: themeColors.onyx, // Active button text color
  drawerActiveBackgroundColor: themeColors.lightGray, // Active button background
  drawerInactiveTintColor: themeColors.gray,
  drawerInactiveBackgroundColor: themeColors.plat, // Inactive button text color
};

const CustomDrawerContent = (props: any) => {
  const { user, profile } = useAuth();
  return (
    <DrawerContentScrollView {...props}>
      <View
        style={{
          borderColor: themeColors.plat,
          borderBottomWidth: 1,
          marginBottom: 10,
          paddingBottom: 10,
          paddingTop: 10,
          gap: 20,
        }}
      >
        <ShimmerImage
          url={profile?.photoUrl || "https://picsum.photos/200"}
          borderRadius={40}
          size={{
            height: 80,
            width: 80,
          }}
        />
        <YStack borderBottomWidth={1} borderBottomColor={themeColors.lightGray} paddingBottom={10}>
          <Text
            fontFamily="$js6"
            fontSize="$3"
            color={themeColors.onyx}
            marginLeft={10}
          >
            {profile?.displayName || profile?.phoneNumber || user?.displayName}
          </Text>
          <Text fontFamily="$js4" fontSize="$2" color={"#aaa"} marginLeft={10}>
            {profile?.phoneNumber}
          </Text>
        </YStack>
      </View>
      <YStack style={{ height: "95%", justifyContent: "space-between" }}>
        <View>
          <DrawerItemList {...props} />
        </View>
        <View style={{ marginTop: 24, paddingHorizontal: 12 }}>
          <LegalLinks horizontal />
          <XStack gap={10} marginTop={24} justifyContent="center">
            <SocialMediaLinks />
          </XStack>
          <Text
            fontFamily="$js2"
            fontSize="$1"
            color="#aaa"
            marginTop={12}
            marginLeft={4}
          >
            Version {Constants.expoConfig?.version ?? "1.0.0"}
          </Text>
        </View>
      </YStack>
    </DrawerContentScrollView>
  );
};

export const AppDrawer = () => {
  const { role } = useAuth();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ route }) => ({
          headerTitle: () => <DrawerHeaderTitle route={route} />,
          headerStyle: {
            height: Platform.OS === 'ios' ? 110 : undefined,
          },
          headerTitleAlign: "left",
          headerLeft: () => (
            <DrawerToggleButton tintColor={themeColors.accent} /> // ✅ Change the color here
          ),
          ...drawerButtonOptionsStyle,
          drawerStyle: {
            width: "70%",
            rowGap: 0,
          },
          drawerLabelStyle: {
            ...loginTypography.labelMd,
          },
          drawerItemStyle: {
            marginVertical: 0, // Adds space between buttons
          },
        })}
      >
        {drawerOptions.map((options) => (
          <Drawer.Screen
            key={options.name}
            name={options.name}
            initialParams={{
              title: options.title,
            }}
            options={{
              drawerItemStyle: {
                display: options.adminOnly && role === Role.USER ? "none" : "flex",
              },
              drawerLabel: options.label,
              drawerIcon: ({ focused, size }) => options.icon(focused),
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
};
