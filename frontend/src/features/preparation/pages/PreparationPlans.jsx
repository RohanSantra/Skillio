import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Search,
    Plus,
    BrainCircuit,
    Target,
    CheckCircle2,
    Clock3,
    MoreVertical,
    Trash2,
    ArrowUpRight,
    Sparkles,
    AlertCircle,
    RefreshCw,
    X,
    CalendarDays,
    ListChecks,
    TrendingUp,
    CircleDashed,
    ChevronRight,
} from "lucide-react";

import usePreparationPlan
    from "../hooks/usePreparationPlan.js";
import HeroStat from "../../../components/HeroStat .jsx";


// ============================================================
// Preparation Plans
// ============================================================

const PreparationPlans = () => {

    const navigate = useNavigate();


    // ========================================================
    // Store / Hook
    // ========================================================

    const {

        preparationPlans,

        isLoading,

        error,

        getAllPreparationPlans,

        deletePreparationPlan,

        clearError,

    } = usePreparationPlan();


    // ========================================================
    // Local State
    // ========================================================

    const [searchQuery, setSearchQuery] =
        useState("");

    const [statusFilter, setStatusFilter] =
        useState("all");

    const [activeMenu, setActiveMenu] =
        useState(null);

    const [deleteTarget, setDeleteTarget] =
        useState(null);

    const [isDeleting, setIsDeleting] =
        useState(false);


    // ========================================================
    // Fetch Plans
    // ========================================================

    useEffect(() => {

        getAllPreparationPlans()
            .catch(() => { });

    }, [
        getAllPreparationPlans,
    ]);


    // ========================================================
    // Statistics
    // ========================================================

    const statistics = useMemo(() => {

        const total =
            preparationPlans.length;


        const completed =
            preparationPlans.filter(
                (plan) =>
                    plan.status ===
                    "completed"
            ).length;


        const inProgress =
            preparationPlans.filter(
                (plan) =>
                    plan.status ===
                    "in-progress"
            ).length;


        const totalTasks =
            preparationPlans.reduce(
                (total, plan) =>
                    total +
                    (plan.tasks?.length || 0),
                0
            );


        const completedTasks =
            preparationPlans.reduce(
                (total, plan) =>
                    total +
                    (
                        plan.tasks?.filter(
                            (task) =>
                                task.isCompleted
                        ).length || 0
                    ),
                0
            );


        return {

            total,

            completed,

            inProgress,

            totalTasks,

            completedTasks,

        };

    }, [
        preparationPlans,
    ]);


    // ========================================================
    // Filter Plans
    // ========================================================

    const filteredPlans =
        useMemo(() => {

            return preparationPlans.filter(
                (plan) => {

                    const searchValue =
                        searchQuery
                            .toLowerCase()
                            .trim();


                    const matchesSearch =
                        !searchValue ||
                        plan.title
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            ) ||
                        plan.overview
                            ?.toLowerCase()
                            .includes(
                                searchValue
                            );


                    const matchesStatus =
                        statusFilter === "all" ||
                        plan.status ===
                        statusFilter;


                    return (
                        matchesSearch &&
                        matchesStatus
                    );

                }
            );

        }, [
            preparationPlans,
            searchQuery,
            statusFilter,
        ]);


    // ========================================================
    // Helpers
    // ========================================================

    const getStatusConfig =
        (status) => {

            switch (status) {

                case "completed":

                    return {

                        label: "Completed",

                        icon: CheckCircle2,

                        className:
                            "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

                    };


                case "in-progress":

                    return {

                        label: "In Progress",

                        icon: TrendingUp,

                        className:
                            "bg-blue-500/10 text-blue-400 border-blue-500/20",

                    };


                default:

                    return {

                        label: "Not Started",

                        icon: CircleDashed,

                        className:
                            "bg-[var(--surface-hover)] text-[var(--text-secondary)] border-[var(--border-color)]",

                    };

            }

        };


    const formatDate =
        (date) => {

            if (!date) {
                return null;
            }


            return new Intl.DateTimeFormat(
                "en-IN",
                {

                    day: "numeric",

                    month: "short",

                    year: "numeric",

                }
            ).format(
                new Date(date)
            );

        };


    // ========================================================
    // Navigation
    // ========================================================

    const handleOpenPlan =
        (planId) => {

            navigate(
                `/preparation-plans/${planId}`
            );

        };


    const handleCreatePlan =
        () => {

            navigate(
                "/job-workspaces"
            );

        };


    // ========================================================
    // Delete
    // ========================================================

    const handleDelete =
        async () => {

            if (!deleteTarget) {
                return;
            }


            try {

                setIsDeleting(true);


                await deletePreparationPlan(
                    deleteTarget._id
                );


                setDeleteTarget(null);


            } catch (error) {

                console.error(
                    error
                );

            } finally {

                setIsDeleting(false);

            }

        };


    // ========================================================
    // Retry
    // ========================================================

    const handleRetry =
        () => {

            clearError();

            getAllPreparationPlans()
                .catch(() => { });

        };


    // ========================================================
    // Render
    // ========================================================

    return (

        <div
            className="
                min-h-screen
                bg-[var(--background)]
                text-[var(--text-primary)]
            "
        >


            {/* ====================================================
                PAGE CONTAINER
            ==================================================== */}

            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1600px]
                    px-4
                    py-6
                    sm:px-6
                    lg:px-8
                    lg:py-8
                "
            >


                {/* ====================================================
    HERO
==================================================== */}

                <section
                    className="
        relative
        overflow-hidden
        rounded-[30px]
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


                    {/* ====================================================
        BACKGROUND ARTWORK
    ==================================================== */}

                    <div
                        className="
            pointer-events-none
            absolute
            -right-28
            -top-28
            h-80
            w-80
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
            left-1/3
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
            pointer-events-none
            absolute
            bottom-[-120px]
            left-[-80px]
            h-56
            w-56
            rounded-full
            opacity-5
        "
                        style={{
                            background:
                                "var(--primary-fixed)",
                        }}
                    />


                    {/* ====================================================
        MAIN CONTENT
    ==================================================== */}

                    <div
                        className="
            relative
            z-10
            flex
            flex-col
            gap-8
            xl:flex-row
            xl:items-center
            xl:justify-between
        "
                    >


                        {/* ==================================================
            HERO CONTENT
        ================================================== */}

                        <div
                            className="
                max-w-3xl
            "
                        >


                            {/* BADGE */}

                            <div
                                className="
                    mb-5
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-3
                    py-1.5
                    text-sm
                    font-medium
                "
                                style={{
                                    background:
                                        "rgba(255,255,255,0.12)",
                                    borderColor:
                                        "rgba(255,255,255,0.14)",
                                    color:
                                        "var(--primary-fixed)",
                                }}
                            >

                                <Sparkles
                                    size={15}
                                />

                                AI Career Preparation

                            </div>


                            {/* HEADING */}

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

                                Preparation Plans

                            </h1>


                            {/* DESCRIPTION */}

                            <p
                                className="
                    mt-4
                    max-w-2xl
                    text-sm
                    leading-7
                    sm:text-base
                "
                                style={{
                                    color:
                                        "rgba(255,255,255,0.76)",
                                }}
                            >

                                Transform your job opportunities into
                                personalized preparation strategies.
                                Track important tasks, strengthen weak
                                areas, and prepare with confidence.

                            </p>


                            {/* ==================================================
                WORKFLOW
            ================================================== */}

                            <div
                                className="
                    mt-6
                    flex
                    flex-wrap
                    items-center
                    gap-2
                    text-xs
                "
                            >

                                <span
                                    className="
                        rounded-lg
                        px-3
                        py-2
                    "
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.10)",
                                        color:
                                            "rgba(255,255,255,0.72)",
                                    }}
                                >
                                    Job Analysis
                                </span>


                                <ChevronRight
                                    size={15}
                                    style={{
                                        color:
                                            "rgba(255,255,255,0.45)",
                                    }}
                                />


                                <span
                                    className="
                        rounded-lg
                        px-3
                        py-2
                    "
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.10)",
                                        color:
                                            "rgba(255,255,255,0.72)",
                                    }}
                                >
                                    Skill Gap
                                </span>


                                <ChevronRight
                                    size={15}
                                    style={{
                                        color:
                                            "rgba(255,255,255,0.45)",
                                    }}
                                />


                                <span
                                    className="
                        rounded-lg
                        px-3
                        py-2
                    "
                                    style={{
                                        background:
                                            "rgba(255,255,255,0.16)",
                                        color:
                                            "var(--primary-fixed)",
                                    }}
                                >
                                    AI Preparation Plan
                                </span>

                            </div>


                        </div>


                        {/* ==================================================
            HERO ACTION
        ================================================== */}

                        <div
                            className="
                flex
                flex-col
                gap-3
                sm:flex-row
                xl:flex-col
            "
                        >

                            <button
                                onClick={
                                    handleCreatePlan
                                }
                                className="
                    inline-flex
                    min-h-[54px]
                    items-center
                    justify-center
                    gap-2
                    rounded-2xl
                    px-6
                    font-semibold
                    transition-all
                    hover:-translate-y-0.5
                    active:translate-y-0
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

                                <Sparkles
                                    size={19}
                                />

                                Create from Job

                                <ArrowUpRight
                                    size={18}
                                />

                            </button>


                            <p
                                className="
                    max-w-[230px]
                    text-center
                    text-xs
                    leading-5
                "
                                style={{
                                    color:
                                        "rgba(255,255,255,0.62)",
                                }}
                            >

                                Choose a job workspace to generate
                                an AI-powered preparation plan.

                            </p>

                        </div>


                    </div>


                    {/* ====================================================
        STATISTICS
    ==================================================== */}

                    <div
                        className="
            relative
            z-10
            mt-9
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-4
        "
                    >


                        <HeroStat
                            icon={BrainCircuit}
                            label="Total Plans"
                            value={statistics.total}
                        />


                        <HeroStat
                            icon={TrendingUp}
                            label="In Progress"
                            value={statistics.inProgress}
                        />


                        <HeroStat
                            icon={CheckCircle2}
                            label="Completed"
                            value={statistics.completed}
                        />


                        <HeroStat
                            icon={Target}
                            label="Overall Progress"
                            value={`${statistics.completedTasks}/${statistics.totalTasks}`}
                        />


                    </div>


                </section>


                {/* ====================================================
                    ERROR
                ==================================================== */}

                {
                    error &&

                    <div
                        className="
                            mt-6
                            flex
                            flex-col
                            gap-4
                            rounded-2xl
                            border
                            border-red-500/20
                            bg-red-500/5
                            p-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
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
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-red-500/10
                                    text-red-400
                                "
                            >

                                <AlertCircle
                                    size={20}
                                />

                            </div>


                            <div>

                                <p
                                    className="
                                        font-medium
                                        text-red-400
                                    "
                                >

                                    Something went wrong

                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-sm
                                        text-[var(--text-secondary)]
                                    "
                                >

                                    {error}

                                </p>

                            </div>

                        </div>


                        <button
                            onClick={
                                handleRetry
                            }
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                px-4
                                py-2.5
                                text-sm
                                font-medium
                                transition
                                hover:bg-[var(--surface-hover)]
                            "
                        >

                            <RefreshCw
                                size={16}
                            />

                            Retry

                        </button>

                    </div>

                }


                {/* ====================================================
                    CONTENT HEADER
                ==================================================== */}

                <div
                    className="
                        mt-8
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-center
                        lg:justify-between
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


                    <div>

                        <h2
                            className="
                                text-xl
                                font-semibold
                                sm:text-2xl
                            "
                        >

                            Your Preparation Plans

                        </h2>


                        <p
                            className="
                                mt-1.5
                                text-sm
                                text-[var(--text-secondary)]
                            "
                        >

                            {
                                filteredPlans.length
                            } plan
                            {
                                filteredPlans.length !== 1
                                    ? "s"
                                    : ""
                            } found

                        </p>

                    </div>


                    {/* Controls */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            sm:flex-row
                        "
                    >


                        {/* Search */}

                        <div
                            className="
                                relative
                                min-w-[250px]
                            "
                        >

                            <Search
                                size={18}
                                className="
                                    absolute
                                    left-4
                                    top-1/2
                                    -translate-y-1/2
                                    text-[var(--text-muted)]
                                "
                            />


                            <input
                                type="text"
                                value={searchQuery}
                                onChange={
                                    (event) =>
                                        setSearchQuery(
                                            event.target.value
                                        )
                                }
                                placeholder="Search preparation plans..."
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--border-color)]
                                    bg-[var(--surface)]
                                    pl-11
                                    pr-4
                                    text-sm
                                    outline-none
                                    transition
                                    placeholder:text-[var(--text-muted)]
                                    focus:border-[var(--primary)]/60
                                    focus:ring-4
                                    focus:ring-[var(--primary)]/10
                                "
                            />

                        </div>


                        {/* Status Filter */}

                        <select
                            value={statusFilter}
                            onChange={
                                (event) =>
                                    setStatusFilter(
                                        event.target.value
                                    )
                            }
                            className="
                                h-11
                                rounded-xl
                                border
                                border-[var(--border-color)]
                                bg-[var(--surface)]
                                px-4
                                text-sm
                                font-medium
                                outline-none
                                transition
                                focus:border-[var(--primary)]/60
                                focus:ring-4
                                focus:ring-[var(--primary)]/10
                            "
                        >

                            <option value="all">
                                All Status
                            </option>

                            <option value="not-started">
                                Not Started
                            </option>

                            <option value="in-progress">
                                In Progress
                            </option>

                            <option value="completed">
                                Completed
                            </option>

                        </select>


                    </div>


                </div>


                {/* ====================================================
                    LOADING
                ==================================================== */}

                {
                    isLoading &&

                    <div
                        className="
                            mt-6
                            grid
                            gap-5
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {
                            Array.from(
                                { length: 6 }
                            ).map(
                                (_, index) => (

                                    <PlanSkeleton
                                        key={index}
                                    />

                                )
                            )
                        }

                    </div>

                }


                {/* ====================================================
                    EMPTY STATE
                ==================================================== */}

                {
                    !isLoading &&
                    preparationPlans.length === 0 &&

                    <EmptyState
                        onCreate={
                            handleCreatePlan
                        }
                    />

                }


                {/* ====================================================
                    NO SEARCH RESULTS
                ==================================================== */}

                {
                    !isLoading &&
                    preparationPlans.length > 0 &&
                    filteredPlans.length === 0 &&

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
                            border-dashed
                            border-[var(--border-color)]
                            bg-[var(--surface)]
                            px-6
                            text-center
                        "
                    >

                        <div
                            className="
                                flex
                                h-16
                                w-16
                                items-center
                                justify-center
                                rounded-2xl
                                bg-[var(--surface-hover)]
                                text-[var(--text-secondary)]
                            "
                        >

                            <Search
                                size={28}
                            />

                        </div>


                        <h3
                            className="
                                mt-5
                                text-lg
                                font-semibold
                            "
                        >

                            No plans found

                        </h3>


                        <p
                            className="
                                mt-2
                                max-w-sm
                                text-sm
                                leading-6
                                text-[var(--text-secondary)]
                            "
                        >

                            Try changing your search or filter
                            to find the preparation plan you're
                            looking for.

                        </p>


                        <button
                            onClick={() => {

                                setSearchQuery("");

                                setStatusFilter("all");

                            }}
                            className="
                                mt-5
                                text-sm
                                font-semibold
                                text-[var(--primary)]
                            "
                        >

                            Clear filters

                        </button>

                    </div>

                }


                {/* ====================================================
                    PLANS GRID
                ==================================================== */}

                {
                    !isLoading &&
                    filteredPlans.length > 0 &&

                    <div
                        className="
                            mt-6
                            grid
                            gap-5
                            md:grid-cols-2
                            xl:grid-cols-3
                        "
                    >

                        {
                            filteredPlans.map(
                                (plan) => {

                                    const statusConfig =
                                        getStatusConfig(
                                            plan.status
                                        );


                                    const StatusIcon =
                                        statusConfig.icon;


                                    const totalTasks =
                                        plan.tasks?.length || 0;


                                    const completedTasks =
                                        plan.tasks?.filter(
                                            (task) =>
                                                task.isCompleted
                                        ).length || 0;


                                    return (

                                        <article
                                            key={plan._id}
                                            className="
                                                group
                                                relative
                                                flex
                                                min-h-[350px]
                                                flex-col
                                                overflow-hidden
                                                rounded-[24px]
                                                border
                                                border-[var(--border-color)]
                                                bg-[var(--surface)]
                                                p-5
                                                transition-all
                                                duration-300
                                                hover:-translate-y-1
                                                hover:border-[var(--primary)]/30
                                                hover:shadow-xl
                                            "
                                        >


                                            {/* Top */}

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
                                                        min-w-0
                                                        items-start
                                                        gap-3
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
                                                            bg-[var(--primary)]/10
                                                            text-[var(--primary)]
                                                        "
                                                    >

                                                        <Target
                                                            size={22}
                                                        />

                                                    </div>


                                                    <div
                                                        className="
                                                            min-w-0
                                                        "
                                                    >

                                                        <h3
                                                            className="
                                                                truncate
                                                                font-semibold
                                                                text-[var(--text-primary)]
                                                            "
                                                        >

                                                            {
                                                                plan.title
                                                            }

                                                        </h3>


                                                        <div
                                                            className="
                                                                mt-2
                                                                flex
                                                                items-center
                                                                gap-2
                                                            "
                                                        >

                                                            <span
                                                                className={`
                                                                    inline-flex
                                                                    items-center
                                                                    gap-1.5
                                                                    rounded-full
                                                                    border
                                                                    px-2.5
                                                                    py-1
                                                                    text-xs
                                                                    font-medium
                                                                    ${statusConfig.className}
                                                                `}
                                                            >

                                                                <StatusIcon
                                                                    size={13}
                                                                />

                                                                {
                                                                    statusConfig.label
                                                                }

                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* Menu */}

                                                <div
                                                    className="
                                                        relative
                                                    "
                                                >

                                                    <button
                                                        onClick={
                                                            (event) => {

                                                                event.stopPropagation();

                                                                setActiveMenu(
                                                                    activeMenu ===
                                                                        plan._id
                                                                        ? null
                                                                        : plan._id
                                                                );

                                                            }
                                                        }
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            text-[var(--text-muted)]
                                                            transition
                                                            hover:bg-[var(--surface-hover)]
                                                            hover:text-[var(--text-primary)]
                                                        "
                                                    >

                                                        <MoreVertical
                                                            size={19}
                                                        />

                                                    </button>


                                                    {
                                                        activeMenu ===
                                                        plan._id &&

                                                        <div
                                                            className="
                                                                absolute
                                                                right-0
                                                                top-11
                                                                z-30
                                                                w-44
                                                                overflow-hidden
                                                                rounded-xl
                                                                border
                                                                border-[var(--border-color)]
                                                                bg-[var(--surface)]
                                                                p-1.5
                                                                shadow-xl
                                                            "
                                                        >

                                                            <button
                                                                onClick={() => {

                                                                    setActiveMenu(
                                                                        null
                                                                    );

                                                                    handleOpenPlan(
                                                                        plan._id
                                                                    );

                                                                }}
                                                                className="
                                                                    flex
                                                                    w-full
                                                                    items-center
                                                                    gap-2
                                                                    rounded-lg
                                                                    px-3
                                                                    py-2.5
                                                                    text-left
                                                                    text-sm
                                                                    transition
                                                                    hover:bg-[var(--surface-hover)]
                                                                "
                                                            >

                                                                <ArrowUpRight
                                                                    size={16}
                                                                />

                                                                Open Plan

                                                            </button>


                                                            <button
                                                                onClick={() => {

                                                                    setActiveMenu(
                                                                        null
                                                                    );

                                                                    setDeleteTarget(
                                                                        plan
                                                                    );

                                                                }}
                                                                className="
                                                                    flex
                                                                    w-full
                                                                    items-center
                                                                    gap-2
                                                                    rounded-lg
                                                                    px-3
                                                                    py-2.5
                                                                    text-left
                                                                    text-sm
                                                                    text-red-400
                                                                    transition
                                                                    hover:bg-red-500/10
                                                                "
                                                            >

                                                                <Trash2
                                                                    size={16}
                                                                />

                                                                Delete

                                                            </button>

                                                        </div>

                                                    }

                                                </div>

                                            </div>


                                            {/* Overview */}

                                            <p
                                                className="
                                                    mt-5
                                                    line-clamp-3
                                                    min-h-[60px]
                                                    text-sm
                                                    leading-6
                                                    text-[var(--text-secondary)]
                                                "
                                            >

                                                {
                                                    plan.overview ||
                                                    "A personalized preparation plan generated to help you prepare strategically for this opportunity."
                                                }

                                            </p>


                                            {/* Progress */}

                                            <div
                                                className="
                                                    mt-6
                                                "
                                            >

                                                <div
                                                    className="
                                                        mb-3
                                                        flex
                                                        items-center
                                                        justify-between
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-sm
                                                        "
                                                    >

                                                        <TrendingUp
                                                            size={16}
                                                            className="
                                                                text-[var(--primary)]
                                                            "
                                                        />

                                                        <span
                                                            className="
                                                                font-medium
                                                            "
                                                        >

                                                            Progress

                                                        </span>

                                                    </div>


                                                    <span
                                                        className="
                                                            text-sm
                                                            font-semibold
                                                            text-[var(--primary)]
                                                        "
                                                    >

                                                        {
                                                            plan.progress || 0
                                                        }%

                                                    </span>

                                                </div>


                                                <div
                                                    className="
                                                        h-2.5
                                                        overflow-hidden
                                                        rounded-full
                                                        bg-[var(--surface-hover)]
                                                    "
                                                >

                                                    <div
                                                        style={{
                                                            width:
                                                                `${plan.progress || 0}%`,
                                                        }}
                                                        className="
                                                            h-full
                                                            rounded-full
                                                            bg-[var(--primary)]
                                                            transition-all
                                                            duration-500
                                                        "
                                                    />

                                                </div>

                                            </div>


                                            {/* Task Information */}

                                            <div
                                                className="
                                                    mt-6
                                                    grid
                                                    grid-cols-2
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        rounded-xl
                                                        border
                                                        border-[var(--border-color)]
                                                        bg-[var(--surface-hover)]/40
                                                        p-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-[var(--text-muted)]
                                                        "
                                                    >

                                                        <ListChecks
                                                            size={15}
                                                        />

                                                        <span
                                                            className="
                                                                text-xs
                                                            "
                                                        >

                                                            Tasks

                                                        </span>

                                                    </div>


                                                    <p
                                                        className="
                                                            mt-2
                                                            text-sm
                                                            font-semibold
                                                        "
                                                    >

                                                        {
                                                            completedTasks
                                                        }
                                                        /
                                                        {
                                                            totalTasks
                                                        }

                                                    </p>

                                                </div>


                                                <div
                                                    className="
                                                        rounded-xl
                                                        border
                                                        border-[var(--border-color)]
                                                        bg-[var(--surface-hover)]/40
                                                        p-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-[var(--text-muted)]
                                                        "
                                                    >

                                                        <CalendarDays
                                                            size={15}
                                                        />

                                                        <span
                                                            className="
                                                                text-xs
                                                            "
                                                        >

                                                            Generated

                                                        </span>

                                                    </div>


                                                    <p
                                                        className="
                                                            mt-2
                                                            truncate
                                                            text-sm
                                                            font-semibold
                                                        "
                                                    >

                                                        {
                                                            formatDate(
                                                                plan.generatedAt ||
                                                                plan.createdAt
                                                            ) ||
                                                            "Manual"
                                                        }

                                                    </p>

                                                </div>

                                            </div>


                                            {/* Footer */}

                                            <div
                                                className="
                                                    mt-auto
                                                    pt-6
                                                "
                                            >

                                                <button
                                                    onClick={() =>
                                                        handleOpenPlan(
                                                            plan._id
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        w-full
                                                        items-center
                                                        justify-between
                                                        rounded-xl
                                                        border
                                                        border-[var(--border-color)]
                                                        px-4
                                                        py-3
                                                        text-sm
                                                        font-semibold
                                                        transition-all
                                                        hover:border-[var(--primary)]/30
                                                        hover:bg-[var(--primary)]/5
                                                    "
                                                >

                                                    Continue Preparation

                                                    <ChevronRight
                                                        size={18}
                                                        className="
                                                            transition-transform
                                                            group-hover:translate-x-1
                                                        "
                                                    />

                                                </button>

                                            </div>


                                        </article>

                                    );

                                }
                            )
                        }

                    </div>

                }


            </div>


            {/* ====================================================
                DELETE MODAL
            ==================================================== */}

            {
                deleteTarget &&

                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-black/60
                        px-4
                        backdrop-blur-sm
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            rounded-[24px]
                            border
                            border-[var(--border-color)]
                            bg-[var(--surface)]
                            p-6
                            shadow-2xl
                        "
                    >


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
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-red-500/10
                                    text-red-400
                                "
                            >

                                <Trash2
                                    size={22}
                                />

                            </div>


                            <button
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                disabled={isDeleting}
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-[var(--text-muted)]
                                    transition
                                    hover:bg-[var(--surface-hover)]
                                "
                            >

                                <X
                                    size={18}
                                />

                            </button>

                        </div>


                        <h3
                            className="
                                mt-5
                                text-xl
                                font-semibold
                            "
                        >

                            Delete preparation plan?

                        </h3>


                        <p
                            className="
                                mt-2
                                text-sm
                                leading-6
                                text-[var(--text-secondary)]
                            "
                        >

                            This will permanently delete
                            <span
                                className="
                                    mx-1
                                    font-semibold
                                    text-[var(--text-primary)]
                                "
                            >

                                "{deleteTarget.title}"

                            </span>

                            and all of its preparation tasks.

                        </p>


                        <div
                            className="
                                mt-7
                                flex
                                flex-col-reverse
                                gap-3
                                sm:flex-row
                                sm:justify-end
                            "
                        >

                            <button
                                onClick={() =>
                                    setDeleteTarget(
                                        null
                                    )
                                }
                                disabled={isDeleting}
                                className="
                                    rounded-xl
                                    border
                                    border-[var(--border-color)]
                                    px-5
                                    py-3
                                    text-sm
                                    font-medium
                                    transition
                                    hover:bg-[var(--surface-hover)]
                                "
                            >

                                Cancel

                            </button>


                            <button
                                onClick={
                                    handleDelete
                                }
                                disabled={isDeleting}
                                className="
                                    inline-flex
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-red-500
                                    px-5
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-white
                                    transition
                                    hover:bg-red-600
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >

                                {
                                    isDeleting
                                        ? (
                                            <>
                                                <RefreshCw
                                                    size={17}
                                                    className="animate-spin"
                                                />

                                                Deleting...

                                            </>
                                        )
                                        : (
                                            <>
                                                <Trash2
                                                    size={17}
                                                />

                                                Delete Plan

                                            </>
                                        )
                                }

                            </button>

                        </div>


                    </div>

                </div>

            }


        </div>

    );

};




