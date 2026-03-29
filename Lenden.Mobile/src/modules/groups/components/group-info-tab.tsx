import { View, ScrollView, Pressable, Image, Modal } from "react-native";
import React, { useState } from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { Feather } from "@expo/vector-icons";
import { useGetGroupQuery } from "@/src/shared/store/apiSlices/group-slice.api";
import { GroupMember } from "../types/group-member";
import { useSelector } from "react-redux";
import { RootState } from "@/src/shared/store/store";
import { selectCurrentUser } from "@/src/shared/store/slices/auth-slice";

const GroupInfoTab = ({ groupId }: { groupId: string }) => {
  const { data: group } = useGetGroupQuery(groupId as string);
  console.log("The Group Data is:", JSON.stringify(group, null, 2));
  const [text, setText] = useState("");
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(
    null,
  );
  const [menuMemberId, setMenuMemberId] = useState<string | null>(null);

  const currentUserId = useSelector(selectCurrentUser)?.slug;
  console.log("Current UserId", currentUserId);
  return (
    <>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          gap: 16,
          paddingHorizontal: 8,
          paddingBottom: 20,
        }}
      >
        <View style={{ gap: 8 }}>
          <View style={{ gap: 4 }}>
            <CText style={{ color: Colors.neutral[300] }} size="xs">
              Group Title
            </CText>
            <CText
              style={{ color: Colors.neutral[50] }}
              weight="medium"
              size="ssm"
            >
              {group.name}
            </CText>
          </View>
          <View style={{ gap: 4 }}>
            <CText style={{ color: Colors.neutral[300] }} size="xs">
              Description
            </CText>
            <CText
              style={{ color: Colors.neutral[50] }}
              weight="medium"
              size="ssm"
            >
              Vacationing with college friends in Japan
            </CText>
          </View>
          <View style={{ gap: 4 }}>
            <CText style={{ color: Colors.neutral[300] }} size="xs">
              Currency
            </CText>
            <CText
              style={{ color: Colors.neutral[50] }}
              weight="medium"
              size="ssm"
            >
              NRs
            </CText>
          </View>
          <View style={{ gap: 4 }}>
            <CText style={{ color: Colors.neutral[300] }} size="xs">
              Category
            </CText>
            <CText
              style={{ color: Colors.neutral[50] }}
              weight="medium"
              size="ssm"
            >
              Trip ✈️
            </CText>
          </View>
        </View>
        <View
          style={{
            width: "100%",
            height: 0.5,
            backgroundColor: Colors.neutral[700],
          }}
        />
        <View style={{ gap: 4 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CText weight="semibold" size="md" color="neutral" shade={100}>
              Group Members
            </CText>
            <Pressable
              style={{
                borderWidth: 1,
                borderColor: Colors.accent[500],
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
              }}
            >
              <CText weight="semibold" size="sm" color="neutral" shade={100}>
                + Add
              </CText>
            </Pressable>
          </View>
          <View style={{ gap: 8 }}>
            {group.members.map((item: GroupMember) => {
              const isYou = currentUserId && item.id === currentUserId;
              return (
                <View
                  key={item.id}
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 8,
                    position: "relative",
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 22,
                      borderWidth: 1,
                      borderColor: Colors.neutral[400],
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      source={{ uri: item.imgUrl ?? "" }}
                      resizeMode="cover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      flex: 1,
                    }}
                  >
                    <View>
                      <CText
                        color="neutral"
                        shade={300}
                        weight="semibold"
                        size="ssm"
                      >
                        {item.givenName} {item.familyName}
                        {isYou ? " (You)" : ""}
                      </CText>
                      <CText color="neutral" shade={400}>
                        {item.email}
                      </CText>
                    </View>
                    {!isYou && (
                      <Pressable
                        onPress={() => {
                          setMenuMemberId((prev) =>
                            prev === item.id ? null : item.id,
                          );
                        }}
                        style={{ paddingLeft: 8 }}
                      >
                        <Feather
                          name="more-vertical"
                          size={24}
                          color={Colors.neutral[200]}
                        />
                      </Pressable>
                    )}
                  </View>
                  {!isYou && menuMemberId === item.id && (
                    <View
                      style={{
                        position: "absolute",
                        right: 0,
                        top: 46,
                        backgroundColor: Colors.neutral[900],
                        borderColor: Colors.neutral[700],
                        borderWidth: 1,
                        borderRadius: 10,
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        zIndex: 10,
                        elevation: 6,
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          setMenuMemberId(null);
                          setSelectedMember(item);
                          setIsRemoveOpen(true);
                        }}
                      >
                        <CText color="warning" shade={300} size="sm">
                          Remove
                        </CText>
                      </Pressable>
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={isRemoveOpen}
        animationType="fade"
        onRequestClose={() => setIsRemoveOpen(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setIsRemoveOpen(false)}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
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
              Remove Member?
            </CText>
            <CText size="sm" color="neutral" shade={400}>
              {selectedMember?.givenName} {selectedMember?.familyName}
            </CText>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Pressable
                onPress={() => setIsRemoveOpen(false)}
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
                onPress={() => {
                  setIsRemoveOpen(false);
                }}
                style={{
                  flex: 1,
                  backgroundColor: Colors.warning[600],
                  padding: 10,
                  borderRadius: 10,
                  alignItems: "center",
                }}
              >
                <CText weight="bold" color="warning" shade={50}>
                  Remove
                </CText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default GroupInfoTab;
