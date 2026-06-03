import { useAuth } from "../auth/hooks/useAuth";
import { AdminBookingList } from "./BookingList";
import { UserBookingsScreen } from "./user/UserBookingsScreen";
import { Role } from "@/services/Firebase.service";

export const BookingScreen = () => {
  const { role } = useAuth();

  if (role === Role.USER) {
    return <UserBookingsScreen />;
  }
  return <AdminBookingList />;
};
