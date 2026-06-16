import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import { BookingTextField } from "@/components/bookings/user/BookingTextField";
import { Role } from "@/services/Firebase.service";
import { CreatePostType, Post, PostService } from "@/services/Posts.service";
import { StorageService } from "@/services/Storage.service";
import { loginSpacing } from "@/themes/loginDesign";
import { useVitalityFonts } from "@/hooks/useVitalityFonts";
import * as Crypto from "expo-crypto";
import { Dispatch, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useAuth } from "../auth/hooks/useAuth";
import { OverlayActivityIndicator } from "../common/Alert";
import { FloatingRoundButton } from "../common/FloatingRoundButton";
import {
  ImagePreview,
  MediaPickerResult,
} from "../common/MediaPicker";
import {
  VitalityDrawerFooter,
  VitalityDrawerSheet,
} from "../common/VitalityDrawerSheet";
import { CreatePostAuthorRow } from "./create/CreatePostAuthorRow";
import { CreatePostHeader } from "./create/CreatePostHeader";
import { CreatePostMediaTiles } from "./create/CreatePostMediaTiles";
import { PostContentField } from "./create/PostContentField";

const CreatePostButton = ({
  setOpen,
}: {
  setOpen: Dispatch<React.SetStateAction<boolean>>;
}) => (
  <FloatingRoundButton
    onPress={() => {
      setOpen(true);
    }}
  />
);

export const PostForm = ({
  post,
  onClose,
}: {
  post?: Post;
  onClose: (result: boolean) => void;
}) => {
  const fonts = useVitalityFonts();
  const isEdit = Boolean(post?.id);
  const [selectedMedia, setSelectedMedia] = useState<
    Extract<MediaPickerResult, { uri: string }>[]
  >([]);
  const [mediaRemoved, setMediaRemoved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePostType>({
    title: post?.title ?? "",
    body: post?.body ?? "",
    media: post?.media,
  });

  const valid = () => Boolean(formData.title && formData.body);

  const dismiss = () => onClose(false);

  if (!fonts) {
    return null;
  }

  const existingMedia = !mediaRemoved ? post?.media : undefined;
  const previewUris =
    selectedMedia.length > 0
      ? selectedMedia.map((m) => m.thumbnail || m.uri)
      : existingMedia
        ? [existingMedia.thumbnail || existingMedia.url]
        : [];

  return (
    <View style={styles.formRoot}>
      <CreatePostHeader
        title={isEdit ? "Edit Post" : "Create Post"}
        onClose={dismiss}
      />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <CreatePostAuthorRow />
        <BookingTextField
          label="Post Title"
          value={formData.title}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, title: text }))
          }
          placeholder="e.g. Clinical Notes on Lycopodium"
          maxLength={50}
          showCount
        />
        <PostContentField
          value={formData.body}
          onChangeText={(text) =>
            setFormData((prev) => ({ ...prev, body: text }))
          }
        />
        <CreatePostMediaTiles
          onMediaPicked={(media) => {
            setSelectedMedia([media]);
            setMediaRemoved(false);
          }}
        />
        {previewUris.length > 0 ? (
          <ImagePreview
            onRemove={(uri) => {
              if (selectedMedia.length > 0) {
                setSelectedMedia((prev) =>
                  prev.filter(
                    (m) => ![m.uri, m.thumbnail].includes(uri),
                  ),
                );
              } else {
                setMediaRemoved(true);
              }
            }}
            uris={previewUris}
          />
        ) : null}
      </ScrollView>
      <VitalityDrawerFooter>
        <LoginPrimaryButton
          label={isEdit ? "Save Changes" : "Post Content"}
          loadingLabel={isEdit ? "Saving..." : "Posting..."}
          disabled={!valid()}
          loading={loading}
          onPress={async () => {
            if (!valid()) return;
            setLoading(true);
            try {
              const media = selectedMedia.length > 0 ? selectedMedia[0] : null;
              let savedUri: string | undefined;
              let thumbnailUri: string | undefined;
              if (media) {
                savedUri = await StorageService.setItem(
                  Crypto.randomUUID(),
                  media.blob,
                );
                if (media?.thumbnail) {
                  const thumbnailBlob = await fetch(media.thumbnail).then(
                    (res) => res.blob(),
                  );
                  thumbnailUri = await StorageService.setItem(
                    Crypto.randomUUID(),
                    thumbnailBlob,
                  );
                }
              }

              const mediaPayload = media
                ? {
                    type: (media.thumbnail ? "video" : "image") as
                      | "image"
                      | "video",
                    url: savedUri!,
                    thumbnail: thumbnailUri,
                  }
                : mediaRemoved
                  ? undefined
                  : formData.media;

              if (isEdit && post?.id) {
                await PostService.update(post.id, {
                  body: formData.body,
                  title: formData.title,
                  media: mediaPayload,
                });
              } else {
                await PostService.create({
                  body: formData.body,
                  title: formData.title,
                  media: mediaPayload,
                });
              }
            } catch (err) {
              console.log("Error while posting", err);
            }
            onClose(true);
            setLoading(false);
          }}
        />
      </VitalityDrawerFooter>
      <OverlayActivityIndicator
        description={isEdit ? "Updating post..." : "Creating new post..."}
        title="Please wait..."
        icon={<></>}
        visible={loading}
      />
    </View>
  );
};

export const EditPostSheet = ({
  post,
  open,
  onOpenChange,
}: {
  post: Post;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => (
  <VitalityDrawerSheet<void>
    open={open}
    onOpenChange={onOpenChange}
    Child={({ onClose }) => (
      <PostForm
        key={post.id}
        post={post}
        onClose={() => onClose()}
      />
    )}
  />
);

export const CreatePost = () => {
  const { role } = useAuth();

  if (role === Role.DOCTOR) {
    return (
      <VitalityDrawerSheet<Boolean>
        FC={CreatePostButton}
        Child={({ onClose }) => <PostForm onClose={onClose} />}
        onClose={async () => {}}
      />
    );
  }
  return null;
};

const styles = StyleSheet.create({
  formRoot: {
    flexShrink: 1,
    maxHeight: "100%",
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollContent: {
    paddingHorizontal: loginSpacing.containerMargin,
    paddingBottom: loginSpacing.stackMd,
  },
});
