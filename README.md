# Nebula Mail

A focused Gmail workspace with a clean component-based frontend and an optional Groq-powered AI Copilot.

## What changed in v2

- Replaced the paid Claude integration with **Groq's API**. The AI provider is server-side and configurable with `GROQ_API_KEY`.
- Removed the crowded five-pane UI, duplicate actions, smart-filter clutter and legacy style overrides.
- Moved the browser UI out of one monolithic file into reusable components:

```text
public/
├── index.html
├── styles.css
├── css/
│   └── components.css
└── js/
    ├── app.js          # state, API orchestration and events
    └── components.js   # Rail, Sidebar, MailList, Reader, Copilot, ComposeModal
```

- Copilot is now a compact floating workspace instead of permanently consuming a full application column.
- Gmail functionality remains real: OAuth, Inbox/Sent/Drafts/Starred/Archive, search, threads, compose, reply, forwarding, read state and pagination.
- Sending keeps the human-in-the-loop confirmation step.
- OAuth state validation and server-side Gmail tokens remain in place.
- Push/SSE support remains available when `PUBSUB_TOPIC` is configured, with 30-second fallback refresh.

## Groq setup

Groq offers an OpenAI-compatible chat-completions API. Create a Groq API key and set it only on the server:

```env
GROQ_API_KEY=your-groq-api-key
GROQ_MODEL=llama-3.3-70b-versatile
```

The free developer tier is subject to Groq's current rate/token limits; it is not an unlimited production quota. The app also works without an AI key, but Copilot AI actions are disabled.

## Local setup

Requirements: Node.js 18+.

```bash
cp .env.example .env
npm install
npm test
npm start
```

Open `http://localhost:3000` and sign in with Google.

Required environment values:

```env
PORT=3000
NODE_ENV=development
SESSION_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback
GROQ_API_KEY=...
GROQ_MODEL=llama-3.3-70b-versatile
```

Optional real-time push values:

```env
PUBSUB_TOPIC=projects/YOUR_PROJECT/topics/gmail-events
PUBSUB_VERIFICATION_TOKEN=replace-with-a-random-token
POLL_INTERVAL_SECONDS=30
```

## Architecture

```text
Browser
  │
  ├── components.js → visual components
  └── app.js → state + user interactions
          │
          ▼
      Express API
       ├── Google OAuth
       ├── Gmail API
       ├── Groq API
       └── Pub/Sub webhook → SSE → Browser
```

## AI safety

The model can navigate mail, search messages and prepare drafts/replies. It cannot call the send endpoint. Sending is always performed by the user through **Review & Send → Confirm & Send**.

## Production notes

For a real multi-user deployment, replace Express's in-memory session store with a persistent store, encrypt OAuth tokens at rest, use managed secrets, enable HTTPS, verify Pub/Sub push JWTs, add rate limiting/observability and use a shared event/state store across instances.
