import * as admin from "firebase-admin";
import * as firestore from "firebase-functions/firestore";
import Role from "./constants";

admin.initializeApp();

const seed = () => {
  // admin.auth().createUser({
  //   phoneNumber: "+919643018020",
  // });
  // admin.firestore().collection("roles").doc("+919643018020").set({
  //   role: "doctor",
  // });
};

const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

if (isEmulator) {
  console.log("⚙️ Running in emulator");
  seed();
} else {
  console.log("🚀 Running in production");
}

export const setUserRole = firestore.onDocumentCreatedWithAuthContext(
  "users/{userId}",
  async (event) => {
    const doc = event.data?.data() as { phoneNumber: string };
    const userId = event.params.userId as string;

    console.log("Document created:", doc, "User Id:", event.params.userId);

    try {
      const role = await admin
        .firestore()
        .collection("roles")
        .doc(doc.phoneNumber)
        .get();
      if (role.exists) {
        const roleData = role.data() as { role: Role };
        console.log("role document reference:", roleData);
        await admin.auth().setCustomUserClaims(userId, {
          role: roleData.role,
        });
        console.log(`Role ${roleData.role} set for user ${userId}`);
      } else {
        console.log(
          `No role found for phone number: 
          ${doc.phoneNumber}
          , setting default role(User).`
        );
        await admin.auth().setCustomUserClaims(userId, {
          role: Role.USER,
        });
        console.log(`Role ${Role.USER} set for user ${userId}`);
      }
    } catch (error) {
      console.error(`Error setting role for user ${userId}:`, error);
    }
  }
);
