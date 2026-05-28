import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import React, { useState } from "react";
import { Pressable, View } from "react-native";

const GroupContextMenuScreen = () => {
  const { closeSheet, selectValue, currentValue } = useBottomSheet();
  const [groups, setGroups] = useState(currentValue);
  const [selectedGroup, setSelectedGroup] = useState(currentValue);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.neutral[900],
        paddingHorizontal: 20,
      }}
    >
      {/* Header */}
      <View style={{ paddingVertical: 16 }}>
        <CText color="neutral" shade={300} size="xmd" weight="bold">
          Select Group
        </CText>
      </View>

      {/* Scrollable list */}
      <View style={{ flex: 0.9 }}>
        <BottomSheetScrollView
          contentContainerStyle={{ gap: 10, paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {groups.map((group: any) => {
            const isSelected = selectedGroup?.id === group.id;
            return (
              <Pressable
                key={group.id}
                onPress={() => {
                  setSelectedGroup(group);
                  selectValue(group);
                  setTimeout(() => {
                    closeSheet();
                  }, 200);
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isSelected
                    ? Colors.accent[500]
                    : Colors.neutral[700],
                  backgroundColor: isSelected
                    ? Colors.accent[900]
                    : Colors.neutral[800],
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: isSelected
                        ? Colors.accent[800]
                        : Colors.neutral[700],
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="people-outline"
                      size={18}
                      color={
                        isSelected ? Colors.accent[400] : Colors.neutral[400]
                      }
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
                      {group.memberCount ?? 0} members
                    </CText>
                  </View>
                </View>
                {isSelected && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={Colors.accent[400]}
                  />
                )}
              </Pressable>
            );
          })}
        </BottomSheetScrollView>
      </View>

      {/* Buttons */}
      <View style={{ flexDirection: "row", gap: 10, paddingVertical: 16 }}>
        <Pressable
          onPress={closeSheet}
          style={({ pressed }) => ({
            flex: 1,
            borderWidth: 1,
            borderColor: pressed ? Colors.neutral[500] : Colors.neutral[600],
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: pressed ? Colors.neutral[700] : "transparent",
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <CText shade={300}>Cancel</CText>
        </Pressable>
        {/* <Pressable
          onPress={() => {
            if (selectedGroup) selectValue(selectedGroup);
            closeSheet();
          }}
          style={{
            flex: 1,
            backgroundColor: selectedGroup
              ? Colors.accent[500]
              : Colors.neutral[700],
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <CText weight="bold">Confirm</CText>
        </Pressable> */}
      </View>
    </View>
  );
};

export default GroupContextMenuScreen;
