const test = require('node:test');
const assert = require('node:assert/strict');
const { app, normalize, bodyFromPayload, appendQuery, listOptions } = require('./server');

test('normalizes Gmail headers and unread state', () => {
  const m = normalize({ id:'1', threadId:'t1', labelIds:['INBOX','UNREAD'], snippet:'hello', payload:{headers:[{name:'From',value:'Alice <alice@example.com>'},{name:'Subject',value:'Hello'},{name:'Date',value:'Tue, 01 Sep 2026 10:00:00 +0000'}], mimeType:'text/plain', body:{data:Buffer.from('body').toString('base64url')}} });
  assert.equal(m.sender,'Alice <alice@example.com>'); assert.equal(m.subject,'Hello'); assert.equal(m.body,'body'); assert.equal(m.unread,true);
});

test('walks multipart payloads for text body', () => {
  const p={mimeType:'multipart/alternative',parts:[{mimeType:'text/html',body:{data:Buffer.from('<p>x</p>').toString('base64url')}},{mimeType:'text/plain',body:{data:Buffer.from('plain text').toString('base64url')}}]};
  assert.equal(bodyFromPayload(p),'plain text');
});

test('builds Gmail search syntax safely', () => {
  const req={query:{q:'from:alice',keyword:'project',unread:'true',after:'123'}};
  assert.equal(appendQuery(req),'from:alice project is:unread after:123');
});

test('archive uses Gmail search instead of an invalid ARCHIVE label id', () => {
  const options=listOptions({query:{label:'ARCHIVE'}});
  assert.equal(options.labelIds,undefined); assert.match(options.q,/-label:inbox/); assert.match(options.q,/-label:trash/); assert.match(options.q,/-label:spam/);
});

test('unauthenticated API requests are rejected', async () => {
  const server=app.listen(0);
  try { const port=server.address().port; const r=await fetch(`http://127.0.0.1:${port}/api/me`); assert.equal(r.status,401); assert.equal((await r.json()).error,'AUTH_REQUIRED'); }
  finally { await new Promise(resolve=>server.close(resolve)); }
});
