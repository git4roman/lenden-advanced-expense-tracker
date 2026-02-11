import {
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  ImageBackground,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { ArrowRight2, More } from "iconsax-react-nativejs";
import { router } from "expo-router";
import { groupsData } from "./groups.mock";

const GroupScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 8,
        backgroundColor: Colors.neutral[900],
        gap: 4,
      }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <CText weight="bold" size="xmd" color="neutral" shade={300}>
          Groups
        </CText>
      </View>
      {/* <View
        style={{
          flexDirection: "row",
          gap: 4,
          justifyContent: "space-between",
        }}
      >
        {groupButtonsLabel.map((item, index) => (
          <Pressable
            style={{
              backgroundColor: Colors.neutral[400],
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 8,
            }}
            onPress={() => {
              console.log("first");
            }}
          >
            <CText weight="semibold" size="md" color="neutral" shade={800}>
              {item}
            </CText>
          </Pressable>
        ))}
      </View> */}
      <ScrollView
        style={{
          //   backgroundColor: Colors.neutral[900],
          paddingHorizontal: 8,
          //   paddingTop: 16,
          borderRadius: 8 + 8,
          flex: 1,
        }}
        contentContainerStyle={{ gap: 4 }}
      >
        {groupsData.map((group, index) => (
          <React.Fragment key={group.id}>
            <Pressable
              style={{
                flexDirection: "row",
                gap: 16,
                backgroundColor: Colors.neutral[900],
                // borderWidth: 1,
                borderRadius: 16,
                // borderColor: "transparent",
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
                  // gap: 16,
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
    </SafeAreaView>
  );
};

export default GroupScreen;
