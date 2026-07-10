import {
  AppVersionConfig,
  AppUpdateService,
  UpdateEvaluation,
} from "@/services/AppUpdate.service";
import { FC, PropsWithChildren, useCallback, useEffect, useRef, useState } from "react";
import { AppState, Linking } from "react-native";
import { AppUpdatePrompt } from "./AppUpdatePrompt";

const EMPTY_EVALUATION: UpdateEvaluation = {
  status: "none",
  storeUrl: "",
  message: "",
  targetVersion: "",
};

export const AppUpdateGate: FC<PropsWithChildren> = ({ children }) => {
  const [evaluation, setEvaluation] = useState<UpdateEvaluation>(EMPTY_EVALUATION);
  const configRef = useRef<AppVersionConfig | null>(null);

  const refreshEvaluation = useCallback(
    async (versionConfig: AppVersionConfig | null) => {
      const installed = AppUpdateService.getInstalledVersion();
      const dismissed = await AppUpdateService.getDismissedVersion(
        installed.platform,
      );
      setEvaluation(
        AppUpdateService.evaluateUpdate(versionConfig, installed, dismissed),
      );
    },
    [],
  );

  useEffect(() => {
    if (__DEV__) return;

    const unsubscribe = AppUpdateService.subscribeToVersionConfig((next) => {
      configRef.current = next;
      void refreshEvaluation(next);
    });

    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void refreshEvaluation(configRef.current);
      }
    });

    return () => {
      unsubscribe();
      subscription.remove();
    };
  }, [refreshEvaluation]);

  const handleUpdate = useCallback(() => {
    if (!evaluation.storeUrl) return;
    void Linking.openURL(evaluation.storeUrl);
  }, [evaluation.storeUrl]);

  const handleLater = useCallback(async () => {
    const installed = AppUpdateService.getInstalledVersion();
    await AppUpdateService.markUpdateDismissed(
      installed.platform,
      evaluation.targetVersion,
    );
    setEvaluation(EMPTY_EVALUATION);
  }, [evaluation.targetVersion]);

  return (
    <>
      {children}
      <AppUpdatePrompt
        visible={evaluation.status !== "none"}
        status={evaluation.status}
        message={evaluation.message}
        onUpdate={handleUpdate}
        onLater={evaluation.status === "optional" ? handleLater : undefined}
      />
    </>
  );
};
