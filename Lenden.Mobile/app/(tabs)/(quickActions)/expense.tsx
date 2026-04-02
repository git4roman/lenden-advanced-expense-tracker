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
  const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: active ? Colors.accent[500] : Colors.neutral[700],
    backgroundColor: active ? Colors.accent[900] : Colors.neutral[900],
  });

  const sectionStyle = {
    gap: 4,
    padding: 12,
    borderRadius: 14,
    backgroundColor: Colors.neutral[900],
  } as const;

  const inputStyle = {
    backgroundColor: Colors.neutral[800],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.neutral[100],
  } as const;

  const selectStyle = {
    minWidth: 0,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.neutral[800],
    flexDirection: "row",
    alignItems: "center",
  } as const;

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
      console.log("Create Expense: submit clicked");
      console.log("Create Expense payload", JSON.stringify(formData, null, 2));
      const response = await createExpense(formData).unwrap();
      console.log("Create Expense success response", response);
      resetForm();
      router.replace("/(tabs)/(groups)");
    } catch (e) {
      console.log("Create Expense error:", e);
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
        paddingHorizontal: 14,
        backgroundColor: Colors.neutral[900],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 6,
        }}
      >
        <CText weight="bold" size="md" color="neutral" shade={200}>
          Add Expense
        </CText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Pressable
            onPress={handleCancel}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
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
              width: 34,
              height: 34,
              borderRadius: 999,
              backgroundColor: Colors.accent[500],
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Ionicons name="checkmark" size={20} color={Colors.neutral[900]} />
          </Pressable>
        </View>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 2, paddingBottom: 24 }}
      >
        <View
          style={{
            paddingHorizontal: 4,
            borderRadius: 16,
            backgroundColor: Colors.neutral[850],
            borderWidth: 1,
            borderColor: Colors.neutral[800],
          }}
        >
          <View
            style={[
              sectionStyle,
              { position: "relative", overflow: "visible" },
            ]}
          >
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Group
            </CText>
            <Pressable
              onPress={() => setIsGroupMenuOpen((prev) => !prev)}
              style={[selectStyle, { justifyContent: "space-between" }]}
            >
              <CText
                size="md"
                color="neutral"
                shade={200}
                weight="semibold"
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {selectedGroup?.name ?? "Select group"}
              </CText>
              <Ionicons
                name={isGroupMenuOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={Colors.neutral[400]}
              />
            </Pressable>
            {isGroupMenuOpen && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[900],
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 82,
                  zIndex: 10,
                  elevation: 6,
                }}
              >
                {groups.map((group: any) => (
                  <Pressable
                    key={group.id}
                    onPress={() => {
                      setSelectedGroup(group);
                      setPaidBy(
                        group.members[0]?.id ? [group.members[0].id] : [],
                      );
                      setSplitBetween(group.members.map((m: any) => m.id));
                      setPaidAmounts({});
                      setUseEqualPayerSplit(true);
                      setIsGroupMenuOpen(false);
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderBottomWidth:
                        group.id === groups[groups.length - 1]?.id ? 0 : 1,
                      borderBottomColor: Colors.neutral[800],
                      backgroundColor:
                        selectedGroup?.id === group.id
                          ? Colors.neutral[800]
                          : Colors.neutral[900],
                    }}
                  >
                    <CText
                      size="sm"
                      color={
                        selectedGroup?.id === group.id ? "accent" : "neutral"
                      }
                      shade={300}
                      weight="semibold"
                    >
                      {group.name}
                    </CText>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={sectionStyle}>
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Paid By
            </CText>
            <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
              {selectedGroup.members.map((member: any) => (
                <Pressable
                  key={member.id}
                  style={chipStyle(paidBy.includes(member.id))}
                  onPress={() => togglePayer(member.id)}
                >
                  <CText
                    size="md"
                    color={paidBy.includes(member.id) ? "accent" : "neutral"}
                    shade={300}
                  >
                    {member.givenName}
                  </CText>
                </Pressable>
              ))}
            </View>
            <View
              style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
            >
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
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[800],
                }}
              >
                <CText size="sm" weight="semibold" color="neutral" shade={300}>
                  {useEqualPayerSplit ? "Unequal payments" : "Equal split"}
                </CText>
              </Pressable>
              {useEqualPayerSplit ? (
                <CText size="sm" color="neutral" shade={500}>
                  Split paid: NPR {perPayerAmount.toFixed(2)} each
                </CText>
              ) : (
                <CText size="sm" color="neutral" shade={500}>
                  Total paid: NPR {totalPaid.toFixed(2)} · Remaining: NPR{" "}
                  {remainingPaid.toFixed(2)}
                </CText>
              )}
            </View>

            {!useEqualPayerSplit && paidBy.length > 0 && (
              <View style={{ gap: 6 }}>
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
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderRadius: 12,
                        backgroundColor: Colors.neutral[850],
                      }}
                    >
                      <CText size="md" color="neutral" shade={200}>
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
                        style={[
                          inputStyle,
                          {
                            minWidth: 96,
                            textAlign: "right",
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            borderRadius: 10,
                          },
                        ]}
                      />
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          <View style={sectionStyle}>
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Split By
            </CText>
            <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
              {selectedGroup.members.map((member: any) => {
                const isSelected = splitBetween.includes(member.id);
                return (
                  <Pressable
                    key={member.id}
                    style={chipStyle(isSelected)}
                    onPress={() => toggleSplitMember(member.id)}
                  >
                    <CText
                      size="md"
                      color={isSelected ? "accent" : "neutral"}
                      shade={300}
                    >
                      {member.givenName}
                    </CText>
                  </Pressable>
                );
              })}
            </View>
            <CText size="sm" color="neutral" shade={500}>
              Equal split: NPR {perPersonAmount} each
            </CText>
          </View>

          <View style={sectionStyle}>
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Amount
            </CText>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={Colors.neutral[600]}
              style={[
                inputStyle,
                { fontSize: 24, paddingHorizontal: 12, paddingVertical: 8 },
              ]}
            />
          </View>

          <View
            style={[
              sectionStyle,
              { position: "relative", overflow: "visible" },
            ]}
          >
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Category
            </CText>
            <Pressable
              onPress={() => setIsCategoryMenuOpen((prev) => !prev)}
              style={[selectStyle, { justifyContent: "space-between" }]}
            >
              <CText
                size="md"
                color="neutral"
                shade={200}
                weight="semibold"
                numberOfLines={1}
                style={{ flex: 1 }}
              >
                {selectedCategory?.label ?? "Select category"}
              </CText>
              <Ionicons
                name={isCategoryMenuOpen ? "chevron-up" : "chevron-down"}
                size={18}
                color={Colors.neutral[400]}
              />
            </Pressable>
            {isCategoryMenuOpen && (
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[900],
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 82,
                  zIndex: 10,
                  elevation: 6,
                }}
              >
                {sharedExpenseCategories.map((category, index) => (
                  <Pressable
                    key={category.key}
                    onPress={() => {
                      setSelectedCategory(category);
                      setIsCategoryMenuOpen(false);
                    }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderBottomWidth:
                        index === sharedExpenseCategories.length - 1 ? 0 : 1,
                      borderBottomColor: Colors.neutral[800],
                      backgroundColor:
                        selectedCategory?.key === category.key
                          ? Colors.neutral[800]
                          : Colors.neutral[900],
                    }}
                  >
                    <CText
                      size="md"
                      color={
                        selectedCategory?.key === category.key
                          ? "accent"
                          : "neutral"
                      }
                      shade={300}
                      weight="semibold"
                    >
                      {category.label}
                    </CText>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <View style={sectionStyle}>
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Notes
            </CText>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add note"
              placeholderTextColor={Colors.neutral[600]}
              style={inputStyle}
            />
          </View>

          <View style={sectionStyle}>
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Add Image
            </CText>
            <Pressable
              style={[
                selectStyle,
                { justifyContent: "center", gap: 8, paddingVertical: 12 },
              ]}
            >
              <Ionicons
                name="image-outline"
                size={18}
                color={Colors.neutral[400]}
              />
              <CText size="md" color="neutral" shade={300} weight="semibold">
                Upload image
              </CText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Expense;
