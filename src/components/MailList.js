'use client';

import React from 'react';
import { cleanSender, formatDate, initials, avatarColor } from '@/lib/utils';

export function MailList({
  folder,
  messages = [],
  currentMessage,
  unreadOnly,
  searchQuery,
  onSearchChange,
  onToggleUnreadFilter,
  onSelectMessage,
  onLoadMore,
  hasMore
}) {
  const unreadCount = messages.filter(m => m.unread).length;
  const folderTitle = {
    INBOX: 'Inbox',
    STARRED: 'Starred',
    SENT: 'Sent',
    DRAFT: 'Drafts',
    ARCHIVE: 'Archive'
  }[folder] || 'Inbox';

  return (
    <section className="list-pane">
      {/* Top Status & Search Bar */}
      <header className="list-topbar">
        <div className="push-sync-pill">
          <span className="push-sync-dot" />
          <span>Push sync active</span>
        </div>

        <div className="search-box-pill">
          <span className="search-icon">⌕</span>
          <input
            id="search-input"
            value={searchQuery || ''}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search messages…"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </header>

      {/* Folder Header & Filter Chips */}
      <div className="list-header-section">
        <div className="list-title-row">
          <h1 className="list-title">{folderTitle}</h1>
          <span className="list-count-sub">
            {messages.length} messages · {unreadCount} unread
          </span>
        </div>

        <div className="filter-pills-row">
          <button
            id="filter-all"
            className={`filter-pill ${!unreadOnly ? 'active' : ''}`}
            onClick={() => onToggleUnreadFilter(false)}
          >
            All
          </button>
          <button
            id="filter-unread"
            className={`filter-pill ${unreadOnly ? 'active' : ''}`}
            onClick={() => onToggleUnreadFilter(true)}
          >
            Unread {unreadCount > 0 ? unreadCount : ''}
          </button>
        </div>
      </div>

      {/* Scrollable Message List */}
      <div id="messages-list-container" className="messages-scroll-area">
        {messages.length > 0 ? (
          messages.map((msg) => {
            const isSelected = currentMessage?.id === msg.id;
            const isUnread = !!msg.unread;
            let rowDisplayName = cleanSender(msg.sender || 'Unknown');
            if (folder === 'SENT') {
              rowDisplayName = `To: ${cleanSender(msg.to || 'Recipient')}`;
            } else if (folder === 'DRAFT') {
              rowDisplayName = `Draft to: ${cleanSender(msg.to || 'No recipient')}`;
            }
            const dateStr = formatDate(msg.date);
            const avatarText = folder === 'SENT' ? (msg.to || 'Recipient') : (msg.sender || 'Unknown');
            const avatarInit = initials(avatarText);
            const avatarBg = avatarColor(avatarText);

            return (
              <article
                key={msg.id}
                className={`message-row-item ${isUnread ? 'unread' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectMessage(msg.id, msg)}
                data-message-id={msg.id}
              >
                <div className="row-avatar-col">
                  <div
                    className="row-avatar-circle"
                    style={{ backgroundColor: avatarBg }}
                    title={rowDisplayName}
                  >
                    {avatarInit}
                  </div>
                </div>

                <div className="row-content-col">
                  <div className="row-top">
                    <span className="row-sender" title={folder === 'SENT' ? (msg.to || msg.sender) : msg.sender}>
                      {rowDisplayName}
                    </span>
                    <span className="row-date">{dateStr}</span>
                  </div>
                  <div className="row-subject" title={msg.subject}>
                    {msg.subject || '(no subject)'}
                  </div>
                  <div className="row-snippet">{msg.snippet || ''}</div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="empty-list-card">
            <div className="empty-list-icon">📭</div>
            <p>No messages found in {folderTitle}.</p>
            {searchQuery && (
              <button className="filter-pill" onClick={() => onSearchChange('')}>
                Clear Search
              </button>
            )}
          </div>
        )}

        {hasMore && (
          <button className="load-more-btn" onClick={onLoadMore}>
            Load older messages
          </button>
        )}
      </div>
    </section>
  );
}
