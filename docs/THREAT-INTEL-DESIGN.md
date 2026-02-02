# Prompt Guard: Distributed Immunity System

> 하나가 공격당하면 전체를 면역시키는 분산 위협 인텔리전스 시스템

**Version:** 0.1.0 (Draft)  
**Date:** 2026-02-02  
**Author:** Zeon + Simon

---

## 1. Overview

```
┌─────────────────────────────────────────────┐
│        ClawdHub Threat Intelligence         │
│         (Cloudflare Workers + D1)           │
├─────────────────────────────────────────────┤
│  • 익명화된 공격 패턴 수집                  │
│  • 커뮤니티 스크리닝 & 보팅                 │
│  • 중앙 최종 승인                           │
│  • 서명된 업데이트 배포                     │
└──────────────────┬──────────────────────────┘
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
   ┌───────┐   ┌───────┐   ┌───────┐
   │ Bot A │   │ Bot B │   │ Bot C │
   │       │   │       │   │       │
   │ 공격  │──▶│ 면역  │   │ 면역  │
   │ 탐지! │   │ 획득  │   │ 획득  │
   └───────┘   └───────┘   └───────┘
```

---

## 2. Architecture

### 2.1 Backend Stack

**선택: Cloudflare Workers + D1 + KV**

| Component | Role | Why |
|-----------|------|-----|
| **Workers** | API 엔드포인트 | 엣지 배포, DDoS 방어 내장 |
| **D1** | 패턴 저장소 | SQLite 기반, 충분한 성능 |
| **KV** | 캐시 & Rate Limit | 빠른 조회, 스팸 방지 |
| **WebCrypto** | 서명/검증 | 패턴 무결성 보장 |

### 2.2 API Endpoints

```
POST   /api/v1/threats/report     # 패턴 제보
GET    /api/v1/threats/pending    # 보팅 대기 목록
POST   /api/v1/threats/:id/vote   # 보팅
POST   /api/v1/threats/:id/approve  # 최종 승인 (maintainer only)
GET    /api/v1/threats/latest     # 최신 승인 패턴 fetch
GET    /api/v1/threats/sync       # 전체 동기화 (since timestamp)
```

### 2.3 Database Schema (D1)

```sql
-- 위협 패턴
CREATE TABLE threat_patterns (
  id TEXT PRIMARY KEY,
  pattern_hash TEXT NOT NULL UNIQUE,  -- SHA-256 of normalized pattern
  category TEXT NOT NULL,              -- role_override, fake_system, jailbreak, etc
  severity INTEGER DEFAULT 3,          -- 1-5
  description TEXT,
  
  -- Lifecycle
  status TEXT DEFAULT 'pending',       -- pending, voting, approved, rejected
  reporter_id TEXT,                    -- 익명 ID (not user ID)
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  approved_at TEXT,
  approved_by TEXT,
  
  -- Stats
  vote_up INTEGER DEFAULT 0,
  vote_down INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 1,      -- 동일 패턴 제보 횟수
  
  -- Signature (approved only)
  signature TEXT
);

-- 보팅 기록
CREATE TABLE votes (
  id TEXT PRIMARY KEY,
  pattern_id TEXT NOT NULL,
  voter_hash TEXT NOT NULL,            -- 익명화된 voter ID
  vote INTEGER NOT NULL,               -- 1 or -1
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pattern_id, voter_hash)
);

-- Rate limiting (KV가 더 적합하지만 백업용)
CREATE TABLE rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0,
  window_start TEXT
);
```

---

## 3. Governance Model

