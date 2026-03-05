'use client';

import React from 'react';
import { LucideIcon, TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface StatCardProps {
    label: string;
    value: string | number;
    icon: LucideIcon;
    iconColor?: string;
    iconBg?: string;
    trend?: number | null;  // positive = improvement
    trendLabel?: string;
    accent?: string;        // top border accent color
    subtitle?: string;
}

export const StatCard = ({
    label, value, icon: Icon, iconColor = 'var(--primary-light)', iconBg = 'rgba(124,92,252,0.12)',
    trend, trendLabel, accent, subtitle
}: StatCardProps) => {
    const trendIsPositive = trend != null && trend > 0;
    const trendIsNegative = trend != null && trend < 0;

    return (
        <div className="glass-panel" style={{
            position: 'relative',
            overflow: 'hidden',
            padding: '20px 22px',
            borderTop: accent ? `2px solid ${accent}` : undefined,
        }}>
            {/* Glow */}
            {accent && (
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, height: '60px',
                    background: `linear-gradient(180deg, ${accent}18 0%, transparent 100%)`,
                    pointerEvents: 'none',
                }} />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{
                        width: '36px', height: '36px',
                        background: iconBg,
                        borderRadius: 'var(--r-sm)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: iconColor,
                    }}>
                        <Icon size={18} />
                    </div>
                    {trend != null && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            fontSize: '0.75rem', fontWeight: 600,
                            color: trendIsPositive ? 'var(--green)' : trendIsNegative ? 'var(--red)' : 'var(--text-3)',
                        }}>
                            {trendIsPositive ? <TrendingUp size={13} /> : trendIsNegative ? <TrendingDown size={13} /> : <Minus size={13} />}
                            {trendIsPositive ? '+' : ''}{trend}%
                        </div>
                    )}
                </div>
                <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', fontWeight: 600, marginBottom: '8px' }}>
                    {label}
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text)', lineHeight: 1 }}>
                    {value}
                </div>
                {subtitle && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '6px' }}>{subtitle}</div>
                )}
                {trendLabel && trend != null && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '5px' }}>{trendLabel}</div>
                )}
            </div>
        </div>
    );
};
