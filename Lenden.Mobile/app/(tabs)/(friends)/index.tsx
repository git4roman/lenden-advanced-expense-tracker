import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Contacts from "expo-contacts";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";

type Friend = {
  id: string;
  name: string;
  username: string;
  balance: string;
  status: "settled" | "you-owe" | "owes-you";
};

type SyncedContact = {
  id: string;
  name: string;
  phone: string;
};

const mockFriends: Friend[] = [
  {
    id: "f1",
    name: "Aayush Shrestha",
    username: "@aayush",
    balance: "You owe NPR 520",
    status: "you-owe",
  },
  {
    id: "f2",
    name: "Sujita Karki",
    username: "@sujita",
    balance: "Settled up",
    status: "settled",
  },
  {
    id: "f3",
    name: "Nabin Gurung",
    username: "@nabin",
    balance: "Owes you NPR 1,250",
    status: "owes-you",
  },
  {
    id: "f4",
    name: "Ramesh Rai",
    username: "@ramesh",
    balance: "You owe NPR 240",
    status: "you-owe",
  },
  {
    id: "f5",
    name: "Asmita KC",
    username: "@asmita",
    balance: "Owes you NPR 360",
    status: "owes-you",
  },
];

const getStatusColor = (status: Friend["status"]) => {
  if (status === "you-owe") return Colors.warning[500];
  if (status === "owes-you") return Colors.success[500];
  return Colors.neutral[500];
};

const normalizePhone = (value: string) => value.replace(/[^\d+]/g, "");

const FriendsScreen = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedContacts, setSyncedContacts] = useState<SyncedContact[]>([]);

  const totalFriends = mockFriends.length;

  const unsettledCount = useMemo(
    () => mockFriends.filter((friend) => friend.status !== "settled").length,
    [],
  );

  const handleSyncContacts = async () => {
    try {
      setIsSyncing(true);

      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Contacts permission needed",
          "Allow contacts permission to sync your saved contacts.",
        );
        return;
      }

      const response = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      const mappedContacts: SyncedContact[] = response.data
        .filter((contact) => contact.name && contact.phoneNumbers?.length)
        .map((contact) => ({
          id: contact.id,
          name: contact.name ?? "Unknown",
          phone: normalizePhone(contact.phoneNumbers?.[0]?.number ?? ""),
        }))
        .filter((contact) => contact.phone.length > 0);

      const uniqueByPhone = Array.from(
        new Map(mappedContacts.map((item) => [item.phone, item])).values(),
      );

      setSyncedContacts(uniqueByPhone.slice(0, 50));
    } catch {
      Alert.alert("Sync failed", "Unable to load contacts. Please try again.");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral[900] }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16, gap: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 4 }}>
          <CText size="xmd" color="neutral" shade={200} weight="bold">
            Friends
          </CText>
          <CText size="ssm" color="neutral" shade={500}>
            Manage friends and discover people from your contacts.
          </CText>
        </View>

        <View
          style={{
            backgroundColor: Colors.neutral[800],
            borderWidth: 1,
            borderColor: Colors.neutral[700],
            borderRadius: 12,
            padding: 12,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <CText size="sm" color="neutral" shade={200} weight="semibold">
                Your Network
              </CText>
              <CText size="ssm" color="neutral" shade={500}>
                {totalFriends} friends, {unsettledCount} unsettled balances
              </CText>
            </View>
          </View>

          <Pressable
            onPress={handleSyncContacts}
            style={{
              backgroundColor: Colors.accent[500],
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 12,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: 8,
            }}
          >
            {isSyncing ? (
              <ActivityIndicator color={Colors.neutral[900]} size="small" />
            ) : (
              <Ionicons name="sync" size={16} color={Colors.neutral[900]} />
            )}
            <CText size="sm" color="neutral" shade={900} weight="bold">
              {isSyncing ? "Syncing contacts..." : "Sync Mobile Contacts"}
            </CText>
          </Pressable>
        </View>

        <View style={{ gap: 10 }}>
          <CText size="sm" color="neutral" shade={300} weight="semibold">
            Friends List
          </CText>
          {mockFriends.map((friend) => (
            <View
              key={friend.id}
              style={{
                borderWidth: 1,
                borderColor: Colors.neutral[700],
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 12,
                backgroundColor: Colors.neutral[800],
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flexDirection: "row", gap: 10, alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: Colors.accent[900],
                  }}
                >
                  <CText size="ssm" color="accent" shade={400} weight="bold">
                    {friend.name.charAt(0)}
                  </CText>
                </View>

                <View style={{ flex: 1 }}>
                  <CText size="sm" color="neutral" shade={200} weight="semibold">
                    {friend.name}
                  </CText>
                  <CText size="xs" color="neutral" shade={500}>
                    {friend.username}
                  </CText>
                </View>
              </View>

              <CText
                size="xs"
                color={getStatusColor(friend.status)}
                style={{ textAlign: "right" }}
                weight="semibold"
              >
                {friend.balance}
              </CText>
            </View>
          ))}
        </View>

        <View style={{ gap: 10, paddingBottom: 24 }}>
          <CText size="sm" color="neutral" shade={300} weight="semibold">
            Synced Contacts {syncedContacts.length > 0 ? `(${syncedContacts.length})` : ""}
          </CText>

          {syncedContacts.length === 0 ? (
            <View
              style={{
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: Colors.neutral[700],
                borderRadius: 12,
                paddingVertical: 16,
                paddingHorizontal: 12,
              }}
            >
              <CText size="ssm" color="neutral" shade={500}>
                No contacts synced yet. Tap "Sync Mobile Contacts" to import saved contacts.
              </CText>
            </View>
          ) : (
            syncedContacts.map((contact) => (
              <View
                key={contact.id}
                style={{
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  borderRadius: 12,
                  paddingVertical: 10,
                  paddingHorizontal: 12,
                  backgroundColor: Colors.neutral[800],
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1 }}>
                  <CText size="sm" color="neutral" shade={200} weight="semibold">
                    {contact.name}
                  </CText>
                  <CText size="xs" color="neutral" shade={500}>
                    {contact.phone}
                  </CText>
                </View>

                <Pressable
                  onPress={() => {}}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: Colors.neutral[600],
                  }}
                >
                  <CText size="xs" color="neutral" shade={300} weight="semibold">
                    Invite
                  </CText>
                </Pressable>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FriendsScreen;
