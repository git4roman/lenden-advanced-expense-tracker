import {
  View,
  Pressable,
  Modal,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from "react-native";
import { useEffect, useState, useRef } from "react";
import { CText } from "@/src/shared/ui/components/CText";
import { Colors } from "@/src/shared/ui/theme/colors";
import { useImagePicker } from "@/src/shared/hooks/use-image-picker";
import { GroupMember } from "../../types/group-member";
import { useGroupHandler } from "../../hooks/use-group-handler";
import { useGetFriendsQuery } from "@/src/shared/store/apiSlices/friends-slice.api";
import { SafeAreaView } from "react-native-safe-area-context";
import StepGroupInfo from "./step-1";
import StepAddMembers from "./step-2";

const { width } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  members: GroupMember[];
};

type Friend = {
  id: string;
  givenName: string;
  familyName: string;
  email: string;
};

// ─── Step 1: Group Info ───────────────────────────────────────────────────────

// ─── Step 2: Add Members ──────────────────────────────────────────────────────

// ─── Main Modal ───────────────────────────────────────────────────────────────

export const CreateGroupModal = ({ visible, onClose, members }: Props) => {
  const [step, setStep] = useState<1 | 2>(1);

  const {
    handleCreateGroup,
    selectedMembers,
    setSelectedMembers,
    groupName,
    setGroupName,
    groupImageUri,
    setGroupImageUri,
    suggestedMembers,
    setSuggestedMembers,
  } = useGroupHandler(onClose);

  const handleCancel = () => {
    setStep(1);
    setGroupName("");
    setGroupImageUri("");
    setSelectedMembers([]);
    setSuggestedMembers([]);
    onClose();
  };

  const handleCreate = (memberIds: string[]) => {
    setSelectedMembers(memberIds);
    handleCreateGroup();
  };

  return (
    <Modal
      transparent={false}
      animationType="slide"
      visible={visible}
      onRequestClose={handleCancel}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.neutral[900] }}>
        {step === 1 ? (
          <StepGroupInfo
            groupName={groupName}
            setGroupName={setGroupName}
            groupImageUri={groupImageUri}
            setGroupImageUri={setGroupImageUri}
            onCancel={handleCancel}
            onNext={() => setStep(2)}
          />
        ) : (
          <StepAddMembers
            onBack={() => setStep(1)}
            onCreateGroup={handleCreate}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};
