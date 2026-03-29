import { Alert } from "react-native";
import { MediaService, MediaSource } from "../services/media.service";

export const useImagePicker = () => {
  const pickImage = async (source: MediaSource) => {
    try {
      const uri = await MediaService.pick(source);

      if (!uri) {
        const permission = await MediaService.requestPermission(source);
        if (!permission.granted) {
          Alert.alert(
            "Permission Needed",
            source === "camera"
              ? "Camera permission is required."
              : "Gallery permission is required."
          );
        }
      }

      return uri;
    } catch {
      Alert.alert("Unable to Pick Image", "Please try again.");
      return null;
    }
  };

  return { pickImage };
};
