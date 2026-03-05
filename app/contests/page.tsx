'use client';

import React, { useState, useMemo } from 'react';
import { useTracker } from '../../context/TrackerContext';
import { ContestCard } from '../../components/ContestCard';
import { Modal } from '../../components/Modal';
import { Plus, Trophy, Search } from 'lucide-react';
import type { ContestStatus } from '../../context/TrackerContext';

type FilterStatus = ContestStatus | 'all';
type FilterType = 'all' | 'weekly' | 'biweekly';

export default function ContestsPage() {
    const { allContests, addContest } = useTracker();

    // Filters
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
    const [typeFilter, setTypeFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContestId, setSelectedContestId] = useState('');
    const [rank, setRank] = useState('');
    const [questionsSolved, setQuestionsSolved] = useState('');
    const [attended, setAttended] = useState(true);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedContestId) return;
        await addContest({
            contestId: selectedContestId,
            rank: rank ? Number(rank) : undefined,
            questionsSolved: questionsSolved ? Number(questionsSolved) : undefined,
            attended,
        });
        setIsModalOpen(false);
        setSelectedContestId('');
        setRank('');
        setQuestionsSolved('');
        setAttended(true);
    };

    // Filtered + sorted contests
    const filtered = useMemo(() => {
        return allContests
            .filter(c => {
                if (statusFilter !== 'all' && c.status !== statusFilter) return false;
                if (typeFilter === 'weekly' && c.type.toLowerCase() !== 'weekly') return false;
                if (typeFilter === 'biweekly' && c.type.toLowerCase() !== 'biweekly') return false;
                if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
                return true;
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [allContests, statusFilter, typeFilter, searchQuery]);

    // Summary counts
    const counts = useMemo(() => ({
        all: allContests.length,
        attended: allContests.filter(c => c.status === 'attended').length,
        practiced: allContests.filter(c => c.status === 'practiced').length,
        missed: allContests.filter(c => c.status === 'missed').length,
        weekly: allContests.filter(c => c.type.toLowerCase() === 'weekly').length,
        biweekly: allContests.filter(c => c.type.toLowerCase() === 'biweekly').length,
    }), [allContests]);

    const statusFilters: { key: FilterStatus; label: string; count: number }[] = [
        { key: 'all', label: 'All', count: counts.all },
        { key: 'attended', label: '🟢 Attended', count: counts.attended },
        { key: 'practiced', label: '🟡 Practiced', count: counts.practiced },
        { key: 'missed', label: '⚫ Missed', count: counts.missed },
    ];

    const typeFilters: { key: FilterType; label: string; count: number }[] = [
        { key: 'all', label: 'All Types', count: counts.all },
        { key: 'weekly', label: 'Weekly', count: counts.weekly },
        { key: 'biweekly', label: 'Biweekly', count: counts.biweekly },
    ];

    return (
        <div style={{ paddingBottom: '48px' }} className="animate-in">

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '5px' }}>Contest Explorer</h1>
                    <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>
                        {filtered.length} of {counts.all} contests — all LeetCode history
                    </p>
                </div>
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    <Plus size={16} />
                    Log Contest
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                {/* Status filters */}
                <div className="filter-pills">
                    {statusFilters.map(f => (
                        <button
                            key={f.key}
                            className={`filter-pill ${statusFilter === f.key ? 'active' : ''}`}
                            onClick={() => setStatusFilter(f.key)}
                        >
                            {f.label}
                            <span style={{ opacity: 0.6, marginLeft: '4px', fontSize: '0.7rem' }}>({f.count})</span>
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.08)' }} />

                {/* Type filters */}
                <div className="filter-pills">
                    {typeFilters.map(f => (
                        <button
                            key={f.key}
                            className={`filter-pill ${typeFilter === f.key ? 'active' : ''}`}
                            onClick={() => setTypeFilter(f.key)}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div style={{
                    marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 'var(--r-md)', padding: '8px 14px', minWidth: '200px'
                }}>
                    <Search size={14} color="var(--text-3)" />
                    <input
                        type="text"
                        placeholder="Search contests..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                            background: 'none', border: 'none', outline: 'none', color: 'var(--text)',
                            fontSize: '0.82rem', width: '100%', fontFamily: 'inherit'
                        }}
                    />
                </div>
            </div>

            {/* Grid */}
            {filtered.length > 0 ? (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '14px',
                }}>
                    {filtered.map(contest => (
                        <ContestCard key={contest.id} contest={contest} />
                    ))}
                </div>
            ) : (
                <div className="empty-state" style={{ marginTop: '40px' }}>
                    <Trophy size={48} style={{ opacity: 0.15 }} />
                    <h3 style={{ color: 'var(--text-2)', fontSize: '1rem' }}>No contests match your filters</h3>
                    <p style={{ fontSize: '0.875rem' }}>Try adjusting the filters above</p>
                </div>
            )}

            {/* Log Contest Modal */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log Contest Result">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Contest</label>
                        <select className="form-input" value={selectedContestId}
                            onChange={e => setSelectedContestId(e.target.value)} required>
                            <option value="" disabled>Select a contest</option>
                            {allContests.map(c => (
                                <option key={c.id} value={c.id}>{c.title}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '14px' }}>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Rank (Optional)</label>
                            <input type="number" className="form-input" placeholder="e.g. 5000"
                                value={rank} onChange={e => setRank(e.target.value)} />
                        </div>
                        <div className="form-group" style={{ flex: 1 }}>
                            <label className="form-label">Problems Solved</label>
                            <input type="number" className="form-input" placeholder="0-4"
                                min={0} max={4} value={questionsSolved} onChange={e => setQuestionsSolved(e.target.value)} />
                        </div>
                    </div>
                    <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input type="checkbox" id="attended-chk" checked={attended}
                            onChange={e => setAttended(e.target.checked)}
                            style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }} />
                        <label htmlFor="attended-chk" style={{ color: 'var(--text)', fontSize: '0.875rem' }}>
                            I attended this contest live
                        </label>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '28px' }}>
                        <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        <button type="submit" className="btn btn-primary">Save Contest</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
