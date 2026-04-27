import HeroSectionGenerativePattern from "@/assets/images/HeroSectionGenerativePatterns.png";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  // DirectInbox,
  MoneyRecive,
  Moneys,
  MoneySend,
  Profile,
  // Send2,
  TableDocument,
} from "iconsax-react-nativejs";
import React, { useCallback, useState } from "react";
import {
  ImageBackground,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { ActivityItem } from "../../src/modules/groups/components/activity-item";
import { Href, router } from "expo-router";
import { useTheme } from "@/src/shared/providers/ThemeProviders";

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

const IconCover = ({
  children,
  label,
  path,
}: {
  children: React.ReactNode;
  label: string;
  path: Href;
}) => (
  <Pressable
    onPress={() => {
      router.push(path);
    }}
    style={{ justifyContent: "center", alignItems: "center", gap: 4, flex: 1 }}
  >
    <View
      style={{
        backgroundColor: Colors.warning[500],
        width: 44,
        height: 44,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 22,
      }}
    >
      {children}
    </View>
    {label && (
      <CText weight="medium" size="ssm">
        {label}
      </CText>
    )}
  </Pressable>
);

const Header = () => (
  <View
    style={{
      flexDirection: "row",
      // paddingHorizontal: 16,
      paddingBottom: 12,
      alignItems: "center",
    }}
  >
    {/* <View style={{ flex: 1 }} /> */}
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 6,
        flex: 1,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.neutral[100],
        }}
      >
        <Profile size={32} color={Colors.accent[500]} />
      </View>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <CText weight="semibold" size="md">
          Hi,Roman !
        </CText>
        <CText italic size="xs">
          Proud Lenden User
        </CText>
      </View>
    </View>
    <View style={{ flex: 1, alignItems: "flex-end", marginRight: 10 }}>
      <Pressable onPress={() => router.push("/(stack)/home/notification")}>
        <FontAwesome5 name="bell" size={24} color={Colors.accent[800]} />
      </Pressable>
    </View>
  </View>
);

const BalanceCard = () => (
  <ImageBackground
    source={HeroSectionGenerativePattern}
    imageStyle={{ opacity: 0.5 }}
    style={{
      height: 180,
      backgroundColor: Colors.accent[500],
      borderRadius: 24,
      borderColor: Colors.primary[400],
      borderWidth: 1,
      // borderTopRightRadius: 14,
      padding: 12,
      justifyContent: "center",
      overflow: "hidden",
      gap: 32,
    }}
  >
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        flexDirection: "row",
        flex: 1,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.accent[700],
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 999,
        }}
      >
        <CText
          weight="semibold"
          size="xs"
          color="neutral"
          shade={100}
          style={{ textAlign: "center" }}
        >
          Net Balance
        </CText>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <CText weight="medium" size="md" style={{ lineHeight: 24 }}>
          NPR.{" "}
          <CText weight="semibold" size="xlg" letterSpacing={1}>
            -398
            <CText weight="medium" size="ssm" letterSpacing={1}>
              .52
            </CText>
          </CText>
        </CText>
        {/* <Eye size="20" color={Colors.accent[900]} /> */}
      </View>
    </View>

    <View
      style={{
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconCover label="Expense" path="/(stack)/quickActions/expense">
        <Moneys size={28} color={Colors.accent[200]} />
      </IconCover>
      <IconCover label="Pay" path="/(stack)/quickActions/pay">
        <MoneySend size={28} color={Colors.accent[200]} />
      </IconCover>
      <IconCover
        label="Request"
        path={{
          pathname: "/quickActions/request",
          params: { from: "home" },
        }}
      >
        <MoneyRecive size={28} color={Colors.accent[200]} />
      </IconCover>
      {/* <IconCover
        label="Statement"
        path={{
          pathname: "/quickActions/statement",
          params: { from: "home" },
        }}
      >
        <TableDocument size={28} color={Colors.accent[200]} />
      </IconCover> */}
    </View>
  </ImageBackground>
);

const ActionCard = ({
  label,
  description,
  onPress,
  icon,
}: {
  label: string;
  description: string;
  onPress: () => void;
  icon: React.ReactNode;
}) => (
  <View style={{ gap: 6 }}>
    <CText weight="semibold" size="md" color="neutral" shade={100}>
      {label}
    </CText>
    <View
      style={{
        backgroundColor: Colors.neutral[800],
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: Colors.neutral[700],
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <View style={{ flex: 1 }}>
        <CText size="sm" color="neutral" shade={400}>
          {description}
        </CText>
      </View>
      <Pressable
        onPress={onPress}
        style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          backgroundColor: Colors.accent[500],
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </Pressable>
    </View>
  </View>
);

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
        <Header />
        <View>
          <BalanceCard />
        </View>
        <View style={{ gap: 10, paddingTop: 12 }}>
          <ActionCard
            label="Split Your Expenses"
            description="Split your expenses in a group"
            onPress={() => router.push("/(stack)/quickActions/expense")}
            icon={<Moneys size={22} color={Colors.neutral[700]} />}
          />
          <ActionCard
            label="Pay Your Friends"
            description="Pay your friends in a group"
            onPress={() => router.push("/(stack)/quickActions/pay")}
            icon={<MoneySend size={22} color={Colors.neutral[700]} />}
          />
          <ActionCard
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
          {/* <ActionCard
            label="View Statement"
            description="See your recent statement summary"
            onPress={() =>
              router.push({
                pathname: "/quickActions/statement",
                params: { from: "home" },
              })
            }
            icon={<TableDocument size={22} color={Colors.neutral[700]} />}
          /> */}
        </View>

        {/* <View style={{ justifyContent: "center", alignItems: "center" }}>
          <CText color="primary" size="lg">
            Under Construction
          </CText>
        </View> */}

        {/* <View style={{ paddingTop: 16 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CText weight="semibold" size="xmd" color="neutral" shade={100}>
              Activity
            </CText>
            <CText size="ssm" color="accent" shade={100}>
              View All
            </CText>
          </View>

          <View style={{ paddingLeft: 0 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
              }}
            >
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: Colors.neutral[500],
                }}
              />
              <CText
                color="neutral"
                shade={400}
                size="xmd"
                style={{ paddingHorizontal: 10 }}
              >
                Today
              </CText>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: Colors.neutral[500],
                }}
              />
            </View>
          </View>

          <View>
            {activities.map((item, i) => (
              <ActivityItem
                key={`${item.date}-${item.time}-${i}`}
                item={item}
              />
            ))}
          </View>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
