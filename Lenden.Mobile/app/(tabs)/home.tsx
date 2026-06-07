import { BalanceCard, Header } from "@/src/modules/home";
import { ExpenseActivityItem } from "@/src/modules/home/components/expense-activities";
import { CText, useTheme } from "@/src/shared";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
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

export interface Expense {
  id: string;
  groupImage: string;
  totalAmount: number;
  createdAt: string;
  categoryKey: string;
  description: string;
}

const expenseActivities: Expense[] = [
  {
    id: "eccdc65d-7f6f-4cff-88c9-5c707d466b6c",
    groupImage: "",
    totalAmount: 4000.0,
    description: "Helmet paid for Household",
    createdAt: "2026-05-04T15:01:49.164105+00:00",
    categoryKey: "Household",
  },
  {
    id: "ceb09b5d-e119-4800-a060-721222dc4e39",
    groupImage: "",
    totalAmount: 4000.0,
    description: "Helmet paid for Household",
    createdAt: "2026-05-03T01:39:43.182201+00:00",
    categoryKey: "Household",
  },
  {
    id: "7346b2f3-e6a0-49dd-9563-3964dcfc5219",
    groupImage: "",
    totalAmount: 200.0,
    description: "Roman paid for Household",
    createdAt: "2026-05-02T14:01:08.055751+00:00",
    categoryKey: "Household",
  },
];

const recentGroupsMockData = [
  {
    id: "2bb0ceca-81f8-4494-9f50-3b2630550ec7",
    name: "Edit Group Roman ko",
    imageUrl: "https://picsum.photos/200/300",
    updatedAt: "2026-03-26T19:19:09.249947+00:00",
  },
  {
    id: "e1f88d5c-1f88-4a5b-a2f7-824de96988c6",
    name: "Shivapuri Hike",
    imageUrl: "https://picsum.photos/200/300",
    updatedAt: "2026-03-24T19:19:09.249947+00:00",
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
        {/* <View style={{ gap: 10, paddingTop: 12 }}>
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
        </View> */}
        <View style={{ gap: 12, paddingTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CText weight="semibold" size="md" color="neutral" shade={100}>
              Expense Activities
            </CText>
            {/* <Pressable
              onPress={() => {
                router.push("/")
              }}
            >
              <CText weight="bold" size="ssm" color="neutral" shade={100}>
                View All
              </CText>
            </Pressable> */}
          </View>
          <View style={{ borderRadius: 10, gap: 10 }}>
            {expenseActivities.map((item, index) => (
              <View
                key={item.id}
                style={{
                  backgroundColor: Colors.neutral[800],
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: Colors.neutral[700],
                  // marginHorizontal: 10,
                  paddingHorizontal: 10,
                  width: "100%",
                }}
              >
                <ExpenseActivityItem item={item} />
              </View>
            ))}
          </View>
        </View>

        <View style={{ gap: 12, paddingTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CText weight="semibold" size="md" color="neutral" shade={100}>
              Recent Groups
            </CText>
            <Pressable
              onPress={() => {
                router.push("/(tabs)/groups");
              }}
            >
              <CText weight="semibold" size="md" color="neutral" shade={100}>
                View All
              </CText>
            </Pressable>
          </View>
          <View
            style={{
              backgroundColor: Colors.neutral[800],
              borderWidth: 1,
              borderRadius: 12,
              borderColor: Colors.neutral[700],
              // marginHorizontal: 10,
              paddingHorizontal: 10,
              width: "100%",
              minHeight: 70,
              alignItems: "center",
              justifyContent: "flex-start",
              flexDirection: "row",
              gap: 12,
            }}
          >
            {recentGroupsMockData.map((item, index) => (
              <Pressable
                onPress={() => {
                  router.push({
                    pathname: "/(stack)/groups/[groupId]",
                    params: { groupId: item.id },
                  });
                }}
                style={{
                  borderWidth: 1,
                  borderRadius: "50%",
                  width: 60,
                  height: 60,
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  borderColor: Colors.neutral[600],
                }}
              >
                <Image source={{ uri: item.imageUrl }} width={60} height={60} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
