import { GroupMenuModal, useGroupHandler } from "@/src/modules/groups";
import BalanceTab from "@/src/modules/groups/components/balance-tab";
import ExpenseTab, {
  EXPENSE_FILTER_OPTIONS,
} from "@/src/modules/groups/components/expense-tab";
import GroupInfoTab from "@/src/modules/groups/components/group-info-tab";
import TotalTab from "@/src/modules/groups/components/total-tab";
import { groupButtonsLabel } from "@/src/modules/groups/constants/group-buttons-label.constant";
import { RootState } from "@/src/shared";
import { useImagePicker } from "@/src/shared/hooks/use-image-picker";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { Feather } from "@expo/vector-icons";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useCallback, useState } from "react";
import { Image, Modal, Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
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
  const group = useSelector((state: RootState) =>
    state.groups.find((g) => g.id === groupId),
  );
  // console.log("Expenses", JSON.stringify(group?.expenses, null, 3));

  const {
    handleDeleteGroup,
    handleLeaveGroup,
    handleRefresh,
    isLeaveGroupLoading,
    isDeleteGroupLoading,
    activeDialog,
    setActiveDialog,
    isLoading,
    handleEditSave,
    isUpdatingGroup,
  } = useGroupHandler(groupIdParam);

  const insets = useSafeAreaInsets();

  const [selectedTab, setSelectedTab] = useState<string>(
    groupButtonsLabel[0].key,
  );

  const [selectedFilterKey, setSelectedFilterKey] = useState<FilterKey>(
    EXPENSE_FILTER_OPTIONS[0].key,
  );
  const [editGroupName, setEditGroupName] = useState("");
  const [editGroupImageUri, setEditGroupImageUri] = useState<string>("");

  const { pickImage } = useImagePicker();

  const handleOpenEdit = useCallback(() => {
    setEditGroupName(group?.name ?? "");
    setEditGroupImageUri(group?.coverPhoto!);
    setActiveDialog("edit");
  }, [group?.name, group?.coverPhoto]);

  const selectedFilterLabel =
    EXPENSE_FILTER_OPTIONS.find((o) => o.key === selectedFilterKey)?.label ??
    EXPENSE_FILTER_OPTIONS[0].label;

  const activeTabScreen = (() => {
    switch (selectedTab) {
      case "Expenses":
        return (
          <ExpenseTab
            groupId={groupId as string}
            filterKey={selectedFilterKey}
            refreshing={isLoading}
            onRefresh={handleRefresh}
          />
        );

      case "Balances":
        return (
          <BalanceTab
            repayments={group?.repayments ?? []}
            groupId={groupId as string}
            members={group?.members ?? []}
          />
        );

      case "Total":
        return <TotalTab groupId={groupId as string} />;

      default:
        return <GroupInfoTab group={group} />;
    }
  })();

  const isExpensesTab = selectedTab === "Expenses";

  return (
    <View style={{ flex: 1, backgroundColor: Colors.neutral[900] }}>
      <Stack.Screen
        options={{
          title: group?.name ?? "Group",
          headerRight: () => (
            <Pressable onPress={() => setActiveDialog("menu")}>
              <Feather
                name="more-vertical"
                size={24}
                color={Colors.neutral[200]}
              />
            </Pressable>
          ),
        }}
      />

      <View style={{ flex: 1 }}>
        <View
          style={{
            paddingHorizontal: 12,
            paddingVertical: 12,
            marginBottom: 8,
          }}
        >
          <Image
            source={{ uri: group?.coverPhoto }}
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

        <View style={{ flex: 1, paddingHorizontal: 8 }}>{activeTabScreen}</View>
      </View>

      {isExpensesTab && (
        <Pressable
          onPress={() => setActiveDialog("filter")}
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
        visible={activeDialog === "filter"}
        animationType="fade"
        onRequestClose={() => setActiveDialog("none")}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setActiveDialog("none")}
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
                    setActiveDialog("none");
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

      <GroupMenuModal
        activeDialog={activeDialog}
        setActiveDialog={setActiveDialog}
        handleOpenEdit={handleOpenEdit}
        insets={insets}
      />

      <ConfirmModal
        visible={activeDialog === "filter"}
        title="Leave Group?"
        message="You will lose access to this group."
        confirmLabel="Leave"
        isLoading={isLeaveGroupLoading}
        onConfirm={handleLeaveGroup}
        onCancel={() => setActiveDialog("none")}
        danger
      />

      <ConfirmModal
        visible={activeDialog === "delete"}
        title="Delete Group?"
        message="This action cannot be undone."
        confirmLabel="Delete"
        isLoading={isDeleteGroupLoading}
        onConfirm={handleDeleteGroup}
        onCancel={() => setActiveDialog("none")}
        danger
      />

      <Modal
        transparent
        visible={activeDialog === "edit"}
        animationType="fade"
        onRequestClose={() => setActiveDialog("none")}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setActiveDialog("none")}
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
                onPress={() => setActiveDialog("none")}
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
                onPress={() =>
                  handleEditSave({
                    name: editGroupName,
                    coverPhotoUri: editGroupImageUri,
                  })
                }
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
