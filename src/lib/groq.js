export const tools = [
  {
    type: 'function',
    function: {
      name: 'navigate_mail',
      description: 'Navigate to a Gmail folder view (INBOX, SENT, DRAFT, STARRED, ARCHIVE)',
      parameters: {
        type: 'object',
        properties: {
          folder: { type: 'string', enum: ['INBOX', 'SENT', 'DRAFT', 'STARRED', 'ARCHIVE'] }
        },
        required: ['folder']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'search_mail',
      description: 'Search Gmail and display results in both the main message list and assistant panel',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Search term e.g. "newer_than:10d" or "from:Sarah"' },
          maxResults: { type: 'integer' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'open_email',
      description: 'Find and immediately open a specific email in the detail reading pane',
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Query to locate the email to open, e.g. "from:David" or subject' }
        },
        required: ['query']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'filter_mail',
      description: 'Filter messages by unread state, date range, or folder in the main UI',
      parameters: {
        type: 'object',
        properties: {
          folder: { type: 'string', enum: ['INBOX', 'SENT', 'DRAFT', 'STARRED', 'ARCHIVE'] },
          unreadOnly: { type: 'boolean' },
          query: { type: 'string', description: 'Gmail search filter' }
        }
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'compose_email',
      description: 'Open the compose dialog and pre-fill email fields (To, Subject, Body); never sends directly without human confirmation',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string' },
          cc: { type: 'string' },
          subject: { type: 'string' },
          body: { type: 'string' }
        },
        required: ['to', 'subject', 'body']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'prepare_reply',
      description: 'Prepare a reply draft to the currently open email; never sends directly without human confirmation',
      parameters: {
        type: 'object',
        properties: {
          body: { type: 'string' }
        },
        required: ['body']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'prepare_forward',
      description: 'Prepare a forward draft of the currently open email',
      parameters: {
        type: 'object',
        properties: {
          to: { type: 'string' },
          body: { type: 'string' }
        },
        required: ['to']
      }
    }
  }
];

export async function queryGroq(message, context) {
  const models = [
    process.env.GROQ_MODEL || 'openai/gpt-oss-120b',
    'openai/gpt-oss-120b',
    'openai/gpt-oss-20b',
    'qwen/qwen3.8-27b'
  ];

  const uniqueModels = [...new Set(models.filter(Boolean))];
  let lastError = null;

  for (const model of uniqueModels) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          max_tokens: 900,
          tools,
          tool_choice: 'auto',
          messages: [
            {
              role: 'system',
              content: 'You are Nebula Mail Copilot. You control the email client UI programmatically on the user\'s behalf (navigating folders, searching, opening specific emails, preparing compose/reply drafts, filtering). When users request email operations, use the appropriate tools to manipulate the UI. Never execute a send without human review. Be concise, direct, and helpful.'
            },
            {
              role: 'user',
              content: `${message}\nCurrent Context:${JSON.stringify(context || {})}`
            }
          ]
        })
      });

      const data = await response.json();
      if (!response.ok) {
        lastError = new Error(data.error?.message || `Groq HTTP ${response.status}`);
        console.warn(`[Groq Model ${model}]:`, data.error?.message || response.statusText);
        continue;
      }
      return data.choices?.[0]?.message || { content: 'Done.' };
    } catch (err) {
      lastError = err;
      console.warn(`[Groq Error on ${model}]:`, err.message);
    }
  }

  throw lastError || new Error('All Groq candidate models failed');
}
