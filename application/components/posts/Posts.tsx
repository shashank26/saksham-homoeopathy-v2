import { Role } from "@/services/Firebase.service";
import { MomentService } from "@/services/Moment.service";
import { Post, PostService } from "@/services/Posts.service";
import { themeColors } from "@/themes/themes";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "@tamagui/core";
import React, { useRef, useState } from "react";
import { FlatList, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import { Swipeable } from "react-native-gesture-handler";
import { Spinner, XStack, YStack } from "tamagui";
import { useAuth } from "../auth/hooks/useAuth";
import { ConfirmDialog } from "../common/Alert";
import { ImageViewer, VideoViewer } from "../common/MediaViewer";
import { ShimmerImage } from "../common/ShimmerImage";
import { CreatePost, EditPostSheet } from "./CreatePost";
import usePosts from "./hooks/usePosts";

const isEdited = (item: Post) =>
  item.updatedAt.getTime() - item.createdAt.getTime() > 60_000;

const RenderPost: React.FC<{ item: Post }> = ({ item }) => {
  const [isMediaVisible, setMediaVisible] = useState(false);
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
        <XStack style={{ flex: 1, alignItems: "center" }} gap={8}>
          <Text fontFamily={"$js4"} fontSize={12} color="#666">
            {MomentService.timeAgo(item.updatedAt)}
          </Text>
          {isEdited(item) ? (
            <Text fontFamily={"$js4"} fontSize={11} color="#999">
              Edited
            </Text>
          ) : null}
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
          url={item.media.thumbnail || item.media.url}
          size={{
            height: 200,
            width: "100%",
          }}
          onPress={() => {
            setMediaVisible(true);
          }}
          resizeMode="contain"
          borderRadius={10}
        />
      )}
      {item.media?.type === "video" ? (
        <VideoViewer
          onClose={() => setMediaVisible(false)}
          show={isMediaVisible}
          uri={item.media.url}
        />
      ) : (
        <ImageViewer
          onClose={() => setMediaVisible(false)}
          show={isMediaVisible}
          uris={[{ uri: item.media?.url as string }]}
        />
      )}
    </YStack>
  );
};

const DoctorPost: React.FC<{ item: Post }> = ({ item }) => {
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState(false);
  const ref = useRef<Swipeable>(null);

  return (
    <>
      <Swipeable
        ref={ref}
        renderRightActions={() => (
          <XStack>
            <Pressable
              onPress={() => {
                ref.current?.close();
                setEditOpen(true);
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 80,
                backgroundColor: themeColors.accent,
              }}
            >
              <MaterialIcons name="edit" size={28} color="#fff" />
            </Pressable>
            <Pressable
              onPress={() => {
                ref.current?.close();
                setShowConfirm(true);
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 80,
              }}
            >
              <MaterialIcons name="delete" size={32} color={"#ff0000"} />
            </Pressable>
          </XStack>
        )}
      >
        <RenderPost item={item} />
      </Swipeable>
      <EditPostSheet
        post={item}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
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
    <>
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
    </>
  );
}
