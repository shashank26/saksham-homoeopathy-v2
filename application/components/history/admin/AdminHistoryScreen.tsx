import { UserList } from "@/components/common/UserList";
import { useRouter } from "expo-router";

export const AdminHistoryScreen = () => {
  const router = useRouter();
  return (
    <UserList
      onPress={(user) => {
        router.push(`./${user.id}`, {
          relativeToDirectory: true,
        });
      }}
    />
  );
};
