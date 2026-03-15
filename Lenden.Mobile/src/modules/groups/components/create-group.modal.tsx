import { View, Pressable, Modal, Image, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { useImagePicker } from "@/src/shared/hooks/use-image-picker";
import { GroupMember } from "../types/group-member";
import { useGroupHandler } from "../hooks/use-group-handler";
import { useGetFriendsQuery } from "@/src/shared/store/apiSlices/friends-slice.api";

type Props = {
  visible: boolean;
  onClose: () => void;
  members: GroupMember[];
};
type Friend = {
  id: string;
  givenName: string;
  familyName: string;
  email: string;
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

  const { data: friends, error } = useGetFriendsQuery(undefined);
  const [search, setSearch] = useState("");
  const suggestions = search.trim()
    ? friends.filter((friend: Friend) => {
        const fullName =
          `${friend.givenName} ${friend.familyName}`.toLowerCase();
        const email = friend.email.toLowerCase();
        const query = search.toLowerCase();
        return fullName.includes(query) || email.includes(query);
      })
    : [];

  console.log("The data", friends);
  console.log("The Error", error);
  const toggleMember = (userId: string) => {
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

          <View style={{ maxHeight: 120 }}>
            {suggestedMembers.map((member) => {
              const active = selectedMembers.includes(member.id);
              return (
                <Pressable
                  key={member.id}
                  onPress={() => {
                    toggleMember(member.id);
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
                  <CText size="xs">{`${member.givenName} ${member.familyName} (${member.email})`}</CText>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search by name or email..."
            placeholderTextColor={Colors.neutral[500]}
            style={{
              backgroundColor: Colors.neutral[800],
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 10,
              color: Colors.neutral[100],
              borderWidth: 1,
              borderColor: Colors.neutral[700],
            }}
          />
          {suggestions.length > 0 && (
            <View
              style={{
                backgroundColor: Colors.neutral[800],
                borderRadius: 10,
                borderWidth: 1,
                borderColor: Colors.neutral[700],
                marginTop: 4,
              }}
            >
              {suggestions.map((friend: Friend) => (
                <Pressable
                  key={friend.id}
                  onPress={() => {
                    if (!selectedMembers.includes(friend.id)) {
                      setSelectedMembers((prev) => [...prev, friend.id]);
                    }
                    setSearch(""); // clear search after selecting
                  }}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.neutral[700],
                  }}
                >
                  <CText size="sm" color="neutral" shade={200}>
                    {friend.givenName} {friend.familyName}
                  </CText>
                  <CText size="xs" color="neutral" shade={500}>
                    {friend.email}
                  </CText>
                </Pressable>
              ))}
            </View>
          )}

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
              marginTop: 8,
            }}
          >
            {selectedMembers.map((id) => {
              const friend = friends.find((f: Friend) => f.id === id);
              if (!friend) return null;

              return (
                <Pressable
                  key={id}
                  onPress={() =>
                    setSelectedMembers((prev) => prev.filter((m) => m !== id))
                  }
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: Colors.accent[500],
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CText size="xs">
                    {friend.givenName} {friend.familyName}
                  </CText>
                  <CText size="xs" color="neutral" shade={400}>
                    ✕
                  </CText>
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
