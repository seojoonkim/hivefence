'use client';

import { useState, useEffect } from 'react';

// Custom Bee Logo SVG
const BeeLogo = ({ className = '', size = 48 }: { className?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className}>
    {/* Body */}
    <ellipse cx="32" cy="36" rx="14" ry="18" fill="#F59E0B"/>
    {/* Stripes */}
    <path d="M18 30 h28" stroke="#0a0a0b" strokeWidth="4"/>
    <path d="M18 38 h28" stroke="#0a0a0b" strokeWidth="4"/>
    <path d="M20 46 h24" stroke="#0a0a0b" strokeWidth="4"/>
    {/* Head */}
    <circle cx="32" cy="16" r="10" fill="#F59E0B"/>
    {/* Eyes */}
    <circle cx="28" cy="14" r="2.5" fill="#0a0a0b"/>
    <circle cx="36" cy="14" r="2.5" fill="#0a0a0b"/>
    {/* Antennae */}
    <path d="M28 8 Q26 2 22 2" stroke="#0a0a0b" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <path d="M36 8 Q38 2 42 2" stroke="#0a0a0b" strokeWidth="2" strokeLinecap="round" fill="none"/>
    <circle cx="22" cy="2" r="2" fill="#F59E0B"/>
    <circle cx="42" cy="2" r="2" fill="#F59E0B"/>
    {/* Wings */}
    <ellipse cx="18" cy="28" rx="10" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-20 18 28)"/>
    <ellipse cx="46" cy="28" rx="10" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(20 46 28)"/>
    {/* Stinger */}
    <path d="M32 54 L32 58" stroke="#0a0a0b" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Shield with Bee icon
const ShieldBee = ({ className = '' }: { className?: string }) => (
  <svg width="120" height="140" viewBox="0 0 120 140" fill="none" className={className}>
    {/* Shield shape */}
    <path 
      d="M60 5 L110 25 L110 70 Q110 110 60 135 Q10 110 10 70 L10 25 Z" 
      fill="url(#shieldGradient)"
      stroke="#F59E0B"
      strokeWidth="2"
    />
    {/* Hexagon pattern inside shield */}
    <path d="M60 35 L80 47 L80 71 L60 83 L40 71 L40 47 Z" fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="1"/>
    <path d="M60 45 L72 53 L72 69 L60 77 L48 69 L48 53 Z" fill="none" stroke="rgba(245,158,11,0.4)" strokeWidth="1"/>
    {/* Bee in center */}
    <g transform="translate(40, 40) scale(0.6)">
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
      <ellipse cx="18" cy="28" rx="8" ry="5" fill="rgba(255,255,255,0.4)" transform="rotate(-20 18 28)"/>
      <ellipse cx="46" cy="28" rx="8" ry="5" fill="rgba(255,255,255,0.4)" transform="rotate(20 46 28)"/>
    </g>
    <defs>
      <linearGradient id="shieldGradient" x1="60" y1="5" x2="60" y2="135">
        <stop offset="0%" stopColor="#18181b"/>
        <stop offset="100%" stopColor="#0a0a0b"/>
      </linearGradient>
    </defs>
  </svg>
);

// Compact Network visualization
const NetworkViz = () => (
  <div className="relative w-full h-48">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 100">
      {/* Connection lines */}
      <g stroke="rgba(245,158,11,0.15)" strokeWidth="1">
        <line x1="100" y1="50" x2="40" y2="25"/>
        <line x1="100" y1="50" x2="160" y2="25"/>
        <line x1="100" y1="50" x2="40" y2="75"/>
        <line x1="100" y1="50" x2="160" y2="75"/>
        <line x1="40" y1="25" x2="40" y2="75"/>
        <line x1="160" y1="25" x2="160" y2="75"/>
      </g>
      {/* Center node (attacked) */}
      <circle cx="100" cy="50" r="8" fill="#ef4444" className="animate-pulse"/>
      <circle cx="100" cy="50" r="16" fill="none" stroke="#22c55e" strokeWidth="2" className="animate-ping" style={{animationDuration: '2s'}}/>
      {/* Other nodes */}
      <circle cx="40" cy="25" r="5" fill="#F59E0B"/>
      <circle cx="160" cy="25" r="5" fill="#F59E0B"/>
      <circle cx="40" cy="75" r="5" fill="#F59E0B"/>
      <circle cx="160" cy="75" r="5" fill="#F59E0B"/>
    </svg>
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs text-zinc-500">
      Attack → Detect → Immunize Network
    </div>
  </div>
);

