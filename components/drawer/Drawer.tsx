import { themeColors } from "@/themes/themes";
import { DrawerToggleButton } from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { DrawerHeaderTitle } from "./DrawerHeaderTitle";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const drawerOptions = [
  {
    title: "Updates",
    name: "index",
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
        name="check-circle-outline"
        size={24}
        color={focused ? themeColors.plat : themeColors.onyx}
      />
    ),
  },
  {
    title: "Testimonials",
    name: "testimonials",
    label: "Testimnonials",
    icon: (focused: boolean) => (
      <MaterialIcons
        name="format-quote"
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
];
const drawerButtonOptionsStyle = {
  drawerActiveTintColor: themeColors.plat, // Active button text color
  drawerActiveBackgroundColor: themeColors.onyx, // Active button background
  drawerInactiveTintColor: themeColors.onyx,
  drawerInactiveBackgroundColor: themeColors.plat, // Inactive button text color
};

export const AppDrawer = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
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
