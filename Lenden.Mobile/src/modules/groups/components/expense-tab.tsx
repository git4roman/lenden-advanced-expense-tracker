import { View, ScrollView, Pressable, FlatList } from "react-native";
import React from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { ActivityItem } from "./activity-item";
import { Colors } from "@/src/shared/ui/theme/colors";
import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";

const activityMockData = [
  {
    date: "19 Jan",
    time: "12:00 PM",
    categoryKey: "food_groceries", // key instead of label
    description: "Roman and 3 others bought groceries from BhatBhateni",
    amount: "2000",
  },
  {
    date: "19 Jan",
    time: "08:45 AM",
    categoryKey: "transportation_travel",
    description: "Roman paid for a taxi ride",
    amount: "650",
  },
  {
    date: "20 Jan",
    time: "07:30 AM",
    categoryKey: "accommodation",
    description: "Monthly room rent paid by Roman",
    amount: "8000",
  },
  {
    date: "20 Jan",
    time: "09:00 AM",
    categoryKey: "household_utilities",
    description: "Internet bill for shared WiFi paid",
    amount: "1200",
  },
  {
    date: "21 Jan",
    time: "06:30 PM",
    categoryKey: "lifestyle_personal",
    description: "Netflix subscription shared among roommates",
    amount: "500",
  },
  {
    date: "21 Jan",
    time: "08:00 PM",
    categoryKey: "food_groceries",
    description: "Dinner at Newa Lahana by Roman and 2 others",
    amount: "1500",
  },
  {
    date: "22 Jan",
    time: "08:00 AM",
    categoryKey: "household_utilities",
    description: "LPG cylinder refill for cooking",
    amount: "2500",
    
  },
  {
    date: "20 Jan",
    time: "09:00 AM",
    categoryKey: "household_utilities",
    description: "Internet bill for shared WiFi paid",
    amount: "1200",
  },
  {
    date: "21 Jan",
    time: "06:30 PM",
    categoryKey: "lifestyle_personal",
    description: "Netflix subscription shared among roommates",
    amount: "500",
  },
  {
    date: "21 Jan",
    time: "08:00 PM",
    categoryKey: "food_groceries",
    description: "Dinner at Newa Lahana by Roman and 2 others",
    amount: "1500",
  },
  {
    date: "22 Jan",
    time: "08:00 AM",
    categoryKey: "household_utilities",
    description: "LPG cylinder refill for cooking",
    amount: "2500",
  },
];

const ExpenseTab = () => {
  return (
    <ScrollView
      style={{ borderColor: "transparent" }}
      contentContainerStyle={{ paddingBottom: 50 }}      
      showsVerticalScrollIndicator={false}
    >
     
      <View style={{ gap: 5 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <CText
            color="neutral"
            shade={400}
            size="ssm"
            
            style={{ paddingHorizontal: 10 }}
            weight="medium"
            
          >
            Fri, FEB 6           
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
            borderRadius: 8,
            gap: 8,
          }}
        >
          {activityMockData.map((item, index) => (
            <Pressable
              key={index}
              style={{
                backgroundColor: Colors.neutral[800],
                borderWidth: 1,
                borderRadius: 8,
                borderColor: Colors.neutral[700],
                paddingHorizontal: 8,
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
