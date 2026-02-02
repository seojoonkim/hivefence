'use client';

import { useState, useEffect } from 'react';

// Hexagon SVG component
const Hexagon = ({ className = '', filled = false }: { className?: string; filled?: boolean }) => (
  <svg viewBox="0 0 100 115" className={className}>
    <polygon 
      points="50,0 100,28.75 100,86.25 50,115 0,86.25 0,28.75"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

// Network visualization component
const NetworkViz = () => {
  const nodes = [
    { x: 50, y: 50, delay: 0, attacked: true },
    { x: 20, y: 30, delay: 0.5 },
    { x: 80, y: 30, delay: 1 },
    { x: 20, y: 70, delay: 1.5 },
    { x: 80, y: 70, delay: 2 },
    { x: 50, y: 15, delay: 2.5 },
    { x: 50, y: 85, delay: 3 },
  ];

  return (
    <div className="relative w-full h-64 md:h-80">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
        {/* Connection lines */}
        <g stroke="rgba(245, 158, 11, 0.2)" strokeWidth="0.5">
          <line x1="50" y1="50" x2="20" y2="30" />
          <line x1="50" y1="50" x2="80" y2="30" />
          <line x1="50" y1="50" x2="20" y2="70" />
          <line x1="50" y1="50" x2="80" y2="70" />
          <line x1="50" y1="50" x2="50" y2="15" />
          <line x1="50" y1="50" x2="50" y2="85" />
          <line x1="20" y1="30" x2="50" y2="15" />
          <line x1="80" y1="30" x2="50" y2="15" />
          <line x1="20" y1="70" x2="50" y2="85" />
          <line x1="80" y1="70" x2="50" y2="85" />
        </g>
      </svg>
      
      {nodes.map((node, i) => (
        <div
          key={i}
          className={`absolute w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2 ${
            node.attacked 
              ? 'bg-red-500 node-pulse' 
              : 'bg-amber-500'
          }`}
          style={{ 
            left: `${node.x}%`, 
            top: `${node.y}%`,
            animationDelay: `${node.delay}s`
          }}
        >
          {node.attacked && (
            <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75" 
                 style={{ animationDelay: '1s', animationDuration: '1.5s' }} />
          )}
        </div>
      ))}
      
      {/* Immunity spread effect */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 rounded-full border border-green-500/30 animate-ping" 
             style={{ animationDuration: '3s' }} />
      </div>
    </div>
  );
};

// Stats counter component
const StatCounter = ({ value, label, suffix = '' }: { value: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [value]);
  
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold text-gradient">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-zinc-400 mt-2">{label}</div>
    </div>
  );
};

// Feature card component
const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="group relative p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1">
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative">
      <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  </div>
);

