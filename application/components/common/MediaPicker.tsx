import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import {} from "@react-native-firebase/firestore";
import { Text } from "@tamagui/core";
import * as ExpoImagePicker from "expo-image-picker";
import { Button, Image, XStack, YStack } from "tamagui";
import { styleSheets } from "../styles";
import { View } from "react-native";

import ImageResizer from "react-native-image-resizer";

const compressImage = async (uri: string, ratio: number) => {
  try {
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      ratio * 1000,
      1000,
      "JPEG",
      100
    );
    return resizedImage.uri; // path to compressed image
  } catch (err) {
    console.error(err);
    return null;
  }
};

export type MediaPickerResult = {
  blob: Blob;
  uri: string;
};

export const ImagePicker = ({
  onClose,
}: {
  onClose: (data: MediaPickerResult) => void;
}) => {
  return (
    <YStack gap={10} alignItems="center">
      <Button
        shadowColor={themeColors.onyx}
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={4}
        elevation={5}
        icon={
          <MaterialIcons
            name="photo-library"
            color={themeColors.plat}
            size={32}
          />
        }
        size={48}
        circular
        onPress={async () => {
          console.log("Opening image picker...");
          let result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
          });
          if (result.canceled) {
            console.log("Image picker was canceled");
            return;
          }

          const imageData = result.assets[0];
          const ratio = imageData.width / imageData.height;

          const asset = await compressImage(imageData.uri, ratio);
          if (!asset) {
            console.log("Failed to compress image");
            return;
          }
          const response = await fetch(asset);
          const blob = await response.blob();
          onClose({
            blob,
            uri: asset,
          });
        }}
        backgroundColor={themeColors.accent}
      />
      <Text fontFamily={"$js4"}>Photos</Text>
    </YStack>
  );
};

export const VideoPicker = ({
  onClose,
}: {
  onClose: (data: MediaPickerResult) => void;
}) => {
  return (
    <YStack gap={10} alignItems="center">
      <Button
        shadowColor={themeColors.onyx}
        shadowOffset={{ width: 0, height: 4 }}
        shadowOpacity={0.3}
        shadowRadius={4}
        elevation={5}
        icon={
          <MaterialIcons
            name="video-library"
            color={themeColors.plat}
            size={32}
          />
        }
        size={48}
        circular
        onPress={async () => {
          console.log("Opening video picker...");
          let result = await ExpoImagePicker.launchImageLibraryAsync({
            mediaTypes: ["videos"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.2,
          });
          if (result.canceled) {
            console.log("Video picker was canceled");
            return;
          }
          const asset = result.assets[0];
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          onClose({
            blob,
            uri: result.assets[0].uri,
          });
        }}
        backgroundColor={themeColors.accent}
      />
      <Text fontFamily={"$js4"}>Videos</Text>
    </YStack>
  );
};

export const ImagePreview = ({
  uris,
  onRemove,
}: {
  uris: string[];
  onRemove: (uri: string) => void;
}) => {
  return (
    <XStack gap={5} padding={"5"}>
      {uris.map((uri) => (
        <View
          key={uri}
          style={{ position: "relative", ...styleSheets.shadowStyle }}
        >
          <Image src={uri} height={60} width={60} />
          <Button
            position="absolute"
            top={-6}
            right={-6}
            size="$1"
            circular
            backgroundColor={themeColors.onyx}
            style={styleSheets.shadowStyle}
            icon={
              <MaterialIcons name="close" color={themeColors.plat} size={16} />
            }
            onPress={() => {
              onRemove(uri);
            }}
          />
        </View>
      ))}
    </XStack>
  );
};

export const MediaPicker = ({
  onClose,
}: {
  onClose: (data: MediaPickerResult) => void;
}) => {
  return (
    <XStack gap={15} padding={15}>
      <ImagePicker onClose={onClose} />
      <VideoPicker onClose={onClose} />
    </XStack>
  );
};
