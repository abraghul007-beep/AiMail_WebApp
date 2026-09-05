import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getGmailClient, fetchMessageList } from '@/lib/gmail';
import { queryGroq } from '@/lib/groq';

export async function POST(request) {
  const session = await getSession();
  if (!session?.tokens) return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
  if (!process.env.GROQ_API_KEY) return NextResponse.json({ ai: false, text: 'AI is not configured. Please set GROQ_API_KEY in .env.', actions: [] });

  try {
    const { message, context } = await request.json();
    if (typeof message !== 'string' || !message.trim()) return NextResponse.json({ ai: false, text: 'Please enter an instruction.', actions: [] }, { status: 400 });
    const gmail = getGmailClient(session.tokens);
    const m = await queryGroq(message.trim(), context);
    const actions = [];

    for (const c of m.tool_calls || []) {
      let a = {};
      try { a = JSON.parse(c.function.arguments || '{}'); } catch { continue; }
      if (c.function.name === 'navigate_mail') actions.push({ type: 'navigate', folder: a.folder });
      else if (c.function.name === 'compose_email') actions.push({ type: 'compose', data: a });
      else if (c.function.name === 'search_mail') {
        const results = await fetchMessageList(gmail, { q: a.query, label: 'ALL', maxResults: a.maxResults || 10 });
        actions.push({ type: 'search_results', query: a.query, ...results });
      } else if (c.function.name === 'filter_mail') actions.push({ type: 'filter', folder: a.folder, unreadOnly: a.unreadOnly, query: a.query });
      else if (c.function.name === 'open_email') {
        const results = await fetchMessageList(gmail, { q: a.query, label: 'ALL', maxResults: 1 });
        const top = results.messages?.[0];
        actions.push(top ? { type: 'open_message', id: top.id, message: top } : { type: 'search_results', query: a.query, messages: [] });
      } else if (c.function.name === 'prepare_reply' && context?.currentMessage) {
        const x = context.currentMessage;
        actions.push({ type: 'compose', data: { title: 'Reply', to: x.sender, subject: /^re:/i.test(x.subject) ? x.subject : `Re: ${x.subject}`, body: `${a.body || ''}\n\nOn ${x.date}, ${x.sender} wrote:\n> ${(x.body || '').slice(0, 1800).replace(/\n/g, '\n> ')}`, threadId: x.threadId } });
      } else if (c.function.name === 'prepare_forward' && context?.currentMessage) {
        const x = context.currentMessage;
        actions.push({ type: 'compose', data: { title: 'Forward', to: a.to || '', subject: /^fwd:/i.test(x.subject) ? x.subject : `Fwd: ${x.subject}`, body: `${a.body || ''}\n\n---------- Forwarded message ----------\nFrom: ${x.sender}\nDate: ${x.date}\nSubject: ${x.subject}\nTo: ${x.to}\n\n${x.body || ''}`, threadId: x.threadId } });
      }
    }
    return NextResponse.json({ ai: true, provider: 'Groq', text: m.content || 'Done.', actions });
  } catch (err) {
    console.error('[Copilot Assistant Error]:', err);
    return NextResponse.json({ ai: false, text: `AI error: ${err.message}. You can continue using mail normally.`, actions: [] }, { status: 502 });
  }
}
