import { Role } from "@/services/Firebase.service";
import { MomentService } from "@/services/Moment.service";
import { Post, PostService } from "@/services/Posts.service";
import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@tamagui/core";
import { useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Pressable, Swipeable } from "react-native-gesture-handler";
import { Spinner, XStack, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";
import { ConfirmDialog } from "../common/Alert";
import { ShimmerImage } from "../common/ShimmerImage";
import { CreatePost } from "./CreatePost";
import { PostContext } from "./Post.context";
import usePosts from "./hooks/usePosts";

const renderRightActions = (onDelete: () => void) => (
  <Pressable
    onPress={onDelete}
    style={{
      justifyContent: "center",
      alignItems: "center",
      width: 80,
    }}
  >
    <MaterialIcons name="delete" size={32} color={"#ff0000"} />
  </Pressable>
);

const RenderPost: React.FC<{ item: Post }> = ({ item }) => {
  return (
    <YStack
      padding={10}
      marginBottom={10}
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

const DoctorPost: React.FC<{ item: Post }> = ({ item }) => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const ref = useRef<any>(null);
  return (
    <>
      <Swipeable
        ref={ref}
        renderRightActions={() =>
          renderRightActions(() => {
            setShowConfirm(true);
          })
        }
      >
        <RenderPost item={item} />
      </Swipeable>
      <ConfirmDialog
        description="Do you want to delete this post?"
        title="Delete"
        visible={showConfirm}
        icon={<MaterialIcons name="delete-forever" color={"red"} size={24} />}
        onConfirm={(confirm) => {
          ref.current?.close();
          setShowConfirm(false);
          if (confirm) {
            PostService.delete(item.id as string);
          }
        }}
      />
    </>
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
          <FlatList
            data={posts}
            renderItem={({ item }) =>
              role === Role.DOCTOR ? (
                <DoctorPost item={item} />
              ) : (
                <RenderPost item={item} />
              )
            }
            keyExtractor={(item) => item.id || item.title}
          />
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <MaterialIcons
            name="disabled-visible"
            size={46}
            color={themeColors.accent}
          />
          <Text style={{ marginLeft: 10 }} fontFamily={"$js6"} fontSize={32}>
            No Posts
          </Text>
        </View>
      )}
      <CreatePost />
    </PostContext.Provider>
  );
}
