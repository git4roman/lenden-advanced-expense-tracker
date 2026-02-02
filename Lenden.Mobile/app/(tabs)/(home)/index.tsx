import { View, Text, Image, FlatList } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import {
  Send2,
  DirectInbox,
  TableDocument,
  Eye,
  EyeSlash,
} from "iconsax-react-nativejs";

const activityMockData = [
  {
    date: "19 Jan",
    time: "12:00 AM",
    category: "Food and Beverages",
    description: "Roman and 3 others paid..",
    amount: "2000",
  },
  {
    date: "19 Jan",
    time: "08:45 AM",
    category: "Transport",
    description: "Roman paid for taxi",
    amount: "650",
  },
  {
    date: "19 Jan",
    time: "08:45 AM",
    category: "Transport",
    description: "Roman paid for taxi",
    amount: "650",
  },
];

const IconCover = ({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) => (
  <View
    style={{ justifyContent: "center", alignItems: "center", gap: 4, flex: 1 }}
  >
    <View
      style={{
        backgroundColor: Colors.warning[500],
        width: 44,
        height: 44,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 22,
      }}
    >
      {children}
    </View>
    {label && (
      <CText weight="medium" size="ssm">
        {label}
      </CText>
    )}
  </View>
);

const Header = () => (
  <View
    style={{
      flexDirection: "row",
      paddingHorizontal: 26,
      alignItems: "center",
    }}
  >
    <View style={{ flex: 1 }} />
    <CText weight="extrabold" italic size="xxlg">
      LENDEN
    </CText>
    <View style={{ flex: 1, alignItems: "flex-end" }}>
      <FontAwesome5 name="bell" size={24} />
    </View>
  </View>
);

const BalanceCard = () => (
  <View
    style={{
      height: 200,
      backgroundColor: Colors.primary[500],
      borderRadius: 24,
      // borderTopRightRadius: 14,
      padding: 16,
      justifyContent: "space-between",
    }}
  >
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "baseline",
        // borderWidth: 1,
      }}
    >
      <View
        style={{
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "row",
          gap: 8,
        }}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            borderWidth: 1,
            backgroundColor: Colors.secondary[500],
          }}
        ></View>
        <View>
          <CText weight="semibold" size="xmd">
            Hi,Roman !
          </CText>
          {/* <CText>
          A/C No.{" "}
          <CText size="md" weight="medium">
            0234668635
          </CText>
        </CText> */}

          <CText italic>Proud Lenden User</CText>
        </View>
      </View>

      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <View
          style={{
            justifyContent: "center",
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <CText
            weight="medium"
            size="ssm"
            color="primary"
            shade={900}
            style={{ textAlign: "center" }}
          >
            Net Balance
          </CText>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <CText weight="medium" size="md" style={{ lineHeight: 24 }}>
            NPR.{" "}
            <CText weight="semibold" size="xxlg" letterSpacing={1}>
              -398
              <CText weight="medium" size="ssm" letterSpacing={1}>
                .52
              </CText>
            </CText>
          </CText>
          <Eye size="20" color={Colors.primary[900]} />
        </View>
      </View>
    </View>

    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        // paddingHorizontal: 16,
        // borderWidth: 1,
        gap: 0,
        // width: "60%",
      }}
    >
      <IconCover label="Pay">
        <Send2 size="28" color={Colors.primary[200]} />
      </IconCover>
      <IconCover label="Request">
        <DirectInbox size="28" color={Colors.primary[200]} />
      </IconCover>
      <IconCover label="Statement">
        <TableDocument size="28" color={Colors.primary[200]} />
      </IconCover>
    </View>
  </View>
);

const ActivityItem = ({ item }: any) => (
  <View
    style={{
      flexDirection: "row",
      paddingVertical: 10,
      paddingLeft: 0,
      alignItems: "center",
    }}
  >
    <View
      style={{
        width: 65,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 6,
      }}
    >
      <CText>{item.date}</CText>
      <CText>{item.time}</CText>
    </View>

    <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          borderWidth: 1,
          marginRight: 8,
        }}
      />
      <View style={{ flex: 1 }}>
        <CText weight="medium" size="ssm">
          {item.category}
        </CText>
        <CText italic>{item.description}</CText>
      </View>
      <CText weight="medium" italic>
        NPR. {item.amount}
      </CText>
    </View>
  </View>
);

const HomeScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFEFA" }}>
      <Header />
      <View style={{ paddingHorizontal: 10 }}>
        <BalanceCard />
      </View>

      <View style={{ padding: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CText weight="semibold" size="xxmd">
            Activity
          </CText>
          <CText color="primary" shade={800} size="ssm">
            View All
          </CText>
        </View>
        <View style={{ paddingLeft: 0 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: Colors.primary[700],
              }}
            />
            <CText
              color="primary"
              shade={700}
              size="xmd"
              style={{ paddingHorizontal: 10 }}
            >
              Today
            </CText>
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: Colors.primary[700],
              }}
            />
          </View>
        </View>

        <FlatList
          data={activityMockData}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => <ActivityItem item={item} />}
        />
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;
