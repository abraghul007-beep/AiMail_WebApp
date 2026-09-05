import { google } from 'googleapis';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify'
];

export function getOAuth2Client() {
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback';
  return new google.auth.OAuth2(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, redirectUri);
}

export function getGmailClient(tokens) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(tokens || {});
  return google.gmail({ version: 'v1', auth: oauth2Client });
}

export const getAuthUrl = (state) => getOAuth2Client().generateAuthUrl({ access_type: 'offline', prompt: 'consent', include_granted_scopes: true, scope: SCOPES, state });
export const getHeader = (headers = [], name) => headers.find(h => String(h.name).toLowerCase() === name.toLowerCase())?.value || '';
export const decodeBase64Url = (str = '') => str ? Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8') : '';

export function extractBodies(payload, messageId = '') {
  let textBody = '', htmlBody = '';
  const inlineImages = [];
  function walk(part) {
    if (!part) return;
    const mime = part.mimeType || '';
    const contentId = (getHeader(part.headers || [], 'Content-ID') || '').replace(/^<|>$/g, '').trim();
    if (mime === 'text/plain' && part.body?.data && !textBody) textBody = decodeBase64Url(part.body.data);
    else if (mime === 'text/html' && part.body?.data && !htmlBody) htmlBody = decodeBase64Url(part.body.data);
    if (mime.startsWith('image/')) {
      if (part.body?.data && contentId) inlineImages.push({ cid: contentId, url: `data:${mime};base64,${part.body.data.replace(/-/g, '+').replace(/_/g, '/')}` });
      else if (part.body?.attachmentId && contentId && messageId) inlineImages.push({ cid: contentId, url: `/api/messages/${encodeURIComponent(messageId)}/attachments/${encodeURIComponent(part.body.attachmentId)}?mime=${encodeURIComponent(mime)}` });
    }
    for (const child of part.parts || []) walk(child);
  }
  walk(payload);
  for (const img of inlineImages) {
    const escapedCid = img.cid.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    htmlBody = htmlBody.replace(new RegExp(`cid:<?${escapedCid}>?`, 'gi'), img.url);
  }
  return { textBody: textBody || (htmlBody ? htmlBody.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ''), htmlBody: htmlBody || (textBody ? `<pre style="font-family:inherit;white-space:pre-wrap;">${textBody}</pre>` : '') };
}

export function normalizeMessage(m) {
  if (!m) return null;
  const headers = m.payload?.headers || [];
  const { textBody, htmlBody } = extractBodies(m.payload, m.id);
  return { id: m.id, threadId: m.threadId, sender: getHeader(headers, 'From'), to: getHeader(headers, 'To'), cc: getHeader(headers, 'Cc'), bcc: getHeader(headers, 'Bcc'), subject: getHeader(headers, 'Subject') || '(no subject)', date: getHeader(headers, 'Date'), snippet: m.snippet || '', body: textBody, htmlBody, unread: (m.labelIds || []).includes('UNREAD'), starred: (m.labelIds || []).includes('STARRED'), labels: m.labelIds || [] };
}

export function buildQuery(params = {}) {
  const parts = [];
  if (params.q) parts.push(params.q);
  if (params.from) parts.push(`from:${params.from}`);
  if (params.to) parts.push(`to:${params.to}`);
  if (params.unread === 'true' || params.unread === true) parts.push('is:unread');
  if (params.after) parts.push(`after:${params.after}`);
  if (params.before) parts.push(`before:${params.before}`);
  return parts.filter(Boolean).join(' ');
}

export function listOptions(params = {}) {
  const label = String(params.label || 'INBOX').toUpperCase();
  const query = buildQuery(params);
  const options = { userId: 'me', maxResults: Math.min(Math.max(Number(params.maxResults || 30), 1), 50) };
  if (params.pageToken) options.pageToken = String(params.pageToken);
  if (['INBOX', 'SENT', 'STARRED', 'SPAM', 'TRASH'].includes(label)) {
    options.labelIds = [label];
    if (query) options.q = query;
  } else if (label === 'ALL') {
    if (query) options.q = query;
  } else if (label === 'DRAFT') {
    options.labelIds = ['DRAFT'];
    options.q = query ? `${query} -label:sent` : '-label:sent';
  } else if (label === 'ARCHIVE') {
    const archiveClause = '-label:inbox -label:sent -label:draft -label:trash -label:spam';
    options.q = query ? `${query} ${archiveClause}` : archiveClause;
  }
  return options;
}

export async function fetchMessageList(gmail, params = {}) {
  const label = String(params.label || 'INBOX').toUpperCase();
  if (label === 'DRAFT' && !params.q) {
    try {
      const res = await gmail.users.drafts.list({ userId: 'me', maxResults: Math.min(Math.max(Number(params.maxResults || 30), 1), 50), pageToken: params.pageToken ? String(params.pageToken) : undefined });
      const fullDrafts = await Promise.all((res.data.drafts || []).map(async item => {
        try { const d = await gmail.users.drafts.get({ userId: 'me', id: item.id, format: 'full' }); const norm = normalizeMessage(d.data.message); return norm ? { ...norm, draftId: d.data.id } : null; } catch { return null; }
      }));
      return { messages: fullDrafts.filter(Boolean), nextPageToken: res.data.nextPageToken || null };
    } catch (err) { console.warn('Gmail Drafts list API error:', err.message); }
  }
  const res = await gmail.users.messages.list(listOptions(params));
  const fullMessages = await Promise.all((res.data.messages || []).map(item => gmail.users.messages.get({ userId: 'me', id: item.id, format: 'full' })));
  return { messages: fullMessages.map(m => normalizeMessage(m.data)).filter(Boolean), nextPageToken: res.data.nextPageToken || null };
}
