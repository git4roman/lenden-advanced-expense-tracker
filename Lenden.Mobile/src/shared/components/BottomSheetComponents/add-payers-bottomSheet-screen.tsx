import { View, Pressable, ScrollView, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { useTheme } from "../../providers/ThemeProviders";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/shared/ui/theme/colors"; // or use your theme hook

export type ExpensePayer = {
  userId: string;
  fullName: string;
  paidAmount: number;
};

const AddPayersBottomSheetScreen = () => {
  const { currentValue, selectValue, closeSheet } = useBottomSheet();
  const { Colors } = useTheme(); // or directly import if preferred

  const [useEqualPay, setUseEqualPay] = useState(true);
  const [expenseParticipants, setExpenseParticipants] = useState<
    ExpensePayer[]
  >(currentValue?.participants ?? []);

  const totalAmount = currentValue?.totalAmount || 0;

  const assignedTotal = expenseParticipants.reduce(
    (sum, payer) => sum + (payer.paidAmount || 0),
    0,
  );
  const remaining = totalAmount - assignedTotal;

  // Initialize equal split
  useEffect(() => {
    if (!currentValue?.participants?.length) return;

    const share = totalAmount / currentValue.participants.length;
    setExpenseParticipants(
      currentValue.participants.map((p: ExpensePayer) => ({
        ...p,
        paidAmount: useEqualPay ? share : p.paidAmount || 0,
      })),
    );
  }, [currentValue?.participants, totalAmount, useEqualPay]);

  const handleSave = () => {
    selectValue({ ...currentValue, participants: expenseParticipants });
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

        {!useEqualPay && (
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <CText size="ssm" color="neutral" shade={400}>
              Remaining
            </CText>
            <CText
              size="md"
              weight="semibold"
              color={
                remaining < 0 ? "danger" : remaining > 0 ? "warning" : "accent"
              }
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
        <Pressable
          onPress={() => setUseEqualPay(true)}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: useEqualPay ? Colors.accent[900] : "transparent",
            alignItems: "center",
          }}
        >
          <CText
            size="md"
            weight={useEqualPay ? "semibold" : "medium"}
            color={useEqualPay ? "accent" : "neutral"}
            shade={useEqualPay ? 100 : 200}
          >
            Equal Split
          </CText>
        </Pressable>

        <Pressable
          onPress={() => setUseEqualPay(false)}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 10,
            backgroundColor: !useEqualPay ? Colors.accent[900] : "transparent",
            alignItems: "center",
          }}
        >
          <CText
            size="md"
            weight={!useEqualPay ? "semibold" : "medium"}
            color={!useEqualPay ? "accent" : "neutral"}
            shade={!useEqualPay ? 100 : 200}
          >
            Unequal
          </CText>
        </Pressable>
      </View>

      {/* Payers List */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12 }}>
          {expenseParticipants.map((payer) => {
            const isEdited = !useEqualPay;

            return (
              <View
                key={payer.userId}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isEdited
                    ? Colors.accent[700]
                    : Colors.neutral[700],
                  backgroundColor: isEdited
                    ? Colors.neutral[800]
                    : Colors.neutral[900],
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
                  onChangeText={(text) => {
                    const amount = parseFloat(text) || 0;
                    setExpenseParticipants((prev) =>
                      prev.map((p) =>
                        p.userId === payer.userId
                          ? { ...p, paidAmount: amount }
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
              </View>
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
          style={{
            flex: 1,
            backgroundColor: Colors.accent[500],
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
          }}
        >
          <CText weight="bold" color="neutral" shade={900}>
            Save Payers
          </CText>
        </Pressable>
      </View>
    </View>
  );
};

export default AddPayersBottomSheetScreen;
