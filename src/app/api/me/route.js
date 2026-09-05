import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getGmailClient } from '@/lib/gmail';

export async function GET() {
  const session = await getSession();
  if (!session?.tokens) return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });

  try {
    const gmail = getGmailClient(session.tokens);
    const profile = await gmail.users.getProfile({ userId: 'me' });
    let push = { configured: false };

    if (process.env.PUBSUB_TOPIC) {
      try {
        const watch = await gmail.users.watch({ userId: 'me', requestBody: { topicName: process.env.PUBSUB_TOPIC, labelIds: ['INBOX'] } });
        push = { configured: true, expiration: watch.data.expiration || null, historyId: watch.data.historyId || null };
      } catch (err) {
        console.warn('Gmail push watch registration failed; using polling fallback:', err.message);
        push = { configured: false, error: 'Push registration failed; polling fallback active.' };
      }
    }

    return NextResponse.json({ email: profile.data.emailAddress, push });
  } catch (err) {
    console.error('Profile fetch error:', err);
    return NextResponse.json({ error: 'Unable to load user profile.' }, { status: 500 });
  }
}
