import { View, FlatList, ScrollView } from "react-native";
import React from "react";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";

const balanceData = [
  {
    groupId: 5,
    user: {
      id: 4,
      givenName: "John",
      familyName: "Doe",
    },
    balance: 370,
  },
  {
    groupId: 5,
    user: {
      id: 5,
      givenName: "Jane",
      familyName: "Smith",
    },
    balance: -120,
  },
  {
    groupId: 5,
    user: {
      id: 6,
      givenName: "Alex",
      familyName: "Johnson",
    },
    balance: 0,
  },
  {
    groupId: 7,
    user: {
      id: 8,
      givenName: "Emily",
      familyName: "Brown",
    },
    balance: 540,
  },
  {
    groupId: 7,
    user: {
      id: 9,
      givenName: "Michael",
      familyName: "Lee",
    },
    balance: -2500,
  },
  {
    groupId: 9,
    user: {
      id: 11,
      givenName: "Sara",
      familyName: "Wilson",
    },
    balance: 90,
  },
];

const groupMutualBalance = [
  { from: "Maryland Winkles", to: "Andrew", balance: 2503 },
  { from: "John Doe", to: "Jane Smith", balance: 1200 },
  { from: "Alex Johnson", to: "Emily Brown", balance: 540 },
  { from: "Michael Lee", to: "Sara Wilson", balance: 875 },
];

const BalanceTab = () => {
  const maxBalance = Math.max(...balanceData.map((b) => Math.abs(b.balance)));
  return (
    <ScrollView style={{}} showsVerticalScrollIndicator={false}>
      <View style={{ gap: 12, paddingBottom: 20 }}>
        <FlatList
          data={balanceData}
          renderItem={({ item }) => (
            <BalanceItem item={item} maxBalance={maxBalance} />
          )}
          contentContainerStyle={{
            gap: 10,
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: 12,
            backgroundColor: Colors.neutral[900],
            borderColor: Colors.neutral[800],
          }}
          keyExtractor={(item) => item.user.id.toString()}
          scrollEnabled={false}
        />
        <FlatList
          keyExtractor={(_, index) => index.toString()}
          data={groupMutualBalance}
          renderItem={({ item }) => <GroupMemberMutualBalance item={item} />}
          contentContainerStyle={{
            gap: 10,
            borderWidth: 1,
            borderRadius: 12,
            paddingVertical: 10,
            backgroundColor: Colors.neutral[900],
            borderColor: Colors.neutral[800],
            paddingHorizontal: 8,
          }}
          scrollEnabled={false}
          ItemSeparatorComponent={() => (
            <View
              style={{
                width: "100%",
                height: 1,
                backgroundColor: Colors.neutral[600],
                marginVertical: 4,
                opacity: 0.3,
              }}
            />
          )}
        />
      </View>
    </ScrollView>
  );
};

export default BalanceTab;

function BalanceItem({ item, maxBalance }: { item: any; maxBalance: any }) {
  const isPositive = item.balance > 0;
  const absBalance = Math.abs(item.balance);
  const minWidth = 55;
  const maxWidth = 90;
  const widthPercent =
    absBalance === 0
      ? minWidth
      : Math.floor(
          Math.max(
            minWidth,
            Math.min(maxWidth, (absBalance / maxBalance) * maxWidth),
          ),
        );

  if (absBalance === 0) return;

  return (
    <View style={{ flexDirection: isPositive ? "row" : "row-reverse" }}>
      <View style={{ flex: 1, padding: 8 }}>
        <View style={{ alignItems: isPositive ? "flex-end" : "stretch" }}>
          <CText shade={50} size="sm" letterSpacing={0.4}>
            {item.user.givenName} {item.user.familyName}
          </CText>
        </View>
      </View>
      <View
        style={{ flex: 1, alignItems: isPositive ? "flex-start" : "flex-end" }}
      >
        <View
          style={{
            width: `${widthPercent}%`,
            backgroundColor: isPositive ? "green" : "red",
            padding: 8,
            borderTopRightRadius: isPositive ? 8 : 0,
            borderBottomRightRadius: isPositive ? 8 : 0,
            borderTopLeftRadius: isPositive ? 0 : 8,
            borderBottomLeftRadius: isPositive ? 0 : 8,
            alignItems: isPositive ? "stretch" : "flex-end",
          }}
        >
          <CText shade={50} size="sm" letterSpacing={0.4}>
            {isPositive ? `+ NPR ${absBalance} ` : `- NPR ${absBalance} `}
          </CText>
        </View>
      </View>
    </View>
  );
}

function GroupMemberMutualBalance({ item }: { item: any }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        borderRadius: 12,
        backgroundColor: Colors.neutral[800],
        paddingVertical: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          flex: 1,
          paddingHorizontal: 12,
        }}
      >
        <View style={{ gap: 2 }}>
          <View>
            <CText color="neutral" shade={300} weight="semibold" size="md">
              {item.from}
            </CText>
          </View>
          <CText color="neutral" shade={500} weight="regular" size="ssm">
            owes
          </CText>
          <View>
            <CText color="neutral" shade={300} weight="semibold" size="md">
              {item.to}
            </CText>
          </View>
        </View>
        <View style={{ alignItems: "flex-end", gap: 2 }}>
          <CText color="accent" shade={300} weight="bold" size="md">
            NPR {item.balance}
          </CText>
        </View>
      </View>
    </View>
  );
}
