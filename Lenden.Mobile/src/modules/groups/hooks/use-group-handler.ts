import { api } from "@/src/shared";
import {
  useCreateGroupMutation,
  useDeleteGroupByIdMutation,
  useGetGroupExpensesQuery,
  useLeaveGroupMutation,
  useUpdateGroupMutation,
} from "@/src/shared/store/apiSlices/group-slice.api";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

type SelectedGroupUser = {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
};

export type CreateGroupPayloadType = {
  name: string;
  imgUrl: string;
  users: SelectedGroupUser[];
};

export type ActiveDialog =
  | "none"
  | "menu"
  | "edit"
  | "delete"
  | "leave"
  | "filter";

export const useGroupHandler = (groupIdParam: string) => {
  const dispatch = useDispatch();
  const [groupName, setGroupName] = useState("My Group");
  const [groupImageUri, setGroupImageUri] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SelectedGroupUser[]>([]);

  const [activeDialog, setActiveDialog] = useState<ActiveDialog>("none");

  const [createGroup, { isLoading: isCreateGroupLoading }] =
    useCreateGroupMutation();
  const [deleteGroupById, { isLoading: isDeleteGroupLoading }] =
    useDeleteGroupByIdMutation();
  const [leaveGroup, { isLoading: isLeaveGroupLoading }] =
    useLeaveGroupMutation();
  const [updateGroup, { isLoading: isUpdatingGroup }] =
    useUpdateGroupMutation();
  const { data, refetch, isLoading } = useGetGroupExpensesQuery(
    groupIdParam as string,
  );

  const handleCreateGroup = async (onClose: () => void) => {
    try {
      const payload = {
        name: groupName,
        imageUrl: groupImageUri,
        requestedUsers: selectedUsers.map(({ id, ...users }) => users),
      };
      const response = await createGroup(payload).unwrap();
      Toast.show({ type: "success", text1: "Group Creation Successful" });
      setGroupName("");
      setGroupImageUri("");
      setSelectedUsers([]);
      onClose();
      router.replace("/(tabs)/groups");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Group Creation Failed",
        text2: error?.data?.message ?? "Something Went Wrong",
      });
    }
  };

  const handleDeleteGroup = useCallback(async () => {
    if (!groupIdParam) return;
    try {
      await deleteGroupById(groupIdParam).unwrap();
      router.back();
    } catch {}
  }, [deleteGroupById, groupIdParam]);

  const handleLeaveGroup = useCallback(async () => {
    if (!groupIdParam) return;
    try {
      await leaveGroup(groupIdParam).unwrap();
      router.back();
    } catch {}
  }, [leaveGroup, groupIdParam]);

  const handleRefresh = useCallback(() => {
    dispatch(
      api.util.invalidateTags([
        { type: "Group", id: groupIdParam },
        { type: "Expense", id: groupIdParam },
      ]),
    );
  }, [dispatch, groupIdParam]);

  const handleEditSave = useCallback(
    async ({
      name,
      coverPhotoUri,
    }: {
      name: string;
      coverPhotoUri: string;
    }) => {
      if (!groupIdParam) return;
      try {
        await updateGroup({
          id: groupIdParam,
          name: name.trim(),
          imageUrl: coverPhotoUri,
        }).unwrap();
        refetch();
        setActiveDialog("none");
      } catch {}
    },
    [groupIdParam],
  );

  return {
    groupName,
    setGroupName,
    groupImageUri,
    setGroupImageUri,
    selectedMembers: selectedUsers,
    setSelectedMembers: setSelectedUsers,
    handleCreateGroup,
    handleDeleteGroup,
    handleLeaveGroup,
    isCreateGroupLoading,
    isDeleteGroupLoading,
    isLeaveGroupLoading,
    handleRefresh,
    activeDialog,
    setActiveDialog,
    isLoading,
    handleEditSave,
    isUpdatingGroup,
  };
};
