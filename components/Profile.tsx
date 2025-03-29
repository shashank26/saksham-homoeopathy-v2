import { Form, Label } from "tamagui";
import { useAuth } from "./auth/hooks/useAuth";

export const Profile = () => {
  const { user } = useAuth();
  return (
    <Form alignItems="center" justifyContent="center" minWidth={300} gap={"$2"}>
      {/* <JSlabel htmlFor="name">Name</JSlabel>
      <JSInput id="name" defaultValue={user?.displayName || ""}></JSInput> */}
    </Form>
  );
};
