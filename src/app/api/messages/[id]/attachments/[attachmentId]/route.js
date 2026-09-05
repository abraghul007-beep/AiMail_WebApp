import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { getGmailClient } from '@/lib/gmail';

export async function GET(request, { params }) {
  const session = await getSession();
  if (!session?.tokens) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id: messageId, attachmentId } = await params;
  const { searchParams } = new URL(request.url);
  const mime = searchParams.get('mime') || 'image/png';

  try {
    const gmail = getGmailClient(session.tokens);
    const res = await gmail.users.messages.attachments.get({
      userId: 'me',
      messageId,
      id: attachmentId
    });

    const rawData = res.data.data || '';
    const buffer = Buffer.from(rawData.replace(/-/g, '+').replace(/_/g, '/'), 'base64');

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': mime,
        'Cache-Control': 'public, max-age=86400, immutable'
      }
    });
  } catch (err) {
    console.error('Attachment fetch error:', err);
    return new NextResponse('Attachment not found', { status: 404 });
  }
}
