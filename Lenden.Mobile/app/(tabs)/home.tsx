import { ActionCard, BalanceCard, Header } from "@/src/modules/home";
import { useTheme } from "@/src/shared";
import { router } from "expo-router";
import {
  // DirectInbox,
  MoneyRecive,
  Moneys,
  MoneySend,
  // Send2,
  TableDocument,
} from "iconsax-react-nativejs";
import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const activityMockData = [
  {
    date: "19 Jan",
    time: "12:00 AM",
    category: "Food and Beverages",
    description: "Roman and 3 others paid..",
    amount: "2000",
  },
  {
    date: "19 Jan",
    time: "08:45 AM",
    category: "Transport",
    description: "Roman paid for taxi",
    amount: "650",
  },
  {
    date: "19 Jan",
    time: "08:45 AM",
    category: "Transport",
    description: "Roman paid for taxi",
    amount: "650",
  },
];

const HomeScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [activities, setActivities] = useState(activityMockData);
  const { Colors } = useTheme();

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setActivities((prev) => {
        if (!prev.length) return prev;
        const [first, ...rest] = prev;
        return [...rest, first];
      });
      setRefreshing(false);
    }, 900);
  }, []);

  return (
    <SafeAreaView
      edges={["top"]}
      style={{
        flex: 1,
        backgroundColor: Colors.primary[500],

        // paddingHorizontal: 24,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          position: "relative",
          backgroundColor: Colors.neutral[900],
        }}
        contentContainerStyle={{ paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.neutral[200]}
            colors={[Colors.accent[400]]}
          />
        }
      >
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: -1,
            backgroundColor: Colors.primary[500],
            height: 80,
            // width: "100%",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />
        <Header Colors={Colors} />
        <View>
          <BalanceCard Colors={Colors} />
        </View>
        <View style={{ gap: 10, paddingTop: 12 }}>
          <ActionCard
            Colors={Colors}
            label="Split Your Expenses"
            description="Split your expenses in a group"
            onPress={() => router.push("/(stack)/quickActions/expense")}
            icon={<Moneys size={22} color={Colors.neutral[700]} />}
          />
          <ActionCard
            Colors={Colors}
            label="Pay Your Friends"
            description="Pay your friends in a group"
            onPress={() => router.push("/(stack)/quickActions/pay")}
            icon={<MoneySend size={22} color={Colors.neutral[700]} />}
          />
          <ActionCard
            Colors={Colors}
            label="Request Money"
            description="Request money from a friend or group"
            onPress={() =>
              router.push({
                pathname: "/quickActions/request",
                params: { from: "home" },
              })
            }
            icon={<MoneyRecive size={22} color={Colors.neutral[700]} />}
          />
          <ActionCard
            Colors={Colors}
            label="Settlements"
            description="See your recent settlements"
            onPress={() =>
              router.push({
                pathname: "/quickActions/settlement",
                params: { from: "home" },
              })
            }
            icon={<TableDocument size={22} color={Colors.neutral[700]} />}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
