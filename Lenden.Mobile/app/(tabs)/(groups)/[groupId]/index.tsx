import { View, Text, Pressable, Image, Modal } from "react-native";
import React, { useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import { groupData } from "../groups.mock";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
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
  const insets = useSafeAreaInsets();
  const [selectedTab, setSelectedTab] = useState<string>(
    groupButtonsLabel[0].key,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const AciveTabScreen = TAB_CONTENT[selectedTab];
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.neutral[900],
        gap: 4,
        position: "relative",
      }}
    >
      <Stack.Screen
        options={{
          title: groupData.label,
          headerRight: () => (
            <>
              <Pressable
                onPress={() => {
                  setIsMenuOpen((prev) => !prev);
                }}
              >
                <Feather
                  name="more-vertical"
                  size={24}
                  color={Colors.neutral[200]}
                />
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

      <Modal
        transparent
        visible={isMenuOpen}
        animationType="fade"
        onRequestClose={() => {
          setIsMenuOpen(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => {
              setIsMenuOpen(false);
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          />
          <View
            style={{
              position: "absolute",
              top: insets.top + 48,
              right: 12,
              backgroundColor: Colors.neutral[400],
              zIndex: 10000,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
              gap: 8,
            }}
          >
            <Pressable
              style={{
                flexDirection: "row",
                gap: 6,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Feather name="edit" size={12} color="black" />
              <CText>Edit Info</CText>
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                gap: 6,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <Ionicons name="exit-outline" size={12} color="black" />
              <CText>Leave Group</CText>
            </Pressable>
            <Pressable
              style={{
                flexDirection: "row",
                gap: 6,
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <AntDesign name="delete" size={12} color="black" />
              <CText>Delete Group</CText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupScreen;
