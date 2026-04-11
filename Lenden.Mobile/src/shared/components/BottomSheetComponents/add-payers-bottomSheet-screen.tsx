import { View, Pressable, ScrollView, TextInput } from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";

type Member = {
  id: string;
  givenName: string;
  familyName: string;
  email?: string;
};

type PaymentMode = "equal" | "unequal";

const formatAmount = (value: number) => {
  if (!Number.isFinite(value)) return "0";
  const fixed = value.toFixed(2);
  return fixed.replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
};

const parseAmount = (value: string) => {
  const normalized = value.replace(/[^\d.]/g, "");
  const numberValue = Number.parseFloat(normalized);
  return Number.isFinite(numberValue) ? numberValue : 0;
};

const AddPayersBottomSheetScreen = () => {
  const { currentValue, selectValue, closeSheet } = useBottomSheet();
  const members: Member[] = currentValue?.members ?? [];

  const [mode, setMode] = useState<PaymentMode>("equal");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState("0");
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const lastModeRef = useRef<PaymentMode>("equal");

  useEffect(() => {
    const initialMembers = currentValue?.members ?? [];
    const initialSelected: string[] =
      currentValue?.selectedPayers?.map((payer: any) => payer.id) ??
      initialMembers.map((member: Member) => member.id);

    setSelectedIds(initialSelected);
    setTotalAmount(
      currentValue?.totalAmount != null
        ? String(currentValue.totalAmount)
        : "0",
    );
    setMode(currentValue?.paymentMode ?? "equal");
    setAmounts(currentValue?.payerAmounts ?? {});
  }, [currentValue]);

  const totalAmountValue = useMemo(
    () => parseAmount(totalAmount),
    [totalAmount],
  );

  const buildEqualAmounts = (ids: string[], total: number) => {
    if (ids.length === 0) return {};
    const perPerson = total / ids.length;
    const formatted = formatAmount(perPerson);
    return ids.reduce<Record<string, string>>((acc, id) => {
      acc[id] = formatted;
      return acc;
    }, {});
  };

  useEffect(() => {
    if (mode !== "equal") return;
    setAmounts(buildEqualAmounts(selectedIds, totalAmountValue));
  }, [mode, selectedIds, totalAmountValue]);

  useEffect(() => {
    if (mode !== "unequal") return;

    setAmounts((prev) => {
      if (selectedIds.length === 0) return {};
      const perPerson = formatAmount(totalAmountValue / selectedIds.length);
      return selectedIds.reduce<Record<string, string>>((acc, id) => {
        acc[id] = prev[id] ?? perPerson;
        return acc;
      }, {});
    });
  }, [mode, selectedIds, totalAmountValue]);

  useEffect(() => {
    if (mode === "unequal" && lastModeRef.current === "equal") {
      setAmounts(buildEqualAmounts(selectedIds, totalAmountValue));
    }
    lastModeRef.current = mode;
  }, [mode, selectedIds, totalAmountValue]);

  const toggleMember = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((memberId) => memberId !== id);
      }
      return [...prev, id];
    });
  };

  const handleAmountChange = (id: string, value: string) => {
    if (mode === "equal") return;
    setAmounts((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    const payload = {
      paymentMode: mode,
      totalAmount: totalAmountValue,
      payers: selectedIds.map((id) => ({
        id,
        amount: parseAmount(amounts[id] ?? "0"),
      })),
    };
    selectValue(payload);
  };

  const hasMembers = members.length > 0;
  const canSave = selectedIds.length > 0;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={{ gap: 16 }}>
        {!hasMembers && (
          <View
            style={{
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[900],
              borderRadius: 12,
              padding: 12,
            }}
          >
            <CText size="xs" color="neutral" shade={400}>
              No members available to add as payers.
            </CText>
          </View>
        )}

        {members.map((member) => {
          const isSelected = selectedIds.includes(member.id);
          const amountValue = amounts[member.id] ?? "0";

          return (
            <Pressable
              key={member.id}
              onPress={() => toggleMember(member.id)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: Colors.neutral[800],
                opacity: isSelected ? 1 : 0.5,
              }}
            >
              <CText size="sm" color="neutral" shade={200}>
                {member.givenName} {member.familyName}
              </CText>

              <TextInput
                value={amountValue}
                onChangeText={(value) => handleAmountChange(member.id, value)}
                editable={isSelected && mode === "unequal"}
                keyboardType="decimal-pad"
                placeholder="0"
                placeholderTextColor={Colors.neutral[600]}
                style={{
                  minWidth: 90,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.neutral[500],
                  paddingVertical: 2,
                  color: Colors.neutral[100],
                  textAlign: "right",
                }}
              />
            </Pressable>
          );
        })}

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
            onPress={handleSave}
            disabled={!canSave}
            style={{
              flex: 1,
              backgroundColor: canSave
                ? Colors.accent[500]
                : Colors.neutral[700],
              padding: 10,
              borderRadius: 10,
              alignItems: "center",
              opacity: canSave ? 1 : 0.6,
            }}
          >
            <CText weight="bold">Save</CText>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
};

export default AddPayersBottomSheetScreen;
