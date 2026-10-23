import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import router_wareflow from "./routers/routers";
import { Store } from "./store/Store";
import { injectStore } from "./api/client";
import { AuthProvider } from "./context/AuthContext";

// Inject Redux store into Axios client (avoids circular dependency)
injectStore(Store);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <Provider store={Store}>
            <AuthProvider>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3500,
                        style: {
                            background: "#0f172a",
                            color: "#f8fafc",
                            border: "1px solid #334155",
                            borderRadius: "0.75rem",
                            fontSize: "0.875rem",
                            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                        },
                        success: {
                            iconTheme: {
                                primary: "#10b981",
                                secondary: "#ffffff",
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: "#ef4444",
                                secondary: "#ffffff",
                            },
                        },
                    }}
                />
                <RouterProvider router={router_wareflow} />
            </AuthProvider>
        </Provider>
    </StrictMode>
);
