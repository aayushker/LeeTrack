'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Trophy, Target, BarChart2, Code2 } from 'lucide-react';

const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/contests', label: 'Contests', icon: Trophy },
    { path: '/analytics', label: 'Analytics', icon: BarChart2 },
    { path: '/practice', label: 'Practice', icon: Target },
];

export const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="sidebar">
            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '8px 10px', marginBottom: '32px' }}>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                    background: 'linear-gradient(135deg, #7c5cfc 0%, #5b3ae0 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 14px rgba(124, 92, 252, 0.45)',
                }}>
                    <Code2 color="white" size={19} strokeWidth={2.2} />
                </div>
                <div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, letterSpacing: '-0.025em', color: 'var(--text)', lineHeight: 1.2 }}>
                        LeetTracker
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 400 }}>
                        Contest Analytics
                    </div>
                </div>
            </div>

            {/* Nav section */}
            <div style={{ marginBottom: '8px', paddingLeft: '10px', marginTop: '-4px' }}>
                <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', fontWeight: 600 }}>
                    Navigation
                </span>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.path);
                    const Icon = item.icon;
                    return (
                        <Link key={item.path} href={item.path} style={{ textDecoration: 'none' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '11px',
                                padding: '9px 12px',
                                borderRadius: 'var(--r-md)',
                                background: isActive ? 'rgba(124, 92, 252, 0.14)' : 'transparent',
                                color: isActive ? 'var(--primary-light)' : 'var(--text-2)',
                                transition: 'all var(--t-fast)',
                                cursor: 'pointer',
                                fontWeight: isActive ? 600 : 400,
                                fontSize: '0.875rem',
                                borderLeft: `2px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                                marginLeft: isActive ? '0' : '0',
                            }}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                        e.currentTarget.style.color = 'var(--text)';
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.color = 'var(--text-2)';
                                    }
                                }}
                            >
                                <Icon size={17} />
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom */}
            <div style={{ marginTop: 'auto', padding: '16px 10px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-2)', marginBottom: '3px' }}>Stay Consistent.</div>
                    <div>Rank improves with reps.</div>
                </div>
            </div>
        </aside>
    );
};
