import { AuthService, UserProfile } from "@/services/Auth.service";
import { Role } from "@/services/Firebase.service";
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
  setError?: (err: any) => void;
  profile?: UserProfile | null;
  updateProfile?: (profile: UserProfile) => Promise<void>;
  role?: Role | null;
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
  const [role, setRole] = useState<Role | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirebaseAuthTypes.PhoneAuthError | null>(
    null
  );

  const onAuthStateChanged = async (user: FirebaseAuthTypes.User | null) => {
    if (user) {
      AuthService.setUser(user);
      setUser(user);
      let userProfile = await AuthService.getUserProfile();
      if (userProfile) {
        setProfile(userProfile);
      } else {
        userProfile = await AuthService.putUserProfile({
          displayName: user.displayName || user.phoneNumber || "",
          phoneNumber: user.phoneNumber || "",
          photoUrl: user.photoURL || "",
        });
      }
      let role = await AuthService.getUserRole();
      setRole(role);
      setProfile(userProfile);
    } else {
      setUser(null);
      setProfile(null);
      setRole(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    const subscriber = AuthService.Auth.onAuthStateChanged(onAuthStateChanged);
    AuthService.onProfileUpdate((profile) => {
      setProfile(profile);
    });
    return () => {
      subscriber();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        signIn: (phoneNumber: number) => {
          try {
            return AuthService.signIn("+91", phoneNumber);
          } catch (err) {
            setError(err as any);
            throw err;
          }
        },
        updateProfile: async (profile: UserProfile) => {
          try {
            const updatedProfile = await AuthService.putUserProfile(profile);
            setProfile(updatedProfile);
          } catch (err) {
            setError(err as any);
            throw err;
          }
        },
        signOut: () => {
          return AuthService.signOut();
        },
        isLoading: loading,
        setError,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
