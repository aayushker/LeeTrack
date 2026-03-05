"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(username.trim(), password);
    setLoading(false);
    if (result.ok) {
      router.push("/");
    } else {
      setError(result.error || "Login failed.");
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle} className="glass-panel">
        {/* Logo / Title */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={logoStyle}>
            <LogIn size={22} color="var(--primary-light)" />
          </div>
          <h1
            style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "6px" }}
          >
            Welcome back
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-3)" }}>
            Sign in to LeetTracker
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
              placeholder="Enter your username"
              required
              autoFocus
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ ...inputStyle, paddingRight: "44px" }}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                style={eyeButtonStyle}
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={submitButtonStyle}>
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <p style={{ fontSize: "0.82rem", color: "var(--text-3)" }}>
            Don&apos;t have an account?{" "}
            <Link href="/signup" style={linkStyle}>
              Create one
            </Link>
          </p>
          <p style={{ fontSize: "0.82rem", color: "var(--text-3)" }}>
            <Link href="/reset-password" style={linkStyle}>
              Forgot password?
            </Link>
          </p>
        </div>
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
  transition: "border-color var(--t-fast)",
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
  transition: "opacity var(--t-fast)",
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
