import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getGmailClient } from '@/lib/gmail';

export async function POST() {
  const session = await getSession();
  if (!session?.tokens) return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
  if (!process.env.PUBSUB_TOPIC) return NextResponse.json({ configured: false, error: 'PUBSUB_TOPIC is not configured.' }, { status: 503 });

  try {
    const gmail = getGmailClient(session.tokens);
    const result = await gmail.users.watch({
      userId: 'me',
      requestBody: {
        topicName: process.env.PUBSUB_TOPIC,
        labelIds: ['INBOX']
      }
    });
    return NextResponse.json({ configured: true, historyId: result.data.historyId, expiration: result.data.expiration });
  } catch (err) {
    console.error('Gmail watch registration error:', err);
    return NextResponse.json({ error: 'Unable to register Gmail push watch.' }, { status: 502 });
  }
}
