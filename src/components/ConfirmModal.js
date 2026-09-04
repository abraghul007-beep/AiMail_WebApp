'use client';

import React from 'react';
import { Icon } from './Icons';

export function ConfirmModal({ draft = {}, onConfirmSend, onBackToEdit, onClose }) {
  return (
    <div className="modal-backdrop">
      <div id="confirm-modal-card" className="compose-modal-card confirm-card">
        <header className="modal-header">
          <div className="modal-title">
            <span className="modal-icon">🛡️</span>
            <span>Review &amp; Confirm Send</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </header>

        <div className="confirm-body">
          <p className="confirm-notice">Please verify your recipients and content before dispatching:</p>
          <div className="confirm-meta-row">
            <strong>To:</strong> <span>{draft.to}</span>
          </div>
          {draft.cc && (
            <div className="confirm-meta-row">
              <strong>Cc:</strong> <span>{draft.cc}</span>
            </div>
          )}
          <div className="confirm-meta-row">
            <strong>Subject:</strong> <span>{draft.subject}</span>
          </div>
          <div className="confirm-preview-box">
            <div className="preview-label">Body Preview</div>
            <div className="preview-text">
              {draft.body?.slice(0, 1000)}
              {draft.body?.length > 1000 ? '...' : ''}
            </div>
          </div>
        </div>

        <footer className="modal-footer">
          <button id="confirm-back-btn" className="btn-cancel" onClick={onBackToEdit}>
            ← Back to Edit
          </button>
          <button id="confirm-send-btn" className="btn-primary-send" onClick={onConfirmSend}>
            <Icon name="send" /> <span>Send Message</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
