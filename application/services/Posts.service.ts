import {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { db } from "./Firebase.service";

export type Post = {
  createdAt: Date;
  updatedAt: Date;
  title: string;
  body: string;
  media: {
    type: "image" | "video";
    url: string;
  };
  id?: string;
};

const postConverter = {
  toFirestore(post: Post): FirebaseFirestoreTypes.DocumentData {
    return {
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      title: post.title,
      body: post.body,
      media: post.media,
    };
  },
  fromFirestore(snapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot): Post {
    const data = snapshot.data();
    return {
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate(),
      title: data.title,
      body: data.body,
      media: data.media,
      id: snapshot.id,
    };
  },
};

export class PostService {
  static get posts() {
    return db.collection("posts");
  }

  static latestPostDocumentId: string | undefined;

  static postHash = new Map<string, Post>();

  static onPostUpdate(callback: (posts: Post[]) => void) {
    this.posts.limit(1).onSnapshot((snapshot) => {
      if (snapshot.empty) return;
      const newPosts = snapshot.docChanges();
      newPosts.forEach((change) => {
        const post = postConverter.fromFirestore(change.doc);
        if (change.type === "added") {
          this.postHash.set(change.doc.id, post);
        } else if (change.type === "modified") {
          this.postHash.set(change.doc.id, post);
        } else if (change.type === "removed") {
          this.postHash.delete(change.doc.id);
        }
      });
      callback([...this.postHash.values()]);
    });
  }

  static async getPosts(): Promise<Post[]> {
    let queryBuilder = this.posts
      .orderBy("updatedAt", "desc")
      .limit(10)
    if (this.latestPostDocumentId) {
        queryBuilder = queryBuilder.startAfter(this.latestPostDocumentId);
    }
    const querySnapshot = await queryBuilder.get();
    querySnapshot.docs.forEach((snapshot) => {
      const post = postConverter.fromFirestore(snapshot);
      this.postHash.set(post.id as string, post);
    });

    return [...this.postHash.values()];
  }
}
