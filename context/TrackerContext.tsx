'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';

export interface GlobalContest {
    id: string;
    title: string;
    type: string;
    date: string;
    contestNumber: number;
    url: string;
}

export interface UserContestData {
    contestId: string;
    rank?: number | null;
    rating?: number | null;
    attended?: boolean;
    questionsSolved?: number;
    solvedLater?: number;
    timeTaken?: string;
}

export type ContestStatus = 'attended' | 'practiced' | 'missed';

// The Merged model used by the UI
export interface Contest extends GlobalContest {
    rank?: number | null;
    rating?: number | null;
    attended: boolean;
    questionsSolved?: number;
    solvedLater?: number;
    timeTaken?: string;
    status: ContestStatus;
    isPast: boolean;
}

export interface Question {
    id: string;
    contestId: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    topics: string[];
    solvedDuringContest: boolean;
    dateSolved: string;
}

export interface RankPoint {
    date: string;
    rank: number;
    contestId: string;
    contestTitle: string;
    label: string;
}

export interface TopicStat {
    topic: string;
    count: number;
}

interface TrackerContextType {
    allContests: Contest[];
    contests: Contest[];       // Attended or practiced
    questions: Question[];
    isLoading: boolean;
    rankHistory: RankPoint[];
    topTopics: TopicStat[];
    participationRate: number;
    totalAttended: number;
    totalMissed: number;
    totalPracticed: number;
    avgRank: number;
    bestRank: number;
    recentImprovement: number | null; // % rank change (last 5 vs prev 5)
    addContest: (contestData: UserContestData) => Promise<void>;
    addQuestion: (question: Omit<Question, 'id' | 'dateSolved'>) => Promise<void>;
    updateQuestion: (question: Question) => Promise<void>;
    deleteQuestion: (questionId: string) => Promise<void>;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

export const TrackerProvider = ({ children }: { children: ReactNode }) => {
    const [globalContests, setGlobalContests] = useState<GlobalContest[]>([]);
    const [userContestsData, setUserContestsData] = useState<UserContestData[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const NOW = useMemo(() => new Date(), []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [globalRes, userRes] = await Promise.all([
                    fetch('/api/contests'),
                    fetch('/api/user')
                ]);
                if (globalRes.ok) {
                    const gData = await globalRes.json();
                    setGlobalContests(gData.contests || []);
                }
                if (userRes.ok) {
                    const uData = await userRes.json();
                    setUserContestsData(uData.contests || []);
                    setQuestions(uData.questions || []);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Build user contest map
    const userMap = useMemo(() => {
        const m = new Map<string, UserContestData>();
        userContestsData.forEach(uc => m.set(uc.contestId, uc));
        return m;
    }, [userContestsData]);

    // Build question sets
    const practicedContestIds = useMemo(() => {
        const ids = new Set<string>();
        questions.forEach(q => {
            if (!q.solvedDuringContest) ids.add(q.contestId);
        });
        return ids;
    }, [questions]);

    // Compute merged all-contests array
    const allContests = useMemo<Contest[]>(() => {
        return globalContests.map(gc => {
            const uc = userMap.get(gc.id);
            const isPast = new Date(gc.date) <= NOW;
            let status: ContestStatus = 'missed';
            if (uc?.attended) {
                status = 'attended';
            } else if (practicedContestIds.has(gc.id)) {
                status = 'practiced';
            }
            return {
                ...gc,
                rank: uc?.rank ?? null,
                rating: uc?.rating ?? null,
                attended: uc?.attended || false,
                questionsSolved: uc?.questionsSolved,
                solvedLater: uc?.solvedLater,
                timeTaken: uc?.timeTaken,
                status,
                isPast,
            };
        });
    }, [globalContests, userMap, practicedContestIds, NOW]);

    // Active contests (user interacted with)
    const activeContests = useMemo<Contest[]>(() => {
        const activeIds = new Set<string>();
        userContestsData.forEach(uc => activeIds.add(uc.contestId));
        questions.forEach(q => activeIds.add(q.contestId));
        return allContests.filter(c => activeIds.has(c.id));
    }, [allContests, userContestsData, questions]);

    // Rank history for attended contests
    const rankHistory = useMemo<RankPoint[]>(() => {
        return allContests
            .filter(c => c.attended && c.rank != null)
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(c => ({
                date: c.date,
                rank: c.rank as number,
                contestId: c.id,
                contestTitle: c.title,
                label: c.title.replace('Weekly Contest ', 'WC-').replace('Biweekly Contest ', 'BW-'),
            }));
    }, [allContests]);

    // Topic frequencies from questions
    const topTopics = useMemo<TopicStat[]>(() => {
        const topicMap: Record<string, number> = {};
        questions.forEach(q => {
            q.topics.forEach(t => {
                topicMap[t] = (topicMap[t] || 0) + 1;
            });
        });
        return Object.entries(topicMap)
            .map(([topic, count]) => ({ topic, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);
    }, [questions]);

    // Stats
    const pastContests = useMemo(() => allContests.filter(c => c.isPast), [allContests]);
    const totalAttended = useMemo(() => allContests.filter(c => c.attended).length, [allContests]);
    const totalPracticed = useMemo(() => allContests.filter(c => c.status === 'practiced').length, [allContests]);
    const totalMissed = useMemo(() => pastContests.filter(c => c.status === 'missed').length, [pastContests]);
    const participationRate = useMemo(() => pastContests.length > 0 ? Math.round((totalAttended / pastContests.length) * 100) : 0, [totalAttended, pastContests]);

    const rankedContests = useMemo(() => rankHistory.filter(r => r.rank != null), [rankHistory]);
    const avgRank = useMemo(() => rankedContests.length > 0
        ? Math.round(rankedContests.reduce((s, r) => s + r.rank, 0) / rankedContests.length)
        : 0, [rankedContests]);
    const bestRank = useMemo(() => rankedContests.length > 0
        ? Math.min(...rankedContests.map(r => r.rank))
        : 0, [rankedContests]);

    const recentImprovement = useMemo(() => {
        if (rankedContests.length < 10) return null;
        const last5 = rankedContests.slice(-5).map(r => r.rank);
        const prev5 = rankedContests.slice(-10, -5).map(r => r.rank);
        const avgLast = last5.reduce((s, r) => s + r, 0) / 5;
        const avgPrev = prev5.reduce((s, r) => s + r, 0) / 5;
        // Rank improvement = rank went DOWN numerically = positive %
        return Math.round(((avgPrev - avgLast) / avgPrev) * 100);
    }, [rankedContests]);

    const addContest = async (contestData: UserContestData) => {
        try {
            const res = await fetch('/api/user/contests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contestData),
            });
            if (res.ok) {
                const result = await res.json();
                setUserContestsData(prev => {
                    const idx = prev.findIndex(c => c.contestId === result.contest.contestId);
                    if (idx >= 0) { const next = [...prev]; next[idx] = result.contest; return next; }
                    return [...prev, result.contest];
                });
            }
        } catch (error) { console.error("Error logging contest", error); }
    };

    const addQuestion = async (questionData: Omit<Question, 'id' | 'dateSolved'>) => {
        try {
            const res = await fetch('/api/user/questions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(questionData),
            });
            if (res.ok) {
                const result = await res.json();
                setQuestions(prev => [...prev, result.question]);
            }
        } catch (error) { console.error("Error adding question", error); }
    };

    const updateQuestion = async (questionData: Question) => {
        try {
            const res = await fetch('/api/user/questions', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(questionData),
            });
            if (res.ok) {
                const result = await res.json();
                setQuestions(prev => prev.map(q => q.id === questionData.id ? result.question : q));
            }
        } catch (error) { console.error("Error updating question", error); }
    };

    const deleteQuestion = async (questionId: string) => {
        try {
            const res = await fetch(`/api/user/questions?id=${questionId}`, { method: 'DELETE' });
            if (res.ok) {
                setQuestions(prev => prev.filter(q => q.id !== questionId));
            }
        } catch (error) { console.error("Error deleting question", error); }
    };

    return (
        <TrackerContext.Provider value={{
            allContests, contests: activeContests, questions, isLoading,
            rankHistory, topTopics, participationRate,
            totalAttended, totalMissed, totalPracticed,
            avgRank, bestRank, recentImprovement,
            addContest, addQuestion, updateQuestion, deleteQuestion
        }}>
            {children}
        </TrackerContext.Provider>
    );
};

export const useTracker = () => {
    const context = useContext(TrackerContext);
    if (!context) throw new Error('useTracker must be used within a TrackerProvider');
    return context;
};
