import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import React from 'react';

export type AuthContextType = {
    user: FirebaseAuthTypes.User | null;
}

export const AuthContext = React.createContext<AuthContextType>({
    user: null,
});

export const useAuth = () => {
    return React.useContext(AuthContext);
};