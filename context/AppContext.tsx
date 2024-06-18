import { createContext, useContext, useState, ReactNode } from 'react';
  
interface AppContextType {
    isWelcome: boolean;
    isDarkMode: boolean;
    setIsWelcome: (value: boolean) => void;
    setIsDarkMode: (value: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [ isWelcome, setIsWelcome ] = useState<boolean>(false);
    const [ isDarkMode, setIsDarkMode ] = useState<boolean>(false);

    return (
        <AppContext.Provider value={{ isWelcome, setIsWelcome, isDarkMode, setIsDarkMode }}>
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
