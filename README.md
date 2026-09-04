# Nebula Mail — AI-Powered Gmail Workspace (Next.js)

An editorial, high-performance Gmail web application built with **Next.js 16 (App Router)** and **React 19**, featuring a 5-pane workspace design, rich sandboxed HTML email rendering, and an integrated **AI Copilot** that controls the UI programmatically via Groq LLM tool-calling with strict Human-in-the-Loop safety.

---

## ✦ Overview & Key Capabilities

### 1. Authentic Gmail Workspace Experience
- **Official Gmail REST API & OAuth2**: Secure server-side authentication using Google OAuth 2.0 with AES-256 encrypted session cookies.
- **Core Standard Mailboxes**: Inbox (with live unread counters), Starred, Sent (with recipient formatting), Drafts, and Archive (`-label:inbox -label:trash -label:spam`).
- **Sandboxed HTML Email Rendering**: Renders full rich-text and HTML newsletters in isolated `iframe` viewports with automatic dynamic height adjustment.
- **Conversation Thread View**: Accordion thread progression displaying full conversation history with avatars and timestamps.
- **Compose, Reply & Forward**: Context-aware composer with thread tracking and mandatory **Human-in-the-Loop Review & Send** confirmation before message dispatch.

### 2. AI Copilot (Natural Language UI Control)
Powered by **Groq** with automatic model fallback (`openai/gpt-oss-120b` → `openai/gpt-oss-20b` → `qwen/qwen3.8-27b`), the AI Copilot does not just generate text—**it actively manipulates the UI via structured tool calling**:
- **Compose & Pre-fill Form**: *"Send an email to john@example.com with subject 'Meeting' and body 'Let's meet tomorrow'"* → Opens the compose modal with fields pre-filled.
- **Context-Aware Replies**: *"Draft a reply thanking them"* → Automatically extracts the active email's sender, subject (`Re:`), and snippet to prepare a contextual reply.
- **Search & Display in Main UI**: *"Find emails about Q3 planning"* → Executes Gmail queries and updates the main message list instantly.
- **Navigate & Filter**: *"Show me only unread emails"* / *"Go to Sent mail"* → Switches folders and filters the active view.
- **Open Specific Messages**: *"Open the latest email from Sarah"* → Finds and displays the matching conversation in the reader pane.

### 3. Real-Time Synchronization
- **Live Sync Status**: Displays real-time mailbox sync state and background polling interval.
- **Instant Background Read Status**: Automatically synchronizes unread/read state with Gmail servers upon opening messages.

---

## 🛠️ Architecture & Project Structure

The project is built using a clean, modular Next.js App Router architecture:

```text
AiMail_WebApp/
├── src/
│   ├── app/
│   │   ├── layout.js              # Root layout with Newsreader & Plus Jakarta Sans typography
│   │   ├── page.js                # Main workspace orchestrator & state coordinator
│   │   ├── globals.css            # Unified design system tokens & 5-pane responsive styles
│   │   ├── auth/
│   │   │   └── callback/route.js  # OAuth2 redirect callback handler
│   │   └── api/
│   │       ├── me/route.js        # Current user profile & sync status
│   │       ├── auth/
│   │       │   ├── url/route.js   # OAuth login URL generation
│   │       │   ├── callback/route.js
│   │       │   └── logout/route.js
│   │       ├── messages/
│   │       │   ├── route.js       # Message list & search queries
│   │       │   ├── [id]/route.js  # Full message body & metadata
│   │       │   └── [id]/read/route.js # Mark message as read
│   │       ├── threads/[id]/route.js # Conversation thread aggregator
│   │       ├── send/route.js      # RFC 2822 MIME email dispatch
│   │       ├── assistant/route.js # Groq AI tool execution endpoint
│   │       └── sync/status/route.js # Sync health check
│   ├── components/
│   │   ├── Rail.js                # Leftmost 64px icon navigation rail
│   │   ├── Sidebar.js             # 264px mailbox navigation & live sync card
│   │   ├── MailList.js            # 430px message list with instant search & unread filter
│   │   ├── EmailReader.js         # Sandboxed HTML email reader & conversation thread accordion
│   │   ├── Copilot.js             # 330px AI drawer with interactive result cards
│   │   ├── ComposeModal.js        # Compose dialog with form validation
│   │   ├── ConfirmModal.js        # Human-in-the-Loop review & send dialog
│   │   ├── LoginView.js           # Google OAuth sign-in & error screens
│   │   └── Icons.js               # Clean SVG icon registry
│   └── lib/
│       ├── gmail.js               # Gmail API client, multipart decoder & query builder
│       ├── groq.js                # Groq client with multi-model fallback & tool schemas
│       ├── session.js             # AES-256-GCM encrypted cookie session manager
│       └── utils.js               # Date formatters, sender cleaner, email extractors
├── tests/
│   └── mail.spec.js               # Playwright E2E test suite (Login, Compose, HTML reader, Copilot)
├── playwright.config.js           # Playwright E2E configuration
├── server.test.js                 # Backend unit & integration tests
└── package.json
```

---

## 🚀 Setup & Local Execution

### Prerequisites
- **Node.js 18+**
- **Google Cloud Console OAuth 2.0 Client Credentials** (Gmail API enabled)
- **Groq API Key** (for AI tool-calling)

### 1. Installation
```bash
git clone https://github.com/abraghul007-beep/AiMail_WebApp.git
cd AiMail_WebApp
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=dev-nebula-session-secret-change-in-production

# Google Cloud OAuth 2.0 Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

# Groq AI Credentials
GROQ_API_KEY=gsk_your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b
```

### 3. Running Locally
```bash
# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser and click **Sign in with Google**.

---

## 🧪 Testing

### Automated E2E Tests (Playwright)
```bash
# Run all end-to-end tests
npm run test:e2e
```
*Tests cover workspace rendering, compose & review modal, sandboxed HTML viewer, and AI Copilot UI control.*

### Unit Tests
```bash
# Run backend unit tests
npm test
```

### Production Build Verification
```bash
# Test Next.js compilation & static page generation
npm run build
```

---

## ⚖️ Architectural Decisions & Safety Measures

1. **Human-in-the-Loop Safety**: The AI Copilot can prepare, pre-fill, and suggest draft emails, but **never sends emails autonomously**. Every send operation requires explicit user confirmation via the `ConfirmModal`.
2. **Encrypted Token Storage**: OAuth access and refresh tokens are encrypted using **AES-256-GCM** inside HTTP-only, SameSite cookies. Sensitive credentials are never exposed to client-side scripts.
3. **Sandboxed HTML Rendering**: Emails containing arbitrary external HTML, styles, and tracking pixels are isolated within sandboxed `iframe` viewports (`sandbox="allow-same-origin allow-popups"`), preventing CSS bleeding and XSS vulnerabilities.
4. **Groq Multi-Model Fallback**: If a primary LLM model is rate-limited or temporarily unavailable, the backend automatically falls back to secondary models (`openai/gpt-oss-120b` → `openai/gpt-oss-20b` → `qwen/qwen3.8-27b`) to ensure continuous uptime.
