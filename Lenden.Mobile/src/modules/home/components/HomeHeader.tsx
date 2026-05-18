import { CText, ThemeColors } from "@/src/shared";
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import { Profile } from "iconsax-react-nativejs";
import { Pressable, View } from "react-native";

export const Header = ({ Colors }: { Colors: ThemeColors }) => (
  <View
    style={{
      flexDirection: "row",
      // paddingHorizontal: 16,
      paddingBottom: 12,
      alignItems: "center",
    }}
  >
    {/* <View style={{ flex: 1 }} /> */}
    <View
      style={{
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 6,
        flex: 1,
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 19,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: Colors.neutral[100],
        }}
      >
        <Profile size={32} color={Colors.accent[500]} />
      </View>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <CText weight="semibold" size="md">
          Hi,Roman !
        </CText>
        <CText italic size="xs">
          Proud Lenden User
        </CText>
      </View>
    </View>
    <View style={{ flex: 1, alignItems: "flex-end", marginRight: 10 }}>
      <Pressable onPress={() => router.push("/(stack)/home/notification")}>
        <FontAwesome5 name="bell" size={24} color={Colors.accent[800]} />
      </Pressable>
    </View>
  </View>
);
