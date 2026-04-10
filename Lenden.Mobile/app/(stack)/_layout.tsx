import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const StackLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="account" />
      <Stack.Screen name="friends" />
      <Stack.Screen name="groups" />
      <Stack.Screen name="home" />
      <Stack.Screen name="quickActions" />
    </Stack>
  );
};

export default StackLayout;
