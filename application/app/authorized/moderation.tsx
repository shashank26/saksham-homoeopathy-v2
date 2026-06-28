import { ModerationScreen } from "@/components/admin/ModerationScreen";
import { LoaderScreen } from "@/components/LoaderScreen";
import { Role } from "@/services/Firebase.service";
import { router } from "expo-router";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/hooks/useAuth";

export default function ModerationRoute() {
  const { role } = useAuth();

  useEffect(() => {
    if (role === Role.USER) {
      router.replace("/authorized/home");
    }
  }, [role]);

  if (role === Role.USER || role == null) {
    return <LoaderScreen />;
  }

  return <ModerationScreen />;
}
