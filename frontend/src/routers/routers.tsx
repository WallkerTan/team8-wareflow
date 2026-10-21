import { createBrowserRouter } from "react-router-dom";
import NotFound from "../page/NotFound";

const router_wareflow = createBrowserRouter([
    {
        path: "*",
        element: <NotFound />,
    },
]);
export default router_wareflow;
