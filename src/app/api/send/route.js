import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getGmailClient } from '@/lib/gmail';

export async function POST(request) {
  const session = await getSession();
  if (!session?.tokens) {
    return NextResponse.json({ error: 'AUTH_REQUIRED' }, { status: 401 });
  }

  try {
    const { to, cc, bcc, subject, body: messageBody, threadId } = await request.json();

    if (!to || !subject || !messageBody) {
      return NextResponse.json({ error: 'To, subject and message body are required.' }, { status: 400 });
    }

    if ([to, cc, bcc, subject].some(x => x && /[\r\n]/.test(x))) {
      return NextResponse.json({ error: 'Invalid message headers.' }, { status: 400 });
    }

    const headers = [`To: ${to}`];
    if (cc) headers.push(`Cc: ${cc}`);
    if (bcc) headers.push(`Bcc: ${bcc}`);
    headers.push(
      `Subject: ${subject}`,
      'MIME-Version: 1.0',
      'Content-Type: text/plain; charset=utf-8'
    );

    const rawMessage = Buffer.from([...headers, '', messageBody].join('\r\n')).toString('base64url');

    const gmail = getGmailClient(session.tokens);
    const result = await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: rawMessage,
        threadId: threadId || undefined
      }
    });

    return NextResponse.json({ ok: true, id: result.data.id });
  } catch (err) {
    console.error('Send message error:', err);
    return NextResponse.json({ error: 'Unable to send message.' }, { status: 500 });
  }
}
