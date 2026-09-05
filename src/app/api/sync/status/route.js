import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getGmailClient } from '@/lib/gmail';

export const runtime = 'nodejs';

export async function GET() {
  const session = await getSession();
  if (!session?.tokens) return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });

  const profile = await getGmailClient(session.tokens).users.getProfile({ userId: 'me' });
  const email = String(profile.data.emailAddress || '').trim().toLowerCase();
  const store = globalThis.__nebulaSyncByUser;
  const state = store?.get(email) || { version: 0, historyId: null, receivedAt: null };

  return NextResponse.json({
    mode: process.env.PUBSUB_TOPIC ? 'push+fallback' : 'polling',
    pollIntervalSeconds: Number(process.env.POLL_INTERVAL_SECONDS || 30),
    pushVersion: state.version,
    historyId: state.historyId,
    receivedAt: state.receivedAt
  });
}
