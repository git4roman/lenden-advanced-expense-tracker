import { useTheme } from "@/src/shared/providers/ThemeProviders";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { Feather } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { FlatList, Modal, Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  time: string;
  date: string;
  isUnread?: boolean;
};

const notificationData: NotificationItem[] = [
  {
    id: "n1",
    title: "Payment Received",
    message: "Roman paid you NPR 1,250 for Lunch Group.",
    time: "2m ago",
    date: "2026-02-12",
    isUnread: true,
  },
  {
    id: "n2",
    title: "Expense Added",
    message: "Sita added a new expense in Roommates.",
    time: "15m ago",
    date: "2026-02-12",
    isUnread: true,
  },
  {
    id: "n3",
    title: "Payment Reminder",
    message: "Your payment to Andrew is due tomorrow.",
    time: "1h ago",
    date: "2026-02-11",
  },
  {
    id: "n4",
    title: "Group Update",
    message: "Aayush joined Trip to Pokhara.",
    time: "Yesterday",
    date: "2026-02-11",
  },
  {
    id: "n5",
    title: "Request Accepted",
    message: "Nabin accepted your request for NPR 800.",
    time: "Yesterday",
    date: "2026-02-10",
  },
];

function NotificationCard({ item }: { item: NotificationItem }) {
  return (
    <View
      style={{
        backgroundColor: Colors.neutral[800],
        borderWidth: 1,
        borderColor: item.isUnread ? Colors.accent[600] : Colors.neutral[700],
        borderRadius: 12,
        padding: 12,
        gap: 6,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CText size="sm" color={Colors.neutral[100]} weight="bold">
          {item.title}
        </CText>
        <CText size="xs" color={Colors.neutral[400]}>
          {item.time}
        </CText>
      </View>
      <CText size="sm" color={Colors.neutral[300]}>
        {item.message}
      </CText>
    </View>
  );
}

export default function HomeNotificationScreen() {
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const oneMonthEarlier = new Date(today);
  oneMonthEarlier.setMonth(oneMonthEarlier.getMonth() - 1);
  const defaultFromDate = formatDate(oneMonthEarlier);
  const defaultToDate = formatDate(today);

  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState(notificationData);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [fromInput, setFromInput] = useState(defaultFromDate);
  const [toInput, setToInput] = useState(defaultToDate);
  const [fromFilter, setFromFilter] = useState(defaultFromDate);
  const [toFilter, setToFilter] = useState(defaultToDate);
  const { Colors } = useTheme();
  
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setNotifications((prev) => {
        if (!prev.length) return prev;

        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setRefreshing(false);
    }, 900);
  }, []);

  const parseInputDate = (value: string, endOfDay = false) => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return null;
    const parsed = new Date(
      `${trimmed}T${endOfDay ? "23:59:59.999" : "00:00:00.000"}`,
    );
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  };

  const fromDate = parseInputDate(fromFilter, false);
  const toDate = parseInputDate(toFilter, true);

  const filteredNotifications = notifications.filter((item) => {
    const itemDate = new Date(`${item.date}T12:00:00.000`);
    const fromMatched = fromDate ? itemDate >= fromDate : true;
    const toMatched = toDate ? itemDate <= toDate : true;
    return fromMatched && toMatched;
  });

  const applyFilters = () => {
    setFromFilter(fromInput);
    setToFilter(toInput);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    setFromInput("");
    setToInput("");
    setFromFilter("");
    setToFilter("");
    setIsFilterOpen(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral[900] }}>
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 10,
          paddingBottom: 96,
          gap: 10,
        }}
        renderItem={({ item }) => <NotificationCard item={item} />}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={{ paddingVertical: 24, alignItems: "center" }}>
            <CText size="sm" color={Colors.neutral[400]}>
              No notifications yet.
            </CText>
          </View>
        }
      />
      <Pressable
        onPress={() => {
          setFromInput(fromFilter);
          setToInput(toFilter);
          setIsFilterOpen(true);
        }}
        style={{
          position: "absolute",
          right: 18,
          bottom: 20,
          width: 52,
          height: 52,
          borderRadius: 16,
          backgroundColor: Colors.accent[500],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Feather name="filter" size={20} color={Colors.neutral[900]} />
      </Pressable>

      <Modal
        transparent
        animationType="fade"
        visible={isFilterOpen}
        onRequestClose={() => {
          setIsFilterOpen(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => {
              setIsFilterOpen(false);
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
          />
          <View
            style={{
              position: "absolute",
              left: 14,
              right: 14,
              top: "24%",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[800],
              padding: 14,
              gap: 12,
            }}
          >
            <CText weight="bold" size="xmd" color="neutral" shade={200}>
              Filter Notifications
            </CText>
            <CText size="xs" color="neutral" shade={500}>
              Use date format: YYYY-MM-DD
            </CText>

            <View style={{ gap: 6 }}>
              <CText size="xs" color="neutral" shade={500}>
                From Date
              </CText>
              <TextInput
                value={fromInput}
                onChangeText={setFromInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.neutral[600]}
                style={{
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[900],
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: Colors.neutral[100],
                }}
              />
            </View>

            <View style={{ gap: 6 }}>
              <CText size="xs" color="neutral" shade={500}>
                To Date
              </CText>
              <TextInput
                value={toInput}
                onChangeText={setToInput}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.neutral[600]}
                style={{
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[900],
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: Colors.neutral[100],
                }}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
              <Pressable
                onPress={clearFilters}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.neutral[600],
                  backgroundColor: Colors.neutral[900],
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
              >
                <CText color="neutral" shade={300} weight="semibold">
                  Clear
                </CText>
              </Pressable>
              <Pressable
                onPress={applyFilters}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: "center",
                  backgroundColor: Colors.accent[500],
                }}
              >
                <CText color="neutral" shade={900} weight="bold">
                  Apply
                </CText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
