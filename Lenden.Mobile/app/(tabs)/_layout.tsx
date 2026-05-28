import { useAuthBootstrap } from "@/src/modules/auth";
import { Colors, useDashboardQuery, useGetGroupsQuery } from "@/src/shared";

import { FontAwesome5 } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Home2, Profile } from "iconsax-react-nativejs";
import React from "react";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function AppBootstrap({ children }: { children: React.ReactNode }) {
  const { isLoading, token } = useAuthBootstrap();

  useDashboardQuery(undefined, {
    skip: !token || isLoading,
  });
  useGetGroupsQuery(undefined, { skip: !token || isLoading });

  if (token && isLoading) return null;

  return <>{children}</>;
}
export default function TabsLayout() {
  const TAB_ICON_SIZE = 18;
  const insets = useSafeAreaInsets();
  return (
    <AppBootstrap>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: Colors.accent[500],
            tabBarInactiveTintColor: Colors.neutral[300],
            tabBarStyle: {
              backgroundColor: Colors.neutral[900],
              height: 64 + insets.bottom,
              paddingBottom: insets.bottom,
            },
            tabBarLabelStyle: { fontSize: 14, marginTop: -4 },
            headerShown: false,
          }}
        >
          <Tabs.Screen
            name="home"
            options={{
              headerShown: false,
              title: "Home",
              tabBarIcon: ({ color }) => (
                <Home2
                  size={TAB_ICON_SIZE - 2}
                  color={color}
                  variant="TwoTone"
                />
              ),
            }}
          />
          <Tabs.Screen
            name="groups"
            options={{
              headerShown: false,
              title: "Groups",
              popToTopOnBlur: true,
              tabBarIcon: ({ color }) => (
                <FontAwesome5
                  name="users"
                  size={TAB_ICON_SIZE - 2}
                  color={color}
                />
              ),
            }}
          />

          {/* <Tabs.Screen
          name="quickAction"
          options={{
            title: "",
            tabBarLabel: () => null,
            tabBarIcon: () => null,
            tabBarButton: () => (
              <Pressable
                onPress={() => {
                  router.push("/(stack)/quickActions/expense");
                }}
                style={{
                  top: -16,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 58,
                    height: 58,
                    borderRadius: 999,
                    backgroundColor: Colors.warning[500],
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 4,
                    borderColor: Colors.neutral[900],
                  }}
                >
                  <AddCircle size={30} color={Colors.accent[200]} />
                </View>
              </Pressable>
            ),
          }}
        /> */}

          {/* <Tabs.Screen
          name="friends"
          options={{
            headerShown: false,
            title: "Friends",
            tabBarIcon: ({ color }) => (
              <Profile2User size={TAB_ICON_SIZE} color={color} variant="Bold" />
            ),
          }}
        /> */}

          <Tabs.Screen
            name="account"
            options={{
              title: "Account",
              tabBarIcon: ({ color }) => (
                <Profile
                  size={TAB_ICON_SIZE + 1}
                  color={color}
                  variant="Bold"
                />
              ),
            }}
          />
        </Tabs>
      </SafeAreaProvider>
    </AppBootstrap>
  );
}
