import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
// import { Colors } from "@/src/theme/colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/src/shared/ui/theme/colors";
import { Home2, Profile, Profile2User } from "iconsax-react-nativejs";

export default function _layout() {
  const TAB_ICON_SIZE = 18;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.accent[500],
          tabBarInactiveTintColor: Colors.neutral[300],
          tabBarStyle: {
            // paddingBottom: 5,
            backgroundColor: Colors.neutral[900],
          },
          tabBarLabelStyle: { fontSize: 14, marginTop: -4 },
          headerShown: false,
        }}
        initialRouteName="(groups)"
      >
        <Tabs.Screen
          name="(home)"
          options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ color }) => (
              <Home2 size={TAB_ICON_SIZE - 2} color={color} variant="TwoTone" />
            ),
          }}
        />
        <Tabs.Screen
          name="(groups)"
          options={{
            headerShown: false,
            title: "Groups",
            tabBarIcon: ({ color }) => (
              <FontAwesome5
                name="users"
                size={TAB_ICON_SIZE - 2}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="(friends)"
          options={{
            headerShown: false,
            title: "Friends", // Optional: set a title for the tab
            tabBarIcon: ({ color }) => (
              <Profile2User size={TAB_ICON_SIZE} color={color} variant="Bold" />
            ),
          }}
        />

        <Tabs.Screen
          name="(account)"
          options={{
            title: "Account",
            tabBarIcon: ({ color }) => (
              <Profile size={TAB_ICON_SIZE + 1} color={color} variant="Bold" />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
