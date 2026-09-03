import { Rail, Sidebar, MailList, Reader, Copilot, ComposeModal, ConfirmModal } from './components.js';

const S = {
  folder: 'INBOX',
  messages: [],
  current: null,
  thread: [],
  nextPageToken: null,
  unreadOnly: false,
  email: '',
  query: '',
  copilot: false,
  loading: false
};

const app = document.querySelector('#app');
const modal = document.querySelector('#modal');

const api = async (url, opt = {}) => {
  const r = await fetch(url, { credentials: 'same-origin', ...opt });
  if (r.status === 401) throw Error('AUTH_REQUIRED');
  const d = await r.json().catch(() => ({ error: 'Invalid server response' }));
  if (!r.ok) throw Error(d.error || 'Request failed');
  return d;
};

function render() {
  const hasSelectedMessage = !!S.current;
  app.innerHTML = `
    <div class="shell ${hasSelectedMessage ? 'has-active-message' : ''}">
      ${Rail(S)}
      ${Sidebar(S)}
      ${MailList(S)}
      ${Reader(S)}
      ${S.copilot ? Copilot() : ''}
    </div>
  `;
  bind();
}

function bind() {
  app.querySelectorAll('[data-folder]').forEach(x => {
    x.onclick = () => navigate(x.dataset.folder);
  });

  app.querySelectorAll('[data-message]').forEach(x => {
    x.onclick = () => openMessage(x.dataset.message);
  });

  app.querySelectorAll('[data-action]').forEach(x => {
    x.onclick = (e) => {
      e.stopPropagation();
      action(x.dataset.action);
    };
  });

  app.querySelectorAll('[data-filter]').forEach(x => {
    x.onclick = () => {
      S.unreadOnly = x.dataset.filter === 'unread';
      load(true);
    };
  });

  const searchInput = app.querySelector('#search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      S.query = searchInput.value.trim();
      load(true);
    }, 300));
  }

  const promptForm = app.querySelector('#prompt-form');
  if (promptForm) {
    promptForm.addEventListener('submit', ask);
  }

  app.querySelectorAll('[data-suggest]').forEach(x => {
    x.onclick = () => {
      const promptInput = app.querySelector('#prompt');
      if (promptInput && promptForm) {
        promptInput.value = x.dataset.suggest;
        promptForm.requestSubmit();
      }
    };
  });
}

async function boot() {
  try {
    const me = await api('/api/me');
    S.email = me.email;
    await load(true);
    if (me.push?.configured) connectEvents();
    setInterval(() => load(true), 30000);
  } catch (e) {
    if (e.message === 'AUTH_REQUIRED') showLogin();
    else showError(e.message);
  }
}

async function load(reset = false) {
  if (S.loading) return;
  S.loading = true;
  render();
  try {
    const p = new URLSearchParams({ label: S.folder, maxResults: '30' });
    if (!reset && S.nextPageToken) p.set('pageToken', S.nextPageToken);
    if (S.query) p.set('q', S.query);
    if (S.unreadOnly) p.set('unread', 'true');

    const d = await api('/api/messages?' + p);
    S.messages = reset ? d.messages : [...S.messages, ...d.messages];
    S.nextPageToken = d.nextPageToken;
    render();
  } catch (e) {
    if (e.message === 'AUTH_REQUIRED') showLogin();
    else showError(e.message);
  } finally {
    S.loading = false;
    render();
  }
}

async function openMessage(id) {
  try {
    S.current = await api('/api/messages/' + encodeURIComponent(id));
    const t = await api('/api/threads/' + encodeURIComponent(S.current.threadId || id));
    S.thread = t.messages || [S.current];
    render();

    // Mark as read in background
    for (const m of S.thread.filter(x => x.unread)) {
      api('/api/messages/' + encodeURIComponent(m.id) + '/read', { method: 'POST' }).catch(() => {});
      m.unread = false;
    }
  } catch (e) {
    showError(e.message);
  }
}

