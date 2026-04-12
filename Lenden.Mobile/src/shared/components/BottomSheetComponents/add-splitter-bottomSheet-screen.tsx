import { View, Pressable, ScrollView, TextInput } from "react-native";
import React, { useMemo, useState } from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { useTheme } from "../../providers/ThemeProviders";
import { ExpenseUser } from "@/app/(stack)/quickActions/expense";
import Checkbox from "expo-checkbox";
import { fonts } from "../../ui/theme/typography";

const AddSplittersBottomSheetScreen = () => {
  const { currentValue, selectValue, closeSheet } = useBottomSheet();
  const { Colors } = useTheme();

  const users: ExpenseUser[] = currentValue?.users ?? [];
  const totalAmount = Number(currentValue?.amount) || 0;

  const [useEqualSplit, setUseEqualSplit] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>(
    {},
  );

  const equalShare = useMemo(() => {
    const count = selectedIds.size;
    if (count === 0) return "0.00";
    return (totalAmount / count).toFixed(2);
  }, [totalAmount, selectedIds.size]);

  const toggleUser = (userId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) {
        next.delete(userId);
        setCustomAmounts((prev) => ({ ...prev, [userId]: "0" }));
      } else {
        next.add(userId);
      }
      return next;
    });
  };

  const handleSave = () => {
    const updatedUsers = users.map((u: ExpenseUser) => ({
      ...u,
      splitAmount: selectedIds.has(u.userId)
        ? useEqualSplit
          ? parseFloat(equalShare)
          : parseFloat(customAmounts[u.userId] || "0")
        : 0,
    }));
    selectValue({ ...currentValue, users: updatedUsers });
    closeSheet();
  };

  const assignedTotal = Object.entries(customAmounts)
    .filter(([id]) => selectedIds.has(id))
    .reduce((sum, [, val]) => sum + (parseFloat(val) || 0), 0);

  const remaining = totalAmount - assignedTotal;

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
        <CText color="neutral" shade={300} size="lg" weight="bold">
          Add splitters
        </CText>
        <Pressable
          onPress={() => setUseEqualSplit((v) => !v)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: Colors.neutral[800],
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
          }}
        >
          <Checkbox
            value={useEqualSplit}
            onValueChange={() => setUseEqualSplit((v) => !v)}
          />
          <CText size="sm" color="neutral" shade={300}>
            Split equally
          </CText>
        </Pressable>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 14 }}>
          {users.map((item: ExpenseUser) => {
            const isSelected = selectedIds.has(item.userId);
            return (
              <View
                key={item.userId}
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Checkbox
                  value={isSelected}
                  onValueChange={() => toggleUser(item.userId)}
                />
                <CText
                  size="xmd"
                  color="neutral"
                  shade={isSelected ? 50 : 500}
                  style={{ flex: 1 }}
                >
                  {item.name}
                </CText>
                <TextInput
                  editable={!useEqualSplit && isSelected}
                  keyboardType="decimal-pad"
                  placeholder="—"
                  placeholderTextColor={Colors.neutral[500]}
                  value={
                    useEqualSplit
                      ? isSelected
                        ? equalShare
                        : ""
                      : (customAmounts[item.userId] ?? "")
                  }
                  onChangeText={(text) =>
                    setCustomAmounts((prev) => ({
                      ...prev,
                      [item.userId]: text,
                    }))
                  }
                  style={{
                    minWidth: 72,
                    textAlign: "right",
                    fontSize: 18,
                    fontFamily: fonts.medium,
                    fontWeight: "600",
                    color: isSelected
                      ? Colors.neutral[50]
                      : Colors.neutral[500],
                    padding: 0,
                    margin: 0,
                  }}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>

      {!useEqualSplit && (
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <CText size="xmd" color="neutral" shade={400}>
            Remaining
          </CText>
          <CText size="xmd" color="neutral" shade={remaining < 0 ? 400 : 300}>
            ${remaining.toFixed(2)}
          </CText>
        </View>
      )}

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
          style={{
            flex: 1,
            backgroundColor: Colors.accent[500],
            padding: 10,
            borderRadius: 10,
            alignItems: "center",
          }}
        >
          <CText weight="bold">Save</CText>
        </Pressable>
      </View>
    </View>
  );
};

export default AddSplittersBottomSheetScreen;
