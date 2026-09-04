'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from './Icons';

export function ComposeModal({ initialData = {}, onReviewSend, onClose }) {
  const [to, setTo] = useState(initialData.to || '');
  const [cc, setCc] = useState(initialData.cc || '');
  const [subject, setSubject] = useState(initialData.subject || '');
  const [body, setBody] = useState(initialData.body || '');

  useEffect(() => {
    setTo(initialData.to || '');
    setCc(initialData.cc || '');
    setSubject(initialData.subject || '');
    setBody(initialData.body || '');
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!to.trim() || !subject.trim() || !body.trim()) {
      alert('Please fill out To, Subject, and Body before reviewing.');
      return;
    }
    onReviewSend({
      to: to.trim(),
      cc: cc.trim(),
      subject: subject.trim(),
      body,
      threadId: initialData.threadId || undefined
    });
  };

  return (
    <div className="modal-backdrop">
      <div id="compose-modal-card" className="compose-modal-card">
        <header className="modal-header">
          <div className="modal-title">
            <span className="modal-icon">✎</span>
            <span>{initialData.title || 'New Message'}</span>
          </div>
          <button id="modal-close-btn" className="modal-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </header>

        <form className="compose-form" onSubmit={handleSubmit}>
          <div className="compose-field">
            <label htmlFor="compose-to">To</label>
            <input
              id="compose-to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="recipient@example.com"
              autoComplete="email"
            />
          </div>

          <div className="compose-field">
            <label htmlFor="compose-cc">Cc</label>
            <input
              id="compose-cc"
              value={cc}
              onChange={(e) => setCc(e.target.value)}
              placeholder="cc@example.com (optional)"
            />
          </div>

          <div className="compose-field">
            <label htmlFor="compose-subject">Subject</label>
            <input
              id="compose-subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
            />
          </div>

          <div className="compose-field body-field">
            <textarea
              id="compose-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your message here..."
            />
          </div>

          <footer className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Discard
            </button>
            <button id="compose-review-btn" type="submit" className="btn-primary-send">
              <Icon name="send" /> <span>Review &amp; Send</span>
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
}
