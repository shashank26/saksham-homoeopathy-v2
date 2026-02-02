import { useAuth } from "@/components/auth/hooks/useAuth";
import { DoctorChatScreen } from "@/components/chat/DoctorChatScreen";
import { PatientChatScreen } from "@/components/chat/PatientChatScreen";
import { Role } from "@/services/Firebase.service";

const Index: React.FC = () => {
  const { role } = useAuth();
  if (role === Role.DOCTOR) {
    return <DoctorChatScreen />;
  } 
  return <PatientChatScreen />;
};

export default Index;
