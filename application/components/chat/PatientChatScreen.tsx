import { Redirect } from "expo-router";
import { useAuth } from "../auth/hooks/useAuth";

export const PatientChatScreen = () => {
  const { profile } = useAuth();
  return (
    <Redirect
      href={{
        pathname: "/authorized/home/chat/[id]",
        params: { id: `${profile?.id}` },
      }}
    />
  );
};
