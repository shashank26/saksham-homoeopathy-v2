import * as ExpoImagePicker from "expo-image-picker";
import { getThumbnailAsync } from "expo-video-thumbnails";
import ImageResizer from "react-native-image-resizer";
import VideoCompresser from "react-native-compressor";
export type MediaPickerResult =
  | {
      blob: Blob;
      uri: string;
      thumbnail?: string;
    }
  | { error: "canceled" | "file_too_large" | "compression_failed" };

export function isMediaPickerSuccess(
  result: MediaPickerResult,
): result is { blob: Blob; uri: string; thumbnail?: string } {
  return !("error" in result);
}

const compressImage = async (uri: string, ratio: number) => {
  try {
    const resizedImage = await ImageResizer.createResizedImage(
      uri,
      ratio * 1000,
      1000,
      "JPEG",
      70,
    );
    return resizedImage.uri;
  } catch (err) {
    console.error(err);
    return null;
  }
};

const compressVideo = async (
  uri: string,
  maxSize: number,
  started: (cancellationId: string) => void,
  setProgress: (progress: number) => void,
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
      },
    );
    return compressedVideo;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export type VideoPickCallbacks = {
  onCompressionStart: (cancellationId: string) => void;
  onCompressionProgress: (progress: number) => void;
};

export async function pickImageFromLibrary(): Promise<MediaPickerResult> {
  const result = await ExpoImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
  });
  if (result.canceled) {
    return { error: "canceled" };
  }

  const imageData = result.assets[0];
  if ((imageData.fileSize || Number.POSITIVE_INFINITY) > 10000000) {
    return { error: "file_too_large" };
  }

  const ratio = imageData.width / imageData.height;
  const asset = await compressImage(imageData.uri, ratio);
  if (!asset) {
    return { error: "compression_failed" };
  }

  const response = await fetch(asset);
  const blob = await response.blob();
  return { blob, uri: asset };
}

export async function pickVideoFromLibrary(
  callbacks: VideoPickCallbacks,
): Promise<MediaPickerResult> {
  const result = await ExpoImagePicker.launchImageLibraryAsync({
    mediaTypes: ["videos"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.1,
  });
  if (result.canceled) {
    return { error: "canceled" };
  }

  const asset = result.assets[0];
  if ((asset.fileSize || Number.POSITIVE_INFINITY) > 100000000) {
    return { error: "file_too_large" };
  }

  const compressedVideo = await compressVideo(
    asset.uri,
    Math.floor((asset.fileSize as number) / 30),
    callbacks.onCompressionStart,
    callbacks.onCompressionProgress,
  );
  if (!compressedVideo) {
    return { error: "compression_failed" };
  }

  const response = await fetch(compressedVideo as string);
  const blob = await response.blob();
  const thumbnail = await getThumbnailAsync(asset.uri);
  const compressedThumbnail = await compressImage(
    thumbnail.uri,
    asset.width / asset.height,
  );
  return {
    blob,
    uri: asset.uri,
    thumbnail: compressedThumbnail as string,
  };
}

export { VideoCompresser };
