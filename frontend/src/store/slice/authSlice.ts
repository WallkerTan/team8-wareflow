import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { UserResponse } from "../../types";

interface AuthState {
    user: UserResponse | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

// Load initial state from sessionStorage (hydration on page refresh)
// Using sessionStorage as a hydration source; actual state lives in Redux
const loadInitialState = (): AuthState => {
    try {
        const accessToken = sessionStorage.getItem("wf_access") || null;
        const refreshToken = sessionStorage.getItem("wf_refresh") || null;
        const userStr = sessionStorage.getItem("wf_user");
        const user: UserResponse | null = userStr ? JSON.parse(userStr) : null;
        return {
            user,
            accessToken,
            refreshToken,
            isAuthenticated: !!(user && accessToken),
            isLoading: true, // Will validate on app init
        };
    } catch {
        return {
            user: null,
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: true,
        };
    }
};

const initialState: AuthState = loadInitialState();

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setCredentials: (
            state,
            action: PayloadAction<{
                user: UserResponse;
                accessToken: string;
                refreshToken: string;
            }>
        ) => {
            state.user = action.payload.user;
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
            state.isAuthenticated = true;
            state.isLoading = false;
            // Persist to sessionStorage for page refresh recovery
            sessionStorage.setItem("wf_access", action.payload.accessToken);
            sessionStorage.setItem("wf_refresh", action.payload.refreshToken);
            sessionStorage.setItem("wf_user", JSON.stringify(action.payload.user));
        },
        updateTokens: (
            state,
            action: PayloadAction<{
                accessToken: string;
                refreshToken?: string;
            }>
        ) => {
            state.accessToken = action.payload.accessToken;
            if (action.payload.refreshToken) {
                state.refreshToken = action.payload.refreshToken;
                sessionStorage.setItem("wf_refresh", action.payload.refreshToken);
            }
            sessionStorage.setItem("wf_access", action.payload.accessToken);
        },
        updateUser: (state, action: PayloadAction<UserResponse>) => {
            state.user = action.payload;
            sessionStorage.setItem("wf_user", JSON.stringify(action.payload));
        },
        clearCredentials: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.isLoading = false;
            sessionStorage.removeItem("wf_access");
            sessionStorage.removeItem("wf_refresh");
            sessionStorage.removeItem("wf_user");
        },
        setAuthLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setAuthenticated: (state, action: PayloadAction<boolean>) => {
            state.isAuthenticated = action.payload;
        },
    },
});

export const {
    setCredentials,
    updateTokens,
    updateUser,
    clearCredentials,
    setAuthLoading,
    setAuthenticated,
} = authSlice.actions;

export default authSlice.reducer;
