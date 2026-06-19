import { Colors, CText } from "@/src/shared";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import React, { Dispatch, SetStateAction } from "react";
import { Modal, Pressable, View } from "react-native";
import { ActiveDialog } from "../hooks";

interface Args {
  activeDialog: string;
  setActiveDialog: Dispatch<SetStateAction<ActiveDialog>>;
  handleOpenEdit: () => void;
  insets: any;
}
export const GroupMenuModal = ({
  activeDialog,
  setActiveDialog,
  handleOpenEdit,
  insets,
}: Args) => {
  return (
    <Modal
      transparent
      visible={activeDialog === "menu"}
      animationType="fade"
      onRequestClose={() => setActiveDialog("none")}
    >
      <View style={{ flex: 1 }}>
        <Pressable
          onPress={() => setActiveDialog("none")}
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
                <Feather name="edit-2" size={15} color={Colors.neutral[300]} />
              ),
              onPress: () => {
                setActiveDialog("none");
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
                setActiveDialog("leave");
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
                setActiveDialog("delete");
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
  );
};

export default GroupMenuModal;
