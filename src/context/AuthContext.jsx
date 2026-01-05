import { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, logout as apiLogout, getProfile } from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate from local storage for instant UI
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem("user");
            }
        }
        checkAuth();
    }, []);

    async function checkAuth() {
        try {
            const userData = await getProfile();
            setUser(userData);
            localStorage.setItem("user", JSON.stringify(userData)); // Sync fresh data
        } catch (error) {
            console.error("Auth check failed", error);
            setUser(null);
            localStorage.removeItem("user");
        } finally {
            setLoading(false);
        }
    }

    async function login(email, password) {
        const data = await apiLogin(email, password);
        const userData = data.user;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return data;
    }

    async function logout() {
        try {
            await apiLogout();
        } finally {
            setUser(null);
            localStorage.removeItem("user");
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
