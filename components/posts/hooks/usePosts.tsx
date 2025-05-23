import { Post, PostService } from "@/services/Posts.service";
import { useContext, useEffect, useState } from "react";
import { PostContext } from "../Post.context";

export default function usePosts() {
  const [loading, setLoading] = useState<number>(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const { page } = useContext(PostContext);
  useEffect(() => {
    (async () => {
      PostService.onPostUpdate((newPosts: Post[]) => {
        setPosts(newPosts);
      });
      setLoading(posts.length > 0 ? 2 : 1);
      setPosts(await PostService.getPosts());
      setLoading(0);
    })();
  }, [page]);

  return { loading, posts };
}
