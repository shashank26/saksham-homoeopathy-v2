import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@tamagui/core";
import { FC } from "react";
import { Button, XStack, YStack } from "tamagui";
import * as ExpoImagePicker from "expo-image-picker";
import { useAuth } from "../auth/hooks/useAuth";
import {} from "@react-native-firebase/firestore";
import { StorageService } from "@/services/Storage.service";

export const ImagePicker = <T,>({
  onClose,
}: {
  onClose: (data: T) => void;
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
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.3,
          });
          if (result.canceled) {
            console.log("Image picker was canceled");
            return;
          }
          const asset = result.assets[0];
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          onClose(blob as T);
        }}
        backgroundColor={themeColors.accent}
      />
      <Text fontFamily={"$js4"}>Photos</Text>
    </YStack>
  );
};

export const VideoPicker = <T,>({
  onClose,
}: {
  onClose: (data: T) => void;
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
          onClose(blob as T);
        }}
        backgroundColor={themeColors.accent}
      />
      <Text fontFamily={"$js4"}>Videos</Text>
    </YStack>
  );
};

export const MediaPicker = <T,>({
  onClose,
}: {
  onClose: (data: T) => void;
}) => {
  return (
    <XStack gap={15} padding={15}>
      <ImagePicker onClose={onClose} />
      <VideoPicker onClose={onClose} />
    </XStack>
  );
};
