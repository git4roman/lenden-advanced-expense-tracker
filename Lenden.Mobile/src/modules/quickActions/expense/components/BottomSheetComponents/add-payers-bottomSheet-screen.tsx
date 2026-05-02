import { View, Pressable, ScrollView, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { useTheme } from "../../../../../shared/providers/ThemeProviders";
import { Ionicons } from "@expo/vector-icons";

export type ExpensePayer = {
  userId: string;
  fullName: string;
  paidAmount: number;
};

const AddPayersBottomSheetScreen = () => {
  const { currentValue, selectValue, closeSheet } = useBottomSheet();
  const { Colors } = useTheme();

  const totalAmount = currentValue?.totalAmount || 0;

  const [payers, setPayers] = useState<ExpensePayer[]>(
    currentValue?.participants,
  );
  console.log("Particiap", payers);
  const [useEqualPay, setUseEqualPay] = useState<boolean>(
    currentValue?.isEqualPay ?? true,
  );

  const recomputeEqual = (list: ExpensePayer[]): ExpensePayer[] => {
    const selected = list.filter((p) => p.paidAmount > 0);

    const share = selected.length ? totalAmount / selected.length : 0;

    return list.map((p) => ({
      ...p,
      paidAmount: p.paidAmount > 0 ? parseFloat(share.toFixed(2)) : 0,
    }));
  };

  // Equal pay — toggle selection + recompute shares
  const handleToggleParticipant = (userId: string) => {
    setPayers((prev) => {
      const updated = prev.map((p) =>
        p.userId === userId
          ? {
              ...p,
              paidAmount: p.paidAmount > 0 ? 0 : 1,
            }
          : p,
      );

      return recomputeEqual(updated);
    });
  };

  // Unequal pay — just update the amount, all members always included
  const handleAmountChange = (userId: string, text: string) => {
    const amount = parseFloat(text) || 0;
    setPayers((prev) =>
      prev.map((p) => (p.userId === userId ? { ...p, paidAmount: amount } : p)),
    );
  };

  const handleToggleMode = () => {
    setUseEqualPay((prev) => {
      const next = !prev;
      setPayers((prevPayers) => {
        if (next) {
          // Switching to equal — reset selection and recompute
          const allSelected = prevPayers.map((p) => ({
            ...p,
            isSelected: true,
          }));
          return recomputeEqual(allSelected);
        } else {
          // Switching to unequal — clear amounts, mark all selected
          return prevPayers.map((p) => ({
            ...p,
            isSelected: true,
            paidAmount: 0,
          }));
        }
      });
      return next;
    });
  };

  const selectedPayers = payers.filter((p) => p.paidAmount > 0);
  const assignedTotal = payers.reduce((sum, p) => sum + p.paidAmount, 0);
  const remaining = totalAmount - assignedTotal;

  const canSave = useEqualPay
    ? selectedPayers.length > 0
    : remaining === 0 && payers.length > 0;

  const handleSave = () => {
    const payerUser = useEqualPay
      ? selectedPayers.map(({ userId, paidAmount }) => ({ userId, paidAmount }))
      : payers.map(({ userId, paidAmount }) => ({ userId, paidAmount }));
    console.log("Payer User", payerUser);

    const payload = {
      isEqualPay: useEqualPay,
      updatedUsers: payerUser,
    };
    console.log("Payload", payload);
    selectValue(payload);
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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <CText color="neutral" shade={300} size="lg" weight="bold">
          Add Payers
        </CText>

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
            onPress={handleToggleMode}
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
              {isEqual ? "Equal Pay" : "Unequal Pay"}
            </CText>
          </Pressable>
        ))}
      </View>

      {/* Payers List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12 }}>
          {payers.map((payer) => {
            const isSelected = payer.paidAmount > 0;
            return (
              <Pressable
                key={payer.userId}
                // Only toggleable in equal pay mode
                onPress={
                  useEqualPay
                    ? () => handleToggleParticipant(payer.userId)
                    : undefined
                }
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: useEqualPay
                    ? isSelected
                      ? Colors.accent[500]
                      : Colors.neutral[700]
                    : Colors.neutral[700],
                  backgroundColor: useEqualPay
                    ? isSelected
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

                  <CText
                    size="md"
                    weight="semibold"
                    color="neutral"
                    shade={100}
                  >
                    {payer.fullName}
                  </CText>
                </View>

                <TextInput
                  editable={!useEqualPay}
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                  placeholderTextColor={Colors.neutral[500]}
                  value={payer.paidAmount ? payer.paidAmount.toString() : ""}
                  onChangeText={(text) =>
                    handleAmountChange(payer.userId, text)
                  }
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
            );
          })}
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
            Save Payers
          </CText>
        </Pressable>
      </View>
    </View>
  );
};

export default AddPayersBottomSheetScreen;
