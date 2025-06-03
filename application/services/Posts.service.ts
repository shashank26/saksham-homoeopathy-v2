import {
  FirebaseFirestoreTypes,
  serverTimestamp,
} from "@react-native-firebase/firestore";
import { db } from "./Firebase.service";

export type CreatePostType = {
  title: string;
  body: string;
  media?: {
    type: "image" | "video";
    url: string;
  };
};

export type Post = {
  createdAt: Date;
  updatedAt: Date;
  id?: string;
  key?: string;
} & CreatePostType;

const postConverter = {
  toFirestore(post: CreatePostType): FirebaseFirestoreTypes.DocumentData {
    return {
      createdAt: new Date(),
      updatedAt: new Date(),
      title: post.title,
      body: post.body,
      media: post.media || null,
    };
  },
  fromFirestore(snapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot): Post {
    const data = snapshot.data();
    const newPost = {
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      title: data.title,
      body: data.body,
      media: data.media,
      id: snapshot.id,
      key: snapshot.id,
    };
    return newPost;
  },
};

export class PostService {
  static get posts() {
    return db.collection("posts");
  }

  static postHash = new Map<string, Post>();

  static onPostUpdate(callback: (posts: Post[]) => void) {
    this.posts
      .orderBy("updatedAt", "desc")
      .limit(100)
      .onSnapshot((snapshot) => {
        if (!snapshot) return;
        const newPosts = snapshot.docChanges();
        newPosts.forEach((change) => {
          try {
            const post = postConverter.fromFirestore(change.doc);
            if (change.type === "added") {
              this.postHash.set(change.doc.id, post);
            } else if (change.type === "modified") {
              this.postHash.set(change.doc.id, post);
            } else if (change.type === "removed") {
              this.postHash.delete(change.doc.id);
            }
            callback([...this.postHash.values()]);
          } catch (err) {
            console.log(err);
          }
        });
      });
  }

  static async create(post: CreatePostType) {
    const postData = postConverter.toFirestore(post);
    return this.posts.add(postData);
  }

  static async delete(id: string) {
    return this.posts.doc(id).delete();
  }
}
