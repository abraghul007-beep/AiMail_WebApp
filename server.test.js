const test = require('node:test');
const assert = require('node:assert/strict');
const { app, normalize, bodyFromPayload, appendQuery, listOptions, tools } = require('./server');

test('normalizes Gmail headers and unread state', () => {
  const m = normalize({
    id: '1',
    threadId: 't1',
    labelIds: ['INBOX', 'UNREAD'],
    snippet: 'hello',
    payload: {
      headers: [
        { name: 'From', value: 'Alice <alice@example.com>' },
        { name: 'Subject', value: 'Hello' },
        { name: 'Date', value: 'Tue, 01 Sep 2026 10:00:00 +0000' }
      ],
      mimeType: 'text/plain',
      body: { data: Buffer.from('body').toString('base64url') }
    }
  });
  assert.equal(m.sender, 'Alice <alice@example.com>');
  assert.equal(m.subject, 'Hello');
  assert.equal(m.body, 'body');
  assert.equal(m.unread, true);
});

test('walks multipart payloads for text body', () => {
  const p = {
    mimeType: 'multipart/alternative',
    parts: [
      { mimeType: 'text/html', body: { data: Buffer.from('<p>x</p>').toString('base64url') } },
      { mimeType: 'text/plain', body: { data: Buffer.from('plain text').toString('base64url') } }
    ]
  };
  assert.equal(bodyFromPayload(p), 'plain text');
});

test('builds Gmail search syntax with filters', () => {
  const req = { query: { q: 'from:alice', unread: 'true', after: '123' } };
  assert.equal(appendQuery(req), 'from:alice is:unread after:123');
});

test('archive uses Gmail search instead of an invalid label id', () => {
  const o = listOptions({ query: { label: 'ARCHIVE' } });
  assert.equal(o.labelIds, undefined);
  assert.match(o.q, /-label:inbox/);
  assert.match(o.q, /-label:trash/);
  assert.match(o.q, /-label:spam/);
});

test('unauthenticated API requests are rejected with AUTH_REQUIRED', async () => {
  const s = app.listen(0);
  try {
    const r = await fetch(`http://127.0.0.1:${s.address().port}/api/me`);
    assert.equal(r.status, 401);
    assert.equal((await r.json()).error, 'AUTH_REQUIRED');
  } finally {
    await new Promise(resolve => s.close(resolve));
  }
});

test('registers all required AI UI control tools', () => {
  const toolNames = tools.map(t => t.function.name);
  assert.ok(toolNames.includes('navigate_mail'), 'navigate_mail tool must exist');
  assert.ok(toolNames.includes('search_mail'), 'search_mail tool must exist');
  assert.ok(toolNames.includes('open_email'), 'open_email tool must exist');
  assert.ok(toolNames.includes('filter_mail'), 'filter_mail tool must exist');
  assert.ok(toolNames.includes('compose_email'), 'compose_email tool must exist');
  assert.ok(toolNames.includes('prepare_reply'), 'prepare_reply tool must exist');
  assert.ok(toolNames.includes('prepare_forward'), 'prepare_forward tool must exist');
});