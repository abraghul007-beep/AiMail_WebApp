import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getGmailClient } from '@/lib/gmail';

export async function GET() {
  const session = await getSession();
  if (!session?.tokens) {
    return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
  }

  try {
    const gmail = getGmailClient(session.tokens);
    const profile = await gmail.users.getProfile({ userId: 'me' });
    return NextResponse.json({
      email: profile.data.emailAddress,
      push: { configured: !!process.env.PUBSUB_TOPIC }
    });
  } catch (err) {
    console.error('Profile fetch error:', err);
    return NextResponse.json({ error: 'Unable to load user profile.' }, { status: 500 });
  }
}
