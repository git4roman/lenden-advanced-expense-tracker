import { View, Pressable, Modal, Image, TextInput, ScrollView } from "react-native";
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
  const noFriends = !friends || friends.length === 0;

  const handleCancel = () => {
    setGroupName("My Group");
    setGroupImageUri("");
    setSelectedMembers([]);
    setSuggestedMembers([]);
    setSearch("");
    setFriendEmail("");
    onClose();
  };

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={{ flex: 1 }}>
        <Pressable
          onPress={handleCancel}
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
            top: "12%",
            borderRadius: 18,
            borderWidth: 1,
            borderColor: Colors.neutral[700],
            backgroundColor: Colors.neutral[800],
            padding: 16,
            gap: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ gap: 2 }}>
              <CText weight="bold" size="xmd" color="neutral" shade={200}>
                Create Group
              </CText>
              <CText size="xs" color="neutral" shade={500}>
                Add a name, image, and members
              </CText>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 8 }}
            style={{ maxHeight: "75%" }}
          >
            <View style={{ gap: 6 }}>
              <CText size="xs" color="neutral" shade={400} weight="semibold">
                Group Name
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
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                  color: Colors.neutral[100],
                }}
              />
            </View>

          <View style={{ gap: 6 }}>
            <CText size="xs" color="neutral" shade={400} weight="semibold">
              Group Image
            </CText>
            {!!groupImageUri ? (
              <Image
                source={{ uri: groupImageUri }}
                style={{ height: 140, borderRadius: 12 }}
              />
            ) : (
              <View
                style={{
                  height: 140,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[900],
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                <CText size="sm" color="neutral" shade={400}>
                  No image selected
                </CText>
                <CText size="xs" color="neutral" shade={500}>
                  Add one from camera or gallery
                </CText>
              </View>
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
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: Colors.neutral[900],
                }}
              >
                <CText size="xs" shade={300}>
                  Camera
                </CText>
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
                  paddingVertical: 10,
                  borderRadius: 10,
                  alignItems: "center",
                  backgroundColor: Colors.neutral[900],
                }}
              >
                <CText size="xs" shade={300}>
                  Gallery
                </CText>
              </Pressable>
            </View>
          </View>

          {suggestedMembers.length > 0 && (
            <View
              style={{
                maxHeight: 140,
                backgroundColor: Colors.neutral[900],
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Colors.neutral[700],
                padding: 6,
                gap: 6,
              }}
            >
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
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 10,
                      backgroundColor: active
                        ? Colors.accent[900]
                        : Colors.neutral[800],
                    }}
                  >
                    <CText size="xs" color="neutral" shade={200}>
                      {member.givenName} {member.familyName}
                    </CText>
                    <CText size="xs" color="neutral" shade={500}>
                      {member.email}
                    </CText>
                  </Pressable>
                );
              })}
            </View>
          )}

          <View style={{ gap: 6 }}>
            <CText size="xs" color="neutral" shade={400} weight="semibold">
              Add Members
            </CText>
            <TextInput
              value={search}
              onChangeText={setSearch}
              editable={!noFriends}
              placeholder={
                noFriends ? "No friends available" : "Search by name or email..."
              }
              placeholderTextColor={Colors.neutral[500]}
              style={{
                backgroundColor: Colors.neutral[900],
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 12,
                color: Colors.neutral[100],
                borderWidth: 1,
                borderColor: Colors.neutral[700],
                opacity: noFriends ? 0.5 : 1,
              }}
            />
          </View>
          {suggestions.length > 0 && (
            <View
              style={{
                backgroundColor: Colors.neutral[900],
                borderRadius: 12,
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
                    backgroundColor: Colors.accent[900],
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  <CText size="xs" color="accent" shade={200}>
                    {friend.givenName} {friend.familyName}
                  </CText>
                  <CText size="xs" color="accent" shade={200}>
                    x
                  </CText>
                </Pressable>
              );
            })}
          </View>
          </ScrollView>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={handleCancel}
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
