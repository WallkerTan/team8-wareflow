import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFound from "../page/NotFound";
import LandingPage from "../page/LandingPage";
import UserLayout from "../layout/UserLayout";
import AdminLayout from "../layout/AdminLayout";
import AuthLayout from "../layout/AuthLayout";

// Warehouse Pages
import DashboardPage from "../page/warehouse/DashboardPage";
import InventoryPage from "../page/warehouse/InventoryPage";
import ReceiptsPage from "../page/warehouse/ReceiptsPage";
import IssuesPage from "../page/warehouse/IssuesPage";
import ShippingPage from "../page/warehouse/ShippingPage";
import HistoryPage from "../page/warehouse/HistoryPage";
import ReportsPage from "../page/warehouse/ReportsPage";
import SettingsPage from "../page/warehouse/SettingsPage";
import StatisticsPage from "../page/warehouse/StatisticsPage";
import ProfilePage from "../page/warehouse/ProfilePage";

// Admin Pages
import AdminDashboardPage from "../page/ad/AdminDashboardPage";
import AdminUsersPage from "../page/ad/AdminUsersPage";
import AdminCategoriesPage from "../page/ad/AdminCategoriesPage";
import AdminProfilePage from "../page/ad/AdminProfilePage";

// Auth Pages
import LoginPage from "../page/au/LoginPage";
import RegisterPage from "../page/au/RegisterPage";
import ForgotPasswordPage from "../page/au/ForgotPasswordPage";

const router_wareflow = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    // User Layout (Warehouse)
    {
        path: "/warehouse",
        element: <UserLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "inventory",
                element: <InventoryPage />,
            },
            {
                path: "receipts",
                element: <ReceiptsPage />,
            },
            {
                path: "issues",
                element: <IssuesPage />,
            },
            {
                path: "shipping",
                element: <ShippingPage />,
            },
            {
                path: "history",
                element: <HistoryPage />,
            },
            {
                path: "reports",
                element: <ReportsPage />,
            },
            {
                path: "settings",
                element: <SettingsPage />,
            },
            {
                path: "statistics",
                element: <StatisticsPage />,
            },
            {
                path: "profile",
                element: <ProfilePage />,
            },
        ],
    },
    // Alias /user -> /warehouse
    {
        path: "/user",
        element: <Navigate to="/warehouse" replace />,
    },
    // Admin Layout
    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <AdminDashboardPage />,
            },
            {
                path: "dashboard",
                element: <AdminDashboardPage />,
            },
            {
                path: "users",
                element: <AdminUsersPage />,
            },
            {
                path: "categories",
                element: <AdminCategoriesPage />,
            },
            {
                path: "profile",
                element: <AdminProfilePage />,
            },
        ],
    },
    // Auth Layout
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/auth/login" replace />,
            },
            {
                path: "login",
                element: <LoginPage />,
            },
            {
                path: "register",
                element: <RegisterPage />,
            },
            {
                path: "forgot",
                element: <ForgotPasswordPage />,
            },
        ],
    },
    // Direct shortcut routes
    {
        path: "/login",
        element: <Navigate to="/auth/login" replace />,
    },
    {
        path: "/register",
        element: <Navigate to="/auth/register" replace />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router_wareflow;
