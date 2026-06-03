import { useCallback, useEffect, useState } from "react";

const RESEND_COOLDOWN_SECONDS = 30;

export function useOtpResendTimer(active: boolean) {
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN_SECONDS);

  const resetTimer = useCallback(() => {
    setSecondsLeft(RESEND_COOLDOWN_SECONDS);
  }, []);

  useEffect(() => {
    if (!active) return;
    resetTimer();
  }, [active, resetTimer]);

  useEffect(() => {
    if (!active || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [active, secondsLeft]);

  return {
    secondsLeft,
    canResend: secondsLeft === 0,
    resetTimer,
  };
}
