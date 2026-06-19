import { GroupMembersSummary } from "@/src/modules/groups/types/group-slice.type";
import { GroupWithExpenses } from "@/src/shared";
import {
  ExpenseCategories,
  ExpenseCategory,
} from "@/src/shared/constants/expense-category.constant";
import { useBottomSheet } from "@/src/shared/hooks/use-base-bottomSheet";
import { useCreateExpenseMutation } from "@/src/shared/store/apiSlices/expense-slice.api";
import { useGetGroupsQuery } from "@/src/shared/store/apiSlices/group-slice.api";
import { RootState } from "@/src/shared/store/store";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export type ExpenseUser = {
  userId: string;
  name: string;
  paidAmount: number;
  splitAmount: number;
};

export type ExpenseMetaData = {
  isEqualPay: boolean;
  isEqualSplit: boolean;
};

export interface ExpenseFormUserType {
  userId: string;
  fullName: string;
  paidAmount: number;
  splitAmount: number;
}

export interface ExpenseFormParticipantType extends ExpenseFormUserType {}

export type ExpenseFormType = {
  totalAmount: number;
  groups: GroupWithExpenses[];
  categories: ExpenseCategory[];
  description: string;
  imageUrl: string;
  users: ExpenseFormUserType[];
  participants: ExpenseFormParticipantType[] | [];
  selectedGroup: GroupWithExpenses | null;
  selectedCategory: number;
  expenseMetaData: ExpenseMetaData;
};

export type UserUpdate = {
  userId: string;
  paidAmount?: number;
  splitAmount?: number;
};

