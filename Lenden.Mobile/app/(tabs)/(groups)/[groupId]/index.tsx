import { View, Text, Pressable, Image } from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import { groupData } from "../groups.mock";
import { AntDesign } from "@expo/vector-icons";
import { Bag, Edit } from "iconsax-react-nativejs";
import { Flex } from "@ant-design/react-native";
import { GroupTabs } from "../../../../src/modules/groups/components/GroupTabs";
import ExpenseTab from "@/src/modules/groups/components/expense-tab";
import BalanceTab from "@/src/modules/groups/components/balance-tab";
import TotalTab from "@/src/modules/groups/components/total-tab";
import GroupInfoTab from "@/src/modules/groups/components/group-info-tab";

export const groupButtonsLabel = [
  { key: "Expenses", label: "Expenses" },
  { key: "label2", label: "Balances" },
  { key: "label3", label: "Total" },
  { key: "label4", label: "Group Info" },
];

const TAB_CONTENT: Record<string, React.FC> = {
  Expenses: ExpenseTab,
  label2: BalanceTab,
  label3: TotalTab,
  label4: GroupInfoTab,
};

const GroupScreen = () => {
  const { groupId } = useLocalSearchParams();
  const [selectedTab, setSelectedTab] = useState<string>(
    groupButtonsLabel[0].key,
  );
  const AciveTabScreen = TAB_CONTENT[selectedTab];
  return (
    <View
      style={{
        flex: 1,
        // paddingHorizontal: 6,
        backgroundColor: Colors.neutral[900],
        gap: 4,
      }}
    >
      <Stack.Screen
        options={{
          title: groupData.label,
          headerRight: () => (
            <>
              <Pressable onPress={() => console.log("Edit")}>
                <Edit size="22" color={Colors.accent[600]} />
              </Pressable>
              <Pressable
                style={{ marginLeft: 8 }}
                onPress={() => console.log("REMOve")}
              >
                <Bag size="22" color={Colors.accent[600]} />
              </Pressable>
            </>
          ),
        }}
      />
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 12,
          paddingVertical: 12,
          marginBottom: 8,
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: groupData.image }}
          style={{
            width: "100%",
            height: 150,
            borderRadius: 16,
          }}
          resizeMode="cover"
        />
      </View>

      <View
        style={{ gap: 12, paddingHorizontal: 8, flex: 1, position: "relative" }}
      >
        <GroupTabs selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
        <AciveTabScreen />
        {selectedTab === "Expenses" && (
          <Pressable
            onPress={() => {
              console.log("Add Expense");
            }}
            style={{
              backgroundColor: Colors.accent[500],
              width: "auto",
              position: "absolute",
              bottom: 20,
              right: 10,
              paddingHorizontal: 20,
              paddingVertical: 14,
              borderRadius: 18,
            }}
          >
            <CText weight="bold" size="md">
              + Add Expense
            </CText>
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default GroupScreen;
