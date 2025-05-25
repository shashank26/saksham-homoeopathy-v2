import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

if (__DEV__) {
  // firestore().useEmulator("localhost", 8080);
  // auth().useEmulator("http://localhost:9099");
}

export const userAuth = auth();
export const db = firestore();

export enum Role {
  ADMIN = "admin",
  USER = "user",
  DOCTOR = "doctor",
}
