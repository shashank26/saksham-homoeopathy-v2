import { StorageService } from "@/services/Storage.service";
import { themeColors } from "@/themes/themes";
import { Text } from "@tamagui/core";
import { useToastController } from "@tamagui/toast";
import { LinearGradient } from "expo-linear-gradient";
import { FC, useState } from "react";
import { View } from "react-native";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { Avatar, Button, Form, Input, Label, XStack, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";
import { DrawerSheet } from "../common/DrawerSheet";
import { ImagePicker } from "../common/MediaPicker";
import { OverlayActivityIndicator } from "../common/Alert";
import { MaterialIcons } from "@expo/vector-icons";
import { UserProfile } from "@/services/Auth.service";

const ProfileAvatar: FC<{
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setOpen }) => {
  const [loaded, setLoaded] = useState(false);
  const { profile } = useAuth();

  const handleImagePicker = () => {
    setOpen(true);
  };
  return (
    <ShimmerPlaceholder
      visible={loaded}
      LinearGradient={LinearGradient}
      style={{ width: 120, height: 120, borderRadius: 60 }}
    >
      <Avatar circular size={120} onPress={handleImagePicker}>
        <Avatar.Image
          accessibilityLabel="Cam"
          src={
            profile?.photoUrl ? profile.photoUrl : "https://picsum.photos/200"
          }
          onLoadStart={() => setLoaded(false)}
          onLoadEnd={() => setLoaded(true)}
        />
        <Avatar.Fallback backgroundColor={themeColors.onyx} />
      </Avatar>
    </ShimmerPlaceholder>
  );
};

export const ProfileScreen = () => {
  const { profile, user, updateProfile } = useAuth();
  const [name, setName] = useState(profile?.displayName || "");
  const [updating, setUpdating] = useState(false);
  const toast = useToastController();

  const handleUpdate = async (profile: UserProfile) => {
    setUpdating(true);
    await updateProfile?.(profile);
    setUpdating(false);
  };

  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: themeColors.plat,
        justifyContent: "center",
      }}
      pointerEvents={updating ? "none" : "auto"}
    >
      <OverlayActivityIndicator
        description="Please wait while we update your profile."
        title="In progress..."
        icon={<></>}
        visible={updating}
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
          <DrawerSheet<Blob>
            FC={ProfileAvatar}
            Child={ImagePicker}
            onClose={async (data) => {
              if (!data || !profile) return;
              setUpdating(true);
              try {
                const fileName = `profile/images/${user?.uid}.jpg`;
                const storageUrl = await StorageService.setItem(
                  fileName,
                  data as Blob
                );
                updateProfile?.({
                  ...profile,
                  photoUrl: storageUrl as string,
                });
              } catch (error) {}

              setUpdating(false);
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
        </YStack>
      </Form>
    </View>
  );
};
