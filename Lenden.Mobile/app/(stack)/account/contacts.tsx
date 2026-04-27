import { useEffect, useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  StatusBar,
} from "react-native";
import * as Contacts from "expo-contacts";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/src/shared/providers/ThemeProviders";
import { CText } from "@/src/shared/ui/components/CText";

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

export default function ContactsScreen() {
  const { Colors } = useTheme();
  const [contacts, setContacts] = useState<CleanContact[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<SelectedParticipant[]>([]);
  const [phonePickerContact, setPhonePickerContact] =
    useState<CleanContact | null>(null);

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
    // if already selected, deselect
    if (isSelected(contact.id)) {
      setSelected((prev) => prev.filter((s) => s.id !== contact.id));
      return;
    }
    // if only one phone, select directly
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
    // multiple phones — show picker
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

  console.log(
    "selected",
    selected.map(({ id, ...item }) => item),
  );

  const Avatar = ({ name, size = 42 }: { name: string; size?: number }) => (
    <View
      style={[
        styles.avatar,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: getAvatarColor(name),
        },
      ]}
    >
      <Text style={[styles.avatarText, { fontSize: size * 0.38 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: Colors.neutral[800] }]}
    >
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <CText size="md" weight="semibold" color="neutral" shade={200}>
          Select Contacts
        </CText>
        <CText weight="medium" size="md" color="primary" shade={500}>
          {selected.length} selected
        </CText>
      </View>

      {/* Search */}
      <View
        style={[styles.searchWrapper, { backgroundColor: Colors.neutral[700] }]}
      >
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.searchInput, { backgroundColor: Colors.neutral[700] }]}
          placeholder="Search contacts..."
          placeholderTextColor={Colors.neutral[600]}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Selected Participants */}
      {selected.length > 0 && (
        <View
          style={[
            styles.selectedSection,
            { borderBottomColor: Colors.neutral[500] },
          ]}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingTop: 10 }}
          >
            {selected.map((participant) => (
              <View key={participant.id} style={styles.selectedChip}>
                <Avatar name={participant.fullName} size={46} />
                <TouchableOpacity
                  style={styles.unselectBtn}
                  onPress={() => handleUnselect(participant.id)}
                >
                  <CText style={styles.unselectBtnText}>✕</CText>
                </TouchableOpacity>
                <CText color="neutral" shade={50} numberOfLines={1}>
                  {participant.fullName.split(" ")[0]}
                </CText>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Contact List */}
      <FlatList
        data={filteredContacts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const sel = isSelected(item.id);
          return (
            <TouchableOpacity
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: Colors.neutral[700],
                  borderRadius: 12,
                  padding: 12,
                  marginBottom: 8,
                  shadowColor: "#000",
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 1,
                },
                sel && {
                  backgroundColor: Colors.neutral[700],
                  borderWidth: 1.5,
                  borderColor: Colors.primary[500],
                },
              ]}
              onPress={() => handleContactPress(item)}
              activeOpacity={0.7}
            >
              <View style={styles.contactLeft}>
                <Avatar name={item.name} />
                <View style={styles.contactInfo}>
                  <CText
                    color="neutral"
                    shade={200}
                    size="ssm"
                    weight="semibold"
                  >
                    {item.name}
                  </CText>
                  <CText color="neutral" shade={300} size="ssm">
                    {item.phones[0] || item.emails[0] || "No details"}
                    {item.phones.length > 1 && (
                      <CText size="sm" color="primary" shade={500}>
                        {" "}
                        +{item.phones.length - 1} more
                      </CText>
                    )}
                  </CText>
                </View>
              </View>
              <View
                style={[
                  {
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    borderWidth: 2,
                    borderColor: Colors.neutral[500],
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  sel && {
                    backgroundColor: Colors.primary[500],
                    borderColor: Colors.primary[500],
                  },
                ]}
              >
                {sel && (
                  <CText weight="medium" color="primary" shade={100}>
                    ✓
                  </CText>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
      />

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
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "flex-end",
          }}
          activeOpacity={1}
          onPress={() => setPhonePickerContact(null)}
        >
          <View
            style={{
              backgroundColor: Colors.neutral[700],
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingHorizontal: 20,
              paddingBottom: 32,
              paddingTop: 12,
            }}
          >
            <View style={styles.modalHandle} />
            {phonePickerContact && (
              <>
                <View style={styles.modalHeader}>
                  <Avatar name={phonePickerContact.name} size={48} />
                  <View style={{ marginLeft: 12 }}>
                    <CText weight="semibold" size="ssm">
                      {phonePickerContact.name}
                    </CText>
                    <Text style={styles.modalSubtitle}>
                      Select a phone number
                    </Text>
                  </View>
                </View>
                {phonePickerContact.phones.map((phone, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.phoneOption}
                    onPress={() => handlePhonePick(phonePickerContact, phone)}
                  >
                    <Text style={styles.phoneOptionIcon}>📞</Text>
                    <CText style={styles.phoneOptionText}>{phone}</CText>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => setPhonePickerContact(null)}
                >
                  <CText weight="semibold" color="neutral" size="ssm">
                    Cancel
                  </CText>
                </TouchableOpacity>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6C63FF",
    fontWeight: "600",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A2E",
  },
  clearIcon: {
    fontSize: 14,
    color: "#aaa",
    paddingHorizontal: 4,
  },
  selectedSection: {
    paddingVertical: 10,
    paddingLeft: 16,
    borderBottomWidth: 1,
    marginBottom: 4,
  },
  selectedChip: {
    alignItems: "center",
    marginRight: 14,
    width: 70,
  },
  chipName: {
    fontSize: 11,
    color: "#444",
    marginTop: 4,
    textAlign: "center",
    maxWidth: 56,
  },
  unselectBtn: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF4757",
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  unselectBtnText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "700",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  contactRow: {},
  contactRowSelected: {
    backgroundColor: "#F0EEFF",
    borderWidth: 1.5,
    borderColor: "#6C63FF",
  },
  contactLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  contactInfo: {
    marginLeft: 12,
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1A1A2E",
  },
  contactSub: {},
  morePhones: {
    color: "#6C63FF",
    fontWeight: "600",
  },
  checkbox: {},
  checkboxSelected: {
    backgroundColor: "#6C63FF",
    fontSize: 12,
    fontWeight: "700",
  },
  avatar: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "700",
  },
  modalOverlay: {},
  modalSheet: {},
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#DDD",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A2E",
  },
  modalSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  phoneOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  phoneOptionIcon: {
    fontSize: 18,
    marginRight: 14,
  },
  phoneOptionText: {
    fontSize: 16,
    color: "#1A1A2E",
    fontWeight: "500",
  },
  cancelBtn: {
    marginTop: 12,
    backgroundColor: "#F7F8FA",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelBtnText: {},
});
