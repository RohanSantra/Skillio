import { useEffect, useMemo, useState } from "react";

import {
    Brain,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    CircleHelp,
    Clock3,
    Code2,
    FileText,
    Filter,
    LoaderCircle,
    MessageSquareText,
    Play,
    Plus,
    RotateCcw,
    Search,
    SlidersHorizontal,
    Sparkles,
    Target,
    Trash2,
    Trophy,
    Users,
    X,
    Zap,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import useInterviewSession from "../hooks/useInterviewSession";

// Adjust this import path if your file structure is different
import { getAllJobWorkspaces } from "../../job-workspace/services/jobWorkspace.api.js";
import HeroStat from "../../../components/HeroStat .jsx";


/* =========================================================
   INTERVIEW CONFIGURATION
========================================================= */

const INTERVIEW_TYPES = [
    {
        id: "technical",
        title: "Technical",
        description:
            "Test your technical knowledge, concepts, and role-specific skills.",
        icon: Code2,
    },
    {
        id: "behavioral",
        title: "Behavioral",
        description:
            "Practice communication, teamwork, leadership, and workplace scenarios.",
        icon: Users,
    },
    {
        id: "resume",
        title: "Resume Based",
        description:
            "Get questions based on your experience, projects, and achievements.",
        icon: FileText,
    },
    {
        id: "job-description",
        title: "Job Focused",
        description:
            "Prepare specifically for the responsibilities and requirements of a role.",
        icon: Target,
    },
    {
        id: "mock",
        title: "Full Mock Interview",
        description:
            "Experience a realistic mixed interview covering multiple areas.",
        icon: MessageSquareText,
    },
];


const DIFFICULTIES = [
    {
        id: "easy",
        title: "Easy",
        description: "Build confidence",
    },
    {
        id: "medium",
        title: "Medium",
        description: "Balanced challenge",
    },
    {
        id: "hard",
        title: "Hard",
        description: "Advanced preparation",
    },
];


/* =========================================================
   HELPERS
========================================================= */

const formatDate = (date) => {

    if (!date) return "Recently";

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    ).format(new Date(date));
};


const getInterviewTypeLabel = (type) => {

    const interviewType = INTERVIEW_TYPES.find(
        (item) => item.id === type
    );

    return interviewType?.title || "Interview";
};


const getInterviewIcon = (type) => {

    const interviewType = INTERVIEW_TYPES.find(
        (item) => item.id === type
    );

    return interviewType?.icon || Brain;
};


/* =========================================================
   COMPONENT
========================================================= */

