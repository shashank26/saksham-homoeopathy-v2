import { OverlayActivityIndicator } from "@/components/common/Alert";
import type { MediaPickerResult } from "@/components/common/mediaPickerCore";
import {
  isMediaPickerSuccess,
  pickImageFromLibrary,
  pickVideoFromLibrary,
  VideoCompresser,
} from "@/components/common/mediaPickerCore";
import {
  loginColors,
  loginRadius,
  loginSpacing,
  loginTypography,
} from "@/themes/loginDesign";
import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { toast } from "burnt";
import { FC, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

const TILE_SIZE = 80;

type CreatePostMediaTilesProps = {
  onMediaPicked: (media: Extract<MediaPickerResult, { uri: string }>) => void;
};

function handlePickerResult(
  result: MediaPickerResult,
  onSuccess: CreatePostMediaTilesProps["onMediaPicked"],
  errorMessage: string,
) {
  if (isMediaPickerSuccess(result)) {
    onSuccess(result);
    return;
  }
  if (result.error === "canceled") return;
  toast({
    title: result.error,
    message: errorMessage,
    preset: "error",
  });
}

export const CreatePostMediaTiles: FC<CreatePostMediaTilesProps> = ({
  onMediaPicked,
}) => {
  const [compressing, setCompressing] = useState<string | null>(null);
  const [compressionProgress, setCompressionProgress] = useState(0);

  const pickPhoto = async () => {
    const result = await pickImageFromLibrary();
    handlePickerResult(result, onMediaPicked, "Failed to pick image");
  };

  const pickVideo = async () => {
    const result = await pickVideoFromLibrary({
      onCompressionStart: (id) => setCompressing(id),
      onCompressionProgress: setCompressionProgress,
    });
    setCompressing(null);
    setCompressionProgress(0);
    handlePickerResult(result, onMediaPicked, "Failed to pick video");
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>Add Media</Text>
      <View style={styles.tilesRow}>
        <Pressable onPress={pickPhoto}>
          {({ pressed }) => (
            <View style={[styles.tile, pressed && styles.tilePressed]}>
              <MaterialIcons
                name="add-a-photo"
                size={28}
                color={loginColors.primary}
              />
              <Text style={[styles.tileLabel, styles.photoLabel]}>Photo</Text>
            </View>
          )}
        </Pressable>
        <Pressable onPress={pickVideo} style={styles.tileSpacer}>
          {({ pressed }) => (
            <View style={[styles.tile, pressed && styles.tilePressed]}>
              <MaterialIcons
                name="videocam"
                size={28}
                color={loginColors.tertiary}
              />
              <Text style={[styles.tileLabel, styles.videoLabel]}>Video</Text>
            </View>
          )}
        </Pressable>
      </View>
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
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingTop: loginSpacing.stackSm,
    marginBottom: loginSpacing.stackMd,
  },
  sectionLabel: {
    ...loginTypography.labelMd,
    color: loginColors.onSurfaceVariant,
    marginBottom: loginSpacing.stackMd,
  },
  tilesRow: {
    flexDirection: "row",
  },
  tileSpacer: {
    marginLeft: loginSpacing.stackMd,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: loginRadius.lg,
    backgroundColor: loginColors.surfaceContainerLow,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: loginColors.outlineVariant,
    alignItems: "center",
    justifyContent: "center",
  },
  tilePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  tileLabel: {
    fontSize: 10,
    lineHeight: 12,
    fontFamily: "Manrope_700Bold",
    marginTop: 4,
  },
  photoLabel: {
    color: loginColors.primary,
  },
  videoLabel: {
    color: loginColors.tertiary,
  },
});
