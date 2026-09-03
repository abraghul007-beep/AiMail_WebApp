# Nebula Mail — AI-Powered Mail WebApp

A Gmail-connected mail client where an AI-style copilot **controls the UI** instead of returning chat-only answers. Built for the Nebula KnowLab engineering hiring task.

## Implemented
- Gmail OAuth 2.0 authentication.
- Real Inbox and Sent views using Gmail API.
- Email detail view with sender, recipient, date, subject and body.
- Compose and send from the UI.
- Assistant-controlled compose: extracts recipient, quoted subject and body, then visibly fills Compose.
- Assistant search/filter commands update the main mail list.
- Latest-email navigation and current-email context for replies.
- UI filters for keyword and unread mail.
- Automatic 30-second mailbox polling so new messages appear without manual refresh.
- Gmail webhook endpoint reserved for production Pub/Sub push integration.
- Responsive, polished UI with a dedicated copilot panel.

## Run locally

1. Install Node.js 18+.
2. Create a Google Cloud project and enable the Gmail API.
3. Create an OAuth 2.0 Web Application credential. Add `http://localhost:3000/auth/callback` as an authorized redirect URI.
4. Copy `.env.example` to `.env` and fill in the Google client ID/secret and a random session secret.
5. Install dependencies:

```bash
npm install
npm start
```

6. Open `http://localhost:3000` and choose **Continue with Google**.

### Required OAuth scopes
`gmail.readonly`, `gmail.send`, and `gmail.modify` are requested because the app reads mail, sends messages, and marks messages read.

## Assistant examples
- `Send an email to john@example.com with subject 'Meeting Tomorrow' and body 'Let's meet at 3pm'`
- `Show me emails from the last 10 days`
- `Show only unread emails from this week`
- `Open the latest email from David`
- `Reply to this`
- `Show emails from Sarah`
- `Go to Sent`

The important behavior is that assistant commands mutate application state and visibly update the main UI.

## Architecture

```text
Browser SPA (public/)
   ├── Mail list / detail / compose
   └── AI Copilot command parser
             │ HTTP JSON
             ▼
        Express server
       /auth/* /api/*
             │ OAuth 2.0
             ▼
          Gmail API
```

The UI is intentionally separated from the Gmail integration. The assistant is a thin command-to-UI orchestration layer, making it straightforward to replace the parser with an LLM/function-calling layer later.

### Trade-offs
- **Express + vanilla JS** keeps the five-day task small and easy to inspect; React/Next.js would be reasonable for a larger production application.
- The assistant currently uses deterministic intent extraction so it works without an AI API key. Production can replace this with structured LLM tool calls while retaining the same UI actions.
- 30-second polling is included for local/demo reliability. Gmail Pub/Sub `watch` should be configured in production for true push-based sync; the server includes a webhook route for that integration.
- OAuth tokens are kept in the session for this assessment. Production should use encrypted persistent token storage and CSRF/state hardening appropriate to the deployment.

## Human-in-the-loop
The assistant opens and fills Compose but deliberately leaves the final **Send** click to the user. This demonstrates visible UI control and reduces accidental sends.

## What I would improve with more time
1. Replace deterministic assistant parsing with LLM tool/function calling and schema validation.
2. Add Gmail Pub/Sub watch renewal, webhook verification and history-ID based incremental sync.
3. Persist encrypted OAuth tokens and add robust session/security controls.
4. Add conversation/thread view, forwarding, attachments and rich email rendering.
5. Add automated unit/E2E tests and CI.
6. Deploy the app with HTTPS and add screenshots/video plus monitoring.

## Hiring-task coverage
The implementation targets the task's highest-weight requirements: real mail integration, Inbox/Sent data, compose/send, assistant-driven visible UI control, search/filter updates, and context-aware reply behavior. The task also lists real-time sync and several bonus items; polling provides a demo-friendly sync path while Pub/Sub is documented as the production next step.
