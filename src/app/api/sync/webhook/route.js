import { NextResponse } from 'next/server';

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
      try { payload = JSON.parse(Buffer.from(message.data, 'base64').toString('utf8')); } catch { payload = {}; }
    }

    // Gmail Pub/Sub sends a historyId. Incrementing a process-local version lets
    // browser clients detect a push event and immediately perform an authenticated
    // mailbox refresh. No email data is accepted from the webhook.
    globalThis.__nebulaSync = {
      version: Number(globalThis.__nebulaSync?.version || 0) + 1,
      historyId: payload.historyId || null,
      receivedAt: Date.now()
    };

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Pub/Sub webhook error:', err);
    return new NextResponse('Bad Request', { status: 400 });
  }
}
