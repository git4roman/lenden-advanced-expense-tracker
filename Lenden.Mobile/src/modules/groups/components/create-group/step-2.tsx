import { useEffect, useState, useMemo } from "react";
import {
  View,
  Pressable,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import * as Contacts from "expo-contacts";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";

type CleanContact = {
  id: string;
  name: string;
  phones: string[];
  emails: string[];
  organization?: string;
  jobTitle?: string;
};

type SelectedParticipant = {
  id: string;
  fullName: string;
  phone: string;
  email: string;
};

const normalizePhone = (num?: string): string => {
  if (!num) return "";
  return num.replace(/\+977/, "").replace(/\D/g, "").slice(-10);
};

const deduplicatePhones = (phoneNumbers: Contacts.PhoneNumber[]): string[] => {
  const seen = new Set<string>();
  for (const p of phoneNumbers) {
    const normalized = normalizePhone(p.number);
    if (normalized.length === 10) seen.add(normalized);
  }
  return Array.from(seen);
};

const normalizeEmail = (email?: string): string => {
  if (!email) return "";
  return email.toLowerCase().trim();
};

const deduplicateEmails = (emailList: Contacts.Email[]): string[] => {
  const seen = new Set<string>();
  for (const e of emailList) {
    const normalized = normalizeEmail(e.email);
    if (normalized) seen.add(normalized);
  }
  return Array.from(seen);
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase() || "?";
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AVATAR_COLORS = [
  "#E57373",
  "#F06292",
  "#BA68C8",
  "#7986CB",
  "#4FC3F7",
  "#4DB6AC",
  "#81C784",
  "#FFB74D",
  "#FF8A65",
  "#A1887F",
];

const getAvatarColor = (name: string): string => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const StepAddMembers = ({
  onBack,
  onCreateGroup,
}: {
  onBack: () => void;
  onCreateGroup: (memberIds: string[]) => void;
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedParticipant[]>([]);
  const [contacts, setContacts] = useState<CleanContact[]>([]);
  const [phonePickerContact, setPhonePickerContact] =
    useState<CleanContact | null>(null);

  // Load contacts from device
  const loadContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== "granted") return;

    const { data } = await Contacts.getContactsAsync({
      fields: Object.values(Contacts.Fields),
      pageSize: 1000,
    });

    const map = new Map<string, CleanContact>();
    for (const c of data) {
      const phones = deduplicatePhones(c.phoneNumbers || []);
      const emails = deduplicateEmails(c.emails || []);

      if (phones.length === 0 && emails.length === 0) continue;

      const key = phones[0] || emails[0] || c.id;
      if (!map.has(key)) {
        map.set(key, {
          id: c.id,
          name: c.name || "No Name",
          phones,
          emails,
          organization: c.organization,
          jobTitle: c.jobTitle,
        });
      } else {
        const existing = map.get(key)!;
        map.set(key, {
          ...existing,
          phones: Array.from(new Set([...existing.phones, ...phones])),
          emails: Array.from(new Set([...existing.emails, ...emails])),
        });
      }
    }

    const sorted = Array.from(map.values()).sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    );
    setContacts(sorted);
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    if (!search.trim()) return contacts;
    return contacts.filter((c) =>
      c.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [contacts, search]);

  const isSelected = (id: string) => selected.some((s) => s.id === id);

  const handleContactPress = (contact: CleanContact) => {
    if (isSelected(contact.id)) {
      setSelected((prev) => prev.filter((s) => s.id !== contact.id));
      return;
    }

    if (contact.phones.length <= 1) {
      setSelected((prev) => [
        ...prev,
        {
          id: contact.id,
          fullName: contact.name,
          phone: contact.phones[0] || "",
          email: contact.emails[0] || "",
        },
      ]);
      return;
    }

    // Show phone picker if multiple numbers
    setPhonePickerContact(contact);
  };

  const handlePhonePick = (contact: CleanContact, phone: string) => {
    setSelected((prev) => [
      ...prev,
      {
        id: contact.id,
        fullName: contact.name,
        phone,
        email: contact.emails[0] || "",
      },
    ]);
    setPhonePickerContact(null);
  };

  const handleUnselect = (id: string) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
  };

  const handleCreateGroup = () => {
    const memberIds = selected.map((s) => s.id);
    onCreateGroup(memberIds);
  };

  // Reusable Avatar Component
  const Avatar = ({ name, size = 38 }: { name: string; size?: number }) => (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: getAvatarColor(name),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CText size="xs" weight="bold" color="neutral" shade={100}>
        {getInitials(name)}
      </CText>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.neutral[900] }}>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 20,
          paddingBottom: 12,
          borderBottomWidth: 1,
          borderBottomColor: Colors.neutral[700],
          flexDirection: "row",
          alignItems: "center",
          gap: 12,
        }}
      >
        <View style={{ gap: 2 }}>
          <CText weight="bold" size="xmd" color="neutral" shade={100}>
            Add Members
          </CText>
          <CText size="ssm" color="neutral" shade={500}>
            Step 2 of 2 — {selected.length} selected
          </CText>
        </View>
      </View>

      {/* Search */}
      <View style={{ padding: 16, gap: 8 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search contacts..."
          placeholderTextColor={Colors.neutral[500]}
          style={{
            backgroundColor: Colors.neutral[800],
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingVertical: 13,
            color: Colors.neutral[100],
            borderWidth: 1,
            borderColor: Colors.neutral[700],
            fontSize: 14,
          }}
        />
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 20,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Selected Members - Horizontal Circular Chips */}
        {selected.length > 0 && (
          <View
            style={{
              paddingVertical: 12,
              borderBottomWidth: 1,
              borderBottomColor: Colors.neutral[700],
              marginBottom: 16,
            }}
          >
            <CText
              size="xs"
              color="neutral"
              shade={400}
              weight="semibold"
              style={{ marginBottom: 10, paddingHorizontal: 4 }}
            >
              Selected
            </CText>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ paddingVertical: 4 }}
            >
              {selected.map((participant) => (
                <View
                  key={participant.id}
                  style={{
                    alignItems: "center",
                    // marginRight: 18,
                    width: 78,
                  }}
                >
                  <View style={{ position: "relative", marginBottom: 6 }}>
                    <Avatar name={participant.fullName} size={56} />

                    {/* Cross Button */}
                    <Pressable
                      onPress={() => handleUnselect(participant.id)}
                      style={{
                        position: "absolute",
                        top: -6,
                        right: -6,
                        backgroundColor: Colors.neutral[200],
                        borderRadius: 12,
                        width: 26,
                        height: 26,
                        alignItems: "center",
                        justifyContent: "center",
                        borderWidth: 3,
                        borderColor: Colors.neutral[900],
                      }}
                    >
                      <CText
                        size="xs"
                        weight="bold"
                        color="warning"
                        shade={500}
                      >
                        ✕
                      </CText>
                    </Pressable>
                  </View>

                  <CText
                    size="xs"
                    color="neutral"
                    shade={300}
                    numberOfLines={1}
                    style={{ textAlign: "center", maxWidth: 70 }}
                  >
                    {participant.fullName.split(" ")[0]}
                  </CText>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Contacts List */}
        <View style={{ gap: 8 }}>
          <CText size="xs" color="neutral" shade={400} weight="semibold">
            Contacts
          </CText>
          <View
            style={{
              backgroundColor: Colors.neutral[800],
              borderRadius: 14,
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              overflow: "hidden",
            }}
          >
            {filteredContacts.map((contact, index) => {
              const sel = isSelected(contact.id);
              return (
                <Pressable
                  key={contact.id}
                  onPress={() => handleContactPress(contact)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingHorizontal: 14,
                    paddingVertical: 14,
                    borderBottomWidth:
                      index < filteredContacts.length - 1 ? 1 : 0,
                    borderBottomColor: Colors.neutral[700],
                    backgroundColor: sel ? Colors.accent[900] : "transparent",
                  }}
                >
                  <Avatar name={contact.name} />

                  <View style={{ flex: 1 }}>
                    <CText size="sm" color="neutral" shade={200}>
                      {contact.name}
                    </CText>
                    <CText size="xs" color="neutral" shade={500}>
                      {contact.phones[0] ||
                        contact.emails[0] ||
                        "No contact info"}
                      {contact.phones.length > 1 && (
                        <CText color="accent" shade={400}>
                          {" "}
                          +{contact.phones.length - 1} more
                        </CText>
                      )}
                    </CText>
                  </View>

                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 2,
                      borderColor: sel
                        ? Colors.accent[500]
                        : Colors.neutral[600],
                      backgroundColor: sel ? Colors.accent[500] : "transparent",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {sel && (
                      <CText size="xs" color="neutral" shade={100}>
                        ✓
                      </CText>
                    )}
                  </View>
                </Pressable>
              );
            })}

            {filteredContacts.length === 0 && (
              <View style={{ padding: 40, alignItems: "center" }}>
                <CText size="lg">📇</CText>
                <CText
                  size="sm"
                  color="neutral"
                  shade={500}
                  style={{ marginTop: 8 }}
                >
                  No contacts found
                </CText>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View
        style={{
          gap: 10,
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: Colors.neutral[700],
        }}
      >
        <Pressable
          onPress={handleCreateGroup}
          style={{
            backgroundColor: Colors.accent[500],
            padding: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <CText weight="bold">
            Create Group
            {selected.length > 0 ? ` (${selected.length})` : ""}
          </CText>
        </Pressable>

        <Pressable
          onPress={onBack}
          style={{
            borderWidth: 1,
            borderColor: Colors.neutral[600],
            padding: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <CText shade={300}>Back</CText>
        </Pressable>
      </View>

      {/* Phone Picker Modal */}
      <Modal
        visible={!!phonePickerContact}
        transparent
        animationType="slide"
        onRequestClose={() => setPhonePickerContact(null)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.6)",
            justifyContent: "flex-end",
          }}
          activeOpacity={1}
          onPress={() => setPhonePickerContact(null)}
        >
          <View
            style={{
              backgroundColor: Colors.neutral[800],
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingBottom: 40,
              paddingTop: 12,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                backgroundColor: Colors.neutral[600],
                borderRadius: 2,
                alignSelf: "center",
                marginBottom: 20,
              }}
            />

            {phonePickerContact && (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <Avatar name={phonePickerContact.name} size={52} />
                  <View style={{ marginLeft: 16 }}>
                    <CText size="sm" weight="bold" color="neutral" shade={100}>
                      {phonePickerContact.name}
                    </CText>
                    <CText size="xs" color="neutral" shade={500}>
                      Select a phone number
                    </CText>
                  </View>
                </View>

                {phonePickerContact.phones.map((phone, index) => (
                  <Pressable
                    key={index}
                    onPress={() => handlePhonePick(phonePickerContact, phone)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 16,
                      borderTopWidth: index > 0 ? 1 : 0,
                      borderTopColor: Colors.neutral[700],
                    }}
                  >
                    <CText size="lg" style={{ marginRight: 12 }}>
                      📞
                    </CText>
                    <CText size="sm" color="neutral" shade={100}>
                      {phone}
                    </CText>
                  </Pressable>
                ))}

                <Pressable
                  onPress={() => setPhonePickerContact(null)}
                  style={{
                    marginTop: 16,
                    padding: 14,
                    alignItems: "center",
                    backgroundColor: Colors.neutral[700],
                    borderRadius: 12,
                  }}
                >
                  <CText shade={300}>Cancel</CText>
                </Pressable>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default StepAddMembers;
