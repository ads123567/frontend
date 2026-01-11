import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

export default function ProtectedRoute({ children, allowedRoles }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
            </div>
        );
    }

    // 1. Check Authentication: Is user logged in?
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Check Authorization: Does user have the required role?
    // Only run this check if allowedRoles is provided
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to home (or an unauthorized page) if role doesn't match
        return <Navigate to="/" replace />;
    }

    return children;
}