import React, { useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
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
  ExpenseCategories,
} from "@/src/shared/constants/expense-category.constant";
import Toast from "react-native-toast-message";

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
  groups: Group[];
  categories: ExpenseCategory[];
  description: string;
  imageUrl: string;
  users: ExpenseFormUserType[];
  participants: ExpenseFormParticipantType[] | [];
  selectedGroup: Group | null;
  selectedCategory: number;
  expenseMetaData: ExpenseMetaData;
};

export type UserUpdate = {
  userId: string;
  paidAmount?: number;
  splitAmount?: number;
};

const Expense = () => {
  const { data: groups, isLoading } = useGetGroupsQuery(undefined);

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
      groups[0]?.members?.map((user: Member) => ({
        userId: user.id,
        fullName: user.givenName + " " + user.familyName,
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
        paddingHorizontal: 14,
        backgroundColor: Colors.neutral[900],
        gap: 16,
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
                  0,
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
                weight="semibold"
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
                weight="semibold"
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
    </SafeAreaView>
  );
};

export default Expense;
