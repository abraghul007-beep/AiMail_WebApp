module.exports = [
"[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/server/route-modules/app-page/module.compiled.js [app-ssr] (ecmascript)").vendored['react-ssr'].ReactJsxDevRuntime;
}),
"[project]/src/app/page.js [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkspacePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/Rail'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/Sidebar'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/MailList'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/EmailReader'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/Copilot'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ComposeModal'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/ConfirmModal'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/components/LoginView'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
(()=>{
    const e = new Error("Cannot find module '@/lib/utils'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
'use client';
;
;
;
;
;
;
;
;
;
;
;
function WorkspacePage() {
    const [authRequired, setAuthRequired] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errorMessage, setErrorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [syncMode, setSyncMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('Push + fallback sync');
    const [lastSyncTime, setLastSyncTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [folder, setFolder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('INBOX');
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [nextPageToken, setNextPageToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [unreadOnly, setUnreadOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [currentMessage, setCurrentMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [thread, setThread] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [copilotOpen, setCopilotOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [chatMessages, setChatMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([
        {
            role: 'assistant',
            text: 'I found the latest planning thread and opened it. I can also prepare a reply or search related mail.'
        },
        {
            role: 'results',
            tag: 'MAIL RESULTS · planning',
            items: [
                {
                    id: '1',
                    subject: 'Q3 planning follow-up',
                    snippet: 'Here are the revised milestones…'
                },
                {
                    id: '2',
                    subject: 'Friday checkpoint',
                    snippet: 'Agenda and action items…'
                }
            ]
        }
    ]);
    const [composeData, setComposeData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null); // null | { to, cc, subject, body, title }
    const [confirmData, setConfirmData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null); // null | { to, cc, subject, body }
    const loadMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (reset = false, customParams = {})=>{
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
            const newMsgs = reset ? data.messages || [] : [
                ...messages,
                ...data.messages || []
            ];
            setMessages(newMsgs);
            setNextPageToken(data.nextPageToken || null);
            setLastSyncTime(new Date().toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit'
            }));
            // Auto-select first message on reset if none is open
            if (reset && newMsgs.length > 0 && !currentMessage) {
                openMessage(newMsgs[0].id);
            }
        } catch (err) {
            console.error('Error loading messages:', err);
        } finally{
            setLoading(false);
        }
    }, [
        folder,
        searchQuery,
        unreadOnly,
        nextPageToken,
        messages,
        currentMessage
    ]);
    const openMessage = async (id)=>{
        try {
            const res = await fetch(`/api/messages/${encodeURIComponent(id)}`);
            if (!res.ok) throw new Error('Message not found');
            const msg = await res.json();
            setCurrentMessage(msg);
            // Fetch thread messages
            const threadRes = await fetch(`/api/threads/${encodeURIComponent(msg.threadId || id)}`);
            if (threadRes.ok) {
                const threadData = await threadRes.json();
                setThread(threadData.messages || [
                    msg
                ]);
            } else {
                setThread([
                    msg
                ]);
            }
            // Mark as read in background
            if (msg.unread) {
                fetch(`/api/messages/${encodeURIComponent(id)}/read`, {
                    method: 'POST'
                }).catch(()=>{});
                msg.unread = false;
                setMessages((prev)=>prev.map((m)=>m.id === id ? {
                            ...m,
                            unread: false
                        } : m));
            }
        } catch (err) {
            console.error('Error opening message:', err);
        }
    };
    const boot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
        } finally{
            setLoading(false);
        }
    }, [
        loadMessages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        boot();
    }, [
        boot
    ]);
    const handleOAuthLogin = async ()=>{
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
    const handleNavigate = (newFolder)=>{
        setFolder(newFolder);
        setCurrentMessage(null);
        setThread([]);
        setSearchQuery('');
        setUnreadOnly(false);
        loadMessages(true, {
            folder: newFolder,
            q: '',
            unreadOnly: false
        });
    };
    const handleSearchChange = (q)=>{
        setSearchQuery(q);
        loadMessages(true, {
            q
        });
    };
    const handleToggleUnread = (unread)=>{
        setUnreadOnly(unread);
        loadMessages(true, {
            unreadOnly: unread
        });
    };
    const handleReply = (msg = currentMessage)=>{
        if (!msg) return;
        setComposeData({
            title: 'Reply',
            to: extractEmail(msg.sender),
            subject: /^re:/i.test(msg.subject || '') ? msg.subject : `Re: ${msg.subject || ''}`,
            body: `\n\nOn ${msg.date || ''}, ${msg.sender || ''} wrote:\n> ${(msg.body || '').slice(0, 1500).replace(/\n/g, '\n> ')}`
        });
    };
    const handleForward = (msg = currentMessage)=>{
        if (!msg) return;
        setComposeData({
            title: 'Forward',
            subject: /^fwd:/i.test(msg.subject || '') ? msg.subject : `Fwd: ${msg.subject || ''}`,
            body: `\n\n---------- Forwarded message ----------\nFrom: ${msg.sender}\nDate: ${msg.date}\nSubject: ${msg.subject}\nTo: ${msg.to}\n\n${msg.body || ''}`
        });
    };
    const handleReviewSend = (draft)=>{
        setConfirmData(draft);
        setComposeData(null);
    };
    const handleConfirmSend = async ()=>{
        if (!confirmData) return;
        try {
            const res = await fetch('/api/send', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    ...confirmData,
                    threadId: currentMessage?.threadId
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
    const handleCopilotSendMessage = async (text)=>{
        const newChat = [
            ...chatMessages,
            {
                role: 'user',
                text
            }
        ];
        setChatMessages(newChat);
        try {
            const context = {
                folder,
                query: searchQuery,
                unreadOnly,
                currentMessage: currentMessage ? {
                    id: currentMessage.id,
                    threadId: currentMessage.threadId,
                    sender: currentMessage.sender,
                    subject: currentMessage.subject,
                    date: currentMessage.date,
                    body: (currentMessage.body || '').slice(0, 4000)
                } : null
            };
            const res = await fetch('/api/assistant', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({
                    message: text,
                    context
                })
            });
            const response = await res.json();
            const updatedChat = [
                ...newChat,
                {
                    role: 'assistant',
                    text: response.text || 'Done.'
                }
            ];
            // Dispatch UI actions
            for (const act of response.actions || []){
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
                        items: (act.messages || []).map((m)=>({
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
                {
                    role: 'assistant',
                    text: `⚠️ ${err.message}`
                }
            ]);
        }
    };
    if (authRequired || errorMessage) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginView, {
            onLogin: handleOAuthLogin,
            errorMessage: errorMessage,
            onRetry: boot
        }, void 0, false, {
            fileName: "[project]/src/app/page.js",
            lineNumber: 302,
            columnNumber: 7
        }, this);
    }
    const shellClasses = [
        'shell',
        copilotOpen ? 'copilot-active' : ''
    ].filter(Boolean).join(' ');
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: shellClasses,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Rail, {
                folder: folder,
                copilotOpen: copilotOpen,
                onNavigate: handleNavigate,
                onToggleCopilot: ()=>setCopilotOpen(!copilotOpen),
                onRefresh: ()=>loadMessages(true)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 315,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Sidebar, {
                folder: folder,
                unreadCount: messages.filter((m)=>m.unread).length,
                onNavigate: handleNavigate,
                onCompose: ()=>setComposeData({
                        title: 'New Message'
                    }),
                syncMode: syncMode,
                lastSyncTime: lastSyncTime,
                onRefresh: ()=>loadMessages(true)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 324,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MailList, {
                folder: folder,
                messages: messages,
                currentMessage: currentMessage,
                unreadOnly: unreadOnly,
                searchQuery: searchQuery,
                onSearchChange: handleSearchChange,
                onToggleUnreadFilter: handleToggleUnread,
                onSelectMessage: openMessage,
                onLoadMore: ()=>loadMessages(false),
                hasMore: !!nextPageToken
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 335,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmailReader, {
                message: currentMessage,
                thread: thread,
                onReply: handleReply,
                onForward: handleForward,
                onBack: ()=>setCurrentMessage(null)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 349,
                columnNumber: 7
            }, this),
            copilotOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Copilot, {
                chatMessages: chatMessages,
                onSendMessage: handleCopilotSendMessage,
                onClose: ()=>setCopilotOpen(false),
                onSelectMessage: openMessage
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 359,
                columnNumber: 9
            }, this),
            composeData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ComposeModal, {
                initialData: composeData,
                onReviewSend: handleReviewSend,
                onClose: ()=>setComposeData(null)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 369,
                columnNumber: 9
            }, this),
            confirmData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfirmModal, {
                draft: confirmData,
                onConfirmSend: handleConfirmSend,
                onBackToEdit: ()=>{
                    setComposeData(confirmData);
                    setConfirmData(null);
                },
                onClose: ()=>setConfirmData(null)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 378,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/page.js",
        lineNumber: 313,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=_1xtfrw5._.js.map