'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

// Pages that don't require authentication
const PUBLIC_ROUTES = ['/', '/login', '/signup', '/reset-password'];

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (isAuthLoading) return;
    // If not logged in and trying to access a protected page → redirect to landing
    if (!user && !isPublic) {
      router.replace('/');
    }
  }, [user, isAuthLoading, isPublic, router]);

  // While checking auth status, render nothing (avoids flash)
  if (isAuthLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--bg-gradient)',
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: '3px solid rgba(124,92,252,0.3)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // If protected page and not logged in, render nothing while redirect happens
  if (!user && !isPublic) return null;

  return <>{children}</>;
};
