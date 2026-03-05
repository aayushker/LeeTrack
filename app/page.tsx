'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import {
  Trophy, BarChart2, Target, Zap, TrendingUp,
  Star, Activity, Code2, ArrowRight, CheckCircle,
} from 'lucide-react';

const FEATURES = [
  {
    icon: Trophy,
    color: 'var(--primary-light)',
    bg: 'rgba(124,92,252,0.12)',
    title: 'Contest Tracking',
    desc: 'Log every LeetCode Weekly and Biweekly contest you attend. Record your rank, problems solved, and time taken in one place.',
  },
  {
    icon: BarChart2,
    color: 'var(--blue)',
    bg: 'rgba(56,189,248,0.1)',
    title: 'Rank Analytics',
    desc: 'Visualise your rank over time with an interactive trend chart. Spot improvements and dips across your entire history.',
  },
  {
    icon: Target,
    color: 'var(--yellow)',
    bg: 'rgba(245,158,11,0.12)',
    title: 'Practice Tracker',
    desc: 'Solved a problem after the contest? Log it as practice. Track what you learnt and close the gap on missed contests.',
  },
  {
    icon: TrendingUp,
    color: 'var(--green)',
    bg: 'rgba(34,215,133,0.12)',
    title: 'Performance Insights',
    desc: 'AI-generated insights about your participation rate, best ranks, and recent improvement trends to keep you motivated.',
  },
  {
    icon: Activity,
    color: 'var(--red)',
    bg: 'rgba(244,63,94,0.12)',
    title: 'Activity Heatmap',
    desc: 'A GitHub-style heatmap of the last 52 weeks shows attended, practiced, and missed contests at a glance.',
  },
  {
    icon: Star,
    color: 'var(--yellow)',
    bg: 'rgba(245,158,11,0.12)',
    title: 'Topic Breakdown',
    desc: 'See which algorithm topics you solve most, filtered by difficulty — so you always know where to focus next.',
  },
];

const STATS = [
  { value: '500+', label: 'Contests tracked' },
  { value: 'Live', label: 'MongoDB sync' },
  { value: '100%', label: 'Your data, private' },
];

