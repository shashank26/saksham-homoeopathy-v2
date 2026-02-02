import { UserProfile } from "@/services/Auth.service";
import { UserService } from "@/services/User.service";
import { themeColors } from "@/themes/themes";
import { EvilIcons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Input, Text, XStack, YStack } from "tamagui";
import { ShimmerImage } from "./ShimmerImage";
import { useRouter } from "expo-router";

export const UserInfo = React.memo(
  ({ user, onPress }: { user: UserProfile; onPress?: () => void }) => {
    const view = (
      <XStack
        gap={15}
        style={{
          backgroundColor: themeColors.plat,
          width: "100%",
          padding: 5,
          borderRadius: 10,
          borderBottomColor: '#ccc',
          borderBottomWidth: 1,
        }}
      >
        {user.photoUrl ? (
          <ShimmerImage
            key={user.photoUrl}
            url={user.photoUrl}
            size={{
              height: 48,
              width: 48,
            }}
            borderRadius={24}
          />
        ) : (
          <View
            style={{
              height: 48,
              width: 48,
              borderRadius: 24,
              backgroundColor: "#ccc",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <EvilIcons name="user" color={themeColors.accent} size={48} />
          </View>
        )}
        <YStack justifyContent="center" gap={2}>
          <Text fontFamily={"$js6"} fontSize={"$6"} color={themeColors.onyx}>
            {user.displayName}
          </Text>
          <Text fontFamily={"$js4"} fontSize={"$3"} color={"#aaa"}>
            {user.phoneNumber}
          </Text>
        </YStack>
      </XStack>
    );
    return onPress ? (
      <TouchableOpacity onPress={onPress}>{view}</TouchableOpacity>
    ) : (
      view
    );
  },
  (prev, next) => {
    return (
      prev.user.phoneNumber === next.user.phoneNumber &&
      prev.user.photoUrl === next.user.photoUrl &&
      prev.user.displayName === next.user.displayName
    );
  }
);

export const UserList = () => {
  const [userList, setUserList] = useState<UserProfile[]>([]);
  const [searchToken, setSearchToken] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    const unsub = UserService.onUserUpdate((users) => {
      setUserList(users);
    });
    return unsub;
  }, []);

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: themeColors.plat }}>
      <Input
        fontFamily={"$js5"}
        fontSize={"$4"}
        placeholder="Search..."
        clearButtonMode="always"
        onChangeText={(text) => {
          setSearchToken(text);
        }}
        style={{
          width: "100%",
          marginBottom: 10,
          backgroundColor: themeColors.light,
        }}
      />
      <FlatList
        data={userList.filter(
          (user) =>
            user.displayName.startsWith(searchToken) ||
            user.phoneNumber.slice(3).startsWith(searchToken)
        )}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserInfo
            user={item}
            onPress={() => {
              router.push(`./${item.id}`, {
                relativeToDirectory: true,
              });
            }}
          />
        )}
      />
    </View>
  );
};
