'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar, Trophy, ExternalLink, ChevronRight } from 'lucide-react';
import type { Contest } from '../context/TrackerContext';
import { useTracker } from '../context/TrackerContext';

interface ContestCardProps {
    contest: Contest;
}

const STATUS_CONFIG = {
    attended: { dot: 'var(--green)', label: 'Attended', bgColor: 'var(--green-dim)' },
    practiced: { dot: 'var(--yellow)', label: 'Practiced', bgColor: 'var(--yellow-dim)' },
    missed: { dot: 'var(--text-3)', label: 'Missed', bgColor: 'transparent' },
};

export const ContestCard = ({ contest }: ContestCardProps) => {
    const router = useRouter();
    const [hovered, setHovered] = useState(false);
    const cfg = STATUS_CONFIG[contest.status];
    const { questions } = useTracker();
    const practiceCount = contest.status === 'practiced'
        ? questions.filter(q => q.contestId === contest.id).length
        : 0;

    const formattedDate = new Date(contest.date).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric'
    });

    const rankColor = contest.rank
        ? contest.rank < 3000 ? '#22d785'
            : contest.rank < 8000 ? '#f59e0b'
                : 'var(--text-2)'
        : 'var(--text-3)';

    return (
        <div
            className="glass-panel-interactive"
            style={{ padding: '18px 20px', cursor: 'pointer' }}
            onClick={() => router.push(`/contests/${contest.id}`)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '14px' }}>
                {/* Status dot */}
                <div style={{ paddingTop: '3px' }}>
                    <div className={`status-dot ${contest.status}`} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                        fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)', marginBottom: '3px',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                    }}>
                        {contest.title}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Calendar size={11} color="var(--text-3)" />
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-3)' }}>{formattedDate}</span>
                    </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', flexShrink: 0 }}>
                    <span className={`badge badge-${contest.type.toLowerCase()}`}>
                        {contest.type}
                    </span>
                </div>
            </div>

            {/* Divider */}
            <div className="divider" style={{ marginBottom: '14px' }} />

            {/* Stats / hover content */}
            {contest.status === 'attended' ? (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', marginBottom: '3px' }}>Rank</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: rankColor, letterSpacing: '-0.02em' }}>
                            {contest.rank ? `#${contest.rank.toLocaleString()}` : '—'}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', marginBottom: '3px' }}>Solved</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.02em' }}>
                            {contest.questionsSolved ?? '—'}<span style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 400 }}>/4</span>
                        </div>
                    </div>
                    {contest.timeTaken && (
                        <div>
                            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', marginBottom: '3px' }}>Time</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-2)', fontFamily: 'var(--font-mono, monospace)' }}>
                                {contest.timeTaken}
                            </div>
                        </div>
                    )}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                        <ChevronRight size={15} color="var(--text-3)" />
                    </div>
                </div>
            ) : contest.status === 'practiced' ? (
                <div style={{ display: 'flex', gap: '20px' }}>
                    <div>
                        <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', marginBottom: '3px' }}>Solved in practice</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--yellow)', letterSpacing: '-0.02em' }}>
                            {practiceCount}<span style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 400 }}>/4</span>
                        </div>
                    </div>
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center' }}>
                        <ChevronRight size={15} color="var(--text-3)" />
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>
                        {contest.isPast ? 'Not attended' : 'Upcoming'}
                    </span>
                    {contest.isPast && (
                        <a
                            href={contest.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-3)' }}
                        >
                            <ExternalLink size={12} />
                            Practice
                        </a>
                    )}
                </div>
            )}
        </div>
    );
};
