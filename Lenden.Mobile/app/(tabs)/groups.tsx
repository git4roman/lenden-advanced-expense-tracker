import { CreateGroupModal } from "@/src/modules/groups";
import {
  CText,
  Colors,
  GroupWithExpenses,
  RootState,
  getColorFromString,
  getInitials,
  useGetGroupsQuery,
} from "@/src/shared";
import { router } from "expo-router";
import { ArrowRight2 } from "iconsax-react-nativejs";
import React, { useCallback, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSelector } from "react-redux";

const GroupScreen = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<GroupWithExpenses | null>(
    null,
  );
  const [isGroupActionOpen, setIsGroupActionOpen] = useState(false);

  const { data, refetch, isFetching } = useGetGroupsQuery();

  // const {
  //   handleDeleteGroup,
  //   handleLeaveGroup,
  //   isDeleteGroupLoading: isDeletingGroup,
  //   isLeaveGroupLoading: isLeavingGroup,
  // } = useGroupHandler();

  const groups: GroupWithExpenses[] = useSelector(
    (state: RootState) => state.groups,
  );

  console.log("groups", JSON.stringify(groups, null, 3));

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 8,
        backgroundColor: Colors.neutral[900],
        gap: 4,
        position: "relative",
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <CText weight="bold" size="xmd" color="neutral" shade={300}>
          Groups
        </CText>
      </View>

      <ScrollView
        style={{ paddingHorizontal: 8, borderRadius: 16, flex: 1 }}
        contentContainerStyle={{ gap: 4, paddingBottom: 90 }}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={onRefresh}
            tintColor={Colors.neutral[200]}
            colors={[Colors.accent[400]]}
          />
        }
      >
        {!groups || groups?.length === 0 ? (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              marginVertical: 250,
            }}
          >
            <CText color="primary" shade={200} size="xlg">
              No Groups Available
            </CText>
          </View>
        ) : (
          groups.map((group: GroupWithExpenses, index: number) => (
            <React.Fragment key={group.id}>
              <Pressable
                style={{
                  flexDirection: "row",
                  gap: 16,
                  backgroundColor: Colors.neutral[900],
                  borderRadius: 16,
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingVertical: 12,
                  paddingRight: 12,
                }}
                onPress={() =>
                  router.push({
                    pathname: "/(stack)/groups/[groupId]",
                    params: { groupId: group.id },
                  })
                }
                onLongPress={() => {
                  setSelectedGroup(group);
                  setIsGroupActionOpen(true);
                }}
              >
                <View
                  style={{
                    width: 100,
                    height: 70,
                    borderWidth: 1,
                    borderColor: Colors.neutral[600],
                    borderRadius: 8,
                    overflow: "hidden",
                  }}
                >
                  {group.coverPhoto ? (
                    <Image
                      source={{ uri: group.coverPhoto }}
                      resizeMode="cover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        backgroundColor: getColorFromString(group.name),
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <CText weight="bold" size="lg" color="neutral" shade={50}>
                        {getInitials(group.name)}
                      </CText>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flex: 1,
                  }}
                >
                  <View style={{ gap: 10 }}>
                    <CText
                      weight="semibold"
                      size="md"
                      color="neutral"
                      shade={300}
                    >
                      {group.name}
                    </CText>

                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      {group.members.slice(0, 3).map((member, i) => (
                        <View
                          key={i}
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 25,
                            borderWidth: 2,
                            borderColor: Colors.accent[800],
                            overflow: "hidden",
                            marginLeft: i === 0 ? 0 : -6,
                            backgroundColor: Colors.neutral[200],
                          }}
                        >
                          <Image
                            source={{ uri: member.avatar }}
                            style={{ width: "100%", height: "100%" }}
                            resizeMode="cover"
                          />
                        </View>
                      ))}

                      {group.members.length > 3 && (
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 25,
                            backgroundColor: Colors.neutral[700],
                            justifyContent: "center",
                            alignItems: "center",
                            marginLeft: -6,
                            borderWidth: 2,
                            borderColor: Colors.accent[800],
                          }}
                        >
                          <CText
                            size="xs"
                            weight="semibold"
                            color="neutral"
                            shade={50}
                          >
                            +{group.members.length - 3}
                          </CText>
                        </View>
                      )}
                    </View>
                  </View>

                  <ArrowRight2 size="24" color={Colors.neutral[300]} />
                </View>
              </Pressable>

              {(groups ?? []).length - 1 !== index && (
                <View
                  style={{
                    width: "100%",
                    height: 1,
                    backgroundColor: Colors.neutral[700],
                    alignSelf: "center",
                  }}
                />
              )}
            </React.Fragment>
          ))
        )}
      </ScrollView>

      <Pressable
        onPress={() => setIsCreateGroupOpen(true)}
        style={{
          backgroundColor: Colors.accent[500],
          position: "absolute",
          bottom: 20,
          right: 18,
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderRadius: 18,
        }}
      >
        <CText weight="bold" size="md">
          + Create Group
        </CText>
      </Pressable>

      <CreateGroupModal
        visible={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        members={[]}
      />

      <Modal
        transparent
        visible={isGroupActionOpen}
        animationType="fade"
        onRequestClose={() => setIsGroupActionOpen(false)}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setIsGroupActionOpen(false)}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.45)",
            }}
          />

          <View
            style={{
              position: "absolute",
              bottom: 20,
              left: 12,
              right: 12,
              backgroundColor: Colors.neutral[800],
              borderRadius: 16,
              padding: 14,
              gap: 10,
              borderWidth: 1,
              borderColor: Colors.neutral[700],
            }}
          >
            <CText weight="bold" size="md" shade={200}>
              {selectedGroup?.name}
            </CText>

            <Pressable
              onPress={() => {}}
              style={{
                borderWidth: 1,
                borderColor: Colors.neutral[600],
                padding: 12,
                borderRadius: 10,
                alignItems: "center",
                opacity: 1,
              }}
            >
              <CText weight="bold" color="neutral" shade={300}>
                {"Leave Group"}
              </CText>
            </Pressable>

            <Pressable
              onPress={() => {}}
              style={{
                backgroundColor: Colors.warning[900],
                borderWidth: 1,
                borderColor: Colors.warning[700],
                padding: 12,
                borderRadius: 10,
                alignItems: "center",
                opacity: 1,
              }}
            >
              <CText weight="bold" color="warning" shade={300}>
                {"Delete Group"}
              </CText>
            </Pressable>

            <Pressable
              onPress={() => setIsGroupActionOpen(false)}
              style={{
                borderWidth: 1,
                borderColor: Colors.neutral[600],
                padding: 12,
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <CText shade={300}>Cancel</CText>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GroupScreen;
