import { createContext, useContext, useState, ReactNode } from 'react';

interface AppUser {
    username: string;
    sessionToken: string;
}
  
interface AuthContextType {
    appUser: AppUser | null;
    setAppUser: (user: AppUser | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [appUser, setAppUser] = useState<AppUser | null>(null);

    return (
        <AuthContext.Provider value={{ appUser, setAppUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
