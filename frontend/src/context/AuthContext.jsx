import { createContext, useContext } from "react";
import useAuthStore from "../store/authStore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const clearUser = useAuthStore((state) => state.clearUser);

    return (
        <AuthContext.Provider value={{ user, setUser, clearUser }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);
