import { CText, Colors } from "@/src/shared";
import { router } from "expo-router";
import { Pressable, View } from "react-native";
import { ActivityItem } from "../activity-item";

export const Expensecard = ({ item: expense }: { item: any }) => {
  console.log("Item render group", expense);
  return (
    <View style={{ gap: 10, marginBottom: 12 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "100%",
          marginBottom: 4,
        }}
      >
        <CText
          color="neutral"
          shade={400}
          size="ssm"
          weight="medium"
          style={{ paddingHorizontal: 10 }}
        >
          {expense.date}
        </CText>
        <View
          style={{ flex: 1, height: 1, backgroundColor: Colors.neutral[700] }}
        />
      </View>

      <View style={{ borderRadius: 10, gap: 10 }}>
        <Pressable
          key={`${expense.date}}`}
          onPress={() =>
            router.push({
              pathname: "/(stack)/groups/[groupId]/details",
              params: {
                groupId: expense.groupId,
              },
            })
          }
          style={{
            backgroundColor: Colors.neutral[800],
            borderWidth: 1,
            borderRadius: 12,
            borderColor: Colors.neutral[700],
            marginHorizontal: 10,
            paddingHorizontal: 10,
          }}
        >
          <ActivityItem item={expense} />
        </Pressable>
        ))
      </View>
    </View>
  );
};
