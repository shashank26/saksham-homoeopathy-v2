import { BackHeader } from "@/components/common/BackHeader";
import { UserInfo } from "@/components/common/UserList";
import { AddMedicine } from "@/components/history/admin/AddMedicine";
import { UserHistoryScreen } from "@/components/history/user/UserHistoryScreen";
import { UserProfile } from "@/services/Auth.service";
import { UserService } from "@/services/User.service";
import { themeColors } from "@/themes/themes";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Spinner } from "tamagui";

const Info = () => {
  const { user } = useLocalSearchParams();
  const [profile, setProfile] = useState<UserProfile>();
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setLoading(true);
    UserService.getUser(user as string)
      .then((profile) => {
        setProfile(profile);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return <Spinner color={themeColors.plat} />;
  }

  if (!profile) {
    return (
      <Text
        style={{
          color: "red",
        }}
      >
        User not found!
      </Text>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <BackHeader title={<UserInfo user={profile} />} />
      <UserHistoryScreen phoneNumber={profile.phoneNumber} />
      <AddMedicine user={profile} />
    </View>
  );
};

export default Info;
