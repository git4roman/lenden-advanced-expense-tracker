import {
  useCreateGroupMutation,
  useDeleteGroupByIdMutation,
} from "@/src/shared/store/apiSlices/group-slice.api";
import { router } from "expo-router";
import { useState } from "react";
import Toast from "react-native-toast-message";

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

export const useGroupHandler = (onClose: () => void) => {
  const [groupName, setGroupName] = useState("My Group");
  const [groupImageUri, setGroupImageUri] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<SelectedGroupUser[]>([]);

  const [createGroup, { isLoading: isCreateGroupLoading }] =
    useCreateGroupMutation();
  const [deleteGroup, { isLoading: isDeleteGroupLoading }] =
    useDeleteGroupByIdMutation();

  const handleCreateGroup = async () => {
    try {
      const payload = {
        name: groupName,
        imageUrl: groupImageUri,
        requestedUsers: selectedUsers.map(({ id, ...users }) => users),
      };
      console.log("Create Group Payload", JSON.stringify(payload, null, 3));

      const response = await createGroup(payload).unwrap();

      Toast.show({ type: "success", text1: "Group Creation Successful" });
      setGroupName("");
      setGroupImageUri("");
      setSelectedUsers([]);
      onClose();

      router.replace("/(tabs)/groups");
    } catch (error: any) {
      console.log("the main error", error);
      Toast.show({
        type: "error",
        text1: "Group Creation Failed",
        text2: error?.data?.message ?? "Something Went Wrong",
      });
    }
  };

  const handleDeleteGroup = async (groupId: string) => {
    try {
      const response = await deleteGroup(groupId).unwrap();

      Toast.show({ type: "success", text1: "Group Deletion Successful" });
      router.replace("/(tabs)/groups");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Group Deletion Failed",
        text2: error?.data?.message ?? "Something Went Wrong",
      });
    }
  };

  return {
    groupName,
    setGroupName,
    groupImageUri,
    setGroupImageUri,
    selectedMembers: selectedUsers,
    setSelectedMembers: setSelectedUsers,

    handleCreateGroup,
    handleDeleteGroup,
    isCreateGroupLoading,
    isDeleteGroupLoading,
  };
};
