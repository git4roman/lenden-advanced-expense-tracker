import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import React from "react";
import { View, Pressable } from "react-native";
import { groupButtonsLabel } from "../../../../app/(tabs)/(groups)/[groupId]";

export function GroupTabs({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: string;
  setSelectedTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        // marginHorizontal: -16,
        justifyContent: "space-between",
        gap: 6,
      }}
    >
      {groupButtonsLabel.map((item, index) => (
        <View key={index} style={{ flex: 1 }}>
          <Pressable
            style={{
              backgroundColor:
                selectedTab === item.key
                  ? Colors.accent[500]
                  : Colors.neutral[500],
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 12,
              width: "100%",
              height: 36,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => {
              setSelectedTab(item.key);
            }}
          >
            <CText
              weight="semibold"
              size="sm"
              color="neutral"
              shade={800}
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{ flexShrink: 1 }}
            >
              {item.label}
            </CText>
          </Pressable>
        </View>
      ))}
    </View>
  );
}
