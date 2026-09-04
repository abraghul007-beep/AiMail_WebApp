import { NextResponse } from 'next/server';
import { getOAuth2Client } from '@/lib/gmail';
import { getSession, setSession, encryptSession, SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS } from '@/lib/session';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  const session = await getSession();
  if (!code) {
    return new NextResponse('OAuth authorization code missing.', { status: 400 });
  }

  // Verify OAuth state if one was initiated in session
  if (session.oauthState && state && state !== session.oauthState) {
    console.warn('OAuth state mismatch, proceeding with caution or re-authenticating');
  }

  try {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    await setSession({ tokens });

    const response = NextResponse.redirect(new URL('/', request.url));
    const encrypted = encryptSession({ tokens });
    response.cookies.set(SESSION_COOKIE_NAME, encrypted, SESSION_COOKIE_OPTIONS);
    return response;
  } catch (err) {
    console.error('OAuth token exchange error:', err);
    return new NextResponse('OAuth authentication failed. Please restart sign-in.', { status: 400 });
  }
}
