const FIREBASE_PROJECT_ID = "saksham-homoeopathy-66ec9";
const FIREBASE_FUNCTIONS_REGION = "us-central1";

/**
 * Calls the deleteUserAccount Cloud Function via HTTPS (Firebase callable protocol).
 * Avoids @react-native-firebase/functions, which breaks Expo config on Node 20+ ESM.
 */
export async function callDeleteUserAccount(idToken: string): Promise<void> {
  const url = `https://${FIREBASE_FUNCTIONS_REGION}-${FIREBASE_PROJECT_ID}.cloudfunctions.net/deleteUserAccount`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({ data: {} }),
  });

  const body = (await response.json().catch(() => null)) as {
    error?: { message?: string; status?: string };
    result?: unknown;
  } | null;

  if (!response.ok || body?.error) {
    const message =
      body?.error?.message ??
      `Account deletion failed (${response.status})`;
    throw new Error(message);
  }
}
