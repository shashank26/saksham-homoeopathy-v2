import { useAuth } from "@/components/auth/hooks/useAuth";
import { AdminHistoryScreen } from "@/components/history/admin/AdminHistoryScreen";
import { UserHistoryScreen } from "@/components/history/user/UserHistoryScreen";
import { Role } from "@/services/Firebase.service";
import React from "react";

const Index: React.FC = () => {
  const { role, user } = useAuth();
  if (role === Role.DOCTOR || role === Role.ADMIN) {
    return <AdminHistoryScreen />;
  }
  return <UserHistoryScreen phoneNumber={user?.phoneNumber as string} />;
};

export default Index;
