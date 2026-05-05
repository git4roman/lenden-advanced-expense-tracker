import { Colors } from "@/src/shared/ui/theme/colors";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGroupHandler } from "../../hooks/use-group-handler";
import { GroupMember } from "../../types/group-member";
import StepGroupInfo from "./step-1";
import StepAddMembers from "./step-2";

const { width } = Dimensions.get("window");

type Props = {
  visible: boolean;
  onClose: () => void;
  members: GroupMember[];
};

type SelectedGroupUser = {
  fullName: string;
  phone: string;
  email: string;
};

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
  } = useGroupHandler(onClose);

  const handleCancel = () => {
    setStep(1);
    setGroupName("");
    setGroupImageUri("");
    setSelectedMembers([]);
    onClose();
  };

  const onCreateGroup = async () => {
    await handleCreateGroup();
    router.replace("/(tabs)/groups");
  };

  useEffect(() => {
    setStep(1);
  }, []);

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
            selectedMembers={selectedMembers}
            setSelectedMembers={setSelectedMembers}
            onCreateGroup={onCreateGroup}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
};
