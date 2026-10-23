import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const PublicOnlyRoute: React.FC = () => {
    const { isAuthenticated, isLoading, role } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            </div>
        );
    }

    if (isAuthenticated) {
        if (role === "ADMIN") {
            return <Navigate to="/admin/dashboard" replace />;
        }
        return <Navigate to="/warehouse/products" replace />;
    }

    return <Outlet />;
};
