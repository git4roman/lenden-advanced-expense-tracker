import { Colors } from "@/src/shared/ui/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

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
      <Stack.Screen
        name="index"
        options={{
          title: "Group",
          animation: "slide_from_left",
          animationTypeForReplace: "pop",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.replace("/(tabs)/groups")}>
              <Ionicons
                name="arrow-back"
                size={24}
                color={Colors.neutral[500]}
              />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="addMembers" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ title: "Expense Details" }} />
      <Stack.Screen name="transaction" options={{ headerShown: false }} />
      <Stack.Screen name="settlement" options={{ headerShown: false }} />
    </Stack>
  );
}
