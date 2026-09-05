# Nebula Mail — AI-Powered Gmail Workspace

A production-minded Gmail workspace built with **Next.js 16 (App Router)** and **React 19**. The application combines a focused multi-pane mail UI with a **Groq-powered AI Copilot** that controls the interface through structured tool calls instead of acting as a chat-only assistant.

## Hiring Task Coverage

| Requirement | Implementation |
|---|---|
| Gmail OAuth2 | Google OAuth2 callback with state validation and server-side Gmail access |
| Inbox / Sent / Drafts / Starred / Archive | Gmail REST API mailbox queries |
| Email detail | Full Gmail message retrieval with plain-text and HTML body handling |
| Threads | Gmail thread retrieval and conversation reader |
| Compose | UI composer with To/Cc/Subject/Body validation |
| AI compose | Copilot opens and pre-fills Compose from natural language |
| AI search/filter | Copilot updates the main mail list, folder and filters |
| AI open email | Copilot searches and opens the matching message in the reader |
| Human confirmation | Send requires an explicit review/confirm step |
| Real-time sync | Gmail Pub/Sub watch + webhook notification path, with polling fallback |

## AI Copilot

The Copilot uses Groq's OpenAI-compatible API and structured tools:

- `navigate_mail` — switch Inbox, Sent, Drafts, Starred or Archive.
- `search_mail` — search Gmail and display results in the main list.
- `open_email` — find and open a matching message.
- `filter_mail` — apply folder, unread and Gmail-query filters.
- `compose_email` — open Compose with fields pre-filled.
- `prepare_reply` — create a contextual reply draft.
- `prepare_forward` — prepare a forward draft.

The AI **never sends an email autonomously**. Sending is always a separate user-confirmed action.

### Example commands

```text
Go to Sent mail
Show only unread emails
Find emails about Q3 planning
Open the latest email from Sarah
Send an email to john@example.com with subject "Meeting" and body "Let's meet tomorrow"
Draft a reply thanking them
```

## Real-Time Gmail Sync

When `PUBSUB_TOPIC` is configured, the signed-in mailbox registers a Gmail `users.watch` subscription during session boot. Google Pub/Sub delivers mailbox-change notifications to:

```text
POST /api/sync/webhook
```

The webhook validates the optional `PUBSUB_VERIFICATION_TOKEN`, accepts Gmail's notification payload, and records a small per-mailbox notification cursor. The browser checks `/api/sync/status` and refreshes the authenticated Gmail mailbox when the push version changes.

A polling fallback remains enabled so the UI continues to refresh when Pub/Sub is unavailable. Configure `POLL_INTERVAL_SECONDS` to change the fallback interval.

> **Deployment note:** the notification cursor is intentionally small and process-local in this hiring-task implementation. For a horizontally scaled production deployment, replace it with a durable shared store (for example Redis/Postgres) and run scheduled Gmail watch renewal. The current code must not be presented as durable multi-instance sync storage.

## Architecture

```text
src/
├── app/
│   ├── layout.js
│   ├── page.js                    # Workspace orchestration/state
│   └── api/
│       ├── auth/                  # OAuth URL, callback, logout
│       ├── me/                    # Profile + Gmail watch registration
│       ├── messages/              # List/detail/read APIs
│       ├── threads/               # Conversation retrieval
│       ├── send/                  # Human-confirmed Gmail send
│       ├── assistant/             # Groq tool-calling endpoint
│       └── sync/                  # Push webhook + sync status
├── components/                    # Rail, Sidebar, MailList, Reader, Copilot, modals
└── lib/
    ├── gmail.js                   # Gmail API + message normalization
    ├── groq.js                    # Groq tools/model fallback
    ├── session.js                 # Encrypted HTTP-only session
    └── utils.js

tests/
└── mail.spec.js                   # Playwright E2E coverage
```

The UI is deliberately componentized: the page coordinates state and API actions while presentation and interaction live in focused components.

## Local Setup

### Prerequisites

- Node.js 20+
- Google Cloud project with Gmail API enabled
- Google OAuth 2.0 Web Client
- Groq API key
- Optional Google Cloud Pub/Sub topic for push sync

### Install

```bash
git clone https://github.com/abraghul007-beep/AiMail_WebApp.git
cd AiMail_WebApp
npm ci
```

### Environment

Create `.env.local`:

```env
NODE_ENV=development
SESSION_SECRET=replace-with-a-long-random-secret

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback

GROQ_API_KEY=gsk_your_groq_api_key
GROQ_MODEL=openai/gpt-oss-120b

# Optional real-time Gmail push
PUBSUB_TOPIC=projects/your-project/topics/gmail-push
PUBSUB_VERIFICATION_TOKEN=replace-with-a-random-webhook-token
POLL_INTERVAL_SECONDS=30
```

For Google OAuth, add the callback URL above to the OAuth client's authorized redirect URIs.

### Run

```bash
npm run dev
```

Open `http://localhost:3000` and sign in with Google.

## Pub/Sub Configuration

1. Enable Gmail API and Pub/Sub in Google Cloud.
2. Create a Pub/Sub topic.
3. Grant Gmail's publishing service account permission to publish to the topic, as required by Google's Gmail push-notification setup.
4. Expose `/api/sync/webhook` through a public HTTPS endpoint.
5. Configure `PUBSUB_TOPIC` with the full topic name.
6. Configure `PUBSUB_VERIFICATION_TOKEN` and append it to the webhook endpoint as `?token=...` in the Pub/Sub push subscription configuration.
7. Sign in to the application. The `/api/me` boot flow registers `users.watch` for the authenticated mailbox.

Because Gmail watch subscriptions expire, a production deployment should add a durable per-user watch record plus a scheduled renewal job. The application keeps polling as a safety fallback.

## Testing

```bash
npm test
npm run build
npm run test:e2e
```

The CI workflow runs the unit suite and production build on pushes and pull requests to `main`. E2E tests require a browser environment and, where applicable, authenticated test setup.

## Security & Safety

- OAuth `state` is generated and verified during the callback.
- Session cookies are HTTP-only and encrypted with AES-256-GCM.
- Gmail tokens stay server-side.
- AI-generated sends always stop at a human review/confirmation step.
- Email HTML is rendered in a sandboxed iframe to isolate untrusted markup/styles.
- API routes validate authentication and message fields.
- Email header values reject CR/LF characters to reduce header injection risk.
- Groq model fallback improves resilience when a configured model is unavailable.

## What I'd Improve With More Time

1. Move sync cursors and OAuth/session state to durable shared storage for multi-instance deployments.
2. Add a scheduled worker/cron to renew every Gmail `users.watch` subscription before expiry and use the Gmail History API to process changes instead of refreshing the entire mailbox.
3. Add authenticated integration tests against a Gmail test account and a Pub/Sub emulator.
4. Add CI coverage for linting, accessibility checks and a production smoke test.
5. Add a small observability layer for sync failures, Gmail API rate limits and Groq fallback events.
6. Add user-facing sync diagnostics and a retry action for expired/failed watches.

## Demo / Screenshots

For the hiring submission, add the final UI screenshots and a short screen recording here. Recommended demo flow:

1. Sign in with Google.
2. Navigate between Inbox and Sent.
3. Ask Copilot to find a message and show the results in the main list.
4. Ask Copilot to compose an email and show the populated Compose form.
5. Review the generated message and demonstrate the explicit confirmation before Send.
6. Demonstrate a new Gmail notification updating the workspace without a manual page refresh.

## License

This repository is a hiring-task submission project.
