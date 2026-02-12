import {
  View,
  Image,
  Pressable,
  ScrollView,
  ImageBackground,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { ArrowRight2 } from "iconsax-react-nativejs";
import { router } from "expo-router";
import { groupsData } from "./groups.mock";

const availableMembers = ["Roman", "Aayush", "Sita", "Nabin", "Andrew"];

const GroupScreen = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupImageUri, setGroupImageUri] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  const handleCloseCreateGroup = () => {
    setIsCreateGroupOpen(false);
  };

  const toggleMember = (member: string) => {
    setSelectedMembers((prev) =>
      prev.includes(member)
        ? prev.filter((item) => item !== member)
        : [...prev, member],
    );
  };

  const handlePickImage = async (source: "camera" | "gallery") => {
    let ImagePicker: any;

    try {
      ImagePicker = require("expo-image-picker");
    } catch {
      Alert.alert(
        "Image Picker Missing"        
      );
      return;
    }

    try {
      const permission =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Needed",
          source === "camera"
            ? "Camera permission is required."
            : "Gallery permission is required.",
        );
        return;
      }

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync({
              quality: 0.8,
              allowsEditing: true,
              mediaTypes: ["images"],
            })
          : await ImagePicker.launchImageLibraryAsync({
              quality: 0.8,
              allowsEditing: true,
              mediaTypes: ["images"],
            });

      if (!result.canceled && result.assets?.[0]?.uri) {
        setGroupImageUri(result.assets[0].uri);
      }
    } catch {
      Alert.alert("Unable to Pick Image", "Please try again.");
    }
  };

  const handleCreateGroup = () => {
    console.log("Create Group", {
      groupName,
      groupImageUri,
      members: selectedMembers,
    });

    setGroupName("");
    setGroupImageUri("");
    setSelectedMembers([]);
    setIsCreateGroupOpen(false);
  };

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
        style={{
          paddingHorizontal: 8,
          borderRadius: 8 + 8,
          flex: 1,
        }}
        contentContainerStyle={{ gap: 4, paddingBottom: 90 }}
      >
        {groupsData.map((group, index) => (
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
              onPress={() => {
                router.push({
                  pathname: "/[groupId]",
                  params: { groupId: group.id },
                });
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
                <Image
                  source={{ uri: group.image }}
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
                <View style={{ gap: 10 }}>
                  <CText
                    weight="semibold"
                    size="md"
                    color="neutral"
                    shade={300}
                  >
                    {group.label}
                  </CText>
                  <View style={{ flexDirection: "row", gap: 0 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {group.members.slice(0, 3).map((member, index) => (
                        <View
                          key={index}
                          style={{
                            borderColor: Colors.accent[800],
                            width: 20,
                            height: 20,
                            borderWidth: 2,
                            borderRadius: 25,
                            overflow: "hidden",
                            marginLeft: index === 0 ? 0 : -6,
                          }}
                        >
                          <Image
                            source={{ uri: member }}
                            style={{ width: "100%", height: "100%" }}
                          />
                        </View>
                      ))}

                      {group.members.length > 3 && (
                        <ImageBackground
                          source={{ uri: group.members[2] }}
                          blurRadius={15}
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
                            overflow: "hidden",
                            opacity: 0.6,
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
                        </ImageBackground>
                      )}
                    </View>
                  </View>
                </View>
                <View style={{}}>
                  <Pressable onPress={() => console.log("first")} style={{}}>
                    <ArrowRight2 size="24" color={Colors.neutral[300]} />
                  </Pressable>
                </View>
              </View>
            </Pressable>
            {groupsData.length - 1 !== index && (
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
        ))}
      </ScrollView>
      <Pressable
        onPress={() => {
          setIsCreateGroupOpen(true);
        }}
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

      <Modal
        transparent
        animationType="fade"
        visible={isCreateGroupOpen}
        onRequestClose={handleCloseCreateGroup}
      >
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={handleCloseCreateGroup}
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
              top: "17%",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[800],
              padding: 14,
              gap: 12,
            }}
          >
            <CText weight="bold" size="xmd" color="neutral" shade={200}>
              Create Group
            </CText>

            <View style={{ gap: 6 }}>
              <CText size="xs" color="neutral" shade={500}>
                Group Name
              </CText>
              <TextInput
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Roommates, Trip Group..."
                placeholderTextColor={Colors.neutral[600]}
                style={{
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[900],
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  color: Colors.neutral[100],
                }}
              />
            </View>

            <View style={{ gap: 6 }}>
              <CText size="xs" color="neutral" shade={500}>
                Group Cover
              </CText>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[900],
                  borderRadius: 10,
                  padding: 10,
                  gap: 10,
                }}
              >
                {!!groupImageUri && (
                  <Image
                    source={{ uri: groupImageUri }}
                    style={{
                      width: "100%",
                      height: 130,
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                )}
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Pressable
                    onPress={() => {
                      handlePickImage("camera");
                    }}
                    style={{
                      flex: 1,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: Colors.neutral[600],
                      backgroundColor: Colors.neutral[800],
                      paddingVertical: 9,
                      alignItems: "center",
                    }}
                  >
                    <CText size="xs" color="neutral" shade={300}>
                      Take Photo
                    </CText>
                  </Pressable>
                  <Pressable
                    onPress={() => {
                      handlePickImage("gallery");
                    }}
                    style={{
                      flex: 1,
                      borderRadius: 8,
                      borderWidth: 1,
                      borderColor: Colors.neutral[600],
                      backgroundColor: Colors.neutral[800],
                      paddingVertical: 9,
                      alignItems: "center",
                    }}
                  >
                    <CText size="xs" color="neutral" shade={300}>
                      Use Gallery
                    </CText>
                  </Pressable>
                </View>
              </View>
            </View>

            <View style={{ gap: 6 }}>
              <CText size="xs" color="neutral" shade={500}>
                Members
              </CText>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                {availableMembers.map((member) => {
                  const isSelected = selectedMembers.includes(member);
                  return (
                    <Pressable
                      key={member}
                      onPress={() => {
                        toggleMember(member);
                      }}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderRadius: 999,
                        borderWidth: 1,
                        borderColor: isSelected
                          ? Colors.accent[500]
                          : Colors.neutral[700],
                        backgroundColor: isSelected
                          ? Colors.accent[900]
                          : Colors.neutral[900],
                      }}
                    >
                      <CText
                        size="xs"
                        color={isSelected ? "accent" : "neutral"}
                        shade={isSelected ? 300 : 300}
                      >
                        {member}
                      </CText>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 4 }}>
              <Pressable
                onPress={handleCloseCreateGroup}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: Colors.neutral[600],
                  backgroundColor: Colors.neutral[900],
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
              >
                <CText color="neutral" shade={300} weight="semibold">
                  Cancel
                </CText>
              </Pressable>

              <Pressable
                onPress={handleCreateGroup}
                style={{
                  flex: 1,
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: "center",
                  backgroundColor: Colors.accent[500],
                }}
              >
                <CText color="neutral" shade={900} weight="bold">
                  Create
                </CText>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default GroupScreen;
