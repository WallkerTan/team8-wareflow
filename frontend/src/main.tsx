import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import router_wareflow from "./routers/routers";
import { Store } from "./store/Store";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={Store}>
            <RouterProvider router={router_wareflow} />
        </Provider>
    </StrictMode>,
);
