import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import {} from "@react-native-firebase/firestore";
import { Text } from "@tamagui/core";
import * as ExpoImagePicker from "expo-image-picker";
import { Button, Image, XStack, YStack } from "tamagui";
import { styleSheets } from "../styles";
import { Pressable, View } from "react-native";
import { getThumbnailAsync } from "expo-video-thumbnails";
import ImageResizer from "react-native-image-resizer";
import VideoCompresser from "react-native-compressor";
import { OverlayActivityIndicator } from "./Alert";
import { useState } from "react";
import { toast } from "burnt";

const compressImage = async (uri: string, ratio: number) => {
  try {
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      ratio * 1000,
      1000,
      "JPEG",
      70
    );
    return resizedImage.uri; // path to compressed image
  } catch (err) {
    console.error(err);
    return null;
  }
};

const compressVideo = async (
  uri: string,
  maxSize: number,
  started: (cancellationId: string) => void,
  setProgress: (progress: number) => void
) => {
  try {
    const compressedVideo = await VideoCompresser.Video.compress(
      uri,
      {
        compressionMethod: "auto",
        maxSize,
        getCancellationId: (cancellationId) => {
          started(cancellationId);
        },
        progressDivider: 1,
      },
      (progress) => {
        setProgress(progress);
      }
    );
    return compressedVideo; // path to compressed video
  } catch (err) {
    console.error(err);

    return null;
  }
};

export type MediaPickerResult =
  | {
      blob: Blob;
      uri: string;
      thumbnail?: string;
    }
  | { error: "canceled" | "file_too_large" | "compression_failed" };

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
            onClose({
              error: "canceled",
            });
            return;
          }

          const imageData = result.assets[0];
          // if file size is greater than 10mb, return null
          if ((imageData.fileSize || Number.POSITIVE_INFINITY) > 10000000) {
            console.log("Image file size is more than 10mb, can't upload it.");
            onClose({
              error: "file_too_large",
            });
            return;
          }
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
  const [compressing, setCompressing] = useState<string | null>(null);
  const [compressionProgress, setCompressionProgress] = useState<number>(0);
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
            quality: 0.1,
          });
          if (result.canceled) {
            console.log("Video picker was canceled");
            onClose({
              error: "canceled",
            });
            return;
          }
          const asset = result.assets[0];
          // if file size is greater than 30mb, return null
          if ((asset.fileSize || Number.POSITIVE_INFINITY) > 30000000) {
            console.log("Video file size is more than 30mb, can't upload it.");
            onClose({
              error: "file_too_large",
            });
            return;
          }

          const compressedVideo = await compressVideo(
            asset.uri,
            Math.floor((asset.fileSize as number) / 30),
            (cancellationId) => {
              setCompressing(cancellationId);
              console.log("Compression started with ID:", cancellationId);
            },
            (progress) => {
              setCompressionProgress(progress);
              console.log(`Compression progress: ${progress}%`);
            }
          );
          setCompressing(null);
          if (!compressedVideo) {
            console.log("Failed to compress video");
            return;
          }
          const response = await fetch(compressedVideo as string);
          const blob = await response.blob();
          const thumbnail = await getThumbnailAsync(asset.uri);
          const compressedThumbnail = await compressImage(
            thumbnail.uri,
            asset.width / asset.height
          );
          onClose({
            blob,
            uri: result.assets[0].uri,
            thumbnail: compressedThumbnail as string,
          });
        }}
        backgroundColor={themeColors.accent}
      />
      <Text fontFamily={"$js4"}>Videos</Text>
      <OverlayActivityIndicator
        description={"Cancel compression"}
        title={"Compressing - " + Math.ceil(compressionProgress * 100) + "%"}
        icon={
          <Pressable
            onPress={() => {
              if (!compressing) return;
              VideoCompresser.Video.cancelCompression(compressing);
            }}
          >
            <MaterialIcons name="cancel" color={themeColors.accent} size={24} />
          </Pressable>
        }
        visible={compressing !== null}
      />
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
      <ImagePicker
        onClose={(response) => {
          console.error("ImagePicker error:", response.error);
          if ("error" in response) {
            console.error("ImagePicker error:", response.error);
            toast({
              title: response.error,
              message: "Failed to pick image",
              preset: "error",
            });
          } else {
            onClose({
              blob: response.blob,
              uri: response.uri,
              thumbnail: response.thumbnail,
            });
          }
        }}
      />
      <VideoPicker
        onClose={(response) => {
          if ("error" in response) {
            console.error("VideoPicker error:", response.error);
            toast({
              title: response.error,
              message: "Failed to pick video",
              preset: "error",
            });
          } else {
            onClose({
              blob: response.blob,
              uri: response.uri,
              thumbnail: response.thumbnail,
            });
          }
        }}
      />
    </XStack>
  );
};
