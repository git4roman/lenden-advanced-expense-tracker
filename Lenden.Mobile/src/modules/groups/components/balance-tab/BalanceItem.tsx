import { CText, Colors } from "@/src/shared";
import { View } from "react-native";
import { Repayment } from "../../types";

export function BalanceItem({
  item,
  maxBalance,
  user,
  getMember,
}: {
  item: Repayment;
  maxBalance: any;
  user: any;
  getMember: (id: string) => {
    givenName: string;
    familyName: string;
    avatar: string;
  };
}) {
  const isPositive = item.amount > 0;
  const absBalance = Math.abs(item.amount);
  const minWidth = 55;
  const maxWidth = 90;
  const widthPercent =
    absBalance === 0
      ? minWidth
      : Math.floor(
          Math.max(
            minWidth,
            Math.min(maxWidth, (absBalance / maxBalance) * maxWidth),
          ),
        );

  const fromUser = getMember(item.from);

  return (
    <View style={{ flexDirection: isPositive ? "row" : "row-reverse" }}>
      <View style={{ flex: 1, padding: 8 }}>
        <View style={{ alignItems: isPositive ? "flex-end" : "stretch" }}>
          <CText shade={50} size="sm" letterSpacing={0.4}>
            {fromUser.givenName} {fromUser.familyName}
          </CText>
        </View>
      </View>
      <View
        style={{ flex: 1, alignItems: isPositive ? "flex-start" : "flex-end" }}
      >
        <View
          style={{
            width: `${widthPercent}%`,
            backgroundColor:
              absBalance === 0
                ? Colors.neutral[700]
                : isPositive
                  ? "green"
                  : "red",
            padding: 8,
            borderTopRightRadius: isPositive ? 8 : 0,
            borderBottomRightRadius: isPositive ? 8 : 0,
            borderTopLeftRadius: isPositive ? 0 : 8,
            borderBottomLeftRadius: isPositive ? 0 : 8,
            alignItems: isPositive ? "stretch" : "flex-end",
          }}
        >
          <CText shade={50} size="sm" letterSpacing={0.4}>
            {absBalance === 0
              ? `NPR ${absBalance} `
              : isPositive
                ? `+ NPR ${absBalance} `
                : `- NPR ${absBalance} `}
          </CText>
        </View>
      </View>
    </View>
  );
}
