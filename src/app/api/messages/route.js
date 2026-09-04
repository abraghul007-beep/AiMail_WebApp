import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getGmailClient, fetchMessageList } from '@/lib/gmail';

export async function GET(request) {
  const session = await getSession();
  if (!session?.tokens) {
    return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const params = {
    label: searchParams.get('label') || 'INBOX',
    maxResults: searchParams.get('maxResults') || '30',
    pageToken: searchParams.get('pageToken') || undefined,
    q: searchParams.get('q') || undefined,
    unread: searchParams.get('unread') || undefined
  };

  try {
    const gmail = getGmailClient(session.tokens);
    const data = await fetchMessageList(gmail, params);
    return NextResponse.json(data);
  } catch (err) {
    console.error('Messages list error:', err);
    return NextResponse.json({ error: 'Unable to load messages.' }, { status: 500 });
  }
}
