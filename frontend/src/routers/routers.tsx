import { createBrowserRouter } from "react-router-dom";
import NotFound from "../page/NotFound";
import LandingPage from "../page/LandingPage";
import UserLayout from "../layout/UserLayout";

const router_wareflow = createBrowserRouter([
    {
        index: true,
        element: <LandingPage />,
    },
    {
        path: "/warehouse",
        element: <UserLayout />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);
export default router_wareflow;
