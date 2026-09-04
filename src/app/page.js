'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Rail } from '@/components/Rail';
import { Sidebar } from '@/components/Sidebar';
import { MailList } from '@/components/MailList';
import { EmailReader } from '@/components/EmailReader';
import { Copilot } from '@/components/Copilot';
import { ComposeModal } from '@/components/ComposeModal';
import { ConfirmModal } from '@/components/ConfirmModal';
import { LoginView } from '@/components/LoginView';
import { extractEmail } from '@/lib/utils';

export default function WorkspacePage() {
  const [authRequired, setAuthRequired] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [syncMode, setSyncMode] = useState('Push + fallback sync');
  const [lastSyncTime, setLastSyncTime] = useState('');

  const [folder, setFolder] = useState('INBOX');
  const [messages, setMessages] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [currentMessage, setCurrentMessage] = useState(null);
  const [thread, setThread] = useState([]);

  const [copilotOpen, setCopilotOpen] = useState(true);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: 'I found the latest planning thread and opened it. I can also prepare a reply or search related mail.'
    },
    {
      role: 'results',
      tag: 'MAIL RESULTS · planning',
      items: [
        { id: '1', subject: 'Q3 planning follow-up', snippet: 'Here are the revised milestones…' },
        { id: '2', subject: 'Friday checkpoint', snippet: 'Agenda and action items…' }
      ]
    }
  ]);

  const [composeData, setComposeData] = useState(null); // null | { to, cc, subject, body, title }
  const [confirmData, setConfirmData] = useState(null); // null | { to, cc, subject, body }

  const loadMessages = useCallback(async (reset = false, customParams = {}) => {
    try {
      const p = new URLSearchParams({
        label: customParams.folder || folder,
        maxResults: '30'
      });

      const q = customParams.q !== undefined ? customParams.q : searchQuery;
      if (q) p.set('q', q);

      const unread = customParams.unreadOnly !== undefined ? customParams.unreadOnly : unreadOnly;
      if (unread) p.set('unread', 'true');

      if (!reset && nextPageToken) p.set('pageToken', nextPageToken);

      const res = await fetch(`/api/messages?${p.toString()}`);
      if (res.status === 401) {
        setAuthRequired(true);
        setLoading(false);
        return;
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load messages');

      const incoming = data.messages || [];
      setMessages((prev) => (reset ? incoming : [...prev, ...incoming]));
      setNextPageToken(data.nextPageToken || null);
      setLastSyncTime(new Date().toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }));

      // Auto-select first message on reset if none is open
      if (reset && incoming.length > 0) {
        openMessage(incoming[0].id);
      }
    } catch (err) {
      console.error('Error loading messages:', err);
    } finally {
      setLoading(false);
    }
  }, [folder, searchQuery, unreadOnly, nextPageToken]);

  const openMessage = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/messages/${encodeURIComponent(id)}`);
      if (res.status === 401) {
        setAuthRequired(true);
        return;
      }
      if (!res.ok) return;
      const msg = await res.json();
      setCurrentMessage(msg);

      // Fetch thread messages
      const threadRes = await fetch(`/api/threads/${encodeURIComponent(msg.threadId || id)}`);
      if (threadRes.ok) {
        const threadData = await threadRes.json();
        setThread(threadData.messages || [msg]);
      } else {
        setThread([msg]);
      }

      // Mark as read in background
      if (msg.unread) {
        fetch(`/api/messages/${encodeURIComponent(id)}/read`, { method: 'POST' }).catch(() => {});
        msg.unread = false;
        setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, unread: false } : m)));
      }
    } catch (err) {
      console.error('Error opening message:', err);
    }
  };

  const boot = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/me');
      if (res.status === 401) {
        setAuthRequired(true);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to initialize');

      setEmail(data.email);
      setSyncMode(data.push?.configured ? 'Push + fallback sync' : 'Mailbox sync (polling)');
      setAuthRequired(false);
      setErrorMessage('');

      await loadMessages(true);
    } catch (err) {
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadMessages]);

  useEffect(() => {
    boot();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOAuthLogin = async () => {
    try {
      const res = await fetch('/api/auth/url');
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      alert('Failed to connect to Google OAuth: ' + err.message);
    }
  };

  const handleNavigate = (newFolder) => {
    setFolder(newFolder);
    setCurrentMessage(null);
    setThread([]);
    setSearchQuery('');
    setUnreadOnly(false);
    loadMessages(true, { folder: newFolder, q: '', unreadOnly: false });
  };

  const handleSearchChange = (q) => {
    setSearchQuery(q);
    loadMessages(true, { q });
  };

  const handleToggleUnread = (unread) => {
    setUnreadOnly(unread);
    loadMessages(true, { unreadOnly: unread });
  };

  const handleReply = (msg = currentMessage) => {
    if (!msg) return;
    setComposeData({
      title: 'Reply',
      to: extractEmail(msg.sender),
      subject: /^re:/i.test(msg.subject || '') ? msg.subject : `Re: ${msg.subject || ''}`,
      body: `\n\nOn ${msg.date || ''}, ${msg.sender || ''} wrote:\n> ${(msg.body || '').slice(0, 1500).replace(/\n/g, '\n> ')}`,
      threadId: msg.threadId || msg.id
    });
  };

  const handleForward = (msg = currentMessage) => {
    if (!msg) return;
    setComposeData({
      title: 'Forward',
      subject: /^fwd:/i.test(msg.subject || '') ? msg.subject : `Fwd: ${msg.subject || ''}`,
      body: `\n\n---------- Forwarded message ----------\nFrom: ${msg.sender}\nDate: ${msg.date}\nSubject: ${msg.subject}\nTo: ${msg.to}\n\n${msg.body || ''}`
    });
  };

  const handleReviewSend = (draft) => {
    setConfirmData(draft);
    setComposeData(null);
  };

  const handleConfirmSend = async () => {
    if (!confirmData) return;
    try {
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          to: confirmData.to,
          cc: confirmData.cc,
          bcc: confirmData.bcc,
          subject: confirmData.subject,
          body: confirmData.body,
          threadId: confirmData.threadId || undefined
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to send message');
      }

      setConfirmData(null);
      handleNavigate('SENT');
    } catch (err) {
      alert('Error sending message: ' + err.message);
    }
  };

  const handleCopilotSendMessage = async (text) => {
    const newChat = [...chatMessages, { role: 'user', text }];
    setChatMessages(newChat);

    try {
      const context = {
        folder,
        query: searchQuery,
        unreadOnly,
        currentMessage: currentMessage
          ? {
              id: currentMessage.id,
              threadId: currentMessage.threadId,
              sender: currentMessage.sender,
              subject: currentMessage.subject,
              date: currentMessage.date,
              body: (currentMessage.body || '').slice(0, 4000)
            }
          : null
      };

      const res = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message: text, context })
      });

      const response = await res.json();
      const updatedChat = [...newChat, { role: 'assistant', text: response.text || 'Done.' }];

      // Dispatch UI actions
      for (const act of response.actions || []) {
        if (act.type === 'navigate') {
          handleNavigate(act.folder);
        } else if (act.type === 'compose') {
          setComposeData(act.data);
        } else if (act.type === 'open_message') {
          openMessage(act.id);
        } else if (act.type === 'filter') {
          if (act.folder) setFolder(act.folder);
          if (act.unreadOnly !== undefined) setUnreadOnly(act.unreadOnly);
          if (act.query !== undefined) setSearchQuery(act.query);
          loadMessages(true, {
            folder: act.folder,
            unreadOnly: act.unreadOnly,
            q: act.query
          });
        } else if (act.type === 'search_results') {
          if (act.messages) {
            setMessages(act.messages);
            if (act.query) setSearchQuery(act.query);
          }
          updatedChat.push({
            role: 'results',
            tag: `MAIL RESULTS · ${act.query || text}`,
            items: (act.messages || []).map((m) => ({
              id: m.id,
              subject: m.subject,
              snippet: m.snippet
            }))
          });
        }
      }

      setChatMessages(updatedChat);
    } catch (err) {
      setChatMessages([
        ...newChat,
        { role: 'assistant', text: `⚠️ ${err.message}` }
      ]);
    }
  };

  if (authRequired || errorMessage) {
    return (
      <LoginView
        onLogin={handleOAuthLogin}
        errorMessage={errorMessage}
        onRetry={boot}
      />
    );
  }

  const shellClasses = ['shell', copilotOpen ? 'copilot-active' : ''].filter(Boolean).join(' ');

  return (
    <div className={shellClasses}>
      {/* 1. Left Icon Rail (64px) */}
      <Rail
        folder={folder}
        copilotOpen={copilotOpen}
        onNavigate={handleNavigate}
        onToggleCopilot={() => setCopilotOpen(!copilotOpen)}
        onRefresh={() => loadMessages(true)}
      />

      {/* 2. Navigation Sidebar (264px) */}
      <Sidebar
        folder={folder}
        unreadCount={messages.filter((m) => m.unread).length}
        onNavigate={handleNavigate}
        onCompose={() => setComposeData({ title: 'New Message' })}
        syncMode={syncMode}
        lastSyncTime={lastSyncTime}
        onRefresh={() => loadMessages(true)}
      />

      {/* 3. Message List Column (430px) */}
      <MailList
        folder={folder}
        messages={messages}
        currentMessage={currentMessage}
        unreadOnly={unreadOnly}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onToggleUnreadFilter={handleToggleUnread}
        onSelectMessage={openMessage}
        onLoadMore={() => loadMessages(false)}
        hasMore={!!nextPageToken}
      />

      {/* 4. Reading Desk & Gmail Content Viewer (1fr) */}
      <EmailReader
        message={currentMessage}
        thread={thread}
        onReply={handleReply}
        onForward={handleForward}
        onBack={() => setCurrentMessage(null)}
      />

      {/* 5. AI Copilot Drawer (330px) */}
      {copilotOpen && (
        <Copilot
          chatMessages={chatMessages}
          onSendMessage={handleCopilotSendMessage}
          onClose={() => setCopilotOpen(false)}
          onSelectMessage={openMessage}
        />
      )}

      {/* Compose Email Modal */}
      {composeData && (
        <ComposeModal
          initialData={composeData}
          onReviewSend={handleReviewSend}
          onClose={() => setComposeData(null)}
        />
      )}

      {/* Confirm Send Dialog */}
      {confirmData && (
        <ConfirmModal
          draft={confirmData}
          onConfirmSend={handleConfirmSend}
          onBackToEdit={() => {
            setComposeData(confirmData);
            setConfirmData(null);
          }}
          onClose={() => setConfirmData(null)}
        />
      )}
    </div>
  );
}
