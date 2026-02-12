import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const appName = "LenDen";
const appVersion = "1.0.0";

export default function AboutScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral[950] }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
      >
        <View style={{ gap: 10 }}>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: Colors.neutral[800],
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              paddingHorizontal: 16,
              paddingVertical: 14,
              gap: 8,
            }}
          >
            <CText size="md" color={Colors.neutral[100]} weight="bold">
              {appName}
            </CText>
            <CText size="sm" color={Colors.neutral[300]}>
              Split expenses, track balances, and settle up with friends and
              groups in one place.
            </CText>
          </View>

          <View
            style={{
              borderRadius: 12,
              backgroundColor: Colors.neutral[800],
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              paddingVertical: 4,
            }}
          >
            <InfoRow label="Version" value={appVersion} />
            <InfoRow label="Build" value="100" isLast />
          </View>

          <View
            style={{
              borderRadius: 12,
              backgroundColor: Colors.neutral[800],
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              paddingHorizontal: 16,
              paddingVertical: 14,
              gap: 6,
            }}
          >
            <CText size="sm" color={Colors.neutral[200]} weight="semibold">
              Contact
            </CText>
            <CText size="xs" color={Colors.neutral[400]}>
              support@lenden.app
            </CText>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
  isLast?: boolean;
};

function InfoRow({ label, value, isLast }: InfoRowProps) {
  return (
    <View
      style={{
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: Colors.neutral[700],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <CText size="sm" color={Colors.neutral[300]}>
        {label}
      </CText>
      <CText size="sm" color={Colors.neutral[100]} weight="semibold">
        {value}
      </CText>
    </View>
  );
}
