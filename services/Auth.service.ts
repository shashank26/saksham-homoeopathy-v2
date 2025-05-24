import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export type CountryCode = `+${number}`;

export type UserProfile = {
  displayName: string;
  phoneNumber: string;
  photoUrl: string;
};

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

  static async onProfileUpdate(cb: (userProfile: UserProfile) => void) {
    await firestore()
      .collection("users")
      .doc(this.user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          cb({
            displayName: data?.displayName || "",
            phoneNumber: data?.phoneNumber || "",
            photoUrl: data?.photoUrl || "",
          });
        }
      });
  }

  static async getUserProfile(): Promise<UserProfile | undefined> {
    if (!this.user) {
      throw new Error("User not authenticated");
    }
    const userDocRef = firestore().collection("users").doc(this.user.uid);
    const doc = await userDocRef.get();
    if (doc.exists) {
      const data = doc.data();
      return {
        displayName: data?.displayName || "",
        phoneNumber: data?.phoneNumber || "",
        photoUrl: data?.photoUrl || "",
      };
    }
    return undefined;
  }

  static async putUserProfile(profile: UserProfile) {
    if (!this.user) {
      throw new Error("User not authenticated");
    }
    const userDocRef = firestore().collection("users").doc(this.user.uid);
    await userDocRef.set(
      {
        ...profile,
        phoneNumber: this.user.phoneNumber,
      },
      { merge: true }
    );
    return {
      displayName: profile.displayName,
      phoneNumber: this.user.phoneNumber as string,
      photoUrl: profile.photoUrl,
    };
  }

  static async signIn(countryCode: CountryCode, phoneNumber: number) {
    return this.Auth().signInWithPhoneNumber(`${countryCode}${phoneNumber}`);
  }

  static async signOut() {
    return this.Auth().signOut();
  }
}
