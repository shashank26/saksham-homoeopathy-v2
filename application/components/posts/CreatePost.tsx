import { Role } from "@/services/Firebase.service";
import { CreatePostType, PostService } from "@/services/Posts.service";
import { StorageService } from "@/services/Storage.service";
import { themeColors } from "@/themes/themes";
import * as Crypto from "expo-crypto";
import { Dispatch, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Label, Text, TextArea, XStack, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";
import { OverlayActivityIndicator } from "../common/Alert";
import { DrawerSheet } from "../common/DrawerSheet";
import { FloatingRoundButton } from "../common/FloatingRoundButton";
import {
  ImagePreview,
  MediaPicker,
  MediaPickerResult
} from "../common/MediaPicker";
import { LoaderButton } from "../controls/LoaderButton";

const CreatePostButton = ({
  setOpen,
}: {
  setOpen: Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <FloatingRoundButton
      onPress={() => {
        setOpen(true);
      }}
    />
  );
};

const CreatePostForm = ({
  onClose,
}: {
  onClose: (result: boolean) => void;
}) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaPickerResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreatePostType>({
    title: "",
    body: "",
  });
  const valid = () => {
    if (formData?.title && formData.body) {
      return true;
    }
    return false;
  };

  return (
    <View style={styles.container}>
      <YStack gap={5} width={"100%"}>
        <YStack gap={2} width={"100%"}>
          <Label fontFamily={"$js5"} fontSize={"$5"}>
            Title
          </Label>
          <Input
            fontFamily={"$js5"}
            fontSize={"$4"}
            maxLength={50}
            onChangeText={(text) => {
              setFormData((prev) => {
                return {
                  ...(prev || {}),
                  title: text,
                };
              });
            }}
            value={formData.title}
          />
          <Text
            alignSelf="flex-end"
            color={themeColors.accent}
            fontFamily={"$js5"}
            fontSize={"$1"}
            marginTop={2}
          >
            {formData.title.length}/50
          </Text>
        </YStack>
        <YStack height={"200"}>
          <Label fontFamily={"$js5"} fontSize={"$4"}>
            Content
          </Label>
          <TextArea
            fontFamily={"$js5"}
            fontSize={"$4"}
            maxLength={250}
            multiline={true}
            value={formData.body}
            onChangeText={(text) => {
              setFormData((prev) => {
                return {
                  ...(prev || {}),
                  body: text,
                };
              });
            }}
          />
          <Text
            alignSelf="flex-end"
            color={themeColors.accent}
            fontFamily={"$js5"}
            fontSize={"$1"}
            marginTop={2}
          >
            {formData.body.length}/250
          </Text>
        </YStack>
        <XStack
          gap={5}
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <MediaPicker
            onClose={(media) => {
              setSelectedMedia((prev) => {
                return [...prev, media];
              });
            }}
          />
          {selectedMedia.length > 0 && (
            <ImagePreview
              onRemove={(uri) => {
                setSelectedMedia((prev) => {
                  return prev.filter((media) =>
                    ![media.uri, media.thumbnail].includes(uri)
                  );
                });
              }}
              uris={selectedMedia.map((media) => media.thumbnail || media.uri)}
            />
          )}
        </XStack>
        <OverlayActivityIndicator
          description={"Creating new post..."}
          title={"Please wait..."}
          icon={<></>}
          visible={loading}
        />
        <LoaderButton
          disabled={!valid()}
          theme={"accent"}
          style={{
            fontSize: 20,
            fontWeight: "bold",
          }}
          message="Posting..."
          text="Post"
          isLoading={loading}
          onPress={async () => {
            if (!valid() || !formData) return;
            setLoading(true);
            try {
              const media = selectedMedia.length > 0 ? selectedMedia[0] : null;
              let savedUri, thumbnailUri;
              if (media) {
                savedUri = await StorageService.setItem(
                  Crypto.randomUUID(),
                  media.blob
                );
                if (media?.thumbnail) {
                  const thumbnailBlob = await fetch(media.thumbnail).then(
                    (res) => res.blob()
                  );
                  thumbnailUri = await StorageService.setItem(
                    Crypto.randomUUID(),
                    thumbnailBlob
                  );
                }
              }
              const res = await PostService.create({
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
              console.log(res);
            } catch (err) {
              console.log("Error while posting", err);
            }
            setFormData({
              body: "",
              title: "",
            });
            setSelectedMedia([]);
            onClose(true);
            setLoading(false);
          }}
        />
      </YStack>
    </View>
  );
};

export const CreatePost = () => {
  const { role } = useAuth();

  if (role === Role.DOCTOR) {
    return (
      <DrawerSheet<Boolean>
        FC={CreatePostButton}
        Child={CreatePostForm}
        onClose={async (data) => {}}
      ></DrawerSheet>
    );
  }
  return <></>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});
