import { createBrowserRouter } from "react-router-dom";
import NotFound from "../page/NotFound";
import LandingPage from "../page/LandingPage";
import ProfilePage from "../page/warehouse/ProfilePage";

const router_wareflow = createBrowserRouter([
    {
        index: true,
        element: <LandingPage />,
    },

    {
        path: "/link của mỗi ng",
        element: <NotFound />,// trang mình code
    },
    {
        path: "/warehouse/profile",
        element: <ProfilePage />,
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);
export default router_wareflow;
