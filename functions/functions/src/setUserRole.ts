import * as admin from "firebase-admin";
import * as firestore from "firebase-functions/firestore";
import Role from "./constants";

export const setUserRoleFunction = firestore.onDocumentCreatedWithAuthContext(
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
          , setting default role(User).`,
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
        { merge: true },
      );
      console.log(`Role ${roleData.role} set for user ${userId}`);
    } catch (error) {
      console.error(`Error setting role for user ${userId}:`, error);
    }
  },
);
