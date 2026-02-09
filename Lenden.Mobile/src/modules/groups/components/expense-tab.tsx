import { View, ScrollView, Pressable, FlatList } from "react-native";
import React from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { ActivityItem } from "./activity-item";
import { Colors } from "@/src/shared/ui/theme/colors";

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

const ExpenseTab = () => {
  return (
    <ScrollView
      style={{ borderColor: "transparent" }}
      contentContainerStyle={{ paddingBottom: 14 }}
    >
      <View style={{ gap: 0 }}>
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
              backgroundColor: Colors.neutral[700],
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
              backgroundColor: Colors.neutral[700],
            }}
          />
        </View>
        <View
          style={{
            // backgroundColor: Colors.neutral[700],
            // borderWidth: 1,
            borderRadius: 8,
            // paddingHorizontal: 8,
            // paddingVertical: 6,
            gap: 4,
          }}
        >
          {activityMockData.map((item, index) => (
            <Pressable
              key={index}
              style={{
                backgroundColor: Colors.neutral[800],
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "transparent",
              }}
            >
              <ActivityItem item={item} />
            </Pressable>
          ))}
        </View>
      </View>
      <View style={{ gap: 0 }}>
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
              backgroundColor: Colors.neutral[700],
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
              backgroundColor: Colors.neutral[700],
            }}
          />
        </View>
        <View
          style={{
            // backgroundColor: Colors.neutral[700],
            // borderWidth: 1,
            borderRadius: 8,
            // paddingHorizontal: 8,
            // paddingVertical: 6,
            gap: 4,
          }}
        >
          {activityMockData.map((item, index) => (
            <Pressable
              key={index}
              style={{
                backgroundColor: Colors.neutral[800],
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "transparent",
              }}
            >
              <ActivityItem item={item} />
            </Pressable>
          ))}
        </View>
      </View>
      <View style={{ gap: 0 }}>
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
              backgroundColor: Colors.neutral[700],
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
              backgroundColor: Colors.neutral[700],
            }}
          />
        </View>
        <View
          style={{
            // backgroundColor: Colors.neutral[700],
            // borderWidth: 1,
            borderRadius: 8,
            // paddingHorizontal: 8,
            // paddingVertical: 6,
            gap: 4,
          }}
        >
          {activityMockData.map((item, index) => (
            <Pressable
              key={index}
              style={{
                backgroundColor: Colors.neutral[800],
                borderWidth: 1,
                borderRadius: 8,
                borderColor: "transparent",
              }}
            >
              <ActivityItem item={item} />
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ExpenseTab;
