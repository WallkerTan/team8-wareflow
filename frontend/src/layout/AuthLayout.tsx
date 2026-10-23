import React from "react";
import { Outlet } from "react-router-dom";
import "../page/au/auth.css";

interface AuthLayoutProps {
    children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <main className="auth-screen">
            {children || <Outlet />}
        </main>
    );
};

export default AuthLayout;
