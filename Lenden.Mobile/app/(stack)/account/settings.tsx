import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { useState } from "react";
import { Pressable, ScrollView, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

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
              paddingVertical: 4,
            }}
          >
            <SettingRow
              title="Push Notifications"
              subtitle="Receive reminders and updates"
              value={pushEnabled}
              onChange={setPushEnabled}
            />
            <SettingRow
              title="Email Updates"
              subtitle="Get weekly account activity emails"
              value={emailEnabled}
              onChange={setEmailEnabled}
            />
            <SettingRow
              title="Biometric Login"
              subtitle="Use Face ID / Fingerprint"
              value={biometricEnabled}
              onChange={setBiometricEnabled}
              isLast
            />
          </View>

          <Pressable
            style={{
              borderRadius: 12,
              backgroundColor: Colors.neutral[800],
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              paddingHorizontal: 16,
              paddingVertical: 14,
            }}
          >
            <CText size="sm" color={Colors.neutral[200]} weight="semibold">
              Language
            </CText>
            <CText size="xs" color={Colors.neutral[400]}>
              English
            </CText>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type SettingRowProps = {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
  isLast?: boolean;
};

function SettingRow({
  title,
  subtitle,
  value,
  onChange,
  isLast,
}: SettingRowProps) {
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
        gap: 12,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <CText size="sm" color={Colors.neutral[200]} weight="semibold">
          {title}
        </CText>
        <CText size="xs" color={Colors.neutral[400]}>
          {subtitle}
        </CText>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{
          false: Colors.neutral[600],
          true: Colors.accent[700],
        }}
        thumbColor={value ? Colors.accent[500] : Colors.neutral[300]}
      />
    </View>
  );
}
