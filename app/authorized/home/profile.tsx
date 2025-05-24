import { ProfileScreen } from "@/components/profile/ProfileScreen";
import React from "react";
import { StyleSheet } from "react-native";

const Profile = () => {
  return <ProfileScreen />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default Profile;
