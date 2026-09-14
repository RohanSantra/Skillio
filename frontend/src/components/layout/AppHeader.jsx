import { useEffect, useMemo, useRef, useState } from "react";

import {
    Menu,
    Search,
    Bell,
    Plus,
    X,
    LayoutDashboard,
    UserRound,
    BriefcaseBusiness,
    FileText,
    BrainCircuit,
    Video,
    Bot,
    Send,
    Settings,
    ArrowRight,
    Command,
} from "lucide-react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";


/* =========================================================
   PAGE TITLES
========================================================= */

const pageTitleMap = [
    {
        path: "/dashboard",
        title: "Dashboard",
    },
    {
        path: "/career-profile",
        title: "Career Profile",
    },
    {
        path: "/job-workspaces",
        title: "Job Workspaces",
    },
    {
        path: "/resumes",
        title: "Resumes",
    },
    {
        path: "/preparation",
        title: "Preparation",
    },
    {
        path: "/interviews",
        title: "Interviews",
    },
    {
        path: "/career-coach",
        title: "Career Coach",
    },
    {
        path: "/applications",
        title: "Applications",
    },
    {
        path: "/settings",
        title: "Settings",
    },
];


/* =========================================================
   GLOBAL SEARCH INDEX
========================================================= */

const searchItems = [
    {
        id: "dashboard",
        title: "Dashboard",
        description: "Overview of your career activity",
        keywords: [
            "home",
            "overview",
            "career",
            "activity",
        ],
        path: "/dashboard",
        icon: LayoutDashboard,
        category: "Navigation",
    },

    {
        id: "career-profile",
        title: "Career Profile",
        description: "Manage your skills, experience and career information",
        keywords: [
            "profile",
            "skills",
            "experience",
            "career",
            "personal",
        ],
        path: "/career-profile",
        icon: UserRound,
        category: "Navigation",
    },

    {
        id: "job-workspaces",
        title: "Job Workspaces",
        description: "Organize jobs and tailor your applications",
        keywords: [
            "jobs",
            "job",
            "roles",
            "vacancies",
            "workspace",
            "position",
        ],
        path: "/job-workspaces",
        icon: BriefcaseBusiness,
        category: "Navigation",
    },

    {
        id: "resumes",
        title: "Resumes",
        description: "Create and manage your resumes",
        keywords: [
            "resume",
            "cv",
            "curriculum",
            "document",
        ],
        path: "/resumes",
        icon: FileText,
        category: "Navigation",
    },

    {
        id: "preparation",
        title: "Preparation",
        description: "Prepare for roles, assessments and interviews",
        keywords: [
            "prepare",
            "preparation",
            "study",
            "assessment",
            "questions",
        ],
        path: "/preparation",
        icon: BrainCircuit,
        category: "Navigation",
    },

    {
        id: "interviews",
        title: "Interviews",
        description: "Practice interviews and review your performance",
        keywords: [
            "interview",
            "mock",
            "practice",
            "questions",
            "practice interview",
        ],
        path: "/interviews",
        icon: Video,
        category: "Navigation",
    },

    {
        id: "career-coach",
        title: "Career Coach",
        description: "Get AI-powered career guidance",
        keywords: [
            "ai",
            "coach",
            "career coach",
            "help",
            "advice",
        ],
        path: "/career-coach",
        icon: Bot,
        category: "Navigation",
    },

    {
        id: "applications",
        title: "Applications",
        description: "Track your job applications",
        keywords: [
            "application",
            "applications",
            "applied",
            "tracking",
            "jobs",
        ],
        path: "/applications",
        icon: Send,
        category: "Navigation",
    },

    {
        id: "settings",
        title: "Settings",
        description: "Manage your Skillio preferences",
        keywords: [
            "settings",
            "preferences",
            "account",
        ],
        path: "/settings",
        icon: Settings,
        category: "Navigation",
    },
];


/* =========================================================
   QUICK SEARCH ACTIONS
========================================================= */

const quickActions = [
    {
        id: "search-jobs",
        title: "Search jobs",
        description: "Find jobs in your workspaces",
        icon: BriefcaseBusiness,
        path: "/job-workspaces",
    },

    {
        id: "search-resumes",
        title: "Browse resumes",
        description: "View and manage your resumes",
        icon: FileText,
        path: "/resumes",
    },

    {
        id: "search-applications",
        title: "View applications",
        description: "Track your applications",
        icon: Send,
        path: "/applications",
    },

    {
        id: "practice-interview",
        title: "Practice an interview",
        description: "Start interview preparation",
        icon: Video,
        path: "/interviews",
    },
];


