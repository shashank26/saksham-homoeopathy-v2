import { AuthService } from "@/services/Auth.service";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { Login } from "./Login";
import { AuthContext } from "./hooks/useAuth";

export const Auth: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      console.log(user);
      setUser(user);
    }
  };

  useEffect(() => {
    const subscriber =
      AuthService.Auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (!user) {
    return <Login />;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
