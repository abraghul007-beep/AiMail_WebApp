(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
/**
 * @license React
 * react-jsx-dev-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */ "use strict";
"production" !== ("TURBOPACK compile-time value", "development") && function() {
    function getComponentNameFromType(type) {
        if (null == type) return null;
        if ("function" === typeof type) return type.$$typeof === REACT_CLIENT_REFERENCE ? null : type.displayName || type.name || null;
        if ("string" === typeof type) return type;
        switch(type){
            case REACT_FRAGMENT_TYPE:
                return "Fragment";
            case REACT_PROFILER_TYPE:
                return "Profiler";
            case REACT_STRICT_MODE_TYPE:
                return "StrictMode";
            case REACT_SUSPENSE_TYPE:
                return "Suspense";
            case REACT_SUSPENSE_LIST_TYPE:
                return "SuspenseList";
            case REACT_ACTIVITY_TYPE:
                return "Activity";
            case REACT_VIEW_TRANSITION_TYPE:
                return "ViewTransition";
        }
        if ("object" === typeof type) switch("number" === typeof type.tag && console.error("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), type.$$typeof){
            case REACT_PORTAL_TYPE:
                return "Portal";
            case REACT_CONTEXT_TYPE:
                return type.displayName || "Context";
            case REACT_CONSUMER_TYPE:
                return (type._context.displayName || "Context") + ".Consumer";
            case REACT_FORWARD_REF_TYPE:
                var innerType = type.render;
                type = type.displayName;
                type || (type = innerType.displayName || innerType.name || "", type = "" !== type ? "ForwardRef(" + type + ")" : "ForwardRef");
                return type;
            case REACT_MEMO_TYPE:
                return innerType = type.displayName || null, null !== innerType ? innerType : getComponentNameFromType(type.type) || "Memo";
            case REACT_LAZY_TYPE:
                innerType = type._payload;
                type = type._init;
                try {
                    return getComponentNameFromType(type(innerType));
                } catch (x) {}
        }
        return null;
    }
    function testStringCoercion(value) {
        return "" + value;
    }
    function checkKeyStringCoercion(value) {
        try {
            testStringCoercion(value);
            var JSCompiler_inline_result = !1;
        } catch (e) {
            JSCompiler_inline_result = !0;
        }
        if (JSCompiler_inline_result) {
            JSCompiler_inline_result = console;
            var JSCompiler_temp_const = JSCompiler_inline_result.error;
            var JSCompiler_inline_result$jscomp$0 = "function" === typeof Symbol && Symbol.toStringTag && value[Symbol.toStringTag] || value.constructor.name || "Object";
            JSCompiler_temp_const.call(JSCompiler_inline_result, "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.", JSCompiler_inline_result$jscomp$0);
            return testStringCoercion(value);
        }
    }
    function getTaskName(type) {
        if (type === REACT_FRAGMENT_TYPE) return "<>";
        if ("object" === typeof type && null !== type && type.$$typeof === REACT_LAZY_TYPE) return "<...>";
        try {
            var name = getComponentNameFromType(type);
            return name ? "<" + name + ">" : "<...>";
        } catch (x) {
            return "<...>";
        }
    }
    function getOwner() {
        var dispatcher = ReactSharedInternals.A;
        return null === dispatcher ? null : dispatcher.getOwner();
    }
    function UnknownOwner() {
        return Error("react-stack-top-frame");
    }
    function hasValidKey(config) {
        if (hasOwnProperty.call(config, "key")) {
            var getter = Object.getOwnPropertyDescriptor(config, "key").get;
            if (getter && getter.isReactWarning) return !1;
        }
        return void 0 !== config.key;
    }
    function defineKeyPropWarningGetter(props, displayName) {
        function warnAboutAccessingKey() {
            specialPropKeyWarningShown || (specialPropKeyWarningShown = !0, console.error("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)", displayName));
        }
        warnAboutAccessingKey.isReactWarning = !0;
        Object.defineProperty(props, "key", {
            get: warnAboutAccessingKey,
            configurable: !0
        });
    }
    function elementRefGetterWithDeprecationWarning() {
        var componentName = getComponentNameFromType(this.type);
        didWarnAboutElementRef[componentName] || (didWarnAboutElementRef[componentName] = !0, console.error("Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."));
        componentName = this.props.ref;
        return void 0 !== componentName ? componentName : null;
    }
    function ReactElement(type, key, props, owner, debugStack, debugTask) {
        var refProp = props.ref;
        type = {
            $$typeof: REACT_ELEMENT_TYPE,
            type: type,
            key: key,
            props: props,
            _owner: owner
        };
        null !== (void 0 !== refProp ? refProp : null) ? Object.defineProperty(type, "ref", {
            enumerable: !1,
            get: elementRefGetterWithDeprecationWarning
        }) : Object.defineProperty(type, "ref", {
            enumerable: !1,
            value: null
        });
        type._store = {};
        Object.defineProperty(type._store, "validated", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: 0
        });
        Object.defineProperty(type, "_debugInfo", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: null
        });
        Object.defineProperty(type, "_debugStack", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugStack
        });
        Object.defineProperty(type, "_debugTask", {
            configurable: !1,
            enumerable: !1,
            writable: !0,
            value: debugTask
        });
        Object.freeze && (Object.freeze(type.props), Object.freeze(type));
        return type;
    }
    function jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStack, debugTask) {
        var children = config.children;
        if (void 0 !== children) if (isStaticChildren) if (isArrayImpl(children)) {
            for(isStaticChildren = 0; isStaticChildren < children.length; isStaticChildren++)validateChildKeys(children[isStaticChildren]);
            Object.freeze && Object.freeze(children);
        } else console.error("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
        else validateChildKeys(children);
        if (hasOwnProperty.call(config, "key")) {
            children = getComponentNameFromType(type);
            var keys = Object.keys(config).filter(function(k) {
                return "key" !== k;
            });
            isStaticChildren = 0 < keys.length ? "{key: someKey, " + keys.join(": ..., ") + ": ...}" : "{key: someKey}";
            didWarnAboutKeySpread[children + isStaticChildren] || (keys = 0 < keys.length ? "{" + keys.join(": ..., ") + ": ...}" : "{}", console.error('A props object containing a "key" prop is being spread into JSX:\n  let props = %s;\n  <%s {...props} />\nReact keys must be passed directly to JSX without using spread:\n  let props = %s;\n  <%s key={someKey} {...props} />', isStaticChildren, children, keys, children), didWarnAboutKeySpread[children + isStaticChildren] = !0);
        }
        children = null;
        void 0 !== maybeKey && (checkKeyStringCoercion(maybeKey), children = "" + maybeKey);
        hasValidKey(config) && (checkKeyStringCoercion(config.key), children = "" + config.key);
        if ("key" in config) {
            maybeKey = {};
            for(var propName in config)"key" !== propName && (maybeKey[propName] = config[propName]);
        } else maybeKey = config;
        children && defineKeyPropWarningGetter(maybeKey, "function" === typeof type ? type.displayName || type.name || "Unknown" : type);
        return ReactElement(type, children, maybeKey, getOwner(), debugStack, debugTask);
    }
    function validateChildKeys(node) {
        isValidElement(node) ? node._store && (node._store.validated = 1) : "object" === typeof node && null !== node && node.$$typeof === REACT_LAZY_TYPE && ("fulfilled" === node._payload.status ? isValidElement(node._payload.value) && node._payload.value._store && (node._payload.value._store.validated = 1) : node._store && (node._store.validated = 1));
    }
    function isValidElement(object) {
        return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
    }
    var React = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)"), REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_PORTAL_TYPE = Symbol.for("react.portal"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment"), REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode"), REACT_PROFILER_TYPE = Symbol.for("react.profiler"), REACT_CONSUMER_TYPE = Symbol.for("react.consumer"), REACT_CONTEXT_TYPE = Symbol.for("react.context"), REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref"), REACT_SUSPENSE_TYPE = Symbol.for("react.suspense"), REACT_SUSPENSE_LIST_TYPE = Symbol.for("react.suspense_list"), REACT_MEMO_TYPE = Symbol.for("react.memo"), REACT_LAZY_TYPE = Symbol.for("react.lazy"), REACT_ACTIVITY_TYPE = Symbol.for("react.activity"), REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition"), REACT_CLIENT_REFERENCE = Symbol.for("react.client.reference"), ReactSharedInternals = React.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, hasOwnProperty = Object.prototype.hasOwnProperty, isArrayImpl = Array.isArray, createTask = console.createTask ? console.createTask : function() {
        return null;
    };
    React = {
        react_stack_bottom_frame: function(callStackForError) {
            return callStackForError();
        }
    };
    var specialPropKeyWarningShown;
    var didWarnAboutElementRef = {};
    var unknownOwnerDebugStack = React.react_stack_bottom_frame.bind(React, UnknownOwner)();
    var unknownOwnerDebugTask = createTask(getTaskName(UnknownOwner));
    var didWarnAboutKeySpread = {};
    exports.Fragment = REACT_FRAGMENT_TYPE;
    exports.jsxDEV = function(type, config, maybeKey, isStaticChildren) {
        var trackActualOwner = 1e4 > ReactSharedInternals.recentlyCreatedOwnerStacks++;
        if (trackActualOwner) {
            var previousStackTraceLimit = Error.stackTraceLimit;
            Error.stackTraceLimit = 10;
            var debugStackDEV = Error("react-stack-top-frame");
            Error.stackTraceLimit = previousStackTraceLimit;
        } else debugStackDEV = unknownOwnerDebugStack;
        return jsxDEVImpl(type, config, maybeKey, isStaticChildren, debugStackDEV, trackActualOwner ? createTask(getTaskName(type)) : unknownOwnerDebugTask);
    };
}();
}),
"[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
'use strict';
if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
;
else {
    module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/cjs/react-jsx-dev-runtime.development.js [app-client] (ecmascript)");
}
}),
"[project]/src/app/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WorkspacePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
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
;
var _s = __turbopack_context__.k.signature();
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
function WorkspacePage() {
    _s();
    const [authRequired, setAuthRequired] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [errorMessage, setErrorMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [syncMode, setSyncMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('Push + fallback sync');
    const [lastSyncTime, setLastSyncTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [folder, setFolder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('INBOX');
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [nextPageToken, setNextPageToken] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [unreadOnly, setUnreadOnly] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [currentMessage, setCurrentMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [thread, setThread] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [copilotOpen, setCopilotOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [chatMessages, setChatMessages] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([
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
    const [composeData, setComposeData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // null | { to, cc, subject, body, title }
    const [confirmData, setConfirmData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null); // null | { to, cc, subject, body }
    const loadMessages = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkspacePage.useCallback[loadMessages]": async (reset = false, customParams = {})=>{
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
        }
    }["WorkspacePage.useCallback[loadMessages]"], [
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
    const boot = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "WorkspacePage.useCallback[boot]": async ()=>{
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
        }
    }["WorkspacePage.useCallback[boot]"], [
        loadMessages
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "WorkspacePage.useEffect": ()=>{
            boot();
        }
    }["WorkspacePage.useEffect"], [
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginView, {
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: shellClasses,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Rail, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Sidebar, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MailList, {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(EmailReader, {
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
            copilotOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Copilot, {
                chatMessages: chatMessages,
                onSendMessage: handleCopilotSendMessage,
                onClose: ()=>setCopilotOpen(false),
                onSelectMessage: openMessage
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 359,
                columnNumber: 9
            }, this),
            composeData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ComposeModal, {
                initialData: composeData,
                onReviewSend: handleReviewSend,
                onClose: ()=>setComposeData(null)
            }, void 0, false, {
                fileName: "[project]/src/app/page.js",
                lineNumber: 369,
                columnNumber: 9
            }, this),
            confirmData && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ConfirmModal, {
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
_s(WorkspacePage, "MUoWU0bfdoXgkCM/CZr2nL9Ntr0=");
_c = WorkspacePage;
var _c;
__turbopack_context__.k.register(_c, "WorkspacePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_120khmf._.js.map