const Expense = () => {
  const { data, isLoading } = useGetGroupsQuery(undefined);

  const groups: GroupWithExpenses[] = useSelector(
    (state: RootState) => state.groups,
  );

  const [expenseForm, setExpenseForm] = useState<ExpenseFormType>({
    totalAmount: 0,
    groups: [],
    categories: ExpenseCategories,
    description: "",
    imageUrl: "",
    users: [],
    participants: [],
    selectedGroup: null,
    selectedCategory: 1,
    expenseMetaData: {
      isEqualPay: true,
      isEqualSplit: true,
    },
  });

  useEffect(() => {
    if (!groups?.length) return;

    const users: ExpenseFormUserType[] =
      groups[0]?.members?.map((user: GroupMembersSummary) => ({
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
  }, [groups]);

  useEffect(() => {
    console.log("Participants", JSON.stringify(expenseForm, null, 2));
  }, [expenseForm.participants]);

  const [createExpense, { isLoading: isCreatingExpense }] =
    useCreateExpenseMutation();

  const { openSheet } = useBottomSheet();
  const amountRef = useRef(
    expenseForm.totalAmount === 0 ? "" : expenseForm.totalAmount.toString(),
  );
  const resetForm = () => {
    setExpenseForm({
      totalAmount: 0,
      groups: groups ?? [],
      categories: ExpenseCategories,
      description: "",
      imageUrl: "",
      users: [],
      participants: [],
      selectedGroup: groups?.[0] ?? null,
      selectedCategory: 1,
      expenseMetaData: {
        isEqualPay: true,
        isEqualSplit: true,
      },
    });
  };

  const handleSubmit = async () => {
    try {
      const formData = {
        totalAmount: expenseForm.totalAmount,
        groupPublicId: expenseForm.selectedGroup?.id,
        category: expenseForm.selectedCategory,
        description: expenseForm.description,
        imageUrl: expenseForm.imageUrl,
        users: expenseForm.participants.map(({ fullName, ...p }) => p),
      };

      const response = await createExpense(formData).unwrap();

      Toast.show({
        type: "success",
        text1: "Expense created",
      });

      router.replace("/(tabs)/home");
      requestAnimationFrame(() => {
        setTimeout(resetForm, 0);
      });
    } catch (e: any) {
      console.log("Create Expense error:", e);

      Toast.show({
        type: "error",
        text1: "Create failed",
        text2: e?.data?.title || "Something went wrong",
      });
    }
  };

  const handleCancel = () => {
    resetForm();
    router.replace("/(tabs)/home");
  };

  const handlePayerParticipants = ({
    isEqualPay,
    updatedUsers,
  }: {
    isEqualPay: boolean;
    updatedUsers: UserUpdate[];
  }) => {
    setExpenseForm((prev) => ({
      ...prev,
      expenseMetaData: { ...prev.expenseMetaData, isEqualPay: isEqualPay },
    }));

    handleParticipantsUpdate(updatedUsers);
  };

  const handleSplitterParticipants = ({
    isEqualSplit,
    updatedUsers,
  }: {
    isEqualSplit: boolean;
    updatedUsers: UserUpdate[];
  }) => {
    setExpenseForm((prev) => ({
      ...prev,
      expenseMetaData: { ...prev.expenseMetaData, isEqualSplit: isEqualSplit },
    }));
    handleParticipantsUpdate(updatedUsers);
  };

  const handleParticipantsUpdate = (updatedUsers: UserUpdate[]) => {
    const updatedUsersMapped = new Map(updatedUsers.map((u) => [u.userId, u]));

    setExpenseForm((prev) => ({
      ...prev,
      participants: prev.participants.map((p) =>
        updatedUsersMapped.has(p.userId)
          ? { ...p, ...updatedUsersMapped.get(p.userId) }
          : p,
      ),
    }));
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors.neutral[900],
      }}
    >
      {isCreatingExpense && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.6)",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
        >
          <ActivityIndicator size="large" color={Colors.accent[500]} />
          <CText
            size="md"
            color="neutral"
            shade={200}
            style={{ marginTop: 10 }}
          >
            Creating expense...
          </CText>
        </View>
      )}

      <View style={{ position: "relative", gap: 8 }}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: -1,
            backgroundColor: Colors.neutral[850],
            height: 100,
            // width: "100%",
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingHorizontal: 14,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          <Pressable
            onPress={handleCancel}
            style={{ flexDirection: "row", gap: 12 }}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.neutral[100]} />
            <CText weight="medium" size="md" color="neutral" shade={100}>
              Record Expense
            </CText>
          </Pressable>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Pressable
              onPress={handleCancel}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: Colors.neutral[700],
                backgroundColor: Colors.neutral[900],
              }}
            >
              <CText size="sm" weight="semibold" color="neutral" shade={300}>
                Cancel
              </CText>
            </Pressable>
          </View>
        </View>

        <View
          style={{
            paddingHorizontal: 16,
          }}
        >
          <View
            style={{
              backgroundColor: Colors.primary[900],
              borderRadius: 16,
              padding: 16,
              gap: 8,
              borderWidth: 1,
              borderColor: Colors.primary[700],
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ionicons
                name="information-circle"
                size={18}
                color={Colors.primary[300]}
              />

              <CText weight="bold" size="md" color="primary" shade={300}>
                Split Expenses
              </CText>
            </View>

            <CText size="sm" color="neutral" shade={400}>
              Expenses are automatically split among selected group members
              based on the chosen split method ensuring a clear breakdown of who
              owes what.
            </CText>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: 24 }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View
          style={{
            paddingHorizontal: 4,
            borderRadius: 28,
            borderWidth: 1,
            borderColor: Colors.neutral[600],
            backgroundColor: Colors.neutral[900],
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingVertical: 14,
              // gap: 4,
            }}
          >
            <CText weight="semibold" size="md" color="neutral" shade={300}>
              Amount (NPR)
            </CText>
            <TextInput
              keyboardType="decimal-pad"
              value={amountRef.current}
              onChangeText={(text) => {
                if (text === "" || /^\d*\.?\d*$/.test(text)) {
                  amountRef.current = text;
                  setExpenseForm((prev) => ({
                    ...prev,
                    totalAmount: parseFloat(text) || 0,
                  }));
                }
              }}
              placeholder="0.00"
              placeholderTextColor={Colors.neutral[600]}
              textAlign="center"
              style={{
                fontSize: 32,
                fontWeight: "700",
                letterSpacing: 1,
                paddingVertical: 4,
                borderBottomWidth: 2,
                borderBottomColor: Colors.primary[500],
                color: Colors.neutral[100],
                minWidth: 120,
              }}
            />
          </View>

          <View style={{ gap: 8, padding: 12 }}>
            <Pressable
              onPress={() =>
                openSheet(
                  "selectGroup",
                  (group: GroupWithExpenses) => {
                    setExpenseForm((prev) => ({
                      ...prev,
                      selectedGroup: group,
                    }));
                  },
                  expenseForm.selectedGroup,
                  0,
                )
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingHorizontal: 14,
                paddingVertical: 14,
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
                  {expenseForm?.selectedGroup?.name ?? "Add Participants"}
                </CText>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <CText size="sm" color="neutral" shade={500}>
                  {expenseForm?.selectedGroup?.members?.length ?? 0} members
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
                  {
                    members: expenseForm.selectedGroup?.members.map(
                      ({ id, givenName, familyName }) => ({
                        userId: id,
                        fullName: givenName + familyName,
                      }),
                    ),
                    participants:
                      expenseForm.participants.length === 0
                        ? (expenseForm.selectedGroup?.members.map(
                            ({ id, givenName, familyName }) => ({
                              userId: id,
                              fullName: givenName + " " + familyName,
                            }),
                          ) ?? [])
                        : expenseForm.participants.map(
                            ({ userId, fullName }) => ({
                              userId,
                              fullName,
                            }),
                          ),
                  },
                  0,
                );
              }}
            >
              <CText weight="medium" size="md" color="neutral" shade={300}>
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
              disabled={!expenseForm.participants.length}
              onPress={() => {
                openSheet(
                  "addPayers",
                  handlePayerParticipants,
                  {
                    participants: expenseForm.participants.map(
                      ({ userId, fullName, paidAmount }) => ({
                        userId,
                        fullName,
                        paidAmount,
                      }),
                    ),
                    totalAmount: expenseForm.totalAmount,
                    isEqualPay: expenseForm.expenseMetaData.isEqualPay,
                  },
                  0,
                );
              }}
            >
              <CText
                weight="medium"
                size="md"
                color="neutral"
                shade={300}
                style={{ opacity: !expenseForm.participants.length ? 0.4 : 1 }}
              >
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
              disabled={!expenseForm.participants.length}
              onPress={() => {
                openSheet(
                  "addSplitters",
                  handleSplitterParticipants,
                  {
                    participants: expenseForm.participants.map(
                      ({ userId, fullName, splitAmount }) => ({
                        userId,
                        fullName,
                        splitAmount,
                      }),
                    ),
                    totalAmount: expenseForm.totalAmount,
                    isEqualSplit: expenseForm.expenseMetaData.isEqualSplit,
                  },
                  0,
                );
              }}
            >
              <CText
                weight="medium"
                size="md"
                color="neutral"
                shade={300}
                style={{ opacity: !expenseForm.participants.length ? 0.4 : 1 }}
              >
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
                        selectedCategory: category.id,
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
                      size="ssm"
                      color={isSelected ? "accent" : "neutral"}
                      shade={200}
                      weight="medium"
                      numberOfLines={1}
                      style={{ flex: 1 }}
                      letterSpacing={0.5}
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
      </ScrollView>
      <View
        style={{
          paddingVertical: 12,
          paddingHorizontal: 12,
          borderTopWidth: 1,
          borderTopColor: Colors.neutral[700],
        }}
      >
        <Pressable
          onPress={handleSubmit}
          disabled={isCreatingExpense}
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
      </View>
    </SafeAreaView>
  );
};

export default Expense;