function navigate(folder) {
  S.folder = folder;
  S.current = null;
  S.thread = [];
  S.nextPageToken = null;
  S.unreadOnly = false;
  load(true);
}

function action(a) {
  if (a === 'compose') return openCompose();
  if (a === 'copilot') return toggleCopilot(true);
  if (a === 'copilot-close') return toggleCopilot(false);
  if (a === 'inbox') return navigate('INBOX');
  if (a === 'starred') return navigate('STARRED');
  if (a === 'sent') return navigate('SENT');
  if (a === 'refresh') return load(true);
  if (a === 'clear-search') {
    S.query = '';
    return load(true);
  }
  if (a === 'close') {
    S.current = null;
    S.thread = [];
    return render();
  }
  if (a === 'reply') {
    return openCompose({
      title: 'Reply',
      to: extractEmail(S.current?.sender),
      subject: /^re:/i.test(S.current?.subject || '') ? S.current.subject : `Re: ${S.current?.subject || ''}`,
      body: `\n\nOn ${S.current?.date || ''}, ${S.current?.sender || ''} wrote:\n> ${(S.current?.body || '').slice(0, 1500).replace(/\n/g, '\n> ')}`
    });
  }
  if (a === 'forward') {
    return openCompose({
      title: 'Forward',
      subject: /^fwd:/i.test(S.current?.subject || '') ? S.current.subject : `Fwd: ${S.current?.subject || ''}`,
      body: `\n\n---------- Forwarded message ----------\nFrom: ${S.current?.sender}\nDate: ${S.current?.date}\nSubject: ${S.current?.subject}\nTo: ${S.current?.to}\n\n${S.current?.body || ''}`
    });
  }
  if (a === 'more') return load(false);
  if (a === 'review-send') return reviewSend();
}

function toggleCopilot(v) {
  S.copilot = v;
  render();
  if (v) setTimeout(() => document.querySelector('#prompt')?.focus(), 80);
}

function openCompose(data = {}) {
  modal.innerHTML = ComposeModal({ data });
  modal.onclick = e => {
    if (e.target.classList.contains('modal-backdrop') || e.target.closest('[data-action="modal-close"]')) {
      modal.innerHTML = '';
    } else if (e.target.closest('[data-action="review-send"]')) {
      reviewSend();
    }
  };
  setTimeout(() => document.querySelector('#to')?.focus(), 60);
}

function draft() {
  return {
    to: document.querySelector('#to')?.value.trim() || '',
    cc: document.querySelector('#cc')?.value.trim() || '',
    subject: document.querySelector('#subject')?.value.trim() || '',
    body: document.querySelector('#body')?.value || ''
  };
}

function reviewSend() {
  const d = draft();
  if (!d.to || !d.subject || !d.body) {
    return alert('Please complete To, Subject, and Message before sending.');
  }
  modal.innerHTML = ConfirmModal(d);
  modal.onclick = e => {
    if (e.target.classList.contains('modal-backdrop') || e.target.closest('[data-action="modal-close"]')) {
      modal.innerHTML = '';
    }
    if (e.target.closest('[data-action="back-edit"]')) {
      openCompose(d);
    }
    if (e.target.closest('[data-action="confirm-send"]')) {
      send(d);
    }
  };
}

async function send(d) {
  try {
    await api('/api/send', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...d, threadId: S.current?.threadId })
    });
    modal.innerHTML = '';
    navigate('SENT');
  } catch (e) {
    alert('Failed to send: ' + e.message);
  }
}

