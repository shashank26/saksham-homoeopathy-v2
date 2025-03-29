import { useAuth } from "@/components/auth/hooks/useAuth";
import { Redirect, router, Slot } from "expo-router";
import { useLayoutEffect } from "react";

export default function Index() {
  return <Redirect href={'/authorized'} />
}