/* =========================================================
   APP HEADER
========================================================= */

export default function AppHeader({
    setMobileOpen,
}) {

    const navigate = useNavigate();
    const location = useLocation();

    const searchInputRef = useRef(null);


    /* =====================================================
       STATE
    ===================================================== */

    const [searchOpen, setSearchOpen] =
        useState(false);

    const [searchQuery, setSearchQuery] =
        useState("");

    const [selectedIndex, setSelectedIndex] =
        useState(0);


    /* =====================================================
       PAGE TITLE
    ===================================================== */

    const pageTitle = useMemo(() => {

        const matchedPage =
            pageTitleMap.find((page) => {

                if (page.path === "/dashboard") {
                    return location.pathname === "/dashboard";
                }

                return (
                    location.pathname === page.path ||
                    location.pathname.startsWith(
                        `${page.path}/`
                    )
                );

            });

        return matchedPage?.title || "Skillio";

    }, [location.pathname]);


    /* =====================================================
       FILTER SEARCH RESULTS
    ===================================================== */

    const filteredResults = useMemo(() => {

        const query =
            searchQuery
                .trim()
                .toLowerCase();

        if (!query) {
            return [];
        }

        return searchItems
            .map((item) => {

                const searchableText = [
                    item.title,
                    item.description,
                    ...item.keywords,
                ]
                    .join(" ")
                    .toLowerCase();

                let score = 0;

                if (
                    item.title
                        .toLowerCase()
                        .startsWith(query)
                ) {
                    score += 100;
                }

                if (
                    item.title
                        .toLowerCase()
                        .includes(query)
                ) {
                    score += 50;
                }

                if (
                    item.description
                        .toLowerCase()
                        .includes(query)
                ) {
                    score += 20;
                }

                if (
                    item.keywords.some((keyword) =>
                        keyword
                            .toLowerCase()
                            .includes(query)
                    )
                ) {
                    score += 30;
                }

                if (
                    searchableText.includes(query)
                ) {
                    score += 10;
                }

                return {
                    ...item,
                    score,
                };

            })
            .filter((item) => item.score > 0)
            .sort((a, b) => b.score - a.score);

    }, [searchQuery]);


    /* =====================================================
       SEARCH RESULTS INCLUDING GLOBAL SEARCH
    ===================================================== */

    const visibleResults = useMemo(() => {

        if (!searchQuery.trim()) {
            return [];
        }

        return [
            ...filteredResults,

            {
                id: "global-search",
                title: `Search Skillio for "${searchQuery.trim()}"`,
                description:
                    "Search across your Skillio workspace",
                icon: Search,
                path: `/search?q=${encodeURIComponent(
                    searchQuery.trim()
                )}`,
                category: "Global Search",
                isGlobalSearch: true,
            },
        ];

    }, [
        filteredResults,
        searchQuery,
    ]);


    /* =====================================================
       OPEN SEARCH
    ===================================================== */

    const openSearch = () => {

        setSearchOpen(true);
        setSelectedIndex(0);

        requestAnimationFrame(() => {
            searchInputRef.current?.focus();
        });

    };


    /* =====================================================
       CLOSE SEARCH
    ===================================================== */

    const closeSearch = () => {

        setSearchOpen(false);
        setSearchQuery("");
        setSelectedIndex(0);

    };


    /* =====================================================
       NAVIGATE FROM SEARCH
    ===================================================== */

    const navigateFromSearch = (path) => {

        closeSearch();

        navigate(path);

    };


    /* =====================================================
       SUBMIT SEARCH
    ===================================================== */

    const handleSearchSubmit = (event) => {

        event.preventDefault();

        const query =
            searchQuery.trim();

        if (!query) {
            return;
        }

        navigateFromSearch(
            `/search?q=${encodeURIComponent(query)}`
        );

    };


    /* =====================================================
       KEYBOARD NAVIGATION
    ===================================================== */

    useEffect(() => {

        if (!searchOpen) {
            return;
        }

        const handleKeyDown = (event) => {

            /* ---------------------------------------------
               ESC
            --------------------------------------------- */

            if (event.key === "Escape") {

                event.preventDefault();

                closeSearch();

                return;

            }


            /* ---------------------------------------------
               ARROW DOWN
            --------------------------------------------- */

            if (event.key === "ArrowDown") {

                event.preventDefault();

                if (!visibleResults.length) {
                    return;
                }

                setSelectedIndex((current) =>
                    Math.min(
                        current + 1,
                        visibleResults.length - 1
                    )
                );

                return;

            }


            /* ---------------------------------------------
               ARROW UP
            --------------------------------------------- */

            if (event.key === "ArrowUp") {

                event.preventDefault();

                if (!visibleResults.length) {
                    return;
                }

                setSelectedIndex((current) =>
                    Math.max(
                        current - 1,
                        0
                    )
                );

                return;

            }


            /* ---------------------------------------------
               ENTER
            --------------------------------------------- */

            if (
                event.key === "Enter" &&
                visibleResults.length
            ) {

                event.preventDefault();

                const selected =
                    visibleResults[selectedIndex];

                if (selected) {

                    navigateFromSearch(
                        selected.path
                    );

                }

            }

        };


        window.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [
        searchOpen,
        visibleResults,
        selectedIndex,
    ]);


    /* =====================================================
       GLOBAL CTRL/CMD + K
    ===================================================== */

    useEffect(() => {

        const handleShortcut = (event) => {

            if (
                (event.ctrlKey || event.metaKey) &&
                event.key.toLowerCase() === "k"
            ) {

                event.preventDefault();

                openSearch();

            }

        };


        window.addEventListener(
            "keydown",
            handleShortcut
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleShortcut
            );

        };

    }, []);


    /* =====================================================
       CLOSE SEARCH WHEN ROUTE CHANGES
    ===================================================== */

    useEffect(() => {

        setSearchOpen(false);
        setSearchQuery("");
        setSelectedIndex(0);

    }, [location.pathname]);


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <>
            {/* =================================================
                HEADER
            ================================================= */}

            <header
                className="
                    sticky
                    top-0
                    z-30

                    h-[68px]

                    border-b
                    border-[var(--outline-variant)]/70

                    bg-[color:var(--surface)]/90

                    backdrop-blur-xl
                "
            >

                <div
                    className="
                        flex
                        h-full
                        w-full

                        items-center
                        justify-between

                        gap-3

                        px-3
                        sm:px-5
                        lg:px-7
                        xl:px-8
                    "
                >

                    {/* =================================================
                        LEFT
                    ================================================= */}

                    <div
                        className="
                            flex
                            min-w-0
                            flex-1

                            items-center
                            gap-2
                            sm:gap-3
                        "
                    >

                        {/* MOBILE MENU */}

                        <button
                            type="button"
                            onClick={() =>
                                setMobileOpen(true)
                            }
                            aria-label="Open navigation"
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0

                                items-center
                                justify-center

                                rounded-xl

                                text-[var(--on-surface-variant)]

                                transition

                                hover:bg-[var(--surface-container)]
                                hover:text-[var(--on-surface)]

                                active:scale-95

                                lg:hidden
                            "
                        >

                            <Menu
                                size={21}
                                strokeWidth={2}
                            />

                        </button>


                        {/* PAGE TITLE */}

                        <div
                            className="
                                min-w-0
                                shrink-0
                            "
                        >

                            {/* MOBILE */}

                            <h1
                                className="
                                    max-w-[160px]

                                    truncate

                                    font-[var(--font-heading)]

                                    text-base
                                    font-bold

                                    tracking-tight

                                    text-[var(--on-surface)]

                                    sm:max-w-[220px]

                                    lg:hidden
                                "
                            >
                                {pageTitle}
                            </h1>


                            {/* DESKTOP */}

                            <div
                                className="
                                    hidden
                                    lg:block
                                "
                            >

                                <p
                                    className="
                                        text-[11px]
                                        font-medium

                                        text-[var(--on-surface-variant)]/70
                                    "
                                >
                                    Workspace
                                </p>

                                <h1
                                    className="
                                        mt-0.5

                                        font-[var(--font-heading)]

                                        text-lg
                                        font-bold
                                        leading-none

                                        tracking-tight

                                        text-[var(--on-surface)]
                                    "
                                >
                                    {pageTitle}
                                </h1>

                            </div>

                        </div>


                        {/* =================================================
                            DESKTOP GLOBAL SEARCH
                        ================================================= */}

                        <button
                            type="button"
                            onClick={openSearch}
                            className="
                                relative

                                ml-2

                                hidden

                                h-10
                                w-full
                                max-w-[520px]

                                items-center

                                rounded-xl

                                border
                                border-[var(--outline-variant)]/80

                                bg-[var(--surface-container-low)]

                                px-3

                                text-left

                                transition

                                hover:border-[var(--outline)]
                                hover:bg-[var(--surface-container)]

                                xl:ml-5
                                xl:flex

                                2xl:max-w-[600px]
                            "
                        >

                            <Search
                                size={18}
                                className="
                                    mr-3
                                    shrink-0

                                    text-[var(--on-surface-variant)]/70
                                "
                            />

                            <span
                                className="
                                    flex-1

                                    truncate

                                    text-sm

                                    text-[var(--on-surface-variant)]/65
                                "
                            >
                                Search Skillio...
                            </span>


                            <kbd
                                className="
                                    hidden

                                    items-center
                                    gap-1

                                    rounded-md

                                    border
                                    border-[var(--outline-variant)]

                                    bg-[var(--surface-container-lowest)]

                                    px-2
                                    py-1

                                    font-mono

                                    text-[10px]

                                    text-[var(--on-surface-variant)]/70

                                    2xl:flex
                                "
                            >

                                <Command size={10} />

                                K

                            </kbd>

                        </button>

                    </div>


                    {/* =================================================
                        RIGHT
                    ================================================= */}

                    <div
                        className="
                            flex
                            shrink-0

                            items-center
                            gap-1
                            sm:gap-2
                        "
                    >

                        {/* MOBILE SEARCH */}

                        <button
                            type="button"
                            onClick={openSearch}
                            aria-label="Search Skillio"
                            className="
                                flex
                                h-10
                                w-10

                                items-center
                                justify-center

                                rounded-xl

                                text-[var(--on-surface-variant)]

                                transition

                                hover:bg-[var(--surface-container)]
                                hover:text-[var(--on-surface)]

                                active:scale-95

                                xl:hidden
                            "
                        >

                            <Search
                                size={19}
                                strokeWidth={2}
                            />

                        </button>


                        {/* NEW APPLICATION */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/applications")
                            }
                            className="
                                flex
                                h-10

                                items-center
                                justify-center
                                gap-2

                                rounded-xl

                                bg-[var(--primary)]

                                px-3
                                sm:px-4

                                text-sm
                                font-semibold

                                text-[var(--on-primary)]

                                shadow-[var(--shadow-sm)]

                                transition

                                hover:-translate-y-0.5
                                hover:bg-[var(--primary-container)]

                                active:scale-[0.98]
                            "
                        >

                            <Plus
                                size={17}
                                strokeWidth={2.3}
                            />

                            <span className="hidden sm:inline">
                                New Application
                            </span>

                        </button>

                    </div>

                </div>

            </header>


            {/* =========================================================
                GLOBAL SEARCH OVERLAY
            ========================================================= */}

            {searchOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[100]

                        bg-black/30

                        px-3
                        pt-16

                        backdrop-blur-sm

                        sm:px-5
                        sm:pt-20
                    "
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget
                        ) {
                            closeSearch();
                        }

                    }}
                >

                    <div
                        className="
                            mx-auto

                            w-full
                            max-w-2xl

                            overflow-hidden

                            rounded-2xl

                            border
                            border-[var(--outline-variant)]

                            bg-[var(--surface-container-lowest)]

                            shadow-[var(--shadow-lg)]
                        "
                    >

                        {/* =================================================
                            SEARCH INPUT
                        ================================================= */}

                        <form
                            onSubmit={handleSearchSubmit}
                            className="
                                border-b
                                border-[var(--outline-variant)]/70

                                p-2.5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        relative
                                        min-w-0
                                        flex-1
                                    "
                                >

                                    <Search
                                        size={19}
                                        className="
                                            pointer-events-none

                                            absolute
                                            left-4
                                            top-1/2

                                            -translate-y-1/2

                                            text-[var(--on-surface-variant)]/70
                                        "
                                    />

                                    <input
                                        ref={searchInputRef}
                                        autoFocus
                                        type="text"
                                        value={searchQuery}
                                        onChange={(event) => {

                                            setSearchQuery(
                                                event.target.value
                                            );

                                            setSelectedIndex(0);

                                        }}
                                        placeholder="Search Skillio..."
                                        aria-label="Search Skillio"
                                        className="
                                            h-12
                                            w-full

                                            rounded-xl

                                            border
                                            border-transparent

                                            bg-[var(--surface-container-low)]

                                            pl-11
                                            pr-4

                                            text-sm

                                            text-[var(--on-surface)]

                                            outline-none

                                            transition

                                            placeholder:text-[var(--on-surface-variant)]/60

                                            focus:border-[var(--primary)]

                                            focus:bg-[var(--surface-container-lowest)]

                                            focus:ring-4
                                            focus:ring-[color:var(--primary)]/10
                                        "
                                    />

                                </div>


                                {/* CLOSE */}

                                <button
                                    type="button"
                                    onClick={closeSearch}
                                    aria-label="Close search"
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        shrink-0

                                        items-center
                                        justify-center

                                        rounded-xl

                                        text-[var(--on-surface-variant)]

                                        transition

                                        hover:bg-[var(--surface-container)]
                                        hover:text-[var(--on-surface)]
                                    "
                                >

                                    <X size={19} />

                                </button>

                            </div>

                        </form>


                        {/* =================================================
                            SEARCH CONTENT
                        ================================================= */}

                        <div
                            className="
                                max-h-[420px]

                                overflow-y-auto

                                p-2
                            "
                        >

                            {/* =================================================
                                EMPTY SEARCH
                            ================================================= */}

                            {!searchQuery.trim() && (

                                <>

                                    <div
                                        className="
                                            px-3
                                            pb-2
                                            pt-1
                                        "
                                    >

                                        <p
                                            className="
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-[0.12em]

                                                text-[var(--on-surface-variant)]/60
                                            "
                                        >
                                            Quick access
                                        </p>

                                    </div>


                                    {quickActions.map(
                                        (item) => {

                                            const Icon =
                                                item.icon;

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() =>
                                                        navigateFromSearch(
                                                            item.path
                                                        )
                                                    }
                                                    className="
                                                        group

                                                        flex
                                                        w-full

                                                        items-center
                                                        gap-3

                                                        rounded-xl

                                                        px-3
                                                        py-3

                                                        text-left

                                                        transition

                                                        hover:bg-[var(--surface-container)]
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

                                                            rounded-lg

                                                            bg-[var(--primary-container)]

                                                            text-[var(--primary)]
                                                        "
                                                    >

                                                        <Icon
                                                            size={17}
                                                        />

                                                    </div>


                                                    <div className="min-w-0 flex-1">

                                                        <p
                                                            className="
                                                                truncate

                                                                text-sm
                                                                font-semibold

                                                                text-[var(--on-surface)]
                                                            "
                                                        >
                                                            {item.title}
                                                        </p>

                                                        <p
                                                            className="
                                                                truncate

                                                                text-xs

                                                                text-[var(--on-surface-variant)]/70
                                                            "
                                                        >
                                                            {item.description}
                                                        </p>

                                                    </div>


                                                    <ArrowRight
                                                        size={15}
                                                        className="
                                                            shrink-0

                                                            text-[var(--on-surface-variant)]/40

                                                            transition

                                                            group-hover:translate-x-0.5
                                                            group-hover:text-[var(--primary)]
                                                        "
                                                    />

                                                </button>
                                            );

                                        }
                                    )}

                                </>
                            )}


                            {/* =================================================
                                SEARCH RESULTS
                            ================================================= */}

                            {searchQuery.trim() && (

                                <>

                                    {filteredResults.length > 0 && (

                                        <div className="mb-1">

                                            <p
                                                className="
                                                    px-3
                                                    py-2

                                                    text-[10px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.12em]

                                                    text-[var(--on-surface-variant)]/60
                                                "
                                            >
                                                Pages
                                            </p>

                                        </div>

                                    )}


                                    {visibleResults.map(
                                        (item, index) => {

                                            const Icon =
                                                item.icon;

                                            const isSelected =
                                                index ===
                                                selectedIndex;

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onMouseEnter={() =>
                                                        setSelectedIndex(
                                                            index
                                                        )
                                                    }
                                                    onClick={() =>
                                                        navigateFromSearch(
                                                            item.path
                                                        )
                                                    }
                                                    className={`
                                                        group

                                                        flex
                                                        w-full

                                                        items-center
                                                        gap-3

                                                        rounded-xl

                                                        px-3
                                                        py-3

                                                        text-left

                                                        transition

                                                        ${
                                                            isSelected
                                                                ? "bg-[var(--primary-container)]"
                                                                : "hover:bg-[var(--surface-container)]"
                                                        }
                                                    `}
                                                >

                                                    <div
                                                        className={`
                                                            flex
                                                            h-9
                                                            w-9
                                                            shrink-0

                                                            items-center
                                                            justify-center

                                                            rounded-lg

                                                            ${
                                                                isSelected
                                                                    ? "bg-[var(--surface)] text-[var(--primary)]"
                                                                    : "bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
                                                            }
                                                        `}
                                                    >

                                                        <Icon
                                                            size={17}
                                                        />

                                                    </div>


                                                    <div
                                                        className="
                                                            min-w-0
                                                            flex-1
                                                        "
                                                    >

                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                gap-2
                                                            "
                                                        >

                                                            <p
                                                                className={`
                                                                    truncate

                                                                    text-sm
                                                                    font-semibold

                                                                    ${
                                                                        isSelected
                                                                            ? "text-[var(--on-primary-container)]"
                                                                            : "text-[var(--on-surface)]"
                                                                    }
                                                                `}
                                                            >
                                                                {item.title}
                                                            </p>

                                                            {item.isGlobalSearch && (
                                                                <span
                                                                    className="
                                                                        shrink-0

                                                                        rounded-md

                                                                        bg-[var(--surface)]

                                                                        px-1.5
                                                                        py-0.5

                                                                        text-[9px]
                                                                        font-bold

                                                                        text-[var(--primary)]
                                                                    "
                                                                >
                                                                    Search
                                                                </span>
                                                            )}

                                                        </div>


                                                        <p
                                                            className="
                                                                truncate

                                                                text-xs

                                                                text-[var(--on-surface-variant)]/70
                                                            "
                                                        >
                                                            {item.description}
                                                        </p>

                                                    </div>


                                                    <ArrowRight
                                                        size={15}
                                                        className={`
                                                            shrink-0

                                                            ${
                                                                isSelected
                                                                    ? "text-[var(--primary)]"
                                                                    : "text-[var(--on-surface-variant)]/40"
                                                            }
                                                        `}
                                                    />

                                                </button>
                                            );

                                        }
                                    )}

                                </>
                            )}

                        </div>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div
                            className="
                                flex

                                items-center
                                justify-between

                                gap-3

                                border-t
                                border-[var(--outline-variant)]/60

                                px-4
                                py-2.5
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-3
                                "
                            >

                                <span
                                    className="
                                        flex
                                        items-center
                                        gap-1

                                        text-[10px]

                                        text-[var(--on-surface-variant)]/60
                                    "
                                >

                                    <kbd
                                        className="
                                            rounded
                                            border
                                            border-[var(--outline-variant)]

                                            px-1.5
                                            py-0.5

                                            font-mono
                                        "
                                    >
                                        ↑
                                    </kbd>

                                    <kbd
                                        className="
                                            rounded
                                            border
                                            border-[var(--outline-variant)]

                                            px-1.5
                                            py-0.5

                                            font-mono
                                        "
                                    >
                                        ↓
                                    </kbd>

                                    Navigate

                                </span>


                                <span
                                    className="
                                        hidden
                                        items-center
                                        gap-1

                                        text-[10px]

                                        text-[var(--on-surface-variant)]/60

                                        sm:flex
                                    "
                                >

                                    <kbd
                                        className="
                                            rounded
                                            border
                                            border-[var(--outline-variant)]

                                            px-1.5
                                            py-0.5

                                            font-mono
                                        "
                                    >
                                        Enter
                                    </kbd>

                                    Open

                                </span>

                            </div>


                            <span
                                className="
                                    text-[10px]

                                    text-[var(--on-surface-variant)]/50
                                "
                            >
                                Esc to close
                            </span>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}