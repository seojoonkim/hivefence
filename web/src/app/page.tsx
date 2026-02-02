'use client';

import { useState, useEffect } from 'react';

// Bee Logo
const BeeLogo = ({ size = 32 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="36" rx="14" ry="18" fill="#F59E0B"/>
    <path d="M18 30 h28" stroke="#0a0a0b" strokeWidth="4"/>
    <path d="M18 38 h28" stroke="#0a0a0b" strokeWidth="4"/>
    <path d="M20 46 h24" stroke="#0a0a0b" strokeWidth="4"/>
    <circle cx="32" cy="16" r="10" fill="#F59E0B"/>
    <circle cx="28" cy="14" r="2.5" fill="#0a0a0b"/>
    <circle cx="36" cy="14" r="2.5" fill="#0a0a0b"/>
    <path d="M28 8 Q26 2 22 2" stroke="#0a0a0b" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M36 8 Q38 2 42 2" stroke="#0a0a0b" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="22" cy="2" r="2" fill="#F59E0B"/>
    <circle cx="42" cy="2" r="2" fill="#F59E0B"/>
    <ellipse cx="18" cy="28" rx="10" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-20 18 28)"/>
    <ellipse cx="46" cy="28" rx="10" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(20 46 28)"/>
  </svg>
);

// Terminal component
const Terminal = ({ children, title = 'terminal' }: { children: React.ReactNode; title?: string }) => (
  <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden font-mono text-sm">
    <div className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border-b border-zinc-800">
      <div className="flex gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
      </div>
      <span className="text-zinc-500 text-xs ml-2">{title}</span>
    </div>
    <div className="p-4 text-zinc-300 overflow-x-auto">
      {children}
    </div>
  </div>
);

