import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useGetGroupsQuery } from "@/src/shared/store/apiSlices/group-slice.api";
import { useCreateExpenseMutation } from "@/src/shared/store/apiSlices/expense-slice.api";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import {
  Group,
  GroupState,
  Member,
} from "@/src/shared/store/slices/group-slice";
import {
  ExpenseCategory,
  sharedExpenseCategories,
} from "@/src/shared/constants/expense-category.constant";

export type ExpenseUser = {
  userId: string;
  name: string;
  paidAmount: number;
  splitAmount: number;
};

export type ExpenseFormUserType = {
  userId: string;
  fullName: string;
  paidAmount: number;
  splitAmount: number;
};

export type ExpenseFormType = {
  totalAmount: number;
  groups: Group[];
  categories: ExpenseCategory[];
  description: string;
  imageUrl: string;
  users: ExpenseFormUserType[];
  participants: ExpenseFormUserType[] | [];
  selectedGroup: Group | null;
  selectedCategory: number;
};

const Expense = () => {
  const { data: groups, isLoading } = useGetGroupsQuery(undefined);
  const categories = useMemo(() => sharedExpenseCategories(Colors), []);

  const [expenseForm, setExpenseForm] = useState<ExpenseFormType>({
    totalAmount: 0,
    groups: [],
    categories,
    description: "",
    imageUrl: "",
    users: [],
    participants: [],
    selectedGroup: null,
    selectedCategory: 0,
  });

  const [formData, setFormData] = useState({
    totalAmount: 0,
    groupPublicId: undefined as string | undefined,
    category: categories[0]?.id,
    description: "",
    imageUrl: "",
    users: [] as { userId: string; paidAmount: number; splitAmount: number }[],
    participants: [] as any[],
  });

  useEffect(() => {
    if (!groups?.length) return;

    const users: ExpenseFormUserType[] =
      groups[0]?.members?.map((user: Member) => ({
        userId: user.id,
        fullName: user.givenName + " " + user.familyName,
        paidAmount: 0,
        splitAmount: 0,
      })) ?? [];

    setExpenseForm((prev) => ({
      ...prev,
      groups,
      users,
      selectedGroup: groups[0] ?? null,
    }));

    setFormData((prev) => ({
      ...prev,
      groupPublicId: groups[0]?.id,
      users: users.map(({ userId, paidAmount, splitAmount }) => ({
        userId,
        paidAmount,
        splitAmount,
      })),
    }));
  }, [groups]);

  const [createExpense, { isLoading: isCreatingExpense }] =
    useCreateExpenseMutation();

  const { openSheet } = useBottomSheet();

  const resetForm = () => {
    setExpenseForm({
      totalAmount: 0,
      groups: groups ?? [],
      categories,
      description: "",
      imageUrl: "",
      users: [],
      participants: [],
      selectedGroup: groups?.[0] ?? null,
      selectedCategory: 0,
    });
  };

  const handleSubmit = async () => {
    try {
      console.log("Create Expense payload", JSON.stringify(formData, null, 2));
      const response = await createExpense(formData).unwrap();
      console.log("Create Expense success response", response);
      router.replace("/(tabs)/home");
      resetForm();
    } catch (e) {
      console.log("Create Expense error:", e);
    }
  };

  const handleCancel = () => {
    resetForm();
    router.replace("/(tabs)/home");
  };

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
        </View>
      </View>

      <View>
        <View
          style={{
            paddingHorizontal: 4,
            borderRadius: 16,
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
              value={expenseForm.totalAmount.toFixed(2) ?? "0.00"}
              onChangeText={(text) =>
                setExpenseForm((prev) => ({
                  ...prev,
                  totalAmount: Number(text ?? 0),
                }))
              }
              placeholder="0.00"
              keyboardType="decimal-pad"
              placeholderTextColor={Colors.neutral[600]}
              style={[
                {
                  fontSize: 32,
                  lineHeight: 32,
                  borderBottomWidth: 1,
                  borderBottomColor: Colors.primary[500],

                  textAlignVertical: "center",
                  color: Colors.neutral[500],
                },
              ]}
            />
          </View>

          <View style={{ gap: 8, padding: 12 }}>
            <Pressable
              onPress={() =>
                openSheet(
                  "selectGroup",
                  (group: Group) => {
                    setExpenseForm((prev) => ({
                      ...prev,
                      selectedGroup: group,
                    }));
                  },
                  expenseForm.groups,
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
                  {groups?.[0]?.name ?? "Add Participants"}
                </CText>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <CText size="xs" color="neutral" shade={500}>
                  {groups?.[0]?.members?.length ?? 0} members
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
              {
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
                padding: 12,
              },
            ]}
          >
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Participants
            </CText>
            <Pressable
              onPress={() => {
                openSheet(
                  "selectParticipants",
                  (participants: { userId: string; fullName: string }[]) => {
                    setExpenseForm((prev) => ({
                      ...prev,
                      participants: participants.map((p) => ({
                        userId: p.userId,
                        fullName: p.fullName,
                        paidAmount: 0,
                        splitAmount: 0,
                      })),
                    }));
                  },
                  expenseForm.selectedGroup?.members.map((item: Member) => ({
                    userId: item.id,
                    fullName: item.givenName + item.familyName,
                  })),
                  0,
                );
              }}
            >
              <CText weight="semibold" size="md" color="neutral" shade={300}>
                + Add Participants
              </CText>
            </Pressable>
          </View>

          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
                padding: 12,
              },
            ]}
          >
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Paid By
            </CText>
            <Pressable
              onPress={() => {
                openSheet(
                  "addPayers",
                  () => {},
                  {
                    users: expenseForm.users,
                    totalAmount: expenseForm.totalAmount,
                  },
                  1,
                );
              }}
            >
              <CText weight="semibold" size="md" color="neutral" shade={300}>
                + Add Payers
              </CText>
            </Pressable>
          </View>

          <View
            style={[
              {
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
                padding: 12,
              },
            ]}
          >
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Split By
            </CText>
            <Pressable
              onPress={() => {
                openSheet(
                  "addSplitters",
                  () => {},
                  {
                    users: expenseForm.users,
                    totalAmount: expenseForm.totalAmount,
                  },
                  1,
                );
              }}
            >
              <CText weight="semibold" size="md" color="neutral" shade={300}>
                + Add Splitters
              </CText>
            </Pressable>
          </View>

          <View style={{ gap: 8, padding: 12 }}>
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Category
            </CText>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
              {expenseForm.categories.map((category: ExpenseCategory) => {
                const isSelected = expenseForm.selectedCategory === category.id;
                return (
                  <Pressable
                    key={category.key}
                    onPress={() =>
                      setExpenseForm((prev) => ({
                        ...prev,
                        category: category.id,
                      }))
                    }
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

          <View style={{ gap: 8, padding: 12 }}>
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Remarks
            </CText>
            <TextInput
              value={expenseForm.description}
              onChangeText={(text) =>
                setExpenseForm((prev) => ({
                  ...prev,
                  description: text,
                }))
              }
              placeholder="Add remark"
              placeholderTextColor={Colors.neutral[600]}
              style={{
                backgroundColor: Colors.neutral[800],
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: Colors.neutral[100],
              }}
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
        onPress={handleSubmit}
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
