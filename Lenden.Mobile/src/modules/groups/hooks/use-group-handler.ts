import { useState } from "react";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import {
  useCreateGroupMutation,
  useDeleteGroupMutation,
} from "@/src/shared/store/apiSlices/group-slice.api";

export const useGroupHandler = () => {
  const [groupName, setGroupName] = useState("My Group");
  const [imageUrl, setImageUrl] = useState("");
  const [createGroup, { isLoading: isCreateGroupLoading }] =
    useCreateGroupMutation();
  const [deleteGroup, { isLoading: isDeleteGroupLoading }] =
    useDeleteGroupMutation();

  const handleCreateGroup = async () => {
    try {
      const response = await createGroup({
        groupName,
        imageUrl,
      }).unwrap();
      Toast.show({ type: "success", text1: "Group Creation Successful" });
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
        imageUrl,
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
    imageUrl,
    setImageUrl,
    handleCreateGroup,
    handleDeleteGroup,
    isCreateGroupLoading,
    isDeleteGroupLoading,
  };
};