// Status indicator
const Status = ({ status, label }: { status: 'online' | 'offline' | 'loading'; label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${
      status === 'online' ? 'bg-green-500 animate-pulse' :
      status === 'offline' ? 'bg-red-500' : 'bg-zinc-500 animate-pulse'
    }`} />
    <span className="text-xs font-mono text-zinc-400">{label}</span>
  </div>
);

// Metric card
const Metric = ({ value, label, suffix = '' }: { value: string | number; label: string; suffix?: string }) => (
  <div className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800">
    <div className="text-2xl font-mono font-bold text-amber-500">{value}{suffix}</div>
    <div className="text-xs text-zinc-500 mt-1 font-mono uppercase tracking-wider">{label}</div>
  </div>
);

// Architecture diagram
const ArchDiagram = () => (
  <div className="p-6 rounded-lg bg-zinc-900/30 border border-zinc-800 font-mono text-xs">
    <pre className="text-zinc-400 leading-relaxed">
{`┌─────────────────────────────────────────────────────────┐
│                  HIVEFENCE NETWORK                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│   ┌─────────┐      ┌─────────┐      ┌─────────┐        │
│   │ Agent A │      │ Agent B │      │ Agent C │        │
│   │  🐝     │      │  🐝     │      │  🐝     │        │
│   └────┬────┘      └────┬────┘      └────┬────┘        │
│        │                │                │              │
│        └────────────────┼────────────────┘              │
│                         │                               │
│                         ▼                               │
│              ┌──────────────────┐                       │
│              │  Threat Intel    │                       │
│              │     API          │                       │
│              │  ┌────────────┐  │                       │
│              │  │ Cloudflare │  │                       │
│              │  │ Workers+D1 │  │                       │
│              │  └────────────┘  │                       │
│              └──────────────────┘                       │
│                                                          │
│  FLOW: Detect → Report → Validate → Distribute          │
│                                                          │
└─────────────────────────────────────────────────────────┘`}
    </pre>
  </div>
);

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'online' | 'offline' | 'loading'>('loading');
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0, voting: 0 });
  const [latency, setLatency] = useState<number | null>(null);
  
  useEffect(() => {
    const start = Date.now();
    fetch('https://hivefence-api.seojoon-kim.workers.dev/')
      .then(res => res.json())
      .then(data => {
        setLatency(Date.now() - start);
        setApiStatus(data.status === 'ok' ? 'online' : 'offline');
      })
      .catch(() => setApiStatus('offline'));
    
    fetch('https://hivefence-api.seojoon-kim.workers.dev/api/v1/stats')
      .then(res => res.json())
      .then(data => setStats({
        total: data.patterns?.total || 0,
        approved: data.patterns?.approved || 0,
        pending: data.patterns?.pending || 0,
        voting: data.patterns?.voting || 0,
      }))
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0b] text-zinc-100">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/90 border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BeeLogo size={24} />
            <span className="font-mono font-bold">hivefence</span>
            <span className="text-xs font-mono text-zinc-600">v0.1.0</span>
          </div>
          <div className="flex items-center gap-6">
            <Status status={apiStatus} label={apiStatus === 'online' ? `API ${latency}ms` : 'API'} />
            <a href="https://github.com/seojoonkim/hivefence" target="_blank" 
               className="text-xs font-mono text-zinc-400 hover:text-amber-500 transition-colors">
              github
            </a>
            <a href="https://hivefence-api.seojoon-kim.workers.dev/api/v1/stats" target="_blank"
               className="text-xs font-mono text-zinc-400 hover:text-amber-500 transition-colors">
              /api
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-amber-500/30 bg-amber-500/5 text-amber-500 text-xs font-mono mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              DISTRIBUTED_AI_SECURITY
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-mono leading-tight mb-4">
              <span className="text-zinc-500">$</span> hivefence <span className="text-amber-500">--protect</span>
            </h1>
            <p className="text-zinc-400 font-mono text-sm max-w-xl">
              Collective defense system for AI agents. Detect prompt injection attacks 
              and propagate immunity across the entire network in real-time.
            </p>
          </div>

          {/* Quick install */}
          <Terminal title="install">
            <div className="text-green-400">$ npm install hivefence</div>
            <div className="text-zinc-500 mt-2"># or use the API directly</div>
            <div className="text-amber-400">$ curl https://hivefence-api.seojoon-kim.workers.dev/api/v1/threats/latest</div>
          </Terminal>
        </div>
      </section>

      {/* Live Stats */}
      <section className="py-8 px-6 border-y border-zinc-800 bg-zinc-900/20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Live Network Stats</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Metric value={stats.total} label="Total Patterns" />
            <Metric value={stats.voting} label="In Voting" />
            <Metric value={stats.approved} label="Approved" />
            <Metric value="15+" label="Attack Types" />
          </div>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-4">// ARCHITECTURE</h2>
          <ArchDiagram />
        </div>
      </section>

      {/* API Reference */}
      <section className="py-12 px-6 bg-zinc-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-6">// API ENDPOINTS</h2>
          
          <div className="grid gap-4">
            {[
              { method: 'POST', path: '/api/v1/threats/report', desc: 'Submit a new threat pattern' },
              { method: 'GET', path: '/api/v1/threats/pending', desc: 'Get patterns awaiting validation' },
              { method: 'POST', path: '/api/v1/threats/:id/vote', desc: 'Vote on a pending pattern' },
              { method: 'GET', path: '/api/v1/threats/latest', desc: 'Fetch latest approved patterns' },
              { method: 'GET', path: '/api/v1/stats', desc: 'Network statistics' },
            ].map((endpoint, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-zinc-900/50 border border-zinc-800 font-mono text-sm">
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  endpoint.method === 'POST' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
                }`}>{endpoint.method}</span>
                <code className="text-amber-500">{endpoint.path}</code>
                <span className="text-zinc-500 text-xs ml-auto hidden md:block">{endpoint.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Example */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-6">// USAGE EXAMPLE</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Terminal title="report-threat.sh">
              <pre className="text-xs leading-relaxed">
{`curl -X POST \\
  https://hivefence-api.seojoon-kim.workers.dev/api/v1/threats/report \\
  -H "Content-Type: application/json" \\
  -d '{
    "patternHash": "sha256:a1b2c3...",
    "category": "role_override",
    "severity": 4,
    "description": "Fake system prompt"
  }'`}
              </pre>
            </Terminal>
            
            <Terminal title="response.json">
              <pre className="text-xs leading-relaxed">
{`{
  "message": "Pattern reported successfully",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending"
}`}
              </pre>
            </Terminal>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 px-6 bg-zinc-900/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-6">// TECH STACK</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
            {[
              { name: 'Cloudflare Workers', desc: 'Edge compute' },
              { name: 'D1 Database', desc: 'SQLite at edge' },
              { name: 'Hono', desc: 'Web framework' },
              { name: 'TypeScript', desc: 'Type safety' },
            ].map((tech, i) => (
              <div key={i} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/30">
                <div className="text-amber-500">{tech.name}</div>
                <div className="text-xs text-zinc-500 mt-1">{tech.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Detection Categories */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-6">// DETECTION CATEGORIES</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 font-mono text-xs">
            {[
              'role_override', 'fake_system', 'jailbreak', 'data_exfil', 'privilege_esc',
              'context_manip', 'injection', 'obfuscation', 'social_eng', 'memory_poison',
              'chain_attack', 'boundary_test', 'prompt_leak', 'model_manip', 'other'
            ].map((cat, i) => (
              <div key={i} className="px-3 py-2 rounded bg-zinc-900/50 border border-zinc-800 text-zinc-400">
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <Terminal title="get-started">
            <div className="text-zinc-500"># Clone the repository</div>
            <div className="text-green-400">$ git clone https://github.com/seojoonkim/hivefence.git</div>
            <div className="text-zinc-500 mt-3"># Start protecting your agents</div>
            <div className="text-green-400">$ cd hivefence && npm install</div>
            <div className="mt-4 pt-4 border-t border-zinc-800">
              <a href="https://github.com/seojoonkim/hivefence" target="_blank" 
                 className="inline-flex items-center gap-2 px-4 py-2 rounded bg-amber-500 text-black font-mono text-sm font-bold hover:bg-amber-400 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                View on GitHub
              </a>
            </div>
          </Terminal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs font-mono text-zinc-500">
          <div className="flex items-center gap-2">
            <BeeLogo size={16} />
            <span>hivefence v0.1.0</span>
          </div>
          <div>MIT License • <a href="https://github.com/seojoonkim" className="text-amber-500 hover:underline">@seojoonkim</a></div>
        </div>
      </footer>
    </main>
  );
}
