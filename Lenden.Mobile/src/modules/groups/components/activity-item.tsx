import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import React from "react";
import { View } from "react-native";

export const ActivityItem = ({ item }: any) => (
  <View
    style={{
      flexDirection: "row",
      paddingVertical: 10,
      paddingLeft: 0,
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 65,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
      }}
    >
      <CText color="neutral" shade={100}>
        {item.date}
      </CText>
      <CText color="neutral" shade={100}>
        {item.time}
      </CText>
    </View>

    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          borderWidth: 1,
          marginRight: 8,
          borderColor: Colors.neutral[100],
          backgroundColor: Colors.neutral[400],
        }}
      />
      <View style={{ flex: 1 }}>
        <CText weight="medium" size="ssm" color="neutral" shade={100}>
          {item.category}
        </CText>
        <CText italic color="neutral" shade={100}>
          {item.description}
        </CText>
      </View>
      <CText weight="medium" italic color="neutral" shade={100}>
        NPR. {item.amount}
      </CText>
    </View>
  </View>
);