export default function LandingPage() {
  const { user, isAuthLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users straight to the dashboard
  useEffect(() => {
    if (!isAuthLoading && user) {
      router.replace('/dashboard');
    }
  }, [user, isAuthLoading, router]);

  if (isAuthLoading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', background: 'var(--bg-gradient)',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          border: '3px solid rgba(124,92,252,0.3)',
          borderTopColor: 'var(--primary)',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-gradient)', overflowX: 'hidden' }}>

      {/* ── Nav ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '64px',
        background: 'rgba(8,10,16,0.85)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px', height: '34px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #7c5cfc 0%, #5b3ae0 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(124,92,252,0.4)',
          }}>
            <Code2 color="white" size={18} strokeWidth={2.2} />
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.025em' }}>LeetTracker</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link href="/login">
            <button style={{
              padding: '8px 18px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 'var(--r-md)',
              color: 'var(--text-2)',
              fontSize: '0.85rem', fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--t-fast)',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.25)';
                e.currentTarget.style.color = 'var(--text)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                e.currentTarget.style.color = 'var(--text-2)';
              }}
            >
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button style={{
              padding: '8px 18px',
              background: 'var(--primary)',
              border: 'none',
              borderRadius: 'var(--r-md)',
              color: '#fff',
              fontSize: '0.85rem', fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(124,92,252,0.3)',
            }}>
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', padding: '100px 24px 80px',
        position: 'relative',
      }}>
        {/* glow orb */}
        <div style={{
          position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(ellipse, rgba(124,92,252,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          padding: '5px 14px', marginBottom: '28px',
          background: 'rgba(124,92,252,0.12)',
          border: '1px solid rgba(124,92,252,0.3)',
          borderRadius: '99px',
          fontSize: '0.78rem', color: 'var(--primary-light)', fontWeight: 500,
        }}>
          <Zap size={12} />
          Your personal competitive programming tracker
        </div>

        <h1 style={{
          fontSize: 'clamp(2.4rem, 6vw, 4rem)',
          fontWeight: 800,
          lineHeight: 1.1,
          letterSpacing: '-0.04em',
          maxWidth: '820px',
          marginBottom: '22px',
        }}>
          Track every contest.{' '}
          <span style={{
            background: 'linear-gradient(135deg, #7c5cfc 0%, #9d7fff 50%, #22d785 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Improve every week.
          </span>
        </h1>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--text-2)',
          maxWidth: '560px',
          lineHeight: 1.7,
          marginBottom: '40px',
        }}>
          LeetTracker lets you log LeetCode contest results, visualise your rank history,
          and gain deep insights into your competitive programming journey — all in one elegant dashboard.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/signup">
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px',
              background: 'var(--primary)',
              border: 'none', borderRadius: 'var(--r-lg)',
              color: '#fff', fontSize: '0.95rem', fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 0 32px rgba(124,92,252,0.35)',
              transition: 'transform var(--t-fast), box-shadow var(--t-fast)',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 44px rgba(124,92,252,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 0 32px rgba(124,92,252,0.35)'; }}
            >
              Start tracking free
              <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="/login">
            <button style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '13px 28px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 'var(--r-lg)',
              color: 'var(--text-2)', fontSize: '0.95rem', fontWeight: 500,
              cursor: 'pointer',
              transition: 'all var(--t-fast)',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-2)'; }}
            >
              Sign in to your account
            </button>
          </Link>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section style={{
        display: 'flex', justifyContent: 'center', gap: '0',
        padding: '0 24px 80px',
      }}>
        <div style={{
          display: 'flex',
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 'var(--r-xl)',
          overflow: 'hidden',
        }}>
          {STATS.map((s, i) => (
            <div key={s.label} style={{
              padding: '20px 44px',
              textAlign: 'center',
              borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
            }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.03em' }}>{s.value}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-3)', marginTop: '3px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Heading ── */}
      <section style={{ padding: '0 24px 20px', textAlign: 'center' }}>
        <p style={{
          fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-light)',
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px',
        }}>
          Everything you need
        </p>
        <h2 style={{ fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '14px' }}>
          Built for serious LeetCoders
        </h2>
        <p style={{ color: 'var(--text-3)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
          Every feature is designed around one goal: helping you understand where you are and how to improve.
        </p>
      </section>

      {/* ── Feature Grid ── */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '16px',
        maxWidth: '1100px',
        margin: '40px auto 80px',
        padding: '0 24px',
      }}>
        {FEATURES.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: 'var(--r-md)',
                background: f.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={20} color={f.color} />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '7px' }}>{f.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            </div>
          );
        })}
      </section>

      {/* ── How it works ── */}
      <section style={{
        maxWidth: '860px', margin: '0 auto 100px', padding: '0 24px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '0.75rem', fontWeight: 600, color: 'var(--green)',
          textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '10px',
        }}>
          Simple to use
        </p>
        <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '48px' }}>
          Up and running in minutes
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { step: '01', title: 'Create your account', desc: 'Sign up with a username and password. Your data is stored securely in MongoDB.' },
            { step: '02', title: 'Log your contests', desc: 'After each LeetCode contest, record your rank and problems solved in seconds.' },
            { step: '03', title: 'Watch insights grow', desc: 'Charts, heatmaps, and insights update automatically as your history builds up.' },
          ].map(s => (
            <div key={s.step} className="glass-panel" style={{ textAlign: 'left' }}>
              <div style={{
                fontSize: '0.72rem', fontWeight: 700, color: 'var(--primary)',
                letterSpacing: '0.05em', marginBottom: '14px',
              }}>
                STEP {s.step}
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '10px' }}>{s.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '0 24px 120px', textAlign: 'center',
      }}>
        <div style={{
          maxWidth: '600px',
          padding: '56px 48px',
          background: 'linear-gradient(135deg, rgba(124,92,252,0.14) 0%, rgba(34,215,133,0.06) 100%)',
          border: '1px solid rgba(124,92,252,0.25)',
          borderRadius: 'var(--r-xl)',
          boxShadow: '0 0 60px rgba(124,92,252,0.1)',
        }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '14px' }}>
            Ready to level up?
          </h2>
          <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginBottom: '32px', lineHeight: 1.7 }}>
            Join LeetTracker and start turning every contest into a learning data point.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup">
              <button style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '12px 28px',
                background: 'var(--primary)',
                border: 'none', borderRadius: 'var(--r-md)',
                color: '#fff', fontSize: '0.9rem', fontWeight: 600,
                cursor: 'pointer',
              }}>
                Create free account
                <ArrowRight size={15} />
              </button>
            </Link>
            <Link href="/login">
              <button style={{
                padding: '12px 28px',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 'var(--r-md)',
                color: 'var(--text-2)', fontSize: '0.9rem', fontWeight: 500,
                cursor: 'pointer',
              }}>
                I already have an account
              </button>
            </Link>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '28px', flexWrap: 'wrap' }}>
            {['No credit card', 'Secure with bcrypt', 'Your data stays yours'].map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-3)' }}>
                <CheckCircle size={13} color="var(--green)" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '28px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={16} color="var(--primary-light)" />
          <span style={{ fontSize: '0.82rem', color: 'var(--text-3)' }}>LeetTracker — Contest Analytics</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/login" style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Login</Link>
          <Link href="/signup" style={{ fontSize: '0.8rem', color: 'var(--text-3)' }}>Sign Up</Link>
        </div>
      </footer>
    </div>
  );
}
