'use client';

import React, { useMemo, useState } from 'react';
import { useTracker } from '../../context/TrackerContext';
import { BookOpen, ExternalLink, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';

type DiffFilter = 'all' | 'Easy' | 'Medium' | 'Hard';

export default function PracticePage() {
    const { allContests, questions, isLoading } = useTracker();
    const router = useRouter();
    const [diffFilter, setDiffFilter] = useState<DiffFilter>('all');
    const [topicFilter, setTopicFilter] = useState('');

    // Gather all questions NOT solved during a contest (practice questions)
    const practiceQuestions = useMemo(() => {
        return questions.filter(q => !q.solvedDuringContest);
    }, [questions]);

    // Filtered
    const filtered = useMemo(() => {
        return practiceQuestions.filter(q => {
            if (diffFilter !== 'all' && q.difficulty !== diffFilter) return false;
            if (topicFilter && !q.topics.some(t => t.toLowerCase().includes(topicFilter.toLowerCase()))) return false;
            return true;
        });
    }, [practiceQuestions, diffFilter, topicFilter]);

    // Group by contest
    const groupedByContest = useMemo(() => {
        const map = new Map<string, typeof filtered>();
        filtered.forEach(q => {
            if (!map.has(q.contestId)) map.set(q.contestId, []);
            map.get(q.contestId)!.push(q);
        });
        return Array.from(map.entries()).map(([contestId, qs]) => {
            const contest = allContests.find(c => c.id === contestId);
            return { contest, qs };
        }).sort((a, b) => {
            if (!a.contest || !b.contest) return 0;
            return new Date(b.contest.date).getTime() - new Date(a.contest.date).getTime();
        });
    }, [filtered, allContests]);

    // All topics for filter suggestions
    const allTopics = useMemo(() => {
        const set = new Set<string>();
        practiceQuestions.forEach(q => q.topics.forEach(t => set.add(t)));
        return Array.from(set).sort();
    }, [practiceQuestions]);

    if (isLoading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-3)' }}>Loading...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '48px' }} className="animate-in">

            {/* Header */}
            <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '5px' }}>Practice Tracker</h1>
                <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>
                    Problems you solved as practice — outside of contest time
                </p>
            </div>

            {/* Stats strip */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                {[
                    { label: 'Practice Problems', value: practiceQuestions.length, color: 'var(--primary-light)' },
                    { label: 'Easy', value: practiceQuestions.filter(q => q.difficulty === 'Easy').length, color: 'var(--green)' },
                    { label: 'Medium', value: practiceQuestions.filter(q => q.difficulty === 'Medium').length, color: 'var(--yellow)' },
                    { label: 'Hard', value: practiceQuestions.filter(q => q.difficulty === 'Hard').length, color: 'var(--red)' },
                ].map((s, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '16px 20px' }}>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', marginBottom: '6px' }}>{s.label}</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, letterSpacing: '-0.03em' }}>{s.value}</div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
                <Filter size={14} color="var(--text-3)" />
                <div className="filter-pills">
                    {(['all', 'Easy', 'Medium', 'Hard'] as DiffFilter[]).map(d => (
                        <button
                            key={d}
                            className={`filter-pill ${diffFilter === d ? 'active' : ''}`}
                            onClick={() => setDiffFilter(d)}
                            style={d !== 'all' && diffFilter !== d ? {
                                color: d === 'Easy' ? 'var(--green)' : d === 'Medium' ? 'var(--yellow)' : 'var(--red)',
                                borderColor: d === 'Easy' ? 'var(--green-border)' : d === 'Medium' ? 'var(--yellow-border)' : 'var(--red-border)',
                            } : undefined}
                        >
                            {d === 'all' ? 'All Difficulties' : d}
                        </button>
                    ))}
                </div>

                {allTopics.length > 0 && (
                    <div style={{ marginLeft: 'auto' }}>
                        <input
                            type="text"
                            list="topics-list"
                            placeholder="Filter by topic..."
                            value={topicFilter}
                            onChange={e => setTopicFilter(e.target.value)}
                            style={{
                                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 'var(--r-md)', padding: '7px 14px', color: 'var(--text)',
                                fontSize: '0.8rem', fontFamily: 'inherit', outline: 'none', width: '200px',
                            }}
                        />
                        <datalist id="topics-list">
                            {allTopics.map(t => <option key={t} value={t} />)}
                        </datalist>
                    </div>
                )}
            </div>

            {/* Content */}
            {practiceQuestions.length === 0 ? (
                <div className="glass-panel">
                    <div className="empty-state" style={{ padding: '60px 0' }}>
                        <BookOpen size={48} style={{ opacity: 0.15 }} />
                        <h3 style={{ color: 'var(--text-2)', fontSize: '1rem' }}>No practice problems yet</h3>
                        <p style={{ fontSize: '0.875rem', maxWidth: '360px', lineHeight: 1.6 }}>
                            When you log a problem from a contest you didn't attend live (or solve a problem after the contest), it will appear here.
                        </p>
                        <button className="btn btn-primary" onClick={() => router.push('/contests')} style={{ marginTop: '8px' }}>
                            Browse Contests
                        </button>
                    </div>
                </div>
            ) : groupedByContest.length === 0 ? (
                <div className="empty-state">
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-2)' }}>No problems match your filters</div>
                </div>
            ) : (
                groupedByContest.map(({ contest, qs }, gi) => (
                    <div key={gi}>
                        {/* Contest group header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-2)' }}>
                                    {contest?.title || 'Unknown Contest'}
                                </h3>
                                {contest && (
                                    <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                                        {new Date(contest.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                    </span>
                                )}
                                <span style={{ fontSize: '0.72rem', color: 'var(--yellow)', background: 'var(--yellow-dim)', border: '1px solid var(--yellow-border)', borderRadius: '99px', padding: '2px 8px' }}>
                                    {qs.length} {qs.length === 1 ? 'problem' : 'problems'}
                                </span>
                            </div>
                            {contest && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button className="btn btn-ghost btn-icon" style={{ fontSize: '0.72rem', gap: '5px', padding: '5px 10px', borderRadius: 'var(--r-sm)' }}
                                        onClick={() => router.push(`/contests/${contest.id}`)}>
                                        View contest
                                    </button>
                                    <a href={contest.url} target="_blank" rel="noopener noreferrer"
                                        className="btn btn-ghost btn-icon" style={{ fontSize: '0.72rem', gap: '5px', padding: '5px 10px', borderRadius: 'var(--r-sm)' }}>
                                        <ExternalLink size={12} />
                                        LeetCode
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Problems */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {qs.map(q => (
                                <div key={q.id} className="glass-panel" style={{ padding: '14px 18px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <h4 style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '7px' }}>{q.title}</h4>
                                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                {q.topics.map((t, i) => (
                                                    <span key={i} className="badge badge-topic">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                                            <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '6px' }}>
                                                {new Date(q.dateSolved).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
