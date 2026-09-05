import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request) {
  const expected = process.env.PUBSUB_VERIFICATION_TOKEN;
  if (expected) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (token !== expected) return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const envelope = await request.json();
    const message = envelope?.message;
    if (!message) return new NextResponse('Bad Request', { status: 400 });

    let payload = {};
    if (message.data) {
      try {
        payload = JSON.parse(Buffer.from(message.data, 'base64').toString('utf8'));
      } catch {
        return new NextResponse('Bad Request', { status: 400 });
      }
    }

    const email = String(payload.emailAddress || '').trim().toLowerCase();
    if (!email) return new NextResponse('Bad Request', { status: 400 });

    // Keep only a tiny notification cursor in process memory. The browser still
    // performs an authenticated Gmail refresh; no email content is accepted here.
    const store = globalThis.__nebulaSyncByUser || (globalThis.__nebulaSyncByUser = new Map());
    const previous = store.get(email) || { version: 0, historyId: null, receivedAt: null };
    store.set(email, {
      version: previous.version + 1,
      historyId: payload.historyId || null,
      receivedAt: Date.now()
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Pub/Sub webhook error:', err);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
