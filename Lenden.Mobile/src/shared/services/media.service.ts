import * as ImagePicker from "expo-image-picker";

export type MediaSource = "camera" | "gallery";

export const MediaService = {
  async requestPermission(source: MediaSource) {
    return source === "camera"
      ? ImagePicker.requestCameraPermissionsAsync()
      : ImagePicker.requestMediaLibraryPermissionsAsync();
  },

  async pick(source: MediaSource): Promise<string | null> {
    const permission = await this.requestPermission(source);

    if (!permission.granted) return null;

    const result =
      source === "camera"
        ? await ImagePicker.launchCameraAsync({
            quality: 0.8,
            allowsEditing: true,
            mediaTypes: ["images"],
          })
        : await ImagePicker.launchImageLibraryAsync({
            quality: 0.8,
            allowsEditing: true,
            mediaTypes: ["images"],
          });

    if (!result.canceled && result.assets?.[0]?.uri) {
      return result.assets[0].uri;
    }

    return null;
  },
};