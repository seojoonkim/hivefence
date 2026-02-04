'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

const API_BASE = 'https://hivefence-api.seojoon-kim.workers.dev/api/v1';

interface Pattern {
  id: string;
  pattern_hash: string;
  category: string;
  severity: number;
  description: string;
  vote_up: number;
  vote_down: number;
  report_count: number;
  created_at: string;
}

const THREAT_INFO: Record<string, { name: string; icon: string; color: string }> = {
  role_override: { name: 'Role Override', icon: '🎭', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  fake_system: { name: 'System Injection', icon: '📜', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  jailbreak: { name: 'Jailbreak', icon: '🔓', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  data_exfil: { name: 'Data Exfiltration', icon: '💾', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  social_eng: { name: 'Social Engineering', icon: '🎩', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  code_exec: { name: 'Code Execution', icon: '💻', color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
};

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [approvedPatterns, setApprovedPatterns] = useState<Pattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newPattern, setNewPattern] = useState({ pattern: '', category: 'role_override', severity: 3 });
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);
  const [stats, setStats] = useState<{ totalThreats: number; pendingCount: number; approvedCount: number } | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  const isLoggedIn = status === 'authenticated';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [pendingRes, approvedRes, statsRes] = await Promise.all([
        fetch(`${API_BASE}/threats/pending`),
        fetch(`${API_BASE}/threats/latest`),
        fetch(`${API_BASE}/stats`),
      ]);
      const [pendingData, approvedData, statsData] = await Promise.all([
        pendingRes.json(),
        approvedRes.json(),
        statsRes.json(),
      ]);
      setPatterns(pendingData.patterns || []);
      setApprovedPatterns(approvedData.patterns || []);
      setStats(statsData);
    } catch (e) {
      console.error('Failed to fetch data', e);
    } finally {
      setLoading(false);
    }
  };

  const vote = async (id: string, approve: boolean) => {
    if (!isLoggedIn) {
      signIn('github');
      return;
    }
    try {
      await fetch(`${API_BASE}/threats/${id}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vote: approve ? 'up' : 'down' }),
      });
      fetchData();
    } catch (e) {
      console.error('Vote failed', e);
    }
  };

  const submitPattern = async () => {
    if (!newPattern.pattern.trim()) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const hash = 'sha256:' + Array.from(newPattern.pattern).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0).toString(16);
      const res = await fetch(`${API_BASE}/threats/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patternHash: hash,
          category: newPattern.category,
          severity: newPattern.severity,
          description: newPattern.pattern.slice(0, 100),
        }),
      });
      const data = await res.json();
      if (data.id) {
        setSubmitResult({ success: true, message: `Pattern submitted! ID: ${data.id.slice(0, 8)}...` });
        setNewPattern({ pattern: '', category: 'role_override', severity: 3 });
        fetchData();
      } else {
        setSubmitResult({ success: false, message: data.error || 'Submission failed' });
      }
    } catch (e) {
      setSubmitResult({ success: false, message: 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  const categories = Object.keys(THREAT_INFO);

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-amber-400 hover:text-amber-300 text-sm font-mono mb-2 inline-block">← Back to HiveFence</Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span>🗳️</span> Community Governance
            </h1>
            <p className="text-zinc-400 mt-2">Vote on attack patterns. Shape collective immunity.</p>
          </div>
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-400">✓ {session?.user?.name}</span>
                <button onClick={() => signOut()} className="text-xs text-zinc-500 hover:text-zinc-300">Logout</button>
              </div>
            ) : (
              <button onClick={() => signIn('github')} className="px-3 py-2 rounded-lg bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                Login with GitHub
              </button>
            )}
            <button onClick={fetchData} className="px-3 py-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 text-sm">
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
              <div className="text-3xl font-bold text-amber-400">{stats.pendingCount}</div>
              <div className="text-xs text-zinc-500 mt-1">Pending Review</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
              <div className="text-3xl font-bold text-green-400">{stats.approvedCount}</div>
              <div className="text-xs text-zinc-500 mt-1">Approved</div>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 text-center">
              <div className="text-3xl font-bold text-zinc-300">{stats.totalThreats}</div>
              <div className="text-xs text-zinc-500 mt-1">Total Patterns</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-mono text-sm ${activeTab === 'pending' ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          >
            Pending ({patterns.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-lg font-mono text-sm ${activeTab === 'approved' ? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
          >
            Approved ({approvedPatterns.length})
          </button>
        </div>

        {/* Pattern List */}
        <div className="space-y-3 mb-8">
          {loading ? (
            <div className="text-center py-12 text-zinc-500">Loading patterns...</div>
          ) : (activeTab === 'pending' ? patterns : approvedPatterns).length === 0 ? (
            <div className="text-center py-12 text-zinc-500">
              <span className="text-3xl mb-2 block">🐝</span>
              {activeTab === 'pending' ? 'No pending patterns — the hive is secure!' : 'No approved patterns yet.'}
            </div>
          ) : (
            (activeTab === 'pending' ? patterns : approvedPatterns).map((p) => {
              const info = THREAT_INFO[p.category] || { name: p.category, icon: '⚠️', color: 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' };
              return (
                <div key={p.id} className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/30 transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{info.icon}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-mono border ${info.color}`}>
                          {info.name}
                        </span>
                        <span className="text-xs text-zinc-500">Severity {p.severity}</span>
                        {activeTab === 'approved' && <span className="text-xs text-green-400">✓ Approved</span>}
                      </div>
                      <div className="text-sm text-zinc-400 font-mono break-all">{p.pattern_hash}</div>
                      {p.description && <div className="text-xs text-zinc-500 mt-1">{p.description}</div>}
                      <div className="text-xs text-zinc-600 mt-2">{p.report_count} reports · {new Date(p.created_at).toLocaleDateString()}</div>
                    </div>
                    {activeTab === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => vote(p.id, true)}
                          className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${isLoggedIn ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' : 'bg-zinc-800 text-zinc-500'}`}
                        >
                          👍 {p.vote_up}
                        </button>
                        <button
                          onClick={() => vote(p.id, false)}
                          className={`px-3 py-2 rounded-lg text-sm flex items-center gap-1 ${isLoggedIn ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-zinc-800 text-zinc-500'}`}
                        >
                          👎 {p.vote_down}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Submit New Pattern */}
        <div className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <span>🐝</span> Submit New Pattern
          </h2>
          <p className="text-sm text-zinc-400 mb-4">
            Found a new attack pattern? Submit it for community review.
          </p>
          <textarea
            value={newPattern.pattern}
            onChange={(e) => setNewPattern({ ...newPattern, pattern: e.target.value })}
            placeholder="Enter the attack pattern text..."
            className="w-full h-24 p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none mb-3"
          />
          <div className="flex gap-3 mb-4">
            <select
              value={newPattern.category}
              onChange={(e) => setNewPattern({ ...newPattern, category: e.target.value })}
              className="flex-1 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{THREAT_INFO[c].icon} {THREAT_INFO[c].name}</option>
              ))}
            </select>
            <select
              value={newPattern.severity}
              onChange={(e) => setNewPattern({ ...newPattern, severity: Number(e.target.value) })}
              className="w-32 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm focus:outline-none"
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>Severity {s}</option>
              ))}
            </select>
          </div>
          <button
            onClick={submitPattern}
            disabled={!newPattern.pattern.trim() || submitting}
            className="w-full py-3 rounded-lg bg-amber-500 text-black font-mono font-bold hover:bg-amber-400 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            🐝 {submitting ? 'Submitting...' : 'Submit Pattern'}
          </button>
          {submitResult && (
            <div className={`mt-3 p-3 rounded-lg text-sm ${submitResult.success ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {submitResult.message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
