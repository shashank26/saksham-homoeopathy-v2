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
        setPosts(newPosts.sort((p1, p2) => p2.updatedAt.getTime() - p1.updatedAt.getTime()));
      });
      setLoading(posts.length > 0 ? 2 : 1);
      setLoading(0);
    })();
  }, [page]);

  return { loading, posts };
}
