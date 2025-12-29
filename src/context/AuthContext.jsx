import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, getProfile } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const userData = await getProfile();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    async function login(email, password) {
        const data = await apiLogin(email, password);
        setUser(data.user); // Assuming API returns { user: ... }
        return data;
    }

    async function logout() {
        try {
            await apiLogout();
        } finally {
            setUser(null);
        }
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
