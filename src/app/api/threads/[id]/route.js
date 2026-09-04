import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getGmailClient, normalizeMessage } from '@/lib/gmail';

export async function GET(request, { params }) {
  const session = await getSession();
  if (!session?.tokens) {
    return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const gmail = getGmailClient(session.tokens);
    const t = await gmail.users.threads.get({ userId: 'me', id, format: 'full' });
    const messages = (t.data.messages || []).map(normalizeMessage);
    return NextResponse.json({
      id: t.data.id,
      messages
    });
  } catch (err) {
    console.error('Thread fetch error:', err);
    return NextResponse.json({ error: 'Conversation not found.' }, { status: 404 });
  }
}
