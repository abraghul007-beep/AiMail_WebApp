# Nebula Mail — AI-Powered Mail Web Application

An executive email workspace where an integrated AI Copilot controls the UI programmatically: composing emails, navigating views, filtering results, opening specific messages, and assisting with context-aware replies.

Built for the **Nebula KnowLab™** hiring evaluation.

---

## ✦ Overview & Key Capabilities

### 1. Mail Client Integration
- **Real Gmail OAuth2 & REST API**: Direct Google Workspace & Gmail integration using official OAuth2 flows (`read`, `send`, `modify`).
- **Inbox, Sent, Drafts, Starred, Archive**: Real-time listing with pagination, unread indicators, and search.
- **Thread / Conversation Reading Desk**: Full email detail view with thread progression and sender metadata.
- **Compose, Reply & Forward**: Form management with human-in-the-loop review before dispatch.

### 2. Real-Time Mail Synchronization
- **Push Notification Support**: Integrated Google Cloud Pub/Sub webhook endpoint (`/api/gmail/webhook`) paired with Server-Sent Events (SSE `/api/events`) for instantaneous mailbox updates without manual page refreshes.
- **Adaptive Fallback**: Gracefully falls back to 30-second interval polling if push webhooks are not configured.

### 3. AI Assistant (UI Co-Pilot)
The AI Copilot does not merely chat—**it directly manipulates the user interface via tool calls**:
- **Compose & Pre-fill Form**: *"Send an email to john@example.com with subject 'Meeting Tomorrow' and body 'Let's meet at 3pm'"* → Opens the compose modal with fields filled in.
- **Search & Display in Main UI**: *"Show me emails from the last 10 days"* / *"Find the email from Sarah about project update"* → Queries Gmail and immediately updates the main message list.
- **Navigate & Open**: *"Open the latest email from David"* → Navigates to and opens the matching thread in the detail reading pane.
- **Context-Aware Replies**: *"Reply to this"* (while reading an email) → Identifies the active email, sender, subject, and context, and generates a draft reply.
- **Natural Language Filtering**: *"Show only unread emails from this week"* → Applies unread and date filters directly to the UI.

---

## 🛠️ Architecture & Clean Design

The frontend is structured in clean, decoupled ES modules and CSS modules:

```text
public/
├── index.html
├── css/
│   ├── main.css              # Master entry importing CSS modules
│   ├── tokens.css            # Color variables & typography tokens
│   ├── base.css              # 5-column grid layout & resets
│   ├── sidebar.css           # Rail, navigation sidebar & sync status
│   ├── mail-list.css         # Search pill, folder header & message rows
│   ├── reader.css            # Reading desk, sender card & Executive Brief
│   ├── copilot.css           # AI Copilot drawer & mail results stream
│   ├── modal.css             # Compose & send confirmation dialogs
│   └── login.css             # Auth screen styling
└── js/
    ├── app.js                # Application coordinator & event delegation
    ├── state.js              # Centralized reactive state store
    ├── api.js                # REST API client with error handling
    ├── utils.js              # Helpers (date formatting, sanitization, parsing)
    └── components/
        ├── rail.js           # 64px leftmost icon rail
        ├── sidebar.js        # 264px sidebar (Compose, Mailboxes, Smart Filters)
        ├── mail-list.js      # 430px message list column
        ├── reader.js         # Detail reading pane & Executive Brief
        ├── copilot.js        # 330px AI Copilot panel
        ├── compose-modal.js  # Compose & confirm send dialogs
        ├── login-view.js     # Auth & error views
        └── icons.js          # SVG icon library
```

---

## 🚀 Setup & Local Execution

### Prerequisites
- Node.js 18+
- Google Cloud Console OAuth 2.0 Client Credentials
- Groq API Key (for LLM tool calling via `llama-3.3-70b-versatile`)

### 1. Installation
```bash
git clone <repo-url>
cd AiMail_WebApp
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=your-random-session-secret-string

# Google OAuth2 Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Groq AI Credentials
GROQ_API_KEY=gsk_your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile

# (Optional) Google Pub/Sub Push Webhook
PUBSUB_TOPIC=projects/your-project/topics/gmail-events
PUBSUB_VERIFICATION_TOKEN=your-verification-token
POLL_INTERVAL_SECONDS=30
```

### 3. Run Tests & Start Server
```bash
# Run unit test suite
npm test

# Start server
npm start
```
Open `http://localhost:3000` and sign in with your Google account.

---

## ⚖️ Architectural Decisions & Trade-Offs

1. **Server-Side Token Storage & Safety**: OAuth tokens and API keys never leave the server. All mail dispatch requests require explicit user confirmation (**Human-in-the-Loop**), preventing autonomous prompt injection or accidental sends.
2. **Vanilla ES Modules & CSS Modules**: Avoided heavy frontend framework overhead (e.g. Next.js/React bundle weight) in favor of high-performance standard native browser modules, yielding instant load times and zero build-step fragility.
3. **Groq Llama 3.3 70B for Tool Calling**: Groq delivers ~300 tokens/second inference latency, allowing UI actions to feel snappy and instantaneous when prompted in natural language.
4. **Resilient SSE + Fallback Sync**: Implemented Server-Sent Events for live push updates with automatic reconnection and background polling fallback to guarantee 100% mailbox reliability.

---

## 🔮 What We'd Improve With More Time

1. **Offline & IndexedDB Caching**: Store message bodies and metadata in local IndexedDB for instant offline search and instantaneous startup.
2. **Attachment Support**: Rich file upload and inline image attachment rendering.
3. **Multi-Account Switching**: Support managing multiple connected Google / Microsoft accounts concurrently.
4. **Draft Auto-Saving**: Periodically sync in-progress compose drafts to Gmail drafts folder.

---

## 👥 Submission Collaborators
- `Aswath363`
- `akshaiP`
- `ashwanthnebula`
