'use client';

import React, { useMemo } from 'react';
import { useTracker } from '../../context/TrackerContext';
import { StatCard } from '../../components/StatCard';
import { RankChart } from '../../components/RankChart';
import { TimelineHeatmap } from '../../components/TimelineHeatmap';
import { InsightBanner, generateInsights } from '../../components/InsightBanner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Activity, Zap, TrendingUp, Star, BarChart2 } from 'lucide-react';

const DIFF_COLORS = { Easy: '#22d785', Medium: '#f59e0b', Hard: '#f43f5e' };

export default function Dashboard() {
  const {
    allContests, questions, isLoading, rankHistory,
    topTopics, participationRate, totalAttended, totalMissed,
    totalPracticed, avgRank, bestRank, recentImprovement,
  } = useTracker();

  const diffData = useMemo(() => {
    const c = { Easy: 0, Medium: 0, Hard: 0 };
    questions.forEach(q => { c[q.difficulty]++; });
    return [
      { name: 'Easy', value: c.Easy },
      { name: 'Medium', value: c.Medium },
      { name: 'Hard', value: c.Hard },
    ].filter(d => d.value > 0);
  }, [questions]);

  const topicsBarData = useMemo(() =>
    topTopics.slice(0, 6).map(t => ({ name: t.topic, count: t.count }))
    , [topTopics]);

  const insights = useMemo(() => generateInsights({
    totalAttended, totalMissed, avgRank, bestRank,
    recentImprovement, topTopics, participationRate,
    totalQuestions: questions.length,
  }), [totalAttended, totalMissed, avgRank, bestRank, recentImprovement, topTopics, participationRate, questions.length]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
        {[1, 2, 3].map(i => (
          <div key={i} className="skeleton" style={{ height: '80px', borderRadius: 'var(--r-lg)' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '40px' }} className="animate-in">

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '14px' }}>
        <StatCard label="Contests Attended" value={totalAttended}
          icon={Trophy} iconColor="var(--primary-light)" iconBg="rgba(124,92,252,0.12)"
          accent="var(--primary)" />
        <StatCard label="Missed" value={totalMissed}
          icon={Activity} iconColor="var(--text-2)" iconBg="rgba(255,255,255,0.05)"
          accent="var(--text-3)" />
        <StatCard label="Practiced Later" value={totalPracticed}
          icon={Target} iconColor="var(--yellow)" iconBg="rgba(245,158,11,0.12)"
          accent="var(--yellow)" />
        <StatCard label="Average Rank" value={avgRank > 0 ? `#${avgRank.toLocaleString()}` : '—'}
          icon={BarChart2} iconColor="var(--blue)" iconBg="rgba(56,189,248,0.1)"
          accent="var(--blue)" />
        <StatCard label="Best Rank" value={bestRank > 0 ? `#${bestRank.toLocaleString()}` : '—'}
          icon={Star} iconColor="var(--yellow)" iconBg="rgba(245,158,11,0.12)"
          accent="var(--yellow)" />
        <StatCard label="Participation" value={`${participationRate}%`}
          icon={Zap} iconColor="var(--green)" iconBg="rgba(34,215,133,0.12)"
          accent="var(--green)"
          trend={recentImprovement}
          trendLabel="vs previous 5 contests" />
      </div>

      {/* Rank Trend Chart */}
      <div className="glass-panel" style={{ padding: '24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '3px' }}>Rank Trend</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Lower is better · {rankHistory.length} data points</p>
          </div>
          {recentImprovement != null && (
            <div style={{
              padding: '6px 12px',
              borderRadius: '99px',
              background: recentImprovement > 0 ? 'var(--green-dim)' : 'var(--yellow-dim)',
              color: recentImprovement > 0 ? 'var(--green)' : 'var(--yellow)',
              fontSize: '0.78rem', fontWeight: 600,
            }}>
              <TrendingUp size={13} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
              {recentImprovement > 0 ? '+' : ''}{recentImprovement}% recent
            </div>
          )}
        </div>
        <RankChart data={rankHistory} height={260} />
      </div>

      {/* Heatmap */}
      <div className="glass-panel">
        <div style={{ marginBottom: '18px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '3px' }}>Contest Activity</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-3)' }}>Last 52 weeks of contests</p>
        </div>
        <TimelineHeatmap contests={allContests} />
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div>
          <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>
            Performance Insights
          </h3>
          <InsightBanner insights={insights} />
        </div>
      )}

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
        {/* Difficulty Donut */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>Difficulty Mix</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '20px' }}>{questions.length} problems logged</p>
          {diffData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={diffData} cx="50%" cy="50%" innerRadius={52} outerRadius={72}
                    paddingAngle={4} dataKey="value">
                    {diffData.map((entry, i) => (
                      <Cell key={i} fill={DIFF_COLORS[entry.name as keyof typeof DIFF_COLORS]}
                        stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#13162a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }} itemStyle={{ color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '8px' }}>
                {diffData.map(d => (
                  <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DIFF_COLORS[d.name as keyof typeof DIFF_COLORS] }} />
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-2)' }}>{d.name} ({d.value})</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state" style={{ height: '180px' }}>
              <div style={{ fontSize: '0.875rem' }}>No problems logged yet</div>
            </div>
          )}
        </div>

        {/* Top Topics */}
        <div className="glass-panel">
          <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '6px' }}>Top Topics</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginBottom: '20px' }}>Most frequent in your solutions</p>
          {topicsBarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topicsBarData} layout="vertical" margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false}
                  tick={{ fill: 'var(--text-2)', fontSize: 12 }} width={110} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ background: '#13162a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" fill="var(--primary)" radius={[0, 6, 6, 0]}
                  background={{ fill: 'rgba(255,255,255,0.03)', radius: 6 }} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ height: '220px' }}>
              <div style={{ fontSize: '0.875rem' }}>Log problems to see topic stats</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
