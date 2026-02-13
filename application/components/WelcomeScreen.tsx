import { FC } from "react";
import { useAuth } from "./auth/hooks/useAuth";

export const HelloText: FC = () => {
  const { user } = useAuth();
  return <></>
};
