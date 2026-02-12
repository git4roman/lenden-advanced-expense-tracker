import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { useState } from "react";
import { ScrollView, Switch, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificationScreen() {
  const [expenseAlerts, setExpenseAlerts] = useState(true);
  const [paymentReminders, setPaymentReminders] = useState(true);
  const [groupUpdates, setGroupUpdates] = useState(false);
  const [marketing, setMarketing] = useState(false);

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
            paddingVertical: 4,
          }}
        >
          <NotificationRow
            title="Expense Alerts"
            subtitle="New and updated expense notifications"
            value={expenseAlerts}
            onChange={setExpenseAlerts}
          />
          <NotificationRow
            title="Payment Reminders"
            subtitle="Upcoming and overdue payment reminders"
            value={paymentReminders}
            onChange={setPaymentReminders}
          />
          <NotificationRow
            title="Group Updates"
            subtitle="Changes in your groups and members"
            value={groupUpdates}
            onChange={setGroupUpdates}
          />
          <NotificationRow
            title="Offers and Tips"
            subtitle="Product announcements and tips"
            value={marketing}
            onChange={setMarketing}
            isLast
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type NotificationRowProps = {
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
  isLast?: boolean;
};

function NotificationRow({
  title,
  subtitle,
  value,
  onChange,
  isLast,
}: NotificationRowProps) {
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
        trackColor={{ false: Colors.neutral[600], true: Colors.accent[700] }}
        thumbColor={value ? Colors.accent[500] : Colors.neutral[300]}
      />
    </View>
  );
}