// Feature item (compact)
const Feature = ({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) => (
  <div className="flex gap-4 items-start">
    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold mb-1">{title}</h3>
      <p className="text-sm text-zinc-400">{desc}</p>
    </div>
  </div>
);

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [stats, setStats] = useState({ total: 0, approved: 0 });
  
  useEffect(() => {
    fetch('https://hivefence-api.seojoon-kim.workers.dev/')
      .then(res => res.json())
      .then(data => setApiStatus(data.status === 'ok' ? 'online' : 'offline'))
      .catch(() => setApiStatus('offline'));
    
    fetch('https://hivefence-api.seojoon-kim.workers.dev/api/v1/stats')
      .then(res => res.json())
      .then(data => setStats({ total: data.patterns?.total || 0, approved: data.patterns?.approved || 0 }))
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0b]">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/90 border-b border-zinc-800/50">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BeeLogo size={28} />
            <span className="text-lg font-bold">HiveFence</span>
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
              apiStatus === 'online' ? 'bg-green-500/10 text-green-400' : 'bg-zinc-500/10 text-zinc-400'
            }`}>
              <div className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'online' ? 'bg-green-400' : 'bg-zinc-400'}`} />
              {apiStatus === 'online' ? 'Live' : '...'}
            </div>
            <a 
              href="https://github.com/seojoonkim/hivefence" 
              target="_blank"
              className="px-4 py-1.5 rounded-lg bg-amber-500 text-black text-sm font-medium hover:bg-amber-400 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero - Compact */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-500 text-xs font-medium mb-4">
                <BeeLogo size={16} />
                Distributed AI Security
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                When one is attacked,<br/>
                <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">all become immune.</span>
              </h1>
              <p className="text-zinc-400 mb-6 max-w-md">
                Collective defense for AI agents. Detect prompt injections and share immunity across the entire network.
              </p>
              <div className="flex gap-3 mb-8">
                <a 
                  href="https://github.com/seojoonkim/hivefence"
                  target="_blank"
                  className="px-5 py-2.5 rounded-lg bg-amber-500 text-black font-medium hover:bg-amber-400 transition-all"
                >
                  Get Started
                </a>
                <a 
                  href="#features"
                  className="px-5 py-2.5 rounded-lg border border-zinc-700 text-zinc-300 font-medium hover:border-zinc-500 transition-all"
                >
                  Learn More
                </a>
              </div>
              {/* Quick stats */}
              <div className="flex gap-6 text-sm">
                <div>
                  <div className="text-2xl font-bold text-amber-500">15+</div>
                  <div className="text-zinc-500">Attack Types</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-500">4</div>
                  <div className="text-zinc-500">Languages</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-500">0</div>
                  <div className="text-zinc-500">Dependencies</div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 blur-3xl bg-amber-500/10 rounded-full" />
                <ShieldBee className="relative z-10 drop-shadow-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Network Visual */}
      <section className="py-12 px-6 border-y border-zinc-800/50 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <NetworkViz />
        </div>
      </section>

      {/* Features - Compact Grid */}
      <section id="features" className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Defense in <span className="text-amber-500">Depth</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Feature 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}
              title="Local Defense"
              desc="Real-time detection with zero external dependencies. Works completely offline."
            />
            <Feature 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>}
              title="Collective Immunity"
              desc="Attack patterns shared across the network. When one learns, everyone benefits."
            />
            <Feature 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
              title="Community Governance"
              desc="Transparent validation through community voting. Maintainers approve additions."
            />
            <Feature 
              icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
              title="Privacy First"
              desc="Only pattern hashes shared. Your actual data never leaves your system."
            />
          </div>
        </div>
      </section>

      {/* How it Works - Compact */}
      <section className="py-16 px-6 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">How it Works</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['Detect', 'Report', 'Validate', 'Distribute'].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm font-bold">
                  {i + 1}
                </div>
                <span className="font-medium">{step}</span>
                {i < 3 && <span className="text-zinc-600">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Preview - Compact */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">Simple API</h2>
              <p className="text-zinc-400 mb-4 text-sm">
                Report threats, sync patterns, query the network.
              </p>
              <div className="text-xs text-zinc-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                hivefence-api.seojoon-kim.workers.dev
              </div>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 font-mono text-xs overflow-x-auto">
              <pre className="text-zinc-300">
{`curl -X POST .../api/v1/threats/report \\
  -d '{"patternHash":"sha256:...","category":"role_override"}'

# Response: {"id":"...","status":"pending"}`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Compact */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-8 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800">
            <BeeLogo size={48} className="mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Join the Hive</h2>
            <p className="text-zinc-400 mb-6 text-sm">
              Open source. Privacy-first. Community-driven.
            </p>
            <a 
              href="https://github.com/seojoonkim/hivefence"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Get Started on GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Footer - Minimal */}
      <footer className="py-8 px-6 border-t border-zinc-800/50">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <BeeLogo size={20} />
            <span>HiveFence</span>
          </div>
          <span>Built by <a href="https://github.com/seojoonkim" className="text-amber-500 hover:underline">Simon Kim</a></span>
        </div>
      </footer>
    </main>
  );
}
