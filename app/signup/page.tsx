"use client";

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Eye, EyeOff } from "lucide-react";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [redirectLogin, setRedirectLogin] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuggestions([]);
    setRedirectLogin(false);
    setLoading(true);
    const result = await signup(username.trim(), password);
    setLoading(false);

    if (result.ok) {
      router.push("/");
    } else {
      setError(result.error || "Signup failed.");
      if (result.suggestions) setSuggestions(result.suggestions);
      if (result.redirectLogin) setRedirectLogin(true);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle} className="glass-panel">
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={logoStyle}>
            <UserPlus size={22} color="var(--primary-light)" />
          </div>
          <h1
            style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "6px" }}
          >
            Create account
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--text-3)" }}>
            Join LeetTracker to track your progress
          </p>
        </div>

        {error && (
          <div style={errorStyle}>
            <p>{error}</p>
            {redirectLogin && (
              <p style={{ marginTop: "6px", fontSize: "0.82rem" }}>
                <Link href="/login" style={linkStyle}>
                  Click here to login instead →
                </Link>
              </p>
            )}
            {suggestions.length > 0 && (
              <div style={{ marginTop: "10px" }}>
                <p style={{ fontSize: "0.8rem", color: "var(--text-2)" }}>
                  Suggested usernames:
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    marginTop: "6px",
                  }}
                >
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setUsername(s);
                        setError("");
                        setSuggestions([]);
                        setRedirectLogin(false);
                      }}
                      style={suggestionStyle}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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
              placeholder="Choose a username"
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
                minLength={4}
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
            {loading ? "Creating account…" : "Create Account"}
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
          Already have an account?{" "}
          <Link href="/login" style={linkStyle}>
            Sign in
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
  padding: "12px 14px",
  background: "var(--red-dim)",
  border: "1px solid var(--red-border)",
  borderRadius: "var(--r-md)",
  color: "var(--red)",
  fontSize: "0.85rem",
  marginBottom: "8px",
};

const suggestionStyle: React.CSSProperties = {
  padding: "4px 10px",
  background: "rgba(124,92,252,0.15)",
  border: "1px solid rgba(124,92,252,0.3)",
  borderRadius: "99px",
  color: "var(--primary-light)",
  fontSize: "0.8rem",
  cursor: "pointer",
};

const linkStyle: React.CSSProperties = {
  color: "var(--primary-light)",
  textDecoration: "none",
  fontWeight: 500,
};
