import { UserProfile } from "./Auth.service";
import { db } from "./Firebase.service";
import { StorageService } from "./Storage.service";
import * as Crypto from "expo-crypto";

export class UserService {
  static USER_COLLECTION = db.collection("users");

  static userHash = new Map<string, UserProfile>();

  static profileFolder = (id: string) => `profile/images/${id}`;

  static profileImagePath = (id: string) =>
    `${this.profileFolder(id)}/${Crypto.randomUUID()}.jpg`;

  static onUserUpdate(callback: (users: UserProfile[]) => void) {
    this.USER_COLLECTION.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const userProfile: UserProfile = {
            displayName: change.doc.data().displayName,
            phoneNumber: change.doc.data().phoneNumber,
            photoUrl: change.doc.data().photoUrl,
            id: change.doc.id,
          };
          this.userHash.set(change.doc.id, userProfile);
        } else if (change.type === "removed") {
          this.userHash.delete(change.doc.id);
        }
        callback(Array.from(this.userHash.values()));
      });
    });
  }

  static getUser(id: string) {
    return this.userHash.get(id);
  }

  static async uploadProfileImage(userId: string, value: Blob) {
    await StorageService.removeFolder(this.profileFolder(userId));
    return StorageService.setItem(this.profileImagePath(userId), value);
  }
}
