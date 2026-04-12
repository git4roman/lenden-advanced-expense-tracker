import { View, Pressable } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useGetGroupsQuery } from "@/src/shared/store/apiSlices/group-slice.api";

const SelectGroupScreen = () => {
  const { closeSheet, selectValue, currentValue } = useBottomSheet();
  const { data: groups = [] } = useGetGroupsQuery(undefined);

  // local pending state — initialized from currentValue (pre-selected group)
  const [pendingGroup, setPendingGroup] = useState<any>(currentValue ?? null);

  return (
    <View
      style={{
        backgroundColor: Colors.neutral[900],
        flex: 1,
        paddingVertical: 16,
        paddingHorizontal: 20,
        gap: 16,
        paddingBottom: 24,
      }}
    >
      <View>
        <CText color="neutral" shade={300} size="xmd" weight="bold">
          Select Group
        </CText>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={{ gap: 10 }}
        showsVerticalScrollIndicator={false}
      >
        {groups.map((group: any) => {
          const isSelected = pendingGroup?.id === group.id; // 👈 use local state
          return (
            <Pressable
              key={group.id}
              onPress={() => setPendingGroup(group)} // 👈 only update local state
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isSelected ? Colors.accent[500] : Colors.neutral[700],
                backgroundColor: isSelected ? Colors.accent[900] : Colors.neutral[800],
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: isSelected ? Colors.accent[800] : Colors.neutral[700],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="people-outline"
                    size={18}
                    color={isSelected ? Colors.accent[400] : Colors.neutral[400]}
                  />
                </View>
                <View style={{ gap: 2 }}>
                  <CText
                    size="md"
                    weight="semibold"
                    color={isSelected ? "accent" : "neutral"}
                    shade={isSelected ? 200 : 100}
                  >
                    {group.name}
                  </CText>
                  <CText size="xs" color="neutral" shade={500}>
                    {group.members?.length ?? 0} members
                  </CText>
                </View>
              </View>

              {isSelected && (
                <Ionicons name="checkmark-circle" size={20} color={Colors.accent[400]} />
              )}
            </Pressable>
          );
        })}
      </BottomSheetScrollView>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={closeSheet} // 👈 cancel — discards pendingGroup, nothing committed
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: Colors.neutral[600],
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <CText shade={300}>Cancel</CText>
        </Pressable>
        <Pressable
          onPress={() => {
            if (pendingGroup) selectValue(pendingGroup); // 👈 only commit on Confirm
            closeSheet();
          }}
          style={{
            flex: 1,
            backgroundColor: pendingGroup ? Colors.accent[500] : Colors.neutral[700],
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <CText weight="bold">Confirm</CText>
        </Pressable>
      </View>
    </View>
  );
};

export default SelectGroupScreen;
