import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export type CountryCode = `+${number}`;

export class AuthService {
  private static user: FirebaseAuthTypes.User;

  static Auth() {
    return auth();
  }

  static setUser(user: FirebaseAuthTypes.User) {
    this.user = user;
  }

  static getUser() {
    return this.user;
  }

  static async putFirestoreUser() {
    if (!this.user) {
      throw new Error("User not authenticated");
    }
    const userDocRef = firestore().collection("users").doc(this.user.uid)
    const userDoc = await userDocRef.get();
    if (userDoc.exists) {
      return true;
    }
    await userDocRef.set({
      phoneNumber: this.user.phoneNumber,
      displayName: this.user.displayName,
      photoUrl: this.user.photoURL,
    });
  }

  static async signIn(countryCode: CountryCode, phoneNumber: number) {
    return this.Auth().signInWithPhoneNumber(`${countryCode}${phoneNumber}`);
  }

  static async signOut() {
    return this.Auth().signOut();
  }
}
