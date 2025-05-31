import type { FirebaseStorageTypes } from "@react-native-firebase/storage";
import { ref } from "@react-native-firebase/storage";
import { fileStore } from "./Firebase.service";

export class StorageService {
  static readonly storage: FirebaseStorageTypes.Module = fileStore;

  private static uploadTask(task: FirebaseStorageTypes.Task): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      task.on(
        "state_changed",
        null,
        (error) => {
          console.error("Error uploading data to AsyncStorage:", error);
          reject(error);
        },
        async () => {
          const downloadURL = await task.snapshot?.ref.getDownloadURL();
          console.log(`File available at ${downloadURL}`);
          resolve(downloadURL as string);
        }
      );
    });
  }

  static async getItem(key: string): Promise<string | null> {
    try {
      const itemRef = ref(this.storage, key);
      const url = await itemRef.getDownloadURL();
      return url;
    } catch (error) {
      console.error("Error retrieving data from AsyncStorage:", error);
      return null;
    }
  }

  static async setItem(key: string, value: Blob): Promise<string | undefined> {
    try {
      const itemRef = this.storage.ref(key);
      const task = itemRef.put(value);
      const downloadURL = await this.uploadTask(task);
      return downloadURL;
    } catch (error) {
      console.error("Error saving data to AsyncStorage:", error);
    }
  }

  static async removeItem(key: string): Promise<boolean> {
    try {
      const itemRef = ref(this.storage, key);
      await itemRef.delete();
      console.log(`Item with key ${key} removed successfully.`);
      return true;
    } catch (error) {
      console.error("Error removing data from AsyncStorage:", error);
      return false;
    }
  }
}
