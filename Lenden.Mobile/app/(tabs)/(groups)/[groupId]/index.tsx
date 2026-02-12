import { View, Pressable, Image, Modal, ScrollView, RefreshControl } from "react-native";
import React, { useCallback, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import { groupData } from "../groups.mock";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
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
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const onRefresh = useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshKey((prev) => prev + 1);
      setRefreshing(false);
    }, 900);
  }, []);

  const AciveTabScreen = TAB_CONTENT[selectedTab];
  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: Colors.neutral[900],
        position: "relative",
      }}
      contentContainerStyle={{ flexGrow: 1, gap: 4 }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.neutral[200]}
          colors={[Colors.accent[400]]}
        />
      }
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
        <AciveTabScreen key={`${selectedTab}-${refreshKey}`} />
        {/* {selectedTab === "Expenses" && (
          
        )} */}
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
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: insets.top + 48,
              right: 12,
              backgroundColor: Colors.neutral[800],
              borderColor: Colors.neutral[700],
              borderWidth: 1,
              zIndex: 10000,
              paddingVertical: 8,
              paddingHorizontal: 8,
              borderRadius: 14,
              gap: 6,
              minWidth: 110,
            }}
          >
            {/* <View style={{ gap: 2, paddingHorizontal: 4, paddingBottom: 2 }}>
              <CText weight="bold" size="sm" color="neutral" shade={200}>
                Group Actions
              </CText>
              <CText size="xs" color="neutral" shade={500}>
                Manage this group
              </CText>
            </View> */}
            <Pressable
              onPress={() => {
                setIsMenuOpen(false);
              }}
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "flex-start",
                alignItems: "center",
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: Colors.neutral[900],
                borderWidth: 1,
                borderColor: Colors.neutral[700],
              }}
            >
              <Feather name="edit-2" size={15} color={Colors.neutral[300]} />
              <CText color="neutral" shade={200} weight="semibold">
                Edit Info
              </CText>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsMenuOpen(false);
              }}
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "flex-start",
                alignItems: "center",
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: Colors.neutral[900],
                borderWidth: 1,
                borderColor: Colors.neutral[700],
              }}
            >
              <Ionicons
                name="exit-outline"
                size={16}
                color={Colors.warning[400]}
              />
              <CText color="neutral" shade={200} weight="semibold">
                Leave Group
              </CText>
            </Pressable>
            <Pressable
              onPress={() => {
                setIsMenuOpen(false);
              }}
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "flex-start",
                alignItems: "center",
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: Colors.warning[900],
                borderWidth: 1,
                borderColor: Colors.warning[700],
              }}
            >
              <AntDesign name="delete" size={14} color={Colors.warning[300]} />
              <CText color="warning" shade={300} weight="semibold">
                Delete Group
              </CText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default GroupScreen;
