'use client';

import React, { useState, useRef, useEffect } from 'react';

export function Copilot({ chatMessages = [], onSendMessage, onClose, onSelectMessage }) {
  const [prompt, setPrompt] = useState('');
  const streamRef = useRef(null);

  useEffect(() => {
    if (streamRef.current) {
      streamRef.current.scrollTop = streamRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = prompt.trim();
    if (!text) return;
    setPrompt('');
    onSendMessage(text);
  };

  const handleSuggestion = (text) => {
    onSendMessage(text);
  };

  return (
    <aside id="copilot-panel" className="copilot-panel">
      {/* Header */}
      <header className="copilot-header">
        <div className="copilot-header-brand">
          <div className="copilot-title">
            <span className="copilot-title-spark">✦</span> AI Copilot
          </div>
          <div className="copilot-subtitle">Groq tool control · human review</div>
        </div>
        <button id="copilot-close-btn" className="copilot-close-btn" onClick={onClose} title="Hide Copilot">
          ✕
        </button>
      </header>

      {/* Stream Messages */}
      <div id="copilot-stream" ref={streamRef} className="copilot-body">
        {chatMessages.map((msg, index) => {
          if (msg.role === 'user') {
            return (
              <div key={index} className="copilot-card user-bubble">
                {msg.text}
              </div>
            );
          }

          if (msg.role === 'results') {
            return (
              <div key={index} className="copilot-results-card">
                <div className="results-header-tag">{msg.tag || 'MAIL RESULTS'}</div>
                <div className="results-list">
                  {(msg.items || []).map((item) => (
                    <button
                      key={item.id}
                      className="result-item-btn"
                      onClick={() => onSelectMessage(item.id)}
                    >
                      <div className="result-subject">{item.subject}</div>
                      <div className="result-snippet">{item.snippet || ''}</div>
                    </button>
                  ))}
                </div>
              </div>
            );
          }

          return (
            <div key={index} className="copilot-card">
              {msg.text}
            </div>
          );
        })}

        {/* Suggested Quick Prompts */}
        <div className="copilot-suggestions">
          <button
            className="suggestion-pill"
            onClick={() => handleSuggestion('Show unread emails')}
          >
            📬 Unread mail
          </button>
          <button
            className="suggestion-pill"
            onClick={() => handleSuggestion('Prepare a reply to this')}
          >
            ✍️ Draft reply
          </button>
          <button
            className="suggestion-pill"
            onClick={() => handleSuggestion('Navigate to Sent folder')}
          >
            📤 Sent mail
          </button>
        </div>
      </div>

      {/* Footer Form */}
      <div className="copilot-footer">
        <form id="copilot-form" className="copilot-input-form" onSubmit={handleSubmit}>
          <input
            id="copilot-input"
            className="copilot-input-field"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Tell me what to do…"
            autoComplete="off"
          />
          <button id="copilot-submit-btn" type="submit" className="copilot-send-btn" title="Send prompt">
            ↑
          </button>
        </form>
      </div>
    </aside>
  );
}
