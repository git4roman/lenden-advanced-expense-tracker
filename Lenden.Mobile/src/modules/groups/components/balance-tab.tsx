import { View, Text, FlatList } from "react-native";
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
    balance: -250,
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

const BalanceTab = () => {
  const maxBalance = Math.max(...balanceData.map((b) => Math.abs(b.balance)));
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={balanceData}
        renderItem={({ item }) => (
          <BalanceItem item={item} maxBalance={maxBalance} />
        )}
        contentContainerStyle={{ gap: 10 }}
        keyExtractor={(item) => item.user.id.toString()}
      />
    </View>
  );
};

export default BalanceTab;

function BalanceItem({ item, maxBalance }: { item: any; maxBalance: any }) {
  const isPositive = item.balance > 0;
  const absBalance = Math.abs(item.balance);
  const minWidth = 60;
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
  console.log(widthPercent);

  if (absBalance === 0) return;

  return (
    <View style={{ flexDirection: isPositive ? "row" : "row-reverse" }}>
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{ alignItems: isPositive ? "flex-end" : "stretch" }}>
          <CText shade={50} size="ssm" letterSpacing={0.4}>
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
            padding: 16,
            borderTopRightRadius: isPositive ? 8 : 0,
            borderBottomRightRadius: isPositive ? 8 : 0,
            borderTopLeftRadius: isPositive ? 0 : 8,
            borderBottomLeftRadius: isPositive ? 0 : 8,
            alignItems: isPositive ? "stretch" : "flex-end",
          }}
        >
          <CText shade={50} size="ssm" letterSpacing={0.4}>
            {isPositive ? `+ NPR ${absBalance} ` : `- NPR ${absBalance} `}
          </CText>
        </View>
      </View>
    </View>
  );
}
