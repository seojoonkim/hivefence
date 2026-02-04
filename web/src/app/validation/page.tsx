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

const THREAT_INFO: Record<string, { name: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  role_override: { 
    name: 'Role Override', 
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    color: 'text-red-400', 
    bgColor: 'bg-red-500/10 border-red-500/30' 
  },
  fake_system: { 
    name: 'System Injection', 
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
    color: 'text-purple-400', 
    bgColor: 'bg-purple-500/10 border-purple-500/30' 
  },
  jailbreak: { 
    name: 'Jailbreak', 
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg>,
    color: 'text-orange-400', 
    bgColor: 'bg-orange-500/10 border-orange-500/30' 
  },
  data_exfil: { 
    name: 'Data Exfiltration', 
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>,
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/10 border-blue-500/30' 
  },
  social_eng: { 
    name: 'Social Engineering', 
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    color: 'text-pink-400', 
    bgColor: 'bg-pink-500/10 border-pink-500/30' 
  },
  code_exec: { 
    name: 'Code Execution', 
    icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    color: 'text-cyan-400', 
    bgColor: 'bg-cyan-500/10 border-cyan-500/30' 
  },
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
      {/* Hero Header */}
      <div className="bg-gradient-to-b from-amber-500/5 to-transparent border-b border-zinc-800/50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-mono mb-6">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to HiveFence
          </Link>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Community Governance
              </h1>
              <p className="text-zinc-400 text-sm sm:text-base">Vote on attack patterns. Shape collective immunity.</p>
            </div>
            
            <div className="flex items-center gap-2">
              {isLoggedIn ? (
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  <span className="text-xs text-green-400">{session?.user?.name}</span>
                  <button onClick={() => signOut()} className="text-xs text-zinc-500 hover:text-zinc-300">×</button>
                </div>
              ) : (
                <button onClick={() => signIn('github')} className="px-4 py-2 rounded-lg bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700 flex items-center gap-2 border border-zinc-700">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                  Login
                </button>
              )}
              <button onClick={fetchData} className="p-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/30">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 to-zinc-900/50 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-zinc-500">Pending</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stats.pendingCount}</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-zinc-900/50 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-zinc-500">Approved</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-green-400">{stats.approvedCount}</div>
            </div>
            <div className="p-4 rounded-xl bg-gradient-to-br from-zinc-500/10 to-zinc-900/50 border border-zinc-700">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-xs text-zinc-500">Total</span>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-zinc-300">{stats.totalThreats}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 px-4 py-3 rounded-lg font-mono text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'pending' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pending ({patterns.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`flex-1 px-4 py-3 rounded-lg font-mono text-sm flex items-center justify-center gap-2 transition-all ${activeTab === 'approved' ? 'bg-green-500 text-black font-bold' : 'text-zinc-400 hover:bg-zinc-800'}`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Approved ({approvedPatterns.length})
          </button>
        </div>

        {/* Pattern List */}
        <div className="space-y-3 mb-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <span className="text-zinc-500">Loading patterns...</span>
            </div>
          ) : (activeTab === 'pending' ? patterns : approvedPatterns).length === 0 ? (
            <div className="text-center py-12 bg-zinc-900/30 rounded-2xl border border-zinc-800">
              <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-zinc-400">
                {activeTab === 'pending' ? 'No pending patterns — the hive is secure!' : 'No approved patterns yet.'}
              </p>
            </div>
          ) : (
            (activeTab === 'pending' ? patterns : approvedPatterns).map((p) => {
              const info = THREAT_INFO[p.category] || { 
                name: p.category, 
                icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
                color: 'text-zinc-400', 
                bgColor: 'bg-zinc-500/10 border-zinc-500/30' 
              };
              const severityPercent = (p.severity / 100) * 100;
              
              return (
                <div key={p.id} className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 hover:border-amber-500/30 transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono border ${info.bgColor} ${info.color}`}>
                        {info.icon}
                        <span>{info.name}</span>
                      </div>
                      {activeTab === 'approved' && (
                        <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-xs border border-green-500/30">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          Approved
                        </span>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-bold text-zinc-300">{p.severity}</div>
                      <div className="text-[10px] text-zinc-600">SEVERITY</div>
                    </div>
                  </div>
                  
                  {/* Severity Bar */}
                  <div className="h-1 bg-zinc-800 rounded-full mb-3 overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${p.severity >= 80 ? 'bg-red-500' : p.severity >= 50 ? 'bg-amber-500' : 'bg-green-500'}`}
                      style={{ width: `${severityPercent}%` }}
                    />
                  </div>
                  
                  {/* Hash */}
                  <div className="p-2 rounded-lg bg-zinc-950 mb-3">
                    <div className="text-[10px] text-zinc-600 mb-1">PATTERN HASH</div>
                    <div className="text-xs text-zinc-400 font-mono break-all">{p.pattern_hash}</div>
                  </div>
                  
                  {p.description && (
                    <p className="text-sm text-zinc-500 mb-3">{p.description}</p>
                  )}
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                    <div className="flex items-center gap-3 text-xs text-zinc-600">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {p.report_count} reports
                      </span>
                      <span>{new Date(p.created_at).toLocaleDateString()}</span>
                    </div>
                    
                    {activeTab === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => vote(p.id, true)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${isLoggedIn ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/30' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                          </svg>
                          {p.vote_up}
                        </button>
                        <button
                          onClick={() => vote(p.id, false)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-mono transition-all ${isLoggedIn ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                          {p.vote_down}
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
        <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 to-zinc-900/50 border border-amber-500/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold">Submit New Pattern</h2>
              <p className="text-xs text-zinc-500">Found a new attack? Submit for community review.</p>
            </div>
          </div>
          
          <textarea
            value={newPattern.pattern}
            onChange={(e) => setNewPattern({ ...newPattern, pattern: e.target.value })}
            placeholder="Enter the attack pattern text..."
            className="w-full h-24 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none mb-3"
          />
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <select
              value={newPattern.category}
              onChange={(e) => setNewPattern({ ...newPattern, category: e.target.value })}
              className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm focus:outline-none focus:border-amber-500/50"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{THREAT_INFO[c].name}</option>
              ))}
            </select>
            <select
              value={newPattern.severity}
              onChange={(e) => setNewPattern({ ...newPattern, severity: Number(e.target.value) })}
              className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm focus:outline-none focus:border-amber-500/50"
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <option key={s} value={s}>Severity {s}</option>
              ))}
            </select>
          </div>
          
          <button
            onClick={submitPattern}
            disabled={!newPattern.pattern.trim() || submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-mono font-bold hover:from-amber-400 hover:to-yellow-400 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {submitting ? 'Submitting...' : 'Submit Pattern'}
          </button>
          
          {submitResult && (
            <div className={`mt-3 p-3 rounded-xl text-sm flex items-center gap-2 ${submitResult.success ? 'bg-green-500/10 text-green-400 border border-green-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
              {submitResult.success ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {submitResult.message}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
