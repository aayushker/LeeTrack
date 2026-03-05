'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTracker, Question } from '../../../context/TrackerContext';
import { Badge } from '../../../components/Badge';
import { Modal } from '../../../components/Modal';
import { Plus, ArrowLeft, Calendar, Trophy, ExternalLink, CheckCircle, Clock, Pencil, Trash2 } from 'lucide-react';

export default function ContestDetail() {
    const params = useParams();
    const router = useRouter();
    const { allContests, questions, addQuestion, updateQuestion, deleteQuestion, isLoading } = useTracker();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
    const [topicsInput, setTopicsInput] = useState('');
    const [solvedDuringContest, setSolvedDuringContest] = useState(true);

    const openAddModal = () => {
        setEditingQuestion(null);
        setTitle(''); setDifficulty('Easy'); setTopicsInput(''); setSolvedDuringContest(true);
        setIsModalOpen(true);
    };

    const openEditModal = (q: Question) => {
        setEditingQuestion(q);
        setTitle(q.title);
        setDifficulty(q.difficulty);
        setTopicsInput(q.topics.join(', '));
        setSolvedDuringContest(q.solvedDuringContest);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingQuestion(null);
        setTitle(''); setDifficulty('Easy'); setTopicsInput(''); setSolvedDuringContest(true);
    };

    if (isLoading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '200px', color: 'var(--text-3)' }}>Loading...</div>;
    }

    const contest = allContests.find((c) => c.id === params.id);
    if (!contest) {
        return (
            <div className="empty-state" style={{ paddingTop: '60px' }}>
                <Trophy size={48} style={{ opacity: 0.15 }} />
                <h2 style={{ color: 'var(--text-2)' }}>Contest not found</h2>
                <button className="btn btn-secondary" onClick={() => router.push('/contests')}>
                    Back to Contests
                </button>
            </div>
        );
    }

    const contestQuestions = questions.filter(q => q.contestId === contest.id);
    const solvedDuring = contestQuestions.filter(q => q.solvedDuringContest);
    const solvedAfter = contestQuestions.filter(q => !q.solvedDuringContest);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title) return;
        const topics = topicsInput.split(',').map(t => t.trim()).filter(Boolean);
        if (topics.length === 0) topics.push('General');
        if (editingQuestion) {
            await updateQuestion({ ...editingQuestion, title, difficulty, topics, solvedDuringContest });
        } else {
            await addQuestion({ contestId: contest.id, title, difficulty, topics, solvedDuringContest });
        }
        closeModal();
    };

    const rankColor = contest.rank
        ? contest.rank < 3000 ? 'var(--green)'
            : contest.rank < 8000 ? 'var(--yellow)'
                : 'var(--text-2)'
        : 'var(--text-3)';

    const STATUS_MAP = { attended: 'attended', practiced: 'medium', missed: 'topic' } as const;

    return (
        <div style={{ paddingBottom: '48px', display: 'flex', flexDirection: 'column', gap: '24px' }} className="animate-in">

            {/* Back */}
            <button className="btn btn-ghost" style={{ width: 'fit-content', padding: '6px 10px', fontSize: '0.82rem' }}
                onClick={() => router.push('/contests')}>
                <ArrowLeft size={15} />
                Back to Contests
            </button>

            {/* Header Card */}
            <div className="glass-panel" style={{ padding: '28px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '20px' }}>
                    <div style={{ flex: 1 }}>
                        {/* Type + Status badges */}
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                            <span className={`badge badge-${contest.type.toLowerCase()}`}>{contest.type}</span>
                            <span className={`badge badge-${contest.status}`}>
                                {contest.status === 'attended' ? '🟢 Attended' :
                                    contest.status === 'practiced' ? '🟡 Practiced' : '⚫ Missed'}
                            </span>
                        </div>

                        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '16px' }}>
                            {contest.title}
                        </h1>

                        {/* Meta row */}
                        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', fontSize: '0.85rem' }}>
                                <Calendar size={14} />
                                <span>{new Date(contest.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            {contest.rank && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: rankColor, fontSize: '0.85rem', fontWeight: 600 }}>
                                    <Trophy size={14} />
                                    <span>Rank #{contest.rank.toLocaleString()}</span>
                                </div>
                            )}
                            {contest.timeTaken && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-3)', fontSize: '0.85rem' }}>
                                    <Clock size={14} />
                                    <span>{contest.timeTaken}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                        <a href={contest.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: '0.82rem' }}>
                            <ExternalLink size={14} />
                            Open on LeetCode
                        </a>
                        <button className="btn btn-primary" onClick={openAddModal} style={{ fontSize: '0.82rem' }}>
                            <Plus size={14} />
                            Log Problem
                        </button>
                    </div>
                </div>

                {/* Stats row */}
                {contest.attended && (
                    <div style={{
                        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px',
                        marginTop: '24px', background: 'rgba(255,255,255,0.07)', borderRadius: 'var(--r-md)', overflow: 'hidden'
                    }}>
                        {[
                            { label: 'Global Rank', value: contest.rank ? `#${contest.rank.toLocaleString()}` : '—', color: rankColor },
                            { label: 'Solved (Live)', value: `${solvedDuring.length} / 4`, color: 'var(--text)' },
                            { label: 'Solved (Later)', value: solvedAfter.length, color: 'var(--yellow)' },
                            { label: 'Type', value: contest.type, color: 'var(--text-2)' },
                        ].map((s, i) => (
                            <div key={i} style={{ padding: '16px 20px', background: 'rgba(0,0,0,0.2)' }}>
                                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.07em', color: 'var(--text-3)', marginBottom: '6px' }}>{s.label}</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Questions */}
            {contestQuestions.length > 0 ? (
                <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px', color: 'var(--text-2)' }}>
                        Problems Logged ({contestQuestions.length})
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {contestQuestions.map(q => (
                            <div key={q.id} className="glass-panel" style={{ padding: '16px 20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: q.solvedDuringContest ? 'var(--green)' : 'var(--yellow)' }}>
                                                <CheckCircle size={13} />
                                                {q.solvedDuringContest ? 'During contest' : 'Solved later'}
                                            </div>
                                        </div>
                                        <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '8px' }}>{q.title}</h3>
                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                            {q.topics.map((t, i) => (
                                                <span key={i} className="badge badge-topic">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '10px', flexShrink: 0 }}>
                                        <span className={`badge badge-${q.difficulty.toLowerCase()}`}>{q.difficulty}</span>
                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>
                                            {new Date(q.dateSolved).toLocaleDateString()}
                                        </div>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            <button
                                                onClick={() => openEditModal(q)}
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-3)', borderRadius: 'var(--r-sm)' }}
                                                title="Edit problem"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm(`Remove "${q.title}"?`)) deleteQuestion(q.id);
                                                }}
                                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: 'var(--text-3)', borderRadius: 'var(--r-sm)' }}
                                                title="Remove problem"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="glass-panel">
                    <div className="empty-state">
                        <Plus size={36} style={{ opacity: 0.2 }} />
                        <div style={{ color: 'var(--text-2)', fontSize: '0.9rem' }}>No problems logged for this contest yet.</div>
                        <button className="btn btn-primary" onClick={openAddModal} style={{ marginTop: '4px' }}>
                            Log a Problem
                        </button>
                    </div>
                </div>
            )}

            {/* Log Problem Modal */}
            <Modal isOpen={isModalOpen} onClose={closeModal} title={editingQuestion ? 'Edit Problem' : 'Log Problem'}>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Problem Title</label>
                        <input type="text" className="form-input" placeholder="e.g. Two Sum"
                            value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Difficulty</label>
                        <select className="form-input" value={difficulty} onChange={e => setDifficulty(e.target.value as any)}>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label className="form-label">Topics (comma-separated)</label>
                        <input type="text" className="form-input" placeholder="e.g. Array, Hash Table, DP"
                            value={topicsInput} onChange={e => setTopicsInput(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label className="form-label">When was it solved?</label>
                        <select className="form-input"
                            value={solvedDuringContest ? 'during' : 'practice'}
                            onChange={e => setSolvedDuringContest(e.target.value === 'during')}>
                            <option value="during">During the contest</option>
                            <option value="practice">In practice (after the contest)</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
                        <button type="button" className="btn btn-secondary" onClick={closeModal}>Cancel</button>
                        <button type="submit" className="btn btn-primary">{editingQuestion ? 'Save Changes' : 'Save Problem'}</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