export default function Home() {
  const [apiStatus, setApiStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  
  useEffect(() => {
    fetch('https://hivefence-api.seojoon-kim.workers.dev/')
      .then(res => res.json())
      .then(data => setApiStatus(data.status === 'ok' ? 'online' : 'offline'))
      .catch(() => setApiStatus('offline'));
  }, []);

  return (
    <main className="min-h-screen hex-pattern">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-zinc-950/80 border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 text-amber-500">
              <Hexagon filled />
            </div>
            <span className="text-xl font-bold">HiveFence</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
            <a href="#features" className="hover:text-amber-500 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-amber-500 transition-colors">How it Works</a>
            <a href="https://github.com/seojoonkim/hivefence" target="_blank" className="hover:text-amber-500 transition-colors">GitHub</a>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
              apiStatus === 'online' ? 'bg-green-500/10 text-green-500' :
              apiStatus === 'offline' ? 'bg-red-500/10 text-red-500' :
              'bg-zinc-500/10 text-zinc-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                apiStatus === 'online' ? 'bg-green-500 animate-pulse' :
                apiStatus === 'offline' ? 'bg-red-500' :
                'bg-zinc-500 animate-pulse'
              }`} />
              {apiStatus === 'online' ? 'API Online' : apiStatus === 'offline' ? 'API Offline' : 'Checking...'}
            </div>
            <a 
              href="https://github.com/seojoonkim/hivefence" 
              target="_blank"
              className="px-4 py-2 rounded-lg bg-amber-500 text-black font-medium text-sm hover:bg-amber-400 transition-colors"
            >
              Get Started
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="stagger-children">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-500 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Distributed AI Security
              </div>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                When one is attacked,
                <br />
                <span className="text-gradient">all become immune.</span>
              </h1>
              <p className="text-xl text-zinc-400 mb-8 max-w-lg">
                HiveFence is a collective defense system for AI agents. 
                Detect prompt injection attacks and share immunity across the entire network.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="https://github.com/seojoonkim/hivefence"
                  target="_blank"
                  className="px-6 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-all hover:scale-105 glow-amber"
                >
                  View on GitHub
                </a>
                <a 
                  href="#how-it-works"
                  className="px-6 py-3 rounded-xl border border-zinc-700 text-zinc-300 font-semibold hover:border-amber-500/50 hover:text-amber-500 transition-all"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="relative">
              <NetworkViz />
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-center">
                <p className="text-sm text-zinc-500">
                  <span className="text-red-500">●</span> Attack detected → 
                  <span className="text-green-500"> ●</span> Network immunized
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-zinc-800 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCounter value={15} suffix="+" label="Attack Categories" />
            <StatCounter value={4} label="Languages Supported" />
            <StatCounter value={100} suffix="%" label="Open Source" />
            <StatCounter value={0} label="Dependencies" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Defense in <span className="text-gradient">Depth</span>
            </h2>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Multiple layers of protection working together to keep your AI agents secure.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard 
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Local Defense"
              description="Real-time detection of prompt injection attacks with zero external dependencies. Works completely offline."
            />
            <FeatureCard 
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              }
              title="Collective Immunity"
              description="When one agent detects a new attack, the pattern is shared across the entire network. Everyone benefits."
            />
            <FeatureCard 
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Community Governance"
              description="Transparent pattern validation through community voting. Maintainers approve final additions."
            />
            <FeatureCard 
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              }
              title="Multi-Language"
              description="Detects attacks in English, Korean, Japanese, and Chinese. More languages coming soon."
            />
            <FeatureCard 
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              }
              title="Privacy First"
              description="Only pattern hashes are shared. Your actual data never leaves your system."
            />
            <FeatureCard 
              icon={
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Zero Latency"
              description="Local detection happens in microseconds. No API calls needed for threat assessment."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How it <span className="text-gradient">Works</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Detect', desc: 'Agent detects a new prompt injection attack' },
              { step: '02', title: 'Report', desc: 'Pattern hash is anonymously submitted to the network' },
              { step: '03', title: 'Validate', desc: 'Community votes on the validity of the pattern' },
              { step: '04', title: 'Distribute', desc: 'Approved patterns are distributed to all agents' },
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-6xl font-bold text-zinc-800 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2 text-amber-500">{item.title}</h3>
                <p className="text-zinc-400">{item.desc}</p>
                {i < 3 && (
                  <div className="hidden md:block absolute top-8 right-0 w-1/2 h-px bg-gradient-to-r from-amber-500/50 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Simple <span className="text-gradient">API</span>
              </h2>
              <p className="text-xl text-zinc-400 mb-8">
                Report threats, sync patterns, and query the network with a clean REST API.
              </p>
              <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Live API: hivefence-api.seojoon-kim.workers.dev
              </div>
            </div>
            <div className="code-block p-6 overflow-x-auto">
              <pre className="text-sm">
                <code className="text-zinc-300">
{`# Report a threat pattern
curl -X POST https://hivefence-api.seojoon-kim.workers.dev/api/v1/threats/report \\
  -H "Content-Type: application/json" \\
  -d '{
    "patternHash": "sha256:abc123...",
    "category": "role_override",
    "severity": 4
  }'

# Get latest approved patterns
curl https://hivefence-api.seojoon-kim.workers.dev/api/v1/threats/latest`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl animated-border opacity-50 blur-xl" />
            <div className="relative p-12 rounded-3xl bg-zinc-900 border border-zinc-800">
              <div className="w-16 h-16 mx-auto mb-6 text-amber-500 float">
                <Hexagon filled />
              </div>
              <h2 className="text-4xl font-bold mb-4">Join the Hive</h2>
              <p className="text-xl text-zinc-400 mb-8 max-w-xl mx-auto">
                Protect your AI agents with collective intelligence. Open source, privacy-first, community-driven.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a 
                  href="https://github.com/seojoonkim/hivefence"
                  target="_blank"
                  className="px-8 py-4 rounded-xl bg-amber-500 text-black font-semibold text-lg hover:bg-amber-400 transition-all hover:scale-105"
                >
                  Get Started on GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 text-amber-500">
              <Hexagon filled />
            </div>
            <span className="font-semibold">HiveFence</span>
          </div>
          <p className="text-zinc-500 text-sm">
            Built with 🐝 by <a href="https://github.com/seojoonkim" target="_blank" className="text-amber-500 hover:underline">Simon Kim</a>
          </p>
          <div className="flex items-center gap-6 text-sm text-zinc-500">
            <a href="https://github.com/seojoonkim/hivefence" target="_blank" className="hover:text-amber-500 transition-colors">GitHub</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Docs</a>
            <a href="#" className="hover:text-amber-500 transition-colors">API</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
