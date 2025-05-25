import { Post } from "@/services/Posts.service";
import { FlashList } from "@shopify/flash-list";
import { Text, Theme } from "@tamagui/core";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { PostContext } from "./Post.context";
import usePosts from "./hooks/usePosts";
import { Image } from "react-native";
import { Spinner, XStack, YStack } from "tamagui";
import { MomentService } from "@/services/Moment.service";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { themeColors } from "@/themes/themes";
import { FloatingRoundButton } from "../common/FloatingRoundButton";
import { useAuth } from "../auth/hooks/useAuth";
import { Role } from "@/services/Firebase.service";
import { ShimmerImage } from "../common/ShimmerImage";

const RenderPost: React.FC<{ item: Post }> = ({ item }) => {
  const [loaded, setLoaded] = useState(false);
  return (
    <YStack
      padding={10}
      borderRadius={5}
      backgroundColor="#fff"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.2}
      shadowRadius={4}
      elevation={5}
    >
      <XStack alignItems="center" marginBottom={10}>
        <XStack style={{ flex: 1, alignItems: "center" }}>
          <Text fontFamily={"$js4"} fontSize={12} color="#666">
            {MomentService.timeAgo(item.updatedAt)}
          </Text>
        </XStack>
      </XStack>
      <Text
        fontFamily={"$js5"}
        style={{ fontSize: 32, fontWeight: "400" }}
        marginBottom={5}
      >
        {item.title}
      </Text>
      <Text fontSize={14} color="#333" marginBottom={10}>
        {item.body}
      </Text>
      {item.media && (
        <ShimmerImage
          onPress={() => {}}
          url={item.media.url}
          size={{
            height: 200,
            width: "100%",
          }}
          borderRadius={10}
        />
      )}
    </YStack>
  );
};

export default function Posts() {
  const { role } = useAuth();
  const { loading, posts } = usePosts();
  const [page, setPage] = useState<number>(0);

  if (loading === 1) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Spinner size="small" color={themeColors.accent} />
        <Text style={{ marginLeft: 10 }} fontFamily={"$js6"} fontSize={16}>
          Loading posts...
        </Text>
      </View>
    );
  }

  return (
    <PostContext.Provider value={{ page }}>
      {posts.length > 0 ? (
        <View
          style={{ flex: 1, backgroundColor: themeColors.plat, padding: 10 }}
        >
          <FlashList
            data={posts}
            renderItem={({ item }) => <RenderPost item={item} />}
            estimatedItemSize={100}
            // ListFooterComponent={
            //   <ActivityIndicator size="small" color="#000000">
            //     <Text>Loading...</Text>
            //   </ActivityIndicator>
            // }
            // onEndReachedThreshold={0.5}
            // onEndReached={() => {
            //   if (loading) return;
            //   setPage((prev) => prev + 1);
            // }}
          />
        </View>
      ) : (
        <View>
          <Text>No Posts</Text>
        </View>
      )}
      {role === Role.DOCTOR && (
        <FloatingRoundButton
          onPress={function (): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}
    </PostContext.Provider>
  );
}
