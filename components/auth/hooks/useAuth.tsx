import { AuthService } from "@/services/Auth.service";
import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import React, { useEffect, useState } from "react";

export type AuthContextType = {
  user: FirebaseAuthTypes.User | null;
  signIn?: (
    phoneNumber: number
  ) => Promise<FirebaseAuthTypes.ConfirmationResult>;
  signOut?: () => Promise<void>;
  isLoading: boolean;
  error?: FirebaseAuthTypes.PhoneAuthError;
  setError?: (err: any) => void
};

export const AuthContext = React.createContext<AuthContextType>({
  isLoading: false,
  user: null,
});

export const useAuth = () => {
  return React.useContext(AuthContext);
};

export const AuthProvider = ({ children }: React.PropsWithChildren) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirebaseAuthTypes.PhoneAuthError | null>(null);

  const onAuthStateChanged = (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      if (!user.displayName) {
        user.updateProfile({
          displayName: user.phoneNumber,
        });
      }
      setUser(user);
    }
    setLoading(false);
  };

  useEffect(() => {
    const subscriber =
      AuthService.Auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn: (phoneNumber: number) => {
            try {
                return AuthService.signIn("+91", phoneNumber);
            } catch(err) {
                setError(err as any);
                throw err;
            }
        },
        signOut: () => {
          return AuthService.signOut();
        },
        isLoading: loading,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
