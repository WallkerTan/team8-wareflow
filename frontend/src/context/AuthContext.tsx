import React, { createContext, useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/Store";
import {
    setCredentials,
    clearCredentials,
    updateUser,
    setAuthLoading,
    setAuthenticated,
} from "../store/slice/authSlice";
import { authService } from "../api/services/authService";
import type { RegisterRequest, Role, UserResponse } from "../types";

interface AuthContextType {
    user: UserResponse | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    role: Role | null;
    login: (email: string, password: string) => Promise<UserResponse>;
    register: (data: RegisterRequest) => Promise<UserResponse>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<UserResponse | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const dispatch = useAppDispatch();
    const { user, accessToken, refreshToken, isAuthenticated, isLoading } =
        useAppSelector((state) => state.auth);

    // On app init, validate the token from store/sessionStorage by fetching /api/me
    useEffect(() => {
        const initAuth = async () => {
            if (accessToken) {
                try {
                    const profile = await authService.getMe();
                    dispatch(updateUser(profile));
                    dispatch(setAuthenticated(true));
                } catch {
                    // Token invalid or expired (and refresh failed) — clear state
                    dispatch(clearCredentials());
                }
            }
            dispatch(setAuthLoading(false));
        };
        initAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run only once on mount

    const login = async (
        email: string,
        password: string,
    ): Promise<UserResponse> => {
        const response = await authService.login({ email, password });
        dispatch(
            setCredentials({
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            }),
        );
        return response.user;
    };

    const register = async (data: RegisterRequest): Promise<UserResponse> => {
        const response = await authService.register(data);
        dispatch(
            setCredentials({
                user: response.user,
                accessToken: response.accessToken,
                refreshToken: response.refreshToken,
            }),
        );
        return response.user;
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch {
            // Ignore error on logout call
        } finally {
            dispatch(clearCredentials());
        }
    };

    const refreshProfile = async (): Promise<UserResponse | null> => {
        try {
            const profile = await authService.getMe();
            dispatch(updateUser(profile));
            return profile;
        } catch {
            return null;
        }
    };

    const value: AuthContextType = {
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        isLoading,
        role: user?.role || null,
        login,
        register,
        logout,
        refreshProfile,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
