import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { sha256 } from 'hono/utils/crypto';

type Bindings = {
  DB: D1Database;
  RATE_LIMIT: KVNamespace;
  ENVIRONMENT: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Client-Version'],
}));

// Health check
app.get('/', (c) => {
  return c.json({
    name: 'HiveFence Threat Intel API',
    version: '0.1.0',
    status: 'ok',
  });
});

// ===================
// THREAT PATTERNS API
// ===================

// Report a new threat pattern
app.post('/api/v1/threats/report', async (c) => {
  const body = await c.req.json();
  const { patternHash, category, severity, description } = body;

  if (!patternHash || !category) {
    return c.json({ error: 'patternHash and category are required' }, 400);
  }

  // Check if pattern already exists
  const existing = await c.env.DB.prepare(
    'SELECT id, report_count FROM threat_patterns WHERE pattern_hash = ?'
  ).bind(patternHash).first();

  if (existing) {
    // Increment report count
    await c.env.DB.prepare(
      'UPDATE threat_patterns SET report_count = report_count + 1 WHERE id = ?'
    ).bind(existing.id).run();

    return c.json({
      message: 'Pattern already reported, count incremented',
      id: existing.id,
      reportCount: (existing.report_count as number) + 1,
    });
  }

  // Create new pattern
  const id = crypto.randomUUID();
  const reporterHash = await sha256(c.req.header('X-Client-ID') || 'anonymous');

  await c.env.DB.prepare(`
    INSERT INTO threat_patterns (id, pattern_hash, category, severity, description, reporter_id, status)
    VALUES (?, ?, ?, ?, ?, ?, 'pending')
  `).bind(id, patternHash, category, severity || 3, description || '', reporterHash).run();

  return c.json({
    message: 'Pattern reported successfully',
    id,
    status: 'pending',
  }, 201);
});

// Get pending patterns for voting
app.get('/api/v1/threats/pending', async (c) => {
  const limit = parseInt(c.req.query('limit') || '20');
  const offset = parseInt(c.req.query('offset') || '0');

  const results = await c.env.DB.prepare(`
    SELECT id, pattern_hash, category, severity, description, vote_up, vote_down, report_count, created_at
    FROM threat_patterns
    WHERE status = 'pending' OR status = 'voting'
    ORDER BY report_count DESC, created_at DESC
    LIMIT ? OFFSET ?
  `).bind(limit, offset).all();

  return c.json({
    patterns: results.results,
    count: results.results?.length || 0,
  });
});

// Vote on a pattern
app.post('/api/v1/threats/:id/vote', async (c) => {
  const patternId = c.req.param('id');
  const body = await c.req.json();
  const { vote } = body; // 1 or -1

  if (vote !== 1 && vote !== -1) {
    return c.json({ error: 'Vote must be 1 (up) or -1 (down)' }, 400);
  }

  const voterHash = await sha256(c.req.header('X-Client-ID') || c.req.header('CF-Connecting-IP') || 'anonymous');

  // Check if already voted
  const existingVote = await c.env.DB.prepare(
    'SELECT id FROM votes WHERE pattern_id = ? AND voter_hash = ?'
  ).bind(patternId, voterHash).first();

  if (existingVote) {
    return c.json({ error: 'Already voted on this pattern' }, 409);
  }

  // Insert vote
  const voteId = crypto.randomUUID();
  await c.env.DB.prepare(
    'INSERT INTO votes (id, pattern_id, voter_hash, vote) VALUES (?, ?, ?, ?)'
  ).bind(voteId, patternId, voterHash, vote).run();

  // Update pattern vote counts
  if (vote === 1) {
    await c.env.DB.prepare(
      'UPDATE threat_patterns SET vote_up = vote_up + 1, status = CASE WHEN status = \'pending\' THEN \'voting\' ELSE status END WHERE id = ?'
    ).bind(patternId).run();
  } else {
    await c.env.DB.prepare(
      'UPDATE threat_patterns SET vote_down = vote_down + 1, status = CASE WHEN status = \'pending\' THEN \'voting\' ELSE status END WHERE id = ?'
    ).bind(patternId).run();
  }

  return c.json({ message: 'Vote recorded', voteId });
});

// Approve a pattern (maintainer only)
app.post('/api/v1/threats/:id/approve', async (c) => {
  const patternId = c.req.param('id');
  const authHeader = c.req.header('Authorization');

  // Simple auth check (in production, use proper JWT verification)
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const pattern = await c.env.DB.prepare(
    'SELECT * FROM threat_patterns WHERE id = ?'
  ).bind(patternId).first();

  if (!pattern) {
    return c.json({ error: 'Pattern not found' }, 404);
  }

  // Update to approved
  await c.env.DB.prepare(`
    UPDATE threat_patterns 
    SET status = 'approved', approved_at = datetime('now'), approved_by = ?
    WHERE id = ?
  `).bind('maintainer', patternId).run();

  return c.json({
    message: 'Pattern approved',
    id: patternId,
    status: 'approved',
  });
});

// Get latest approved patterns
app.get('/api/v1/threats/latest', async (c) => {
  const since = c.req.query('since'); // ISO timestamp
  const limit = parseInt(c.req.query('limit') || '100');

  let query = `
    SELECT id, pattern_hash, category, severity, approved_at, signature
    FROM threat_patterns
    WHERE status = 'approved'
  `;

  if (since) {
    query += ` AND approved_at > ?`;
  }

  query += ` ORDER BY approved_at DESC LIMIT ?`;

  const stmt = since
    ? c.env.DB.prepare(query).bind(since, limit)
    : c.env.DB.prepare(query).bind(limit);

  const results = await stmt.all();

  return c.json({
    patterns: results.results,
    count: results.results?.length || 0,
    fetchedAt: new Date().toISOString(),
  });
});

// Sync all approved patterns
app.get('/api/v1/threats/sync', async (c) => {
  const results = await c.env.DB.prepare(`
    SELECT id, pattern_hash, category, severity, approved_at, signature
    FROM threat_patterns
    WHERE status = 'approved'
    ORDER BY approved_at DESC
  `).all();

  return c.json({
    patterns: results.results,
    totalCount: results.results?.length || 0,
    syncedAt: new Date().toISOString(),
  });
});

// Stats endpoint
app.get('/api/v1/stats', async (c) => {
  const stats = await c.env.DB.prepare(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
      SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
      SUM(CASE WHEN status = 'voting' THEN 1 ELSE 0 END) as voting,
      SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
    FROM threat_patterns
  `).first();

  return c.json({
    patterns: stats,
    timestamp: new Date().toISOString(),
  });
});

export default app;
