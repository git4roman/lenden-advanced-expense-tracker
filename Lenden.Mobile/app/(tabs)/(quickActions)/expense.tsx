import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGetGroupsQuery } from "@/src/shared/store/apiSlices/group-slice.api";
import { sharedExpenseCategories } from "@/src/modules/groups/components/activity-item";
import { useCreateExpenseMutation } from "@/src/shared/store/apiSlices/expense-slice.api";

const Expense = () => {
  const [amount, setAmount] = useState("");
  const { data: groups, isLoading } = useGetGroupsQuery(undefined);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState(
    sharedExpenseCategories[0],
  );
  const [paidBy, setPaidBy] = useState<string[]>([]);
  const [splitBetween, setSplitBetween] = useState<string[]>([]);
  const [useEqualPayerSplit, setUseEqualPayerSplit] = useState(true);
  const [paidAmounts, setPaidAmounts] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState("");
  const [createExpense] = useCreateExpenseMutation();

  const roundTo2 = (value: number) => Math.round(value * 100) / 100;

  useEffect(() => {
    if (groups?.length) {
      setSelectedGroup(groups[0]);
      setPaidBy(groups[0].members[0]?.id ? [groups[0].members[0].id] : []);
      setSplitBetween(groups[0].members.map((m: any) => m.id));
      setPaidAmounts({});
      setUseEqualPayerSplit(true);
    }
  }, [groups]);

  const perPersonAmount = useMemo(() => {
    const total = Number(amount || "0");
    if (!splitBetween.length || Number.isNaN(total)) return "0.00";
    return (total / splitBetween.length).toFixed(2);
  }, [amount, splitBetween.length]);

  const perPayerAmount = useMemo(() => {
    const total = Number(amount || "0");
    if (!paidBy.length || Number.isNaN(total)) return 0;
    return roundTo2(total / paidBy.length);
  }, [amount, paidBy.length]);

  const toggleSplitMember = (memberId: string) => {
    setSplitBetween((prev) => {
      if (prev.includes(memberId)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== memberId);
      }
      return [...prev, memberId];
    });
  };

  const togglePayer = (memberId: string) => {
    setPaidBy((prev) => {
      if (prev.includes(memberId)) {
        if (prev.length === 1) return prev;
        return prev.filter((item) => item !== memberId);
      }
      return [...prev, memberId];
    });
    setPaidAmounts((prev) => {
      if (useEqualPayerSplit) return prev;
      if (prev[memberId] !== undefined) {
        const { [memberId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [memberId]: "0.00" };
    });
  };

  const totalPaid = useMemo(() => {
    if (!paidBy.length) return 0;
    if (useEqualPayerSplit) return perPayerAmount * paidBy.length;
    return paidBy.reduce((sum, id) => sum + Number(paidAmounts[id] || 0), 0);
  }, [paidBy, useEqualPayerSplit, perPayerAmount, paidAmounts]);

  const remainingPaid = useMemo(() => {
    const total = Number(amount || "0");
    if (Number.isNaN(total)) return 0;
    return total - totalPaid;
  }, [amount, totalPaid]);

  const users = useMemo(() => {
    if (!selectedGroup?.members) return [];
    return selectedGroup.members
      .filter(
        (member: any) =>
          paidBy.includes(member.id) || splitBetween.includes(member.id),
      )
      .map((member: any) => ({
        userId: member.id,
        paidAmount: paidBy.includes(member.id)
          ? useEqualPayerSplit
            ? roundTo2(Number(perPayerAmount) || 0)
            : roundTo2(Number(paidAmounts[member.id] || 0))
          : 0,
        splitAmount: splitBetween.includes(member.id)
          ? roundTo2(Number(perPersonAmount) || 0)
          : 0,
      }));
  }, [
    selectedGroup,
    paidBy,
    splitBetween,
    perPayerAmount,
    perPersonAmount,
    useEqualPayerSplit,
    paidAmounts,
  ]);

  const formData = {
    totalAmount: roundTo2(Number(amount || 0)),
    groupPublicId: selectedGroup?.id,
    category: selectedCategory.id,
    description: notes,
    imageUrl: "",
    users: users,
  };

  const chipStyle = (active: boolean) => ({
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: active ? Colors.accent[500] : Colors.neutral[700],
    backgroundColor: active ? Colors.accent[900] : Colors.neutral[900],
  });

  const resetForm = () => {
    setAmount("");
    setSelectedCategory(sharedExpenseCategories[0]);
    setNotes("");
    if (groups?.length) {
      setSelectedGroup(groups[0]);
      setPaidBy(groups[0].members[0]?.id ? [groups[0].members[0].id] : []);
      setSplitBetween(groups[0].members.map((m: any) => m.id));
      setPaidAmounts({});
      setUseEqualPayerSplit(true);
    } else {
      setSelectedGroup(null);
      setPaidBy([]);
      setSplitBetween([]);
      setPaidAmounts({});
      setUseEqualPayerSplit(true);
    }
  };

  const handleSubmit = async () => {
    try {
      console.log("Create Expense payload", formData);
      const response = await createExpense(formData).unwrap();
      console.log("The Response from create Expense is", response);
      resetForm();
      router.replace("/(tabs)/(groups)");
    } catch (e) {
      console.log("The error is :", e);
    }
  };

  const handleCancel = () => {
    resetForm();
    router.replace("/(tabs)/(groups)");
  };

  if (isLoading || !selectedGroup) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral[900] }} />
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 16,
        backgroundColor: Colors.neutral[900],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <CText weight="bold" size="xmd" color="neutral" shade={200}>
          Add Expense
        </CText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable
            onPress={handleCancel}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[800],
            }}
          >
            <CText size="sm" weight="semibold" color="neutral" shade={300}>
              Cancel
            </CText>
          </Pressable>
          <Pressable
            onPress={handleSubmit}
            style={{
              width: 38,
              height: 38,
              borderRadius: 999,
              backgroundColor: Colors.accent[500],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="checkmark" size={22} color={Colors.neutral[900]} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
      >
        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Amount
          </CText>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="0.00"
            keyboardType="decimal-pad"
            placeholderTextColor={Colors.neutral[600]}
            style={{
              backgroundColor: Colors.neutral[800],
              borderColor: Colors.neutral[700],
              borderWidth: 1,
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: Colors.neutral[100],
              fontSize: 28,
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Group Selection
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {groups.map((group: any) => (
              <Pressable
                key={group.id}
                style={chipStyle(selectedGroup === group)}
                onPress={() => {
                  setSelectedGroup(group);
                  setPaidBy(group.members[0]?.id ? [group.members[0].id] : []);
                  setSplitBetween(group.members.map((m: any) => m.id));
                  setPaidAmounts({});
                  setUseEqualPayerSplit(true);
                }}
              >
                <CText
                  size="sm"
                  color={selectedGroup === group ? "accent" : "neutral"}
                  shade={300}
                >
                  {group.name}
                </CText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Category
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {sharedExpenseCategories.map((category) => (
              <Pressable
                key={category.key}
                style={chipStyle(selectedCategory === category)}
                onPress={() => setSelectedCategory(category)}
              >
                <CText
                  size="sm"
                  color={selectedCategory === category ? "accent" : "neutral"}
                  shade={300}
                >
                  {category.label}
                </CText>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Paid By
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {selectedGroup.members.map((member: any) => (
              <Pressable
                key={member.id}
                style={chipStyle(paidBy.includes(member.id))}
                onPress={() => togglePayer(member.id)}
              >
                <CText
                  size="sm"
                  color={paidBy.includes(member.id) ? "accent" : "neutral"}
                  shade={300}
                >
                  {member.givenName}
                </CText>
              </Pressable>
            ))}
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Pressable
              onPress={() => {
                setUseEqualPayerSplit((prev) => {
                  const next = !prev;
                  if (prev && !next) {
                    setPaidAmounts((curr) => {
                      const nextAmounts = { ...curr };
                      paidBy.forEach((id) => {
                        if (nextAmounts[id] === undefined) {
                          nextAmounts[id] = perPayerAmount.toFixed(2);
                        }
                      });
                      return nextAmounts;
                    });
                  }
                  return next;
                });
              }}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 999,
                borderWidth: 1,
                borderColor: Colors.neutral[700],
                backgroundColor: Colors.neutral[800],
              }}
            >
              <CText size="xs" weight="semibold" color="neutral" shade={300}>
                {useEqualPayerSplit ? "Unequal payments" : "Equal split"}
              </CText>
            </Pressable>
            {useEqualPayerSplit ? (
              <CText size="xs" color="neutral" shade={500}>
                Split paid: NPR {perPayerAmount.toFixed(2)} each
              </CText>
            ) : (
              <CText size="xs" color="neutral" shade={500}>
                Total paid: NPR {totalPaid.toFixed(2)} · Remaining: NPR{" "}
                {remainingPaid.toFixed(2)}
              </CText>
            )}
          </View>

          {!useEqualPayerSplit && paidBy.length > 0 && (
            <View style={{ gap: 8 }}>
              {paidBy.map((payerId) => {
                const member = selectedGroup.members.find(
                  (m: any) => m.id === payerId,
                );
                if (!member) return null;
                return (
                  <View
                    key={payerId}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 12,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 12,
                      backgroundColor: Colors.neutral[800],
                      borderWidth: 1,
                      borderColor: Colors.neutral[700],
                    }}
                  >
                    <CText size="sm" color="neutral" shade={200}>
                      {member.givenName}
                    </CText>
                    <TextInput
                      value={paidAmounts[payerId] ?? ""}
                      onChangeText={(value) =>
                        setPaidAmounts((prev) => ({
                          ...prev,
                          [payerId]: value,
                        }))
                      }
                      placeholder="0.00"
                      keyboardType="decimal-pad"
                      placeholderTextColor={Colors.neutral[600]}
                      style={{
                        minWidth: 90,
                        textAlign: "right",
                        color: Colors.neutral[100],
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 10,
                        backgroundColor: Colors.neutral[900],
                        borderColor: Colors.neutral[700],
                        borderWidth: 1,
                      }}
                    />
                  </View>
                );
              })}
            </View>
          )}
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Split Between
          </CText>
          <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
            {selectedGroup.members.map((member: any) => {
              const isSelected = splitBetween.includes(member.id);
              return (
                <Pressable
                  key={member.id}
                  style={chipStyle(isSelected)}
                  onPress={() => toggleSplitMember(member.id)}
                >
                  <CText
                    size="sm"
                    color={isSelected ? "accent" : "neutral"}
                    shade={300}
                  >
                    {member.givenName}
                  </CText>
                </Pressable>
              );
            })}
          </View>
          <CText size="xs" color="neutral" shade={500}>
            Equal split: NPR {perPersonAmount} each
          </CText>
        </View>

        <View style={{ gap: 8 }}>
          <CText weight="semibold" size="sm" color="neutral" shade={300}>
            Notes
          </CText>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add note about this expense"
            placeholderTextColor={Colors.neutral[600]}
            multiline
            textAlignVertical="top"
            style={{
              backgroundColor: Colors.neutral[800],
              borderColor: Colors.neutral[700],
              borderWidth: 1,
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              minHeight: 96,
              color: Colors.neutral[100],
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Expense;
