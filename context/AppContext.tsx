import { createContext, useContext, useState, ReactNode } from 'react';
  
interface AppContextType {
    isWelcome: boolean;
    setIsWelcome: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [ isWelcome, setIsWelcome ] = useState<boolean>(false);

    return (
        <AppContext.Provider value={{ isWelcome, setIsWelcome }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
