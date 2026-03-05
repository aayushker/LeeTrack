"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await resetPassword(
      username.trim(),
      currentPassword,
      newPassword,
    );
    setLoading(false);
    if (result.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2500);
    } else {
      setError(result.error || "Password reset failed.");
    }
  };

  if (success) {
    return (
      <div style={containerStyle}>
        <div
          style={{ ...cardStyle, textAlign: "center" }}
          className="glass-panel"
        >
          <CheckCircle
            size={48}
            color="var(--green)"
            style={{ marginBottom: "16px" }}
          />
          <h2
            style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "8px" }}
          >
            Password updated!
          </h2>
          <p style={{ color: "var(--text-3)", fontSize: "0.9rem" }}>
            Redirecting you to login…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle} className="glass-panel">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={logoStyle}>
            <KeyRound size={22} color="var(--primary-light)" />
          </div>
          <h1
            style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "6px" }}
          >
            Reset password
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-3)" }}>
            Verify with your current password first
          </p>
        </div>

        {error && <div style={errorStyle}>{error}</div>}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <div>
            <label style={labelStyle}>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              required
              autoFocus
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Current password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ ...inputStyle, paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowCurrent((p) => !p)}
                style={eyeButtonStyle}
              >
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle}>New password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showNew ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={4}
                style={{ ...inputStyle, paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowNew((p) => !p)}
                style={eyeButtonStyle}
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-3)",
                marginTop: "4px",
              }}
            >
              Minimum 4 characters
            </p>
          </div>

          <button type="submit" disabled={loading} style={submitButtonStyle}>
            {loading ? "Updating…" : "Update Password"}
          </button>
        </form>

        <p
          style={{
            marginTop: "24px",
            textAlign: "center",
            fontSize: "0.82rem",
            color: "var(--text-3)",
          }}
        >
          Remember it now?{" "}
          <Link href="/login" style={linkStyle}>
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: "24px",
  background: "var(--bg-gradient)",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "420px",
  padding: "40px 36px",
  borderRadius: "var(--r-xl)",
};

const logoStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "48px",
  height: "48px",
  borderRadius: "var(--r-md)",
  background: "rgba(124,92,252,0.15)",
  marginBottom: "16px",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "var(--text-2)",
  marginBottom: "6px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "11px 14px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "var(--r-md)",
  color: "var(--text)",
  fontSize: "0.9rem",
  outline: "none",
};

const eyeButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "var(--text-3)",
  display: "flex",
  alignItems: "center",
};

const submitButtonStyle: React.CSSProperties = {
  marginTop: "4px",
  padding: "12px",
  background: "var(--primary)",
  border: "none",
  borderRadius: "var(--r-md)",
  color: "#fff",
  fontSize: "0.95rem",
  fontWeight: 600,
  cursor: "pointer",
  letterSpacing: "0.02em",
};

const errorStyle: React.CSSProperties = {
  padding: "11px 14px",
  background: "var(--red-dim)",
  border: "1px solid var(--red-border)",
  borderRadius: "var(--r-md)",
  color: "var(--red)",
  fontSize: "0.85rem",
  marginBottom: "8px",
};

const linkStyle: React.CSSProperties = {
  color: "var(--primary-light)",
  textDecoration: "none",
  fontWeight: 500,
};
