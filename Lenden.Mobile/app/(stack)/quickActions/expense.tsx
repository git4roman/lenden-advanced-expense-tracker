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
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { Member } from "@/src/shared/store/slices/group-slice";

export type ExpenseUser = {
  userId: string;
  name: string;
  paidAmount: number;
  splitAmount: number;
};

const Expense = () => {
  const [amount, setAmount] = useState<string>("0.00");

  const { data: groups, isLoading } = useGetGroupsQuery(undefined);
  const [createExpense] = useCreateExpenseMutation();

  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [splitBetween, setSplitBetween] = useState<number>(0);
  console.log("SelectedGroup", selectedGroup);
  const [selectedCategory, setSelectedCategory] = useState(
    sharedExpenseCategories[0],
  );
  const [useEqualPayerSplit, setUseEqualPayerSplit] = useState(true);
  const [notes, setNotes] = useState("");

  const { openSheet } = useBottomSheet();

  const roundTo2 = (value: number) => Math.round(value * 100) / 100;

  useEffect(() => {
    if (groups?.length) {
      setSelectedGroup(groups[0]);
      setUseEqualPayerSplit(true);
    }
  }, [groups]);

  const perPersonSplitAmount = useMemo(() => {
    if (Number.isNaN(amount)) return 0;
    return Number(amount) / splitBetween;
  }, [amount]);

  const users: ExpenseUser[] = useMemo(() => {
    if (!selectedGroup?.members) return [];

    return selectedGroup.members.map((member: Member) => ({
      userId: member.id,
      name: member.givenName + member.familyName,
      paidAmount: 0.0,
      splitAmount: 0.0,
    }));
  }, [selectedGroup, splitBetween, perPersonSplitAmount, useEqualPayerSplit]);
  console.log("User", users);

  const formData = {
    totalAmount: Number(amount),
    groupPublicId: selectedGroup?.id,
    category: selectedCategory.id,
    description: notes,
    imageUrl: "",
    users: users.map(({ userId, paidAmount, splitAmount }) => ({
      userId,
      paidAmount,
      splitAmount,
    })),
  };

  const sectionStyle = {
    gap: 8,
    padding: 12,
    // borderRadius: 14,
    // backgroundColor: Colors.neutral[900],
  } as const;

  const inputStyle = {
    backgroundColor: Colors.neutral[800],
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: Colors.neutral[100],
  } as const;

  const resetForm = () => {
    setAmount("0.0");
    setSelectedCategory(sharedExpenseCategories[0]);
    setNotes("");

    setSelectedGroup(null);
    setSplitBetween(0);
    setUseEqualPayerSplit(true);
  };

  const handleSubmit = async () => {
    try {
      console.log("Create Expense: submit clicked");
      console.log("Create Expense payload", JSON.stringify(formData, null, 2));
      const response = await createExpense(formData).unwrap();
      console.log("Create Expense success response", response);
      resetForm();
      router.replace("/(tabs)/home");
    } catch (e) {
      console.log("Create Expense error:", e);
    }
  };

  const handleCancel = () => {
    resetForm();
    router.replace("/(tabs)/home");
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
        gap: 16,
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
        <CText weight="bold" size="lg" color="neutral" shade={200}>
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
            <CText size="md" weight="semibold" color="neutral" shade={300}>
              Cancel
            </CText>
          </Pressable>
          {/* <Pressable
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
          </Pressable> */}
        </View>
      </View>
      <View>
        <View
          style={{
            paddingHorizontal: 4,
            borderRadius: 16,
            // backgroundColor: Colors.neutral[800],
            borderWidth: 1,
            borderColor: Colors.neutral[800],
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 14,
            }}
          >
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Amount (NPR)
            </CText>
            <TextInput
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={Colors.neutral[600]}
              style={[
                {
                  fontSize: 32,
                  lineHeight: 32,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.primary[500],
                  // paddingVertical: 0,
                  // includeFontPadding: false,
                  textAlignVertical: "center",
                  color: Colors.neutral[500],
                },
              ]}
            />
          </View>
          <View style={sectionStyle}>
            {/* <CText weight="semibold" size="md" color="neutral" shade={300}>
    Group
  </CText> */}
            <Pressable
              onPress={() =>
                openSheet(
                  "selectGroup",
                  (group) => {
                    setSelectedGroup(group);

                    setSplitBetween(group.members.map((m: any) => m.id));
                    setUseEqualPayerSplit(true);
                  },
                  selectedGroup,
                  1,
                )
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Colors.accent[500],
                backgroundColor: Colors.accent[900],
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={Colors.accent[400]}
                />
                <CText size="md" weight="semibold" color="accent" shade={300}>
                  {selectedGroup?.name ?? "Select Group"}
                </CText>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <CText size="xs" color="neutral" shade={500}>
                  {selectedGroup?.members?.length ?? 0} members
                </CText>
                <Ionicons
                  name="chevron-down"
                  size={14}
                  color={Colors.neutral[500]}
                />
              </View>
            </Pressable>
          </View>

          <View
            style={[
              sectionStyle,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Paid By
            </CText>
            <Pressable
              onPress={() => {
                openSheet("addPayers", () => {}, { users, amount }, 1);
              }}
            >
              <CText weight="semibold" size="md" color="neutral" shade={300}>
                + Add Payers
              </CText>
            </Pressable>
            {/* <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
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
            </View> */}
            {/* <View
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
            </View> */}
          </View>

          <View
            style={[
              sectionStyle,
              { flexDirection: "row", justifyContent: "space-between" },
            ]}
          >
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Split By
            </CText>
            <Pressable
              onPress={() => {
                openSheet("addSplitters", () => {}, { users, amount }, 1);
              }}
            >
              <CText weight="semibold" size="md" color="neutral" shade={300}>
                + Add Splitters
              </CText>
            </Pressable>
            {/* <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
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
            </CText> */}
          </View>

          <View style={sectionStyle}>
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Category
            </CText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {sharedExpenseCategories.map((category) => {
                const isSelected = selectedCategory?.key === category.key;
                return (
                  <Pressable
                    key={category.key}
                    onPress={() => setSelectedCategory(category)}
                    style={{
                      width: "48%",
                      paddingHorizontal: 10,
                      paddingVertical: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: isSelected
                        ? Colors.accent[500]
                        : Colors.neutral[700],
                      backgroundColor: isSelected
                        ? Colors.accent[900]
                        : Colors.neutral[900],
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <Ionicons
                      name={isSelected ? "radio-button-on" : "radio-button-off"}
                      size={18}
                      color={
                        isSelected ? Colors.accent[400] : Colors.neutral[500]
                      }
                    />
                    <CText
                      size="md"
                      color={isSelected ? "accent" : "neutral"}
                      shade={200}
                      weight="semibold"
                      numberOfLines={1}
                      style={{ flex: 1 }}
                    >
                      {category.key}
                    </CText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={sectionStyle}>
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Remarks
            </CText>
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Add remark"
              placeholderTextColor={Colors.neutral[600]}
              style={inputStyle}
            />
            <Pressable
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  borderStyle: "dashed",
                  backgroundColor: Colors.neutral[900],
                },
              ]}
            >
              <View
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 14,
                  backgroundColor: Colors.neutral[800],
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="add" size={18} color={Colors.neutral[300]} />
              </View>
              <CText size="md" color="neutral" shade={300} weight="semibold">
                Add Receipt
              </CText>
            </Pressable>
          </View>
        </View>
      </View>
      <Pressable
        style={{
          backgroundColor: Colors.accent[500],
          padding: 10,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <CText weight="bold" size="md">
          Save
        </CText>
      </Pressable>
    </SafeAreaView>
  );
};

export default Expense;
