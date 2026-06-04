import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@tamagui/core";
import { toast } from "burnt";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Button, Image, XStack, YStack } from "tamagui";
import { styleSheets } from "../styles";
import { OverlayActivityIndicator } from "./Alert";
import {
  isMediaPickerSuccess,
  MediaPickerResult,
  pickImageFromLibrary,
  pickVideoFromLibrary,
  VideoCompresser,
} from "./mediaPickerCore";

export { isMediaPickerSuccess };
export type { MediaPickerResult };

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
          const result = await pickImageFromLibrary();
          if (!isMediaPickerSuccess(result) && result.error !== "canceled") {
            if (result.error === "compression_failed") {
              console.log("Failed to compress image");
              return;
            }
          }
          onClose(result);
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
          const result = await pickVideoFromLibrary({
            onCompressionStart: (cancellationId) => {
              setCompressing(cancellationId);
            },
            onCompressionProgress: setCompressionProgress,
          });
          setCompressing(null);
          if (!isMediaPickerSuccess(result) && result.error !== "canceled") {
            if (result.error === "compression_failed") {
              console.log("Failed to compress video");
              return;
            }
          }
          onClose(result);
        }}
        backgroundColor={themeColors.accent}
      />
      <Text fontFamily={"$js4"}>Videos</Text>
      <OverlayActivityIndicator
        description="Tap to cancel compression"
        title="Compressing"
        progress={compressionProgress}
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
          if ("error" in response) {
            if (response.error === "canceled") return;
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
            if (response.error === "canceled") return;
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
