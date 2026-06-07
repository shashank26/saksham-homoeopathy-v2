import * as admin from "firebase-admin";
import { Query } from "firebase-admin/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";

const BATCH_SIZE = 400;

async function deleteQueryBatch(query: Query): Promise<void> {
  const snapshot = await query.limit(BATCH_SIZE).get();
  if (snapshot.empty) {
    return;
  }

  const batch = admin.firestore().batch();
  snapshot.docs.forEach((doc) => batch.delete(doc.ref));
  await batch.commit();

  if (snapshot.size >= BATCH_SIZE) {
    await deleteQueryBatch(query);
  }
}

async function deleteChatWithMessages(chatId: string): Promise<void> {
  const chatRef = admin.firestore().collection("chat").doc(chatId);
  await deleteQueryBatch(chatRef.collection("messages"));
  await chatRef.delete();
}

async function deleteProfileStorage(uid: string): Promise<void> {
  const bucket = admin.storage().bucket();
  try {
    await bucket.deleteFiles({ prefix: `profile/images/${uid}/` });
  } catch (error) {
    console.warn(`Storage cleanup skipped for ${uid}:`, error);
  }
}

export const deleteUserAccountFunction = onCall(async (request) => {
  if (!request.auth?.uid) {
    throw new HttpsError(
      "unauthenticated",
      "You must be signed in to delete your account.",
    );
  }

  const uid = request.auth.uid;
  const userRecord = await admin.auth().getUser(uid);
  const phoneNumber = userRecord.phoneNumber;

  if (!phoneNumber) {
    throw new HttpsError(
      "failed-precondition",
      "Account has no phone number; contact support to delete your data.",
    );
  }

  try {
    await deleteQueryBatch(
      admin.firestore().collection("notifications").where("userId", "==", phoneNumber),
    );
    await deleteQueryBatch(
      admin.firestore().collection("history").where("phoneNumber", "==", phoneNumber),
    );
    await deleteQueryBatch(
      admin.firestore().collection("booking_slots").where("phoneNumber", "==", phoneNumber),
    );

    const chatsSnapshot = await admin
      .firestore()
      .collection("chat")
      .where("participants", "array-contains", uid)
      .get();

    for (const chatDoc of chatsSnapshot.docs) {
      await deleteChatWithMessages(chatDoc.id);
    }

    const doctorChatsSnapshot = await admin
      .firestore()
      .collection("chat")
      .where("participants", "array-contains", phoneNumber)
      .get();

    for (const chatDoc of doctorChatsSnapshot.docs) {
      await deleteChatWithMessages(chatDoc.id);
    }

    await admin.firestore().collection("users").doc(uid).delete();
    await deleteProfileStorage(uid);
    await admin.auth().deleteUser(uid);

    return { success: true };
  } catch (error) {
    console.error(`Account deletion failed for ${uid}:`, error);
    throw new HttpsError(
      "internal",
      "Could not delete your account. Please try again or email support.",
    );
  }
});
