import { RootState } from "@/src/shared/store/store";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { formatDate } from "@/src/shared/utils/format-date.utils";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import { Feather } from "@expo/vector-icons";
import { Stack, router } from "expo-router";

export default function PersonalInfoScreen() {
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const infoRows = [
    {
      label: "Full Name",
      value: userInfo ? `${userInfo.givenName} ${userInfo.familyName}` : "-",
    },
    { label: "Username", value: userInfo?.username ?? "-" },
    { label: "Email", value: userInfo?.email ?? "-" },
    { label: "Phone", value: userInfo?.phone ?? "-" },
    { label: "Member Since", value: userInfo.memberSince
          ? formatDate(userInfo.memberSince, { month: "long", year: "numeric" })
          : "-" },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral[950] }}>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable onPress={() => router.push("/(tabs)/(account)/editPersonalInfo")}>
              <Feather name="edit-2" size={20} color={Colors.neutral[200]} />
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
      >
        <View
          style={{
            borderRadius: 12,
            backgroundColor: Colors.neutral[800],
            borderWidth: 1,
            borderColor: Colors.neutral[700],
            paddingVertical: 8,
          }}
        >
          {infoRows.map((item, index) => (
            <View
              key={item.label}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderBottomWidth: index === infoRows.length - 1 ? 0 : 1,
                borderBottomColor: Colors.neutral[700],
                gap: 6,
              }}
            >
              <CText size="xs" color={Colors.neutral[400]} weight="semibold">
                {item.label}
              </CText>
              <CText size="sm" color={Colors.neutral[100]} weight="semibold">
                {item.value}
              </CText>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
