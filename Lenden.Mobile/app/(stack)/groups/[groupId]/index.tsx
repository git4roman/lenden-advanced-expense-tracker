import BalanceTab from "@/src/modules/groups/components/balance-tab";
import ExpenseTab, {
  EXPENSE_FILTER_OPTIONS,
} from "@/src/modules/groups/components/expense-tab";
import GroupInfoTab from "@/src/modules/groups/components/group-info-tab";
import TotalTab from "@/src/modules/groups/components/total-tab";
import { groupButtonsLabel } from "@/src/modules/groups/constants/group-buttons-label.constant";
import { useImagePicker } from "@/src/shared/hooks/use-image-picker";
import { api } from "@/src/shared/store/apiSlices/apiClient";
import {
  useDeleteGroupByIdMutation,
  useGetGroupQuery,
  useLeaveGroupMutation,
  useUpdateGroupMutation,
} from "@/src/shared/store/apiSlices/group-slice.api";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Stack, router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, Modal, Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";
import { GroupTabs } from "../../../../src/modules/groups/components/GroupTabs";

type FilterKey = (typeof EXPENSE_FILTER_OPTIONS)[number]["key"];

const ConfirmModal = ({
  visible,
  title,
  message,
  confirmLabel,
  isLoading,
  onConfirm,
  onCancel,
  danger = false,
}: {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  danger?: boolean;
}) => (
  <Modal
    transparent
    visible={visible}
    animationType="fade"
    onRequestClose={onCancel}
  >
    <View style={{ flex: 1 }}>
      <Pressable
        onPress={onCancel}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.45)",
        }}
      />
      <View
        style={{
          position: "absolute",
          left: 12,
          right: 12,
          top: "30%",
          borderRadius: 14,
          borderWidth: 1,
          borderColor: Colors.neutral[700],
          backgroundColor: Colors.neutral[800],
          padding: 14,
          gap: 12,
        }}
      >
        <CText weight="bold" size="xmd" color="neutral" shade={200}>
          {title}
        </CText>
        <CText size="sm" color="neutral" shade={400}>
          {message}
        </CText>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={onCancel}
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
            onPress={onConfirm}
            disabled={isLoading}
            style={{
              flex: 1,
              backgroundColor: danger
                ? Colors.warning[600]
                : Colors.accent[500],
              padding: 10,
              borderRadius: 10,
              alignItems: "center",
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            <CText
              weight="bold"
              color={danger ? "warning" : "neutral"}
              shade={danger ? 50 : 100}
            >
              {isLoading ? `${confirmLabel}...` : confirmLabel}
            </CText>
          </Pressable>
        </View>
      </View>
    </View>
  </Modal>
);

const GroupScreen = () => {
  const { groupId } = useLocalSearchParams();

  const groupIdParam = Array.isArray(groupId) ? groupId[0] : groupId;
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const [selectedTab, setSelectedTab] = useState<string>(
    groupButtonsLabel[0].key,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isLeaveOpen, setIsLeaveOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilterKey, setSelectedFilterKey] = useState<FilterKey>(
    EXPENSE_FILTER_OPTIONS[0].key,
  );
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupImageUri, setEditGroupImageUri] = useState<string | null>(
    null,
  );

  const { pickImage } = useImagePicker();
  const {
    data: group,
    refetch,
    isLoading,
  } = useGetGroupQuery(groupId as string);
  const [updateGroup, { isLoading: isUpdatingGroup }] =
    useUpdateGroupMutation();
  const [deleteGroupById, { isLoading: isDeletingGroup }] =
    useDeleteGroupByIdMutation();
  const [leaveGroup, { isLoading: isLeavingGroup }] = useLeaveGroupMutation();

  const handleRefresh = useCallback(() => {
    dispatch(
      api.util.invalidateTags([
        { type: "Group", id: groupIdParam },
        { type: "Expense", id: groupIdParam },
      ]),
    );
  }, [dispatch, groupIdParam]);

  const handleOpenEdit = useCallback(() => {
    setEditGroupName(group?.name ?? "");
    setEditGroupImageUri(group?.imageUrl ?? null);
    setIsEditOpen(true);
  }, [group?.name, group?.imageUrl]);

  const handleEditSave = useCallback(async () => {
    if (!groupIdParam) return;
    try {
      await updateGroup({
        id: groupIdParam,
        name: editGroupName.trim() || group?.name,
        imageUrl: editGroupImageUri ?? group?.imageUrl ?? "",
      }).unwrap();
      refetch();
      setIsEditOpen(false);
    } catch {}
  }, [
    editGroupImageUri,
    editGroupName,
    group?.imageUrl,
    group?.name,
    groupIdParam,
    refetch,
    updateGroup,
  ]);

  const handleDeleteGroup = useCallback(async () => {
    if (!groupIdParam) return;
    try {
      await deleteGroupById(groupIdParam).unwrap();
      setIsDeleteOpen(false);
      router.back();
    } catch {}
  }, [deleteGroupById, groupIdParam]);

  const handleLeaveGroup = useCallback(async () => {
    if (!groupIdParam) return;
    try {
      await leaveGroup(groupIdParam).unwrap();
      setIsLeaveOpen(false);
      router.back();
    } catch {}
  }, [groupIdParam, leaveGroup]);

  const selectedFilterLabel =
    EXPENSE_FILTER_OPTIONS.find((o) => o.key === selectedFilterKey)?.label ??
    EXPENSE_FILTER_OPTIONS[0].label;

  const groupHeader = React.useMemo(
    () => (
      <>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 12,
            marginBottom: 8,
          }}
        >
          <Image
            source={{ uri: group?.imageUrl }}
            style={{ width: "100%", height: 150, borderRadius: 16 }}
            resizeMode="cover"
          />
        </View>
        <View style={{ paddingHorizontal: 8, marginBottom: 4 }}>
          <GroupTabs
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
        </View>
      </>
    ),
    [group?.imageUrl, selectedTab],
  );

  const activeTabScreen = React.useMemo(() => {
    switch (selectedTab) {
      case "Expenses":
        return (
          <ExpenseTab
            groupId={groupId as string}
            filterKey={selectedFilterKey}
            ListHeaderComponent={groupHeader}
            refreshing={isLoading}
            onRefresh={handleRefresh}
          />
        );
      case "label2":
        return <BalanceTab groupId={groupId as string} />;
      case "label3":
        return <TotalTab groupId={groupId as string} />;

      default:
        return <GroupInfoTab groupId={groupId as string} />;
    }
  }, [
    groupId,
    selectedFilterKey,
    selectedTab,
    groupHeader,
    isLoading,
    handleRefresh,
  ]);

  const isExpensesTab = selectedTab === "Expenses";

  return (
    <View style={{ flex: 1, backgroundColor: Colors.neutral[900] }}>
      <Stack.Screen
        options={{
          title: group?.name ?? "Group",
          headerRight: () => (
            <Pressable onPress={() => setIsMenuOpen((prev) => !prev)}>
              <Feather
                name="more-vertical"
                size={24}
                color={Colors.neutral[200]}
              />
            </Pressable>
          ),
        }}
      />

      {isExpensesTab ? (
        activeTabScreen
      ) : (
        <View style={{ flex: 1 }}>
          {groupHeader}
          <View style={{ flex: 1, paddingHorizontal: 8 }}>
            {activeTabScreen}
          </View>
        </View>
      )}

      {isExpensesTab && (
        <Pressable
          onPress={() => setIsFilterOpen(true)}
          style={{
            position: "absolute",
            right: 16,
            bottom: 20,
            height: 46,
            width: 46,
            borderRadius: 23,
            backgroundColor: Colors.accent[500],
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: Colors.accent[400],
            zIndex: 10,
            elevation: 6,
          }}
        >
          <Feather name="filter" size={20} color={Colors.neutral[100]} />
        </Pressable>
      )}

      <Modal
        transparent
        visible={isFilterOpen}
        animationType="fade"
        onRequestClose={() => setIsFilterOpen(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setIsFilterOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
          />
          <View
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              top: "25%",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[800],
              padding: 14,
              gap: 8,
            }}
          >
            <CText weight="bold" size="md" color="neutral" shade={200}>
              Filter by
            </CText>
            <CText size="xs" color="neutral" shade={400}>
              Current: {selectedFilterLabel}
            </CText>
            {EXPENSE_FILTER_OPTIONS.map((option) => {
              const isSelected = option.key === selectedFilterKey;
              return (
                <Pressable
                  key={option.key}
                  onPress={() => {
                    setSelectedFilterKey(option.key);
                    setIsFilterOpen(false);
                  }}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: isSelected
                      ? Colors.neutral[500]
                      : Colors.neutral[700],
                    backgroundColor: isSelected
                      ? Colors.neutral[700]
                      : Colors.neutral[800],
                  }}
                >
                  <CText
                    color="neutral"
                    shade={isSelected ? 100 : 300}
                    size="sm"
                    weight="medium"
                  >
                    {option.label}
                  </CText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={isMenuOpen}
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setIsMenuOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          />
          <View
            style={{
              position: "absolute",
              top: insets.top + 48,
              right: 12,
              backgroundColor: Colors.neutral[800],
              borderColor: Colors.neutral[700],
              borderWidth: 1,
              zIndex: 10000,
              paddingVertical: 8,
              paddingHorizontal: 8,
              borderRadius: 14,
              gap: 6,
              minWidth: 110,
            }}
          >
            {[
              {
                label: "Edit Info",
                icon: (
                  <Feather
                    name="edit-2"
                    size={15}
                    color={Colors.neutral[300]}
                  />
                ),
                onPress: () => {
                  setIsMenuOpen(false);
                  handleOpenEdit();
                },
                style: {
                  backgroundColor: Colors.neutral[900],
                  borderColor: Colors.neutral[700],
                },
                textColor: "neutral" as const,
                textShade: 200,
              },
              {
                label: "Leave Group",
                icon: (
                  <Ionicons
                    name="exit-outline"
                    size={16}
                    color={Colors.warning[400]}
                  />
                ),
                onPress: () => {
                  setIsMenuOpen(false);
                  setIsLeaveOpen(true);
                },
                style: {
                  backgroundColor: Colors.neutral[900],
                  borderColor: Colors.neutral[700],
                },
                textColor: "neutral" as const,
                textShade: 200,
              },
              {
                label: "Delete Group",
                icon: (
                  <AntDesign
                    name="delete"
                    size={14}
                    color={Colors.warning[300]}
                  />
                ),
                onPress: () => {
                  setIsMenuOpen(false);
                  setIsDeleteOpen(true);
                },
                style: {
                  backgroundColor: Colors.warning[900],
                  borderColor: Colors.warning[700],
                },
                textColor: "warning" as const,
                textShade: 300,
              },
            ].map(({ label, icon, onPress, style, textColor, textShade }) => (
              <Pressable
                key={label}
                onPress={onPress}
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 10,
                  borderWidth: 1,
                  ...style,
                }}
              >
                {icon}
                <CText color={textColor} shade={800} weight="semibold">
                  {label}
                </CText>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={isLeaveOpen}
        title="Leave Group?"
        message="You will lose access to this group."
        confirmLabel="Leave"
        isLoading={isLeavingGroup}
        onConfirm={handleLeaveGroup}
        onCancel={() => setIsLeaveOpen(false)}
        danger
      />

      <ConfirmModal
        visible={isDeleteOpen}
        title="Delete Group?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeletingGroup}
        onConfirm={handleDeleteGroup}
        onCancel={() => setIsDeleteOpen(false)}
        danger
      />

      <Modal
        transparent
        visible={isEditOpen}
        animationType="fade"
        onRequestClose={() => setIsEditOpen(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setIsEditOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
          />
          <View
            style={{
              position: "absolute",
              left: 12,
              right: 12,
              top: "17%",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[800],
              padding: 14,
              gap: 12,
            }}
          >
            <CText weight="bold" size="xmd" color="neutral" shade={200}>
              Edit Group Info
            </CText>

            <TextInput
              value={editGroupName}
              onChangeText={setEditGroupName}
              placeholder="Group name"
              placeholderTextColor={Colors.neutral[600]}
              style={{
                borderWidth: 1,
                borderColor: Colors.neutral[700],
                backgroundColor: Colors.neutral[900],
                borderRadius: 10,
                padding: 10,
                color: Colors.neutral[100],
              }}
            />

            {!!editGroupImageUri && (
              <Image
                source={{ uri: editGroupImageUri }}
                style={{ height: 130, borderRadius: 8 }}
              />
            )}

            <View style={{ flexDirection: "row", gap: 8 }}>
              {(["camera", "gallery"] as const).map((source) => (
                <Pressable
                  key={source}
                  onPress={async () => {
                    const uri = await pickImage(source);
                    if (uri) setEditGroupImageUri(uri);
                  }}
                  style={{
                    flex: 1,
                    borderWidth: 1,
                    borderColor: Colors.neutral[600],
                    padding: 10,
                    borderRadius: 8,
                    alignItems: "center",
                  }}
                >
                  <CText size="xs" shade={300}>
                    {source.charAt(0).toUpperCase() + source.slice(1)}
                  </CText>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => setIsEditOpen(false)}
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
                onPress={handleEditSave}
                disabled={isUpdatingGroup}
                style={{
                  flex: 1,
                  backgroundColor: Colors.accent[500],
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  opacity: isUpdatingGroup ? 0.7 : 1,
                }}
              >
                <CText weight="bold">
                  {isUpdatingGroup ? "Saving..." : "Save"}
                </CText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupScreen;
