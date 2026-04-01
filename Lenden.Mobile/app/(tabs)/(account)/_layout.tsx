import { Colors } from "@/src/shared/ui/theme/colors";
import { Stack } from "expo-router";

export default function AccountLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.neutral[800] },
        headerTitleStyle: { color: Colors.neutral[200] },
        headerTintColor: Colors.neutral[300],
        headerShadowVisible: false,
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="personalinfo"
        options={{ title: "Personal Information" }}
      />
      <Stack.Screen
        name="editPersonalInfo"
        options={{ title: "Edit Personal Information" }}
      />
      <Stack.Screen name="security" options={{ title: "Security" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="notification" options={{ title: "Notification" }} />
      <Stack.Screen name="about" options={{ title: "About App" }} />
    </Stack>
  );
}

