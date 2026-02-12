import { Colors } from "@/src/shared/ui/theme/colors";
import { Stack } from "expo-router";

export default function GroupIdLayout() {
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
      <Stack.Screen name="index" options={{ title: "Group" }} />
      <Stack.Screen name="addMembers" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ title: "Expense Details" }} />
      <Stack.Screen name="transaction" options={{ headerShown: false }} />
      <Stack.Screen name="settlement" options={{ headerShown: false }} />
    </Stack>
  );
}
