import { View, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

type Participant = {
  userId: string;
  fullName: string;
};

const SelectParticipantsScreen = () => {
  const { closeSheet, selectValue, currentValue } = useBottomSheet();

  const allParticipants: Participant[] = currentValue ?? [];

  const [selected, setSelected] = useState<Participant[]>(allParticipants);
  console.log("Selected", selected);

  const toggleParticipant = (participant: Participant) => {
    setSelected((prev) => {
      const exists = prev.some((p) => p.userId === participant.userId);
      if (exists) {
        return prev.filter((p) => p.userId !== participant.userId);
      }
      return [...prev, participant];
    });
  };

  const isSelected = (userId: string) =>
    selected.some((p) => p.userId === userId);

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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CText color="neutral" shade={300} size="xmd" weight="bold">
          Select Participants
        </CText>
        <CText color="neutral" shade={500} size="sm">
          {selected.length}/{allParticipants.length} selected
        </CText>
      </View>

      {/* Select All / Deselect All */}
      <Pressable
        onPress={() => {
          if (selected.length === allParticipants.length) {
            setSelected([]);
          } else {
            setSelected(allParticipants);
          }
        }}
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 14,
          paddingVertical: 10,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: Colors.neutral[700],
          backgroundColor: Colors.neutral[800],
        }}
      >
        <Ionicons
          name={
            selected.length === allParticipants.length
              ? "checkbox"
              : "square-outline"
          }
          size={18}
          color={
            selected.length === allParticipants.length
              ? Colors.accent[400]
              : Colors.neutral[500]
          }
        />
        <CText size="md" weight="semibold" color="neutral" shade={300}>
          {selected.length === allParticipants.length
            ? "Deselect All"
            : "Select All"}
        </CText>
      </Pressable>

      <ScrollView
        contentContainerStyle={{ gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {allParticipants.map((participant) => {
          const active = isSelected(participant.userId);
          return (
            <Pressable
              key={participant.userId}
              onPress={() => toggleParticipant(participant)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: active ? Colors.accent[500] : Colors.neutral[700],
                backgroundColor: active
                  ? Colors.accent[900]
                  : Colors.neutral[800],
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: active
                      ? Colors.accent[800]
                      : Colors.neutral[700],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <CText
                    size="sm"
                    weight="bold"
                    color={active ? "accent" : "neutral"}
                    shade={active ? 300 : 400}
                  >
                    {participant.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)}
                  </CText>
                </View>
                <CText
                  size="md"
                  weight="semibold"
                  color={active ? "accent" : "neutral"}
                  shade={active ? 200 : 100}
                >
                  {participant.fullName}
                </CText>
              </View>

              <Ionicons
                name={active ? "checkmark-circle" : "ellipse-outline"}
                size={20}
                color={active ? Colors.accent[400] : Colors.neutral[600]}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={closeSheet}
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
            if (selected.length > 0) selectValue(selected);
            closeSheet();
          }}
          style={{
            flex: 1,
            backgroundColor:
              selected.length > 0 ? Colors.accent[500] : Colors.neutral[700],
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <CText weight="bold">
            Confirm {selected.length > 0 ? `(${selected.length})` : ""}
          </CText>
        </Pressable>
      </View>
    </View>
  );
};

export default SelectParticipantsScreen;
