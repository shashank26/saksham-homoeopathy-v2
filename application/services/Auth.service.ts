import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { db, Role, userAuth } from "./Firebase.service";

export type CountryCode = `+${number}`;

export type UserProfile = {
  displayName: string;
  phoneNumber: string;
  photoUrl: string;
  id: string;
  role?: Role;
};

export class AuthService {
  private static user: FirebaseAuthTypes.User;

  static Auth = userAuth;
  static roleHash = new Map<string, Role>();

  static setUser(user: FirebaseAuthTypes.User) {
    this.user = user;
  }

  static getUser() {
    return this.user;
  }

  static async getUserRole() {
    const user = this.Auth.currentUser;

    if (user) {
      const idTokenResult = await user.getIdTokenResult(true); // force refresh
      const role = idTokenResult.claims.role;

      console.log("User role:", role);
      return role as Role;
    }

    return null;
  }

  static async getRoles() {
    db.collection("roles").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          this.roleHash.set(change.doc.id, change.doc.data().role);
        } else if (change.type === "removed") {
          this.roleHash.delete(change.doc.id);
        }
      });
    });
  }

  static async onProfileUpdate(cb: (userProfile: UserProfile) => void) {
    await db
      .collection("users")
      .doc(this.user.uid)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const data = doc.data();
          cb({
            displayName: data?.displayName || "",
            phoneNumber: data?.phoneNumber || "",
            photoUrl: data?.photoUrl || "",
            id: doc.id,
          });
        }
      });
  }

  static async getUserProfile(): Promise<UserProfile | undefined> {
    if (!this.user) {
      throw new Error("User not authenticated");
    }
    const userDocRef = db.collection("users").doc(this.user.uid);
    const doc = await userDocRef.get();
    if (doc.exists) {
      const data = doc.data();
      return {
        displayName: data?.displayName || "",
        phoneNumber: data?.phoneNumber || "",
        photoUrl: data?.photoUrl || "",
        id: doc.id,
      };
    }
    return undefined;
  }

  static async putUserProfile(profile: Partial<UserProfile>) {
    if (!this.user) {
      throw new Error("User not authenticated");
    }
    const userDocRef = db.collection("users").doc(this.user.uid);
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
      id: this.user.uid
    };
  }

  static async signIn(countryCode: CountryCode, phoneNumber: number) {
    return this.Auth.signInWithPhoneNumber(`${countryCode}${phoneNumber}`);
  }

  static async signOut() {
    return this.Auth.signOut();
  }
}
