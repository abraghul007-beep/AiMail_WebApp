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
    const res = await gmail.users.messages.get({ userId: 'me', id, format: 'full' });
    return NextResponse.json(normalizeMessage(res.data));
  } catch (err) {
    console.error('Message fetch error:', err);
    return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
  }
}
