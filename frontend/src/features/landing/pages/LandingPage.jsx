import { useState } from "react";
import { Link } from "react-router-dom";

import {
    ArrowRight,
    ArrowUpRight,
    BarChart3,
    Bot,
    Brain,
    BriefcaseBusiness,
    Check,
    ChevronDown,
    ChevronRight,
    FileText,
    Menu,
    MessageSquare,
    Rocket,
    Sparkles,
    Target,
    TrendingUp,
    X,
    ArrowDownRight,
    Layers3,
    LayoutDashboard,
    AlertCircle,
    UserRound,
    GraduationCap,
    MessageSquareText,ClipboardCheck
} from "lucide-react";

import SkillioLogo from "../../../components/SkillioLogo";


const Landing = () => {

    // =========================================================
    // STATE
    // =========================================================

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const [openFaq, setOpenFaq] = useState(null);


    // =========================================================
    // FEATURES
    // =========================================================

    const features = [
        {
            title: "Career Profile",
            description:
                "Build a complete picture of your skills, experience, education, projects, and career goals in one organized profile.",
            icon: UserRound,
            accent: "primary",
        },

        {
            title: "Smart Resumes",
            description:
                "Create, organize, and manage resumes while keeping your professional information connected to your career journey.",
            icon: FileText,
            accent: "secondary",
        },

        {
            title: "Job Workspaces",
            description:
                "Create a dedicated workspace for every opportunity and understand the role, requirements, preparation, and progress.",
            icon: BriefcaseBusiness,
            accent: "primary",
        },

        {
            title: "Focused Preparation",
            description:
                "Organize what you need to learn and prepare so your effort stays connected to the opportunities you care about.",
            icon: GraduationCap,
            accent: "secondary",
        },

        {
            title: "Interview Preparation",
            description:
                "Track interview preparation, organize important topics, and prepare confidently for different stages of the hiring process.",
            icon: MessageSquareText,
            accent: "primary",
        },

        {
            title: "Career Coach",
            description:
                "Get intelligent guidance to help you think through decisions, understand priorities, and move forward with more clarity.",
            icon: Bot,
            accent: "secondary",
        },

        {
            title: "Application Tracking",
            description:
                "Keep your applications organized and understand exactly where every opportunity stands in your career journey.",
            icon: ClipboardCheck,
            accent: "primary",
        },
    ];


    // =========================================================
    // FAQ
    // =========================================================

    const faqs = [

        {
            question: "What is Skillio?",

            answer:
                "Skillio is a career intelligence platform that helps you organize your career profile, resumes, job opportunities, preparation, interviews, applications, and career decisions in one connected workspace.",
        },

        {
            question: "Who is Skillio for?",

            answer:
                "Skillio is designed for students, freshers, job seekers, and professionals who want a more structured and intelligent approach to career preparation and job applications.",
        },

        {
            question: "Can Skillio help me prepare for interviews?",

            answer:
                "Yes. Skillio brings your job context and preparation journey together so you can focus on relevant interview preparation instead of preparing randomly.",
        },

        {
            question: "What does the AI Career Coach do?",

            answer:
                "The AI Career Coach helps you think through career questions, job opportunities, preparation strategies, and your next steps using the context of your Skillio journey.",
        },

        {
            question: "Can I track multiple job applications?",

            answer:
                "Yes. Skillio is designed to help you organize and manage multiple opportunities while keeping the preparation and important information for each role connected.",
        },

        {
            question: "Is Skillio only for job seekers?",

            answer:
                "No. Skillio can also help students, freshers, and professionals who want to understand their career direction, improve their professional profile, and prepare for future opportunities.",
        },

    ];


    // =========================================================
    // NAVIGATION
    // =========================================================

    const navigationItems = [

        {
            label: "How it works",
            href: "#how-it-works",
        },

        {
            label: "Features",
            href: "#features",
        },

        {
            label: "Career Coach",
            href: "#career-coach",
        },

        {
            label: "FAQ",
            href: "#faq",
        },

    ];


    // =========================================================
    // HANDLERS
    // =========================================================

    const handleNavigation = (href) => {

        setMobileMenuOpen(false);

        document
            .querySelector(href)
            ?.scrollIntoView({
                behavior: "smooth",
            });

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <main
            className="
        min-h-screen
        bg-[var(--surface)]
        text-[var(--on-surface)]
    "
        >


            {/* =================================================
                NAVBAR
            ================================================= */}

            <header
                className="sticky top-0 z-50 border-b"
                style={{
                    background: "#F9FAF3",
                    borderColor: "rgba(117, 120, 112, 0.15)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                }}
            >
                <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-10">


                    {/* LOGO */}


                    <Link
                        to="/"
                        className="
                flex
                items-center
                gap-3

                shrink-0
            "
                    >
                        <SkillioLogo size={150}/>


                    </Link>


                    {/* DESKTOP NAV */}

                    <nav
                        className="
                            hidden
                            items-center
                            gap-8
                            lg:flex
                        "
                    >

                        {navigationItems.map((item) => (

                            <button
                                key={item.label}

                                type="button"

                                onClick={() =>
                                    handleNavigation(item.href)
                                }

                                className="
                                    text-sm
                                    font-medium

                                    text-[var(--on-surface-variant)]

                                    transition-colors

                                    hover:text-[var(--primary)]
                                "
                            >
                                {item.label}
                            </button>

                        ))}

                    </nav>


                    {/* ACTIONS */}

                    <div
                        className="
                            hidden
                            items-center
                            gap-4
                            sm:flex
                        "
                    >

                        <Link
                            to="/login"

                            className="
                                text-sm
                                font-semibold

                                text-[var(--on-surface)]

                                transition-colors

                                hover:text-[var(--primary)]
                            "
                        >
                            Log in
                        </Link>


                        <Link
                            to="/register"

                            className="
                                inline-flex
                                h-11
                                items-center
                                justify-center
                                gap-2

                                rounded-xl

                                bg-[var(--primary)]

                                px-5

                                text-sm
                                font-semibold

                                transition-all

                                hover:-translate-y-0.5
                                hover:bg-[var(--primary-container)]
                            "

                            style={{
                                background: "var(--primary)",
                                color: "var(--on-primary)",
                                boxShadow:
                                    "0 14px 30px rgba(62, 74, 55, 0.2)",
                            }}
                        >
                            Get started

                            <ArrowRight size={16} />

                        </Link>

                    </div>


                    {/* MOBILE MENU BUTTON */}

                    <button
                        type="button"

                        onClick={() =>
                            setMobileMenuOpen(!mobileMenuOpen)
                        }

                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center

                            rounded-lg

                            text-[var(--on-surface)]

                            lg:hidden
                        "
                    >

                        {mobileMenuOpen ? (
                            <X size={22} />
                        ) : (
                            <Menu size={22} />
                        )}

                    </button>


                </div>


                {/* MOBILE MENU */}

                {mobileMenuOpen && (

                    <div
                        className="
                            border-t
                            border-black/[0.04]

                            bg-[var(--surface)]

                            px-6
                            py-6

                            lg:hidden
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                gap-5
                            "
                        >

                            {navigationItems.map((item) => (

                                <button
                                    key={item.label}

                                    type="button"

                                    onClick={() =>
                                        handleNavigation(item.href)
                                    }

                                    className="
                                        text-left
                                        text-sm
                                        font-semibold

                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    {item.label}
                                </button>

                            ))}


                            <div
                                className="
                                    mt-2
                                    flex
                                    flex-col
                                    gap-3
                                "
                            >

                                <Link
                                    to="/login"

                                    className="
                                        flex
                                        h-12
                                        items-center
                                        justify-center

                                        rounded-xl

                                        bg-[var(--surface-container-low)]

                                        text-sm
                                        font-semibold
                                    "
                                >
                                    Log in
                                </Link>


                                <Link
                                    to="/register"

                                    className="
                                        flex
                                        h-12
                                        items-center
                                        justify-center

                                        rounded-xl

                                        text-sm
                                        font-semibold
                                    "
                                    style={{
                                        background: "var(--primary)",
                                        color: "var(--on-primary)",
                                        boxShadow:
                                            "0 14px 30px rgba(62, 74, 55, 0.2)",
                                    }}
                                >
                                    Get started
                                </Link>

                            </div>

                        </div>

                    </div>

                )}

            </header>


            {/* =================================================
                HERO
            ================================================= */}

            <section className="relative isolate overflow-hidden">
                {/* Background Artwork */}

                <div
                    className="pointer-events-none absolute left-[-160px] top-[80px] h-[420px] w-[420px] rounded-full blur-3xl"
                    style={{
                        background:
                            "rgba(217, 231, 204, 0.75)",
                    }}
                />

                <div
                    className="pointer-events-none absolute right-[-140px] top-[120px] h-[460px] w-[460px] rounded-full blur-3xl"
                    style={{
                        background:
                            "rgba(255, 218, 213, 0.58)",
                    }}
                />

                <div className="relative mx-auto grid min-h-[calc(100vh-76px)] max-w-[1280px] items-center gap-14 px-5 py-16 sm:px-8 md:py-20 lg:grid-cols-[1fr_1fr] lg:gap-12 lg:px-10 lg:py-24">
                    {/* Hero Content */}

                    <div className="relative z-10 max-w-[680px]">
                        <div
                            className="mb-7 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
                            style={{
                                background:
                                    "var(--primary-fixed)",
                                color:
                                    "var(--on-primary-fixed)",
                            }}
                        >
                            <Sparkles size={16} />

                            <span>
                                Your complete career workspace
                            </span>
                        </div>

                        <h1
                            className="max-w-[760px] text-[44px] font-bold leading-[1.08] tracking-[-0.045em] sm:text-[58px] lg:text-[68px]"
                            style={{
                                fontFamily:
                                    "var(--font-heading)",
                            }}
                        >
                            Build your career with{" "}
                            <span
                                style={{
                                    color:
                                        "var(--primary-container)",
                                }}
                            >
                                clarity.
                            </span>
                        </h1>

                        <p
                            className="mt-7 max-w-[620px] text-[17px] leading-8 sm:text-[18px]"
                            style={{
                                color:
                                    "var(--on-surface-variant)",
                            }}
                        >
                            Skillio brings your career profile,
                            resumes, job applications, interview
                            preparation and progress into one
                            focused workspace.
                        </p>

                        {/* Hero Buttons */}

                        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
                            <Link
                                to="/register"
                                className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl px-7 text-sm font-semibold transition-all hover:-translate-y-1"
                                style={{
                                    background: "var(--primary)",
                                    color: "var(--on-primary)",
                                    boxShadow:
                                        "0 14px 30px rgba(62, 74, 55, 0.2)",
                                }}
                            >
                                Start building your career

                                <ArrowRight
                                    size={18}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </Link>

                            <a
                                href="#features"
                                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl border px-7 text-sm font-semibold transition-all hover:bg-white"
                                style={{
                                    borderColor:
                                        "var(--outline-variant)",
                                    background:
                                        "rgba(255,255,255,0.45)",
                                }}
                            >
                                Explore Skillio

                                <ChevronRight size={18} />
                            </a>
                        </div>

                        {/* Small Trust Points */}

                        <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
                            {[
                                "Everything in one place",
                                "Built for career growth",
                                "Stay focused and organized",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-2 text-sm font-medium"
                                    style={{
                                        color:
                                            "var(--on-surface-variant)",
                                    }}
                                >
                                    <Check
                                        size={16}
                                        strokeWidth={2.5}
                                        style={{
                                            color:
                                                "var(--primary)",
                                        }}
                                    />

                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* =================================================
                        HERO ARTWORK / DASHBOARD PREVIEW
                    ================================================= */}

                    <div className="relative mx-auto w-full max-w-[620px]">
                        {/* Decorative Shapes */}

                        <div
                            className="absolute -left-5 top-[15%] h-28 w-28 rounded-full blur-2xl"
                            style={{
                                background:
                                    "var(--secondary-fixed)",
                                opacity: 0.7,
                            }}
                        />

                        <div
                            className="absolute -right-5 bottom-[5%] h-36 w-36 rounded-full blur-2xl"
                            style={{
                                background:
                                    "var(--primary-fixed)",
                                opacity: 0.8,
                            }}
                        />

                        {/* Main Dashboard Card */}

                        <div
                            className="relative overflow-hidden rounded-[32px] border p-4 shadow-2xl sm:p-5"
                            style={{
                                background:
                                    "rgba(255,255,255,0.78)",
                                borderColor:
                                    "rgba(255,255,255,0.9)",
                                backdropFilter:
                                    "blur(20px)",
                                boxShadow:
                                    "0 30px 80px rgba(62, 74, 55, 0.16)",
                            }}
                        >
                            {/* Dashboard Top */}

                            <div className="flex items-center justify-between rounded-2xl px-3 py-3 sm:px-4">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                                        style={{
                                            background:
                                                "var(--primary)",
                                            color:
                                                "var(--on-primary)",
                                        }}
                                    >
                                        <Rocket size={19} />
                                    </div>

                                    <div>
                                        <p className="text-sm font-bold">
                                            Your Career
                                        </p>

                                        <p
                                            className="text-xs"
                                            style={{
                                                color:
                                                    "var(--on-surface-variant)",
                                            }}
                                        >
                                            Keep moving forward
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-1.5">
                                    {[1, 2, 3].map((item) => (
                                        <span
                                            key={item}
                                            className="h-2.5 w-2.5 rounded-full"
                                            style={{
                                                background:
                                                    item === 1
                                                        ? "var(--primary)"
                                                        : "var(--surface-container-highest)",
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Welcome Card */}

                            <div
                                className="mt-4 rounded-3xl p-5 sm:p-6"
                                style={{
                                    background:
                                        "var(--primary)",
                                    color:
                                        "var(--on-primary)",
                                }}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm font-medium opacity-75">
                                            Good progress
                                        </p>

                                        <h3
                                            className="mt-2 text-2xl font-bold tracking-[-0.03em]"
                                            style={{
                                                fontFamily:
                                                    "var(--font-heading)",
                                            }}
                                        >
                                            You're building momentum.
                                        </h3>

                                        <p className="mt-3 max-w-[300px] text-sm leading-6 opacity-80">
                                            Stay consistent. Small steps
                                            today create bigger
                                            opportunities tomorrow.
                                        </p>
                                    </div>

                                    <div
                                        className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl sm:flex"
                                        style={{
                                            background:
                                                "rgba(255,255,255,0.12)",
                                        }}
                                    >
                                        <Sparkles size={26} />
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}

                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {[
                                    ["08", "Applications"],
                                    ["03", "Interviews"],
                                    ["72%", "Profile"],
                                ].map(([value, label]) => (
                                    <div
                                        key={label}
                                        className="rounded-2xl p-3 sm:p-4"
                                        style={{
                                            background:
                                                "var(--surface-container-low)",
                                        }}
                                    >
                                        <p className="text-xl font-bold sm:text-2xl">
                                            {value}
                                        </p>

                                        <p
                                            className="mt-1 text-[10px] leading-4 sm:text-xs"
                                            style={{
                                                color:
                                                    "var(--on-surface-variant)",
                                            }}
                                        >
                                            {label}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Progress */}

                            <div
                                className="mt-4 rounded-3xl p-5"
                                style={{
                                    background:
                                        "var(--surface-container-low)",
                                }}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-bold">
                                            Weekly progress
                                        </p>

                                        <p
                                            className="mt-1 text-xs"
                                            style={{
                                                color:
                                                    "var(--on-surface-variant)",
                                            }}
                                        >
                                            Keep your momentum going
                                        </p>
                                    </div>

                                    <BarChart3
                                        size={21}
                                        style={{
                                            color:
                                                "var(--primary)",
                                        }}
                                    />
                                </div>

                                <div className="mt-5 flex h-24 items-end gap-2">
                                    {[42, 65, 48, 82, 62, 92, 74].map(
                                        (height, index) => (
                                            <div
                                                key={index}
                                                className="flex flex-1 items-end"
                                            >
                                                <div
                                                    className="w-full rounded-t-xl"
                                                    style={{
                                                        height: `${height}%`,
                                                        background:
                                                            index === 5
                                                                ? "var(--primary)"
                                                                : "var(--primary-fixed-dim)",
                                                    }}
                                                />
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Floating Resume Card */}

                        <div
                            className="absolute -left-5 bottom-[9%] hidden w-[190px] rounded-2xl border p-4 shadow-xl md:block"
                            style={{
                                background:
                                    "rgba(255,255,255,0.9)",
                                borderColor:
                                    "rgba(255,255,255,0.9)",
                                backdropFilter:
                                    "blur(14px)",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                                    style={{
                                        background:
                                            "var(--secondary-fixed)",
                                        color:
                                            "var(--secondary)",
                                    }}
                                >
                                    <FileText size={18} />
                                </div>

                                <div>
                                    <p className="text-xs font-bold">
                                        Resume ready
                                    </p>

                                    <p
                                        className="mt-1 text-[10px]"
                                        style={{
                                            color:
                                                "var(--on-surface-variant)",
                                        }}
                                    >
                                        Updated today
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Success Card */}

                        <div
                            className="absolute -right-5 top-[13%] hidden w-[185px] rounded-2xl border p-4 shadow-xl lg:block"
                            style={{
                                background:
                                    "rgba(255,255,255,0.9)",
                                borderColor:
                                    "rgba(255,255,255,0.9)",
                                backdropFilter:
                                    "blur(14px)",
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex h-9 w-9 items-center justify-center rounded-full"
                                    style={{
                                        background:
                                            "var(--primary-fixed)",
                                        color:
                                            "var(--primary)",
                                    }}
                                >
                                    <Check size={17} />
                                </div>

                                <div>
                                    <p className="text-xs font-bold">
                                        Application tracked
                                    </p>

                                    <p
                                        className="mt-1 text-[10px]"
                                        style={{
                                            color:
                                                "var(--on-surface-variant)",
                                        }}
                                    >
                                        Everything organized
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* =================================================
                PROBLEM
            ================================================= */}

            <section
                id="problem"
                className="
        relative
        overflow-hidden

        bg-[var(--surface-container-low)]

        px-5
        py-20

        sm:px-8

        lg:px-10
        lg:py-32
    "
            >
                {/* ================================================
        BACKGROUND ARTWORK
    ================================================= */}

                <div
                    className="
            pointer-events-none

            absolute

            -left-32
            top-20

            h-80
            w-80

            rounded-full

            bg-[var(--secondary-fixed)]

            opacity-40

            blur-3xl
        "
                />

                <div
                    className="
            pointer-events-none

            absolute

            -right-32
            bottom-0

            h-96
            w-96

            rounded-full

            bg-[var(--primary-fixed)]

            opacity-50

            blur-3xl
        "
                />


                {/* Subtle pattern */}

                <div
                    className="
            pointer-events-none

            absolute
            inset-0

            opacity-[0.035]

            [background-image:radial-gradient(var(--primary)_1px,transparent_1px)]

            [background-size:24px_24px]
        "
                />


                <div
                    className="
            relative
            z-10

            mx-auto

            grid
            max-w-6xl

            gap-16

            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-center
        "
                >


                    {/* ================================================
            LEFT CONTENT
        ================================================= */}

                    <div>


                        {/* Label */}

                        <div
                            className="
                    flex
                    items-center
                    gap-3
                "
                        >

                            <span
                                className="
                        h-px
                        w-10

                        bg-[var(--secondary)]
                    "
                            />

                            <span
                                className="
                        text-xs
                        font-bold

                        uppercase

                        tracking-[0.2em]

                        text-[var(--secondary)]
                    "
                            >
                                The problem
                            </span>

                        </div>


                        {/* Heading */}

                        <h2
                            className="
                    mt-7

                    max-w-xl

                    text-4xl
                    font-bold

                    leading-[1.08]

                    tracking-[-0.045em]

                    sm:text-5xl
                    lg:text-[3.4rem]
                "
                        >

                            Job preparation shouldn't feel like

                            <span
                                className="
                        relative
                        inline-block

                        text-[var(--secondary)]
                    "
                            >
                                {" "}guesswork

                                <span
                                    className="
                            absolute

                            -bottom-2
                            left-1/2

                            h-2
                            w-[90%]

                            -translate-x-1/2

                            rounded-full

                            bg-[var(--secondary-fixed-dim)]

                            opacity-80
                        "
                                />

                            </span>

                            .

                        </h2>


                        {/* Description */}

                        <p
                            className="
                    mt-7

                    max-w-xl

                    text-base
                    leading-8

                    text-[var(--on-surface-variant)]

                    sm:text-lg
                "
                        >
                            Most people find a job, open ten different tabs, watch random
                            videos, update their resume, and hope they are preparing for
                            the right things.
                        </p>


                        {/* Highlight statement */}

                        <div
                            className="
                    mt-7

                    flex
                    gap-4

                    rounded-2xl

                    border
                    border-[var(--outline-variant)]

                    bg-[var(--surface-container-lowest)]/70

                    p-5
                "
                        >

                            <div
                                className="
                        flex
                        h-11
                        w-11

                        shrink-0
                        items-center
                        justify-center

                        rounded-2xl

                        bg-[var(--primary-fixed)]

                        text-[var(--primary)]
                    "
                            >
                                <Sparkles size={20} />
                            </div>


                            <div>

                                <p
                                    className="
                            text-sm
                            font-bold
                        "
                                >
                                    There should be a clearer way.
                                </p>


                                <p
                                    className="
                            mt-1

                            text-sm
                            leading-6

                            text-[var(--on-surface-variant)]
                        "
                                >
                                    Skillio connects your opportunities, preparation,
                                    resumes, interviews, and applications into one journey.
                                </p>

                            </div>

                        </div>


                        {/* Small bottom text */}

                        <div
                            className="
                    mt-8

                    flex
                    items-center
                    gap-3
                "
                        >

                            <div
                                className="
                        flex
                        h-8
                        w-8

                        items-center
                        justify-center

                        rounded-full

                        bg-[var(--secondary-container)]

                        text-[var(--secondary)]
                    "
                            >
                                <ArrowDownRight size={16} />
                            </div>


                            <p
                                className="
                        text-sm
                        font-medium

                        text-[var(--on-surface-variant)]
                    "
                            >
                                Less scattered information. More intentional progress.
                            </p>

                        </div>

                    </div>



                    {/* ================================================
            RIGHT ARTWORK
        ================================================= */}

                    <div
                        className="
                relative

                mx-auto
                w-full
                max-w-xl
            "
                    >


                        {/* Decorative floating shapes */}

                        <div
                            className="
                    absolute

                    -left-6
                    top-10

                    hidden

                    h-20
                    w-20

                    rotate-12

                    rounded-[1.5rem]

                    bg-[var(--secondary-fixed)]

                    opacity-70

                    lg:block
                "
                        />


                        <div
                            className="
                    absolute

                    -right-6
                    bottom-12

                    hidden

                    h-24
                    w-24

                    rounded-full

                    border
                    border-[var(--primary-fixed-dim)]

                    bg-[var(--primary-fixed)]

                    opacity-70

                    lg:block
                "
                        />


                        {/* Main visual container */}

                        <div
                            className="
                    relative
                    z-10

                    overflow-hidden

                    rounded-[2rem]

                    border
                    border-white/70

                    bg-[var(--surface-container)]

                    p-5

                    shadow-[var(--shadow-lg)]

                    sm:p-7
                "
                        >


                            {/* Top visual heading */}

                            <div
                                className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                            >

                                <div>

                                    <p
                                        className="
                                text-sm
                                font-bold
                            "
                                    >
                                        Your preparation today
                                    </p>


                                    <p
                                        className="
                                mt-1

                                text-sm

                                text-[var(--on-surface-variant)]
                            "
                                    >
                                        Information scattered everywhere.
                                    </p>

                                </div>


                                <div
                                    className="
                            flex
                            h-11
                            w-11

                            items-center
                            justify-center

                            rounded-2xl

                            bg-[var(--secondary-container)]

                            text-[var(--secondary)]
                        "
                                >
                                    <Layers3 size={20} />
                                </div>

                            </div>


                            {/* Divider */}

                            <div
                                className="
                        my-7

                        h-px

                        bg-[var(--outline-variant)]

                        opacity-60
                    "
                            />


                            {/* Problem cards */}

                            <div
                                className="
                        space-y-4
                    "
                            >

                                {[
                                    {
                                        number: "01",
                                        title: "Job requirements",
                                        description:
                                            "Separated from the preparation you're doing.",
                                        icon: BriefcaseBusiness,
                                    },

                                    {
                                        number: "02",
                                        title: "Your resume",
                                        description:
                                            "Updated without clear context for the role.",
                                        icon: FileText,
                                    },

                                    {
                                        number: "03",
                                        title: "Interview preparation",
                                        description:
                                            "Random topics repeated across different sources.",
                                        icon: MessageSquare,
                                    },

                                    {
                                        number: "04",
                                        title: "Applications",
                                        description:
                                            "Lost between spreadsheets, notes, and tabs.",
                                        icon: LayoutDashboard,
                                    },
                                ].map((item) => {

                                    const Icon = item.icon;

                                    return (

                                        <div
                                            key={item.number}

                                            className="
                                    group

                                    relative

                                    flex
                                    items-center
                                    gap-4

                                    rounded-2xl

                                    border
                                    border-transparent

                                    bg-[var(--surface-container-lowest)]

                                    p-4

                                    shadow-[var(--shadow-sm)]

                                    transition-all

                                    hover:-translate-y-1
                                    hover:border-[var(--outline-variant)]
                                    hover:shadow-[var(--shadow-md)]
                                "
                                        >


                                            {/* Number */}

                                            <div
                                                className="
                                        flex
                                        h-10
                                        w-10

                                        shrink-0
                                        items-center
                                        justify-center

                                        rounded-xl

                                        bg-[var(--secondary-container)]

                                        text-xs
                                        font-bold

                                        text-[var(--secondary)]

                                        transition-transform

                                        group-hover:scale-110
                                    "
                                            >
                                                {item.number}
                                            </div>


                                            {/* Content */}

                                            <div
                                                className="
                                        min-w-0
                                        flex-1
                                    "
                                            >

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

                                            text-[var(--on-surface-variant)]
                                        "
                                                >
                                                    {item.description}
                                                </p>

                                            </div>


                                            {/* Icon */}

                                            <div
                                                className="
                                        flex
                                        h-10
                                        w-10

                                        shrink-0
                                        items-center
                                        justify-center

                                        rounded-xl

                                        bg-[var(--surface-container-low)]

                                        text-[var(--on-surface-variant)]

                                        transition-all

                                        group-hover:bg-[var(--primary-fixed)]
                                        group-hover:text-[var(--primary)]
                                    "
                                            >
                                                <Icon size={18} />
                                            </div>

                                        </div>

                                    );

                                })}

                            </div>


                            {/* Chaos indicator */}

                            <div
                                className="
                        mt-6

                        flex
                        items-center
                        gap-3

                        rounded-2xl

                        bg-[var(--secondary-container)]

                        px-5
                        py-4
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

                            bg-white/60

                            text-[var(--secondary)]
                        "
                                >
                                    <AlertCircle size={18} />
                                </div>


                                <div>

                                    <p
                                        className="
                                text-sm
                                font-bold

                                text-[var(--on-secondary-container)]
                            "
                                    >
                                        The result? Too much uncertainty.
                                    </p>


                                    <p
                                        className="
                                mt-0.5

                                text-xs
                                leading-5

                                text-[var(--on-secondary-container)]

                                opacity-80
                            "
                                    >
                                        You spend more time organizing your preparation than
                                        actually preparing.

                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* Floating label */}

                        <div
                            className="
                    absolute

                    -right-4
                    top-1/2

                    hidden

                    -translate-y-1/2

                    rotate-6

                    rounded-2xl

                    border
                    border-white

                    bg-[var(--surface-container-lowest)]

                    px-4
                    py-3

                    shadow-[var(--shadow-md)]

                    lg:block
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
                            h-2
                            w-2

                            rounded-full

                            bg-[var(--secondary)]
                        "
                                />

                                <span
                                    className="
                            text-xs
                            font-bold

                            text-[var(--on-surface-variant)]
                        "
                                >
                                    Scattered workflow
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                HOW IT WORKS
            ================================================= */}

            {/* =================================================
    HOW IT WORKS
================================================= */}

            <section
                id="how-it-works"
                className="
        relative
        overflow-hidden

        px-5
        py-24

        sm:px-8

        lg:px-10
        lg:py-32
    "
            >
                {/* =============================================
        BACKGROUND ARTWORK
    ============================================= */}

                <div
                    className="
            pointer-events-none

            absolute
            inset-0

            overflow-hidden
        "
                >
                    {/* Soft sage glow */}

                    <div
                        className="
                absolute

                left-1/2
                top-1/2

                h-[500px]
                w-[500px]

                -translate-x-1/2
                -translate-y-1/2

                rounded-full

                bg-[var(--primary-fixed)]

                opacity-30

                blur-3xl
            "
                    />


                    {/* Decorative circle */}

                    <div
                        className="
                absolute

                -left-24
                top-24

                hidden

                h-72
                w-72

                rounded-full

                border
                border-[var(--outline-variant)]

                opacity-50

                lg:block
            "
                    />


                    {/* Decorative dots */}

                    <div
                        className="
                absolute

                right-[8%]
                top-[18%]

                hidden

                grid-cols-4
                gap-3

                opacity-30

                lg:grid
            "
                    >
                        {Array.from({ length: 16 }).map((_, index) => (
                            <span
                                key={index}
                                className="
                        h-2
                        w-2

                        rounded-full

                        bg-[var(--primary)]
                    "
                            />
                        ))}
                    </div>
                </div>


                <div
                    className="
            relative
            z-10

            mx-auto
            max-w-6xl
        "
                >

                    {/* =============================================
            HEADER
        ============================================= */}

                    <div
                        className="
                mx-auto
                max-w-3xl

                text-center
            "
                    >

                        {/* Eyebrow */}

                        <div
                            className="
                    inline-flex
                    items-center
                    gap-3
                "
                        >

                            <span
                                className="
                        h-px
                        w-8

                        bg-[var(--primary)]
                    "
                            />

                            <span
                                className="
                        text-sm
                        font-bold

                        uppercase

                        tracking-[0.18em]

                        text-[var(--primary-container)]
                    "
                            >
                                How it works
                            </span>

                            <span
                                className="
                        h-px
                        w-8

                        bg-[var(--primary)]
                    "
                            />

                        </div>


                        {/* Heading */}

                        <h2
                            className="
                    mt-6

                    text-4xl
                    font-bold

                    leading-[1.1]

                    tracking-[-0.04em]

                    sm:text-5xl

                    lg:text-6xl
                "
                        >
                            From scattered preparation to

                            <span
                                className="
                        text-[var(--primary-container)]
                    "
                            >
                                {" "}a clear path forward.
                            </span>

                        </h2>


                        {/* Description */}

                        <p
                            className="
                    mx-auto
                    mt-6

                    max-w-2xl

                    text-base

                    leading-7

                    text-[var(--on-surface-variant)]

                    sm:text-lg
                "
                        >
                            Skillio helps you turn different pieces of your career journey
                            into one connected system — so every step has context and
                            direction.
                        </p>

                    </div>


                    {/* =============================================
            JOURNEY
        ============================================= */}

                    <div
                        className="
                relative

                mt-20
            "
                    >

                        {/* =========================================
                DESKTOP CONNECTION LINE
            ========================================= */}

                        <div
                            className="
                    absolute

                    left-[16%]
                    right-[16%]
                    top-[3.5rem]

                    hidden

                    h-px

                    bg-[var(--outline-variant)]

                    md:block
                "
                        />


                        {/* Animated-looking connection dots */}

                        <div
                            className="
                    absolute

                    left-[31%]
                    top-[3.1rem]

                    hidden

                    h-3
                    w-3

                    rounded-full

                    border-2
                    border-[var(--surface)]

                    bg-[var(--primary)]

                    md:block
                "
                        />


                        <div
                            className="
                    absolute

                    right-[31%]
                    top-[3.1rem]

                    hidden

                    h-3
                    w-3

                    rounded-full

                    border-2
                    border-[var(--surface)]

                    bg-[var(--primary)]

                    md:block
                "
                        />


                        {/* =========================================
                STEPS
            ========================================= */}

                        <div
                            className="
                    grid
                    gap-6

                    md:grid-cols-3
                "
                        >

                            {[
                                {
                                    number: "01",
                                    title: "Build your profile",
                                    description:
                                        "Create your career profile and bring your skills, experience, education, and professional information together.",
                                    icon: Target,
                                    label: "Your foundation",
                                },

                                {
                                    number: "02",
                                    title: "Add your opportunities",
                                    description:
                                        "Create focused job workspaces for the roles you want and understand exactly what each opportunity requires.",
                                    icon: BriefcaseBusiness,
                                    label: "Your direction",
                                },

                                {
                                    number: "03",
                                    title: "Prepare with clarity",
                                    description:
                                        "Use your job context to organize resumes, preparation, interviews, and applications with confidence.",
                                    icon: Sparkles,
                                    label: "Your progress",
                                },
                            ].map((step, index) => {

                                const Icon = step.icon;

                                return (

                                    <article
                                        key={step.number}

                                        className="
                                group

                                relative

                                rounded-[2rem]

                                border
                                border-[var(--outline-variant)]

                                bg-[var(--surface-container-lowest)]

                                p-7

                                shadow-[var(--shadow-sm)]

                                transition-all
                                duration-300

                                hover:-translate-y-2
                                hover:shadow-[var(--shadow-lg)]
                            "
                                    >

                                        {/* =================================
                                TOP ICON AREA
                            ================================= */}

                                        <div
                                            className="
                                    relative

                                    flex
                                    items-center
                                    justify-between
                                "
                                        >

                                            {/* Icon circle */}

                                            <div
                                                className="
                                        relative
                                        z-10

                                        flex

                                        h-16
                                        w-16

                                        items-center
                                        justify-center

                                        rounded-full

                                        border-4
                                        border-[var(--surface-container-low)]

                                        bg-[var(--primary)]

                                        text-white

                                        shadow-[var(--shadow-md)]

                                        transition-all
                                        duration-300

                                        group-hover:scale-110
                                    "
                                            >
                                                <Icon size={25} />
                                            </div>


                                            {/* Large background number */}

                                            <span
                                                className="
                                        font-heading

                                        text-5xl
                                        font-bold

                                        tracking-[-0.06em]

                                        text-[var(--surface-container-high)]

                                        transition-colors

                                        group-hover:text-[var(--primary-fixed)]
                                    "
                                            >
                                                {step.number}
                                            </span>

                                        </div>


                                        {/* =================================
                                LABEL
                            ================================= */}

                                        <div
                                            className="
                                    mt-9

                                    inline-flex
                                    items-center
                                    gap-2
                                "
                                        >

                                            <span
                                                className="
                                        h-2
                                        w-2

                                        rounded-full

                                        bg-[var(--primary)]
                                    "
                                            />

                                            <span
                                                className="
                                        text-xs
                                        font-bold

                                        uppercase

                                        tracking-[0.14em]

                                        text-[var(--primary-container)]
                                    "
                                            >
                                                {step.label}
                                            </span>

                                        </div>


                                        {/* =================================
                                TITLE
                            ================================= */}

                                        <h3
                                            className="
                                    mt-4

                                    text-xl
                                    font-bold

                                    tracking-[-0.025em]

                                    sm:text-2xl
                                "
                                        >
                                            {step.title}
                                        </h3>


                                        {/* =================================
                                DESCRIPTION
                            ================================= */}

                                        <p
                                            className="
                                    mt-4

                                    leading-7

                                    text-[var(--on-surface-variant)]
                                "
                                        >
                                            {step.description}
                                        </p>


                                        {/* =================================
                                BOTTOM STEP INDICATOR
                            ================================= */}

                                        <div
                                            className="
                                    mt-8

                                    flex
                                    items-center
                                    justify-between
                                "
                                        >

                                            <span
                                                className="
                                        text-sm
                                        font-semibold

                                        text-[var(--primary)]
                                    "
                                            >
                                                Step {index + 1}
                                            </span>


                                            <div
                                                className="
                                        flex
                                        items-center
                                        gap-1
                                    "
                                            >

                                                {Array.from(
                                                    { length: 3 }
                                                ).map((_, dotIndex) => (

                                                    <span
                                                        key={dotIndex}

                                                        className={`
                                                h-1.5
                                                rounded-full

                                                transition-all

                                                ${dotIndex <= index
                                                                ? "w-5 bg-[var(--primary)]"
                                                                : "w-1.5 bg-[var(--outline-variant)]"
                                                            }
                                            `}
                                                    />

                                                ))}

                                            </div>

                                        </div>


                                        {/* =================================
                                CARD DECORATION
                            ================================= */}

                                        <div
                                            className="
                                    pointer-events-none

                                    absolute

                                    -bottom-16
                                    -right-16

                                    h-40
                                    w-40

                                    rounded-full

                                    bg-[var(--primary-fixed)]

                                    opacity-0

                                    blur-2xl

                                    transition-opacity
                                    duration-500

                                    group-hover:opacity-50
                                "
                                        />

                                    </article>

                                );

                            })}

                        </div>

                    </div>


                    {/* =============================================
            BOTTOM JOURNEY MESSAGE
        ============================================= */}

                    <div
                        className="
                relative

                mt-16

                overflow-hidden

                rounded-[2rem]

                border
                border-[var(--outline-variant)]

                bg-[var(--primary)]

                px-7
                py-8

                text-white

                shadow-[var(--shadow-lg)]

                sm:px-10
                sm:py-10
            "
                    >

                        {/* Background artwork */}

                        <div
                            className="
                    absolute

                    -right-16
                    -top-24

                    h-64
                    w-64

                    rounded-full

                    border-[30px]
                    border-white/10
                "
                        />


                        <div
                            className="
                    relative

                    flex
                    flex-col

                    gap-6

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
                        >

                            <div>

                                <p
                                    className="
                            text-xl
                            font-bold

                            tracking-[-0.02em]

                            sm:text-2xl
                        "
                                >
                                    Three steps. One connected career system.
                                </p>


                                <p
                                    className="
                            mt-3

                            max-w-2xl

                            leading-7

                            text-white/65
                        "
                                >
                                    Start with where you are today and let Skillio help you
                                    organise where you want to go next.
                                </p>

                            </div>


                            <Link
                                to="/register"

                                className="
                        inline-flex

                        min-h-[52px]

                        shrink-0

                        items-center
                        justify-center
                        gap-2

                        rounded-xl

                        px-6

                        text-sm
                        font-bold

                        transition-all

                        hover:-translate-y-1
                        hover:shadow-lg
                    "

                                style={{
                                    background: "white",
                                    color: "var(--primary)",
                                }}>

                                Start your journey

                                <ArrowRight size={17} />

                            </Link>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                FEATURES
            ================================================= */}

            <section
                id="features"
                className="
        relative
        overflow-hidden

        bg-[var(--surface-container-low)]

        px-5
        py-24

        sm:px-8

        lg:px-10
        lg:py-32
    "
            >

                {/* =====================================================
        BACKGROUND ARTWORK
    ====================================================== */}

                <div
                    className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
        "
                >

                    {/* Top right glow */}

                    <div
                        className="
                absolute

                -right-32
                top-0

                h-[28rem]
                w-[28rem]

                rounded-full

                bg-[var(--primary-fixed)]

                opacity-50

                blur-3xl
            "
                    />


                    {/* Bottom left blush glow */}

                    <div
                        className="
                absolute

                -left-32
                bottom-0

                h-[26rem]
                w-[26rem]

                rounded-full

                bg-[var(--secondary-fixed)]

                opacity-40

                blur-3xl
            "
                    />


                    {/* Decorative grid */}

                    <div
                        className="
                absolute
                right-[5%]
                top-[18%]

                hidden

                h-64
                w-64

                rounded-full

                border
                border-[var(--outline-variant)]

                opacity-50

                lg:block
            "
                    />

                    <div
                        className="
                absolute
                right-[9%]
                top-[23%]

                hidden

                h-44
                w-44

                rounded-full

                border
                border-[var(--outline-variant)]

                opacity-40

                lg:block
            "
                    />


                    {/* Small decorative dots */}

                    <div
                        className="
                absolute
                left-[8%]
                top-[30%]

                hidden

                h-3
                w-3

                rounded-full

                bg-[var(--primary)]

                opacity-30

                lg:block
            "
                    />

                    <div
                        className="
                absolute
                left-[12%]
                top-[35%]

                hidden

                h-2
                w-2

                rounded-full

                bg-[var(--primary)]

                opacity-30

                lg:block
            "
                    />

                </div>



                <div
                    className="
            relative
            z-10

            mx-auto
            max-w-6xl
        "
                >

                    {/* =====================================================
            HEADER
        ====================================================== */}

                    <div
                        className="
                grid
                gap-10

                lg:grid-cols-[1.25fr_0.75fr]
                lg:items-end
            "
                    >

                        {/* Left content */}

                        <div
                            className="
                    max-w-3xl
                "
                        >

                            {/* Eyebrow */}

                            <div
                                className="
                        inline-flex
                        items-center
                        gap-3
                    "
                            >

                                <span
                                    className="
                            flex
                            h-8
                            w-8

                            items-center
                            justify-center

                            rounded-full

                            bg-[var(--primary-fixed)]
                        "
                                >

                                    <span
                                        className="
                                h-2
                                w-2

                                rounded-full

                                bg-[var(--primary)]
                            "
                                    />

                                </span>


                                <span
                                    className="
                            text-sm
                            font-bold

                            uppercase

                            tracking-[0.18em]

                            text-[var(--primary-container)]
                        "
                                >
                                    Everything connected
                                </span>

                            </div>



                            {/* Heading */}

                            <h2
                                className="
                        mt-7

                        text-4xl
                        font-bold

                        leading-[1.08]

                        tracking-[-0.045em]

                        sm:text-5xl

                        lg:text-6xl
                    "
                            >

                                Everything you need to manage your

                                <span
                                    className="
                            block

                            text-[var(--primary-container)]
                        "
                                >
                                    career journey.
                                </span>

                            </h2>

                        </div>



                        {/* Right description */}

                        <div
                            className="
                    lg:pb-2
                "
                        >

                            <div
                                className="
                        border-l-2
                        border-[var(--primary)]

                        pl-5
                    "
                            >

                                <p
                                    className="
                            max-w-md

                            text-base
                            leading-7

                            text-[var(--on-surface-variant)]

                            sm:text-lg
                            sm:leading-8
                        "
                                >
                                    From building your professional profile to preparing for
                                    interviews and tracking applications, Skillio keeps every
                                    important part of your career in one connected system.
                                </p>

                            </div>

                        </div>

                    </div>



                    {/* =====================================================
            FEATURE CARDS
        ====================================================== */}

                    <div
                        className="
                mt-16

                grid
                auto-rows-fr
                gap-5

                md:grid-cols-2

                lg:grid-cols-3
            "
                    >

                        {features.map((feature, index) => {

                            const Icon = feature.icon;

                            const isFeatured = index === 0;

                            return (

                                <article
                                    key={feature.title}

                                    className={`
                            group

                            relative
                            flex
                            h-full
                            flex-col

                            overflow-hidden

                            rounded-[2rem]

                            border
                            border-[var(--outline-variant)]

                            bg-[var(--surface-container-lowest)]

                            p-7

                            shadow-[var(--shadow-sm)]

                            transition-all
                            duration-300

                            hover:-translate-y-2
                            hover:shadow-[var(--shadow-lg)]

                            ${isFeatured
                                            ? "md:col-span-2 lg:col-span-2"
                                            : ""
                                        }
                        `}
                                >


                                    {/* =====================================
                            CARD BACKGROUND ARTWORK
                        ====================================== */}

                                    <div
                                        className={`
                                pointer-events-none

                                absolute

                                -right-16
                                -top-16

                                h-52
                                w-52

                                rounded-full

                                opacity-50

                                blur-3xl

                                transition-transform
                                duration-500

                                group-hover:scale-125

                                ${feature.accent === "secondary"
                                                ? "bg-[var(--secondary-fixed)]"
                                                : "bg-[var(--primary-fixed)]"
                                            }
                            `}
                                    />


                                    {/* Decorative ring */}

                                    <div
                                        className="
                                pointer-events-none

                                absolute

                                -bottom-20
                                -right-20

                                h-44
                                w-44

                                rounded-full

                                border-[18px]

                                border-[var(--surface-container)]

                                opacity-70

                                transition-transform
                                duration-500

                                group-hover:scale-110
                            "
                                    />


                                    {/* =====================================
                            CARD CONTENT
                        ====================================== */}

                                    <div
                                        className="
                                relative
                                z-10

                                flex
                                h-full
                                flex-col
                            "
                                    >


                                        {/* TOP */}

                                        <div
                                            className="
                                    flex
                                    items-start
                                    justify-between
                                    gap-5
                                "
                                        >

                                            {/* Icon */}

                                            <div
                                                className={`
                                        flex

                                        h-14
                                        w-14

                                        shrink-0

                                        items-center
                                        justify-center

                                        rounded-2xl

                                        text-white

                                        shadow-[var(--shadow-md)]

                                        transition-all
                                        duration-300

                                        group-hover:rotate-3
                                        group-hover:scale-105

                                        ${feature.accent === "secondary"
                                                        ? "bg-[var(--secondary)]"
                                                        : "bg-[var(--primary)]"
                                                    }
                                    `}
                                            >

                                                <Icon size={24} />

                                            </div>



                                            {/* Number */}

                                            <span
                                                className="
                                        text-4xl
                                        font-bold

                                        tracking-[-0.06em]

                                        text-[var(--outline-variant)]

                                        transition-colors

                                        group-hover:text-[var(--primary-fixed-dim)]
                                    "
                                            >
                                                {String(index + 1).padStart(2, "0")}
                                            </span>

                                        </div>



                                        {/* TEXT */}

                                        <h3
                                            className="
                                    mt-8

                                    text-xl
                                    font-bold

                                    tracking-[-0.025em]

                                    sm:text-2xl
                                "
                                        >
                                            {feature.title}
                                        </h3>


                                        <p
                                            className="
                                    mt-4

                                    max-w-xl

                                    leading-7

                                    text-[var(--on-surface-variant)]
                                "
                                        >
                                            {feature.description}
                                        </p>



                                        {/* FEATURED CARD EXTRA CONTENT */}

                                        {isFeatured && (

                                            <div
                                                className="
                                        mt-7

                                        flex
                                        flex-wrap

                                        gap-2
                                    "
                                            >

                                                {[
                                                    "Skills",
                                                    "Projects",
                                                    "Experience",
                                                    "Career goals",
                                                ].map((item) => (

                                                    <span
                                                        key={item}

                                                        className="
                                                rounded-full

                                                bg-[var(--surface-container)]

                                                px-4
                                                py-2

                                                text-xs
                                                font-bold

                                                text-[var(--primary)]
                                            "
                                                    >
                                                        {item}
                                                    </span>

                                                ))}

                                            </div>

                                        )}



                                        {/* PUSHED TO BOTTOM */}

                                        <div
                                            className="
                                    mt-auto

                                    pt-8

                                    flex
                                    items-center
                                    gap-3

                                    text-sm
                                    font-bold

                                    text-[var(--primary)]
                                "
                                        >

                                            <span>
                                                Explore feature
                                            </span>


                                            <div
                                                className="
                                        flex

                                        h-9
                                        w-9

                                        items-center
                                        justify-center

                                        rounded-full

                                        bg-[var(--primary-fixed)]

                                        transition-all
                                        duration-300

                                        group-hover:translate-x-1
                                        group-hover:-translate-y-1
                                    "
                                            >

                                                <ArrowUpRight size={17} />

                                            </div>

                                        </div>

                                    </div>

                                </article>

                            );

                        })}

                    </div>



                    {/* =====================================================
            BOTTOM MESSAGE
        ====================================================== */}

                    <div
                        className="
                mt-14

                flex
                flex-col

                items-start
                justify-between

                gap-6

                rounded-[2rem]

                border
                border-[var(--outline-variant)]

                bg-white/60

                p-7

                backdrop-blur

                sm:flex-row
                sm:items-center
            "
                    >

                        <div>

                            <p
                                className="
                        text-lg
                        font-bold
                    "
                            >
                                Your career shouldn't live across ten different tools.
                            </p>


                            <p
                                className="
                        mt-2

                        text-sm
                        leading-6

                        text-[var(--on-surface-variant)]
                    "
                            >
                                Skillio connects your opportunities, preparation, progress,
                                and decisions into one clear journey.
                            </p>

                        </div>


                        <div
                            className="
                    flex
                    shrink-0
                    items-center
                    gap-2

                    rounded-full

                    bg-[var(--primary)]

                    px-5
                    py-3

                    text-sm
                    font-bold

                    text-white
                "
                        >

                            One connected journey

                            <ArrowUpRight size={16} />

                        </div>

                    </div>

                </div>

            </section>


            <section
                id="career-coach"
                className="
        relative
        overflow-hidden

        px-5
        py-20

        sm:px-8

        lg:px-10
        lg:py-32
    "
            >
                {/* ================================================
        BACKGROUND ARTWORK
    ================================================= */}

                <div
                    className="
            pointer-events-none
            absolute

            left-[-8rem]
            top-1/2

            h-72
            w-72

            -translate-y-1/2

            rounded-full

            bg-[var(--secondary-fixed)]

            opacity-40
            blur-3xl
        "
                />

                <div
                    className="
            pointer-events-none
            absolute

            right-[-6rem]
            top-20

            h-80
            w-80

            rounded-full

            bg-[var(--primary-fixed)]

            opacity-50
            blur-3xl
        "
                />


                {/* Decorative grid */}

                <div
                    className="
            pointer-events-none
            absolute
            inset-0

            opacity-[0.035]

            [background-image:linear-gradient(var(--primary)_1px,transparent_1px),linear-gradient(90deg,var(--primary)_1px,transparent_1px)]

            [background-size:48px_48px]
        "
                />


                <div
                    className="
            relative
            z-10

            mx-auto

            grid
            max-w-6xl

            gap-16

            lg:grid-cols-[0.9fr_1.1fr]
            lg:items-center
        "
                >


                    {/* ================================================
            CONTENT
        ================================================= */}

                    <div
                        className="
                relative
            "
                    >

                        {/* Small decorative line */}

                        <div
                            className="
                    mb-7

                    flex
                    items-center
                    gap-3
                "
                        >

                            <span
                                className="
                        h-px
                        w-10

                        bg-[var(--primary)]
                    "
                            />

                            <span
                                className="
                        text-xs
                        font-bold

                        uppercase

                        tracking-[0.2em]

                        text-[var(--primary-container)]
                    "
                            >
                                AI career intelligence
                            </span>

                        </div>


                        {/* Badge */}

                        <div
                            className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-[var(--secondary-fixed-dim)]

                    bg-[var(--secondary-container)]

                    px-4
                    py-2.5

                    text-sm
                    font-semibold

                    text-[var(--on-secondary-container)]

                    shadow-[var(--shadow-sm)]
                "
                        >

                            <div
                                className="
                        flex
                        h-7
                        w-7

                        items-center
                        justify-center

                        rounded-full

                        bg-white/70

                        text-[var(--secondary)]
                    "
                            >
                                <Bot size={15} />
                            </div>

                            Your intelligent career companion

                        </div>


                        {/* Heading */}

                        <h2
                            className="
                    mt-7

                    max-w-xl

                    text-4xl
                    font-bold

                    leading-[1.08]

                    tracking-[-0.045em]

                    sm:text-5xl
                    lg:text-[3.4rem]
                "
                        >

                            Career guidance that brings

                            <span
                                className="
                        relative
                        inline-block

                        text-[var(--primary-container)]
                    "
                            >
                                {" "}clarity

                                <span
                                    className="
                            absolute

                            -bottom-2
                            left-1/2

                            h-2
                            w-[85%]

                            -translate-x-1/2

                            rounded-full

                            bg-[var(--primary-fixed-dim)]

                            opacity-70
                        "
                                />

                            </span>

                            {" "}to your next move.

                        </h2>


                        {/* Description */}

                        <p
                            className="
                    mt-7

                    max-w-xl

                    text-base
                    leading-8

                    text-[var(--on-surface-variant)]

                    sm:text-lg
                "
                        >
                            Skillio Coach understands the context of your career journey,
                            helping you think through decisions, prepare smarter, and focus
                            on what matters most.
                        </p>


                        {/* Benefits */}

                        <div
                            className="
                    mt-9

                    grid
                    gap-4

                    sm:grid-cols-2
                "
                        >

                            {[
                                {
                                    title: "Contextual guidance",
                                    description:
                                        "Advice connected to your career journey.",
                                },
                                {
                                    title: "Clear priorities",
                                    description:
                                        "Understand what deserves attention next.",
                                },
                                {
                                    title: "Smarter preparation",
                                    description:
                                        "Think through interviews and opportunities.",
                                },
                                {
                                    title: "Connected journey",
                                    description:
                                        "Keep your career information working together.",
                                },
                            ].map((item) => (

                                <div
                                    key={item.title}

                                    className="
                            group

                            flex
                            gap-3

                            rounded-2xl

                            border
                            border-transparent

                            bg-[var(--surface-container-lowest)]/70

                            p-4

                            transition-all

                            hover:-translate-y-0.5
                            hover:border-[var(--outline-variant)]
                            hover:shadow-[var(--shadow-sm)]
                        "
                                >

                                    <div
                                        className="
                                mt-0.5

                                flex
                                h-8
                                w-8

                                shrink-0
                                items-center
                                justify-center

                                rounded-xl

                                bg-[var(--primary-fixed)]

                                text-[var(--primary)]

                                transition-transform

                                group-hover:scale-110
                            "
                                    >
                                        <Check size={16} strokeWidth={2.5} />
                                    </div>


                                    <div>

                                        <p
                                            className="
                                    text-sm
                                    font-bold

                                    text-[var(--on-surface)]
                                "
                                        >
                                            {item.title}
                                        </p>


                                        <p
                                            className="
                                    mt-1

                                    text-xs
                                    leading-5

                                    text-[var(--on-surface-variant)]
                                "
                                        >
                                            {item.description}
                                        </p>

                                    </div>

                                </div>

                            ))}

                        </div>


                        {/* Bottom mini trust text */}

                        <div
                            className="
                    mt-8

                    flex
                    items-center
                    gap-3

                    text-sm

                    text-[var(--on-surface-variant)]
                "
                        >

                            <div
                                className="
                        flex
                        -space-x-2
                    "
                            >

                                {[1, 2, 3].map((item) => (

                                    <div
                                        key={item}

                                        className="
                                flex
                                h-7
                                w-7

                                items-center
                                justify-center

                                rounded-full

                                border-2
                                border-[var(--background)]

                                bg-[var(--surface-container-high)]

                                text-[10px]
                                font-bold

                                text-[var(--primary)]
                            "
                                    >
                                        ✦
                                    </div>

                                ))}

                            </div>


                            <span>
                                Your career context, connected in one place.
                            </span>

                        </div>

                    </div>



                    {/* ================================================
            CHAT ARTWORK
        ================================================= */}

                    <div
                        className="
                relative

                mx-auto
                w-full
                max-w-xl
            "
                    >


                        {/* Floating decoration */}

                        <div
                            className="
                    absolute

                    -right-3
                    -top-5

                    hidden

                    h-20
                    w-20

                    rotate-12

                    rounded-[1.5rem]

                    border
                    border-white/70

                    bg-[var(--primary-fixed)]

                    opacity-80

                    shadow-[var(--shadow-md)]

                    lg:block
                "
                        />


                        <div
                            className="
                    absolute

                    -bottom-6
                    -left-5

                    hidden

                    h-24
                    w-24

                    rounded-full

                    border
                    border-[var(--secondary-fixed-dim)]

                    bg-[var(--secondary-fixed)]

                    opacity-60

                    blur-[1px]

                    lg:block
                "
                        />


                        {/* Main outer frame */}

                        <div
                            className="
                    relative
                    z-10

                    rounded-[2rem]

                    border
                    border-white/70

                    bg-[var(--surface-container)]

                    p-3

                    shadow-[var(--shadow-lg)]

                    sm:p-5
                "
                        >


                            {/* Window */}

                            <div
                                className="
                        overflow-hidden

                        rounded-[1.6rem]

                        border
                        border-black/[0.04]

                        bg-[var(--surface-container-lowest)]
                    "
                            >


                                {/* ====================================
                        CHAT HEADER
                    ===================================== */}

                                <div
                                    className="
                            flex
                            items-center
                            justify-between
                            gap-4

                            border-b
                            border-black/[0.05]

                            px-5
                            py-4

                            sm:px-6
                        "
                                >

                                    <div
                                        className="
                                flex
                                items-center
                                gap-3
                            "
                                    >

                                        <div
                                            className="
                                    relative

                                    flex
                                    h-12
                                    w-12

                                    items-center
                                    justify-center

                                    rounded-2xl

                                    bg-[var(--primary)]

                                    text-white

                                    shadow-[var(--shadow-sm)]
                                "
                                        >

                                            <Bot size={21} />


                                            <span
                                                className="
                                        absolute

                                        -bottom-1
                                        -right-1

                                        h-3.5
                                        w-3.5

                                        rounded-full

                                        border-2
                                        border-white

                                        bg-emerald-400
                                    "
                                            />

                                        </div>


                                        <div>

                                            <div
                                                className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                            >

                                                <p
                                                    className="
                                            font-bold

                                            tracking-[-0.01em]
                                        "
                                                >
                                                    Skillio Coach
                                                </p>


                                                <span
                                                    className="
                                            rounded-full

                                            bg-[var(--primary-fixed)]

                                            px-2
                                            py-0.5

                                            text-[9px]
                                            font-bold

                                            uppercase

                                            tracking-wider

                                            text-[var(--primary)]
                                        "
                                                >
                                                    AI
                                                </span>

                                            </div>


                                            <p
                                                className="
                                        mt-0.5

                                        text-xs

                                        text-[var(--on-surface-variant)]
                                    "
                                            >
                                                Career intelligence assistant
                                            </p>

                                        </div>

                                    </div>


                                    <div
                                        className="
                                hidden

                                items-center
                                gap-2

                                rounded-full

                                bg-[var(--surface-container-low)]

                                px-3
                                py-1.5

                                text-xs
                                font-semibold

                                text-[var(--primary)]

                                sm:flex
                            "
                                    >

                                        <span
                                            className="
                                    h-2
                                    w-2

                                    rounded-full

                                    bg-emerald-500
                                "
                                        />

                                        Online

                                    </div>

                                </div>



                                {/* ====================================
                        CHAT CONTENT
                    ===================================== */}

                                <div
                                    className="
                            space-y-6

                            p-5

                            sm:p-7
                        "
                                >


                                    {/* Date */}

                                    <div
                                        className="
                                flex
                                items-center
                                gap-3
                            "
                                    >

                                        <div
                                            className="
                                    h-px
                                    flex-1

                                    bg-[var(--outline-variant)]
                                    opacity-50
                                "
                                        />

                                        <span
                                            className="
                                    text-[10px]
                                    font-semibold

                                    uppercase

                                    tracking-wider

                                    text-[var(--on-surface-variant)]

                                    opacity-60
                                "
                                        >
                                            Career preparation
                                        </span>

                                        <div
                                            className="
                                    h-px
                                    flex-1

                                    bg-[var(--outline-variant)]
                                    opacity-50
                                "
                                        />

                                    </div>



                                    {/* User message */}

                                    <div
                                        className="
                                flex
                                justify-end
                            "
                                    >

                                        <div
                                            className="
                                    max-w-[82%]

                                    rounded-2xl
                                    rounded-tr-md

                                    bg-[var(--primary)]

                                    px-4
                                    py-3.5

                                    text-sm
                                    leading-6

                                    text-white

                                    shadow-sm
                                "
                                        >
                                            What should I focus on for my next interview?

                                        </div>

                                    </div>



                                    {/* AI Response */}

                                    <div
                                        className="
                                flex
                                items-end
                                gap-3
                            "
                                    >

                                        <div
                                            className="
                                    flex
                                    h-8
                                    w-8

                                    shrink-0
                                    items-center
                                    justify-center

                                    rounded-xl

                                    bg-[var(--primary-fixed)]

                                    text-[var(--primary)]
                                "
                                        >
                                            <Bot size={15} />
                                        </div>


                                        <div
                                            className="
                                    max-w-[88%]

                                    rounded-2xl
                                    rounded-bl-md

                                    bg-[var(--surface-container-low)]

                                    px-5
                                    py-4

                                    text-sm
                                    leading-6

                                    text-[var(--on-surface-variant)]
                                "
                                        >

                                            <p>
                                                Based on your current job workspace, I would
                                                prioritize these three areas:
                                            </p>


                                            <div
                                                className="
                                        mt-4

                                        space-y-2
                                    "
                                            >

                                                {[
                                                    "React architecture and component design",
                                                    "API and backend fundamentals",
                                                    "Explaining your projects clearly",
                                                ].map((item, index) => (

                                                    <div
                                                        key={item}

                                                        className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                                    >

                                                        <span
                                                            className="
                                                    flex
                                                    h-6
                                                    w-6

                                                    shrink-0
                                                    items-center
                                                    justify-center

                                                    rounded-lg

                                                    bg-[var(--surface-container-lowest)]

                                                    text-[11px]
                                                    font-bold

                                                    text-[var(--primary)]
                                                "
                                                        >
                                                            {index + 1}
                                                        </span>


                                                        <span>
                                                            {item}
                                                        </span>

                                                    </div>

                                                ))}

                                            </div>

                                        </div>

                                    </div>



                                    {/* Recommendation card */}

                                    <div
                                        className="
                                ml-11

                                rounded-2xl

                                border
                                border-[var(--primary-fixed-dim)]

                                bg-[var(--primary-fixed)]

                                p-4
                            "
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
                                        h-8
                                        w-8

                                        shrink-0
                                        items-center
                                        justify-center

                                        rounded-xl

                                        bg-white/70

                                        text-[var(--primary)]
                                    "
                                            >
                                                <Sparkles size={16} />
                                            </div>


                                            <div>

                                                <p
                                                    className="
                                            text-xs
                                            font-bold

                                            text-[var(--on-primary-fixed)]
                                        "
                                                >
                                                    Coach recommendation
                                                </p>


                                                <p
                                                    className="
                                            mt-1

                                            text-xs
                                            leading-5

                                            text-[var(--on-primary-fixed-variant)]
                                        "
                                                >
                                                    Start with React architecture — it is the
                                                    strongest area to improve before your
                                                    interview.

                                                </p>

                                            </div>

                                        </div>

                                    </div>



                                    {/* Typing */}

                                    <div
                                        className="
                                flex
                                items-center
                                gap-2

                                pl-11
                            "
                                    >

                                        <span
                                            className="
                                    text-xs

                                    text-[var(--on-surface-variant)]

                                    opacity-60
                                "
                                        >
                                            Coach is thinking

                                        </span>


                                        <div
                                            className="
                                    flex
                                    gap-1
                                "
                                        >

                                            <span
                                                className="
                                        h-1.5
                                        w-1.5

                                        animate-bounce

                                        rounded-full

                                        bg-[var(--primary-fixed-dim)]
                                    "
                                            />

                                            <span
                                                className="
                                        h-1.5
                                        w-1.5

                                        animate-bounce

                                        rounded-full

                                        bg-[var(--primary-fixed-dim)]

                                        [animation-delay:150ms]
                                    "
                                            />

                                            <span
                                                className="
                                        h-1.5
                                        w-1.5

                                        animate-bounce

                                        rounded-full

                                        bg-[var(--primary-fixed-dim)]

                                        [animation-delay:300ms]
                                    "
                                            />

                                        </div>

                                    </div>

                                </div>



                                {/* ====================================
                        INPUT AREA
                    ===================================== */}

                                <div
                                    className="
                            border-t
                            border-black/[0.05]

                            bg-[var(--surface-container-low)]

                            p-4
                        "
                                >

                                    <div
                                        className="
                                flex
                                items-center
                                gap-3

                                rounded-2xl

                                bg-[var(--surface-container-lowest)]

                                px-4
                                py-3

                                shadow-sm
                            "
                                    >

                                        <span
                                            className="
                                    flex-1

                                    text-sm

                                    text-[var(--on-surface-variant)]

                                    opacity-60
                                "
                                        >
                                            Ask your Career Coach anything...

                                        </span>


                                        <div
                                            className="
                                    flex
                                    h-8
                                    w-8

                                    items-center
                                    justify-center

                                    rounded-xl

                                    bg-[var(--primary)]

                                    text-white
                                "
                                        >
                                            <ArrowUpRight size={16} />
                                        </div>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =================================================
                CAREER INSIGHTS
            ================================================= */}


            <section className="
        relative
        overflow-hidden
        bg-[var(--primary)]
        px-5
        py-24
        text-white
        sm:px-8
        lg:px-10
        lg:py-32
    "
            >
                {/* =============================================
                BACKGROUND ARTWORK
            ============================================= */}

                <div
                    className="
            pointer-events-none
            absolute
            inset-0
            overflow-hidden
        "
                >
                    {/* Large organic circle */}

                    <div
                        className="
                absolute
                -right-32
                -top-40
                h-[520px]
                w-[520px]
                rounded-full
                bg-[var(--primary-container)]
                opacity-70
                blur-[2px]
            "
                    />

                    {/* Secondary glow */}

                    <div
                        className="
                absolute
                -bottom-40
                -left-32
                h-[420px]
                w-[420px]
                rounded-full
                bg-[var(--secondary)]
                opacity-20
                blur-3xl
            "
                    />

                    {/* Small decorative circle */}

                    <div
                        className="
                absolute
                left-[48%]
                top-20
                h-32
                w-32
                rounded-full
                border
                border-white/10
            "
                    />

                    {/* Dot pattern */}

                    <div
                        className="
                absolute
                inset-0
                opacity-[0.06]
            "
                        style={{
                            backgroundImage:
                                "radial-gradient(circle, white 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    />
                </div>

                {/* =============================================
        CONTENT
    ============================================= */}

                <div
                    className="
            relative
            z-10
            mx-auto
            grid
            max-w-6xl
            items-center
            gap-16
            lg:grid-cols-[0.9fr_1.1fr]
            lg:gap-20
        "
                >
                    {/* =========================================
            LEFT CONTENT
        ========================================= */}

                    <div className="max-w-xl">
                        {/* Eyebrow */}

                        <div
                            className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/15
                    bg-white/[0.07]
                    px-4
                    py-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-white/70
                    backdrop-blur-sm
                "
                        >
                            <span
                                className="
                        h-2
                        w-2
                        rounded-full
                        bg-[var(--primary-fixed)]
                    "
                            />

                            Career Intelligence
                        </div>

                        {/* Heading */}

                        <h2
                            className="
                    mt-7
                    font-[var(--font-heading)]
                    text-4xl
                    font-bold
                    leading-[1.08]
                    tracking-[-0.045em]
                    sm:text-5xl
                    lg:text-6xl
                "
                        >
                            See your career journey
                            <span
                                className="
                        block
                        text-[var(--primary-fixed)]
                    "
                            >
                                more clearly.
                            </span>
                        </h2>

                        {/* Description */}

                        <p
                            className="
                    mt-7
                    max-w-lg
                    text-base
                    leading-8
                    text-white/65
                    sm:text-lg
                "
                        >
                            Skillio turns your career activity into meaningful insights,
                            helping you understand your progress, identify opportunities,
                            and focus on what deserves your attention next.
                        </p>

                        {/* Small benefits */}

                        <div
                            className="
                    mt-8
                    grid
                    gap-4
                    sm:grid-cols-2
                "
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-white/10
                            text-[var(--primary-fixed)]
                        "
                                >
                                    📈
                                </div>

                                <div>
                                    <p className="text-sm font-bold">
                                        Track progress
                                    </p>

                                    <p className="mt-1 text-xs text-white/50">
                                        Understand your growth
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div
                                    className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-white/10
                            text-[var(--primary-fixed)]
                        "
                                >
                                    🎯
                                </div>

                                <div>
                                    <p className="text-sm font-bold">
                                        Know what matters
                                    </p>

                                    <p className="mt-1 text-xs text-white/50">
                                        Focus on next steps
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}

                        <div className="mt-10">
                            <Link
                                to="/register"
                                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl px-7 text-sm font-bold transition-all hover:-translate-y-1"
                                style={{
                                    background: "white",
                                    color: "var(--primary)",
                                }}>
                                Start your journey

                                <ArrowRight
                                    size={18}
                                    className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                        "
                                />
                            </Link>
                        </div>
                    </div>

                    {/* =========================================
            RIGHT — CAREER INSIGHTS ARTWORK
        ========================================= */}

                    <div
                        className="
                relative
                mx-auto
                w-full
                max-w-[620px]
            "
                    >
                        {/* Main dashboard */}

                        <div
                            className="
                    relative
                    overflow-hidden
                    rounded-[2rem]
                    border
                    border-white/15
                    bg-white/[0.09]
                    p-5
                    shadow-2xl
                    backdrop-blur-xl
                    sm:p-7
                "
                        >
                            {/* Dashboard Header */}

                            <div
                                className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                            >
                                <div>
                                    <p
                                        className="
                                text-xs
                                font-semibold
                                uppercase
                                tracking-[0.14em]
                                text-white/45
                            "
                                    >
                                        Your career overview
                                    </p>

                                    <h3
                                        className="
                                mt-2
                                font-[var(--font-heading)]
                                text-xl
                                font-bold
                                sm:text-2xl
                            "
                                    >
                                        You're making progress ✨
                                    </h3>
                                </div>

                                <div
                                    className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[var(--primary-fixed)]
                            text-lg
                        "
                                >
                                    🚀
                                </div>
                            </div>

                            {/* Stats */}

                            <div
                                className="
                        mt-7
                        grid
                        grid-cols-3
                        gap-3
                    "
                            >
                                <div
                                    className="
                            rounded-2xl
                            bg-white/[0.09]
                            p-4
                            backdrop-blur-sm
                        "
                                >
                                    <p className="text-xs text-white/45">
                                        Applications
                                    </p>

                                    <p className="mt-2 text-2xl font-bold">
                                        12
                                    </p>

                                    <p className="mt-1 text-xs text-white/50">
                                        +3 this week
                                    </p>
                                </div>

                                <div
                                    className="
                            rounded-2xl
                            bg-white/[0.09]
                            p-4
                            backdrop-blur-sm
                        "
                                >
                                    <p className="text-xs text-white/45">
                                        Interviews
                                    </p>

                                    <p className="mt-2 text-2xl font-bold">
                                        04
                                    </p>

                                    <p className="mt-1 text-xs text-white/50">
                                        Upcoming
                                    </p>
                                </div>

                                <div
                                    className="
                            rounded-2xl
                            bg-white/[0.09]
                            p-4
                            backdrop-blur-sm
                        "
                                >
                                    <p className="text-xs text-white/45">
                                        Progress
                                    </p>

                                    <p className="mt-2 text-2xl font-bold">
                                        78%
                                    </p>

                                    <p className="mt-1 text-xs text-white/50">
                                        This month
                                    </p>
                                </div>
                            </div>

                            {/* Career Progress */}

                            <div
                                className="
                        mt-5
                        rounded-2xl
                        bg-white/[0.08]
                        p-5
                    "
                            >
                                <div
                                    className="
                            flex
                            items-center
                            justify-between
                        "
                                >
                                    <div>
                                        <p className="text-sm font-bold">
                                            Career readiness
                                        </p>

                                        <p className="mt-1 text-xs text-white/45">
                                            Your preparation is improving
                                        </p>
                                    </div>

                                    <span
                                        className="
                                text-lg
                                font-bold
                                text-[var(--primary-fixed)]
                            "
                                    >
                                        78%
                                    </span>
                                </div>

                                {/* Progress */}

                                <div
                                    className="
                            mt-4
                            h-2
                            overflow-hidden
                            rounded-full
                            bg-black/15
                        "
                                >
                                    <div
                                        className="
                                h-full
                                w-[78%]
                                rounded-full
                                bg-[var(--primary-fixed)]
                            "
                                    />
                                </div>
                            </div>

                            {/* Bottom cards */}

                            <div
                                className="
                        mt-5
                        grid
                        gap-4
                        sm:grid-cols-2
                    "
                            >
                                {/* Priority */}

                                <div
                                    className="
                            rounded-2xl
                            bg-[var(--secondary-fixed)]
                            p-5
                            text-[var(--on-secondary-fixed)]
                        "
                                >
                                    <div
                                        className="
                                flex
                                items-center
                                justify-between
                            "
                                    >
                                        <span className="text-lg">
                                            🎯
                                        </span>

                                        <span
                                            className="
                                    rounded-full
                                    bg-black/5
                                    px-2
                                    py-1
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-wider
                                "
                                        >
                                            Priority
                                        </span>
                                    </div>

                                    <p
                                        className="
                                mt-5
                                text-sm
                                font-bold
                            "
                                    >
                                        Prepare for your interview
                                    </p>

                                    <p
                                        className="
                                mt-2
                                text-xs
                                leading-5
                                opacity-65
                            "
                                    >
                                        You have an upcoming interview in 2 days.
                                    </p>
                                </div>

                                {/* Next opportunity */}

                                <div
                                    className="
                            rounded-2xl
                            bg-white/[0.09]
                            p-5
                        "
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="
                                    flex
                                    h-10
                                    w-10
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-white/10
                                "
                                        >
                                            💼
                                        </div>

                                        <div>
                                            <p className="text-sm font-bold">
                                                Next opportunity
                                            </p>

                                            <p className="mt-1 text-xs text-white/45">
                                                Frontend Developer
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        className="
                                mt-6
                                flex
                                items-center
                                justify-between
                            "
                                    >
                                        <span className="text-xs text-white/45">
                                            Interview
                                        </span>

                                        <span
                                            className="
                                    rounded-full
                                    bg-white/10
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                "
                                        >
                                            Tomorrow
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* =====================================
                FLOATING CARD — TOP
            ===================================== */}

                        <div
                            className="
                    absolute
                    -right-5
                    -top-7
                    hidden
                    rotate-6
                    rounded-2xl
                    border
                    border-white/20
                    bg-white/[0.12]
                    p-4
                    shadow-xl
                    backdrop-blur-xl
                    md:block
                "
                        >
                            <p className="text-xs text-white/55">
                                Weekly momentum
                            </p>

                            <div className="mt-3 flex items-end gap-1">
                                <div className="h-4 w-2 rounded-full bg-white/30" />
                                <div className="h-7 w-2 rounded-full bg-white/40" />
                                <div className="h-5 w-2 rounded-full bg-white/40" />
                                <div className="h-9 w-2 rounded-full bg-[var(--primary-fixed)]" />
                                <div className="h-12 w-2 rounded-full bg-[var(--primary-fixed)]" />
                            </div>
                        </div>

                        {/* =====================================
                FLOATING CARD — BOTTOM
            ===================================== */}

                        <div
                            className="
                    absolute
                    -bottom-7
                    -left-8
                    hidden
                    items-center
                    gap-3
                    rounded-2xl
                    border
                    border-white/15
                    bg-white/[0.12]
                    px-4
                    py-3
                    shadow-xl
                    backdrop-blur-xl
                    sm:flex
                "
                        >
                            <div
                                className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--primary-fixed)]
                    "
                            >
                                ✨
                            </div>

                            <div>
                                <p className="text-xs font-bold">
                                    Great progress!
                                </p>

                                <p className="mt-1 text-[11px] text-white/50">
                                    You're moving forward
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* =================================================
                FAQ
            ================================================= */}

            <section
                id="faq"
                className="
        relative
        overflow-hidden

        bg-[var(--surface)]

        px-5
        py-24

        sm:px-8

        lg:px-10
        lg:py-32
    "
            >
                {/* =============================================
        BACKGROUND ARTWORK
    ============================================= */}

                {/* Large sage organic shape */}

                <div
                    className="
            pointer-events-none

            absolute
            -left-40
            top-20

            h-[420px]
            w-[420px]

            rounded-full

            bg-[var(--primary-fixed)]

            opacity-35

            blur-[1px]
        "
                />

                {/* Blush shape */}

                <div
                    className="
            pointer-events-none

            absolute
            -right-32
            bottom-0

            h-[360px]
            w-[360px]

            rounded-full

            bg-[var(--secondary-fixed)]

            opacity-35

            blur-2xl
        "
                />

                {/* Decorative outlined circle */}

                <div
                    className="
            pointer-events-none

            absolute
            right-[12%]
            top-32

            hidden
            h-28
            w-28

            rounded-full

            border
            border-[var(--outline-variant)]

            opacity-50

            lg:block
        "
                />

                {/* Dot artwork */}

                <div
                    className="
            pointer-events-none

            absolute
            inset-0

            opacity-[0.035]
        "
                    style={{
                        backgroundImage:
                            "radial-gradient(circle, var(--primary) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />

                {/* =============================================
        CONTENT
    ============================================= */}

                <div
                    className="
            relative
            z-10

            mx-auto
            max-w-5xl
        "
                >
                    {/* =========================================
            HEADER
        ========================================= */}

                    <div className="mx-auto max-w-2xl text-center">
                        {/* Eyebrow */}

                        <div
                            className="
                    inline-flex
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-[var(--outline-variant)]

                    bg-white/60

                    px-4
                    py-2

                    text-xs
                    font-bold

                    uppercase

                    tracking-[0.16em]

                    text-[var(--primary)]

                    shadow-sm

                    backdrop-blur-sm
                "
                        >
                            <span
                                className="
                        h-2
                        w-2

                        rounded-full

                        bg-[var(--primary)]
                    "
                            />

                            FAQ
                        </div>

                        {/* Heading */}

                        <h2
                            className="
                    mt-7

                    font-[var(--font-heading)]

                    text-4xl
                    font-bold

                    leading-[1.1]

                    tracking-[-0.045em]

                    text-[var(--on-surface)]

                    sm:text-5xl

                    lg:text-6xl
                "
                        >
                            Questions,
                            <span
                                className="
                        ml-3

                        text-[var(--primary)]
                    "
                            >
                                answered.
                            </span>
                        </h2>

                        {/* Description */}

                        <p
                            className="
                    mx-auto

                    mt-6
                    max-w-xl

                    text-base

                    leading-8

                    text-[var(--on-surface-variant)]

                    sm:text-lg
                "
                        >
                            Everything you need to know about Skillio and how it can
                            support you throughout your career journey.
                        </p>
                    </div>

                    {/* =========================================
            FAQ LIST
        ========================================= */}

                    <div
                        className="
                mx-auto

                mt-14

                max-w-4xl

                space-y-4
            "
                    >
                        {faqs.map((faq, index) => {
                            const isOpen = openFaq === index;

                            return (
                                <div
                                    key={faq.question}
                                    className={`
                            group

                            overflow-hidden

                            rounded-[1.25rem]

                            border

                            transition-all
                            duration-300

                            ${isOpen
                                            ? `
                                        border-[var(--primary)]
                                        bg-[var(--surface-container-lowest)]
                                        shadow-[var(--shadow-md)]
                                    `
                                            : `
                                        border-transparent
                                        bg-[var(--surface-container-low)]
                                        hover:border-[var(--outline-variant)]
                                        hover:bg-[var(--surface-container-lowest)]
                                        hover:shadow-[var(--shadow-sm)]
                                    `
                                        }
                        `}
                                >
                                    {/* QUESTION */}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenFaq(
                                                isOpen
                                                    ? null
                                                    : index
                                            )
                                        }
                                        className="
                                flex
                                w-full

                                items-center

                                gap-4

                                px-5
                                py-5

                                text-left

                                sm:gap-6
                                sm:px-7
                                sm:py-6
                            "
                                    >
                                        {/* Number */}

                                        <span
                                            className={`
                                    hidden

                                    shrink-0

                                    text-sm
                                    font-bold

                                    sm:block

                                    ${isOpen
                                                    ? "text-[var(--primary)]"
                                                    : "text-[var(--outline)]"
                                                }
                                `}
                                        >
                                            {String(index + 1).padStart(2, "0")}
                                        </span>

                                        {/* Question */}

                                        <span
                                            className="
                                    flex-1

                                    font-[var(--font-heading)]

                                    text-[15px]
                                    font-bold

                                    leading-6

                                    text-[var(--on-surface)]

                                    sm:text-base
                                "
                                        >
                                            {faq.question}
                                        </span>

                                        {/* Expand Button */}

                                        <span
                                            className={`
                                    flex

                                    h-10
                                    w-10

                                    shrink-0

                                    items-center
                                    justify-center

                                    rounded-full

                                    transition-all
                                    duration-300

                                    ${isOpen
                                                    ? `
                                                rotate-180

                                                bg-[var(--primary)]

                                                text-white
                                            `
                                                    : `
                                                bg-[var(--surface-container)]

                                                text-[var(--primary)]

                                                group-hover:bg-[var(--primary-fixed)]
                                            `
                                                }
                                `}
                                        >
                                            <ChevronDown size={19} />
                                        </span>
                                    </button>

                                    {/* ANSWER */}

                                    <div
                                        className={`
                                grid

                                transition-all
                                duration-300

                                ${isOpen
                                                ? "grid-rows-[1fr]"
                                                : "grid-rows-[0fr]"
                                            }
                            `}
                                    >
                                        <div className="overflow-hidden">
                                            <div
                                                className="
                                        border-t
                                        border-[var(--outline-variant)]

                                        px-5
                                        py-5

                                        sm:px-7
                                        sm:py-6
                                    "
                                            >
                                                <div
                                                    className="
                                            hidden

                                            w-[22px]

                                            sm:block
                                        "
                                                />

                                                <p
                                                    className="
                                            max-w-3xl

                                            text-sm

                                            leading-7

                                            text-[var(--on-surface-variant)]

                                            sm:ml-[38px]
                                            sm:text-[15px]
                                        "
                                                >
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>


            {/* =================================================
                FINAL CTA
            ================================================= */}

            <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
                <div
                    className="relative mx-auto max-w-[1200px] overflow-hidden rounded-[36px] px-6 py-16 text-center sm:px-12 sm:py-20"
                    style={{
                        background: "var(--primary)",
                        color: "var(--on-primary)",
                    }}
                >
                    {/* CTA Artwork */}

                    <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-white/5" />

                    <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-white/5" />

                    <div className="relative mx-auto max-w-[750px]">
                        <div className="flex justify-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                                <Rocket size={27} />
                            </div>
                        </div>

                        <h2
                            className="mt-7 text-4xl font-bold tracking-[-0.04em] sm:text-5xl"
                            style={{
                                fontFamily:
                                    "var(--font-heading)",
                            }}
                        >
                            Your next opportunity starts with a
                            better system.
                        </h2>

                        <p className="mx-auto mt-6 max-w-[620px] text-base leading-8 opacity-75 sm:text-lg">
                            Build your profile, organize your
                            opportunities and prepare for what comes
                            next — all with Skillio.
                        </p>

                        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
                            <Link
                                to="/register"
                                className="inline-flex min-h-[54px] items-center justify-center gap-2 rounded-2xl px-7 text-sm font-bold transition-all hover:-translate-y-1"
                                style={{
                                    background: "white",
                                    color: "var(--primary)",
                                }}
                            >
                                Create your account

                                <ArrowRight size={18} />
                            </Link>

                            <Link
                                to="/login"
                                className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border border-white/20 px-7 text-sm font-bold transition-all hover:bg-white/10"
                            >
                                I already have an account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>



            {/* =================================================
                FOOTER
            ================================================= */}

            <footer
                className="
                    border-t
                    border-black/[0.05]

                    px-5
                    py-10

                    sm:px-8

                    lg:px-10
                "
            >

                <div
                    className="
                        mx-auto

                        flex
                        max-w-[1440px]

                        flex-col
                        gap-8

                        md:flex-row
                        md:items-center
                        md:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        <SkillioLogo size={150}/>


                    </div>


                    <p
                        className="
                            text-sm

                            text-[var(--on-surface-variant)]
                        "
                    >
                        © {new Date().getFullYear()} Skillio. Build your career
                        with clarity.
                    </p>


                    <div
                        className="
                            flex
                            gap-6

                            text-sm
                            font-medium

                            text-[var(--on-surface-variant)]
                        "
                    >

                        <a
                            href="#"
                            className="
                                hover:text-[var(--primary)]
                            "
                        >
                            Privacy
                        </a>


                        <a
                            href="#"
                            className="
                                hover:text-[var(--primary)]
                            "
                        >
                            Terms
                        </a>

                    </div>

                </div>

            </footer>


        </main>

    );

};


export default Landing;