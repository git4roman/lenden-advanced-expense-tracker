import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const securityItems = [
  // { title: "Change Password", subtitle: "Update your account password" },
  // { title: "Two-Factor Authentication", subtitle: "Add an extra layer of login security" },
  // { title: "Active Sessions", subtitle: "Review devices currently signed in" },
  { title: "Deactivate Account", subtitle: "Deactivate Your Account" },
];

export default function SecurityScreen() {
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.neutral[950] }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
    >
      <View style={{ gap: 10 }}>
        {securityItems.map((item) => (
          <Pressable
            key={item.title}
            style={{
              borderRadius: 12,
              backgroundColor: Colors.neutral[800],
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              paddingHorizontal: 16,
              paddingVertical: 14,
              gap: 4,
            }}
          >
            <CText size="sm" color={Colors.neutral[100]} weight="semibold">
              {item.title}
            </CText>
            <CText size="xs" color={Colors.neutral[400]}>
              {item.subtitle}
            </CText>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
