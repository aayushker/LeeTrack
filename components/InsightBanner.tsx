'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Zap, Target, BookOpen, Award } from 'lucide-react';

interface Insight {
    icon: React.ReactNode;
    text: string;
    color: string;
}

interface InsightBannerProps {
    insights: Insight[];
}

export const InsightBanner = ({ insights }: InsightBannerProps) => {
    if (insights.length === 0) return null;

    return (
        <div style={{
            display: 'flex',
            gap: '12px',
            overflowX: 'auto',
            paddingBottom: '4px',
        }}>
            {insights.map((insight, i) => (
                <div
                    key={i}
                    className="insight-card"
                    style={{ minWidth: '280px', maxWidth: '320px' }}
                >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                        <div style={{
                            padding: '8px',
                            borderRadius: 'var(--r-sm)',
                            background: `${insight.color}18`,
                            color: insight.color,
                            flexShrink: 0,
                        }}>
                            {insight.icon}
                        </div>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>
                            {insight.text}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Helper to generate insights from data
export function generateInsights(params: {
    totalAttended: number;
    totalMissed: number;
    avgRank: number;
    bestRank: number;
    recentImprovement: number | null;
    topTopics: { topic: string; count: number }[];
    participationRate: number;
    totalQuestions: number;
}): Insight[] {
    const { totalAttended, totalMissed, avgRank, bestRank, recentImprovement, topTopics, participationRate, totalQuestions } = params;
    const insights: Insight[] = [];

    if (recentImprovement != null) {
        if (recentImprovement > 0) {
            insights.push({
                icon: <TrendingUp size={16} />,
                text: `Your average rank improved by ${recentImprovement}% in your last 10 contests. Keep the momentum!`,
                color: 'var(--green)',
            });
        } else if (recentImprovement < 0) {
            insights.push({
                icon: <TrendingDown size={16} />,
                text: `Your average rank dropped ${Math.abs(recentImprovement)}% over the last 10 contests. More practice needed.`,
                color: 'var(--yellow)',
            });
        }
    }

    if (bestRank > 0) {
        insights.push({
            icon: <Award size={16} />,
            text: `Your personal best rank is #${bestRank.toLocaleString()}. Can you beat it in the next contest?`,
            color: 'var(--primary-light)',
        });
    }

    if (topTopics.length > 0) {
        insights.push({
            icon: <Target size={16} />,
            text: `You've solved the most problems tagged "${topTopics[0].topic}" (${topTopics[0].count}×). Great strength!`,
            color: 'var(--blue)',
        });
    }

    if (participationRate > 0) {
        insights.push({
            icon: <Zap size={16} />,
            text: `You've participated in ${participationRate}% of all past contests (${totalAttended} attended, ${totalMissed} missed).`,
            color: 'var(--yellow)',
        });
    }

    if (totalQuestions > 0) {
        insights.push({
            icon: <BookOpen size={16} />,
            text: `You've logged ${totalQuestions} problems across ${totalAttended} contests — ${(totalQuestions / Math.max(totalAttended, 1)).toFixed(1)} avg per contest.`,
            color: 'var(--green)',
        });
    }

    return insights;
}
