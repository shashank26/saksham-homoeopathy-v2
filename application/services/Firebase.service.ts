import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";

// if (__DEV__) {
// firestore().useEmulator("localhost", 8080);
// auth().useEmulator("http://localhost:9099");
// storage().useEmulator("localhost", 9199);
// }

export const userAuth = auth();
export const db = firestore();
export const fileStore = storage();

export enum Role {
  ADMIN = "admin",
  USER = "user",
  DOCTOR = "doctor",
}
