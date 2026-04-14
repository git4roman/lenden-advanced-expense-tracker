import { View, Pressable, ScrollView, TextInput } from "react-native";
import React, { useState, useCallback } from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { useTheme } from "../../providers/ThemeProviders";
import { Ionicons } from "@expo/vector-icons";

export type ExpenseSplitter = {
  userId: string;
  fullName: string;
  splitAmount: number;
  isParticipant: boolean;
};

const getEqualSplit = (participants: ExpenseSplitter[], totalAmount: number) => {
  const activeCount = participants.filter((p) => p.isParticipant).length;
  const share = activeCount ? totalAmount / activeCount : 0;
  return participants.map((p) => ({
    ...p,
    splitAmount: p.isParticipant ? parseFloat(share.toFixed(2)) : 0,
  }));
};

const AddSplittersBottomSheetScreen = () => {
  const { currentValue, selectValue, closeSheet } = useBottomSheet();
  const { Colors } = useTheme();

  const totalAmount = currentValue?.totalAmount || 0;
  const initialParticipants: ExpenseSplitter[] = currentValue?.participants ?? [];

  const [useEqualPay, setUseEqualPay] = useState(true);
  const [expenseParticipants, setExpenseParticipants] = useState<ExpenseSplitter[]>(
    () => getEqualSplit(initialParticipants, totalAmount),
  );

  const recomputeEqual = useCallback(
    (participants: ExpenseSplitter[]) => getEqualSplit(participants, totalAmount),
    [totalAmount],
  );

  const handleToggleMode = (equal: boolean) => {
    setUseEqualPay(equal);
    if (equal) {
      setExpenseParticipants(recomputeEqual(initialParticipants));
    } else {
      setExpenseParticipants((prev) =>
        prev.map((p) => ({ ...p, splitAmount: 0 })),
      );
    }
  };

  const handleToggleParticipant = (userId: string) => {
    setExpenseParticipants((prev) => {
      const updated = prev.map((p) =>
        p.userId === userId ? { ...p, isParticipant: !p.isParticipant } : p,
      );
      return useEqualPay ? recomputeEqual(updated) : updated;
    });
  };

  const assignedTotal = expenseParticipants.reduce(
    (sum, p) => sum + (p.splitAmount || 0),
    0,
  );
  const remaining = totalAmount - assignedTotal;

  const handleSave = () => {
    selectValue({ ...currentValue, participants: expenseParticipants });
    closeSheet();
  };

  const canSave = useEqualPay || remaining === 0;

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
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CText color="neutral" shade={300} size="lg" weight="bold">
          Add Splitters
        </CText>

        {!useEqualPay && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <CText size="ssm" color="neutral" shade={400}>
              Remaining
            </CText>
            <CText
              size="md"
              weight="semibold"
              color={remaining === 0 ? "success" : "warning"}
              shade={500}
            >
              ${remaining.toFixed(2)}
            </CText>
          </View>
        )}
      </View>

      {/* Equal / Unequal Toggle */}
      <View
        style={{
          flexDirection: "row",
          gap: 6,
          backgroundColor: Colors.neutral[800],
          borderRadius: 12,
          padding: 4,
        }}
      >
        {[true, false].map((isEqual) => (
          <Pressable
            key={String(isEqual)}
            onPress={() => handleToggleMode(isEqual)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor:
                useEqualPay === isEqual ? Colors.accent[900] : "transparent",
              alignItems: "center",
            }}
          >
            <CText
              size="md"
              weight={useEqualPay === isEqual ? "semibold" : "medium"}
              color={useEqualPay === isEqual ? "accent" : "neutral"}
              shade={useEqualPay === isEqual ? 100 : 200}
            >
              {isEqual ? "Equal Split" : "Unequal Split"}
            </CText>
          </Pressable>
        ))}
      </View>

      {/* Splitters List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12 }}>
          {expenseParticipants.map((splitter) => (
            <Pressable
              key={splitter.userId}
              onPress={() => handleToggleParticipant(splitter.userId)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: useEqualPay
                  ? splitter.isParticipant
                    ? Colors.accent[500]
                    : Colors.neutral[700]
                  : Colors.neutral[700],
                backgroundColor: useEqualPay
                  ? splitter.isParticipant
                    ? Colors.accent[900]
                    : Colors.neutral[800]
                  : Colors.neutral[800],
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  flex: 1,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: Colors.neutral[700],
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Ionicons
                    name="person"
                    size={20}
                    color={Colors.neutral[400]}
                  />
                </View>

                <CText size="md" weight="semibold" color="neutral" shade={100}>
                  {splitter.fullName}
                </CText>
              </View>

              <TextInput
                editable={!useEqualPay && splitter.isParticipant}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={Colors.neutral[500]}
                value={splitter.splitAmount ? splitter.splitAmount.toString() : ""}
                onChangeText={(text) => {
                  const amount = parseFloat(text) || 0;
                  setExpenseParticipants((prev) =>
                    prev.map((p) =>
                      p.userId === splitter.userId
                        ? { ...p, splitAmount: amount }
                        : p,
                    ),
                  );
                }}
                style={{
                  minWidth: 80,
                  textAlign: "right",
                  fontSize: 18,
                  fontWeight: "600",
                  color: useEqualPay
                    ? Colors.neutral[400]
                    : Colors.neutral[100],
                  padding: 0,
                }}
              />
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        <Pressable
          onPress={closeSheet}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: Colors.neutral[600],
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <CText shade={300}>Cancel</CText>
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={!canSave}
          style={{
            flex: 1,
            backgroundColor: canSave ? Colors.accent[500] : Colors.neutral[700],
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            opacity: canSave ? 1 : 0.5,
          }}
        >
          <CText weight="bold" color="neutral" shade={canSave ? 900 : 500}>
            Save Splitters
          </CText>
        </Pressable>
      </View>
    </View>
  );
};

export default AddSplittersBottomSheetScreen;