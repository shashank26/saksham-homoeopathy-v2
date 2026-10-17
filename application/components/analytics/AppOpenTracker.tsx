import { Monitoring } from "@/services/Monitoring.service";
import { FC, useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useAuth } from "../auth/hooks/useAuth";

const FOREGROUND_DEBOUNCE_MS = 30_000;

export const AppOpenTracker: FC = () => {
  const { user, role } = useAuth();
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const lastLoggedAt = useRef(0);
  const coldStartLogged = useRef(false);

  useEffect(() => {
    if (!user || coldStartLogged.current) return;
    coldStartLogged.current = true;
    lastLoggedAt.current = Date.now();
    Monitoring.logAppOpen("cold_start", {
      userId: user.uid,
      role: role ?? undefined,
    });
  }, [user, role]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (next) => {
      const previous = appState.current;
      appState.current = next;

      const returnedToForeground =
        /inactive|background/.test(previous) && next === "active";
      if (!returnedToForeground || !user) return;

      const now = Date.now();
      if (now - lastLoggedAt.current < FOREGROUND_DEBOUNCE_MS) return;
      lastLoggedAt.current = now;

      Monitoring.logAppOpen("foreground", {
        userId: user.uid,
        role: role ?? undefined,
      });
    });

    return () => {
      subscription.remove();
    };
  }, [user, role]);

  return null;
};
