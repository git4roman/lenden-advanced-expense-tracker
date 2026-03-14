import { View, Pressable, Modal, Image, TextInput } from "react-native";
import { useState } from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { useImagePicker } from "@/src/shared/hooks/use-image-picker";
import { GroupMember } from "../types/group-member";
import { useGroupHandler } from "../hooks/use-group-handler";

type Props = {
  visible: boolean;
  onClose: () => void;
  members: GroupMember[];
};

export const CreateGroupModal = ({ visible, onClose, members }: Props) => {
  const { pickImage } = useImagePicker();
  const {
    handleCreateGroup,
    suggestedMembers,
    setSuggestedMembers,
    selectedMembers,
    setSelectedMembers,
    groupName,
    setGroupName,
    groupImageUri,
    setGroupImageUri,
  } = useGroupHandler(onClose);

  const [friendEmail, setFriendEmail] = useState("");

  const toggleMember = (userId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(userId)
        ? prev.filter((m) => m !== userId)
        : [...prev, userId],
    );
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={{ flex: 1 }}>
        <Pressable
          onPress={onClose}
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
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
          <CText weight="bold" size="xmd">
            Create Group
          </CText>

          <TextInput
            value={groupName}
            onChangeText={setGroupName}
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

          {!!groupImageUri && (
            <Image
              source={{ uri: groupImageUri }}
              style={{ height: 130, borderRadius: 8 }}
            />
          )}

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              onPress={async () => {
                const uri = await pickImage("camera");
                if (uri) setGroupImageUri(uri);
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
              <CText size="xs">Camera</CText>
            </Pressable>

            <Pressable
              onPress={async () => {
                const uri = await pickImage("gallery");
                if (uri) setGroupImageUri(uri);
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
              <CText size="xs">Gallery</CText>
            </Pressable>
          </View>

          <TextInput
            value={friendEmail}
            onChangeText={(text) => {
              setFriendEmail(text);

              const suggestions = members.filter(
                (m) =>
                  `${m.firstName.toLowerCase()} ${m.lastName.toLowerCase()}`.includes(
                    text.toLowerCase(),
                  ) || m.email?.toLowerCase().includes(text.toLowerCase()),
              );
              setSuggestedMembers(suggestions);
            }}
            placeholder="Add friend by email"
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
          <View style={{ maxHeight: 120 }}>
            {suggestedMembers.map((member) => {
              const active = selectedMembers.includes(member.userId);
              return (
                <Pressable
                  key={member.userId}
                  onPress={() => {
                    toggleMember(member.userId);
                    setFriendEmail("");
                    setSuggestedMembers([]);
                  }}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: active
                      ? Colors.accent[100]
                      : Colors.neutral[700],
                    marginVertical: 2,
                  }}
                >
                  <CText size="xs">{`${member.firstName} ${member.lastName} (${member.email})`}</CText>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            value={friendEmail}
            onChangeText={(text) => {
              setFriendEmail(text);

              const suggestions = members.filter(
                (m) =>
                  `${m.firstName.toLowerCase()} ${m.lastName.toLowerCase()}`.includes(
                    text.toLowerCase(),
                  ) || m.email?.toLowerCase().includes(text.toLowerCase()),
              );
              setSuggestedMembers(suggestions);
            }}
            placeholder="Add friend by email"
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
          <View style={{ maxHeight: 120 }}>
            {suggestedMembers.map((member) => {
              const active = selectedMembers.includes(member.userId);
              return (
                <Pressable
                  key={member.userId}
                  onPress={() => {
                    toggleMember(member.userId);
                    setFriendEmail("");
                    setSuggestedMembers([]);
                  }}
                  style={{
                    padding: 8,
                    borderRadius: 8,
                    backgroundColor: active
                      ? Colors.accent[100]
                      : Colors.neutral[700],
                    marginVertical: 2,
                  }}
                >
                  <CText size="xs">{`${member.firstName} ${member.lastName} (${member.email})`}</CText>
                </Pressable>
              );
            })}
          </View>

          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {members.map((member) => {
              const active = selectedMembers.includes(member.userId);

              return (
                <Pressable
                  key={member.userId}
                  onPress={() => toggleMember(member.userId)}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: active
                      ? Colors.accent[500]
                      : Colors.neutral[700],
                  }}
                >
                  <CText size="xs">{`${member.firstName} ${member.lastName}`}</CText>
                </Pressable>
              );
            })}
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={onClose}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: Colors.neutral[600],
                padding: 10,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <CText>Cancel</CText>
            </Pressable>

            <Pressable
              onPress={handleCreateGroup}
              style={{
                flex: 1,
                backgroundColor: Colors.accent[500],
                padding: 10,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <CText weight="bold">Create</CText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
