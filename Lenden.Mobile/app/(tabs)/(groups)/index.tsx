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

const groupsData = [
  {
    id: 1,
    label: "Kathmandu City",
    image: "https://picsum.photos/200/200?random=1",
    members: [
      "https://randomuser.me/api/portraits/men/32.jpg",
      "https://randomuser.me/api/portraits/women/45.jpg",
      "https://randomuser.me/api/portraits/women/25.jpg",
      "https://randomuser.me/api/portraits/men/25.jpg",
    ],
  },
  {
    id: 2,
    label: "Pokhara Hills",
    image: "https://picsum.photos/200/200?random=2",
    members: [
      "https://randomuser.me/api/portraits/men/12.jpg",
      "https://randomuser.me/api/portraits/women/15.jpg",
      "https://randomuser.me/api/portraits/men/23.jpg",
    ],
  },
  {
    id: 3,
    label: "Chitwan National Park",
    image: "https://picsum.photos/200/200?random=3",
    members: [
      "https://randomuser.me/api/portraits/women/34.jpg",
      "https://randomuser.me/api/portraits/men/54.jpg",
      "https://randomuser.me/api/portraits/women/44.jpg",
      "https://randomuser.me/api/portraits/men/14.jpg",
      "https://randomuser.me/api/portraits/women/22.jpg",
    ],
  },
  {
    id: 4,
    label: "Bhaktapur Durbar Square",
    image: "https://picsum.photos/200/200?random=4",
    members: [
      "https://randomuser.me/api/portraits/men/2.jpg",
      "https://randomuser.me/api/portraits/women/5.jpg",
      "https://randomuser.me/api/portraits/men/9.jpg",
    ],
  },
  {
    id: 5,
    label: "Lumbini Garden",
    image: "https://picsum.photos/200/200?random=5",
    members: [
      "https://randomuser.me/api/portraits/women/12.jpg",
      "https://randomuser.me/api/portraits/men/18.jpg",
      "https://randomuser.me/api/portraits/women/30.jpg",
      "https://randomuser.me/api/portraits/men/36.jpg",
    ],
  },
];

const groupButtonsLabel = ["label 1", "label 2", "label 3", "label 4"];

const GroupScreen = () => {
  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingHorizontal: 8,
        backgroundColor: Colors.neutral[800],
        gap: 16,
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
          paddingTop: 16,
          borderRadius: 8 + 8,
          flex: 1,
        }}
        contentContainerStyle={{ gap: 8 }}
      >
        {groupsData.map((group, index) => (
          <>
            <Pressable
              key={group.id}
              style={{
                flexDirection: "row",
                gap: 16,
                backgroundColor: Colors.neutral[800],
                // borderWidth: 1,
                borderRadius: 16,
                // borderColor: "transparent",
                justifyContent: "flex-start",
                alignItems: "center",
                paddingVertical: 12,
                paddingRight: 12,
              }}
              onPress={() => {
                console.log("Card is pressed");
              }}
            >
              <View
                style={{
                  width: 75,
                  height: 55,
                  borderWidth: 1,
                  borderColor: Colors.accent[600],
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
                <View style={{ gap: 4 }}>
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
                    <ArrowRight2 size="24" color={Colors.accent[500]} />
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
          </>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default GroupScreen;
