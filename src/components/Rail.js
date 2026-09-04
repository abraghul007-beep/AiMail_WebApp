'use client';

import React from 'react';
import { Icon } from './Icons';

export function Rail({ folder, copilotOpen, onNavigate, onToggleCopilot, onRefresh }) {
  return (
    <aside className="rail">
      <div className="rail-logo" title="Nebula Mail Workspace">
        ✦
      </div>

      <button
        id="rail-inbox"
        className={`rail-btn ${folder === 'INBOX' ? 'active' : ''}`}
        onClick={() => onNavigate('INBOX')}
        title="Inbox"
      >
        <Icon name="inbox" />
        <span className="rail-tooltip">Inbox</span>
      </button>

      <button
        id="rail-copilot"
        className={`rail-btn copilot-btn ${copilotOpen ? 'active' : ''}`}
        onClick={onToggleCopilot}
        title="AI Copilot"
      >
        <Icon name="sparkle" />
        <span className="rail-tooltip">AI Copilot</span>
      </button>

      <button
        id="rail-starred"
        className={`rail-btn ${folder === 'STARRED' ? 'active' : ''}`}
        onClick={() => onNavigate('STARRED')}
        title="Starred"
      >
        <Icon name="star" />
        <span className="rail-tooltip">Starred</span>
      </button>

      <button
        id="rail-sent"
        className={`rail-btn ${folder === 'SENT' ? 'active' : ''}`}
        onClick={() => onNavigate('SENT')}
        title="Sent"
      >
        <Icon name="send" />
        <span className="rail-tooltip">Sent</span>
      </button>

      <div className="rail-spacer" />

      <button
        id="rail-refresh"
        className="rail-btn"
        onClick={onRefresh}
        title="Sync Mailbox"
      >
        <Icon name="refresh" />
        <span className="rail-tooltip">Sync Now</span>
      </button>
    </aside>
  );
}
