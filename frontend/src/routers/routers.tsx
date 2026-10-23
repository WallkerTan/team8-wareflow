import { createBrowserRouter, Navigate } from "react-router-dom";
import NotFound from "../page/NotFound";
import ForbiddenPage from "../page/ForbiddenPage";
import LandingPage from "../page/LandingPage";
import UserLayout from "../layout/UserLayout";
import AdminLayout from "../layout/AdminLayout";
import AuthLayout from "../layout/AuthLayout";

// Guards
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { PublicOnlyRoute } from "../components/auth/PublicOnlyRoute";

// Auth Pages
import LoginPage from "../page/au/LoginPage";

// Admin Pages
import AdminDashboardPage from "../page/ad/AdminDashboardPage";
import AdminUsersPage from "../page/ad/AdminUsersPage";
import AdminCategoriesPage from "../page/ad/AdminCategoriesPage";
import AdminSuppliersPage from "../page/ad/AdminSuppliersPage";
import AdminProfilePage from "../page/ad/AdminProfilePage";

// Warehouse Pages
import ProductsPage from "../page/warehouse/ProductsPage";
import ReceiptsPage from "../page/warehouse/ReceiptsPage";
import IssuesPage from "../page/warehouse/IssuesPage";
import ShippingPage from "../page/warehouse/ShippingPage";
import HistoryPage from "../page/warehouse/HistoryPage";
import ProfilePage from "../page/warehouse/ProfilePage";
import ProfileSharedPage from "../page/common/ProfileSharedPage";

const router_wareflow = createBrowserRouter([
    // Public Landing
    {
        path: "/",
        element: <LandingPage />,
    },

    // Public Only: Login
    {
        element: <PublicOnlyRoute />,
        children: [
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
                ],
            },
            {
                path: "/login",
                element: (
                    <AuthLayout>
                        <LoginPage />
                    </AuthLayout>
                ),
            },
        ],
    },

    // Protected Route: ADMIN ONLY
    {
        element: <ProtectedRoute allowedRoles={["ADMIN"]} />,
        children: [
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
                        path: "suppliers",
                        element: <AdminSuppliersPage />,
                    },
                    {
                        path: "profile",
                        element: <AdminProfilePage />,
                    },
                ],
            },
        ],
    },

    // Protected Route: WAREHOUSE_OWNER ONLY
    {
        element: <ProtectedRoute allowedRoles={["WAREHOUSE_OWNER"]} />,
        children: [
            {
                path: "/warehouse",
                element: <UserLayout />,
                children: [
                    {
                        index: true,
                        element: <ProductsPage />,
                    },
                    {
                        path: "products",
                        element: <ProductsPage />,
                    },
                    {
                        path: "inventory",
                        element: <ProductsPage />,
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
                        path: "shipments",
                        element: <ShippingPage />,
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
                        path: "profile",
                        element: <ProfilePage />,
                    },
                ],
            },
            // Alias /user -> /warehouse/products
            {
                path: "/user",
                element: <Navigate to="/warehouse/products" replace />,
            },
        ],
    },

    // General Protected Routes (Any Authenticated Role)
    {
        element: <ProtectedRoute />,
        children: [
            {
                path: "/profile",
                element: (
                    <div className="min-h-screen bg-slate-900 p-6">
                        <ProfileSharedPage />
                    </div>
                ),
            },
            {
                path: "/change-password",
                element: (
                    <div className="min-h-screen bg-slate-900 p-6">
                        <ProfileSharedPage />
                    </div>
                ),
            },
        ],
    },

    // Error pages
    {
        path: "/forbidden",
        element: <ForbiddenPage />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);

export default router_wareflow;
