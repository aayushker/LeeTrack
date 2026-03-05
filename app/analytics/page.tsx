'use client';

import React, { useMemo } from 'react';
import { useTracker } from '../../context/TrackerContext';
import { RankChart } from '../../components/RankChart';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
    LineChart, Line, CartesianGrid, PieChart, Pie, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

const DIFF_COLORS = { Easy: '#22d785', Medium: '#f59e0b', Hard: '#f43f5e' };

export default function AnalyticsPage() {
    const {
        allContests, questions, rankHistory, topTopics, isLoading,
        totalAttended, totalMissed, participationRate, avgRank, bestRank, recentImprovement,
    } = useTracker();

    // Problems per attended contest (last 20)
    const problemsPerContest = useMemo(() => {
        return allContests
            .filter(c => c.attended)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-20)
            .map(c => ({
                label: c.title.replace('Weekly Contest ', 'WC-').replace('Biweekly Contest ', 'BW-'),
                solved: c.questionsSolved ?? 0,
            }));
    }, [allContests]);

    // Monthly participation (last 12 months)
    const monthlyParticipation = useMemo(() => {
        const now = new Date();
        const months: { month: string; attended: number; total: number; rate: number }[] = [];
        for (let i = 11; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const nextD = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
            const monthContests = allContests.filter(c => {
                const cd = new Date(c.date);
                return cd >= d && cd < nextD && cd <= now;
            });
            const monthAttended = monthContests.filter(c => c.attended).length;
            const month = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            months.push({ month, attended: monthAttended, total: monthContests.length, rate: monthContests.length > 0 ? Math.round((monthAttended / monthContests.length) * 100) : 0 });
        }
        return months;
    }, [allContests]);

    // Difficulty breakdown
    const diffData = useMemo(() => {
        const c = { Easy: 0, Medium: 0, Hard: 0 };
        questions.forEach(q => { c[q.difficulty]++; });
        return [
            { name: 'Easy', value: c.Easy },
            { name: 'Medium', value: c.Medium },
            { name: 'Hard', value: c.Hard },
        ].filter(d => d.value > 0);
    }, [questions]);

    if (isLoading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-3)' }}>Loading analytics...</div>;
    }

    const tooltipStyle = { background: '#13162a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px' }} className="animate-in">

            {/* Overview stats strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {[
                    { label: 'Total Attended', value: totalAttended, color: 'var(--primary-light)' },
                    { label: 'Total Missed', value: totalMissed, color: 'var(--text-2)' },
                    { label: 'Participation', value: `${participationRate}%`, color: 'var(--green)' },
                    { label: 'Average Rank', value: avgRank > 0 ? `#${avgRank.toLocaleString()}` : '—', color: 'var(--blue)' },
                    { label: 'Best Rank', value: bestRank > 0 ? `#${bestRank.toLocaleString()}` : '—', color: 'var(--yellow)' },
                ].map((s, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '18px 20px' }}>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', marginBottom: '8px' }}>{s.label}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 700, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Rank over time */}
            <div className="glass-panel">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '3px' }}>Rank Over Time</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>All attended contests · lower is better</p>
                    </div>
                    {recentImprovement != null && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '6px 14px', borderRadius: '99px',
                            background: recentImprovement > 0 ? 'var(--green-dim)' : 'rgba(244,63,94,0.1)',
                            color: recentImprovement > 0 ? 'var(--green)' : 'var(--red)',
                            fontSize: '0.8rem', fontWeight: 600,
                        }}>
                            {recentImprovement > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                            {recentImprovement > 0 ? `+${recentImprovement}%` : `${recentImprovement}%`} last 10 contests
                        </div>
                    )}
                </div>
                <RankChart data={rankHistory} height={300} />
            </div>

            {/* Two-column: Problems per contest + Monthly participation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

                {/* Problems solved per contest */}
                <div className="glass-panel">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>Problems per Contest</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '20px' }}>Last 20 attended contests</p>
                    {problemsPerContest.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={problemsPerContest} margin={{ top: 0, right: 4, left: -20, bottom: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                                <XAxis dataKey="label" tick={{ fontSize: 9, fill: 'var(--text-3)' }} angle={-45} textAnchor="end" tickLine={false} axisLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: 'var(--text-3)' }} tickLine={false} axisLine={false} allowDecimals={false} domain={[0, 4]} />
                                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                <Bar dataKey="solved" fill="var(--primary)" radius={[4, 4, 0, 0]} label={{ position: 'top', fontSize: 10, fill: 'var(--text-3)' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state" style={{ height: '220px', fontSize: '0.875rem' }}>No contest data yet</div>
                    )}
                </div>

                {/* Monthly participation rate */}
                <div className="glass-panel">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>Monthly Participation</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '20px' }}>Contests attended vs available</p>
                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={monthlyParticipation} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
                            <XAxis dataKey="month" tick={{ fontSize: 10, fill: 'var(--text-3)' }} tickLine={false} axisLine={false} />
                            <YAxis tick={{ fontSize: 11, fill: 'var(--text-3)' }} tickLine={false} axisLine={false} unit="%" domain={[0, 100]} />
                            <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} formatter={(v: any) => [`${v}%`, 'Rate']} />
                            <Line type="monotone" dataKey="rate" stroke="var(--green)" strokeWidth={2}
                                dot={{ fill: 'var(--green)', r: 3, strokeWidth: 0 }}
                                activeDot={{ fill: '#fff', r: 4, strokeWidth: 0 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Two-column: Difficulty breakdown + Top Topics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>

                {/* Difficulty */}
                <div className="glass-panel">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>Difficulty Breakdown</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '20px' }}>{questions.length} problems logged</p>
                    {diffData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={diffData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={4} dataKey="value">
                                        {diffData.map((entry, i) => (
                                            <Cell key={i} fill={DIFF_COLORS[entry.name as keyof typeof DIFF_COLORS]} stroke="rgba(0,0,0,0.3)" strokeWidth={1} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '8px' }}>
                                {diffData.map(d => (
                                    <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DIFF_COLORS[d.name as keyof typeof DIFF_COLORS] }} />
                                        <span style={{ fontSize: '0.72rem', color: 'var(--text-2)' }}>{d.name} ({d.value})</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="empty-state" style={{ height: '180px', fontSize: '0.875rem' }}>No problems logged yet</div>
                    )}
                </div>

                {/* Topic Weaknesses */}
                <div className="glass-panel">
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>Top 8 Topics</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '20px' }}>Most common in your solved problems</p>
                    {topTopics.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={topTopics.map(t => ({ name: t.topic, count: t.count }))} layout="vertical"
                                margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false}
                                    tick={{ fill: 'var(--text-2)', fontSize: 12 }} width={120} />
                                <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                <Bar dataKey="count" fill="var(--primary)" radius={[0, 6, 6, 0]}
                                    background={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }}
                                    label={{ position: 'right', fontSize: 11, fill: 'var(--text-3)' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="empty-state" style={{ height: '260px', fontSize: '0.875rem' }}>Log problems to see topic analytics</div>
                    )}
                </div>
            </div>
        </div>
    );
}
