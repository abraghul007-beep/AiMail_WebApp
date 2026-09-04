import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    mode: process.env.PUBSUB_TOPIC ? 'push+fallback' : 'polling',
    pollIntervalSeconds: Number(process.env.POLL_INTERVAL_SECONDS || 30)
  });
}
