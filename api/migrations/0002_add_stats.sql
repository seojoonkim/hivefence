-- HiveFence Stats Tables
-- Tracks connected agents and blocked threats

-- Connected agents table
CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  client_hash TEXT NOT NULL UNIQUE,  -- SHA-256 of client identifier
  name TEXT,                          -- Optional friendly name
  version TEXT,                       -- SDK version
  first_seen TEXT DEFAULT CURRENT_TIMESTAMP,
  last_seen TEXT DEFAULT CURRENT_TIMESTAMP,
  request_count INTEGER DEFAULT 0,
  threat_count INTEGER DEFAULT 0,     -- Threats this agent reported/blocked
  is_active INTEGER DEFAULT 1         -- Active in last 24h
);

-- Threat events (actual blocks)
CREATE TABLE IF NOT EXISTS threat_events (
  id TEXT PRIMARY KEY,
  agent_id TEXT,                      -- Which agent blocked it
  pattern_id TEXT,                    -- Which pattern matched (if known)
  pattern_hash TEXT,                  -- Hash of detected pattern
  category TEXT NOT NULL,
  severity INTEGER DEFAULT 3,
  blocked_at TEXT DEFAULT CURRENT_TIMESTAMP,
  metadata TEXT,                      -- JSON metadata (optional)
  FOREIGN KEY (agent_id) REFERENCES agents(id),
  FOREIGN KEY (pattern_id) REFERENCES threat_patterns(id)
);

-- Daily stats aggregation (for fast queries)
CREATE TABLE IF NOT EXISTS daily_stats (
  date TEXT PRIMARY KEY,              -- YYYY-MM-DD
  agents_active INTEGER DEFAULT 0,
  threats_blocked INTEGER DEFAULT 0,
  patterns_added INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_agents_active ON agents(is_active, last_seen);
CREATE INDEX IF NOT EXISTS idx_agents_hash ON agents(client_hash);
CREATE INDEX IF NOT EXISTS idx_events_date ON threat_events(blocked_at);
CREATE INDEX IF NOT EXISTS idx_events_agent ON threat_events(agent_id);
CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_stats(date);
