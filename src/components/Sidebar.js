'use client';

import React, { useState, useEffect, useRef } from 'react';

export function Sidebar({ folder, unreadCount = 0, onNavigate, onCompose, syncMode, lastSyncTime, onRefresh }) {
  const [displayTime, setDisplayTime] = useState('');
  const pushVersionRef = useRef(null);

  useEffect(() => {
    setDisplayTime(lastSyncTime || new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }));
  }, [lastSyncTime]);

  // Fallback sync keeps the mailbox fresh when Pub/Sub is unavailable.
  useEffect(() => {
    const interval = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_SECONDS || 30);
    if (!Number.isFinite(interval) || interval <= 0 || !onRefresh) return undefined;
    const id = window.setInterval(() => onRefresh(), interval * 1000);
    return () => window.clearInterval(id);
  }, [onRefresh]);

  // Push-aware sync: the server records a Pub/Sub event and the browser immediately
  // performs an authenticated Gmail refresh. The webhook never sends mailbox data.
  useEffect(() => {
    if (!onRefresh || !String(syncMode || '').toLowerCase().includes('push')) return undefined;
    const check = async () => {
      try {
        const res = await fetch('/api/sync/status', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (pushVersionRef.current === null) pushVersionRef.current = data.pushVersion;
        else if (data.pushVersion !== pushVersionRef.current) {
          pushVersionRef.current = data.pushVersion;
          onRefresh();
        }
      } catch { /* fallback sync remains active */ }
    };
    check();
    const id = window.setInterval(check, 5000);
    return () => window.clearInterval(id);
  }, [onRefresh, syncMode]);

  return (
    <aside className="sidebar">
      <div className="sidebar-brand"><div className="brand-heading"><span className="brand-spark">✦</span> Nebula</div><div className="brand-subtext">GMAIL WORKSPACE</div></div>
      <button id="sidebar-compose-btn" className="compose-button" onClick={onCompose}><span>✎</span><span>Compose</span></button>
      <div className="nav-group">
        <div className="nav-header">Mailboxes</div>
        <button id="nav-inbox" className={`nav-link ${folder === 'INBOX' ? 'active' : ''}`} onClick={() => onNavigate('INBOX')}><span className="nav-icon">▣</span><span className="nav-label">Inbox</span>{unreadCount > 0 && <span className="nav-badge">{unreadCount}</span>}</button>
        <button id="nav-starred" className={`nav-link ${folder === 'STARRED' ? 'active' : ''}`} onClick={() => onNavigate('STARRED')}><span className="nav-icon">☆</span><span className="nav-label">Starred</span></button>
        <button id="nav-sent" className={`nav-link ${folder === 'SENT' ? 'active' : ''}`} onClick={() => onNavigate('SENT')}><span className="nav-icon">➤</span><span className="nav-label">Sent</span></button>
        <button id="nav-draft" className={`nav-link ${folder === 'DRAFT' ? 'active' : ''}`} onClick={() => onNavigate('DRAFT')}><span className="nav-icon">□</span><span className="nav-label">Drafts</span></button>
        <button id="nav-archive" className={`nav-link ${folder === 'ARCHIVE' ? 'active' : ''}`} onClick={() => onNavigate('ARCHIVE')}><span className="nav-icon">▤</span><span className="nav-label">Archive</span></button>
      </div>
      <div className="sidebar-footer">
        <div className="sync-status-card" onClick={onRefresh} title="Click to refresh mailbox sync">
          <div className="sync-status-header"><span className="sync-live-dot" /><span>{syncMode || 'Push + fallback sync'}</span></div>
          <div className="sync-meta-row"><span>Mailbox sync</span><span suppressHydrationWarning>{displayTime}</span></div>
        </div>
      </div>
    </aside>
  );
}
