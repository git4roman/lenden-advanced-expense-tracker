import { Colors } from "@/src/shared/ui/theme/colors";
import { Feather } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable } from "react-native";

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
      <Stack.Screen
        name="personalinfo"
        options={{
          title: "Personal Information",
          headerRight: () => (
            <Pressable
              onPress={() => router.push("/(stack)/account/editPersonalInfo")}
            >
              <Feather name="edit-2" size={20} color={Colors.neutral[200]} />
            </Pressable>
          ),
        }}
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
