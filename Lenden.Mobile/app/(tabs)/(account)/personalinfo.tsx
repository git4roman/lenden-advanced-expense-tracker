import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const infoRows = [
  { label: "Full Name", value: "Some Name" },
  { label: "Username", value: "@somename" },
  { label: "Email", value: "some.name@example.com" },
  { label: "Phone", value: "+1 (555) 123-4567" },
  { label: "Member Since", value: "November 2025" },
];

export default function PersonalInfoScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral[950] }}>
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
