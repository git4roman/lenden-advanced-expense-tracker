import HeroSectionGenerativePattern from "@/assets/images/HeroSectionGenerativePatterns.png";
import { CText, ThemeColors } from "@/src/shared";
import { Href, router } from "expo-router";
import {
  MoneyRecive,
  Moneys,
  MoneySend,
  TableDocument,
} from "iconsax-react-nativejs";
import React from "react";
import { ImageBackground, Pressable, View } from "react-native";

const IconCover = ({
  Colors,
  children,
  label,
  path,
}: {
  Colors: ThemeColors;
  children: React.ReactNode;
  label: string;
  path: Href;
}) => (
  <Pressable
    onPress={() => {
      router.push(path);
    }}
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
  </Pressable>
);

export const BalanceCard = ({ Colors }: { Colors: ThemeColors }) => (
  <ImageBackground
    source={HeroSectionGenerativePattern}
    imageStyle={{ opacity: 0.5 }}
    style={{
      height: 180,
      backgroundColor: Colors.accent[500],
      borderRadius: 24,
      borderColor: Colors.primary[400],
      borderWidth: 1,
      // borderTopRightRadius: 14,
      padding: 12,
      justifyContent: "center",
      overflow: "hidden",
      gap: 32,
    }}
  >
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        flexDirection: "row",
        flex: 1,
      }}
    >
      <View
        style={{
          justifyContent: "center",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: Colors.accent[700],
          paddingVertical: 4,
          paddingHorizontal: 8,
          borderRadius: 999,
        }}
      >
        <CText
          weight="semibold"
          size="xs"
          color="neutral"
          shade={100}
          style={{ textAlign: "center" }}
        >
          Net Balance
        </CText>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <CText weight="medium" size="md" style={{ lineHeight: 24 }}>
          NPR.{" "}
          <CText weight="semibold" size="xlg" letterSpacing={1}>
            -398
            <CText weight="medium" size="ssm" letterSpacing={1}>
              .52
            </CText>
          </CText>
        </CText>
        {/* <Eye size="20" color={Colors.accent[900]} /> */}
      </View>
    </View>

    <View
      style={{
        flexDirection: "row",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <IconCover
        Colors={Colors}
        label="Expense"
        path="/(stack)/quickActions/expense"
      >
        <Moneys size={28} color={Colors.accent[200]} />
      </IconCover>
      <IconCover Colors={Colors} label="Pay" path="/(stack)/quickActions/pay">
        <MoneySend size={28} color={Colors.accent[200]} />
      </IconCover>
      <IconCover
        Colors={Colors}
        label="Request"
        path={{
          pathname: "/quickActions/request",
          params: { from: "home" },
        }}
      >
        <MoneyRecive size={28} color={Colors.accent[200]} />
      </IconCover>
      <IconCover
        Colors={Colors}
        label="Settlement"
        path={{
          pathname: "/quickActions/settlement",
          params: { from: "home" },
        }}
      >
        <TableDocument size={28} color={Colors.accent[200]} />
      </IconCover>
    </View>
  </ImageBackground>
);
