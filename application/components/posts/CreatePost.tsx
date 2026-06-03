import { LoginPrimaryButton } from "@/components/auth/login/LoginPrimaryButton";
import { BookingTextField } from "@/components/bookings/user/BookingTextField";
import { Role } from "@/services/Firebase.service";
import { CreatePostType, PostService } from "@/services/Posts.service";
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

const CreatePostForm = ({
  onClose,
}: {
  onClose: (result: boolean) => void;
}) => {
  const fonts = useVitalityFonts();
  const [selectedMedia, setSelectedMedia] = useState<
    Extract<MediaPickerResult, { uri: string }>[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePostType>({
    title: "",
    body: "",
  });

  const valid = () => Boolean(formData.title && formData.body);

  const dismiss = () => onClose(false);

  if (!fonts) {
    return null;
  }

  return (
    <View style={styles.formRoot}>
      <CreatePostHeader onClose={dismiss} />
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
          onMediaPicked={(media) => setSelectedMedia([media])}
        />
        {selectedMedia.length > 0 ? (
          <ImagePreview
            onRemove={(uri) => {
              setSelectedMedia((prev) =>
                prev.filter(
                  (m) => ![m.uri, m.thumbnail].includes(uri),
                ),
              );
            }}
            uris={selectedMedia.map((m) => m.thumbnail || m.uri)}
          />
        ) : null}
      </ScrollView>
      <VitalityDrawerFooter>
        <LoginPrimaryButton
          label="Post Content"
          loadingLabel="Posting..."
          disabled={!valid()}
          loading={loading}
          onPress={async () => {
            if (!valid()) return;
            setLoading(true);
            try {
              const media = selectedMedia.length > 0 ? selectedMedia[0] : null;
              let savedUri, thumbnailUri;
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
              await PostService.create({
                body: formData.body,
                media: savedUri
                  ? {
                      type: media?.thumbnail ? "video" : "image",
                      url: savedUri,
                      thumbnail: thumbnailUri,
                    }
                  : undefined,
                title: formData.title,
              });
            } catch (err) {
              console.log("Error while posting", err);
            }
            setFormData({ body: "", title: "" });
            setSelectedMedia([]);
            onClose(true);
            setLoading(false);
          }}
        />
      </VitalityDrawerFooter>
      <OverlayActivityIndicator
        description="Creating new post..."
        title="Please wait..."
        icon={<></>}
        visible={loading}
      />
    </View>
  );
};

export const CreatePost = () => {
  const { role } = useAuth();

  if (role === Role.DOCTOR) {
    return (
      <VitalityDrawerSheet<Boolean>
        FC={CreatePostButton}
        Child={CreatePostForm}
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