async function ask(e) {
  e.preventDefault();
  const input = document.querySelector('#prompt');
  const text = input?.value.trim();
  if (!text) return;
  input.value = '';

  const chat = document.querySelector('#chat');
  if (chat) {
    chat.insertAdjacentHTML('beforeend', `<div class="chat-bubble user"><div>${safe(text)}</div></div>`);
    chat.scrollTop = chat.scrollHeight;
  }

  try {
    const context = {
      folder: S.folder,
      query: S.query,
      unreadOnly: S.unreadOnly,
      currentMessage: S.current ? {
        id: S.current.id,
        threadId: S.current.threadId,
        sender: S.current.sender,
        subject: S.current.subject,
        date: S.current.date,
        body: (S.current.body || '').slice(0, 5000)
      } : null
    };

    const r = await api('/api/assistant', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ message: text, context })
    });

    if (chat) {
      chat.insertAdjacentHTML('beforeend', `
        <div class="chat-bubble bot">
          <div class="bubble-spark">✦</div>
          <div>
            ${safe(r.text)}
            ${r.ai ? ' <span class="ai-provider-badge">Groq</span>' : ''}
          </div>
        </div>
      `);
      chat.scrollTop = chat.scrollHeight;
    }

    for (const a of r.actions || []) {
      assistantAction(a);
    }
  } catch (err) {
    if (chat) {
      chat.insertAdjacentHTML('beforeend', `
        <div class="chat-bubble bot error">
          <div class="bubble-spark">⚠️</div>
          <div>${safe(err.message)}</div>
        </div>
      `);
      chat.scrollTop = chat.scrollHeight;
    }
  }
}

function assistantAction(a) {
  if (a.type === 'navigate') navigate(a.folder);
  if (a.type === 'compose') openCompose(a.data);
  if (a.type === 'search_results') {
    const chat = document.querySelector('#chat');
    if (!chat) return;
    chat.insertAdjacentHTML('beforeend', `
      <div class="copilot-search-results">
        ${(a.messages || []).map(m => `
          <button class="copilot-result-card" data-result="${safe(m.id)}">
            <strong>${safe(m.sender)}</strong>
            <span>${safe(m.subject)}</span>
            <small>${safe(m.snippet)}</small>
          </button>
        `).join('')}
      </div>
    `);
    chat.querySelectorAll('[data-result]').forEach(x => {
      x.onclick = () => openMessage(x.dataset.result);
    });
    chat.scrollTop = chat.scrollHeight;
  }
}

function connectEvents() {
  const es = new EventSource('/api/events');
  es.addEventListener('mailbox.changed', () => load(true));
  window.addEventListener('beforeunload', () => es.close());
}

function showLogin() {
  app.innerHTML = `
    <main class="login-wrapper">
      <div class="login-backdrop-glow"></div>
      <div class="login-card">
        <div class="login-logo">✦</div>
        <h1>Nebula Mail</h1>
        <p class="login-subtitle">A high-performance, focused Gmail workspace with AI Copilot. Fast, secure, and privacy-centric.</p>
        <div class="login-features">
          <div class="login-feat-item">✨ AI Summaries &amp; Instant Drafts</div>
          <div class="login-feat-item">⚡ Real-time Mail Syncing</div>
          <div class="login-feat-item">🛡️ Direct Gmail OAuth2 (Tokens stay server-side)</div>
        </div>
        <button id="login" class="login-cta-btn">
          <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          Continue with Google
        </button>
      </div>
    </main>
  `;
  document.querySelector('#login').onclick = async () => {
    const x = await api('/auth/url');
    location.href = x.url;
  };
}

function showError(t) {
  app.innerHTML = `
    <main class="login-wrapper">
      <div class="login-card">
        <div class="login-logo" style="color:#ef4444">⚠️</div>
        <h1>Connection Issue</h1>
        <p class="login-subtitle">${safe(t)}</p>
        <button id="retry" class="login-cta-btn">Try Again</button>
      </div>
    </main>
  `;
  document.querySelector('#retry').onclick = boot;
}

function extractEmail(v = '') {
  return (v.match(/<([^>]+)>/) || [, v])[1]?.trim() || '';
}

function safe(v = '') {
  return String(v).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function debounce(fn, ms) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
}

boot();