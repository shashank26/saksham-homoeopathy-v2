import { Role } from "@/services/Firebase.service";
import { useAuth } from "../auth/hooks/useAuth";
import { AdminBookingsScreen } from "./admin/AdminBookingsScreen";
import { UserBookingsScreen } from "./user/UserBookingsScreen";

export const BookingScreen = () => {
  const { role } = useAuth();

  if (role === Role.USER) {
    return <UserBookingsScreen />;
  }
  return <AdminBookingsScreen />;
};
