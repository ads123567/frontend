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
            // Need token to call getProfile, so it must be in localStorage already
            const stored = JSON.parse(localStorage.getItem("user"));
            if (!stored?.token) throw new Error("No token");

            const userData = await getProfile();
            // Important: getProfile returns only user info, so we must preserve the token
            const updatedUser = { ...userData, token: stored.token };

            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));
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
        // data has { user: {...}, token: "..." }
        // We merge them so we can store the token easily
        const userData = { ...data.user, token: data.token };
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
