import { useState } from "react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
} from "@/src/shared/store/apiSlices/group-slice.api";
import { GroupMember } from "../types/group-member";

type SelectedGroupUser = {
  id: string;
  fullName: string;
  phone: string;
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
    useDeleteGroupMutation();

  const handleCreateGroup = async () => {
    try {
      console.log("Create Group", JSON.stringify(selectedUsers, null, 3));

      // const response = await createGroup({
      //   name: groupName,
      //   imageUrl: groupImageUri,
      //   users: selectedUsers,
      // }).unwrap();

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

  const handleDeleteGroup = async () => {
    try {
      const response = await deleteGroup({
        groupName,
        groupImageUri,
      }).unwrap();

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
