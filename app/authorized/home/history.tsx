import { HistoryScreen } from "@/components/history/HistoryScreen";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const History: React.FC = () => {
  return <HistoryScreen />;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    color: "#333",
  },
});

export default History;
