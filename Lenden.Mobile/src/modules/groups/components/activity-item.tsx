import { sharedExpenseCategories } from "@/src/shared/constants/expense-category.constant";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import React from "react";
import { Pressable, View } from "react-native";

export const ActivityItem = ({ item }: any) => {
  const categories = sharedExpenseCategories(Colors);
  const category = categories.find((cat) => cat.key === item.categoryKey);
  return (
    <View
      style={{
        flexDirection: "row",
        minHeight: 84,
        paddingVertical: 10,
        paddingHorizontal: 6,
        paddingLeft: 0,
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 12,
      }}
    >
      <View
        style={{
          width: 40,
          height: 40,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 20,
          backgroundColor: Colors.neutral[700],
        }}
      >
        {category?.icon}
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "stretch",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        <View style={{ flex: 1, justifyContent: "space-between", gap: 4 }}>
          <CText
            size="ssm"
            color="neutral"
            shade={200}
            letterSpacing={0.3}
            numberOfLines={2}
          >
            {item.description}
          </CText>
          <CText size="xs" color="neutral" shade={500}>
            {item.time}
          </CText>
        </View>
        <View style={{}}>
          <CText size="ssm" weight="semibold" color="accent" shade={300}>
            NPR. {item.amount}
          </CText>
        </View>
      </View>
    </View>
  );
};
