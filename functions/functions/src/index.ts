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
      let roleData: { role: Role };
      if (role.exists) {
        roleData = role.data() as { role: Role };
      } else {
        console.log(
          `No role found for phone number: 
          ${doc.phoneNumber}
          , setting default role(User).`
        );
        roleData = {
          role: Role.USER,
        };
      }

      await admin.auth().setCustomUserClaims(userId, {
        role: roleData.role,
      });
      await admin.firestore().collection("users").doc(userId).set(
        {
          role: roleData.role,
        },
        { merge: true }
      );
      console.log(`Role ${roleData.role} set for user ${userId}`);
    } catch (error) {
      console.error(`Error setting role for user ${userId}:`, error);
    }
  }
);
