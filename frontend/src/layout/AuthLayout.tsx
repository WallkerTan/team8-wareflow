import { Outlet } from "react-router-dom";
import "../page/au/auth.css";

const AuthLayout = () => {
    return (
        <main className="auth-screen">
            <Outlet />
        </main>
    );
};

export default AuthLayout;
