'use client';

import React, { useMemo } from 'react';
import type { Contest } from '../context/TrackerContext';

interface TimelineHeatmapProps {
    contests: Contest[];
    weeksToShow?: number;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const TimelineHeatmap = ({ contests, weeksToShow = 52 }: TimelineHeatmapProps) => {
    const { weeks, monthLabels } = useMemo(() => {
        // Build a date → contest map
        const contestByDate = new Map<string, Contest>();
        contests.forEach(c => {
            const d = new Date(c.date);
            const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
            contestByDate.set(key, c);
        });

        // Start from (weeksToShow) weeks ago, aligned to Sunday
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - (weeksToShow * 7) + (7 - today.getDay()));

        // Build weeks array: each week = 7 days
        const weeksArr: { date: Date; contest: Contest | null; key: string }[][] = [];
        let current = new Date(startDate);

        for (let w = 0; w < weeksToShow; w++) {
            const week = [];
            for (let d = 0; d < 7; d++) {
                const dateKey = `${current.getFullYear()}-${current.getMonth()}-${current.getDate()}`;
                const contest = contestByDate.get(dateKey) || null;
                week.push({ date: new Date(current), contest, key: dateKey });
                current.setDate(current.getDate() + 1);
            }
            weeksArr.push(week);
        }

        // Month labels: find the first column where a new month starts
        const monthLabelArr: { month: string; colIdx: number }[] = [];
        let lastMonth = -1;
        weeksArr.forEach((week, idx) => {
            const m = week[0].date.getMonth();
            if (m !== lastMonth) {
                monthLabelArr.push({ month: MONTHS[m], colIdx: idx });
                lastMonth = m;
            }
        });

        return { weeks: weeksArr, monthLabels: monthLabelArr };
    }, [contests, weeksToShow]);

    const getCellStyle = (day: { contest: Contest | null; date: Date }): React.CSSProperties => {
        const isFuture = day.date > new Date();
        if (isFuture) return { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' };
        if (!day.contest) return { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' };
        switch (day.contest.status) {
            case 'attended': return { background: 'rgba(34, 215, 133, 0.65)', boxShadow: '0 0 4px rgba(34,215,133,0.4)' };
            case 'practiced': return { background: 'rgba(245, 158, 11, 0.65)', boxShadow: '0 0 4px rgba(245,158,11,0.4)' };
            case 'missed': return { background: 'rgba(255,255,255,0.1)' };
            default: return { background: 'rgba(255,255,255,0.04)' };
        }
    };

    const getTooltip = (day: { contest: Contest | null; date: Date }) => {
        const dateStr = day.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        if (!day.contest) return dateStr;
        const status = day.contest.status === 'attended' ? '🟢 Attended' :
            day.contest.status === 'practiced' ? '🟡 Practiced' : '⚫ Missed';
        return `${day.contest.title}\n${dateStr} · ${status}`;
    };

    return (
        <div style={{ overflowX: 'auto', paddingBottom: '4px' }}>
            {/* Month labels */}
            <div style={{ display: 'flex', gap: '4px', marginBottom: '6px', paddingLeft: '30px' }}>
                {monthLabels.map((ml, i) => (
                    <div key={i} style={{
                        position: 'relative',
                        width: `${(17) * (i < monthLabels.length - 1 ? monthLabels[i + 1].colIdx - ml.colIdx : 52 - ml.colIdx)}px`,
                        fontSize: '0.65rem',
                        color: 'var(--text-3)',
                        flexShrink: 0,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                    }}>
                        {ml.month}
                    </div>
                ))}
            </div>

            {/* Grid */}
            <div style={{ display: 'flex', gap: '4px' }}>
                {/* Day labels */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingTop: '0px' }}>
                    {[0, 1, 2, 3, 4, 5, 6].map(d => (
                        <div key={d} style={{
                            width: '24px', height: '13px',
                            display: 'flex', alignItems: 'center',
                            fontSize: '0.58rem', color: 'var(--text-3)',
                            justifyContent: 'flex-end', paddingRight: '4px',
                        }}>
                            {d % 2 !== 0 ? DAYS[d].slice(0, 1) : ''}
                        </div>
                    ))}
                </div>

                {/* Weeks */}
                {weeks.map((week, wi) => (
                    <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {week.map((day, di) => (
                            <div
                                key={di}
                                className="heatmap-cell"
                                style={getCellStyle(day)}
                                title={getTooltip(day)}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '10px', paddingLeft: '30px' }}>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>Less</span>
                {[
                    { color: 'rgba(255,255,255,0.08)', label: 'Missed' },
                    { color: 'rgba(245,158,11,0.65)', label: 'Practiced' },
                    { color: 'rgba(34,215,133,0.65)', label: 'Attended' },
                ].map(item => (
                    <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: item.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>{item.label}</span>
                    </div>
                ))}
                <span style={{ fontSize: '0.65rem', color: 'var(--text-3)' }}>More</span>
            </div>
        </div>
    );
};
