import * as admin from "firebase-admin";
admin.initializeApp();

import { setUserRoleFunction } from "./setUserRole";
import { onNewMessageFunction } from "./pushNotifications";
import { deleteUserAccountFunction } from "./deleteUserAccount";

// const seed = () => {
// admin.auth().createUser({
//   phoneNumber: "+919643018020",
// });
// admin.firestore().collection("roles").doc("+919643018020").set({
//   role: "doctor",
// });
// };

const isEmulator = process.env.FUNCTIONS_EMULATOR === "true";

if (isEmulator) {
  console.log("⚙️ Running in emulator");
  // seed();
} else {
  console.log("🚀 Running in production");
}

export const setUserRole = setUserRoleFunction;
export const onNewMessage = onNewMessageFunction;
export const deleteUserAccount = deleteUserAccountFunction;
