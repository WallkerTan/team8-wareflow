export type Role = "ADMIN" | "WAREHOUSE_OWNER";
export type UserStatus = "ACTIVE" | "LOCKED";

export interface UserResponse {
    id: number;
    email: string;
    fullName: string;
    role: Role;
    status: UserStatus;
    phone?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: UserResponse;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface UpdateProfileRequest {
    fullName: string;
    email?: string;
    phone?: string;
    address?: string;
}

export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
}
