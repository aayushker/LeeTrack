"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Plus,
  Search,
  LogOut,
  User,
  KeyRound,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

const PAGE_TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/contests": "Contest Explorer",
  "/analytics": "Analytics",
  "/practice": "Practice Tracker",
};

export const TopBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const title =
    Object.entries(PAGE_TITLES).find(([path]) =>
      pathname.startsWith(path),
    )?.[1] ?? "LeetTracker";

  const initials = user ? user.username.slice(0, 2).toUpperCase() : "LC";

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="topbar">
      {/* Page Title */}
      <div style={{ flex: 1 }}>
        <h2
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "var(--text)",
            margin: 0,
            letterSpacing: "-0.01em",
          }}
        >
          {title}
        </h2>
      </div>

      {/* Search */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "var(--r-md)",
          padding: "7px 14px",
          width: "200px",
          cursor: "text",
        }}
      >
        <Search size={14} color="var(--text-3)" />
        <span style={{ fontSize: "0.8rem", color: "var(--text-3)" }}>
          Search contests...
        </span>
      </div>

      {/* Quick Add */}
      <Link href="/contests">
        <button
          className="btn btn-primary"
          style={{ gap: "7px", fontSize: "0.8rem", padding: "7px 14px" }}
        >
          <Plus size={15} />
          Log Contest
        </button>
      </Link>

      {/* User Avatar + Dropdown */}
      <div ref={menuRef} style={{ position: "relative", flexShrink: 0 }}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "99px",
            padding: "4px 10px 4px 4px",
            cursor: "pointer",
            transition: "border-color var(--t-fast)",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #7c5cfc 0%, #22d785 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.7rem",
              fontWeight: 700,
              color: "#fff",
            }}
          >
            {initials}
          </div>
          {user && (
            <span
              style={{
                fontSize: "0.82rem",
                color: "var(--text-2)",
                fontWeight: 500,
              }}
            >
              {user.username}
            </span>
          )}
          <ChevronDown
            size={13}
            color="var(--text-3)"
            style={{
              transform: menuOpen ? "rotate(180deg)" : "none",
              transition: "transform var(--t-fast)",
            }}
          />
        </button>

        {menuOpen && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              minWidth: "180px",
              background: "var(--bg-2)",
              border: "var(--glass-border)",
              borderRadius: "var(--r-md)",
              boxShadow: "var(--glass-shadow)",
              padding: "6px",
              zIndex: 100,
            }}
          >
            {user ? (
              <>
                <div
                  style={{
                    padding: "8px 12px 10px",
                    borderBottom: "1px solid rgba(255,255,255,0.07)",
                    marginBottom: "4px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: "var(--text)",
                    }}
                  >
                    {user.username}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-3)",
                      marginTop: "1px",
                    }}
                  >
                    Logged in
                  </div>
                </div>
                <MenuItem
                  icon={<KeyRound size={14} />}
                  label="Reset Password"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/reset-password");
                  }}
                />
                <MenuItem
                  icon={<LogOut size={14} />}
                  label="Logout"
                  onClick={handleLogout}
                  danger
                />
              </>
            ) : (
              <>
                <MenuItem
                  icon={<User size={14} />}
                  label="Login"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/login");
                  }}
                />
                <MenuItem
                  icon={<User size={14} />}
                  label="Sign Up"
                  onClick={() => {
                    setMenuOpen(false);
                    router.push("/signup");
                  }}
                />
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
        width: "100%",
        padding: "8px 12px",
        background: "none",
        border: "none",
        borderRadius: "var(--r-sm)",
        color: danger ? "var(--red)" : "var(--text-2)",
        fontSize: "0.83rem",
        cursor: "pointer",
        textAlign: "left",
        transition: "background var(--t-fast)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = danger
          ? "var(--red-dim)"
          : "rgba(255,255,255,0.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "none";
      }}
    >
      {icon}
      {label}
    </button>
  );
}
