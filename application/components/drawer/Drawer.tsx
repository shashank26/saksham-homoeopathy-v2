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
import { useAuth } from "../auth/hooks/useAuth";
import { ShimmerImage } from "../common/ShimmerImage";
import { DrawerHeaderTitle } from "./DrawerHeaderTitle";
import SocialMediaLinks from "../SocialMediaLinks";

const drawerOptions = [
  {
    title: "Home",
    name: "home",
    label: "Home",
    icon: (focused: boolean) => (
      <MaterialIcons
        name="house"
        size={24}
        color={focused ? themeColors.plat : themeColors.onyx}
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
        color={focused ? themeColors.plat : themeColors.onyx}
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
        color={focused ? themeColors.plat : themeColors.onyx}
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
        color={focused ? themeColors.plat : themeColors.onyx}
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
        color={focused ? themeColors.plat : themeColors.onyx}
      />
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
        color={focused ? themeColors.plat : themeColors.onyx}
      />
    ),
  },
];
const drawerButtonOptionsStyle = {
  drawerActiveTintColor: themeColors.plat, // Active button text color
  drawerActiveBackgroundColor: themeColors.onyx, // Active button background
  drawerInactiveTintColor: themeColors.onyx,
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
          gap: 20,
        }}
      >
        <ShimmerImage
          url={profile?.photoUrl || "https://picsum.photos/200"}
          borderRadius={50}
          size={{
            height: 100,
            width: 100,
          }}
        />
        <YStack>
          <Text
            fontFamily="$js5"
            fontSize="$6"
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
      <DrawerItemList {...props} />
      <View>
        <XStack gap={10} justifyContent="center" marginTop={40}>
          <SocialMediaLinks />
        </XStack>
      </View>
    </DrawerContentScrollView>
  );
};

export const AppDrawer = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
        screenOptions={({ route }) => ({
          headerTitle: () => <DrawerHeaderTitle route={route} />,
          headerStyle: {
            height: 120,
          },
          headerTitleAlign: "left",
          headerLeft: () => (
            <DrawerToggleButton tintColor={themeColors.accent} /> // ✅ Change the color here
          ),
          ...drawerButtonOptionsStyle,
          drawerStyle: {
            width: "70%",
            rowGap: 5,
          },
          drawerLabelStyle: {
            fontSize: 18,
            fontFamily: "JosefinSans-400",
          },
          drawerItemStyle: {
            marginVertical: 5, // Adds space between buttons
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
              drawerLabel: options.label,
              drawerIcon: ({ focused, size }) => options.icon(focused),
            }}
          />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
};
