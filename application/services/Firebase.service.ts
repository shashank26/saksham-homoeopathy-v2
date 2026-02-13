import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import storage from "@react-native-firebase/storage";

// if (__DEV__) {
// firestore().useEmulator("localhost", 8080);
// auth().useEmulator("http://localhost:9099");
// storage().useEmulator("localhost", 9199);
// }

export const userAuth = auth();
export const db = firestore();
db.settings({
  persistence: true,
});
export const fileStore = storage();

export enum Role {
  ADMIN = "admin",
  USER = "user",
  DOCTOR = "doctor",
}
