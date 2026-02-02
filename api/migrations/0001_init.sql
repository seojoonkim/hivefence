-- HiveFence Threat Intelligence Database Schema

-- Threat patterns table
CREATE TABLE IF NOT EXISTS threat_patterns (
  id TEXT PRIMARY KEY,
  pattern_hash TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  severity INTEGER DEFAULT 3,
  description TEXT,
  
  -- Lifecycle
  status TEXT DEFAULT 'pending',
  reporter_id TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  approved_at TEXT,
  approved_by TEXT,
  
  -- Stats
  vote_up INTEGER DEFAULT 0,
  vote_down INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 1,
  
  -- Signature (for approved patterns)
  signature TEXT
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY,
  pattern_id TEXT NOT NULL,
  voter_hash TEXT NOT NULL,
  vote INTEGER NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(pattern_id, voter_hash),
  FOREIGN KEY (pattern_id) REFERENCES threat_patterns(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_patterns_status ON threat_patterns(status);
CREATE INDEX IF NOT EXISTS idx_patterns_hash ON threat_patterns(pattern_hash);
CREATE INDEX IF NOT EXISTS idx_patterns_approved ON threat_patterns(approved_at);
CREATE INDEX IF NOT EXISTS idx_votes_pattern ON votes(pattern_id);
