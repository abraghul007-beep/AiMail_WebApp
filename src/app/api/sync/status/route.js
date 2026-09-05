import { NextResponse } from 'next/server';

export async function GET() {
  const state = globalThis.__nebulaSync || { version: 0, historyId: null, receivedAt: null };
  return NextResponse.json({
    mode: process.env.PUBSUB_TOPIC ? 'push+fallback' : 'polling',
    pollIntervalSeconds: Number(process.env.POLL_INTERVAL_SECONDS || 30),
    pushVersion: state.version,
    receivedAt: state.receivedAt
  });
}
