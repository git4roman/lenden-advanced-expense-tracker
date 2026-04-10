import {
  View,
  Pressable,
  Image,
  Modal,
  ScrollView,
  RefreshControl,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { GroupTabs } from "../../../../src/modules/groups/components/GroupTabs";
import ExpenseTab, {
  EXPENSE_FILTER_OPTIONS,
} from "@/src/modules/groups/components/expense-tab";
import BalanceTab from "@/src/modules/groups/components/balance-tab";
import TotalTab from "@/src/modules/groups/components/total-tab";
import GroupInfoTab from "@/src/modules/groups/components/group-info-tab";
import { groupButtonsLabel } from "@/src/modules/groups/constants/group-buttons-label.constant";
import {
  useGetGroupQuery,
  useUpdateGroupMutation,
  useDeleteGroupByIdMutation,
  useLeaveGroupMutation,
} from "@/src/shared/store/apiSlices/group-slice.api";
import { useDispatch } from "react-redux";
import { api } from "@/src/shared/store/apiSlices/apiClient";
import { useImagePicker } from "@/src/shared/hooks/use-image-picker";

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
  const [selectedFilterKey, setSelectedFilterKey] = useState(
    EXPENSE_FILTER_OPTIONS[0].key,
  );
  const { pickImage } = useImagePicker();
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupImageUri, setEditGroupImageUri] = useState<string | null>(
    null,
  );
  // const [refreshing, setRefreshing] = useState(false);
  // const [refreshKey, setRefreshKey] = useState(0);
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

  useEffect(() => {
    console.log("DeleteGroup modal visibility", isDeleteOpen);
  }, [isDeleteOpen]);

  useEffect(() => {
    console.log("DeleteGroup loading", isDeletingGroup);
  }, [isDeletingGroup]);

  const handleRefresh = useCallback(() => {
    console.log("Refreshed");
    console.log("groupIdParam value:", groupIdParam);
    dispatch(
      api.util.invalidateTags([
        { type: "Group", id: groupIdParam }, // refetch getGroup
        { type: "Expense", id: groupIdParam }, // refetch getExpenses
      ]),
    );
  }, [dispatch, groupId]);

  const handleOpenEdit = useCallback(() => {
    setEditGroupName(group?.name ?? "");
    setEditGroupImageUri(group?.imageUrl ?? null);
    setIsEditOpen(true);
  }, [group?.imageUrl, group?.name]);

  const handleEditSave = useCallback(async () => {
    console.log("EditGroup save pressed", { groupIdParam });
    if (!groupIdParam) {
      console.log("EditGroup blocked: missing groupIdParam");
      return;
    }
    const payload = {
      id: groupIdParam,
      name: editGroupName.trim() || group?.name,
      imageUrl: editGroupImageUri ?? group?.imageUrl ?? "",
    };
    try {
      console.log("EditGroup payload", payload);
      const result = await updateGroup(payload).unwrap();
      console.log("EditGroup result", result);
      refetch();
      setIsEditOpen(false);
    } catch (error) {
      console.log("EditGroup error", JSON.stringify(error, null, 2));
    }
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
    if (!groupIdParam) {
      console.log("DeleteGroup blocked: missing groupIdParam");
      return;
    }
    try {
      console.log("DeleteGroup request", groupIdParam);
      const result = await deleteGroupById(groupIdParam).unwrap();
      console.log("DeleteGroup result", result);
      setIsDeleteOpen(false);
      router.back();
    } catch (error) {
      console.log("DeleteGroup error", JSON.stringify(error, null, 2));
    }
  }, [deleteGroupById, groupIdParam]);

  const handleLeaveGroup = useCallback(async () => {
    if (!groupIdParam) {
      console.log("LeaveGroup blocked: missing groupIdParam");
      return;
    }
    try {
      console.log("LeaveGroup request", groupIdParam);
      const result = await leaveGroup(groupIdParam).unwrap();
      console.log("LeaveGroup result", result);
      setIsLeaveOpen(false);
      router.back();
    } catch (error) {
      console.log("LeaveGroup error", JSON.stringify(error, null, 2));
    }
  }, [groupIdParam, leaveGroup]);

  const selectedFilterLabel =
    EXPENSE_FILTER_OPTIONS.find((option) => option.key === selectedFilterKey)
      ?.label ?? EXPENSE_FILTER_OPTIONS[0].label;

  const isExpensesTab = selectedTab === "Expenses";

  const AciveTabScreen = React.useMemo(() => {
    if (selectedTab === "Expenses") {
      return (
        <ExpenseTab groupId={groupId as string} filterKey={selectedFilterKey} />
      );
    }
    if (selectedTab === "label2") {
      return <BalanceTab groupId={groupId as string} />;
    }
    if (selectedTab === "label3") {
      return <TotalTab groupId={groupId as string} />;
    }
    return <GroupInfoTab groupId={groupId as string} />;
  }, [groupId, selectedFilterKey, selectedTab]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.neutral[900] }}>
      <Stack.Screen
        options={{
          title: group?.name ?? "Group",
          headerRight: () => (
            <Pressable
              onPress={() => {
                setIsMenuOpen((prev) => !prev);
              }}
            >
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
        <View style={{ flex: 1, gap: 4 }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 12,
              marginBottom: 8,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <Image
              source={{
                uri: group?.imageUrl,
              }}
              style={{
                width: "100%",
                height: 150,
                borderRadius: 16,
              }}
              resizeMode="cover"
            />
          </View>

          <View
            style={{
              gap: 12,
              paddingHorizontal: 8,
              position: "relative",
            }}
          >
            <GroupTabs
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </View>

          <View style={{ flex: 1 }}>
            {AciveTabScreen}
          </View>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ flexGrow: 1, gap: 4 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              tintColor={Colors.neutral[200]}
              colors={[Colors.accent[400]]}
            />
          }
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 12,
              paddingVertical: 12,
              marginBottom: 8,
              borderRadius: 16,
              overflow: "hidden",
            }}
          >
            <Image
              source={{
                uri: group?.imageUrl,
              }}
              style={{
                width: "100%",
                height: 150,
                borderRadius: 16,
              }}
              resizeMode="cover"
            />
          </View>

          <View
            style={{
              gap: 12,
              paddingHorizontal: 8,
              flex: 1,
              position: "relative",
            }}
          >
            <GroupTabs
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
            {AciveTabScreen}
          </View>
        </ScrollView>
      )}

      {selectedTab === "Expenses" && (
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
        onRequestClose={() => {
          setIsFilterOpen(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => {
              setIsFilterOpen(false);
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
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
        onRequestClose={() => {
          setIsMenuOpen(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => {
              setIsMenuOpen(false);
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
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
            {/* <View style={{ gap: 2, paddingHorizontal: 4, paddingBottom: 2 }}>
              <CText weight="bold" size="sm" color="neutral" shade={200}>
                Group Actions
              </CText>
              <CText size="xs" color="neutral" shade={500}>
                Manage this group
              </CText>
            </View> */}
            <Pressable
              onPress={() => {
                setIsMenuOpen(false);
                handleOpenEdit();
              }}
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "flex-start",
                alignItems: "center",
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: Colors.neutral[900],
                borderWidth: 1,
                borderColor: Colors.neutral[700],
              }}
            >
              <Feather name="edit-2" size={15} color={Colors.neutral[300]} />
              <CText color="neutral" shade={200} weight="semibold">
                Edit Info
              </CText>
            </Pressable>
            <Pressable
              onPress={() => {
                console.log("LeaveGroup menu pressed");
                setIsMenuOpen(false);
                setIsLeaveOpen(true);
              }}
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "flex-start",
                alignItems: "center",
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: Colors.neutral[900],
                borderWidth: 1,
                borderColor: Colors.neutral[700],
              }}
            >
              <Ionicons
                name="exit-outline"
                size={16}
                color={Colors.warning[400]}
              />
              <CText color="neutral" shade={200} weight="semibold">
                Leave Group
              </CText>
            </Pressable>
            <Pressable
              onPress={() => {
                console.log("DeleteGroup menu pressed");
                setIsMenuOpen(false);
                setIsDeleteOpen(true);
              }}
              style={{
                flexDirection: "row",
                gap: 10,
                justifyContent: "flex-start",
                alignItems: "center",
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 10,
                backgroundColor: Colors.warning[900],
                borderWidth: 1,
                borderColor: Colors.warning[700],
              }}
            >
              <AntDesign name="delete" size={14} color={Colors.warning[300]} />
              <CText color="warning" shade={300} weight="semibold">
                Delete Group
              </CText>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={isLeaveOpen}
        animationType="fade"
        onRequestClose={() => {
          setIsLeaveOpen(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setIsLeaveOpen(false)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
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
              Leave Group?
            </CText>
            <CText size="sm" color="neutral" shade={400}>
              You will lose access to this group.
            </CText>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => setIsLeaveOpen(false)}
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
                onPress={handleLeaveGroup}
                disabled={isLeavingGroup}
                style={{
                  flex: 1,
                  backgroundColor: Colors.warning[600],
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  opacity: isLeavingGroup ? 0.7 : 1,
                }}
              >
                <CText weight="bold" color="warning" shade={50}>
                  {isLeavingGroup ? "Leaving..." : "Leave"}
                </CText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={isDeleteOpen}
        animationType="fade"
        onRequestClose={() => {
          setIsDeleteOpen(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setIsDeleteOpen(false)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
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
              Delete Group?
            </CText>
            <CText size="sm" color="neutral" shade={400}>
              This action cannot be undone.
            </CText>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => setIsDeleteOpen(false)}
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
                onPress={() => {
                  console.log("DeleteGroup confirm pressed");
                  handleDeleteGroup();
                }}
                disabled={isDeletingGroup}
                style={{
                  flex: 1,
                  backgroundColor: Colors.warning[600],
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  opacity: isDeletingGroup ? 0.7 : 1,
                }}
              >
                <CText weight="bold" color="warning" shade={50}>
                  {isDeletingGroup ? "Deleting..." : "Delete"}
                </CText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={isEditOpen}
        animationType="fade"
        onRequestClose={() => {
          setIsEditOpen(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => {
              setIsEditOpen(false);
            }}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
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
              <Pressable
                onPress={async () => {
                  const uri = await pickImage("camera");
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
                  Camera
                </CText>
              </Pressable>

              <Pressable
                onPress={async () => {
                  const uri = await pickImage("gallery");
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
                  Gallery
                </CText>
              </Pressable>
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
