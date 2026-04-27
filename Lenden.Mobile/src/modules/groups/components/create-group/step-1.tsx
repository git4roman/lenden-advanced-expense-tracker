import { useImagePicker } from "@/src/shared/hooks/use-image-picker";
import { useTheme } from "@/src/shared/providers/ThemeProviders";
import { CText } from "@/src/shared/ui/components/CText";
import { View, ScrollView, Pressable, TextInput, Image } from "react-native";

const StepGroupInfo = ({
  groupName,
  setGroupName,
  groupImageUri,
  setGroupImageUri,
  onCancel,
  onNext,
}: {
  groupName: string;
  setGroupName: (v: string) => void;
  groupImageUri: string;
  setGroupImageUri: (v: string) => void;
  onCancel: () => void;
  onNext: () => void;
}) => {
  const { pickImage } = useImagePicker();
  const { Colors } = useTheme();

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
        }}
      >
        <CText weight="bold" size="xmd" color="neutral" shade={100}>
          Create Group
        </CText>
        <CText size="ssm" color="neutral" shade={500}>
          Step 1 of 2 — Group details
        </CText>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar picker centered */}
        <View style={{ alignItems: "center", gap: 12 }}>
          <Pressable
            onPress={async () => {
              const uri = await pickImage("gallery");
              if (uri) setGroupImageUri(uri);
            }}
            style={{
              width: 110,
              height: 110,
              borderRadius: 55,
              overflow: "hidden",
              backgroundColor: Colors.neutral[800],
              borderWidth: 2,
              borderColor: Colors.neutral[600],
              borderStyle: groupImageUri ? "solid" : "dashed",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {groupImageUri ? (
              <Image
                source={{ uri: groupImageUri }}
                style={{ width: 110, height: 110 }}
              />
            ) : (
              <View style={{ alignItems: "center", gap: 4 }}>
                <CText size="lg" color="neutral" shade={500}>
                  📷
                </CText>
                <CText size="ssm" color="neutral" shade={500}>
                  Tap to add
                </CText>
              </View>
            )}
          </Pressable>

          {/* Camera / Gallery row */}
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Pressable
              onPress={async () => {
                const uri = await pickImage("camera");
                if (uri) setGroupImageUri(uri);
              }}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Colors.neutral[600],
                backgroundColor: Colors.neutral[800],
              }}
            >
              <CText size="sm" color="neutral" shade={300}>
                Camera
              </CText>
            </Pressable>
            <Pressable
              onPress={async () => {
                const uri = await pickImage("gallery");
                if (uri) setGroupImageUri(uri);
              }}
              style={{
                paddingHorizontal: 18,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: Colors.neutral[600],
                backgroundColor: Colors.neutral[800],
              }}
            >
              <CText size="sm" color="neutral" shade={300}>
                Gallery
              </CText>
            </Pressable>
            {!!groupImageUri && (
              <Pressable
                onPress={() => setGroupImageUri("")}
                style={{
                  paddingHorizontal: 18,
                  paddingVertical: 8,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: Colors.neutral[700],
                  backgroundColor: Colors.neutral[900],
                }}
              >
                <CText size="sm" color="neutral" shade={500}>
                  Remove
                </CText>
              </Pressable>
            )}
          </View>
        </View>

        {/* Group Name */}
        <View style={{ gap: 8 }}>
          <CText size="ssm" color="neutral" shade={400} weight="semibold">
            Group Name
          </CText>
          <TextInput
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name..."
            placeholderTextColor={Colors.neutral[600]}
            style={{
              borderWidth: 1,
              borderColor: Colors.neutral[700],
              backgroundColor: Colors.neutral[800],
              borderRadius: 14,
              paddingHorizontal: 16,
              paddingVertical: 14,
              color: Colors.neutral[100],
              fontSize: 16,
            }}
          />
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
          onPress={onNext}
          disabled={!groupName.trim()}
          style={{
            // flex: 2,
            backgroundColor: groupName.trim()
              ? Colors.accent[500]
              : Colors.neutral[700],
            padding: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <CText weight="bold" shade={800} color="neutral">
            Add Members
          </CText>
        </Pressable>
        <Pressable
          onPress={onCancel}
          style={{
            // flex: 1,
            borderWidth: 1,
            borderColor: Colors.neutral[600],
            padding: 14,
            borderRadius: 14,
            alignItems: "center",
          }}
        >
          <CText shade={300}>Cancel</CText>
        </Pressable>
      </View>
    </View>
  );
};
export default StepGroupInfo;
