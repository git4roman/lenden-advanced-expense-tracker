import { View, Pressable, ScrollView, TextInput } from "react-native";
import React, { useState } from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { useTheme } from "../../providers/ThemeProviders";
import { Ionicons } from "@expo/vector-icons";

export type ExpenseSplitter = {
  userId: string;
  fullName: string;
  splitAmount: number;
};

const AddSplittersBottomSheetScreen = () => {
  const { currentValue, selectValue, closeSheet } = useBottomSheet();
  const { Colors } = useTheme();

  const totalAmount = currentValue?.totalAmount || 0;

  const [splitters, setSplitters] = useState<ExpenseSplitter[]>(
    currentValue?.participants || [],
  );

  const [useEqualSplit, setUseEqualSplit] = useState<boolean>(
    currentValue?.isEqualSplit ?? true,
  );

  const recomputeEqual = (list: ExpenseSplitter[]) => {
    const selected = list.filter((p) => p.splitAmount > 0);
    const share = selected.length ? totalAmount / selected.length : 0;

    return list.map((p) => ({
      ...p,
      splitAmount: p.splitAmount > 0 ? parseFloat(share.toFixed(2)) : 0,
    }));
  };

  // TOGGLE PARTICIPANT (same as payer logic)
  const handleToggleParticipant = (userId: string) => {
    setSplitters((prev) => {
      const updated = prev.map((p) =>
        p.userId === userId
          ? {
              ...p,
              splitAmount: p.splitAmount > 0 ? 0 : 1,
            }
          : p,
      );

      return useEqualSplit ? recomputeEqual(updated) : updated;
    });
  };

  // UNEQUAL MODE INPUT
  const handleAmountChange = (userId: string, text: string) => {
    const amount = parseFloat(text) || 0;

    setSplitters((prev) =>
      prev.map((p) =>
        p.userId === userId ? { ...p, splitAmount: amount } : p,
      ),
    );
  };

  // MODE SWITCH (same pattern as payer reference)
  const handleToggleMode = () => {
    setUseEqualSplit((prev) => {
      const next = !prev;

      setSplitters((prevList) => {
        if (next) {
          const allSelected = prevList.map((p) => ({
            ...p,
            splitAmount: p.splitAmount > 0 ? p.splitAmount : 1,
          }));

          return recomputeEqual(allSelected);
        }

        return prevList.map((p) => ({
          ...p,
          splitAmount: 0,
        }));
      });

      return next;
    });
  };

  const selected = splitters.filter((p) => p.splitAmount > 0);

  const assignedTotal = splitters.reduce(
    (sum, p) => sum + p.splitAmount,
    0,
  );

  const remaining = totalAmount - assignedTotal;

  const canSave = useEqualSplit
    ? selected.length > 0
    : remaining === 0 && splitters.length > 0;

  const handleSave = () => {
    const payload = splitters.map(({ userId, splitAmount }) => ({
      userId,
      splitAmount,
    }));

    selectValue({
      isEqualSplit: useEqualSplit,
      updatedUsers: payload,
    });

    closeSheet();
  };

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
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <CText color="neutral" shade={300} size="lg" weight="bold">
          Add Splitters
        </CText>

        <View style={{ flexDirection: "row", gap: 6 }}>
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
      </View>

      {/* Toggle */}
      <View
        style={{
          flexDirection: "row",
          gap: 6,
          backgroundColor: Colors.neutral[800],
          borderRadius: 12,
          padding: 4,
        }}
      >
        {[true, false].map((mode) => (
          <Pressable
            key={String(mode)}
            onPress={handleToggleMode}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 10,
              backgroundColor:
                useEqualSplit === mode
                  ? Colors.accent[900]
                  : "transparent",
              alignItems: "center",
            }}
          >
            <CText
              size="md"
              weight={useEqualSplit === mode ? "semibold" : "medium"}
              color={useEqualSplit === mode ? "accent" : "neutral"}
              shade={useEqualSplit === mode ? 100 : 200}
            >
              {mode ? "Equal Split" : "Unequal Split"}
            </CText>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12 }}>
          {splitters.map((p) => {
            const isSelected = p.splitAmount > 0;

            return (
              <Pressable
                key={p.userId}
                onPress={
                  useEqualSplit
                    ? () => handleToggleParticipant(p.userId)
                    : undefined
                }
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  padding: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: useEqualSplit
                    ? isSelected
                      ? Colors.accent[500]
                      : Colors.neutral[700]
                    : Colors.neutral[700],
                  backgroundColor: useEqualSplit
                    ? isSelected
                      ? Colors.accent[900]
                      : Colors.neutral[800]
                    : Colors.neutral[800],
                }}
              >
                <View style={{ flexDirection: "row", gap: 12, flex: 1 }}>
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
                    <Ionicons name="person" size={20} color={Colors.neutral[400]} />
                  </View>

                  <CText size="md" weight="semibold" color="neutral" shade={100}>
                    {p.fullName}
                  </CText>
                </View>

                <TextInput
                  editable={!useEqualSplit}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={Colors.neutral[500]}
                  value={p.splitAmount ? String(p.splitAmount) : ""}
                  onChangeText={(text) =>
                    handleAmountChange(p.userId, text)
                  }
                  style={{
                    minWidth: 80,
                    textAlign: "right",
                    fontSize: 18,
                    fontWeight: "600",
                    color: useEqualSplit
                      ? Colors.neutral[400]
                      : Colors.neutral[100],
                    padding: 0,
                  }}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer */}
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
            backgroundColor: canSave
              ? Colors.accent[500]
              : Colors.neutral[700],
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