# 🐝 HiveFence

**The Runtime Security Layer for Autonomous AI Agents**

> When one is attacked, all become immune. Defense-in-depth for agentic systems.

---

## Overview

HiveFence is a **comprehensive runtime security framework** for AI agents that goes far beyond prompt injection detection. It provides defense-in-depth across the full attack surface of autonomous AI systems:

1. **Local Defense** — Real-time threat detection & blocking across 6 attack categories
2. **Collective Immunity** — Attack patterns shared across the network instantly
3. **Community Governance** — Transparent, community-driven threat validation

```
┌─────────────────────────────────────────────────────────────┐
│                  HiveFence Runtime Security                  │
│            The Immune System for AI Agents                   │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Prompt   │ │ Supply   │ │ Memory   │ │ Action   │       │
│  │Injection │ │ Chain    │ │Poisoning │ │  Gate    │       │
│  │ Defense  │ │ Security │ │ Guard    │ │ Enforce  │       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
│       │             │            │             │             │
│  ┌────┴─────┐ ┌────┴─────┐                                 │
│  │ Unicode  │ │ Cascade  │                                  │
│  │Stegano   │ │Amplify   │     ┌──────────────────────┐    │
│  │ Defense  │ │ Guard    │     │  Collective Immunity  │    │
│  └────┬─────┘ └────┬─────┘     │  Network (C.I.N.)    │    │
│       │             │           │                      │    │
│       └──────┬──────┘           │  One attacked →      │    │
│              ▼                  │  All immune           │    │
│     ┌──────────────┐           └──────────────────────┘    │
│     │ Pattern Hub  │                                        │
│     │ 600+ rules   │                                        │
│     └──────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

## Full Attack Surface Coverage

| Attack Category | Severity | Description |
|----------------|----------|-------------|
| **Prompt Injection** | CRITICAL-HIGH | Instruction override, jailbreak, system impersonation, token smuggling |
| **Supply Chain Injection** | CRITICAL | Malicious skills with hidden payloads, lifecycle hook exploits, credential exfiltration |
| **Memory Poisoning** | HIGH | Persistent write injection into MEMORY.md, AGENTS.md, SOUL.md |
| **Action Gate Bypass** | HIGH | Financial transfers, credential export, access control changes without approval |
| **Unicode Steganography** | HIGH | Bidi overrides (U+202E), zero-width chars, invisible instruction hiding |
| **Cascade Amplification** | MEDIUM | Infinite sub-agent loops, recursive spawning, cost explosion attacks |
| **Identity Override** | CRITICAL-HIGH | Cognitive rootkit, system prompt extraction, role manipulation |

## Features

### 🛡️ Runtime Security (v2.5.1)
- Multi-language detection (EN/KO/JA/ZH)
- 20+ attack categories across 6 attack surfaces
- Severity scoring (1-5)
- Automatic logging
- Zero external dependencies

### 🌐 Collective Immunity (Coming Soon)
- Distributed threat intelligence
- Privacy-preserving pattern sharing (SHA-256 hashes only)
- Cryptographically signed updates
- Opt-in telemetry

### 👥 Community Governance (Coming Soon)
- Transparent pattern review
- Community voting
- Maintainer approval
- Role-based permissions

## Quick Start

```bash
# Install as Clawdbot skill
clawdhub install hivefence

# Or clone directly
git clone https://github.com/seojoonkim/hivefence.git
```

## Why HiveFence?

**Without protection:**
- 91% injection attack success rate
- 84% data extraction success rate
- System prompts leaked on turn 1

(Source: [ZeroLeaks Security Assessment](https://x.com/NotLucknite/status/2017665998514475350))

**With HiveFence:**
- Defense-in-depth across all 6 attack surfaces
- Collective immunity from the network
- Community-validated patterns (zero false positives)
- <50ms detection latency

## Security Stack Recommendation

For maximum protection, use HiveFence with:

1. **ACIP** — Advanced Cognitive Inoculation Prompt (behavioral boundaries)
2. **HiveFence** — Runtime security + collective immunity
3. **SkillGuard** — Audit skills before installation

As recommended in [@VittoStack's Security Guide](https://x.com/vittostack/status/2018326025373900881) (34K+ views)

## Documentation

- [Architecture](./ARCHITECTURE.md) — System design
- [Skill Guide](./SKILL.md) — Usage instructions
- [Security](./SECURITY.md) — Security considerations
- [Threat Intel Design](./docs/THREAT-INTEL-DESIGN.md) — Distributed immunity system

## Roadmap

- [x] **v2.x** — Local prompt injection defense
- [x] **v2.5** — Supply chain & memory poisoning defense
- [ ] **v3.0** — Threat intelligence API (Cloudflare Workers + D1)
- [ ] **v3.1** — Community voting system
- [ ] **v3.2** — Automatic pattern sync
- [ ] **v4.0** — Full collective immunity

## Contributing

Contributions welcome! See [SECURITY.md](./SECURITY.md) for responsible disclosure.

## License

MIT

---

**hivefence.com** (coming soon)

Built with 🐝 by [Simon Kim](https://github.com/seojoonkim)
