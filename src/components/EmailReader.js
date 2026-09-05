'use client';

import React, { useState, useEffect, useRef } from 'react';
import { cleanSender, initials, formatFullDate } from '@/lib/utils';
import { Icon } from './Icons';

function HtmlEmailFrame({ htmlContent }) {
  const iframeRef = useRef(null);

  const formattedDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="referrer" content="no-referrer">
        <base target="_blank">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #202124;
            margin: 0;
            padding: 6px;
            word-break: break-word;
          }
          img { max-width: 100% !important; height: auto !important; display: inline-block; }
          a { color: #1a73e8; }
          blockquote { border-left: 2px solid #dadce0; margin-left: 0; padding-left: 12px; color: #5f6368; }
          table { max-width: 100% !important; }
        </style>
      </head>
      <body>
        ${htmlContent || ''}
      </body>
    </html>
  `;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const adjustHeight = () => {
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc && doc.body) {
          const contentHeight = Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight, 180);
          iframe.style.height = `${contentHeight + 32}px`;
        }
      } catch (e) {}
    };

    const onLoad = () => {
      adjustHeight();
      try {
        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        if (doc) {
          doc.querySelectorAll('img').forEach((img) => {
            img.addEventListener('load', adjustHeight);
            img.addEventListener('error', adjustHeight);
          });
          const ro = new ResizeObserver(adjustHeight);
          ro.observe(doc.body);
        }
      } catch (e) {}
    };

    iframe.addEventListener('load', onLoad);
    adjustHeight();

    return () => {
      iframe.removeEventListener('load', onLoad);
    };
  }, [htmlContent]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={formattedDoc}
      title="Email Body"
      sandbox="allow-same-origin allow-popups"
      style={{
        width: '100%',
        border: 'none',
        minHeight: '220px',
        overflow: 'hidden',
        display: 'block'
      }}
    />
  );
}

export function EmailReader({ message, thread = [], onReply, onForward, onEditDraft, onBack }) {
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    setExpandedIndex(null);
  }, [message?.id]);

  if (!message) {
    return (
      <main className="reader empty-view">
        <div className="reader-empty-hero">
          <div className="reader-empty-sparkle">✦</div>
          <h2 className="reader-empty-title">Select a conversation</h2>
          <p className="reader-empty-desc">
            Choose an email from your list to read, review message threads, or compose replies.
          </p>
        </div>
      </main>
    );
  }

  const threadList = thread.length > 0 ? thread : [message];
  const activeMessage = message;
  const isDraft = !!activeMessage.draftId || (activeMessage.labels || []).includes('DRAFT');
  const threadIdShort = (activeMessage.threadId || activeMessage.id || '').slice(0, 8);

  return (
    <main id="email-reader-pane" className="reader">
      {/* Top Header & Breadcrumb */}
      <header className="reader-topbar">
        <div className="reader-breadcrumb">
          MAIL · Thread {threadIdShort}…
          {threadList.length > 1 && (
            <span className="thread-count-badge">
              {threadList.length} messages
            </span>
          )}
        </div>

        <div className="reader-actions">
          {isDraft && onEditDraft ? (
            <button className="reader-btn" onClick={() => onEditDraft(activeMessage)} title="Edit Draft">
              <Icon name="compose" /> <span>Edit Draft</span>
            </button>
          ) : (
            <>
              <button className="reader-btn" onClick={() => onReply(activeMessage)} title="Reply">
                <Icon name="reply" /> <span>Reply</span>
              </button>
              <button className="reader-btn" onClick={() => onForward(activeMessage)} title="Forward">
                <Icon name="forward" /> <span>Forward</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Scrollable Content */}
      <article className="reader-scroll">
        <div className="reader-inner">
          {/* Main Subject Line (Georgia Serif) */}
          <h1 className="reader-headline">{activeMessage.subject || '(no subject)'}</h1>

          {/* Conversation Messages (Accordion / Thread View) */}
          <div className="thread-messages-list">
            {threadList.map((msg, index) => {
              const isLatest = index === threadList.length - 1;
              const isExpanded = expandedIndex === index || (expandedIndex === null && isLatest);
              const senderName = cleanSender(msg.sender || 'Unknown');
              const avatarInitials = initials(msg.sender || 'U');

              return (
                <div
                  key={msg.id}
                  className={`mail-thread-item ${isExpanded ? 'expanded' : 'collapsed'}`}
                >
                  {/* Message Header Card */}
                  <div
                    className="sender-meta-card"
                    onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="sender-avatar-circle">{avatarInitials}</div>
                    <div className="sender-meta-info">
                      <div className="sender-name-heading">{senderName}</div>
                      <div className="sender-timestamp-sub">
                        to: {msg.to || 'me'} · {formatFullDate(msg.date)}
                        {msg.cc && ` · cc: ${msg.cc}`}
                      </div>
                    </div>
                  </div>

                  {/* Message Content (Rendered when expanded) */}
                  {isExpanded && (
                    <div className="mail-content-area" style={{ marginTop: '14px' }}>
                      {msg.htmlBody ? (
                        <HtmlEmailFrame htmlContent={msg.htmlBody} />
                      ) : (
                        <div className="mail-body-editorial">
                          {msg.body || msg.snippet || 'No message content.'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Quick Action Bar */}
          <div className="reader-bottom-bar">
            {isDraft && onEditDraft ? (
              <button id="reader-edit-draft-btn" className="btn-primary-reply" onClick={() => onEditDraft(activeMessage)}>
                <Icon name="compose" /> <span>Edit &amp; Send Draft</span>
              </button>
            ) : (
              <>
                <button id="reader-reply-btn" className="btn-primary-reply" onClick={() => onReply(activeMessage)}>
                  <Icon name="reply" /> <span>Reply</span>
                </button>
                <button id="reader-forward-btn" className="btn-secondary-forward" onClick={() => onForward(activeMessage)}>
                  <Icon name="forward" /> <span>Forward</span>
                </button>
              </>
            )}
          </div>
        </div>
      </article>
    </main>
  );
}
