import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getGmailClient } from '@/lib/gmail';

export async function POST(request, { params }) {
  const session = await getSession();
  if (!session?.tokens) {
    return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
  }

  const { id } = await params;
  try {
    const gmail = getGmailClient(session.tokens);
    await gmail.users.messages.modify({
      userId: 'me',
      id,
      requestBody: { removeLabelIds: ['UNREAD'] }
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Mark read error:', err);
    return NextResponse.json({ error: 'Unable to mark read.' }, { status: 500 });
  }
}
