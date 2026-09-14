import { useEffect, useMemo, useRef, useState } from "react";

import { toast } from "sonner";

import {
    ArrowUp,
    Bot,
    BriefcaseBusiness,
    Check,
    Clock3,
    Ellipsis,
    FileText,
    LoaderCircle,
    Menu,
    MessageCircle,
    Pencil,
    Plus,
    Search,
    Send,
    Sparkles,
    Trash2,
    User,
    X,
} from "lucide-react";

import useCoachConversation from "../hooks/useCoachConversation";

/* =========================================================
   HELPERS
========================================================= */

/* =========================================================
   AI MESSAGE FORMATTER
========================================================= */

/**
 * @Name normalizeAIText
 * @param {string} content
 * @description
 * Normalizes AI-generated text and removes common Markdown
 * artifacts before rendering it inside the chat UI.
 */
const normalizeAIText = (content) => {
    if (!content) {
        return "";
    }

    let text = String(content);

    /*
     * Convert literal escaped characters into real
     * whitespace characters.
     */
    text = text
        .replace(/\\r\\n/g, "\n")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\n")
        .replace(/\\t/g, "    ");

    /*
     * Remove code fences.
     */
    text = text.replace(
        /^```[a-zA-Z0-9_-]*\s*$/gm,
        ""
    );

    text = text.replace(
        /^```\s*$/gm,
        ""
    );

    /*
     * Remove Markdown heading symbols.
     */
    text = text.replace(
        /^\s*#{1,6}\s*/gm,
        ""
    );

    /*
     * Remove horizontal rules.
     */
    text = text.replace(
        /^\s*(?:\*{3,}|-{3,}|_{3,})\s*$/gm,
        ""
    );

    /*
     * Remove bold and italic markers.
     */
    text = text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/__(.*?)__/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/_(.*?)_/g, "$1");

    /*
     * Convert Markdown bullets to a consistent bullet.
     */
    text = text.replace(
        /^\s*[*+-]\s+/gm,
        "• "
    );

    /*
     * Clean excessive whitespace.
     */
    text = text
        .split("\n")
        .map((line) => line.trim())
        .join("\n");

    /*
     * Avoid huge vertical gaps.
     */
    text = text.replace(
        /\n{3,}/g,
        "\n\n"
    );

    return text.trim();
};


/**
 * @Name renderAIText
 * @param {string} content
 * @description
 * Converts normalized AI text into readable chat sections
 * while preserving paragraphs, bullets, and numbered lists.
 */
const renderAIText = (content) => {
    const text = normalizeAIText(content);

    if (!text) {
        return null;
    }

    const lines = text.split("\n");

    const elements = [];

    let paragraphLines = [];

    const flushParagraph = () => {
        if (!paragraphLines.length) {
            return;
        }

        const paragraph =
            paragraphLines.join(" ").trim();

        if (paragraph) {
            elements.push(
                <p
                    key={`paragraph-${elements.length}`}
                    className="whitespace-pre-wrap"
                >
                    {paragraph}
                </p>
            );
        }

        paragraphLines = [];
    };

    lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        /*
         * Empty line = end of paragraph.
         */
        if (!trimmedLine) {
            flushParagraph();
            return;
        }

        /*
         * Bullet list.
         */
        if (
            trimmedLine.startsWith("• ")
        ) {
            flushParagraph();

            elements.push(
                <div
                    key={`bullet-${index}`}
                    className="
                        flex
                        items-start
                        gap-2
                    "
                >
                    <span
                        className="
                            mt-[0.65em]
                            h-1.5
                            w-1.5
                            shrink-0
                            rounded-full
                        "
                        style={{
                            background:
                                "var(--primary)",
                        }}
                    />

                    <span className="min-w-0">
                        {trimmedLine.slice(2)}
                    </span>
                </div>
            );

            return;
        }

        /*
         * Numbered list.
         *
         * 1. React
         * 2. Node
         */
        const numberedMatch =
            trimmedLine.match(
                /^(\d+)\.\s+(.*)$/
            );

        if (numberedMatch) {
            flushParagraph();

            elements.push(
                <div
                    key={`number-${index}`}
                    className="
                        flex
                        items-start
                        gap-2.5
                    "
                >
                    <span
                        className="
                            flex
                            h-5
                            min-w-5
                            shrink-0
                            items-center
                            justify-center
                            rounded-md
                            px-1
                            text-[11px]
                            font-bold
                        "
                        style={{
                            background:
                                "var(--primary-fixed)",
                            color:
                                "var(--on-primary-fixed)",
                        }}
                    >
                        {numberedMatch[1]}
                    </span>

                    <span className="min-w-0">
                        {numberedMatch[2]}
                    </span>
                </div>
            );

            return;
        }

        /*
         * A short line ending with ":" is usually a
         * heading/sub-heading from the AI.
         *
         * Example:
         * "How Middleware Works:"
         */
        if (
            trimmedLine.endsWith(":") &&
            trimmedLine.length < 120
        ) {
            flushParagraph();

            elements.push(
                <p
                    key={`heading-${index}`}
                    className="
                        mt-1
                        font-semibold
                    "
                >
                    {trimmedLine}
                </p>
            );

            return;
        }

        /*
         * Normal paragraph text.
         */
        paragraphLines.push(trimmedLine);
    });

    flushParagraph();

    return (
        <div className="space-y-3">
            {elements}
        </div>
    );
};





const formatConversationDate = (date) => {
    if (!date) {
        return "Recently";
    }

    const conversationDate = new Date(date);
    const now = new Date();

    if (Number.isNaN(conversationDate.getTime())) {
        return "Recently";
    }

    const isToday =
        conversationDate.toDateString() ===
        now.toDateString();

    if (isToday) {
        return conversationDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "numeric",
                minute: "2-digit",
            }
        );
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (
        conversationDate.toDateString() ===
        yesterday.toDateString()
    ) {
        return "Yesterday";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
        }
    ).format(conversationDate);
};


const formatMessageTime = (date) => {
    if (!date) {
        return "";
    }

    const messageDate = new Date(date);

    if (Number.isNaN(messageDate.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            hour: "numeric",
            minute: "2-digit",
        }
    ).format(messageDate);
};


const getConversationPreview = (conversation) => {
    const messages =
        conversation?.messages || [];

    if (!messages.length) {
        return "Start a new career conversation";
    }

    const lastMessage =
        messages[messages.length - 1];

    return (
        lastMessage?.content ||
        "Start a new career conversation"
    );
};


const getMessageCount = (conversation) => {
    return conversation?.messages?.length || 0;
};


/* =========================================================
   COMPONENT
========================================================= */