// ============================================================
// PLAN SKELETON
// ============================================================

const PlanSkeleton = () => {

    return (

        <div
            className="
                min-h-[350px]
                animate-pulse
                rounded-[24px]
                border
                border-[var(--border-color)]
                bg-[var(--surface)]
                p-5
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
                        h-12
                        w-12
                        rounded-2xl
                        bg-[var(--surface-hover)]
                    "
                />


                <div
                    className="
                        flex-1
                    "
                >

                    <div
                        className="
                            h-4
                            w-3/4
                            rounded
                            bg-[var(--surface-hover)]
                        "
                    />


                    <div
                        className="
                            mt-3
                            h-6
                            w-24
                            rounded-full
                            bg-[var(--surface-hover)]
                        "
                    />

                </div>

            </div>


            <div
                className="
                    mt-6
                    space-y-3
                "
            >

                <div
                    className="
                        h-3
                        rounded
                        bg-[var(--surface-hover)]
                    "
                />

                <div
                    className="
                        h-3
                        w-5/6
                        rounded
                        bg-[var(--surface-hover)]
                    "
                />

                <div
                    className="
                        h-3
                        w-2/3
                        rounded
                        bg-[var(--surface-hover)]
                    "
                />

            </div>


            <div
                className="
                    mt-8
                    h-3
                    rounded-full
                    bg-[var(--surface-hover)]
                "
            />


            <div
                className="
                    mt-6
                    grid
                    grid-cols-2
                    gap-3
                "
            >

                <div
                    className="
                        h-20
                        rounded-xl
                        bg-[var(--surface-hover)]
                    "
                />

                <div
                    className="
                        h-20
                        rounded-xl
                        bg-[var(--surface-hover)]
                    "
                />

            </div>

        </div>

    );

};



// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = ({

    onCreate,

}) => {

    return (

        <div
            className="
                mt-6
                flex
                min-h-[440px]
                flex-col
                items-center
                justify-center
                overflow-hidden
                rounded-[28px]
                border
                border-dashed
                border-[var(--border-color)]
                bg-[var(--surface)]
                px-6
                text-center
            "
        >

            <div
                className="
                    relative
                "
            >

                <div
                    className="
                        absolute
                        inset-0
                        rounded-full
                        bg-[var(--primary)]/10
                        blur-2xl
                    "
                />


                <div
                    className="
                        relative
                        flex
                        h-20
                        w-20
                        items-center
                        justify-center
                        rounded-[28px]
                        bg-[var(--primary)]/10
                        text-[var(--primary)]
                    "
                >

                    <BrainCircuit
                        size={36}
                    />

                </div>

            </div>


            <h3
                className="
                    mt-7
                    text-xl
                    font-semibold
                "
            >

                No preparation plans yet

            </h3>


            <p
                className="
                    mt-3
                    max-w-md
                    text-sm
                    leading-7
                    text-[var(--text-secondary)]
                "
            >

                Create a personalized preparation plan for one
                of your job opportunities and organize exactly
                what you need to prepare.

            </p>


            <button
                onClick={onCreate}
                className="
                    mt-7
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[var(--primary)]
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    shadow-lg
                    shadow-[var(--primary)]/20
                    transition-all
                    hover:-translate-y-0.5
                "
            >

                <Plus
                    size={18}
                />

                Create Your First Plan

            </button>

        </div>

    );

};


export default PreparationPlans;
