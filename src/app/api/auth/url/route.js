import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAuthUrl } from '@/lib/gmail';
import { setSession, getSession } from '@/lib/session';

export async function GET() {
  const state = crypto.randomBytes(32).toString('hex');
  const session = await getSession();
  await setSession({ ...session, oauthState: state });

  const url = getAuthUrl(state);
  return NextResponse.json({ url });
}
