import { createBrowserRouter } from "react-router-dom";
import NotFound from "../page/NotFound";
import LandingPage from "../page/LandingPage";

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
        path: "*",
        element: <NotFound />,
    },
]);
export default router_wareflow;