const Interview = () => {

    const navigate = useNavigate();


    /* =====================================================
       INTERVIEW STORE
    ===================================================== */

    const {
        interviewSessions,
        isLoading,
        error,
        clearError,
        getInterviewSessions,
        generateInterviewQuestions,
        deleteInterviewSession,
    } = useInterviewSession();


    /* =====================================================
       LOCAL STATE
    ===================================================== */

    const [jobWorkspaces, setJobWorkspaces] = useState([]);

    const [isLoadingWorkspaces, setIsLoadingWorkspaces] =
        useState(true);

    const [workspaceError, setWorkspaceError] =
        useState("");

    const [selectedType, setSelectedType] =
        useState("technical");

    const [searchQuery, setSearchQuery] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");

    const [typeFilter, setTypeFilter] = useState("all");

    const [difficultyFilter, setDifficultyFilter] =
        useState("all");

    const [sortOrder, setSortOrder] =
        useState("newest");

    const [selectedDifficulty, setSelectedDifficulty] =
        useState("medium");

    const [selectedJobId, setSelectedJobId] =
        useState("");

    const [isGenerateModalOpen, setIsGenerateModalOpen] =
        useState(false);

    const [isGenerating, setIsGenerating] =
        useState(false);

    const [sessionToDelete, setSessionToDelete] =
        useState(null);

    const [isDeleting, setIsDeleting] =
        useState(false);

    const [localError, setLocalError] =
        useState("");


    /* =====================================================
       FETCH DATA
    ===================================================== */

    useEffect(() => {

        const loadData = async () => {

            try {

                setWorkspaceError("");
                setIsLoadingWorkspaces(true);

                await Promise.all([
                    getInterviewSessions(),

                    getAllJobWorkspaces()
                        .then((response) => {

                            /*
                             * Supports different API response shapes.
                             */

                            const workspaces =
                                response?.data?.data
                                    ?.jobWorkspaces ||
                                response?.data?.jobWorkspaces ||
                                response?.data?.data ||
                                [];

                            setJobWorkspaces(
                                Array.isArray(workspaces)
                                    ? workspaces
                                    : []
                            );
                        }),
                ]);

            } catch (error) {

                console.error(
                    "Failed to load interview data:",
                    error
                );

                setWorkspaceError(
                    error?.response?.data?.message ||
                    "Unable to load job workspaces."
                );

            } finally {

                setIsLoadingWorkspaces(false);

            }

        };

        loadData();

    }, []);


    /* =====================================================
       COMPUTED VALUES
    ===================================================== */

    const completedSessions = useMemo(
        () =>
            interviewSessions.filter(
                (session) =>
                    session.status === "completed"
            ),
        [interviewSessions]
    );

    const activeSessions = useMemo(
        () =>
            interviewSessions.filter(
                (session) =>
                    session.status === "in-progress"
            ),
        [interviewSessions]
    );

    const totalQuestions = useMemo(
        () =>
            interviewSessions.reduce(
                (total, session) =>
                    total +
                    (session.questions?.length || 0),
                0
            ),
        [interviewSessions]
    );


    /* =====================================================
       FILTERED INTERVIEW SESSIONS
    ===================================================== */

    const filteredSessions = useMemo(() => {

        const normalizedSearch =
            searchQuery.trim().toLowerCase();

        const filtered = interviewSessions.filter(
            (session) => {

                const typeLabel =
                    getInterviewTypeLabel(
                        session.type
                    ).toLowerCase();

                const difficulty =
                    String(
                        session.difficulty || ""
                    ).toLowerCase();

                const status =
                    String(
                        session.status || ""
                    ).toLowerCase();

                const jobTitle =
                    String(
                        session.jobId?.jobTitle ||
                        session.jobId?.title ||
                        session.jobId?.role ||
                        ""
                    ).toLowerCase();

                const company =
                    String(
                        session.jobId?.companyName ||
                        session.jobId?.company ||
                        ""
                    ).toLowerCase();

                const matchesSearch =
                    !normalizedSearch ||
                    typeLabel.includes(
                        normalizedSearch
                    ) ||
                    difficulty.includes(
                        normalizedSearch
                    ) ||
                    status.includes(
                        normalizedSearch
                    ) ||
                    jobTitle.includes(
                        normalizedSearch
                    ) ||
                    company.includes(
                        normalizedSearch
                    );

                const matchesStatus =
                    statusFilter === "all" ||
                    session.status === statusFilter;

                const matchesType =
                    typeFilter === "all" ||
                    session.type === typeFilter;

                const matchesDifficulty =
                    difficultyFilter === "all" ||
                    session.difficulty ===
                    difficultyFilter;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesType &&
                    matchesDifficulty
                );
            }
        );

        return filtered.sort((a, b) => {

            const dateA = new Date(
                a.createdAt ||
                a.startedAt ||
                0
            ).getTime();

            const dateB = new Date(
                b.createdAt ||
                b.startedAt ||
                0
            ).getTime();

            return sortOrder === "newest"
                ? dateB - dateA
                : dateA - dateB;
        });

    }, [
        interviewSessions,
        searchQuery,
        statusFilter,
        typeFilter,
        difficultyFilter,
        sortOrder,
    ]);


    const hasActiveFilters =
        searchQuery.trim() !== "" ||
        statusFilter !== "all" ||
        typeFilter !== "all" ||
        difficultyFilter !== "all" ||
        sortOrder !== "newest";


    const clearSessionFilters = () => {

        setSearchQuery("");
        setStatusFilter("all");
        setTypeFilter("all");
        setDifficultyFilter("all");
        setSortOrder("newest");
    };


    /* =====================================================
       MODAL HANDLERS
    ===================================================== */

    const openGenerateModal = (
        type = selectedType
    ) => {

        clearError?.();
        setLocalError("");

        setSelectedType(type);

        setIsGenerateModalOpen(true);

    };


    const closeGenerateModal = () => {

        if (isGenerating) return;

        setIsGenerateModalOpen(false);

        setLocalError("");

    };


    /* =====================================================
       GENERATE INTERVIEW
    ===================================================== */

    const handleGenerateInterview = async (
        event
    ) => {

        event.preventDefault();

        clearError?.();
        setLocalError("");

        if (!selectedJobId) {

            setLocalError(
                "Please select a job workspace first."
            );

            return;

        }

        try {

            setIsGenerating(true);

            const response =
                await generateInterviewQuestions({
                    jobId: selectedJobId,
                    type: selectedType,
                    difficulty: selectedDifficulty,
                });

            const session =
                response?.data?.interviewSession;

            setIsGenerateModalOpen(false);

            if (session?._id) {

                navigate(
                    `/interviews/${session._id}`
                );

            }

        } catch (error) {

            console.error(
                "Failed to generate interview:",
                error
            );

            setLocalError(
                error?.response?.data?.message ||
                "Unable to generate your AI interview. Please try again."
            );

        } finally {

            setIsGenerating(false);

        }

    };


    /* =====================================================
       DELETE SESSION
    ===================================================== */

    const handleDeleteSession = async () => {

        if (!sessionToDelete?._id) return;

        try {

            setIsDeleting(true);

            await deleteInterviewSession(
                sessionToDelete._id
            );

            setSessionToDelete(null);

        } catch (error) {

            console.error(
                "Failed to delete interview:",
                error
            );

        } finally {

            setIsDeleting(false);

        }

    };


    /* =====================================================
       NAVIGATION
    ===================================================== */

    const handleOpenSession = (session) => {

        navigate(
            `/interviews/${session._id}`
        );

    };


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <div
            className="
                min-h-full
                px-4
                py-5
                sm:px-6
                sm:py-6
                lg:px-10
                lg:py-8
            "
        >

            <div className="mx-auto max-w-[1500px]">


                {/* =========================================
                    PAGE HEADER
                ========================================== */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-[28px]
                        border
                        p-6
                        sm:p-8
                        lg:p-10
                    "
                    style={{
                        background:
                            "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 55%, #6d7865 100%)",
                        borderColor:
                            "rgba(255,255,255,0.16)",
                        boxShadow:
                            "var(--shadow-lg)",
                    }}
                >

                    {/* Decorative circles */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-20
                            -top-24
                            h-72
                            w-72
                            rounded-full
                            opacity-10
                        "
                        style={{
                            background:
                                "var(--primary-fixed)",
                        }}
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-32
                            right-40
                            h-64
                            w-64
                            rounded-full
                            opacity-10
                        "
                        style={{
                            background:
                                "var(--secondary-fixed)",
                        }}
                    />


                    <div
                        className="
                            relative
                            flex
                            flex-col
                            gap-8
                            xl:flex-row
                            xl:items-center
                            xl:justify-between
                        "
                    >

                        {/* Hero content */}

                        <div className="max-w-3xl">

                            <div
                                className="
                                    mb-5
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    px-4
                                    py-2
                                    text-sm
                                    font-semibold
                                "
                                style={{
                                    background:
                                        "rgba(255,255,255,0.12)",
                                    color:
                                        "var(--primary-fixed)",
                                    border:
                                        "1px solid rgba(255,255,255,0.14)",
                                }}
                            >

                                <Sparkles size={16} />

                                AI-Powered Interview Practice

                            </div>


                            <h1
                                className="
                                    text-3xl
                                    font-bold
                                    tracking-tight
                                    sm:text-4xl
                                    lg:text-5xl
                                "
                                style={{
                                    fontFamily:
                                        "var(--font-heading)",
                                    color:
                                        "var(--on-primary)",
                                }}
                            >

                                Practice smarter.
                                <br />

                                Interview with confidence.

                            </h1>


                            <p
                                className="
                                    mt-5
                                    max-w-2xl
                                    text-base
                                    leading-7
                                    sm:text-lg
                                "
                                style={{
                                    color:
                                        "rgba(255,255,255,0.76)",
                                }}
                            >

                                Generate personalized AI interviews based on
                                your career profile and target job. Answer
                                realistic questions and receive detailed
                                feedback on every response.

                            </p>


                            <div
                                className="
                                    mt-7
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        openGenerateModal()
                                    }
                                    className="
                                        inline-flex
                                        min-h-12
                                        items-center
                                        gap-2
                                        rounded-2xl
                                        px-5
                                        py-3
                                        text-sm
                                        font-bold
                                        transition
                                        hover:-translate-y-0.5
                                    "
                                    style={{
                                        background:
                                            "var(--primary-fixed)",
                                        color:
                                            "var(--on-primary-fixed)",
                                        boxShadow:
                                            "0 8px 20px rgba(0,0,0,0.15)",
                                    }}
                                >

                                    <Sparkles size={18} />

                                    Generate AI Interview

                                </button>


                                {activeSessions.length > 0 && (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleOpenSession(
                                                activeSessions[0]
                                            )
                                        }
                                        className="
                                            inline-flex
                                            min-h-12
                                            items-center
                                            gap-2
                                            rounded-2xl
                                            border
                                            px-5
                                            py-3
                                            text-sm
                                            font-semibold
                                            transition
                                            hover:bg-white/10
                                        "
                                        style={{
                                            borderColor:
                                                "rgba(255,255,255,0.2)",
                                            color:
                                                "var(--on-primary)",
                                        }}
                                    >

                                        <Play size={17} />

                                        Continue Practice

                                    </button>

                                )}

                            </div>

                        </div>


                        {/* Hero stats */}

                        <div
                            className="
                                grid
                                grid-cols-3
                                gap-3
                                sm:gap-4
                                xl:w-[430px]
                            "
                        >

                            <HeroStat
                                value={
                                    interviewSessions.length
                                }
                                label="Sessions"
                                icon={Brain}
                            />

                            <HeroStat
                                value={
                                    completedSessions.length
                                }
                                label="Completed"
                                icon={Trophy}
                            />

                            <HeroStat
                                value={totalQuestions}
                                label="Questions"
                                icon={CircleHelp}
                            />

                        </div>

                    </div>

                </section>


                {/* =========================================
                    ERROR
                ========================================== */}

                {(error || localError || workspaceError) && (

                    <div
                        className="
                            mt-6
                            rounded-2xl
                            border
                            px-5
                            py-4
                            text-sm
                        "
                        style={{
                            background:
                                "var(--error-container)",
                            color:
                                "var(--on-error-container)",
                            borderColor:
                                "color-mix(in srgb, var(--error) 25%, transparent)",
                        }}
                    >

                        {localError ||
                            error ||
                            workspaceError}

                    </div>

                )}


                {/* =========================================
                    INTERVIEW TYPES
                ========================================== */}

                <section className="mt-10">

                    <SectionHeading
                        eyebrow="CHOOSE YOUR PRACTICE"
                        title="What do you want to prepare for?"
                        description="
                            Choose an interview format and Skillio will create
                            personalized questions around your career and target role.
                        "
                    />


                    <div
                        className="
                            mt-6
                            grid
                            gap-4
                            sm:grid-cols-2
                            xl:grid-cols-5
                        "
                    >

                        {INTERVIEW_TYPES.map(
                            (type) => {

                                const Icon = type.icon;

                                const isSelected =
                                    selectedType === type.id;

                                return (

                                    <button
                                        key={type.id}
                                        type="button"
                                        onClick={() => {

                                            setSelectedType(
                                                type.id
                                            );

                                            openGenerateModal(
                                                type.id
                                            );

                                        }}
                                        className="
                                            group
                                            relative
                                            min-h-[235px]
                                            overflow-hidden
                                            rounded-[22px]
                                            border
                                            p-5
                                            text-left
                                            transition-all
                                            duration-300
                                            hover:-translate-y-1
                                        "
                                        style={{
                                            background:
                                                isSelected
                                                    ? "var(--surface-container)"
                                                    : "var(--surface-container-lowest)",

                                            borderColor:
                                                isSelected
                                                    ? "var(--primary)"
                                                    : "var(--outline-variant)",

                                            boxShadow:
                                                isSelected
                                                    ? "var(--shadow-md)"
                                                    : "var(--shadow-sm)",
                                        }}
                                    >

                                        <div
                                            className="
                                                flex
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-2xl
                                                transition-transform
                                                duration-300
                                                group-hover:scale-110
                                            "
                                            style={{
                                                background:
                                                    isSelected
                                                        ? "var(--primary)"
                                                        : "var(--primary-fixed)",

                                                color:
                                                    isSelected
                                                        ? "var(--on-primary)"
                                                        : "var(--on-primary-fixed)",
                                            }}
                                        >

                                            <Icon size={22} />

                                        </div>


                                        <h3
                                            className="
                                                mt-5
                                                text-base
                                                font-bold
                                            "
                                            style={{
                                                fontFamily:
                                                    "var(--font-heading)",
                                                color:
                                                    "var(--on-surface)",
                                            }}
                                        >

                                            {type.title}

                                        </h3>


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

                                            {type.description}

                                        </p>


                                        <div
                                            className="
                                                absolute
                                                bottom-4
                                                right-4
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-full
                                                transition
                                                group-hover:translate-x-1
                                            "
                                            style={{
                                                background:
                                                    "var(--surface-container-high)",
                                                color:
                                                    "var(--primary)",
                                            }}
                                        >

                                            <ChevronRight size={16} />

                                        </div>

                                    </button>

                                );

                            }
                        )}

                    </div>

                </section>


                {/* =========================================
                    QUICK START
                ========================================== */}

                <section
                    className="
                        mt-10
                        rounded-[24px]
                        border
                        p-5
                        sm:p-6
                        lg:p-8
                    "
                    style={{
                        background:
                            "var(--surface-container-lowest)",
                        borderColor:
                            "var(--outline-variant)",
                        boxShadow:
                            "var(--shadow-sm)",
                    }}
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-6
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-bold
                                    tracking-[0.14em]
                                "
                                style={{
                                    color:
                                        "var(--primary)",
                                }}
                            >

                                <Zap size={14} />

                                QUICK START

                            </div>


                            <h2
                                className="
                                    mt-2
                                    text-2xl
                                    font-bold
                                "
                                style={{
                                    fontFamily:
                                        "var(--font-heading)",
                                }}
                            >

                                Ready for your next interview?

                            </h2>


                            <p
                                className="mt-2 text-sm"
                                style={{
                                    color:
                                        "var(--on-surface-variant)",
                                }}
                            >

                                Select your preferred interview style and
                                generate a personalized practice session.

                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                openGenerateModal()
                            }
                            className="
                                inline-flex
                                min-h-12
                                items-center
                                justify-center
                                gap-2
                                rounded-2xl
                                px-6
                                py-3
                                text-sm
                                font-bold
                                transition
                                hover:-translate-y-0.5
                            "
                            style={{
                                background:
                                    "var(--primary)",
                                color:
                                    "var(--on-primary)",
                                boxShadow:
                                    "0 8px 18px rgba(62,74,55,0.16)",
                            }}
                        >

                            <Sparkles size={18} />

                            Start AI Interview

                        </button>

                    </div>

                </section>


                {/* =========================================
    INTERVIEW SESSIONS
========================================== */}

                <section className="mt-12">

                    {/* Section heading */}

                    <div
                        className="
            flex
            flex-col
            gap-5
            lg:flex-row
            lg:items-end
            lg:justify-between
        "
                    >

                        <SectionHeading
                            eyebrow="YOUR PROGRESS"
                            title="Interview sessions"
                            description="
                Continue practicing where you left off
                or review your completed interview performance.
            "
                        />

                        {interviewSessions.length > 0 && (

                            <div
                                className="
                    inline-flex
                    w-fit
                    items-center
                    gap-2
                    rounded-full
                    px-4
                    py-2
                    text-sm
                    font-semibold
                "
                                style={{
                                    background:
                                        "var(--surface-container-high)",
                                    color:
                                        "var(--on-surface-variant)",
                                }}
                            >

                                <Brain size={15} />

                                {interviewSessions.length} sessions

                            </div>

                        )}

                    </div>


                    {/* Loading */}

                    {isLoading &&
                        interviewSessions.length === 0 && (

                            <div
                                className="
                    mt-6
                    grid
                    gap-5
                    md:grid-cols-2
                    xl:grid-cols-3
                "
                            >

                                {[1, 2, 3].map((item) => (

                                    <SessionSkeleton
                                        key={item}
                                    />

                                ))}

                            </div>
                        )}


                    {/* Empty state */}

                    {!isLoading &&
                        interviewSessions.length === 0 && (

                            <div
                                className="
                    mt-6
                    flex
                    min-h-[320px]
                    flex-col
                    items-center
                    justify-center
                    rounded-[28px]
                    border
                    px-6
                    text-center
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
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-[26px]
                    "
                                    style={{
                                        background:
                                            "var(--primary-fixed)",
                                        color:
                                            "var(--on-primary-fixed)",
                                    }}
                                >

                                    <Brain size={34} />

                                </div>


                                <h3
                                    className="
                        mt-6
                        text-xl
                        font-bold
                    "
                                    style={{
                                        fontFamily:
                                            "var(--font-heading)",
                                    }}
                                >
                                    Your interview journey starts here
                                </h3>


                                <p
                                    className="
                        mt-3
                        max-w-md
                        text-sm
                        leading-6
                    "
                                    style={{
                                        color:
                                            "var(--on-surface-variant)",
                                    }}
                                >
                                    Generate your first AI-powered
                                    interview and practice realistic
                                    questions tailored to your career goals.
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        openGenerateModal()
                                    }
                                    className="
                        mt-6
                        inline-flex
                        items-center
                        gap-2
                        rounded-2xl
                        px-5
                        py-3
                        text-sm
                        font-bold
                    "
                                    style={{
                                        background:
                                            "var(--primary)",
                                        color:
                                            "var(--on-primary)",
                                    }}
                                >

                                    <Plus size={18} />

                                    Create First Interview

                                </button>

                            </div>
                        )}


                    {/* Search + Filters */}

                    {interviewSessions.length > 0 && (

                        <div
                            className="
                mt-7
                rounded-[24px]
                border
                p-4
                sm:p-5
            "
                            style={{
                                background:
                                    "var(--surface-container-lowest)",
                                borderColor:
                                    "var(--outline-variant)",
                                boxShadow:
                                    "var(--shadow-sm)",
                            }}
                        >

                            {/* Search */}

                            <div
                                className="
                    flex
                    flex-col
                    gap-4
                    xl:flex-row
                "
                            >

                                <div className="relative flex-1">

                                    <Search
                                        size={18}
                                        className="
                            pointer-events-none
                            absolute
                            left-4
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
                                        placeholder="
                            Search interviews, roles,
                            companies...
                        "
                                        className="
                            h-12
                            w-full
                            rounded-xl
                            border
                            pl-11
                            pr-4
                            text-sm
                            outline-none
                            transition
                            focus:ring-2
                        "
                                        style={{
                                            background:
                                                "var(--surface-container-low)",
                                            color:
                                                "var(--on-surface)",
                                            borderColor:
                                                "var(--outline-variant)",
                                            "--tw-ring-color":
                                                "var(--primary)",
                                        }}
                                    />

                                </div>


                                {/* Status */}

                                <div className="relative">

                                    <Filter
                                        size={15}
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

                                    <select
                                        value={statusFilter}
                                        onChange={(event) =>
                                            setStatusFilter(
                                                event.target.value
                                            )
                                        }
                                        className="
                            h-12
                            w-full
                            min-w-[160px]
                            appearance-none
                            rounded-xl
                            border
                            pl-10
                            pr-9
                            text-sm
                            font-medium
                            outline-none
                        "
                                        style={{
                                            background:
                                                "var(--surface-container-low)",
                                            color:
                                                "var(--on-surface)",
                                            borderColor:
                                                "var(--outline-variant)",
                                        }}
                                    >

                                        <option value="all">
                                            All status
                                        </option>

                                        <option value="in-progress">
                                            In progress
                                        </option>

                                        <option value="completed">
                                            Completed
                                        </option>

                                        <option value="abandoned">
                                            Abandoned
                                        </option>

                                    </select>

                                    <ChevronDown
                                        size={16}
                                        className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                        "
                                        style={{
                                            color:
                                                "var(--on-surface-variant)",
                                        }}
                                    />

                                </div>


                                {/* Type */}

                                <div className="relative">

                                    <select
                                        value={typeFilter}
                                        onChange={(event) =>
                                            setTypeFilter(
                                                event.target.value
                                            )
                                        }
                                        className="
                            h-12
                            w-full
                            min-w-[170px]
                            appearance-none
                            rounded-xl
                            border
                            px-4
                            pr-9
                            text-sm
                            font-medium
                            outline-none
                        "
                                        style={{
                                            background:
                                                "var(--surface-container-low)",
                                            color:
                                                "var(--on-surface)",
                                            borderColor:
                                                "var(--outline-variant)",
                                        }}
                                    >

                                        <option value="all">
                                            All interview types
                                        </option>

                                        {INTERVIEW_TYPES.map(
                                            (type) => (

                                                <option
                                                    key={type.id}
                                                    value={type.id}
                                                >
                                                    {type.title}
                                                </option>

                                            )
                                        )}

                                    </select>

                                    <ChevronDown
                                        size={16}
                                        className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                        "
                                        style={{
                                            color:
                                                "var(--on-surface-variant)",
                                        }}
                                    />

                                </div>


                                {/* Difficulty */}

                                <div className="relative">

                                    <select
                                        value={difficultyFilter}
                                        onChange={(event) =>
                                            setDifficultyFilter(
                                                event.target.value
                                            )
                                        }
                                        className="
                            h-12
                            w-full
                            min-w-[145px]
                            appearance-none
                            rounded-xl
                            border
                            px-4
                            pr-9
                            text-sm
                            font-medium
                            outline-none
                        "
                                        style={{
                                            background:
                                                "var(--surface-container-low)",
                                            color:
                                                "var(--on-surface)",
                                            borderColor:
                                                "var(--outline-variant)",
                                        }}
                                    >

                                        <option value="all">
                                            All difficulty
                                        </option>

                                        {DIFFICULTIES.map(
                                            (difficulty) => (

                                                <option
                                                    key={difficulty.id}
                                                    value={difficulty.id}
                                                >
                                                    {difficulty.title}
                                                </option>

                                            )
                                        )}

                                    </select>

                                    <ChevronDown
                                        size={16}
                                        className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                        "
                                        style={{
                                            color:
                                                "var(--on-surface-variant)",
                                        }}
                                    />

                                </div>

                            </div>


                            {/* Bottom controls */}

                            <div
                                className="
                    mt-4
                    flex
                    flex-col
                    gap-3
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
                            >

                                <div
                                    className="
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-medium
                    "
                                    style={{
                                        color:
                                            "var(--on-surface-variant)",
                                    }}
                                >

                                    <SlidersHorizontal size={14} />

                                    Showing{" "}

                                    <span
                                        className="font-bold"
                                        style={{
                                            color:
                                                "var(--on-surface)",
                                        }}
                                    >
                                        {filteredSessions.length}
                                    </span>

                                    of {interviewSessions.length}

                                    sessions

                                </div>


                                <div className="flex items-center gap-3">

                                    <div className="relative">

                                        <select
                                            value={sortOrder}
                                            onChange={(event) =>
                                                setSortOrder(
                                                    event.target.value
                                                )
                                            }
                                            className="
                                h-10
                                appearance-none
                                rounded-xl
                                border
                                px-3
                                pr-8
                                text-xs
                                font-semibold
                                outline-none
                            "
                                            style={{
                                                background:
                                                    "var(--surface-container-low)",
                                                color:
                                                    "var(--on-surface)",
                                                borderColor:
                                                    "var(--outline-variant)",
                                            }}
                                        >

                                            <option value="newest">
                                                Newest first
                                            </option>

                                            <option value="oldest">
                                                Oldest first
                                            </option>

                                        </select>

                                        <ChevronDown
                                            size={14}
                                            className="
                                pointer-events-none
                                absolute
                                right-2.5
                                top-1/2
                                -translate-y-1/2
                            "
                                            style={{
                                                color:
                                                    "var(--on-surface-variant)",
                                            }}
                                        />

                                    </div>


                                    {hasActiveFilters && (

                                        <button
                                            type="button"
                                            onClick={
                                                clearSessionFilters
                                            }
                                            className="
                                inline-flex
                                h-10
                                items-center
                                gap-1.5
                                rounded-xl
                                px-3
                                text-xs
                                font-bold
                                transition
                                hover:-translate-y-0.5
                            "
                                            style={{
                                                background:
                                                    "var(--surface-container-high)",
                                                color:
                                                    "var(--primary)",
                                            }}
                                        >

                                            <RotateCcw size={13} />

                                            Clear

                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    )}


                    {/* Filtered empty state */}

                    {interviewSessions.length > 0 &&
                        filteredSessions.length === 0 && (

                            <div
                                className="
                    mt-6
                    flex
                    min-h-[260px]
                    flex-col
                    items-center
                    justify-center
                    rounded-[26px]
                    border
                    px-6
                    text-center
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
                        h-16
                        w-16
                        items-center
                        justify-center
                        rounded-2xl
                    "
                                    style={{
                                        background:
                                            "var(--surface-container-high)",
                                        color:
                                            "var(--on-surface-variant)",
                                    }}
                                >

                                    <Search size={27} />

                                </div>


                                <h3
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
                                    No interviews found
                                </h3>


                                <p
                                    className="
                        mt-2
                        max-w-sm
                        text-sm
                        leading-6
                    "
                                    style={{
                                        color:
                                            "var(--on-surface-variant)",
                                    }}
                                >
                                    Try changing your search or
                                    adjusting the filters to find
                                    another interview session.
                                </p>


                                <button
                                    type="button"
                                    onClick={
                                        clearSessionFilters
                                    }
                                    className="
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        px-4
                        py-2.5
                        text-sm
                        font-bold
                    "
                                    style={{
                                        background:
                                            "var(--primary)",
                                        color:
                                            "var(--on-primary)",
                                    }}
                                >

                                    <RotateCcw size={15} />

                                    Clear filters

                                </button>

                            </div>

                        )}


                    {/* Session cards */}

                    {filteredSessions.length > 0 && (

                        <div
                            className="
                mt-6
                grid
                gap-5
                md:grid-cols-2
                xl:grid-cols-3
            "
                        >

                            {filteredSessions.map(
                                (session) => (

                                    <InterviewSessionCard
                                        key={session._id}
                                        session={session}
                                        onOpen={() =>
                                            handleOpenSession(
                                                session
                                            )
                                        }
                                        onDelete={() =>
                                            setSessionToDelete(
                                                session
                                            )
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

                </section>

            </div>


            {/* =============================================
                GENERATE MODAL
            ============================================= */}

            {isGenerateModalOpen && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-end
                        justify-center
                        bg-black/40
                        p-0
                        backdrop-blur-sm
                        sm:items-center
                        sm:p-6
                    "
                >

                    <div
                        className="
                            max-h-[82vh]
                            w-full
                            max-w-3xl
                            overflow-y-auto
                            rounded-t-[28px]
                            border
                            p-5
                            sm:rounded-[28px]
                            sm:p-7
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

                        {/* Modal Header */}

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            "
                        >

                            <div>

                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-bold
                                    "
                                    style={{
                                        background:
                                            "var(--primary-fixed)",
                                        color:
                                            "var(--on-primary-fixed)",
                                    }}
                                >

                                    <Sparkles size={14} />

                                    AI INTERVIEW

                                </div>


                                <h2
                                    className="
                                        mt-4
                                        text-2xl
                                        font-bold
                                    "
                                    style={{
                                        fontFamily:
                                            "var(--font-heading)",
                                    }}
                                >

                                    Create your practice session

                                </h2>


                                <p
                                    className="mt-2 text-sm"
                                    style={{
                                        color:
                                            "var(--on-surface-variant)",
                                    }}
                                >

                                    Skillio will generate personalized
                                    interview questions based on your selected
                                    job workspace and career profile.

                                </p>

                            </div>


                            <button
                                type="button"
                                onClick={closeGenerateModal}
                                disabled={isGenerating}
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    transition
                                    hover:opacity-70
                                "
                                style={{
                                    background:
                                        "var(--surface-container-high)",
                                    color:
                                        "var(--on-surface)",
                                }}
                            >

                                <X size={19} />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleGenerateInterview
                            }
                            className="mt-7 space-y-7"
                        >


                            {/* Job Workspace */}

                            <div>

                                <label
                                    className="
                                        mb-3
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-bold
                                    "
                                >

                                    <BriefcaseBusiness
                                        size={16}
                                        style={{
                                            color:
                                                "var(--primary)",
                                        }}
                                    />

                                    Select Job Workspace

                                </label>


                                <select
                                    value={selectedJobId}
                                    onChange={(event) =>
                                        setSelectedJobId(
                                            event.target.value
                                        )
                                    }
                                    disabled={
                                        isLoadingWorkspaces ||
                                        isGenerating
                                    }
                                    className="
                                        h-13
                                        w-full
                                        rounded-xl
                                        border
                                        px-4
                                        outline-none
                                    "
                                    style={{
                                        background:
                                            "var(--surface-container-low)",
                                        color:
                                            "var(--on-surface)",
                                        borderColor:
                                            "var(--outline-variant)",
                                    }}
                                >

                                    <option value="">

                                        {isLoadingWorkspaces
                                            ? "Loading job workspaces..."
                                            : "Choose the role you are preparing for"}

                                    </option>


                                    {jobWorkspaces.map(
                                        (workspace) => (

                                            <option
                                                key={workspace._id}
                                                value={workspace._id}
                                            >

                                                {workspace.role ||
                                                    "Untitled Job"}{" "}

                                                {workspace.company ? `— ${workspace.company}` : ""}

                                            </option>

                                        )
                                    )}

                                </select>


                                {!isLoadingWorkspaces &&
                                    jobWorkspaces.length === 0 && (

                                        <p
                                            className="
                                                mt-2
                                                text-xs
                                            "
                                            style={{
                                                color:
                                                    "var(--error)",
                                            }}
                                        >

                                            You need at least one job workspace
                                            before generating an interview.

                                        </p>

                                    )}

                            </div>


                            {/* Interview Type */}

                            <div>

                                <label
                                    className="
                                        mb-3
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-bold
                                    "
                                >

                                    <Brain
                                        size={16}
                                        style={{
                                            color:
                                                "var(--primary)",
                                        }}
                                    />

                                    Interview Type

                                </label>


                                <div
                                    className="
                                        grid
                                        gap-3
                                        sm:grid-cols-2
                                    "
                                >

                                    {INTERVIEW_TYPES.map(
                                        (type) => {

                                            const Icon =
                                                type.icon;

                                            const active =
                                                selectedType ===
                                                type.id;

                                            return (

                                                <button
                                                    key={type.id}
                                                    type="button"
                                                    disabled={
                                                        isGenerating
                                                    }
                                                    onClick={() =>
                                                        setSelectedType(
                                                            type.id
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-3
                                                        rounded-2xl
                                                        border
                                                        p-3.5
                                                        text-left
                                                        transition
                                                    "
                                                    style={{
                                                        background:
                                                            active
                                                                ? "var(--surface-container)"
                                                                : "var(--surface-container-lowest)",

                                                        borderColor:
                                                            active
                                                                ? "var(--primary)"
                                                                : "var(--outline-variant)",
                                                    }}
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                        "
                                                        style={{
                                                            background:
                                                                active
                                                                    ? "var(--primary)"
                                                                    : "var(--primary-fixed)",

                                                            color:
                                                                active
                                                                    ? "var(--on-primary)"
                                                                    : "var(--on-primary-fixed)",
                                                        }}
                                                    >

                                                        <Icon
                                                            size={
                                                                17
                                                            }
                                                        />

                                                    </div>


                                                    <div>

                                                        <p
                                                            className="
                                                                text-sm
                                                                font-bold
                                                            "
                                                        >

                                                            {
                                                                type.title
                                                            }

                                                        </p>


                                                        <p
                                                            className="
                                                                mt-0.5
                                                                text-xs
                                                            "
                                                            style={{
                                                                color:
                                                                    "var(--on-surface-variant)",
                                                            }}
                                                        >

                                                            {
                                                                type.description
                                                            }

                                                        </p>

                                                    </div>

                                                </button>

                                            );

                                        }
                                    )}

                                </div>

                            </div>


                            {/* Difficulty */}

                            <div>

                                <label
                                    className="
                                        mb-3
                                        flex
                                        items-center
                                        gap-2
                                        text-sm
                                        font-bold
                                    "
                                >

                                    <Target
                                        size={16}
                                        style={{
                                            color:
                                                "var(--primary)",
                                        }}
                                    />

                                    Difficulty Level

                                </label>


                                <div
                                    className="
                                        grid
                                        grid-cols-3
                                        gap-3
                                    "
                                >

                                    {DIFFICULTIES.map(
                                        (difficulty) => {

                                            const active =
                                                selectedDifficulty ===
                                                difficulty.id;

                                            return (

                                                <button
                                                    key={
                                                        difficulty.id
                                                    }
                                                    type="button"
                                                    disabled={
                                                        isGenerating
                                                    }
                                                    onClick={() =>
                                                        setSelectedDifficulty(
                                                            difficulty.id
                                                        )
                                                    }
                                                    className="
                                                        rounded-2xl
                                                        border
                                                        p-4
                                                        text-center
                                                        transition
                                                    "
                                                    style={{
                                                        background:
                                                            active
                                                                ? "var(--primary)"
                                                                : "var(--surface-container-lowest)",

                                                        borderColor:
                                                            active
                                                                ? "var(--primary)"
                                                                : "var(--outline-variant)",

                                                        color:
                                                            active
                                                                ? "var(--on-primary)"
                                                                : "var(--on-surface)",
                                                    }}
                                                >

                                                    <p
                                                        className="
                                                            text-sm
                                                            font-bold
                                                        "
                                                    >

                                                        {
                                                            difficulty.title
                                                        }

                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            text-[11px]
                                                        "
                                                        style={{
                                                            color:
                                                                active
                                                                    ? "rgba(255,255,255,0.72)"
                                                                    : "var(--on-surface-variant)",
                                                        }}
                                                    >

                                                        {
                                                            difficulty.description
                                                        }

                                                    </p>

                                                </button>

                                            );

                                        }
                                    )}

                                </div>

                            </div>


                            {/* Error */}

                            {localError && (

                                <div
                                    className="
                                        rounded-xl
                                        px-4
                                        py-3
                                        text-sm
                                    "
                                    style={{
                                        background:
                                            "var(--error-container)",
                                        color:
                                            "var(--on-error-container)",
                                    }}
                                >

                                    {localError}

                                </div>

                            )}


                            {/* Generate Button */}

                            <button
                                type="submit"
                                disabled={
                                    isGenerating ||
                                    isLoadingWorkspaces ||
                                    jobWorkspaces.length === 0
                                }
                                className="
                                    flex
                                    min-h-[54px]
                                    w-full
                                    items-center
                                    justify-center
                                    gap-3
                                    rounded-2xl
                                    px-5
                                    py-3
                                    text-sm
                                    font-bold
                                    transition
                                "
                                style={{
                                    background:
                                        "var(--primary)",
                                    color:
                                        "var(--on-primary)",
                                    opacity:
                                        isGenerating
                                            ? 0.75
                                            : 1,
                                }}
                            >

                                {isGenerating ? (

                                    <>
                                        <LoaderCircle
                                            size={19}
                                            className="animate-spin"
                                        />

                                        Generating your interview...

                                    </>

                                ) : (

                                    <>
                                        <Sparkles size={19} />

                                        Generate AI Interview

                                    </>

                                )}

                            </button>

                        </form>

                    </div>

                </div>

            )}


            {/* =============================================
                DELETE CONFIRMATION
            ============================================= */}

            {sessionToDelete && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[110]
                        flex
                        items-center
                        justify-center
                        bg-black/40
                        p-5
                        backdrop-blur-sm
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-[26px]
                            border
                            p-6
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

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                            "
                            style={{
                                background:
                                    "var(--error-container)",
                                color:
                                    "var(--on-error-container)",
                            }}
                        >

                            <Trash2 size={23} />

                        </div>


                        <h3
                            className="
                                mt-5
                                text-xl
                                font-bold
                            "
                            style={{
                                fontFamily:
                                    "var(--font-heading)",
                            }}
                        >

                            Delete interview session?

                        </h3>


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

                            This interview session and all of its answers,
                            feedback, and performance data will be permanently
                            deleted.

                        </p>


                        <div
                            className="
                                mt-6
                                flex
                                gap-3
                            "
                        >

                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() =>
                                    setSessionToDelete(null)
                                }
                                className="
                                    flex-1
                                    rounded-xl
                                    border
                                    px-4
                                    py-3
                                    text-sm
                                    font-bold
                                "
                                style={{
                                    borderColor:
                                        "var(--outline-variant)",
                                    background:
                                        "var(--surface-container-low)",
                                }}
                            >

                                Cancel

                            </button>


                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={
                                    handleDeleteSession
                                }
                                className="
                                    flex
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    px-4
                                    py-3
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

                                {isDeleting ? (

                                    <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <Trash2 size={17} />

                                )}

                                Delete

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};


/* =========================================================
   SECTION HEADING
========================================================= */

const SectionHeading = ({
    eyebrow,
    title,
    description,
}) => {

    return (

        <div>

            {eyebrow && (

                <div
                    className="
                        text-xs
                        font-bold
                        tracking-[0.14em]
                    "
                    style={{
                        color:
                            "var(--primary)",
                    }}
                >

                    {eyebrow}

                </div>

            )}


            <h2
                className="
                    mt-2
                    text-2xl
                    font-bold
                    sm:text-3xl
                "
                style={{
                    fontFamily:
                        "var(--font-heading)",
                    color:
                        "var(--on-surface)",
                }}
            >

                {title}

            </h2>


            {description && (

                <p
                    className="
                        mt-3
                        max-w-2xl
                        text-sm
                        leading-6
                        sm:text-base
                    "
                    style={{
                        color:
                            "var(--on-surface-variant)",
                    }}
                >

                    {description}

                </p>

            )}

        </div>

    );

};


/* =========================================================
   SESSION CARD
========================================================= */

const InterviewSessionCard = ({
    session,
    onOpen,
    onDelete,
}) => {

    const Icon =
        getInterviewIcon(session.type);

    const isCompleted =
        session.status === "completed";

    const isAbandoned =
        session.status === "abandoned";

    const answeredQuestions =
        session.questions?.filter(
            (question) =>
                question.userAnswer?.trim()
        ).length || 0;

    const totalQuestions =
        session.questions?.length || 0;

    const progress =
        totalQuestions > 0
            ? Math.round(
                (answeredQuestions /
                    totalQuestions) *
                100
            )
            : 0;

    const score =
        session.score !== null &&
            session.score !== undefined
            ? Math.round(session.score)
            : null;

    const jobTitle =
        session.jobId?.jobTitle ||
        session.jobId?.title ||
        session.jobId?.role ||
        null;

    const company =
        session.jobId?.companyName ||
        session.jobId?.company ||
        null;


    return (

        <article
            className="
                group
                relative
                flex
                h-full
                flex-col
                overflow-hidden
                rounded-[26px]
                border
                transition-all
                duration-300
                hover:-translate-y-1
            "
            style={{
                background:
                    "var(--surface-container-lowest)",
                borderColor:
                    "var(--outline-variant)",
                boxShadow:
                    "var(--shadow-sm)",
            }}
        >

            {/* Top accent */}

            <div
                className="h-1 w-full"
                style={{
                    background:
                        isCompleted
                            ? "var(--secondary)"
                            : isAbandoned
                                ? "var(--error)"
                                : "var(--primary)",
                }}
            />


            <div className="flex flex-1 flex-col p-5 sm:p-6">

                {/* Header */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                    "
                >

                    <div
                        className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            transition-transform
                            duration-300
                            group-hover:scale-105
                        "
                        style={{
                            background:
                                isCompleted
                                    ? "var(--secondary-container)"
                                    : isAbandoned
                                        ? "var(--error-container)"
                                        : "var(--primary-fixed)",

                            color:
                                isCompleted
                                    ? "var(--on-secondary-container)"
                                    : isAbandoned
                                        ? "var(--on-error-container)"
                                        : "var(--on-primary-fixed)",
                        }}
                    >

                        {isCompleted ? (
                            <Trophy size={21} />
                        ) : isAbandoned ? (
                            <X size={21} />
                        ) : (
                            <Icon size={21} />
                        )}

                    </div>


                    <button
                        type="button"
                        onClick={onDelete}
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            opacity-100
                            transition-all
                            hover:scale-105
                            sm:opacity-0
                            sm:group-hover:opacity-100
                        "
                        style={{
                            background:
                                "var(--surface-container-high)",
                            color:
                                "var(--error)",
                        }}
                        aria-label="
                            Delete interview session
                        "
                    >

                        <Trash2 size={16} />

                    </button>

                </div>


                {/* Status */}

                <div
                    className="
                        mt-5
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    "
                >

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            px-3
                            py-1.5
                            text-[11px]
                            font-bold
                            uppercase
                            tracking-wide
                        "
                        style={{
                            background:
                                isCompleted
                                    ? "var(--secondary-container)"
                                    : isAbandoned
                                        ? "var(--error-container)"
                                        : "var(--primary-fixed)",

                            color:
                                isCompleted
                                    ? "var(--on-secondary-container)"
                                    : isAbandoned
                                        ? "var(--on-error-container)"
                                        : "var(--on-primary-fixed)",
                        }}
                    >

                        {isCompleted ? (
                            <CheckCircle2 size={12} />
                        ) : isAbandoned ? (
                            <X size={12} />
                        ) : (
                            <Clock3 size={12} />
                        )}

                        {isCompleted
                            ? "Completed"
                            : isAbandoned
                                ? "Abandoned"
                                : "In Progress"}

                    </span>


                    <span
                        className="
                            rounded-full
                            border
                            px-3
                            py-1.5
                            text-[11px]
                            font-semibold
                            capitalize
                        "
                        style={{
                            background:
                                "var(--surface-container-low)",
                            color:
                                "var(--on-surface-variant)",
                            borderColor:
                                "var(--outline-variant)",
                        }}
                    >

                        {session.difficulty ||
                            "Medium"}

                    </span>

                </div>


                {/* Title */}

                <div className="mt-4">

                    <h3
                        className="
                            text-lg
                            font-bold
                            leading-7
                        "
                        style={{
                            fontFamily:
                                "var(--font-heading)",
                            color:
                                "var(--on-surface)",
                        }}
                    >

                        {getInterviewTypeLabel(
                            session.type
                        )}{" "}
                        Interview

                    </h3>


                    {jobTitle ? (

                        <p
                            className="
                                mt-2
                                line-clamp-1
                                text-sm
                                font-medium
                            "
                            style={{
                                color:
                                    "var(--on-surface)",
                            }}
                        >

                            {jobTitle}

                            {company && (
                                <>
                                    {" "}
                                    <span
                                        style={{
                                            color:
                                                "var(--on-surface-variant)",
                                        }}
                                    >
                                        at
                                    </span>{" "}
                                    {company}
                                </>
                            )}

                        </p>

                    ) : (

                        <p
                            className="
                                mt-2
                                text-sm
                            "
                            style={{
                                color:
                                    "var(--on-surface-variant)",
                            }}
                        >
                            Personalized AI practice session
                        </p>

                    )}


                    <p
                        className="
                            mt-2
                            flex
                            items-center
                            gap-2
                            text-xs
                        "
                        style={{
                            color:
                                "var(--on-surface-variant)",
                        }}
                    >

                        <CalendarDays size={13} />

                        {formatDate(
                            session.createdAt
                        )}

                    </p>

                </div>


                {/* Performance panel */}

                <div
                    className="
                        mt-5
                        rounded-2xl
                        border
                        p-4
                    "
                    style={{
                        background:
                            "var(--surface-container-low)",
                        borderColor:
                            "var(--outline-variant)",
                    }}
                >

                    {isCompleted ? (

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-4
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                    "
                                    style={{
                                        color:
                                            "var(--on-surface-variant)",
                                    }}
                                >
                                    Overall performance
                                </p>


                                <div
                                    className="
                                        mt-1
                                        flex
                                        items-baseline
                                        gap-1.5
                                    "
                                >

                                    <span
                                        className="
                                            text-3xl
                                            font-bold
                                        "
                                        style={{
                                            fontFamily:
                                                "var(--font-heading)",
                                            color:
                                                "var(--primary)",
                                        }}
                                    >

                                        {score !== null
                                            ? score
                                            : "—"}

                                    </span>

                                    {score !== null && (
                                        <span
                                            className="
                                                text-sm
                                                font-medium
                                            "
                                            style={{
                                                color:
                                                    "var(--on-surface-variant)",
                                            }}
                                        >
                                            / 100
                                        </span>
                                    )}

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-2xl
                                "
                                style={{
                                    background:
                                        "var(--secondary-container)",
                                    color:
                                        "var(--on-secondary-container)",
                                }}
                            >

                                <Trophy size={22} />

                            </div>

                        </div>

                    ) : (

                        <div>

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                        "
                                        style={{
                                            color:
                                                "var(--on-surface-variant)",
                                        }}
                                    >
                                        Interview progress
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-bold
                                        "
                                        style={{
                                            color:
                                                "var(--on-surface)",
                                        }}
                                    >

                                        {answeredQuestions}

                                        <span
                                            style={{
                                                color:
                                                    "var(--on-surface-variant)",
                                            }}
                                        >
                                            {" "}
                                            /{" "}
                                        </span>

                                        {totalQuestions}

                                        {" "}
                                        answered

                                    </p>

                                </div>


                                <span
                                    className="
                                        text-sm
                                        font-bold
                                    "
                                    style={{
                                        color:
                                            "var(--primary)",
                                    }}
                                >
                                    {progress}%
                                </span>

                            </div>


                            <div
                                className="
                                    mt-3
                                    h-2
                                    overflow-hidden
                                    rounded-full
                                "
                                style={{
                                    background:
                                        "var(--surface-container-highest)",
                                }}
                            >

                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        transition-all
                                        duration-500
                                    "
                                    style={{
                                        width:
                                            `${progress}%`,
                                        background:
                                            "var(--primary)",
                                    }}
                                />

                            </div>

                        </div>

                    )}

                </div>


                {/* Question count */}

                <div
                    className="
                        mt-4
                        flex
                        items-center
                        gap-2
                        text-xs
                        font-medium
                    "
                    style={{
                        color:
                            "var(--on-surface-variant)",
                    }}
                >

                    <CircleHelp size={14} />

                    {totalQuestions}{" "}
                    {totalQuestions === 1
                        ? "question"
                        : "questions"}

                    {isCompleted &&
                        session.completedAt && (
                            <>
                                <span>•</span>

                                Completed{" "}
                                {formatDate(
                                    session.completedAt
                                )}
                            </>
                        )}

                </div>


                {/* Action */}

                <button
                    type="button"
                    onClick={onOpen}
                    className="
                        mt-5
                        flex
                        min-h-11
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-bold
                        transition-all
                        hover:-translate-y-0.5
                    "
                    style={{
                        background:
                            isCompleted
                                ? "var(--surface-container-high)"
                                : "var(--primary)",

                        color:
                            isCompleted
                                ? "var(--on-surface)"
                                : "var(--on-primary)",
                    }}
                >

                    {isCompleted ? (
                        <>
                            <Trophy size={17} />

                            Review Performance
                        </>
                    ) : (
                        <>
                            <Play size={17} />

                            {isAbandoned
                                ? "Restart Interview"
                                : "Continue Interview"}
                        </>
                    )}

                    <ChevronRight size={16} />

                </button>

            </div>

        </article>

    );

};


/* =========================================================
   LOADING SKELETON
========================================================= */

const SessionSkeleton = () => {

    return (

        <div
            className="
                animate-pulse
                rounded-[24px]
                border
                p-5
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
                    h-12
                    w-12
                    rounded-2xl
                "
                style={{
                    background:
                        "var(--surface-container-high)",
                }}
            />


            <div
                className="
                    mt-6
                    h-4
                    w-24
                    rounded-full
                "
                style={{
                    background:
                        "var(--surface-container-high)",
                }}
            />


            <div
                className="
                    mt-4
                    h-6
                    w-3/4
                    rounded-lg
                "
                style={{
                    background:
                        "var(--surface-container-high)",
                }}
            />


            <div
                className="
                    mt-3
                    h-4
                    w-1/2
                    rounded-lg
                "
                style={{
                    background:
                        "var(--surface-container-high)",
                }}
            />


            <div
                className="
                    mt-6
                    h-24
                    rounded-2xl
                "
                style={{
                    background:
                        "var(--surface-container-low)",
                }}
            />


            <div
                className="
                    mt-5
                    h-11
                    rounded-xl
                "
                style={{
                    background:
                        "var(--surface-container-high)",
                }}
            />

        </div>

    );

};


export default Interview;