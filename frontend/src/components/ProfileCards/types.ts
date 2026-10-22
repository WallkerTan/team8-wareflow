export interface UserProfile {
    full_name: string;
    email: string;
    role: string;
}

export const roleLabel: Record<string, string> = {
    owner: "Chủ kho",
    admin: "Quản trị viên",
    staff: "Nhân viên",
};

export const getInitials = (name: string) =>
    name.split(" ").slice(-2).map((w) => w[0]).join("").toUpperCase();
