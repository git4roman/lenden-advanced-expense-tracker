import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import AccountIcon from "@/src/components/accounts/AccountIcon";
// import { Colors } from "@/src/theme/colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Colors } from "@/src/shared/ui/theme/colors";
import { Home2 } from "iconsax-react-nativejs";

export default function _layout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors.accent[500],
          tabBarInactiveTintColor: Colors.neutral[300],
          tabBarStyle: {
            paddingBottom: 5,
            backgroundColor: Colors.neutral[900],
          },
          tabBarLabelStyle: { fontSize: 12 },
          headerShown: false,
        }}
        initialRouteName="(groups)"
      >
        <Tabs.Screen
          name="(home)"
          options={{
            headerShown: false,
            title: "Home",
            tabBarIcon: ({ color, size }) => <Home2 size="28" color={color} />,
          }}
        />
        <Tabs.Screen
          name="(groups)"
          options={{
            headerShown: false,
            title: "Groups",
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="users" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(friends)"
          options={{
            headerShown: false,
            title: "Friends", // Optional: set a title for the tab
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5 name="user-friends" size={size} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="(account)"
          options={{
            title: "Account",
            tabBarIcon: ({ size, color }) => (
              <AccountIcon size={size} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
