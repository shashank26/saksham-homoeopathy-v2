import { UserProfile } from "@/services/Auth.service";
import { StorageService } from "@/services/Storage.service";
import { themeColors } from "@/themes/themes";
import { Text } from "@tamagui/core";
import { useToastController } from "@tamagui/toast";
import { FC, useState } from "react";
import { View } from "react-native";
import { Button, Form, Input, Label, XStack, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";
import { OverlayActivityIndicator } from "../common/Alert";
import { DrawerSheet } from "../common/DrawerSheet";
import { ImagePicker, MediaPickerResult } from "../common/MediaPicker";
import { ShimmerImage } from "../common/ShimmerImage";
import { Ionicons } from "@expo/vector-icons";

const ProfileAvatar: FC<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpen }) => {
  const { profile } = useAuth();

  const handleImagePicker = () => {
    setOpen(true);
  };

  if (!profile?.photoUrl) {
    return (
      <View
        style={{
          height: 120,
          width: 120,
          borderRadius: 60,
          backgroundColor: themeColors.plat,
          justifyContent: "center",
          alignItems: "center",
          shadowColor: themeColors.onyx,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
          elevation: 5,
        }}
      >
        <Button
          icon={
            <Ionicons
              name="cloud-upload"
              size={20}
              onPress={handleImagePicker}
            />
          }
          backgroundColor={"transparent"}
        >
          <Text fontFamily={"$js5"}>Photo</Text>
        </Button>
      </View>
    );
  }

  return (
    <ShimmerImage
      onPress={handleImagePicker}
      size={{
        height: 120,
        width: 120,
      }}
      borderRadius={60}
      url={profile?.photoUrl}
    />
  );
};

export const ProfileScreen = () => {
  const { profile, user, updateProfile, signOut } = useAuth();
  const [name, setName] = useState(profile?.displayName || "");
  const [popup, setPopup] = useState({
    visible: false,
    description: "",
    title: "",
  });
  const toast = useToastController();

  const handleUpdate = async (profile: UserProfile) => {
    setPopup({
      visible: true,
      description: "Updating your profile...",
      title: "Please wait",
    });
    await updateProfile?.(profile);
    setPopup({
      visible: false,
      description: "",
      title: "",
    });
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: themeColors.plat,
        justifyContent: "center",
      }}
      pointerEvents={popup.visible ? "none" : "auto"}
    >
      <OverlayActivityIndicator
        description={popup.description}
        title={popup.title}
        icon={<></>}
        visible={popup.visible}
      />

      <Form>
        <YStack
          alignItems="center"
          gap={15}
          backgroundColor={themeColors.light}
          borderRadius={10}
          shadowColor={themeColors.onyx}
          shadowOffset={{ width: 0, height: 4 }}
          shadowOpacity={0.3}
          shadowRadius={4}
          elevation={5}
          padding="$4"
        >
          <DrawerSheet<MediaPickerResult>
            FC={ProfileAvatar}
            Child={ImagePicker}
            onClose={async (data) => {
              if (!data || !profile) return;
              setPopup({
                visible: true,
                description: "Updating your profile picture...",
                title: "Please wait",
              });
              try {
                const fileName = `profile/images/${user?.uid}.jpg`;
                const storageUrl = await StorageService.setItem(
                  fileName,
                  data.blob as Blob
                );
                updateProfile?.({
                  ...profile,
                  photoUrl: storageUrl as string,
                });
              } catch (error) {}

              setPopup({
                visible: false,
                description: "",
                title: "",
              });
            }}
          ></DrawerSheet>

          <Text fontFamily={"$js4"} fontSize={30}>
            {profile?.displayName}
          </Text>
          <Text fontFamily={"$js2"} fontSize={14}>
            {profile?.phoneNumber}
          </Text>
          <XStack alignItems="center" gap="$4">
            <Label htmlFor="name" fontFamily={"$js5"} fontSize={16}>
              Name
            </Label>
            <Input
              flex={1}
              id="name"
              defaultValue={profile?.displayName}
              onChangeText={(text) => {
                setName(text);
              }}
            />
          </XStack>
          <Button
            onPress={() => {
              if (!profile || !name.trim()) return;
              handleUpdate({
                ...profile,
                displayName: name,
              });
            }}
            borderRadius={5}
            width={"100%"}
            backgroundColor={themeColors.accent}
          >
            <Text color={themeColors.plat} fontFamily={"$js5"} fontSize={16}>
              Save
            </Text>
          </Button>
          <Button
            onPress={async () => {
              if (!signOut) return;
              setPopup({
                visible: true,
                description: "Signing out...",
                title: "Please wait",
              });
              await signOut();
              setPopup({
                visible: false,
                description: "",
                title: "",
              });
            }}
            borderRadius={5}
            width={"100%"}
            backgroundColor={themeColors.onyx}
          >
            <Text color={themeColors.plat} fontFamily={"$js5"} fontSize={16}>
              Sign out
            </Text>
          </Button>
        </YStack>
      </Form>
    </View>
  );
};
