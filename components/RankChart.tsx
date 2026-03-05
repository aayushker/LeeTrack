'use client';

import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';
import type { RankPoint } from '../context/TrackerContext';

interface RankChartProps {
    data: RankPoint[];
    height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: 'rgba(13,15,24,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px',
                padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '4px' }}>
                    {payload[0]?.payload?.contestTitle}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary-light)', letterSpacing: '-0.02em' }}>
                    #{payload[0]?.value?.toLocaleString()}
                </div>
            </div>
        );
    }
    return null;
};

export const RankChart = ({ data, height = 280 }: RankChartProps) => {
    if (data.length === 0) {
        return (
            <div className="empty-state" style={{ height }}>
                <div style={{ fontSize: '0.875rem' }}>No rank data yet</div>
            </div>
        );
    }

    // Recharts: we want rank to go DOWN toward the top (lower rank = better)
    // So we keep the data as-is but reverse the Y axis
    const tickCount = Math.min(5, data.length);

    return (
        <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="rankGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7c5cfc" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#7c5cfc" stopOpacity={0.0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: 'var(--text-3)' }}
                    axisLine={false} tickLine={false}
                    interval={Math.max(0, Math.floor(data.length / 7) - 1)}
                />
                <YAxis
                    reversed
                    tick={{ fontSize: 11, fill: 'var(--text-3)' }}
                    axisLine={false} tickLine={false}
                    tickCount={tickCount}
                    tickFormatter={(v) => `#${(v / 1000).toFixed(0)}k`}
                    width={40}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="rank"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    fill="url(#rankGrad)"
                    dot={{ fill: 'var(--primary)', r: 3, strokeWidth: 0 }}
                    activeDot={{ fill: 'var(--primary-light)', r: 5, strokeWidth: 0 }}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
