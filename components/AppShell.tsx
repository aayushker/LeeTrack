"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useAuth } from "../context/AuthContext";

// These routes render without the sidebar/topbar shell
const SHELL_LESS_ROUTES = ["/", "/login", "/signup", "/reset-password"];

// These routes require the user to be logged in
const PROTECTED_PREFIXES = ["/dashboard", "/contests", "/analytics", "/practice"];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthLoading } = useAuth();

  const isShellLess = SHELL_LESS_ROUTES.includes(pathname);
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    if (isAuthLoading) return;
    // Not logged in trying to visit a protected route → send to landing
    if (!user && isProtected) {
      router.replace("/");
    }
  }, [user, isAuthLoading, isProtected, router]);

  // While resolving auth, show a minimal full-page spinner so there's no flash
  if (isAuthLoading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "var(--bg-gradient)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "3px solid rgba(124,92,252,0.3)",
            borderTopColor: "var(--primary)",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Protected page but not logged in → render nothing while redirect fires
  if (isProtected && !user) return null;

  // Auth pages and the landing page get no shell
  if (isShellLess) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          marginLeft: "var(--sidebar-w)",
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <TopBar />
        <main
          style={{
            flex: 1,
            marginTop: "var(--topbar-h)",
            padding: "32px 36px 48px",
            width: "100%",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
