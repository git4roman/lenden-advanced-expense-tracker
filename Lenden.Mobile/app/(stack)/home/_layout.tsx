import React from "react";
import { Stack } from "expo-router";
import { Colors } from "@/src/shared/ui/theme/colors";
import { useGetGroupsQuery } from "@/src/shared/store/apiSlices/group-slice.api";
import { useSelector } from "react-redux";
import { RootState } from "@/src/shared/store/store";

const HomeTabLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: Colors.neutral[800] },
        headerTitleStyle: { color: Colors.neutral[200] },
        headerTintColor: Colors.neutral[300],
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="notification"
        options={{ headerShown: true, title: "Notifications" }}
      />
    </Stack>
  );
};

export default HomeTabLayout;
