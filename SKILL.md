---
name: hivefence
version: 1.2.0
description: "Runtime security layer for autonomous AI agents. Covers 6 attack surfaces: prompt injection, supply chain injection, memory poisoning, action gate bypass, unicode steganography, and cascade amplification. Collective immunity network — when one agent detects an attack, all connected agents become immune. 600+ patterns, token splitting bypass defense with 6-pass normalization."
---

# HiveFence v1.2.0

🐝 **The Runtime Security Layer for Autonomous AI Agents**

> When one is attacked, all become immune. Defense-in-depth for agentic systems.

## What is HiveFence?

HiveFence is a comprehensive runtime security framework that protects AI agents across the full attack surface — not just prompt injection:

1. **Detect** — Scan incoming prompts against 600+ patterns across 6 attack categories
2. **Report** — New attack patterns are hashed and submitted to the network
3. **Immunize** — Community validates the pattern, then every connected agent gets the update

## Attack Surface Coverage

| Category | Severity | Patterns |
|----------|----------|----------|
| Prompt Injection | CRITICAL-HIGH | Instruction override, jailbreak, impersonation, extraction |
| Supply Chain Injection | CRITICAL | Malicious skills, lifecycle hooks, credential exfil |
| Memory Poisoning | HIGH | Persistent write injection to agent config files |
| Action Gate Bypass | HIGH | Unauthorized financial, credential, access, destructive actions |
| Unicode Steganography | HIGH | Bidi overrides, zero-width chars, invisible instructions |
| Cascade Amplification | MEDIUM | Infinite agent spawning, recursive loops, cost explosion |

## Features

- 🔍 **Real-time Detection** — Pattern matching + semantic analysis in <50ms
- 🌍 **Multi-language** — EN, KO, JA, ZH attack detection
- 🗳️ **Community Governance** — Democratic voting on new patterns
- 🔐 **Privacy-preserving** — Only SHA-256 hashes shared, not raw content
- 📊 **Severity Scoring** — Risk-based prioritization (0-100)
- ⚡ **Edge-first** — Cloudflare Workers at 300+ locations

## Installation

```bash
# Via ClawdHub
npx clawhub install hivefence

# Or via npm
npm install hivefence
```

## Quick Start

```javascript
import { protect, reportThreat } from 'hivefence'

// Scan incoming prompt
const result = await protect(userInput)

if (result.blocked) {
  console.log(`Threat blocked: ${result.category}`)
  // Pattern automatically reported to network
}
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/threats/report` | Submit new threat pattern |
| GET | `/api/v1/threats/pending` | Get patterns awaiting votes |
| POST | `/api/v1/threats/:id/vote` | Vote on a pattern |
| GET | `/api/v1/threats/latest` | Fetch approved patterns |
| GET | `/api/v1/stats` | Network statistics |

**Base URL:** https://hivefence-api.seojoon-kim.workers.dev

## Security Stack Recommendation

For maximum protection, use HiveFence with:

1. **ACIP** — Advanced Cognitive Inoculation Prompt (behavioral boundaries)
2. **HiveFence** — Runtime security + collective immunity
3. **SkillGuard** — Audit skills before installation

## Links

- **Website:** https://hivefence.com
- **GitHub:** https://github.com/seojoonkim/hivefence
- **API Docs:** https://hivefence.com/docs

## License

MIT © 2026 Simon Kim (@seojoonkim)
