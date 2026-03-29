import { View, Text, Pressable } from "react-native";
import React, { useState } from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";

const totalfilterTabs = [
  {
    key: "oneday",
    label: "1D",
  },
  {
    key: "oneweek",
    label: "1W",
  },
  {
    key: "onemonth",
    label: "1M",
  },
  {
    key: "threemonth",
    label: "3M",
  },
  {
    key: "sixmonth",
    label: "6M",
  },
  {
    key: "oneyear",
    label: "1Y",
  },
];

const categories = [
  { key: "Total Group Spending", amount: "NPR. 4654.5" },
  { key: "Total You paid for", amount: "NPR. 454.5" },
  { key: "Total You recieved", amount: "NPR. 654.5" },
];

const TotalTab = ({groupId}) => {
  const [selectedTab, setSelectedTab] = useState("oneday");
  return (
    <>
      <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
        {totalfilterTabs.map((item, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setSelectedTab(item.key);
            }}
            style={{
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              borderRadius: 8,
              paddingHorizontal: 12,
              paddingVertical: 6,
              backgroundColor:
                selectedTab === item.key ? Colors.accent[900] : "transparent",
            }}
          >
            <CText
              size="ssm"
              shade={50}
              letterSpacing={1}
              style={{ textAlign: "center" }}
            >
              {item.label}
            </CText>
          </Pressable>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
          rowGap: 14,
          columnGap: 14,
        }}
      >
        {categories.map((item, index) => (
          <View
            key={index}
            style={{
              flexBasis: "48%",
              borderWidth: 1,
              borderColor: Colors.neutral[600],
              paddingVertical: 8,
              paddingHorizontal: 16,
              borderRadius: 8,
              gap: 4,
              justifyContent: "center",
            }}
          >
            <CText size="ssm" color="neutral" shade={400} letterSpacing={0.4}>
              {item.key}
            </CText>
            <CText weight="semibold" size="xmd" color="neutral" shade={200}>
              {item.amount}
            </CText>
          </View>
        ))}
      </View>
    </>
  );
};

export default TotalTab;
