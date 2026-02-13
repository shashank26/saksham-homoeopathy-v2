import fetch from "node-fetch";
import * as firestore from "firebase-functions/firestore";
import * as admin from "firebase-admin";

const sendPush = async (
  tokens: string[],
  title: string,
  body: string,
  data: any
) => {
  console.log("[sendPush] Sending push", {
    tokenCount: tokens.length,
    title,
    data,
  });

  const messages = tokens.map((token) => ({
    to: token,
    sound: "default",
    title,
    body,
    data,
  }));

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messages),
  });

  const json = await res.json();

  console.log("[sendPush] Expo response:", JSON.stringify(json, null, 2));

  return json;
};

const getUser = async (userId: string) => {
  console.log("[getUser] Fetching user", userId);

  const snap = await admin.firestore().collection("users").doc(userId).get();

  if (!snap.exists) {
    console.warn("[getUser] User not found", userId);
    return null;
  }

  return snap.data();
};

export const onNewMessageFunction =
  firestore.onDocumentCreatedWithAuthContext(
    "chat/{chatId}/messages/{messageId}",
    async ({ data, params }) => {
      console.log("[onNewMessage] Trigger fired", {
        chatId: params.chatId,
        messageId: params.messageId,
      });

      const message = data?.data();
      const chatId = params.chatId;

      if (!message || !chatId) {
        console.warn("[onNewMessage] Missing message or chatId");
        return;
      }

      const { sender, message: text } = message;

      console.log("[onNewMessage] New message", {
        sender,
        textPreview: text?.slice(0, 50),
      });

      const chatSnap = await admin.firestore()
        .collection("chat")
        .doc(chatId)
        .get();

      if (!chatSnap.exists) {
        console.warn("[onNewMessage] Chat not found", chatId);
        return;
      }

      const chatData = chatSnap.data();
      const participants: string[] = chatData?.participants || [];

      if (!participants.length) {
        console.warn("[onNewMessage] No participants in chat", chatId);
        return;
      }

      console.log("[onNewMessage] Participants", participants);

      // 🔥 Fetch users in parallel
      const users = await Promise.all(
        participants.map((id) => getUser(id))
      );

      let senderTitle = "";
      const tokens: string[] = [];

      users.forEach((user, index) => {
        if (!user) return;

        const userId = participants[index];

        if (userId === sender) {
          senderTitle = user.name || user.phoneNumber || "";
          console.log("[onNewMessage] Sender identified", {
            userId,
            senderTitle,
          });
          return;
        }

        const pushToken = user.expoPushToken;
        if (!pushToken) {
          console.log("[onNewMessage] No push token for user", userId);
          return;
        }

        if (Array.isArray(pushToken)) {
          tokens.push(...pushToken);
        } else {
          tokens.push(pushToken);
        }
      });

      if (!tokens.length) {
        console.log("[onNewMessage] No push tokens found, skipping push");
        return;
      }

      console.log("[onNewMessage] Sending push", {
        tokens,
        senderTitle,
      });

      await sendPush(
        tokens,
        `New message${senderTitle ? ` from ${senderTitle}` : ""}`,
        text,
        { chatId }
      );

      console.log("[onNewMessage] Push sent successfully", { chatId });
    }
  );
