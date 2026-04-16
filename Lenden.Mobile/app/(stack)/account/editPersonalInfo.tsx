import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, TextInput, View } from "react-native";
import { useSelector } from "react-redux";
import { router } from "expo-router";
import { RootState } from "@/src/shared/store/store";
import { Colors } from "@/src/shared/ui/theme/colors";
import { CText } from "@/src/shared/ui/components/CText";
import {
  useMeQuery,
  useUpdatePersonalInfoMutation,
} from "@/src/shared/store/apiSlices/user-api-slice";
import { selectCurrentUser } from "@/src/shared/store/slices/auth-slice";

const EditPersonalInfo = () => {
  const { data: userInfo } = useMeQuery();
  const currentUser = useSelector(selectCurrentUser);
  const [updatePersonalInfo, { isLoading }] = useUpdatePersonalInfoMutation();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [form, setForm] = useState({
    givenName: "",
    familyName: "",
    username: "",
    email: "",
    phoneNumber: "",
  });

  useEffect(() => {
    setForm({
      givenName: userInfo?.givenName ?? "",
      familyName: userInfo?.familyName ?? "",
      username: userInfo?.username ?? "",
      email: userInfo?.email ?? "",
      phoneNumber: userInfo?.phoneNumber ?? "",
    });
  }, [userInfo]);

  const isDirty = useMemo(() => {
    return (
      form.givenName !== (userInfo?.givenName ?? "") ||
      form.familyName !== (userInfo?.familyName ?? "") ||
      form.username !== (userInfo?.username ?? "") ||
      form.email !== (userInfo?.email ?? "") ||
      form.phoneNumber !== (userInfo?.phoneNumber ?? "")
    );
  }, [form, userInfo]);

  const handleSave = async () => {
    setErrorMessage(null);

    if (!form.givenName.trim() || !form.familyName.trim()) {
      setErrorMessage("First and last name are required.");
      return;
    }

    const userId = currentUser?.slug;
    if (!userId) {
      setErrorMessage("Unable to identify your account.");
      return;
    }

    try {
      await updatePersonalInfo({
        id: userId,
        data: {
          givenName: form.givenName.trim(),
          familyName: form.familyName.trim(),
          username: form.username.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
        },
      }).unwrap();
      router.back();
    } catch (error) {
      console.log("Update personal info error", JSON.stringify(error, null, 2));
      setErrorMessage("Unable to update your profile right now.");
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: Colors.neutral[950] }}
      contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <View
        style={{
          borderRadius: 12,
          backgroundColor: Colors.neutral[800],
          borderWidth: 1,
          borderColor: Colors.neutral[700],
          padding: 16,
          gap: 14,
        }}
      >
        <View style={{ gap: 8 }}>
          <CText size="xs" color={Colors.neutral[400]} weight="semibold">
            First Name
          </CText>
          <TextInput
            value={form.givenName}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, givenName: text }))
            }
            placeholder="Enter first name"
            placeholderTextColor={Colors.neutral[600]}
            style={{
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[900],
              borderRadius: 10,
              padding: 12,
              color: Colors.neutral[100],
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <CText size="xs" color={Colors.neutral[400]} weight="semibold">
            Last Name
          </CText>
          <TextInput
            value={form.familyName}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, familyName: text }))
            }
            placeholder="Enter last name"
            placeholderTextColor={Colors.neutral[600]}
            style={{
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[900],
              borderRadius: 10,
              padding: 12,
              color: Colors.neutral[100],
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <CText size="xs" color={Colors.neutral[400]} weight="semibold">
            Username
          </CText>
          <TextInput
            value={form.username}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, username: text }))
            }
            placeholder="Enter username"
            placeholderTextColor={Colors.neutral[600]}
            autoCapitalize="none"
            style={{
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[900],
              borderRadius: 10,
              padding: 12,
              color: Colors.neutral[100],
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <CText size="xs" color={Colors.neutral[400]} weight="semibold">
            Email
          </CText>
          <TextInput
            value={form.email}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, email: text }))
            }
            placeholder="Enter email"
            placeholderTextColor={Colors.neutral[600]}
            autoCapitalize="none"
            keyboardType="email-address"
            style={{
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[900],
              borderRadius: 10,
              padding: 12,
              color: Colors.neutral[100],
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <CText size="xs" color={Colors.neutral[400]} weight="semibold">
            Phone
          </CText>
          <TextInput
            value={form.phoneNumber}
            onChangeText={(text) =>
              setForm((prev) => ({ ...prev, phoneNumber: text }))
            }
            placeholder="Enter phone"
            placeholderTextColor={Colors.neutral[600]}
            keyboardType="phone-pad"
            style={{
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[900],
              borderRadius: 10,
              padding: 12,
              color: Colors.neutral[100],
            }}
          />
        </View>

        {errorMessage && (
          <CText size="xs" color={Colors.warning[300]} weight="semibold">
            {errorMessage}
          </CText>
        )}
      </View>

      <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: Colors.neutral[600],
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            backgroundColor: Colors.neutral[900],
          }}
        >
          <CText shade={300} weight="semibold">
            Cancel
          </CText>
        </Pressable>

        <Pressable
          onPress={handleSave}
          disabled={isLoading}
          style={{
            flex: 1,
            backgroundColor: Colors.accent[500],
            padding: 12,
            borderRadius: 10,
            alignItems: "center",
            opacity: isLoading ? 0.6 : 1,
          }}
        >
          <CText weight="bold">{isLoading ? "Saving..." : "Save"}</CText>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default EditPersonalInfo;