const CareerCoach = () => {
    const {
        conversations,
        currentConversation,
        loading,
        getConversations,
        getConversation,
        createConversation,
        updateConversation,
        deleteConversation,
        sendCoachMessage,

        setCurrentConversation,
        clearError,
    } = useCoachConversation();


    /* =====================================================
       LOCAL STATE
    ===================================================== */

    const [searchQuery, setSearchQuery] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [isSending, setIsSending] =
        useState(false);

    /*
     * Keeps the user's latest message visible immediately
     * while the AI request is in progress.
     */
    const [pendingUserMessage, setPendingUserMessage] =
        useState("");

    const [isCreating, setIsCreating] =
        useState(false);

    const [isDeleting, setIsDeleting] =
        useState(false);

    const [isRenaming, setIsRenaming] =
        useState(false);

    const [renameValue, setRenameValue] =
        useState("");

    const [showConversationMenu, setShowConversationMenu] =
        useState(false);

    const [showMobileSidebar, setShowMobileSidebar] =
        useState(false);

    const [showDeleteModal, setShowDeleteModal] =
        useState(false);

    const [suggestions, setSuggestions] =
        useState([
            "How can I improve my resume?",
            "Help me prepare for an interview",
            "What skills should I learn next?",
        ]);


    const messagesEndRef =
        useRef(null);

    const textareaRef =
        useRef(null);


    /* =====================================================
       FETCH CONVERSATIONS
    ===================================================== */

    useEffect(() => {
        const loadConversations = async () => {
            try {
                await getConversations();
            } catch (requestError) {
                console.error(
                    "Failed to load coach conversations:",
                    requestError
                );
            }
        };

        loadConversations();
    }, []);


    /* =====================================================
       AUTO SCROLL
    ===================================================== */

    useEffect(() => {
        if (!currentConversation) {
            return;
        }

        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
        });
    }, [
        currentConversation?._id,
        currentConversation?.messages?.length,
        pendingUserMessage,
        isSending,
    ]);


    /* =====================================================
       FILTER CONVERSATIONS
    ===================================================== */

    const filteredConversations =
        useMemo(() => {
            const query =
                searchQuery
                    .trim()
                    .toLowerCase();

            if (!query) {
                return conversations;
            }

            return conversations.filter(
                (conversation) => {
                    const title =
                        String(
                            conversation.title || ""
                        ).toLowerCase();

                    const preview =
                        getConversationPreview(
                            conversation
                        ).toLowerCase();

                    return (
                        title.includes(query) ||
                        preview.includes(query)
                    );
                }
            );
        }, [
            conversations,
            searchQuery,
        ]);


    /* =====================================================
       NEW CONVERSATION
    ===================================================== */

    const handleNewConversation =
        async () => {
            if (
                isCreating ||
                isSending
            ) {
                return;
            }

            try {
                clearError?.();

                setIsCreating(true);

                const conversation =
                    await createConversation({
                        title: "New Conversation",
                    });

                if (conversation?._id) {
                    setCurrentConversation(
                        conversation
                    );

                    setMessage("");

                    setSuggestions([
                        "Tell me about your career goals",
                        "Help me improve my resume",
                        "How should I prepare for interviews?",
                    ]);

                    setShowConversationMenu(false);
                }

                setShowMobileSidebar(false);
            } catch (requestError) {
                console.error(
                    "Failed to create conversation:",
                    requestError
                );

                const errorMessage =
                    requestError?.response?.data?.message ||
                    "Unable to create a new conversation.";

                toast.error(errorMessage);
            } finally {
                setIsCreating(false);
            }
        };


    /* =====================================================
       OPEN CONVERSATION
    ===================================================== */

    const handleOpenConversation =
        async (conversation) => {
            if (!conversation?._id) {
                return;
            }

            try {
                clearError?.();

                setShowConversationMenu(false);

                await getConversation(
                    conversation._id
                );

                setShowMobileSidebar(false);

                setTimeout(() => {
                    messagesEndRef.current?.scrollIntoView({
                        behavior: "smooth",
                    });
                }, 100);
            } catch (requestError) {
                console.error(
                    "Failed to open conversation:",
                    requestError
                );

                const errorMessage =
                    requestError?.response?.data?.message ||
                    "Unable to open this conversation.";

                toast.error(errorMessage);
            }
        };


    /* =====================================================
       SEND MESSAGE
    ===================================================== */

    const handleSendMessage =
        async (event) => {
            event?.preventDefault();

            const trimmedMessage =
                message.trim();

            if (
                !trimmedMessage ||
                isSending
            ) {
                return;
            }

            /*
             * Clear the composer BEFORE making the request.
             * This makes the interaction feel like a real
             * chat application and gives the user immediate
             * feedback that the message was submitted.
             */
            setMessage("");
            setPendingUserMessage(trimmedMessage);
            setIsSending(true);

            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                });
            });

            try {
                clearError?.();

                /*
                 * The existing backend contract expects:
                 * conversationId + message.
                 */
                const response =
                    await sendCoachMessage({
                        conversationId:
                            currentConversation?._id,

                        message:
                            trimmedMessage,
                    });

                if (
                    response?.suggestions?.length
                ) {
                    setSuggestions(
                        response.suggestions
                    );
                }

                if (
                    response?.conversation
                ) {
                    setCurrentConversation(
                        response.conversation
                    );
                } else if (
                    response?.conversationId
                ) {
                    await getConversation(
                        response.conversationId
                    );
                }

                setPendingUserMessage("");

                requestAnimationFrame(() => {
                    messagesEndRef.current?.scrollIntoView({
                        behavior: "smooth",
                        block: "end",
                    });
                });
            } catch (requestError) {
                console.error(
                    "Failed to send coach message:",
                    requestError
                );

                /*
                 * Restore the message only when sending fails.
                 * This prevents the user's text from being lost.
                 */
                setMessage(trimmedMessage);
                setPendingUserMessage("");

                const errorMessage =
                    requestError?.response?.data?.message ||
                    "Unable to send your message. Please try again.";

                toast.error(errorMessage);
            } finally {
                setIsSending(false);
            }
        };


    /* =====================================================
       SUGGESTION
    ===================================================== */

    const handleSuggestionClick =
        (suggestion) => {
            setMessage(suggestion);

            requestAnimationFrame(() => {
                textareaRef.current?.focus();
            });
        };


    /* =====================================================
       TEXTAREA
    ===================================================== */

    const handleTextareaKeyDown =
        (event) => {
            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {
                event.preventDefault();

                handleSendMessage();
            }
        };


    /* =====================================================
       DELETE CONVERSATION
    ===================================================== */

    const handleDeleteConversation =
        async () => {
            if (
                !currentConversation?._id ||
                isDeleting
            ) {
                return;
            }

            try {
                setIsDeleting(true);
                clearError?.();

                const deletedId =
                    currentConversation._id;

                await deleteConversation(
                    deletedId
                );

                const remaining =
                    conversations.filter(
                        (conversation) =>
                            conversation._id !==
                            deletedId
                    );

                if (remaining.length > 0) {
                    await getConversation(
                        remaining[0]._id
                    );
                } else {
                    setCurrentConversation(
                        null
                    );
                }

                setShowConversationMenu(false);
                setShowDeleteModal(false);
                setMessage("");
            } catch (requestError) {
                console.error(
                    "Failed to delete conversation:",
                    requestError
                );

                const errorMessage =
                    requestError?.response?.data?.message ||
                    "Unable to delete this conversation.";

                toast.error(errorMessage);
            } finally {
                setIsDeleting(false);
            }
        };


    /* =====================================================
       RENAME CONVERSATION
    ===================================================== */

    const handleStartRename =
        () => {
            setRenameValue(
                currentConversation?.title ||
                "New Conversation"
            );

            setIsRenaming(true);
            setShowConversationMenu(false);
        };


    const handleSaveRename =
        async () => {
            const trimmedTitle =
                renameValue.trim();

            if (
                !trimmedTitle ||
                !currentConversation?._id
            ) {
                return;
            }

            try {
                clearError?.();

                await updateConversation(
                    currentConversation._id,
                    {
                        title: trimmedTitle,
                    }
                );

                setIsRenaming(false);
            } catch (requestError) {
                console.error(
                    "Failed to rename conversation:",
                    requestError
                );

                const errorMessage =
                    requestError?.response?.data?.message ||
                    "Unable to rename this conversation.";

                toast.error(errorMessage);
            }
        };


    /* =====================================================
       SELECTED CONVERSATION
    ===================================================== */

    const activeMessages =
        currentConversation?.messages || [];


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            className="
                relative
                flex
                h-[calc(100dvh-4.25rem)]
                min-h-0
                w-full
                min-w-0
                overflow-hidden
                overscroll-none
            "
            style={{
                background:
                    "var(--surface)",
            }}
        >

            {/* =================================================
                MOBILE SIDEBAR BACKDROP
            ================================================== */}

            {showMobileSidebar && (
                <button
                    type="button"
                    aria-label="Close conversations"
                    onClick={() =>
                        setShowMobileSidebar(false)
                    }
                    className="
                        fixed
                        inset-0
                        z-[70]
                        cursor-default
                        border-0
                        bg-black/35
                        p-0
                        backdrop-blur-[2px]
                        lg:hidden
                    "
                />
            )}


            {/* =================================================
                CONVERSATION SIDEBAR
            ================================================== */}

            <aside
                className={`
                    fixed
                    inset-y-0
                    left-0
                    z-[80]
                    flex
                    h-full
                    min-h-0
                    w-[min(88vw,340px)]
                    max-w-[calc(100vw-1rem)]
                    flex-col
                    border-r
                    shadow-2xl
                    transition-transform
                    duration-300
                    ease-out

                    lg:relative
                    lg:z-auto
                    lg:w-[300px]
                    lg:translate-x-0
                    lg:shrink-0
                    lg:shadow-none

                    ${showMobileSidebar
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }
                `}
                style={{
                    background:
                        "var(--surface-container-low)",
                    borderColor:
                        "var(--outline-variant)",
                }}
            >

                {/* =============================================
                    SIDEBAR HEADER
                ============================================== */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-between
                        gap-3
                        border-b
                        px-4
                        py-4
                    "
                    style={{
                        borderColor:
                            "var(--outline-variant)",
                    }}
                >
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                "
                                style={{
                                    background:
                                        "var(--primary-fixed)",
                                    color:
                                        "var(--on-primary-fixed)",
                                }}
                            >
                                <MessageCircle
                                    size={16}
                                />
                            </div>

                            <p
                                className="
                                    truncate
                                    text-sm
                                    font-bold
                                "
                                style={{
                                    fontFamily:
                                        "var(--font-heading)",
                                }}
                            >
                                Conversations
                            </p>
                        </div>

                        <p
                            className="
                                mt-1
                                pl-10
                                text-[11px]
                            "
                            style={{
                                color:
                                    "var(--on-surface-variant)",
                            }}
                        >
                            {conversations.length}{" "}
                            {conversations.length === 1
                                ? "conversation"
                                : "conversations"}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() =>
                            setShowMobileSidebar(false)
                        }
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            transition
                            hover:opacity-70
                            lg:hidden
                        "
                        style={{
                            background:
                                "var(--surface-container-high)",
                            color:
                                "var(--on-surface)",
                        }}
                    >
                        <X size={17} />
                    </button>
                </div>


                {/* =============================================
                    NEW CONVERSATION
                ============================================== */}

                <div className="px-4 pt-4">
                    <button
                        type="button"
                        onClick={
                            handleNewConversation
                        }
                        disabled={
                            isCreating ||
                            isSending
                        }
                        className="
                            flex
                            h-11
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            text-sm
                            font-bold
                            transition-all
                            hover:-translate-y-0.5
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                        style={{
                            background:
                                "var(--primary)",
                            color:
                                "var(--on-primary)",
                            boxShadow:
                                "var(--shadow-sm)",
                        }}
                    >
                        {isCreating ? (
                            <LoaderCircle
                                size={17}
                                className="animate-spin"
                            />
                        ) : (
                            <Plus size={17} />
                        )}

                        New conversation
                    </button>
                </div>


                {/* =============================================
                    SEARCH
                ============================================== */}

                <div className="px-4 py-4">
                    <div className="relative">
                        <Search
                            size={16}
                            className="
                                pointer-events-none
                                absolute
                                left-3.5
                                top-1/2
                                -translate-y-1/2
                            "
                            style={{
                                color:
                                    "var(--on-surface-variant)",
                            }}
                        />

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                            placeholder="Search conversations"
                            className="
                                h-10
                                w-full
                                rounded-xl
                                border
                                bg-transparent
                                pl-10
                                pr-3
                                text-xs
                                outline-none
                                transition
                                focus:ring-2
                            "
                            style={{
                                background:
                                    "var(--surface-container-lowest)",
                                color:
                                    "var(--on-surface)",
                                borderColor:
                                    "var(--outline-variant)",
                            }}
                        />
                    </div>
                </div>


                {/* =============================================
                    CONVERSATION LIST
                ============================================== */}

                <div
                    className="
                        min-h-0
                        flex-1
                        min-h-0
                        overflow-y-auto
                        overscroll-contain
                        touch-pan-y
                        px-3
                        pb-4
                    "
                >

                    {/* Loading */}

                    {loading &&
                        conversations.length === 0 && (
                            <div className="space-y-2">
                                {[1, 2, 3, 4, 5].map(
                                    (item) => (
                                        <ConversationSkeleton
                                            key={item}
                                        />
                                    )
                                )}
                            </div>
                        )}


                    {/* No conversations */}

                    {!loading &&
                        conversations.length === 0 && (
                            <ConversationEmptyState
                                onCreate={
                                    handleNewConversation
                                }
                            />
                        )}


                    {/* No search results */}

                    {conversations.length > 0 &&
                        filteredConversations.length === 0 && (
                            <div
                                className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    px-5
                                    py-14
                                    text-center
                                "
                            >
                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                    "
                                    style={{
                                        background:
                                            "var(--surface-container-high)",
                                        color:
                                            "var(--on-surface-variant)",
                                    }}
                                >
                                    <Search size={19} />
                                </div>

                                <p
                                    className="
                                        mt-4
                                        text-sm
                                        font-bold
                                    "
                                >
                                    No conversations found
                                </p>

                                <p
                                    className="
                                        mt-1
                                        max-w-[210px]
                                        text-xs
                                        leading-5
                                    "
                                    style={{
                                        color:
                                            "var(--on-surface-variant)",
                                    }}
                                >
                                    Try searching for a
                                    different title or
                                    message.
                                </p>
                            </div>
                        )}


                    {/* Conversation items */}

                    {filteredConversations.length > 0 && (
                        <div className="space-y-1">
                            {filteredConversations.map(
                                (conversation) => {
                                    const isActive =
                                        currentConversation?._id ===
                                        conversation._id;

                                    return (
                                        <button
                                            type="button"
                                            key={
                                                conversation._id
                                            }
                                            onClick={() =>
                                                handleOpenConversation(
                                                    conversation
                                                )
                                            }
                                            className="
                                                group
                                                w-full
                                                rounded-2xl
                                                p-3
                                                text-left
                                                transition-all
                                                hover:bg-[var(--surface-container-high)]
                                            "
                                            style={{
                                                background:
                                                    isActive
                                                        ? "var(--surface-container-high)"
                                                        : "transparent",
                                            }}
                                        >
                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                "
                                            >

                                                {/* Icon */}

                                                <div
                                                    className="
                                                        mt-0.5
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                    "
                                                    style={{
                                                        background:
                                                            isActive
                                                                ? "var(--primary)"
                                                                : "var(--primary-fixed)",
                                                        color:
                                                            isActive
                                                                ? "var(--on-primary)"
                                                                : "var(--on-primary-fixed)",
                                                    }}
                                                >
                                                    <MessageCircle
                                                        size={16}
                                                    />
                                                </div>


                                                {/* Content */}

                                                <div className="min-w-0 flex-1">

                                                    <div
                                                        className="
                                                            flex
                                                            items-start
                                                            justify-between
                                                            gap-2
                                                        "
                                                    >
                                                        <p
                                                            className="
                                                                min-w-0
                                                                truncate
                                                                text-sm
                                                                font-semibold
                                                            "
                                                            style={{
                                                                color:
                                                                    "var(--on-surface)",
                                                            }}
                                                        >
                                                            {conversation.title ||
                                                                "New Conversation"}
                                                        </p>

                                                        <span
                                                            className="
                                                                shrink-0
                                                                pt-0.5
                                                                text-[10px]
                                                            "
                                                            style={{
                                                                color:
                                                                    "var(--on-surface-variant)",
                                                            }}
                                                        >
                                                            {formatConversationDate(
                                                                conversation.lastMessageAt ||
                                                                conversation.updatedAt
                                                            )}
                                                        </span>
                                                    </div>


                                                    <p
                                                        className="
                                                            mt-1
                                                            line-clamp-2
                                                            text-xs
                                                            leading-5
                                                        "
                                                        style={{
                                                            color:
                                                                "var(--on-surface-variant)",
                                                        }}
                                                    >
                                                        {getConversationPreview(
                                                            conversation
                                                        )}
                                                    </p>


                                                    <div
                                                        className="
                                                            mt-2
                                                            flex
                                                            items-center
                                                            gap-1.5
                                                            text-[10px]
                                                            font-medium
                                                        "
                                                        style={{
                                                            color:
                                                                "var(--on-surface-variant)",
                                                        }}
                                                    >
                                                        <MessageCircle
                                                            size={11}
                                                        />

                                                        {getMessageCount(
                                                            conversation
                                                        )}{" "}
                                                        {getMessageCount(
                                                            conversation
                                                        ) === 1
                                                            ? "message"
                                                            : "messages"}
                                                    </div>

                                                </div>

                                            </div>
                                        </button>
                                    );
                                }
                            )}
                        </div>
                    )}

                </div>

            </aside>


            {/* =================================================
                MAIN CHAT
            ================================================== */}

            <main
                className="
                    flex
                    h-full
                    min-h-0
                    min-w-0
                    flex-1
                    flex-col
                    overflow-hidden
                "
                style={{
                    background:
                        "var(--surface-container-lowest)",
                }}
            >

                {/* =============================================
                    CHAT TOOLBAR
                ============================================== */}

                <header
                    className="
                        flex
                        min-h-[60px]
                        shrink-0
                        py-2
                        items-center
                        justify-between
                        gap-3
                        border-b
                        px-3
                        sm:px-5
                        lg:px-7
                    "
                    style={{
                        background:
                            "var(--surface-container-lowest)",
                        borderColor:
                            "var(--outline-variant)",
                    }}
                >

                    <div
                        className="
                            flex
                            min-w-0
                            items-center
                            gap-2.5
                            sm:gap-3
                        "
                    >

                        {/* Mobile sidebar button */}

                        <button
                            type="button"
                            onClick={() =>
                                setShowMobileSidebar(true)
                            }
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                transition
                                hover:opacity-75
                                lg:hidden
                            "
                            style={{
                                background:
                                    "var(--surface-container-high)",
                                color:
                                    "var(--on-surface)",
                            }}
                            aria-label="Open conversations"
                        >
                            <Menu size={19} />
                        </button>


                        {/* AI icon */}

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                            "
                            style={{
                                background:
                                    "var(--primary-fixed)",
                                color:
                                    "var(--on-primary-fixed)",
                            }}
                        >
                            <Sparkles size={18} />
                        </div>


                        {/* Title */}

                        <div className="min-w-0">

                            {isRenaming ? (
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <input
                                        autoFocus
                                        value={renameValue}
                                        maxLength={150}
                                        onChange={(event) =>
                                            setRenameValue(
                                                event.target.value
                                            )
                                        }
                                        onKeyDown={(event) => {
                                            if (
                                                event.key ===
                                                "Enter"
                                            ) {
                                                handleSaveRename();
                                            }

                                            if (
                                                event.key ===
                                                "Escape"
                                            ) {
                                                setIsRenaming(
                                                    false
                                                );
                                            }
                                        }}
                                        className="
                                            h-9
                                            min-w-0
                                            w-[180px]
                                            rounded-lg
                                            border
                                            bg-transparent
                                            px-3
                                            text-sm
                                            font-bold
                                            outline-none
                                            sm:w-[260px]
                                        "
                                        style={{
                                            background:
                                                "var(--surface-container-low)",
                                            borderColor:
                                                "var(--outline-variant)",
                                            color:
                                                "var(--on-surface)",
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            handleSaveRename
                                        }
                                        disabled={
                                            !renameValue.trim()
                                        }
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-lg
                                        "
                                        style={{
                                            background:
                                                "var(--primary)",
                                            color:
                                                "var(--on-primary)",
                                        }}
                                    >
                                        <Check size={16} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h1
                                        className="
                                            truncate
                                            text-sm
                                            font-bold
                                            sm:text-base
                                        "
                                        style={{
                                            fontFamily:
                                                "var(--font-heading)",
                                        }}
                                    >
                                        {currentConversation?.title ||
                                            "AI Career Coach"}
                                    </h1>

                                    <div
                                        className="
                                            mt-0.5
                                            flex
                                            items-center
                                            gap-1.5
                                            text-[10px]
                                            sm:text-[11px]
                                        "
                                        style={{
                                            color:
                                                "var(--on-surface-variant)",
                                        }}
                                    >
                                        <span
                                            className="
                                                h-1.5
                                                w-1.5
                                                rounded-full
                                            "
                                            style={{
                                                background:
                                                    "var(--secondary)",
                                            }}
                                        />

                                        AI Career Coach

                                        {currentConversation && (
                                            <>
                                                <span>•</span>
                                                <span>
                                                    {
                                                        activeMessages.length
                                                    }{" "}
                                                    {activeMessages.length ===
                                                        1
                                                        ? "message"
                                                        : "messages"}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </>
                            )}

                        </div>

                    </div>


                    {/* =========================================
                        CHAT ACTIONS
                    ========================================== */}

                    <div className="relative shrink-0">

                        <button
                            type="button"
                            onClick={() =>
                                setShowConversationMenu(
                                    (value) => !value
                                )
                            }
                            disabled={
                                !currentConversation ||
                                isRenaming
                            }
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                transition
                                hover:opacity-75
                                disabled:cursor-not-allowed
                                disabled:opacity-40
                            "
                            style={{
                                background:
                                    "var(--surface-container-high)",
                                color:
                                    "var(--on-surface)",
                            }}
                            aria-label="Conversation options"
                        >
                            <Ellipsis size={19} />
                        </button>


                        {showConversationMenu && (
                            <>
                                <button
                                    type="button"
                                    aria-label="Close menu"
                                    onClick={() =>
                                        setShowConversationMenu(
                                            false
                                        )
                                    }
                                    className="
                                        fixed
                                        inset-0
                                        z-[5]
                                        cursor-default
                                        border-0
                                        bg-transparent
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        right-0
                                        top-12
                                        z-10
                                        w-48
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        p-1.5
                                    "
                                    style={{
                                        background:
                                            "var(--surface-container-lowest)",
                                        borderColor:
                                            "var(--outline-variant)",
                                        boxShadow:
                                            "var(--shadow-lg)",
                                    }}
                                >

                                    <button
                                        type="button"
                                        onClick={
                                            handleStartRename
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-2.5
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-left
                                            text-sm
                                            font-medium
                                            transition
                                            hover:bg-black/5
                                        "
                                    >
                                        <Pencil size={15} />

                                        Rename
                                    </button>


                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowConversationMenu(
                                                false
                                            );
                                            setShowDeleteModal(
                                                true
                                            );
                                        }}
                                        disabled={
                                            isDeleting
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-2.5
                                            rounded-xl
                                            px-3
                                            py-2.5
                                            text-left
                                            text-sm
                                            font-medium
                                            transition
                                            hover:bg-red-500/5
                                        "
                                        style={{
                                            color:
                                                "var(--error)",
                                        }}
                                    >
                                        <Trash2 size={15} />

                                        Delete
                                    </button>

                                </div>
                            </>
                        )}

                    </div>

                </header>



                {/* =============================================
                    CHAT BODY
                ============================================== */}

                <div
                    className="
                        min-h-0
                        flex-1
                        w-full
                        overflow-x-hidden
                        overflow-y-auto
                        overscroll-contain
                        touch-pan-y
                        px-3
                        py-5
                        scrollbar-thin
                        sm:px-5
                        sm:py-7
                        lg:px-8
                        lg:py-8
                    "
                >

                    {!currentConversation ? (
                        <CoachWelcome
                            onSuggestion={
                                handleSuggestionClick
                            }
                            onNewConversation={
                                handleNewConversation
                            }
                        />
                    ) : (
                        <div
                            className="
                                mx-auto
                                flex
                                min-h-full
                                w-full
                                max-w-5xl
                                flex-col
                                justify-end
                            "
                        >
                            {activeMessages.length === 0 &&
                                !pendingUserMessage &&
                                !isSending ? (
                                <CoachConversationWelcome
                                    title={
                                        currentConversation.title ||
                                        "New Conversation"
                                    }
                                    onSuggestion={
                                        handleSuggestionClick
                                    }
                                />
                            ) : (
                                <div
                                    className="
                                        space-y-7
                                        pb-2
                                        sm:space-y-8
                                    "
                                >
                                    {activeMessages.map(
                                        (item, index) => (
                                            <CoachMessage
                                                key={
                                                    item._id ||
                                                    `${item.role}-${index}`
                                                }
                                                message={item}
                                            />
                                        )
                                    )}

                                    {/* Optimistic user message */}

                                    {pendingUserMessage && (
                                        <CoachMessage
                                            message={{
                                                role: "user",
                                                content:
                                                    pendingUserMessage,
                                                createdAt:
                                                    new Date().toISOString(),
                                            }}
                                        />
                                    )}

                                    {/* Typing indicator */}

                                    {isSending && (
                                        <TypingIndicator />
                                    )}

                                    <div
                                        ref={
                                            messagesEndRef
                                        }
                                        className="h-px"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                </div>


                {/* =============================================
                    SUGGESTIONS
                ============================================== */}

                {suggestions.length > 0 &&
                    !isSending && (
                        <div
                            className="
                                shrink-0
                                border-t
                                px-3
                                py-2.5
                                sm:px-5
                                lg:px-8
                            "
                            style={{
                                background:
                                    "var(--surface-container-lowest)",
                                borderColor:
                                    "var(--outline-variant)",
                            }}
                        >
                            <div
                                className="
                                    mx-auto
                                    flex
                                    w-full
                                    max-w-5xl
                                    gap-2
                                    overflow-x-auto
                                    pb-0.5
                                    scrollbar-none
                                "
                            >
                                {suggestions
                                    .slice(0, 4)
                                    .map(
                                        (
                                            suggestion
                                        ) => (
                                            <button
                                                key={
                                                    suggestion
                                                }
                                                type="button"
                                                onClick={() =>
                                                    handleSuggestionClick(
                                                        suggestion
                                                    )
                                                }
                                                className="
                                                    max-w-[280px]
                                                    shrink-0
                                                    rounded-full
                                                    border
                                                    px-3.5
                                                    py-2
                                                    text-xs
                                                    font-medium
                                                    transition-all
                                                    hover:-translate-y-0.5
                                                    hover:shadow-sm
                                                "
                                                style={{
                                                    background:
                                                        "var(--surface-container-low)",
                                                    borderColor:
                                                        "var(--outline-variant)",
                                                    color:
                                                        "var(--on-surface-variant)",
                                                }}
                                            >
                                                {suggestion}
                                            </button>
                                        )
                                    )}
                            </div>
                        </div>
                    )}


                {/* =============================================
                    MESSAGE COMPOSER
                ============================================== */}

                <div
                    className="
                        shrink-0
                        border-t
                        px-3
                        pb-[max(12px,env(safe-area-inset-bottom))]
                        pt-2.5
                        sm:px-5
                        sm:pb-3.5
                        sm:pt-3.5
                        lg:px-8
                    "
                    style={{
                        background:
                            "var(--surface-container-lowest)",
                        borderColor:
                            "var(--outline-variant)",
                    }}
                >
                    <form
                        onSubmit={
                            handleSendMessage
                        }
                        className="
                            mx-auto
                            w-full
                            max-w-5xl
                        "
                    >

                        <div
                            className="
                                relative
                                rounded-[22px]
                                border
                                p-2
                                transition
                                focus-within:ring-2
                            "
                            style={{
                                background:
                                    "var(--surface-container-low)",
                                borderColor:
                                    "var(--outline-variant)",
                            }}
                        >

                            <textarea
                                ref={
                                    textareaRef
                                }
                                value={message}
                                onChange={(event) =>
                                    setMessage(
                                        event.target.value
                                    )
                                }
                                onKeyDown={
                                    handleTextareaKeyDown
                                }
                                placeholder="Ask your career coach anything..."
                                rows={2}
                                disabled={
                                    isSending
                                }
                                className="
                                    block
                                    max-h-40
                                    min-h-[56px]
                                    w-full
                                    resize-none
                                    bg-transparent
                                    px-3
                                    py-2
                                    pr-12
                                    text-sm
                                    leading-6
                                    outline-none
                                    placeholder:text-[var(--on-surface-variant)]
                                    disabled:cursor-not-allowed
                                "
                                style={{
                                    color:
                                        "var(--on-surface)",
                                }}
                            />


                            <button
                                type="submit"
                                disabled={
                                    !message.trim() ||
                                    isSending
                                }
                                className="
                                    absolute
                                    bottom-2
                                    right-2
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    transition-all
                                    hover:-translate-y-0.5
                                    disabled:cursor-not-allowed
                                    disabled:hover:translate-y-0
                                "
                                style={{
                                    background:
                                        message.trim() &&
                                            !isSending
                                            ? "var(--primary)"
                                            : "var(--surface-container-high)",
                                    color:
                                        message.trim() &&
                                            !isSending
                                            ? "var(--on-primary)"
                                            : "var(--on-surface-variant)",
                                }}
                                aria-label="Send message"
                            >
                                {isSending ? (
                                    <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                    />
                                ) : (
                                    <ArrowUp
                                        size={18}
                                    />
                                )}
                            </button>

                        </div>


                        <div
                            className="
                                mt-2
                                flex
                                items-center
                                justify-between
                                gap-3
                                px-1
                            "
                        >
                            <p
                                className="
                                    min-w-0
                                    truncate
                                    text-[10px]
                                    sm:text-[11px]
                                "
                                style={{
                                    color:
                                        "var(--on-surface-variant)",
                                }}
                            >
                                AI-generated guidance may
                                not always be perfect.
                            </p>

                            <span
                                className="
                                    hidden
                                    shrink-0
                                    items-center
                                    gap-1
                                    text-[10px]
                                    sm:flex
                                "
                                style={{
                                    color:
                                        "var(--on-surface-variant)",
                                }}
                            >
                                <Send size={10} />

                                Enter to send
                            </span>
                        </div>

                    </form>
                </div>

            </main>


            {/* =================================================
                DELETE CONFIRMATION MODAL
            ================================================== */}

            {showDeleteModal && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[120]
                        flex
                        items-center
                        justify-center
                        bg-black/40
                        p-4
                        backdrop-blur-sm
                    "
                    onMouseDown={(event) => {
                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            setShowDeleteModal(false);
                        }
                    }}
                >
                    <div
                        className="
                            w-full
                            max-w-[420px]
                            overflow-hidden
                            rounded-3xl
                            border
                        "
                        style={{
                            background:
                                "var(--surface-container-lowest)",
                            borderColor:
                                "var(--outline-variant)",
                            boxShadow:
                                "var(--shadow-lg)",
                        }}
                    >
                        <div className="p-5 sm:p-6">

                            <div
                                className="
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-xl
                                "
                                style={{
                                    background:
                                        "var(--error-container)",
                                    color:
                                        "var(--error)",
                                }}
                            >
                                <Trash2 size={19} />
                            </div>

                            <h2
                                className="
                                    mt-5
                                    text-lg
                                    font-bold
                                "
                                style={{
                                    fontFamily:
                                        "var(--font-heading)",
                                }}
                            >
                                Delete conversation?
                            </h2>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                "
                                style={{
                                    color:
                                        "var(--on-surface-variant)",
                                }}
                            >
                                This will permanently
                                delete this conversation
                                and its messages. This
                                action cannot be undone.
                            </p>

                            <div
                                className="
                                    mt-6
                                    flex
                                    flex-col-reverse
                                    gap-2
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowDeleteModal(
                                            false
                                        )
                                    }
                                    disabled={
                                        isDeleting
                                    }
                                    className="
                                        h-10
                                        rounded-xl
                                        border
                                        px-4
                                        text-sm
                                        font-semibold
                                    "
                                    style={{
                                        background:
                                            "var(--surface-container-low)",
                                        borderColor:
                                            "var(--outline-variant)",
                                        color:
                                            "var(--on-surface)",
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleDeleteConversation
                                    }
                                    disabled={
                                        isDeleting
                                    }
                                    className="
                                        flex
                                        h-10
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        px-4
                                        text-sm
                                        font-bold
                                    "
                                    style={{
                                        background:
                                            "var(--error)",
                                        color:
                                            "var(--on-error)",
                                    }}
                                >
                                    {isDeleting && (
                                        <LoaderCircle
                                            size={15}
                                            className="animate-spin"
                                        />
                                    )}

                                    Delete conversation
                                </button>
                            </div>

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};


/* =========================================================
   WELCOME STATE
========================================================= */

const CoachWelcome = ({
    onSuggestion,
    onNewConversation,
}) => {
    const suggestions = [
        {
            icon: FileText,
            title: "Improve my resume",
            text:
                "Review my resume and tell me what I can improve.",
        },
        {
            icon: BriefcaseBusiness,
            title: "Prepare for a job",
            text:
                "Help me prepare for my target role.",
        },
        {
            icon: MessageCircle,
            title: "Interview preparation",
            text:
                "How should I prepare for my next interview?",
        },
        {
            icon: Sparkles,
            title: "Career direction",
            text:
                "Help me decide what skills I should focus on next.",
        },
    ];

    return (
        <div
            className="
                flex
                min-h-full
                w-full
                items-center
                justify-center
                py-5
                sm:py-7
                lg:py-5
            "
        >
            <div
                className="
                    w-full
                    max-w-3xl
                    px-1
                    text-center
                "
            >

                {/* AI icon */}

                <div
                    className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-[22px]
                        sm:h-20
                        sm:w-20
                        sm:rounded-[26px]
                    "
                    style={{
                        background:
                            "var(--primary-fixed)",
                        color:
                            "var(--on-primary-fixed)",
                    }}
                >
                    <Sparkles
                        size={29}
                        className="sm:hidden"
                    />

                    <Sparkles
                        size={35}
                        className="hidden sm:block"
                    />
                </div>


                <p
                    className="
                        mt-6
                        text-[10px]
                        font-bold
                        tracking-[0.16em]
                        sm:text-xs
                    "
                    style={{
                        color:
                            "var(--primary)",
                    }}
                >
                    YOUR AI CAREER COACH
                </p>


                <h2
                    className="
                        mt-3
                        text-2xl
                        font-bold
                        tracking-tight
                        sm:text-3xl
                        lg:text-4xl
                    "
                    style={{
                        fontFamily:
                            "var(--font-heading)",
                    }}
                >
                    What can I help you with?
                </h2>


                <p
                    className="
                        mx-auto
                        mt-3
                        text-sm
                        leading-6
                        sm:text-[15px]
                    "
                    style={{
                        color:
                            "var(--on-surface-variant)",
                    }}
                >
                    Get personalized guidance for
                    your resume, interviews, skills,
                    job search, and career growth.
                </p>


                {/* Suggestion cards */}

                <div
                    className="
                        mt-5
                        grid
                        gap-2.5
                        text-left
                        sm:mt-8
                        sm:grid-cols-2
                    "
                >
                    {suggestions.map(
                        (item) => {
                            const Icon =
                                item.icon;

                            return (
                                <button
                                    type="button"
                                    key={item.title}
                                    onClick={() =>
                                        onSuggestion(
                                            item.text
                                        )
                                    }
                                    className="
                                        group
                                        rounded-2xl
                                        border
                                        p-4
                                        transition-all
                                        hover:-translate-y-0.5
                                        hover:shadow-sm
                                        active:translate-y-0
                                    "
                                    style={{
                                        background:
                                            "var(--surface-container-low)",
                                        borderColor:
                                            "var(--outline-variant)",
                                    }}
                                >
                                    <div
                                        className="
                                            flex
                                            items-start
                                            gap-3
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                            "
                                            style={{
                                                background:
                                                    "var(--primary-fixed)",
                                                color:
                                                    "var(--on-primary-fixed)",
                                            }}
                                        >
                                            <Icon
                                                size={17}
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <p
                                                className="
                                                    text-sm
                                                    font-bold
                                                "
                                            >
                                                {item.title}
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    leading-5
                                                "
                                                style={{
                                                    color:
                                                        "var(--on-surface-variant)",
                                                }}
                                            >
                                                {item.text}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            );
                        }
                    )}
                </div>


                <button
                    type="button"
                    onClick={
                        onNewConversation
                    }
                    className="
                        mt-5
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        px-5
                        py-3
                        text-sm
                        font-bold
                        transition
                        hover:-translate-y-0.5
                        sm:mt-8
                    "
                    style={{
                        background:
                            "var(--primary)",
                        color:
                            "var(--on-primary)",
                    }}
                >
                    <Plus size={17} />

                    Start a conversation
                </button>

            </div>
        </div>
    );
};


/* =========================================================
   EMPTY CONVERSATION WELCOME
========================================================= */

const CoachConversationWelcome = ({
    title,
    onSuggestion,
}) => {
    const suggestions = [
        "Tell me how I can improve my career prospects.",
        "Help me prepare for an upcoming interview.",
        "What skills should I learn for my target role?",
    ];

    return (
        <div
            className="
                flex
                min-h-full
                w-full
                items-center
                justify-center
                py-5
            "
        >
            <div
                className="
                    w-full
                    max-w-2xl
                    px-2
                    text-center
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                    "
                    style={{
                        background:
                            "var(--primary-fixed)",
                        color:
                            "var(--on-primary-fixed)",
                    }}
                >
                    <Bot size={27} />
                </div>


                <h3
                    className="
                        mt-5
                        break-words
                        text-xl
                        font-bold
                        sm:text-2xl
                    "
                    style={{
                        fontFamily:
                            "var(--font-heading)",
                    }}
                >
                    {title}
                </h3>


                <p
                    className="
                        mx-auto
                        mt-2
                        text-sm
                        leading-6
                    "
                    style={{
                        color:
                            "var(--on-surface-variant)",
                    }}
                >
                    I'm ready to help. Ask me anything
                    about your career, job search,
                    interviews, skills, or professional
                    growth.
                </p>


                <div
                    className="
                        mt-7
                        flex
                        flex-wrap
                        justify-center
                        gap-2
                    "
                >
                    {suggestions.map(
                        (suggestion) => (
                            <button
                                type="button"
                                key={suggestion}
                                onClick={() =>
                                    onSuggestion(
                                        suggestion
                                    )
                                }
                                className="
                                    rounded-full
                                    border
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-medium
                                    transition-all
                                    hover:-translate-y-0.5
                                    hover:shadow-sm
                                "
                                style={{
                                    background:
                                        "var(--surface-container-low)",
                                    borderColor:
                                        "var(--outline-variant)",
                                    color:
                                        "var(--on-surface-variant)",
                                }}
                            >
                                {suggestion}
                            </button>
                        )
                    )}
                </div>

            </div>
        </div>
    );
};


/* =========================================================
   MESSAGE
========================================================= */

const CoachMessage = ({
    message,
}) => {
    const isUser =
        message.role === "user";

    return (
        <div
            className={`
                flex
                w-full
                items-start
                gap-2.5
                sm:gap-3
                ${isUser
                    ? "justify-end"
                    : "justify-start"
                }
            `}
        >

            {/* AI avatar */}

            {!isUser && (
                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                    "
                    style={{
                        background:
                            "var(--primary-fixed)",
                        color:
                            "var(--on-primary-fixed)",
                    }}
                >
                    <Bot size={17} />
                </div>
            )}


            {/* Message content */}

            <div
                className={`
                    min-w-0
                    ${isUser
                        ? "max-w-[88%] sm:max-w-[78%]"
                        : "max-w-[calc(100%-48px)] sm:max-w-[82%]"
                    }
                `}
            >

                <div
                    className="
                        rounded-[20px]
                        px-4
                        py-3
                        text-sm
                        leading-7
                        sm:px-5
                        sm:py-3.5
                    "
                    style={{
                        background:
                            isUser
                                ? "var(--primary)"
                                : "var(--surface-container-low)",
                        color:
                            isUser
                                ? "var(--on-primary)"
                                : "var(--on-surface)",
                        border:
                            isUser
                                ? "none"
                                : "1px solid var(--outline-variant)",
                        borderTopLeftRadius:
                            isUser
                                ? "20px"
                                : "7px",
                        borderTopRightRadius:
                            isUser
                                ? "7px"
                                : "20px",
                    }}
                >
                    <div
                        className="
                            whitespace-pre-wrap
                            break-words
                        "
                    >
                        {renderAIText(message.content)}
                    </div>
                </div>


                {/* Message metadata */}

                <div
                    className={`
                        mt-1.5
                        flex
                        items-center
                        gap-1.5
                        px-1
                        text-[10px]
                        ${isUser
                            ? "justify-end"
                            : "justify-start"
                        }
                    `}
                    style={{
                        color:
                            "var(--on-surface-variant)",
                    }}
                >
                    {isUser ? (
                        <>
                            <span>You</span>
                            <User size={10} />
                        </>
                    ) : (
                        <>
                            <Bot size={10} />
                            <span>
                                AI Career Coach
                            </span>
                        </>
                    )}

                    {message.createdAt && (
                        <>
                            <span>•</span>

                            <Clock3 size={9} />

                            <span>
                                {formatMessageTime(
                                    message.createdAt
                                )}
                            </span>
                        </>
                    )}
                </div>

            </div>


            {/* User avatar */}

            {isUser && (
                <div
                    className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                    "
                    style={{
                        background:
                            "var(--surface-container-high)",
                        color:
                            "var(--on-surface)",
                    }}
                >
                    <User size={17} />
                </div>
            )}

        </div>
    );
};


/* =========================================================
   TYPING INDICATOR
========================================================= */

const TypingIndicator = () => {
    return (
        <div
            className="
                flex
                items-start
                gap-2.5
                sm:gap-3
            "
        >
            <div
                className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                "
                style={{
                    background:
                        "var(--primary-fixed)",
                    color:
                        "var(--on-primary-fixed)",
                }}
            >
                <Bot size={17} />
            </div>

            <div
                className="
                    flex
                    h-12
                    items-center
                    gap-1.5
                    rounded-[20px]
                    rounded-tl-[7px]
                    border
                    px-4
                "
                style={{
                    background:
                        "var(--surface-container-low)",
                    borderColor:
                        "var(--outline-variant)",
                }}
            >
                {[0, 120, 240].map(
                    (delay) => (
                        <span
                            key={delay}
                            className="
                                h-1.5
                                w-1.5
                                animate-bounce
                                rounded-full
                            "
                            style={{
                                background:
                                    "var(--primary)",
                                animationDelay:
                                    `${delay}ms`,
                            }}
                        />
                    )
                )}
            </div>
        </div>
    );
};


/* =========================================================
   EMPTY SIDEBAR STATE
========================================================= */

const ConversationEmptyState = ({
    onCreate,
}) => {
    return (
        <div
            className="
                flex
                flex-col
                items-center
                px-4
                py-12
                text-center
            "
        >
            <div
                className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-xl
                "
                style={{
                    background:
                        "var(--primary-fixed)",
                    color:
                        "var(--on-primary-fixed)",
                }}
            >
                <MessageCircle size={20} />
            </div>


            <p
                className="
                    mt-4
                    text-sm
                    font-bold
                "
            >
                No conversations yet
            </p>


            <p
                className="
                    mt-1
                    max-w-[210px]
                    text-xs
                    leading-5
                "
                style={{
                    color:
                        "var(--on-surface-variant)",
                }}
            >
                Start your first conversation
                with the AI career coach.
            </p>


            <button
                type="button"
                onClick={onCreate}
                className="
                    mt-4
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-xl
                    px-3
                    py-2
                    text-xs
                    font-bold
                "
                style={{
                    background:
                        "var(--primary)",
                    color:
                        "var(--on-primary)",
                }}
            >
                <Plus size={14} />

                Start chatting
            </button>
        </div>
    );
};


/* =========================================================
   SKELETON
========================================================= */

const ConversationSkeleton = () => {
    return (
        <div
            className="
                animate-pulse
                rounded-2xl
                p-3
            "
        >
            <div className="flex gap-3">

                <div
                    className="
                        h-9
                        w-9
                        shrink-0
                        rounded-xl
                    "
                    style={{
                        background:
                            "var(--surface-container-high)",
                    }}
                />

                <div className="flex-1">

                    <div
                        className="
                            h-3
                            w-3/4
                            rounded-full
                        "
                        style={{
                            background:
                                "var(--surface-container-high)",
                        }}
                    />

                    <div
                        className="
                            mt-2
                            h-2.5
                            w-full
                            rounded-full
                        "
                        style={{
                            background:
                                "var(--surface-container-high)",
                        }}
                    />

                    <div
                        className="
                            mt-2
                            h-2.5
                            w-1/2
                            rounded-full
                        "
                        style={{
                            background:
                                "var(--surface-container-high)",
                        }}
                    />

                </div>

            </div>
        </div>
    );
};


export default CareerCoach;