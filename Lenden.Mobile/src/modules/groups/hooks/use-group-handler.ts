import { useState } from "react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
} from "@/src/shared/store/apiSlices/group-slice.api";
import { GroupMember } from "../types/group-member";

export const useGroupHandler = (onClose: () => void) => {
  const [groupName, setGroupName] = useState("My Group");
  const [groupImageUri, setGroupImageUri] = useState("");
  const [createGroup, { isLoading: isCreateGroupLoading }] =
    useCreateGroupMutation();
  const [deleteGroup, { isLoading: isDeleteGroupLoading }] =
    useDeleteGroupMutation();
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [suggestedMembers, setSuggestedMembers] = useState<GroupMember[]>([]);

  const handleCreateGroup = async () => {
    try {
      const response = await createGroup({
        groupName,
        groupImageUri,
      }).unwrap();
      Toast.show({ type: "success", text1: "Group Creation Successful" });
      setGroupName("");
      setGroupImageUri("");
      setSelectedMembers([]);
      onClose();

      router.replace("/(tabs)/(groups)");
    } catch (error: any) {
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
      router.replace("/(tabs)/(groups)");
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
    selectedMembers,
    setSelectedMembers,
    suggestedMembers,
    setSuggestedMembers,
    handleCreateGroup,
    handleDeleteGroup,
    isCreateGroupLoading,
    isDeleteGroupLoading,
  };
};
