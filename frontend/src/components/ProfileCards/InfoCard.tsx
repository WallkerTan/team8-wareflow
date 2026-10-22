import React from "react";
import { type UserProfile, roleLabel, getInitials } from "./types";

// ─── W17: Thông tin cá nhân ───────────────────────────────────────────────────
const InfoCard: React.FC<{ user: UserProfile }> = ({ user }) => (
    <div className="profile-card info-card">
        <div className="card-header">
            <div className="card-title-group">
                <span className="card-icon">👤</span>
                <div>
                    <h2 className="card-title">Thông tin cá nhân</h2>
                    <p className="card-subtitle">Hồ sơ tài khoản của bạn</p>
                </div>
            </div>
        </div>

        <div className="avatar-section">
            <div className="avatar-ring">
                <div className="avatar-circle">{getInitials(user.full_name)}</div>
            </div>
            <div className="avatar-info">
                <h3 className="avatar-name">{user.full_name}</h3>
                <span className="role-badge">{roleLabel[user.role] ?? user.role}</span>
            </div>
        </div>

        <div className="info-grid">
            <div className="info-row">
                <span className="info-label">
                    <i className="icon-sm">◆</i>Họ và tên
                </span>
                <span className="info-value">{user.full_name}</span>
            </div>
            <div className="divider" />
            <div className="info-row">
                <span className="info-label">
                    <i className="icon-sm">✉</i>Email
                </span>
                <span className="info-value">{user.email}</span>
            </div>
            <div className="divider" />
            <div className="info-row">
                <span className="info-label">
                    <i className="icon-sm">◆</i>Vai trò
                </span>
                <span className="info-value">{roleLabel[user.role] ?? user.role}</span>
            </div>
        </div>
    </div>
);

export default InfoCard;
