const { test, expect } = require('@playwright/test');

test.describe('Nebula Gmail Workspace E2E Tests', () => {
  test('renders workspace login or main 5-pane interface', async ({ page }) => {
    await page.goto('/');

    // Either the login card (unauthenticated) or the 5-pane shell (authenticated) is displayed
    const loginCard = page.locator('.login-card');
    const shell = page.locator('.shell');
    await expect(loginCard.or(shell)).toBeVisible();
  });

  test('validates compose modal opening, form fields, and review flow', async ({ page }) => {
    // Mock authenticated profile and messages for isolated E2E testing
    await page.route('**/api/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ email: 'testuser@example.com', push: { configured: false } })
      });
    });

    await page.route('**/api/messages?*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          messages: [
            {
              id: 'msg-1',
              threadId: 't-1',
              sender: 'David Chen <david@example.com>',
              to: 'me',
              subject: 'Q3 planning follow-up',
              date: new Date().toISOString(),
              snippet: 'Here are the revised milestones and owners…',
              body: 'Hi team,\n\nHere are the revised milestones. Let us review Friday.',
              htmlBody: '<p>Hi team,</p><p>Here are the revised milestones. Let us review Friday.</p>',
              unread: true
            }
          ]
        })
      });
    });

    await page.route('**/api/messages/msg-1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'msg-1',
          threadId: 't-1',
          sender: 'David Chen <david@example.com>',
          to: 'me',
          subject: 'Q3 planning follow-up',
          date: new Date().toISOString(),
          snippet: 'Here are the revised milestones…',
          body: 'Hi team,\n\nHere are the revised milestones.',
          htmlBody: '<p>Hi team,</p><p>Here are the revised milestones.</p>',
          unread: true
        })
      });
    });

    await page.route('**/api/threads/*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 't-1',
          messages: [
            {
              id: 'msg-1',
              threadId: 't-1',
              sender: 'David Chen <david@example.com>',
              to: 'me',
              subject: 'Q3 planning follow-up',
              date: new Date().toISOString(),
              snippet: 'Here are the revised milestones…',
              body: 'Hi team,\n\nHere are the revised milestones.',
              htmlBody: '<p>Hi team,</p><p>Here are the revised milestones.</p>',
              unread: true
            }
          ]
        })
      });
    });

    await page.goto('/');

    // 1. Wait for workspace and message list to settle
    await expect(page.locator('[data-message-id="msg-1"]')).toBeVisible({ timeout: 10000 });

    // 2. Click Compose Button
    await page.locator('#sidebar-compose-btn').click();
    await expect(page.locator('#compose-modal-card')).toBeVisible();

    // 3. Fill in Form Fields
    await page.locator('#compose-to').fill('alex@example.com');
    await page.locator('#compose-subject').fill('Playwright Automated Test');
    await page.locator('#compose-body').fill('Hello Alex, this is an automated test.');

    // 4. Click Review & Send
    await page.locator('#compose-review-btn').click();
    await expect(page.locator('#confirm-modal-card')).toBeVisible();
    await expect(page.locator('#confirm-send-btn')).toBeVisible();

    // 5. Test Back to Edit
    await page.locator('#confirm-back-btn').click();
    await expect(page.locator('#compose-modal-card')).toBeVisible();
    await expect(page.locator('#compose-to')).toHaveValue('alex@example.com');

    // 6. Close Modal
    await page.locator('#modal-close-btn').click();
    await expect(page.locator('#compose-modal-card')).not.toBeVisible();
  });

  test('validates email viewing with HTML content and reply trigger', async ({ page }) => {
    await page.route('/api/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ email: 'testuser@example.com', push: { configured: false } })
      });
    });

    await page.route('/api/messages*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          messages: [
            {
              id: 'msg-100',
              threadId: 't-100',
              sender: 'Sarah Connor <sarah@skynet.com>',
              to: 'me',
              subject: 'Project Security Status',
              date: '2026-09-04T10:00:00Z',
              snippet: 'The security review is complete and all systems are green.',
              body: 'The security review is complete and all systems are green.',
              htmlBody: '<div style="color:green;"><strong>Status:</strong> All systems green.</div>',
              unread: false
            }
          ]
        })
      });
    });

    await page.route('/api/messages/msg-100', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'msg-100',
          threadId: 't-100',
          sender: 'Sarah Connor <sarah@skynet.com>',
          to: 'me',
          subject: 'Project Security Status',
          date: '2026-09-04T10:00:00Z',
          snippet: 'The security review is complete.',
          body: 'The security review is complete and all systems are green.',
          htmlBody: '<div style="color:green;"><strong>Status:</strong> All systems green.</div>',
          unread: false
        })
      });
    });

    await page.route('/api/threads/t-100', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 't-100',
          messages: [
            {
              id: 'msg-100',
              threadId: 't-100',
              sender: 'Sarah Connor <sarah@skynet.com>',
              to: 'me',
              subject: 'Project Security Status',
              date: '2026-09-04T10:00:00Z',
              snippet: 'The security review is complete.',
              body: 'The security review is complete and all systems are green.',
              htmlBody: '<div style="color:green;"><strong>Status:</strong> All systems green.</div>',
              unread: false
            }
          ]
        })
      });
    });

    await page.goto('/');

    // 1. Click Message in List
    await page.locator('[data-message-id="msg-100"]').click();

    // 2. Verify Email Reading Pane renders subject, sender, and HTML iframe
    await expect(page.locator('.reader-headline')).toContainText('Project Security Status');
    await expect(page.locator('.sender-name-heading')).toContainText('Sarah Connor');
    await expect(page.locator('iframe[title="Email Body"]')).toBeVisible();

    // 3. Test Reply Button
    await page.locator('#reader-reply-btn').click();
    await expect(page.locator('#compose-modal-card')).toBeVisible();
    await expect(page.locator('#compose-to')).toHaveValue('sarah@skynet.com');
    await expect(page.locator('#compose-subject')).toHaveValue('Re: Project Security Status');
  });

  test('validates AI Copilot prompting and UI control', async ({ page }) => {
    await page.route('/api/me', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ email: 'testuser@example.com', push: { configured: false } })
      });
    });

    await page.route('/api/messages*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ messages: [] })
      });
    });

    await page.route('/api/assistant', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          ai: true,
          provider: 'Groq',
          text: 'I have prepared a compose draft for you.',
          actions: [
            {
              type: 'compose',
              data: {
                title: 'New Message',
                to: 'lead@company.com',
                subject: 'AI Copilot Trigger',
                body: 'This draft was generated via natural language AI tool calling.'
              }
            }
          ]
        })
      });
    });

    await page.goto('/');

    // 1. Verify Copilot Drawer
    await expect(page.locator('#copilot-panel')).toBeVisible();

    // 2. Type natural language prompt into Copilot
    await page.locator('#copilot-input').fill('Compose an email to lead@company.com about AI Copilot Trigger');
    await page.locator('#copilot-submit-btn').click();

    // 3. Verify AI Tool triggers Compose view with pre-filled fields
    await expect(page.locator('#compose-modal-card')).toBeVisible();
    await expect(page.locator('#compose-to')).toHaveValue('lead@company.com');
    await expect(page.locator('#compose-subject')).toHaveValue('AI Copilot Trigger');
  });
});
