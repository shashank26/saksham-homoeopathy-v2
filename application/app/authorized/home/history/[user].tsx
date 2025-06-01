import { BackHeader } from "@/components/common/BackHeader";
import { UserInfo } from "@/components/common/UserList";
import { AddMedicine } from "@/components/history/admin/AddMedicine";
import { UserHistoryScreen } from "@/components/history/user/UserHistoryScreen";
import { UserService } from "@/services/User.service";
import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

const Info = () => {
  const { user } = useLocalSearchParams();
  const profile = UserService.getUser(user as string);
  if (!profile) {
    return <></>;
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