### 3.1 Flow

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  제보    │───▶│ 스크리닝 │───▶│  보팅    │───▶│  승인    │───▶│  배포    │
│ (누구나) │    │ (자동)   │    │(커뮤니티)│    │ (중앙)   │    │ (서명)   │
└──────────┘    └──────────┘    └──────────┘    └──────────┘    └──────────┘
```

### 3.2 Roles & Permissions

| Role | 제보 | 보팅 | 승인 | 관리 |
|------|------|------|------|------|
| `anonymous` | ✅ (rate limited) | ❌ | ❌ | ❌ |
| `reporter` | ✅ | ❌ | ❌ | ❌ |
| `voter` | ✅ | ✅ | ❌ | ❌ |
| `maintainer` | ✅ | ✅ | ✅ | ❌ |
| `admin` | ✅ | ✅ | ✅ | ✅ |

**승급 조건:**
- `reporter` → `voter`: 승인된 제보 3개 이상
- `voter` → `maintainer`: Admin 지정

### 3.3 Voting Thresholds

- **보팅 오픈**: 제보 후 자동
- **보팅 통과**: `vote_up >= 5` AND `vote_up / total >= 0.7`
- **보팅 기간**: 7일 (이후 자동 expire)
- **최종 승인**: maintainer 1인 이상 approve

---

## 4. Security Design

### 4.1 Privacy

- ✅ 패턴 hash만 저장 (원문 ❌)
- ✅ 제보자 ID 익명화 (hash)
- ✅ 보팅자 ID 익명화 (hash)
- ✅ IP 로깅 없음

### 4.2 Abuse Prevention

```javascript
// Rate Limits
const LIMITS = {
  report: { window: '1h', max: 10 },    // 시간당 10개 제보
  vote: { window: '1h', max: 50 },      // 시간당 50개 투표
  fetch: { window: '1m', max: 60 },     // 분당 60회 조회
};
```

### 4.3 Pattern Signing

```javascript
// 승인된 패턴은 서명됨
const signature = await crypto.subtle.sign(
  'ECDSA',
  PRIVATE_KEY,
  new TextEncoder().encode(JSON.stringify({
    id: pattern.id,
    hash: pattern.pattern_hash,
    approved_at: pattern.approved_at
  }))
);

// 클라이언트는 서명 검증 후 적용
const valid = await crypto.subtle.verify(
  'ECDSA',
  PUBLIC_KEY,
  signature,
  payload
);
```

### 4.4 API Authentication

```
Authorization: Bearer <clawdhub_token>
X-Client-Version: prompt-guard/2.5.1
X-Request-Signature: <HMAC of body>
```

---

## 5. Client Integration (prompt-guard)

### 5.1 Report Threat

```javascript
// 탐지 시 보고 (opt-in)
if (config.threatIntel.reportEnabled) {
  await clawdhub.threats.report({
    patternHash: sha256(normalizePattern(detected.pattern)),
    category: detected.category,
    severity: detected.severity,
    // 원문은 전송하지 않음
  });
}
```

### 5.2 Sync Patterns

```bash
# CLI
clawdhub sync prompt-guard --threat-intel

# 자동 (config)
threatIntel:
  enabled: true
  autoSync: true
  syncInterval: 24h
```

### 5.3 Local Cache

```javascript
// ~/.clawdbot/threat-intel/
// ├── patterns.json      # 캐시된 패턴
// ├── last_sync          # 마지막 동기화 시간
// └── public_key.pem     # 서명 검증용 공개키
```

---

## 6. Pattern Format

### 6.1 Submission

```json
{
  "pattern_hash": "sha256:a1b2c3...",
  "category": "role_override",
  "severity": 4,
  "description": "Attempts to override assistant role via fake XML tags"
}
```

### 6.2 Approved Pattern (distributed)

```json
{
  "id": "threat_abc123",
  "pattern_hash": "sha256:a1b2c3...",
  "category": "role_override",
  "severity": 4,
  "approved_at": "2026-02-02T12:00:00Z",
  "signature": "base64..."
}
```

---

## 7. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Cloudflare Workers 프로젝트 설정
- [ ] D1 스키마 배포
- [ ] 기본 API 구현 (report, fetch)
- [ ] ClawdHub 토큰 연동

### Phase 2: Governance (Week 3-4)
- [ ] 보팅 시스템 구현
- [ ] 권한 시스템 구현
- [ ] 승인 워크플로우
- [ ] 서명 시스템

### Phase 3: Client Integration (Week 5-6)
- [ ] prompt-guard 연동
- [ ] CLI 명령어 추가
- [ ] 자동 sync 구현
- [ ] 로컬 캐시

### Phase 4: Polish (Week 7-8)
- [ ] 대시보드 UI (optional)
- [ ] 통계/분석
- [ ] 문서화
- [ ] 베타 테스트

---

## 8. Open Questions

1. **패턴 만료**: 오래된 패턴 자동 expire? (예: 1년)
2. **버전 관리**: 스킬 버전별 호환성 체크 필요?
3. **오프라인 모드**: sync 실패 시 로컬 캐시만 사용?
4. **알림**: 새 위협 승인 시 알림 채널? (Discord, email?)

---

## 9. References

- [Prompt Guard Skill](../skills/prompt-guard/SKILL.md)
- [ClawdHub CLI](../skills/clawdhub/SKILL.md)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [D1 Docs](https://developers.cloudflare.com/d1/)

---

*Last updated: 2026-02-02 by Zeon 🌌*
