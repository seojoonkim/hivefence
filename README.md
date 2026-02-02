# 🐝 HiveFence

**Distributed AI Security — Prompt injection defense with collective immunity**

> When one is attacked, all become immune.

---

## Overview

HiveFence is a security framework for AI assistants that provides:

1. **Local Defense** — Real-time prompt injection detection & blocking
2. **Collective Immunity** — Attack patterns shared across the network
3. **Community Governance** — Transparent, community-driven threat validation

```
┌─────────────────────────────────────────────┐
│           HiveFence Threat Intel            │
│        (Central Intelligence Hub)           │
├─────────────────────────────────────────────┤
│  • Anonymous attack pattern collection      │
│  • Community screening & voting             │
│  • Signed pattern distribution              │
└──────────────────┬──────────────────────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   ┌───────┐   ┌───────┐   ┌───────┐
   │ Bot A │   │ Bot B │   │ Bot C │
   │       │   │       │   │       │
   │Attack │──▶│Immune │   │Immune │
   │Detect!│   │  ✓    │   │  ✓    │
   └───────┘   └───────┘   └───────┘
```

## Features

### 🛡️ Local Defense (v2.5.1)
- Multi-language detection (EN/KO/JA/ZH)
- 15+ attack categories
- Severity scoring (1-5)
- Automatic logging
- Zero external dependencies

### 🌐 Collective Immunity (Coming Soon)
- Distributed threat intelligence
- Privacy-preserving pattern sharing
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

## Documentation

- [Architecture](./ARCHITECTURE.md) — System design
- [Skill Guide](./SKILL.md) — Usage instructions
- [Security](./SECURITY.md) — Security considerations
- [Threat Intel Design](./docs/THREAT-INTEL-DESIGN.md) — Distributed immunity system

## Roadmap

- [x] **v2.x** — Local prompt injection defense
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
