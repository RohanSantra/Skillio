import {
    ArrowRight,
    ArrowUpRight,
    Award,
    BellRing,
    BookOpen,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    Clock3,
    FileText,
    Flame,
    FolderKanban,
    GraduationCap,
    MessageCircle,
    MessageSquare,
    Play,
    Plus,
    RefreshCw,
    Sparkles,
    Target,
    TrendingUp,
    UserRound,
    Video,
    Zap,
    Clock,
    CircleCheck,
    Compass
} from "lucide-react";
import ErrorToast from "../../../components/feedback/ErrorToast.jsx";

import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useNavigate,
} from "react-router-dom";


import useAuthStore from "../../auth/store/auth.store.js";

import {
    getCareerProfile,
} from "../../career-profile/services/careerProfile.api.js";

import {
    getAllJobWorkspaces,
} from "../../job-workspace/services/jobWorkspace.api.js";

import {
    getAllPreparationPlans,
} from "../../preparation/services/preparationPlan.api.js";

import {
    getAllResumes,
} from "../../resume/services/resume.api.js";

import {
    getInterviewSessionsApi,
} from "../../interview/services/interviewSession.api.js";

import coachConversationApi from "../../career-coach/services/coachConversation.api.js";

import {
    getAllApplications,
} from "../../application/services/application.api.js";
import HeroStat from "../../../components/HeroStat .jsx";


// ============================================================
// HELPERS
// ============================================================

const safeArray = (value) => {
    return Array.isArray(value) ? value : [];
};


const getResponseData = (response) => {
    return (
        response?.data?.data ||
        response?.data ||
        {}
    );
};


const getArrayFromResponse = (
    response,
    possibleKeys = []
) => {
    const data = getResponseData(response);

    if (Array.isArray(data)) {
        return data;
    }

    for (const key of possibleKeys) {
        if (Array.isArray(data?.[key])) {
            return data[key];
        }
    }

    return [];
};


const formatDate = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "";
    }

    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
            year: "numeric",
        }
    );
};


const formatShortDate = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
        return "";
    }

    return parsed.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
        }
    );
};


const getTimeAgo = (date) => {
    if (!date) return "Recently";

    const then = new Date(date).getTime();

    if (Number.isNaN(then)) {
        return "Recently";
    }

    const difference = Math.max(
        0,
        Date.now() - then
    );

    const minutes = Math.floor(
        difference / 60000
    );

    if (minutes < 1) {
        return "Just now";
    }

    if (minutes < 60) {
        return `${minutes}m ago`;
    }

    const hours = Math.floor(
        minutes / 60
    );

    if (hours < 24) {
        return `${hours}h ago`;
    }

    const days = Math.floor(
        hours / 24
    );

    if (days < 7) {
        return `${days}d ago`;
    }

    return formatDate(date);
};


const getTaskArray = (plan) => {
    return safeArray(
        plan?.tasks ||
        plan?.planTasks ||
        plan?.items
    );
};


const isTaskCompleted = (task) => {
    const status = String(
        task?.status || ""
    ).toLowerCase();

    return (
        status === "completed" ||
        status === "complete" ||
        status === "done" ||
        task?.completed === true ||
        task?.isCompleted === true
    );
};


const getPreparationProgress = (plan) => {
    const tasks = getTaskArray(plan);

    if (!tasks.length) {
        return Number(
            plan?.progress ||
            plan?.completionPercentage ||
            0
        );
    }

    const completed = tasks.filter(
        isTaskCompleted
    ).length;

    return Math.round(
        (completed / tasks.length) * 100
    );
};


const getWorkspaceRole = (workspace) => {
    return (
        workspace?.role ||
        workspace?.jobTitle ||
        workspace?.title ||
        "Untitled role"
    );
};


const getWorkspaceCompany = (workspace) => {
    return (
        workspace?.company ||
        workspace?.companyName ||
        "Unknown company"
    );
};


const getWorkspaceMatch = (workspace) => {
    const value =
        workspace?.match?.score ??
        workspace?.jobMatch?.score ??
        workspace?.matchScore ??
        workspace?.analysis?.matchScore;

    const number = Number(value);

    return Number.isFinite(number)
        ? Math.round(number)
        : null;
};


const getCompanyInitial = (company) => {
    return (
        company
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase() || "?"
    );
};


// ============================================================
// PROGRESS BAR
// ============================================================

const ProgressBar = ({
    value = 0,
    height = "h-2",
}) => {
    const safeValue = Math.min(
        100,
        Math.max(
            0,
            Number(value) || 0
        )
    );

    return (
        <div
            className={`
                ${height}
                w-full
                overflow-hidden
                rounded-full
                bg-[var(--surface-container-high)]
            `}
        >
            <div
                className="
                    h-full
                    rounded-full
                    bg-[var(--primary)]
                    transition-all
                    duration-700
                "
                style={{
                    width: `${safeValue}%`,
                }}
            />
        </div>
    );
};


// ============================================================
// SECTION HEADER
// ============================================================

const SectionHeader = ({
    eyebrow,
    title,
    description,
    action,
    to,
}) => {
    return (
        <div
            className="
                mb-5
                flex
                items-end
                justify-between
                gap-4
            "
        >
            <div className="min-w-0">

                {eyebrow && (
                    <p
                        className="
                            mb-1.5
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-[var(--primary)]
                        "
                    >
                        {eyebrow}
                    </p>
                )}

                <h2
                    className="
                        text-xl
                        font-bold
                        tracking-tight
                        text-[var(--on-surface)]
                    "
                    style={{
                        fontFamily:
                            "var(--font-heading)",
                    }}
                >
                    {title}
                </h2>

                {description && (
                    <p
                        className="
                            mt-1
                            max-w-2xl
                            text-xs
                            leading-5
                            text-[var(--on-surface-variant)]
                        "
                    >
                        {description}
                    </p>
                )}
            </div>

            {action && to && (
                <Link
                    to={to}
                    className="
                        hidden
                        shrink-0
                        items-center
                        gap-1
                        text-sm
                        font-semibold
                        text-[var(--primary)]
                        sm:flex
                    "
                >
                    {action}

                    <ChevronRight
                        size={16}
                    />
                </Link>
            )}
        </div>
    );
};


// ============================================================
// STAT CARD
// ============================================================

const StatCard = ({
    icon: Icon,
    label,
    value,
    description,
    trend,
    to,
}) => {

    const content = (
        <div
            className="
                group
                relative
                overflow-hidden
                rounded-[1.35rem]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface)]
                p-5
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)]
            "
        >

            <div
                className="
                    absolute
                    -right-8
                    -top-8
                    h-24
                    w-24
                    rounded-full
                    bg-[var(--primary-container)]
                    opacity-40
                    blur-2xl
                "
            />

            <div
                className="
                    relative
                    flex
                    items-start
                    justify-between
                    gap-3
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
                        bg-[var(--primary-container)]
                        text-[var(--on-primary-container)]
                    "
                >
                    <Icon size={20} />
                </div>

                {trend && (
                    <span
                        className="
                            rounded-full
                            bg-[var(--surface-container)]
                            px-2.5
                            py-1
                            text-[10px]
                            font-bold
                            text-[var(--primary)]
                        "
                    >
                        {trend}
                    </span>
                )}
            </div>

            <div className="relative mt-5">

                <p
                    className="
                        text-3xl
                        font-bold
                        tracking-tight
                        text-[var(--on-surface)]
                    "
                >
                    {value}
                </p>

                <p
                    className="
                        mt-1
                        text-sm
                        font-semibold
                        text-[var(--on-surface)]
                    "
                >
                    {label}
                </p>

                {description && (
                    <p
                        className="
                            mt-1
                            text-xs
                            leading-5
                            text-[var(--on-surface-variant)]
                        "
                    >
                        {description}
                    </p>
                )}
            </div>

            {to && (
                <ArrowUpRight
                    size={17}
                    className="
                        absolute
                        bottom-5
                        right-5
                        text-[var(--on-surface-variant)]
                        transition
                        group-hover:-translate-y-0.5
                        group-hover:translate-x-0.5
                        group-hover:text-[var(--primary)]
                    "
                />
            )}
        </div>
    );

    if (!to) {
        return content;
    }

    return (
        <Link to={to}>
            {content}
        </Link>
    );
};


// ============================================================
// EMPTY STATE
// ============================================================

const EmptyState = ({
    icon: Icon,
    title,
    description,
    action,
    to,
}) => {
    return (
        <div
            className="
                flex
                min-h-48
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-dashed
                border-[var(--outline-variant)]
                px-5
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
                    rounded-2xl
                    bg-[var(--surface-container)]
                    text-[var(--primary)]
                "
            >
                <Icon size={22} />
            </div>

            <h3
                className="
                    mt-4
                    text-sm
                    font-bold
                    text-[var(--on-surface)]
                "
            >
                {title}
            </h3>

            <p
                className="
                    mt-1
                    max-w-sm
                    text-xs
                    leading-5
                    text-[var(--on-surface-variant)]
                "
            >
                {description}
            </p>

            {action && to && (
                <Link
                    to={to}
                    className="
                        mt-4
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        bg-[var(--primary)]
                        px-4
                        py-2.5
                        text-xs
                        font-bold
                        text-[var(--on-primary)]
                    "
                >
                    {action}
                    <ArrowRight size={14} />
                </Link>
            )}
        </div>
    );
};


// ============================================================
// DASHBOARD
// ============================================================

const Dashboard = () => {

    const navigate = useNavigate();

    const user = useAuthStore(
        (state) => state.user
    );


    // --------------------------------------------------------
    // STATE
    // --------------------------------------------------------

    const [loading, setLoading] =
        useState(true);

    const [refreshing, setRefreshing] =
        useState(false);

    const [error, setError] =
        useState(null);

    const [careerProfile, setCareerProfile] =
        useState(null);

    const [workspaces, setWorkspaces] =
        useState([]);

    const [preparationPlans, setPreparationPlans] =
        useState([]);

    const [resumes, setResumes] =
        useState([]);

    const [interviewSessions, setInterviewSessions] =
        useState([]);

    const [conversations, setConversations] =
        useState([]);

    const [applications, setApplications] =
        useState([]);


    // --------------------------------------------------------
    // LOAD DATA
    // --------------------------------------------------------

    const loadDashboard = useCallback(
        async (showRefresh = false) => {

            try {

                if (showRefresh) {
                    setRefreshing(true);
                } else {
                    setLoading(true);
                }

                setError(null);

                const results =
                    await Promise.allSettled([
                        getCareerProfile(),
                        getAllJobWorkspaces(),
                        getAllPreparationPlans(),
                        getAllResumes(),
                        getInterviewSessionsApi(),
                        coachConversationApi.getConversations(),
                        getAllApplications(),
                    ]);


                // Career profile

                if (
                    results[0].status ===
                    "fulfilled"
                ) {
                    const response =
                        results[0].value;

                    const data =
                        getResponseData(
                            response
                        );

                    setCareerProfile(
                        data?.careerProfile ||
                        data?.profile ||
                        data ||
                        null
                    );
                }


                // Workspaces

                if (
                    results[1].status ===
                    "fulfilled"
                ) {
                    setWorkspaces(
                        getArrayFromResponse(
                            results[1].value,
                            [
                                "jobWorkspaces",
                                "workspaces",
                            ]
                        )
                    );
                }


                // Preparation

                if (
                    results[2].status ===
                    "fulfilled"
                ) {
                    setPreparationPlans(
                        getArrayFromResponse(
                            results[2].value,
                            [
                                "preparationPlans",
                                "plans",
                            ]
                        )
                    );
                }


                // Resumes

                if (
                    results[3].status ===
                    "fulfilled"
                ) {
                    setResumes(
                        getArrayFromResponse(
                            results[3].value,
                            [
                                "resumes",
                            ]
                        )
                    );
                }


                // Interviews

                if (
                    results[4].status ===
                    "fulfilled"
                ) {
                    setInterviewSessions(
                        getArrayFromResponse(
                            results[4].value,
                            [
                                "interviewSessions",
                                "sessions",
                            ]
                        )
                    );
                }


                // Coach

                if (
                    results[5].status ===
                    "fulfilled"
                ) {
                    const response =
                        results[5].value;

                    const data =
                        getResponseData(
                            response
                        );

                    setConversations(
                        safeArray(
                            data?.conversations
                        )
                    );
                }


                // Applications

                if (
                    results[6].status ===
                    "fulfilled"
                ) {
                    setApplications(
                        getArrayFromResponse(
                            results[6].value,
                            [
                                "applications",
                            ]
                        )
                    );
                }

            } catch (err) {

                console.error(
                    "Dashboard loading error:",
                    err
                );

                setError(
                    "Some dashboard data could not be loaded."
                );

            } finally {

                setLoading(false);
                setRefreshing(false);
            }
        },
        []
    );


    useEffect(() => {
        loadDashboard();
    }, [loadDashboard]);


    // ========================================================
    // DERIVED DATA
    // ========================================================

    const firstName =
        user?.firstName ||
        user?.name?.split(" ")?.[0] ||
        user?.fullName?.split(" ")?.[0] ||
        "there";


    // --------------------------------------------------------
    // PROFILE COMPLETION
    // --------------------------------------------------------

    const profileCompletion =
        useMemo(() => {

            if (!careerProfile) {
                return 0;
            }

            const checks = [
                Boolean(
                    careerProfile?.headline
                ),

                Boolean(
                    careerProfile?.summary
                ),

                safeArray(
                    careerProfile?.skills
                ).length > 0,

                safeArray(
                    careerProfile?.experiences
                ).length > 0,

                safeArray(
                    careerProfile?.projects
                ).length > 0,

                safeArray(
                    careerProfile?.education
                ).length > 0,

                safeArray(
                    careerProfile?.certifications
                ).length > 0,
            ];

            return Math.round(
                (
                    checks.filter(Boolean)
                        .length /
                    checks.length
                ) * 100
            );

        }, [careerProfile]);


    // --------------------------------------------------------
    // APPLICATION STATS
    // --------------------------------------------------------

    const applicationStats =
        useMemo(() => {

            const total =
                applications.length;

            const saved =
                applications.filter(
                    (item) =>
                        item?.status === "saved"
                ).length;

            const applied =
                applications.filter(
                    (item) =>
                        item?.status === "applied"
                ).length;

            const interviews =
                applications.filter(
                    (item) =>
                        item?.status === "interview"
                ).length;

            const offers =
                applications.filter(
                    (item) =>
                        item?.status === "offer"
                ).length;

            const rejected =
                applications.filter(
                    (item) =>
                        item?.status === "rejected"
                ).length;

            return {
                total,
                saved,
                applied,
                interviews,
                offers,
                rejected,
            };

        }, [applications]);


    // --------------------------------------------------------
    // INTERVIEW STATS
    // --------------------------------------------------------

    const interviewStats =
        useMemo(() => {

            let totalQuestions = 0;
            let evaluatedQuestions = 0;
            let totalScore = 0;
            let scoredQuestions = 0;

            interviewSessions.forEach(
                (session) => {

                    const questions =
                        safeArray(
                            session?.questions
                        );

                    totalQuestions +=
                        questions.length;

                    questions.forEach(
                        (question) => {

                            const evaluation =
                                question?.evaluation ||
                                question?.aiEvaluation ||
                                question?.feedback;

                            if (evaluation) {
                                evaluatedQuestions++;
                            }

                            const score =
                                Number(
                                    question?.score ??
                                    evaluation?.score
                                );

                            if (
                                Number.isFinite(
                                    score
                                )
                            ) {
                                totalScore += score * 10;
                                scoredQuestions++;
                            }
                        }
                    );
                }
            );

            return {
                sessions:
                    interviewSessions.length,

                totalQuestions,

                evaluatedQuestions,

                averageScore:
                    scoredQuestions > 0
                        ? Math.round(
                            totalScore /
                            scoredQuestions
                        )
                        : null,
            };

        }, [interviewSessions]);


    // --------------------------------------------------------
    // PREPARATION STATS
    // --------------------------------------------------------

    const preparationStats =
        useMemo(() => {

            if (
                !preparationPlans.length
            ) {
                return {
                    progress: 0,
                    totalTasks: 0,
                    completedTasks: 0,
                };
            }

            let totalTasks = 0;
            let completedTasks = 0;

            preparationPlans.forEach(
                (plan) => {

                    const tasks =
                        getTaskArray(plan);

                    totalTasks +=
                        tasks.length;

                    completedTasks +=
                        tasks.filter(
                            isTaskCompleted
                        ).length;
                }
            );

            let progress = 0;

            if (totalTasks > 0) {

                progress =
                    Math.round(
                        (
                            completedTasks /
                            totalTasks
                        ) * 100
                    );

            } else {

                progress =
                    Math.round(
                        preparationPlans.reduce(
                            (
                                sum,
                                plan
                            ) =>
                                sum +
                                getPreparationProgress(
                                    plan
                                ),
                            0
                        ) /
                        preparationPlans.length
                    );
            }

            return {
                progress,
                totalTasks,
                completedTasks,
            };

        }, [preparationPlans]);


    // --------------------------------------------------------
    // ACTIVE WORKSPACES
    // --------------------------------------------------------

    const activeWorkspaces =
        useMemo(() => {

            return workspaces
                .filter((workspace) => {

                    const status =
                        String(
                            workspace?.status ||
                            ""
                        ).toLowerCase();

                    return (
                        !status ||
                        ![
                            "closed",
                            "archived",
                            "rejected",
                            "completed",
                        ].includes(status)
                    );
                })
                .sort(
                    (a, b) =>
                        new Date(
                            b?.updatedAt ||
                            b?.createdAt ||
                            0
                        ) -
                        new Date(
                            a?.updatedAt ||
                            a?.createdAt ||
                            0
                        )
                )
                .slice(0, 5);

        }, [workspaces]);


    // --------------------------------------------------------
    // PREPARATION PREVIEW
    // --------------------------------------------------------

    const preparationPreview =
        useMemo(() => {

            return preparationPlans
                .slice()
                .sort(
                    (a, b) =>
                        new Date(
                            b?.updatedAt ||
                            b?.createdAt ||
                            0
                        ) -
                        new Date(
                            a?.updatedAt ||
                            a?.createdAt ||
                            0
                        )
                )
                .slice(0, 3);

        }, [preparationPlans]);


    // --------------------------------------------------------
    // UPCOMING INTERVIEW
    // --------------------------------------------------------

    const upcomingInterview =
        useMemo(() => {

            const candidates =
                interviewSessions
                    .filter((session) => {

                        const date =
                            session?.scheduledAt ||
                            session?.scheduledFor ||
                            session?.interviewDate ||
                            session?.date;

                        if (!date) {
                            return false;
                        }

                        const timestamp =
                            new Date(date).getTime();

                        return (
                            Number.isFinite(
                                timestamp
                            ) &&
                            timestamp > Date.now()
                        );
                    })
                    .sort(
                        (a, b) =>
                            new Date(
                                a?.scheduledAt ||
                                a?.scheduledFor ||
                                a?.interviewDate ||
                                a?.date
                            ) -
                            new Date(
                                b?.scheduledAt ||
                                b?.scheduledFor ||
                                b?.interviewDate ||
                                b?.date
                            )
                    );

            return candidates[0] || null;

        }, [interviewSessions]);


    // --------------------------------------------------------
    // RECENT ACTIVITY
    // --------------------------------------------------------

    const recentActivity =
        useMemo(() => {

            const activity = [];

            workspaces.forEach(
                (item) => {

                    const date =
                        item?.updatedAt ||
                        item?.createdAt;

                    if (!date) return;

                    activity.push({
                        type: "workspace",
                        title:
                            getWorkspaceRole(
                                item
                            ),
                        description:
                            `${getWorkspaceCompany(item)} workspace`,
                        date,
                        icon:
                            BriefcaseBusiness,
                    });
                }
            );


            resumes.forEach(
                (item) => {

                    const date =
                        item?.updatedAt ||
                        item?.createdAt;

                    if (!date) return;

                    activity.push({
                        type: "resume",
                        title:
                            item?.name ||
                            item?.title ||
                            "Resume updated",
                        description:
                            item?.isPrimary ||
                                item?.primary
                                ? "Primary resume"
                                : "Resume",
                        date,
                        icon: FileText,
                    });
                }
            );


            applications.forEach(
                (item) => {

                    const date =
                        item?.updatedAt ||
                        item?.createdAt;

                    if (!date) return;

                    activity.push({
                        type: "application",
                        title:
                            "Application updated",
                        description:
                            item?.status ||
                            "Application",
                        date,
                        icon:
                            FolderKanban,
                    });
                }
            );


            interviewSessions.forEach(
                (item) => {

                    const date =
                        item?.updatedAt ||
                        item?.createdAt;

                    if (!date) return;

                    activity.push({
                        type: "interview",
                        title:
                            item?.title ||
                            "Interview practice",
                        description:
                            item?.status ||
                            "Interview session",
                        date,
                        icon:
                            MessageSquare,
                    });
                }
            );


            return activity
                .sort(
                    (a, b) =>
                        new Date(
                            b.date || 0
                        ) -
                        new Date(
                            a.date || 0
                        )
                )
                .slice(0, 6);

        }, [
            workspaces,
            resumes,
            applications,
            interviewSessions,
        ]);


    // --------------------------------------------------------
    // NEXT ACTION
    // --------------------------------------------------------

    const nextAction =
        useMemo(() => {

            if (!careerProfile) {

                return {
                    title:
                        "Build your career profile",
                    description:
                        "Add your skills, experience, education and projects so Skillio can understand your career direction.",
                    to:
                        "/career-profile",
                    icon:
                        UserRound,
                    label:
                        "Start with your profile",
                };
            }


            if (
                profileCompletion < 70
            ) {

                return {
                    title:
                        "Complete your career profile",
                    description:
                        `Your profile is ${profileCompletion}% complete. Add the missing information to unlock better recommendations.`,
                    to:
                        "/career-profile",
                    icon:
                        UserRound,
                    label:
                        "Continue profile",
                };
            }


            if (!resumes.length) {

                return {
                    title:
                        "Create your first resume",
                    description:
                        "Turn your career profile into a polished resume that can be tailored to individual opportunities.",
                    to:
                        "/resumes",
                    icon:
                        FileText,
                    label:
                        "Create resume",
                };
            }


            if (!workspaces.length) {

                return {
                    title:
                        "Add your first opportunity",
                    description:
                        "Create a job workspace to connect the role, resume, preparation and interview practice.",
                    to:
                        "/job-workspaces",
                    icon:
                        BriefcaseBusiness,
                    label:
                        "Add opportunity",
                };
            }


            if (
                preparationPlans.length &&
                preparationStats.progress < 100
            ) {

                return {
                    title:
                        "Continue your preparation",
                    description:
                        `${preparationStats.completedTasks} of ${preparationStats.totalTasks || "your"} preparation tasks are complete.`,
                    to:
                        "/preparation",
                    icon:
                        Target,
                    label:
                        "Continue preparing",
                };
            }


            if (
                interviewSessions.length === 0
            ) {

                return {
                    title:
                        "Practice your first interview",
                    description:
                        "Simulate a real interview using an AI-generated session based on your target role.",
                    to:
                        "/interviews",
                    icon:
                        Video,
                    label:
                        "Start interview",
                };
            }


            return {
                title:
                    "Talk to your AI career coach",
                description:
                    "Get a personalized recommendation about what you should focus on next.",
                to:
                    "/career-coach",
                icon:
                    Sparkles,
                label:
                    "Open career coach",
            };

        }, [
            careerProfile,
            profileCompletion,
            resumes,
            workspaces,
            preparationPlans,
            preparationStats,
            interviewSessions,
        ]);


    // --------------------------------------------------------
    // READINESS
    // --------------------------------------------------------

    const resumeScore =
        resumes.length
            ? 100
            : 0;

    const readinessScore =
        Math.round(
            (
                profileCompletion +
                resumeScore +
                preparationStats.progress
            ) / 3
        );


    // --------------------------------------------------------
    // GREETING
    // --------------------------------------------------------

    const hour =
        new Date().getHours();

    const greeting =
        hour < 12
            ? "Good morning"
            : hour < 17
                ? "Good afternoon"
                : "Good evening";


    // ========================================================
    // LOADING
    // ========================================================

    if (loading) {

        return (
            <div
                className="
                    min-h-[calc(100vh-68px)]
                    bg-[var(--background)]
                    px-4
                    py-6
                    sm:px-6
                    lg:px-8
                    lg:py-8
                "
            >
                <div
                    className="
                        mx-auto
                        max-w-[1500px]
                        animate-pulse
                    "
                >

                    <div
                        className="
                            h-8
                            w-72
                            rounded-xl
                            bg-[var(--surface-container)]
                        "
                    />

                    <div
                        className="
                            mt-3
                            h-4
                            w-96
                            max-w-full
                            rounded-lg
                            bg-[var(--surface-container)]
                        "
                    />

                    <div
                        className="
                            mt-8
                            grid
                            gap-4
                            sm:grid-cols-2
                            xl:grid-cols-4
                        "
                    >
                        {Array.from({
                            length: 4,
                        }).map((_, index) => (
                            <div
                                key={index}
                                className="
                                    h-36
                                    rounded-[1.35rem]
                                    bg-[var(--surface-container)]
                                "
                            />
                        ))}
                    </div>

                    <div
                        className="
                            mt-6
                            grid
                            gap-6
                            xl:grid-cols-[1.35fr_0.65fr]
                        "
                    >
                        <div
                            className="
                                h-80
                                rounded-[1.5rem]
                                bg-[var(--surface-container)]
                            "
                        />

                        <div
                            className="
                                h-80
                                rounded-[1.5rem]
                                bg-[var(--surface-container)]
                            "
                        />
                    </div>
                </div>
            </div>
        );
    }


    // ========================================================
    // RENDER
    // ========================================================

    return (
        <div
            className="
                min-h-[calc(100vh-68px)]
                bg-[var(--background)]
                px-4
                py-6
                sm:px-6
                lg:px-8
                lg:py-8
            "
        >

            <div
                className="
                    mx-auto
                    max-w-[1500px]
                "
            >

                {/* ==================================================
    DASHBOARD HERO / HEADER
================================================== */}

                <header
                    className="
        relative
        mb-8
        overflow-hidden
        rounded-[2rem]
        border
        border-[var(--outline-variant)]
        bg-[var(--surface)]
        px-5
        py-6
        shadow-[var(--shadow-sm)]
        sm:px-7
        sm:py-7
        lg:px-8
        lg:py-8
    "
                >
                    {/* ==================================================
        DECORATIVE BACKGROUND
    ================================================== */}

                    <div
                        className="
            pointer-events-none
            absolute
            -right-24
            -top-28
            h-72
            w-72
            rounded-full
            bg-[var(--primary-container)]
            opacity-35
            blur-3xl
        "
                    />

                    <div
                        className="
            pointer-events-none
            absolute
            -bottom-32
            left-1/3
            h-56
            w-56
            rounded-full
            bg-[var(--secondary-container)]
            opacity-20
            blur-3xl
        "
                    />

                    {/* ==================================================
        CONTENT
    ================================================== */}

                    <div
                        className="
            relative
            flex
            flex-col
            gap-7
            lg:flex-row
            lg:items-end
            lg:justify-between
            lg:gap-10
        "
                    >

                        {/* ==================================================
            LEFT — INTRO
        ================================================== */}

                        <div className="min-w-0 max-w-3xl">

                            {/* Eyebrow */}

                            <div
                                className="
                    inline-flex
                    max-w-full
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container)]
                    px-3
                    py-1.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.14em]
                    text-[var(--primary)]
                "
                            >
                                <span
                                    className="
                        flex
                        h-5
                        w-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[var(--primary-container)]
                        text-[var(--on-primary-container)]
                    "
                                >
                                    <Sparkles size={11} />
                                </span>

                                <span className="truncate">
                                    Career command center
                                </span>
                            </div>


                            {/* Heading */}

                            <h1
                                className="
                    mt-4
                    text-[2rem]
                    font-bold
                    leading-[1.08]
                    tracking-[-0.035em]
                    text-[var(--on-surface)]
                    sm:text-[2.5rem]
                    lg:text-[2.9rem]
                "
                                style={{
                                    fontFamily:
                                        "var(--font-heading)",
                                }}
                            >
                                {greeting},{" "}
                                <span className="text-[var(--primary)]">
                                    {firstName}
                                </span>{" "}
                                <span
                                    className="
                        inline-block
                        origin-bottom
                    "
                                >
                                    👋
                                </span>
                            </h1>


                            {/* Description */}

                            <p
                                className="
                    mt-3
                    max-w-2xl
                    text-sm
                    leading-6
                    text-[var(--on-surface-variant)]
                    sm:text-base
                "
                            >
                                Here's where your career journey stands
                                today. Review your progress, focus on what
                                matters, and keep moving forward.
                            </p>


                            {/* Small status row */}

                            <div
                                className="
                    mt-5
                    flex
                    flex-wrap
                    items-center
                    gap-x-4
                    gap-y-2
                    text-[11px]
                    font-medium
                    text-[var(--on-surface-variant)]
                "
                            >

                                <div
                                    className="
                        inline-flex
                        items-center
                        gap-2
                    "
                                >
                                    <span
                                        className="
                            h-1.5
                            w-1.5
                            rounded-full
                            bg-[var(--primary)]
                        "
                                    />

                                    Your career workspace
                                </div>

                                <span
                                    className="
                        hidden
                        h-3
                        w-px
                        bg-[var(--outline-variant)]
                        sm:block
                    "
                                />

                                <span>
                                    Stay consistent. Small steps add up.
                                </span>

                            </div>

                        </div>


                        {/* ==================================================
            RIGHT — ACTIONS
        ================================================== */}

                        <div
                            className="
                flex
                w-full
                flex-col
                gap-2.5
                sm:flex-row
                lg:w-auto
                lg:shrink-0
            "
                        >

                            {/* Refresh */}

                            <button
                                type="button"
                                onClick={() =>
                                    loadDashboard(true)
                                }
                                disabled={refreshing}
                                className="
                    group
                    inline-flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface)]
                    px-4
                    text-sm
                    font-semibold
                    text-[var(--on-surface)]
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-[var(--primary)]
                    hover:bg-[var(--surface-container)]
                    hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0
                    sm:w-auto
                "
                            >
                                <RefreshCw
                                    size={16}
                                    className={`
                        transition-transform
                        duration-300
                        ${refreshing
                                            ? "animate-spin"
                                            : "group-hover:rotate-90"
                                        }
                    `}
                                />

                                <span>
                                    {refreshing
                                        ? "Refreshing..."
                                        : "Refresh"}
                                </span>
                            </button>


                            {/* Add opportunity */}

                            <Link
                                to="/job-workspaces"
                                className="
                    group
                    inline-flex
                    h-11
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[var(--primary)]
                    px-5
                    text-sm
                    font-bold
                    text-[var(--on-primary)]
                    shadow-[0_8px_20px_rgba(0,0,0,0.08)]
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:shadow-[0_12px_25px_rgba(0,0,0,0.12)]
                    sm:w-auto
                "
                            >
                                <span
                                    className="
                        flex
                        h-5
                        w-5
                        items-center
                        justify-center
                        rounded-md
                        bg-white/10
                    text-[var(--on-primary)]

                    "
                                >
                                    <Plus
                                        size={15}
                                        className="
                            transition-transform
                            duration-200
                            group-hover:rotate-90
                        "
                                    />
                                </span>
                                <span className="text-[var(--on-primary)]">
                                    Add opportunity
                                </span>
                            </Link>

                        </div>

                    </div>


                    {/* ==================================================
        BOTTOM ACCENT
    ================================================== */}

                    <div
                        className="
            relative
            mt-6
            h-px
            w-full
            bg-[var(--outline-variant)]
            opacity-70
        "
                    />

                </header>


                {/* ==================================================
                    ERROR
                ================================================== */}

                <ErrorToast error={error} />


                {/* =========================================================
    CAREER READINESS + AI COACH
========================================================= */}

                <section
                    className="
        grid
        gap-5
        xl:grid-cols-[1.55fr_0.75fr]
    "
                >

                    {/* =====================================================
        CAREER READINESS
    ===================================================== */}

                    <div
                        className="
            group
            relative
            overflow-hidden
            rounded-[1.75rem]
            border
            border-[var(--outline-variant)]
            bg-[var(--surface-container-lowest)]
            p-5
            shadow-[var(--shadow-sm)]
            transition-all
            duration-300
            hover:-translate-y-0.5
            hover:shadow-[var(--shadow-md)]
            sm:p-7
        "
                    >

                        {/* Decorative background */}

                        <div
                            className="
                pointer-events-none
                absolute
                -right-24
                -top-28
                h-72
                w-72
                rounded-full
                bg-[var(--primary-fixed)]
                opacity-40
                blur-3xl
            "
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
                bg-[var(--secondary-container)]
                opacity-20
                blur-3xl
            "
                        />


                        <div className="relative">

                            {/* =================================================
                TOP HEADER
            ================================================= */}

                            <div
                                className="
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
                            >

                                <div className="max-w-2xl">

                                    {/* Eyebrow */}

                                    <div
                                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            bg-[var(--primary-fixed)]
                            px-3
                            py-1.5
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.14em]
                            text-[var(--on-primary-fixed-variant)]
                        "
                                    >
                                        <Award size={14} />

                                        Career readiness
                                    </div>


                                    {/* Heading */}

                                    <h2
                                        className="
                            mt-4
                            text-2xl
                            font-bold
                            leading-tight
                            tracking-[-0.025em]
                            text-[var(--on-surface)]
                            sm:text-3xl
                        "
                                        style={{
                                            fontFamily:
                                                "var(--font-heading)",
                                        }}
                                    >
                                        Build a stronger
                                        <span className="block">
                                            career foundation.
                                        </span>
                                    </h2>


                                    {/* Description */}

                                    <p
                                        className="
                            mt-3
                            max-w-xl
                            text-sm
                            leading-6
                            text-[var(--on-surface-variant)]
                        "
                                    >
                                        Skillio brings your profile, resume,
                                        applications and preparation together
                                        so you always know what deserves your
                                        attention next.
                                    </p>

                                </div>


                                {/* =================================================
                    SCORE
                ================================================= */}

                                <div
                                    className="
                        flex
                        shrink-0
                        items-center
                        gap-4
                        sm:flex-col
                        sm:gap-2
                    "
                                >

                                    {/* Circular score */}

                                    <div
                                        className="
                            relative
                            flex
                            h-[108px]
                            w-[108px]
                            items-center
                            justify-center
                            rounded-full
                        "
                                        style={{
                                            background:
                                                `conic-gradient(
                                    var(--primary)
                                    ${Math.min(
                                                    Math.max(
                                                        readinessScore || 0,
                                                        0
                                                    ),
                                                    100
                                                ) * 3.6}deg,
                                    var(--surface-container-high)
                                    0deg
                                )`,
                                        }}
                                    >

                                        {/* Inner circle */}

                                        <div
                                            className="
                                flex
                                h-[84px]
                                w-[84px]
                                flex-col
                                items-center
                                justify-center
                                rounded-full
                                bg-[var(--surface-container-lowest)]
                            "
                                        >

                                            <span
                                                className="
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-[var(--on-surface)]
                                "
                                                style={{
                                                    fontFamily:
                                                        "var(--font-heading)",
                                                }}
                                            >
                                                {readinessScore || 0}%
                                            </span>

                                            <span
                                                className="
                                    text-[10px]
                                    font-medium
                                    text-[var(--on-surface-variant)]
                                "
                                            >
                                                ready
                                            </span>

                                        </div>

                                    </div>


                                    {/* Score explanation */}

                                    <div className="sm:text-center">

                                        <div
                                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-[var(--primary-fixed)]
                                px-2.5
                                py-1
                                text-[10px]
                                font-semibold
                                text-[var(--on-primary-fixed-variant)]
                            "
                                        >
                                            <TrendingUp size={12} />

                                            On track
                                        </div>

                                        <p
                                            className="
                                mt-1.5
                                text-[11px]
                                text-[var(--on-surface-variant)]
                            "
                                        >
                                            Overall career health
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                SCORE SUMMARY
            ================================================= */}

                            <div
                                className="
                    mt-6
                    grid
                    grid-cols-3
                    divide-x
                    divide-[var(--outline-variant)]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-low)]
                "
                            >

                                <div className="px-3 py-3.5 sm:px-4">

                                    <p
                                        className="
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-wide
                            text-[var(--on-surface-variant)]
                        "
                                    >
                                        Profile
                                    </p>

                                    <p
                                        className="
                            mt-1
                            text-lg
                            font-bold
                            text-[var(--on-surface)]
                        "
                                    >
                                        {profileCompletion || 0}%
                                    </p>

                                </div>


                                <div className="px-3 py-3.5 sm:px-4">

                                    <p
                                        className="
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-wide
                            text-[var(--on-surface-variant)]
                        "
                                    >
                                        Resume
                                    </p>

                                    <p
                                        className="
                            mt-1
                            text-lg
                            font-bold
                            text-[var(--on-surface)]
                        "
                                    >
                                        {resumeScore || 0}%
                                    </p>

                                </div>


                                <div className="px-3 py-3.5 sm:px-4">

                                    <p
                                        className="
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-wide
                            text-[var(--on-surface-variant)]
                        "
                                    >
                                        Preparation
                                    </p>

                                    <p
                                        className="
                            mt-1
                            text-lg
                            font-bold
                            text-[var(--on-surface)]
                        "
                                    >
                                        {preparationStats?.progress || 0}%
                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                COMPONENT PROGRESS
            ================================================= */}

                            <div className="mt-6">

                                <div
                                    className="
                        mb-3
                        flex
                        items-center
                        justify-between
                    "
                                >

                                    <div>

                                        <h3
                                            className="
                                text-sm
                                font-bold
                                text-[var(--on-surface)]
                            "
                                        >
                                            Your career foundation
                                        </h3>

                                        <p
                                            className="
                                mt-0.5
                                text-xs
                                text-[var(--on-surface-variant)]
                            "
                                        >
                                            Strengthen each area to improve your
                                            overall readiness.
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className="
                        grid
                        gap-3
                        sm:grid-cols-3
                    "
                                >

                                    {[
                                        {
                                            label: "Career profile",
                                            description:
                                                "Skills, education & goals",
                                            value:
                                                profileCompletion || 0,
                                            to: "/career-profile",
                                            icon: Target,
                                        },
                                        {
                                            label: "Resume setup",
                                            description:
                                                "ATS-ready & job aligned",
                                            value:
                                                resumeScore || 0,
                                            to: "/resumes",
                                            icon: BriefcaseBusiness,
                                        },
                                        {
                                            label: "Preparation",
                                            description:
                                                "Topics, drills & interviews",
                                            value:
                                                preparationStats?.progress || 0,
                                            to: "/preparation",
                                            icon: Clock,
                                        },
                                    ].map((item) => {

                                        const Icon = item.icon;

                                        return (
                                            <Link
                                                key={item.label}
                                                to={item.to}
                                                className="
                                    group/item
                                    rounded-2xl
                                    border
                                    border-transparent
                                    bg-[var(--surface-container)]
                                    p-4
                                    transition-all
                                    duration-200
                                    hover:border-[var(--outline-variant)]
                                    hover:bg-[var(--surface-container-high)]
                                "
                                            >

                                                {/* Card header */}

                                                <div
                                                    className="
                                        flex
                                        items-start
                                        justify-between
                                    "
                                                >

                                                    <div
                                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-[var(--surface-container-lowest)]
                                            text-[var(--primary)]
                                        "
                                                    >
                                                        <Icon size={16} />
                                                    </div>


                                                    <span
                                                        className="
                                            text-xs
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                                    >
                                                        {item.value}%
                                                    </span>

                                                </div>


                                                {/* Text */}

                                                <div className="mt-3">

                                                    <p
                                                        className="
                                            text-xs
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                                    >
                                                        {item.label}
                                                    </p>

                                                    <p
                                                        className="
                                            mt-0.5
                                            text-[10px]
                                            leading-4
                                            text-[var(--on-surface-variant)]
                                        "
                                                    >
                                                        {item.description}
                                                    </p>

                                                </div>


                                                {/* Progress */}

                                                <div className="mt-3">

                                                    <ProgressBar
                                                        value={item.value}
                                                    />

                                                </div>


                                                {/* CTA */}

                                                <div
                                                    className="
                                        mt-3
                                        flex
                                        items-center
                                        justify-between
                                        text-[10px]
                                        font-semibold
                                        text-[var(--on-surface-variant)]
                                    "
                                                >

                                                    <span>
                                                        {item.value >= 80
                                                            ? "Looking strong"
                                                            : item.value >= 50
                                                                ? "Needs attention"
                                                                : "Start building"}
                                                    </span>

                                                    <ArrowRight
                                                        size={13}
                                                        className="
                                            transition-transform
                                            duration-200
                                            group-hover/item:translate-x-1
                                        "
                                                    />

                                                </div>

                                            </Link>
                                        );
                                    })}

                                </div>

                            </div>


                            {/* =================================================
                BOTTOM ACTION
            ================================================= */}

                            <div
                                className="
                    mt-5
                    flex
                    flex-col
                    gap-3
                    rounded-2xl
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-low)]
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
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            bg-[var(--primary)]
                            text-[var(--on-primary)]
                        "
                                    >
                                        <Target size={16} />
                                    </div>

                                    <div>

                                        <p
                                            className="
                                text-xs
                                font-bold
                                text-[var(--on-surface)]
                            "
                                        >
                                            Improve your readiness
                                        </p>

                                        <p
                                            className="
                                mt-0.5
                                text-[10px]
                                leading-4
                                text-[var(--on-surface-variant)]
                            "
                                        >
                                            Complete your weakest area first
                                            for the biggest improvement.
                                        </p>

                                    </div>

                                </div>


                                <Link
                                    to="/career-profile"
                                    className="
                        inline-flex
                        h-9
                        shrink-0
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[var(--surface-container-lowest)]
                        px-4
                        text-xs
                        font-bold
                        text-[var(--on-surface)]
                        shadow-[var(--shadow-sm)]
                        transition
                        hover:bg-[var(--surface-container-highest)]
                    "
                                >
                                    View recommendations

                                    <ArrowRight size={14} />
                                </Link>

                            </div>

                        </div>

                    </div>


                    {/* =====================================================
        AI CAREER COACH
    ===================================================== */}

                    <Link
                        to="/career-coach"
                        className="
            group
            relative
            min-h-[420px]
            overflow-hidden
            rounded-[1.75rem]
            bg-[var(--primary)]
            p-6
            text-[var(--on-primary)]
            shadow-[var(--shadow-md)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[var(--shadow-lg)]
            sm:p-7
        "
                    >

                        {/* Decorative circles */}

                        <div
                            className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-72
                w-72
                rounded-full
                border
                border-white/10
            "
                        />

                        <div
                            className="
                pointer-events-none
                absolute
                -bottom-32
                -left-16
                h-64
                w-64
                rounded-full
                border
                border-white/10
            "
                        />

                        <div
                            className="
                pointer-events-none
                absolute
                right-12
                bottom-16
                h-24
                w-24
                rounded-full
                bg-white/[0.04]
                blur-2xl
            "
                        />


                        <div
                            className="
                relative
                flex
                h-full
                flex-col
                justify-between
            "
                        >

                            {/* =================================================
                COACH HEADER
            ================================================= */}

                            <div>

                                <div
                                    className="
                        flex
                        items-center
                        justify-between
                    "
                                >

                                    <div
                                        className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-2xl
                            bg-white/10
                            ring-1
                            ring-white/10
                        "
                                    >
                                        <Sparkles size={20} />
                                    </div>


                                    <div
                                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-full
                            bg-white/10
                            transition
                            group-hover:bg-white/15
                        "
                                    >
                                        <ArrowUpRight
                                            size={17}
                                            className="
                                transition
                                duration-200
                                group-hover:-translate-y-0.5
                                group-hover:translate-x-0.5
                            "
                                        />
                                    </div>

                                </div>


                                <p
                                    className="
                        mt-7
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-white/55
                    "
                                >
                                    AI Career Coach
                                </p>


                                <h2
                                    className="
                        mt-2
                        max-w-sm
                        text-2xl
                        font-bold
                        leading-tight
                        tracking-[-0.02em]
                        text-white
                    "
                                    style={{
                                        fontFamily:
                                            "var(--font-heading)",
                                    }}
                                >
                                    {conversations?.length
                                        ? "Your coach has something to say."
                                        : "Not sure what to work on next?"}
                                </h2>


                                <p
                                    className="
                        mt-3
                        max-w-sm
                        text-sm
                        leading-6
                        text-white/70
                    "
                                >
                                    {conversations?.length
                                        ? "Continue your career conversation and turn your latest insight into a concrete action."
                                        : "Get contextual guidance based on your profile, applications and preparation."}
                                </p>


                                {/* =================================================
                    AI INSIGHT
                ================================================= */}

                                <div
                                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-white/10
                        bg-white/[0.07]
                        p-4
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
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-[var(--primary-fixed)]
                            "
                                        />

                                        <span
                                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.12em]
                                text-white/55
                            "
                                        >
                                            Suggested next step
                                        </span>

                                    </div>


                                    <p
                                        className="
                            mt-2
                            text-sm
                            font-medium
                            leading-5
                            text-white
                        "
                                    >
                                        {conversations?.length
                                            ? "Review your latest coaching insight and choose one action to complete today."
                                            : readinessScore < 50
                                                ? "Complete your career profile first. It will help Skillio personalize your recommendations."
                                                : readinessScore < 80
                                                    ? "Strengthen your resume and preparation so your profile is ready for more opportunities."
                                                    : "Your foundation is looking strong. Start targeting opportunities and prepare for interviews."}
                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                COACH FOOTER
            ================================================= */}

                            <div className="mt-8">

                                <div
                                    className="
                        flex
                        items-center
                        justify-between
                        rounded-2xl
                        bg-white/10
                        px-4
                        py-3.5
                        transition
                        group-hover:bg-white/[0.14]
                    "
                                >

                                    <div>

                                        <span
                                            className="
                                block
                                text-sm
                                font-bold
                            "
                                        >
                                            Open your coach
                                        </span>

                                        <span
                                            className="
                                mt-0.5
                                block
                                text-[10px]
                                text-white/55
                            "
                                        >
                                            Get your personalized next step
                                        </span>

                                    </div>


                                    <div
                                        className="
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-xl
                            bg-white
                            text-[var(--primary)]
                        "
                                    >
                                        <ArrowRight size={16} />
                                    </div>

                                </div>

                            </div>

                        </div>

                    </Link>

                </section>


                {/* =========================================================
    CAREER OVERVIEW
========================================================= */}

                <section className="mt-6">

                    {/* Section heading */}
                    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">

                        <div>
                            <div className="flex items-center gap-2">
                                <span
                                    className="
                        h-2
                        w-2
                        rounded-full
                        bg-[var(--primary)]
                    "
                                />

                                <h2
                                    className="
                        text-lg
                        font-bold
                        tracking-tight
                        text-[var(--on-surface)]
                        sm:text-xl
                    "
                                >
                                    Your career overview
                                </h2>
                            </div>

                            <p
                                className="
                    mt-1
                    text-xs
                    leading-5
                    text-[var(--on-surface-variant)]
                    sm:text-sm
                "
                            >
                                A quick look at your applications, practice,
                                opportunities and preparation.
                            </p>
                        </div>

                        <Link
                            to="/applications"
                            className="
                hidden
                items-center
                gap-1.5
                text-xs
                font-semibold
                text-[var(--primary)]
                transition
                hover:opacity-70
                sm:flex
            "
                        >
                            View career activity
                            <ArrowRight size={14} />
                        </Link>

                    </div>


                    {/* =====================================================
        STAT CARDS
    ===================================================== */}

                    <div
                        className="
            grid
            gap-4
            sm:grid-cols-2
            xl:grid-cols-4
        "
                    >

                        {/* -------------------------------------------------
            APPLICATIONS
        ------------------------------------------------- */}

                        <DashboardStatCard
                            icon={BriefcaseBusiness}
                            iconStyle="sage"
                            label="Applications"
                            value={applicationStats.total}
                            description={
                                applicationStats.total > 0
                                    ? `${applicationStats.interviews} reached interview stage`
                                    : "Your job pipeline starts here"
                            }
                            secondary={
                                applicationStats.offers > 0
                                    ? `${applicationStats.offers} offer${applicationStats.offers > 1 ? "s" : ""}`
                                    : applicationStats.total > 0
                                        ? `${applicationStats.total} tracked`
                                        : "Add your first application"
                            }
                            progress={
                                applicationStats.total > 0
                                    ? Math.min(
                                        100,
                                        Math.round(
                                            (applicationStats.interviews /
                                                applicationStats.total) *
                                            100
                                        )
                                    )
                                    : 0
                            }
                            progressLabel={
                                applicationStats.total > 0
                                    ? "Interview conversion"
                                    : null
                            }
                            to="/applications"
                        />


                        {/* -------------------------------------------------
            INTERVIEW PRACTICE
        ------------------------------------------------- */}

                        <DashboardStatCard
                            icon={Video}
                            iconStyle="blush"
                            label="Interview practice"
                            value={interviewStats.sessions}
                            description={
                                interviewStats.sessions > 0
                                    ? interviewStats.averageScore !== null
                                        ? `Average score ${interviewStats.averageScore}`
                                        : "Keep practicing to improve"
                                    : "Build confidence before interviews"
                            }
                            secondary={
                                interviewStats.evaluatedQuestions > 0
                                    ? `${interviewStats.evaluatedQuestions} questions evaluated`
                                    : "Start your first mock interview"
                            }
                            progress={
                                interviewStats.averageScore !== null
                                    ? Math.min(
                                        100,
                                        Number(interviewStats.averageScore)
                                    )
                                    : 0
                            }
                            progressLabel={
                                interviewStats.averageScore !== null
                                    ? "Average performance"
                                    : null
                            }
                            to="/interviews"
                        />


                        {/* -------------------------------------------------
            JOB WORKSPACES
        ------------------------------------------------- */}

                        <DashboardStatCard
                            icon={BriefcaseBusiness}
                            iconStyle="neutral"
                            label="Job workspaces"
                            value={workspaces.length}
                            description={
                                workspaces.length > 0
                                    ? `${activeWorkspaces.length} active opportunities`
                                    : "Organize each opportunity in one place"
                            }
                            secondary={
                                workspaces.length > 0
                                    ? `${activeWorkspaces.length} currently active`
                                    : "Create your first workspace"
                            }
                            progress={
                                workspaces.length > 0
                                    ? Math.round(
                                        (activeWorkspaces.length /
                                            workspaces.length) *
                                        100
                                    )
                                    : 0
                            }
                            progressLabel={
                                workspaces.length > 0
                                    ? "Active pipeline"
                                    : null
                            }
                            to="/job-workspaces"
                        />


                        {/* -------------------------------------------------
            PREPARATION
        ------------------------------------------------- */}

                        <DashboardStatCard
                            icon={Target}
                            iconStyle="sage"
                            label="Preparation"
                            value={`${preparationStats.progress}%`}
                            description={
                                preparationStats.totalTasks > 0
                                    ? `${preparationStats.completedTasks}/${preparationStats.totalTasks} tasks complete`
                                    : "Create a focused preparation plan"
                            }
                            secondary={
                                preparationStats.progress >= 80
                                    ? "You're on track"
                                    : preparationStats.progress > 0
                                        ? "Keep building momentum"
                                        : "Start preparing today"
                            }
                            progress={preparationStats.progress}
                            progressLabel="Preparation progress"
                            to="/preparation"
                        />

                    </div>

                </section>


                {/* ==================================================
    APPLICATION PIPELINE + AI NEXT ACTION
================================================== */}

                <section
                    className="
        mt-8
        grid
        gap-6
        xl:grid-cols-[1.35fr_0.65fr]
    "
                >

                    {/* ==================================================
        APPLICATION PIPELINE
    ================================================== */}

                    <div
                        className="
            relative
            overflow-hidden
            rounded-[1.5rem]
            border
            border-[var(--outline-variant)]
            bg-[var(--surface-container-lowest)]
            p-6
            shadow-[var(--shadow-sm)]
            sm:p-7
        "
                    >

                        {/* Decorative background */}

                        <div
                            className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-56
                w-56
                rounded-full
                bg-[var(--primary-fixed)]
                opacity-30
                blur-3xl
            "
                        />

                        <div
                            className="
                relative
                z-10
            "
                        >

                            {/* HEADER */}

                            <div
                                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
                            >

                                <div>

                                    <div
                                        className="
                            flex
                            items-center
                            gap-2
                            text-[var(--primary)]
                        "
                                    >
                                        <BriefcaseBusiness size={17} />

                                        <span
                                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                            "
                                        >
                                            Application pipeline
                                        </span>
                                    </div>

                                    <h2
                                        className="
                            mt-2
                            text-xl
                            font-bold
                            tracking-tight
                            text-[var(--on-surface)]
                            sm:text-2xl
                        "
                                    >
                                        Your job search at a glance
                                    </h2>

                                    <p
                                        className="
                            mt-1.5
                            max-w-xl
                            text-sm
                            leading-6
                            text-[var(--on-surface-variant)]
                        "
                                    >
                                        Track how opportunities are moving through
                                        your career pipeline.
                                    </p>

                                </div>

                                <Link
                                    to="/applications"
                                    className="
                        inline-flex
                        shrink-0
                        items-center
                        gap-1.5
                        text-xs
                        font-bold
                        text-[var(--primary)]
                        transition
                        hover:gap-2.5
                    "
                                >
                                    View applications
                                    <ArrowRight size={14} />
                                </Link>

                            </div>


                            {/* ==================================================
                PIPELINE FUNNEL
            ================================================== */}

                            <div className="mt-7">

                                <div
                                    className="
                        grid
                        grid-cols-2
                        gap-3
                        sm:grid-cols-5
                    "
                                >

                                    {[
                                        {
                                            label: "Saved",
                                            value: applicationStats.saved,
                                            icon: FolderKanban,
                                            description: "Opportunities saved",
                                        },
                                        {
                                            label: "Applied",
                                            value: applicationStats.applied,
                                            icon: SendIcon,
                                            description: "Applications sent",
                                        },
                                        {
                                            label: "Interview",
                                            value: applicationStats.interviews,
                                            icon: Video,
                                            description: "Reached interview",
                                        },
                                        {
                                            label: "Offers",
                                            value: applicationStats.offers,
                                            icon: Award,
                                            description: "Offers received",
                                        },
                                        {
                                            label: "Rejected",
                                            value: applicationStats.rejected,
                                            icon: CircleAlert,
                                            description: "Closed opportunities",
                                        },
                                    ].map((item) => {

                                        const Icon = item.icon;

                                        return (
                                            <div
                                                key={item.label}
                                                className="
                                    group
                                    rounded-2xl
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-low)]
                                    p-4
                                    transition
                                    duration-200
                                    hover:-translate-y-0.5
                                    hover:border-[var(--primary)]
                                    hover:bg-[var(--surface-container)]
                                "
                                            >

                                                <div
                                                    className="
                                        flex
                                        items-center
                                        justify-between
                                    "
                                                >

                                                    <div
                                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-[var(--surface-container-high)]
                                            text-[var(--primary)]
                                        "
                                                    >
                                                        <Icon size={17} />
                                                    </div>

                                                </div>

                                                <p
                                                    className="
                                        mt-4
                                        text-2xl
                                        font-bold
                                        tracking-tight
                                        text-[var(--on-surface)]
                                    "
                                                    style={{
                                                        fontFamily:
                                                            "var(--font-heading)",
                                                    }}
                                                >
                                                    {item.value}
                                                </p>

                                                <p
                                                    className="
                                        mt-1
                                        text-xs
                                        font-bold
                                        text-[var(--on-surface)]
                                    "
                                                >
                                                    {item.label}
                                                </p>

                                                <p
                                                    className="
                                        mt-1
                                        text-[10px]
                                        leading-4
                                        text-[var(--on-surface-variant)]
                                    "
                                                >
                                                    {item.description}
                                                </p>

                                            </div>
                                        );
                                    })}

                                </div>


                                {/* ==================================================
                    PIPELINE SUMMARY
                ================================================== */}

                                <div
                                    className="
                        mt-4
                        rounded-2xl
                        bg-[var(--surface-container)]
                        p-4
                    "
                                >

                                    <div
                                        className="
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                                    >

                                        <div className="min-w-0">

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
                                        bg-[var(--primary)]
                                    "
                                                />

                                                <p
                                                    className="
                                        text-xs
                                        font-bold
                                        text-[var(--on-surface)]
                                    "
                                                >
                                                    Pipeline health
                                                </p>

                                            </div>

                                            <p
                                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-[var(--on-surface-variant)]
                                "
                                            >
                                                {applicationStats.total > 0
                                                    ? `${applicationStats.total} total opportunities across your job search.`
                                                    : "Your pipeline is ready for its first opportunity."
                                                }
                                            </p>

                                        </div>


                                        {/* Interview conversion */}

                                        <div
                                            className="
                                flex
                                shrink-0
                                items-center
                                gap-4
                            "
                                        >

                                            <div className="text-right">

                                                <p
                                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-[var(--on-surface-variant)]
                                    "
                                                >
                                                    Interview rate
                                                </p>

                                                <p
                                                    className="
                                        mt-0.5
                                        text-lg
                                        font-bold
                                        text-[var(--on-surface)]
                                    "
                                                >
                                                    {applicationStats.total
                                                        ? Math.round(
                                                            (
                                                                applicationStats.interviews /
                                                                applicationStats.total
                                                            ) * 100
                                                        )
                                                        : 0}
                                                    %
                                                </p>

                                            </div>

                                            <div
                                                className="
                                    h-10
                                    w-px
                                    bg-[var(--outline-variant)]
                                "
                                            />

                                            <div className="text-right">

                                                <p
                                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-wide
                                        text-[var(--on-surface-variant)]
                                    "
                                                >
                                                    Offers
                                                </p>

                                                <p
                                                    className="
                                        mt-0.5
                                        text-lg
                                        font-bold
                                        text-[var(--primary)]
                                    "
                                                >
                                                    {applicationStats.offers}
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Progress */}

                                    <div
                                        className="
                            mt-4
                            h-2
                            overflow-hidden
                            rounded-full
                            bg-[var(--surface-container-highest)]
                        "
                                    >

                                        <div
                                            className="
                                h-full
                                rounded-full
                                bg-[var(--primary)]
                                transition-all
                                duration-700
                            "
                                            style={{
                                                width: `${applicationStats.total
                                                    ? Math.min(
                                                        (
                                                            applicationStats.interviews /
                                                            applicationStats.total
                                                        ) * 100,
                                                        100
                                                    )
                                                    : 0
                                                    }%`,
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ==================================================
        AI NEXT ACTION
    ================================================== */}

                    <Link
                        to={nextAction.to}
                        className="
            group
            relative
            overflow-hidden
            rounded-[1.5rem]
            bg-[var(--primary)]
            p-6
            text-[var(--on-primary)]
            shadow-[var(--shadow-md)]
            transition
            duration-300
            hover:-translate-y-1
            hover:shadow-[var(--shadow-lg)]
            sm:p-7
        "
                    >

                        {/* Decorative circles */}

                        <div
                            className="
                pointer-events-none
                absolute
                -right-16
                -top-16
                h-44
                w-44
                rounded-full
                border
                border-white/10
            "
                        />

                        <div
                            className="
                pointer-events-none
                absolute
                -bottom-24
                -right-4
                h-48
                w-48
                rounded-full
                border
                border-white/10
            "
                        />


                        <div
                            className="
                relative
                flex
                h-full
                flex-col
                justify-between
            "
                        >

                            <div>

                                {/* Top row */}

                                <div
                                    className="
                        flex
                        items-center
                        justify-between
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
                            bg-white/10
                        "
                                    >
                                        <Sparkles size={21} />
                                    </div>

                                    <div
                                        className="
                            flex
                            items-center
                            gap-1.5
                            rounded-full
                            bg-white/10
                            px-2.5
                            py-1.5
                            text-[10px]
                            font-semibold
                        "
                                    >
                                        <span
                                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-[var(--primary-fixed)]
                            "
                                        />
                                        AI recommended
                                    </div>

                                </div>


                                <p
                                    className="
                        mt-6
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.16em]
                        text-white/60
                    "
                                >
                                    Recommended next step
                                </p>

                                <h2
                                    className="
                        mt-2
                        text-2xl
                        font-bold
                        leading-tight
                        tracking-tight
                        text-white
                    "
                                >
                                    {nextAction.title}
                                </h2>

                                <p
                                    className="
                        mt-3
                        text-sm
                        leading-6
                        text-white/70
                    "
                                >
                                    {nextAction.description}
                                </p>


                                {/* Context */}

                                <div
                                    className="
                        mt-5
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.07]
                        p-3
                    "
                                >

                                    <div
                                        className="
                            flex
                            items-start
                            gap-2.5
                        "
                                    >

                                        <CircleCheck
                                            size={16}
                                            className="
                                mt-0.5
                                shrink-0
                                text-[var(--primary-fixed)]
                            "
                                        />

                                        <p
                                            className="
                                text-xs
                                leading-5
                                text-white/75
                            "
                                        >
                                            Skillio recommends this based on
                                            your current career activity and
                                            unfinished work.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* CTA */}

                            <div
                                className="
                    mt-7
                    flex
                    items-center
                    justify-between
                    rounded-xl
                    bg-white
                    px-4
                    py-3
                    text-[var(--primary)]
                    transition
                    group-hover:bg-[var(--primary-fixed)]
                "
                            >

                                <span
                                    className="
                        text-sm
                        font-bold
                    "
                                >
                                    {nextAction.label}
                                </span>

                                <ArrowRight
                                    size={16}
                                    className="
                        transition
                        group-hover:translate-x-1
                    "
                                />

                            </div>

                        </div>

                    </Link>

                </section>

                {/* ==================================================
    WORKSPACES + PREPARATION
================================================== */}

                <section
                    className="
        mt-8
        grid
        grid-cols-1
        gap-5
        lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]
    "
                >

                    {/* ==================================================
        ACTIVE WORKSPACES
    ================================================== */}

                    <div
                        className="
            relative
            overflow-hidden
            rounded-[1.75rem]
            border
            border-[var(--outline-variant)]
            bg-[var(--surface-container-lowest)]
            p-5
            shadow-[var(--shadow-sm)]
            sm:p-6
            lg:p-7
        "
                    >

                        {/* Decorative accent */}

                        <div
                            className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-56
                w-56
                rounded-full
                bg-[var(--primary-fixed)]
                opacity-30
                blur-3xl
            "
                        />

                        <div className="relative">

                            {/* HEADER */}

                            <div
                                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
                            >

                                <div className="min-w-0">

                                    <div
                                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-x-2
                            gap-y-1.5
                            text-[var(--primary)]
                        "
                                    >

                                        <BriefcaseBusiness size={16} />

                                        <span
                                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                            "
                                        >
                                            Job workspaces
                                        </span>

                                        {activeWorkspaces.length > 0 && (
                                            <span
                                                className="
                                    inline-flex
                                    items-center
                                    rounded-full
                                    bg-[var(--primary-fixed)]
                                    px-2
                                    py-0.5
                                    text-[10px]
                                    font-bold
                                    text-[var(--on-primary-fixed-variant)]
                                "
                                            >
                                                {activeWorkspaces.length} active
                                            </span>
                                        )}

                                    </div>

                                    <h2
                                        className="
                            mt-2.5
                            text-xl
                            font-bold
                            tracking-tight
                            text-[var(--on-surface)]
                            sm:text-2xl
                        "
                                    >
                                        Opportunities needing attention
                                    </h2>

                                    <p
                                        className="
                            mt-1.5
                            max-w-xl
                            text-sm
                            leading-6
                            text-[var(--on-surface-variant)]
                        "
                                    >
                                        Keep your most important opportunities moving
                                        forward.
                                    </p>

                                </div>

                                <Link
                                    to="/job-workspaces"
                                    className="
                        group
                        inline-flex
                        min-h-10
                        shrink-0
                        items-center
                        justify-center
                        gap-1.5
                        self-start
                        rounded-xl
                        px-2
                        text-xs
                        font-bold
                        text-[var(--primary)]
                        transition-all
                        duration-200
                        hover:bg-[var(--surface-container)]
                    "
                                >
                                    View all

                                    <ArrowRight
                                        size={14}
                                        className="
                            transition-transform
                            duration-200
                            group-hover:translate-x-0.5
                        "
                                    />
                                </Link>

                            </div>


                            {/* ==================================================
                EMPTY STATE
            ================================================== */}

                            {activeWorkspaces.length === 0 ? (

                                <div
                                    className="
                        mt-6
                        rounded-[1.35rem]
                        border
                        border-dashed
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-low)]
                        px-5
                        py-9
                        text-center
                        sm:px-8
                    "
                                >

                                    <div
                                        className="
                            mx-auto
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[var(--primary-fixed)]
                            text-[var(--on-primary-fixed-variant)]
                        "
                                    >
                                        <BriefcaseBusiness size={22} />
                                    </div>

                                    <h3
                                        className="
                            mt-4
                            text-sm
                            font-bold
                            text-[var(--on-surface)]
                        "
                                    >
                                        Your first opportunity starts here
                                    </h3>

                                    <p
                                        className="
                                        mt-1.5
                                        text-xs
                                        leading-5
                                        text-[var(--on-surface-variant)]
                                        mx-auto
                        "
                                    >
                                        Add a target job and Skillio will create a
                                        connected workspace for the company, resume,
                                        preparation and interview process.
                                    </p>

                                    <Link
                                        to="/job-workspaces"
                                        className="
                            mt-5
                            inline-flex
                            min-h-10
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[var(--primary)]
                            px-4
                            py-2.5
                            text-xs
                            font-bold
                            shadow-[var(--shadow-sm)]
                            transition-all
                            duration-200
                            hover:-translate-y-0.5
                            hover:bg-[var(--primary-container)]
                        "
                                    >
                                        <span className="text-[var(--on-primary)]">
                                            Add your first opportunity
                                        </span>
                                        <ArrowRight size={14} className="text-[var(--on-primary)]"/>
                                    </Link>

                                </div>

                            ) : (

                                /* ==================================================
                                    WORKSPACE LIST
                                ================================================== */

                                <div
                                    className="
                        mt-6
                        overflow-hidden
                        rounded-[1.35rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-low)]
                    "
                                >

                                    {activeWorkspaces
                                        .slice(0, 4)
                                        .map((workspace, index) => {

                                            const match =
                                                getWorkspaceMatch(workspace);

                                            const company =
                                                getWorkspaceCompany(workspace);

                                            const role =
                                                getWorkspaceRole(workspace);

                                            return (
                                                <Link
                                                    key={workspace?._id}
                                                    to={`/job-workspaces/${workspace?._id}`}
                                                    className="
                                        group
                                        block
                                        border-b
                                        border-[var(--outline-variant)]
                                        p-4
                                        last:border-b-0
                                        sm:p-4.5
                                        transition-colors
                                        duration-200
                                        hover:bg-[var(--surface-container)]
                                    "
                                                >

                                                    <div
                                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            sm:gap-4
                                        "
                                                    >

                                                        {/* COMPANY */}

                                                        <div
                                                            className="
                                                flex
                                                h-11
                                                w-11
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-[var(--primary-fixed)]
                                                text-sm
                                                font-extrabold
                                                text-[var(--on-primary-fixed-variant)]
                                                transition-transform
                                                duration-200
                                                group-hover:scale-[1.03]
                                            "
                                                        >
                                                            {getCompanyInitial(company)}
                                                        </div>


                                                        {/* INFORMATION */}

                                                        <div className="min-w-0 flex-1">

                                                            <p
                                                                className="
                                                    truncate
                                                    text-sm
                                                    font-bold
                                                    text-[var(--on-surface)]
                                                    transition-colors
                                                    duration-200
                                                    group-hover:text-[var(--primary)]
                                                "
                                                            >
                                                                {role}
                                                            </p>

                                                            <p
                                                                className="
                                                    mt-1
                                                    truncate
                                                    text-xs
                                                    text-[var(--on-surface-variant)]
                                                "
                                                            >
                                                                {company}
                                                            </p>

                                                        </div>


                                                        {/* MATCH — DESKTOP */}

                                                        {match !== null && (
                                                            <div
                                                                className="
                                                    hidden
                                                    min-w-[72px]
                                                    shrink-0
                                                    text-right
                                                    sm:block
                                                "
                                                            >

                                                                <p
                                                                    className="
                                                        text-sm
                                                        font-extrabold
                                                        text-[var(--primary)]
                                                    "
                                                                >
                                                                    {match}%
                                                                </p>

                                                                <p
                                                                    className="
                                                        mt-0.5
                                                        text-[10px]
                                                        font-medium
                                                        text-[var(--on-surface-variant)]
                                                    "
                                                                >
                                                                    profile match
                                                                </p>

                                                            </div>
                                                        )}


                                                        {/* ARROW */}

                                                        <div
                                                            className="
                                                flex
                                                h-9
                                                w-9
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-[var(--surface)]
                                                text-[var(--on-surface-variant)]
                                                transition-all
                                                duration-200
                                                group-hover:bg-[var(--primary)]
                                                group-hover:text-[var(--on-primary)]
                                            "
                                                        >
                                                            <ChevronRight
                                                                size={16}
                                                                className="
                                                    transition-transform
                                                    duration-200
                                                    group-hover:translate-x-0.5
                                                "
                                                            />
                                                        </div>

                                                    </div>


                                                    {/* MOBILE MATCH */}

                                                    {match !== null && (
                                                        <div
                                                            className="
                                                mt-3
                                                flex
                                                items-center
                                                justify-between
                                                border-t
                                                border-[var(--outline-variant)]
                                                pt-2.5
                                                sm:hidden
                                            "
                                                        >

                                                            <span
                                                                className="
                                                    text-[10px]
                                                    font-medium
                                                    text-[var(--on-surface-variant)]
                                                "
                                                            >
                                                                Profile match
                                                            </span>

                                                            <span
                                                                className="
                                                    text-xs
                                                    font-extrabold
                                                    text-[var(--primary)]
                                                "
                                                            >
                                                                {match}%
                                                            </span>

                                                        </div>
                                                    )}

                                                </Link>
                                            );
                                        })}

                                </div>

                            )}

                        </div>

                    </div>


                    {/* ==================================================
        PREPARATION
    ================================================== */}

                    <div
                        className="
            relative
            overflow-hidden
            rounded-[1.75rem]
            border
            border-[var(--outline-variant)]
            bg-[var(--surface-container-lowest)]
            p-5
            shadow-[var(--shadow-sm)]
            sm:p-6
            lg:p-7
        "
                    >

                        {/* Decorative accent */}

                        <div
                            className="
                pointer-events-none
                absolute
                -right-20
                -top-20
                h-48
                w-48
                rounded-full
                bg-[var(--secondary-container)]
                opacity-30
                blur-3xl
            "
                        />

                        <div className="relative">

                            {/* HEADER */}

                            <div
                                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
                            >

                                <div className="min-w-0">

                                    <div
                                        className="
                            flex
                            items-center
                            gap-2
                            text-[var(--primary)]
                        "
                                    >
                                        <Target size={16} />

                                        <span
                                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                            "
                                        >
                                            Preparation
                                        </span>
                                    </div>

                                    <h2
                                        className="
                            mt-2.5
                            text-xl
                            font-bold
                            tracking-tight
                            text-[var(--on-surface)]
                            sm:text-2xl
                        "
                                    >
                                        Keep building momentum
                                    </h2>

                                    <p
                                        className="
                            mt-1.5
                            text-sm
                            leading-6
                            text-[var(--on-surface-variant)]
                        "
                                    >
                                        Your preparation progress across active plans.
                                    </p>

                                </div>

                                <Link
                                    to="/preparation"
                                    aria-label="Open preparation"
                                    className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--surface-container)]
                        text-[var(--on-surface-variant)]
                        transition-all
                        duration-200
                        hover:bg-[var(--primary)]
                        hover:text-[var(--on-primary)]
                    "
                                >
                                    <ArrowUpRight size={17} />
                                </Link>

                            </div>


                            {/* ==================================================
                OVERALL SCORE
            ================================================== */}

                            <div
                                className="
                    relative
                    mt-6
                    overflow-hidden
                    rounded-[1.35rem]
                    bg-[var(--primary)]
                    p-5
                    text-[var(--on-primary)]
                    shadow-[var(--shadow-md)]
                "
                            >

                                {/* Inner glow */}

                                <div
                                    className="
                        pointer-events-none
                        absolute
                        -right-10
                        -top-10
                        h-32
                        w-32
                        rounded-full
                        bg-white/10
                        blur-2xl
                    "
                                />

                                <div
                                    className="
                        relative
                        flex
                        items-center
                        justify-between
                        gap-4
                    "
                                >

                                    <div>

                                        <p
                                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-white/60
                            "
                                        >
                                            Overall progress
                                        </p>

                                        <p
                                            className="
                                mt-1
                                text-3xl
                                font-extrabold
                                tracking-tight
                            "
                                            style={{
                                                fontFamily:
                                                    "var(--font-heading)",
                                            }}
                                        >
                                            {preparationStats.progress}%
                                        </p>

                                    </div>

                                    <div
                                        className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-white/10
                            bg-white/10
                        "
                                    >
                                        <Target size={20} />
                                    </div>

                                </div>


                                {/* PROGRESS */}

                                <div
                                    className="
                        relative
                        mt-4
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-white/15
                    "
                                >
                                    <div
                                        className="
                            h-full
                            rounded-full
                            bg-[var(--primary-fixed)]
                            transition-all
                            duration-700
                        "
                                        style={{
                                            width: `${Math.min(
                                                preparationStats.progress || 0,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </div>


                                {/* META */}

                                <div
                                    className="
                        relative
                        mt-3
                        flex
                        items-center
                        justify-between
                        gap-3
                        text-[10px]
                        font-medium
                        text-white/60
                    "
                                >
                                    <span>
                                        {preparationStats.completedTasks || 0} completed
                                    </span>

                                    <span>
                                        {preparationStats.totalTasks || 0} total tasks
                                    </span>
                                </div>

                            </div>


                            {/* ==================================================
                PREPARATION PLANS
            ================================================== */}

                            {preparationPreview.length === 0 ? (

                                <div
                                    className="
                        mt-5
                        rounded-[1.35rem]
                        border
                        border-dashed
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-low)]
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
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-[var(--secondary-container)]
                                text-[var(--secondary)]
                            "
                                        >
                                            <Sparkles size={17} />
                                        </div>

                                        <div className="min-w-0">

                                            <p
                                                className="
                                    text-sm
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                                            >
                                                Create your first preparation plan
                                            </p>

                                            <p
                                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-[var(--on-surface-variant)]
                                "
                                            >
                                                Choose a target role and turn it into
                                                focused interview, technical and
                                                behavioral preparation.
                                            </p>

                                            <Link
                                                to="/preparation"
                                                className="
                                    group
                                    mt-3
                                    inline-flex
                                    min-h-8
                                    items-center
                                    gap-1.5
                                    text-xs
                                    font-bold
                                    text-[var(--primary)]
                                "
                                            >
                                                Build a preparation plan

                                                <ArrowRight
                                                    size={13}
                                                    className="
                                        transition-transform
                                        duration-200
                                        group-hover:translate-x-0.5
                                    "
                                                />
                                            </Link>

                                        </div>

                                    </div>

                                </div>

                            ) : (

                                <div className="mt-6 space-y-3">

                                    {preparationPreview
                                        .slice(0, 3)
                                        .map((plan) => {

                                            const progress =
                                                getPreparationProgress(plan);

                                            const tasks =
                                                getTaskArray(plan);

                                            const completedTasks =
                                                tasks.filter(
                                                    (task) =>
                                                        task?.completed === true ||
                                                        task?.isCompleted === true ||
                                                        task?.status === "completed"
                                                ).length;

                                            const remainingTasks =
                                                Math.max(
                                                    tasks.length - completedTasks,
                                                    0
                                                );

                                            return (
                                                <Link
                                                    key={plan?._id}
                                                    to="/preparation"
                                                    className="
                                        group
                                        block
                                        rounded-[1.25rem]
                                        border
                                        border-[var(--outline-variant)]
                                        bg-[var(--surface-container-low)]
                                        p-4
                                        transition-all
                                        duration-200
                                        hover:-translate-y-0.5
                                        hover:border-[var(--primary)]
                                        hover:bg-[var(--surface-container)]
                                        hover:shadow-[var(--shadow-sm)]
                                    "
                                                >

                                                    {/* PLAN HEADER */}

                                                    <div
                                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                        "
                                                    >

                                                        <div className="min-w-0">

                                                            <p
                                                                className="
                                                    truncate
                                                    text-sm
                                                    font-bold
                                                    text-[var(--on-surface)]
                                                    transition-colors
                                                    duration-200
                                                    group-hover:text-[var(--primary)]
                                                "
                                                            >
                                                                {plan?.title ||
                                                                    plan?.name ||
                                                                    "Preparation plan"}
                                                            </p>

                                                            <p
                                                                className="
                                                    mt-1
                                                    text-[10px]
                                                    font-medium
                                                    text-[var(--on-surface-variant)]
                                                "
                                                            >
                                                                {tasks.length}{" "}
                                                                {tasks.length === 1
                                                                    ? "task"
                                                                    : "tasks"}
                                                            </p>

                                                        </div>

                                                        <span
                                                            className="
                                                shrink-0
                                                rounded-full
                                                bg-[var(--primary-fixed)]
                                                px-2
                                                py-1
                                                text-[10px]
                                                font-extrabold
                                                text-[var(--on-primary-fixed-variant)]
                                            "
                                                        >
                                                            {progress}%
                                                        </span>

                                                    </div>


                                                    {/* PROGRESS */}

                                                    <div className="mt-3">

                                                        <ProgressBar
                                                            value={progress}
                                                        />

                                                    </div>


                                                    {/* TASK SUMMARY */}

                                                    <div
                                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            justify-between
                                            gap-3
                                        "
                                                    >

                                                        <div
                                                            className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-3
                                            "
                                                        >

                                                            <span
                                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-1.5
                                                    whitespace-nowrap
                                                    text-[10px]
                                                    font-medium
                                                    text-[var(--on-surface-variant)]
                                                "
                                                            >
                                                                <CircleCheck size={12} />

                                                                {completedTasks} done
                                                            </span>

                                                            <span
                                                                className="
                                                    h-3
                                                    w-px
                                                    shrink-0
                                                    bg-[var(--outline-variant)]
                                                "
                                                            />

                                                            <span
                                                                className="
                                                    whitespace-nowrap
                                                    text-[10px]
                                                    font-medium
                                                    text-[var(--on-surface-variant)]
                                                "
                                                            >
                                                                {remainingTasks} remaining
                                                            </span>

                                                        </div>

                                                        <ChevronRight
                                                            size={15}
                                                            className="
                                                shrink-0
                                                text-[var(--on-surface-variant)]
                                                transition-all
                                                duration-200
                                                group-hover:translate-x-1
                                                group-hover:text-[var(--primary)]
                                            "
                                                        />

                                                    </div>

                                                </Link>
                                            );
                                        })}

                                </div>

                            )}


                            {/* FOOTER */}

                            {preparationPreview.length > 0 && (
                                <Link
                                    to="/preparation"
                                    className="
                        group
                        mt-5
                        flex
                        min-h-11
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface)]
                        px-4
                        py-2.5
                        text-xs
                        font-bold
                        text-[var(--on-surface)]
                        transition-all
                        duration-200
                        hover:border-[var(--primary)]
                        hover:bg-[var(--surface-container)]
                    "
                                >
                                    Open preparation workspace

                                    <ArrowRight
                                        size={14}
                                        className="
                            transition-transform
                            duration-200
                            group-hover:translate-x-0.5
                        "
                                    />
                                </Link>
                            )}

                        </div>

                    </div>

                </section>

                {/* ==================================================
    INTERVIEW + RESUME INTELLIGENCE
================================================== */}

                <section
                    className="
        mt-8
        grid
        gap-6
        lg:grid-cols-2
    "
                >

                    {/* ==================================================
        INTERVIEW READINESS
    ================================================== */}

                    <div
                        className="
            group
            relative
            overflow-hidden
            rounded-[1.75rem]
            border
            border-[var(--outline-variant)]
            bg-[var(--surface-container-lowest)]
            p-5
            shadow-[var(--shadow-sm)]
            sm:p-6
            lg:p-7
        "
                    >

                        {/* Decorative background */}

                        <div
                            className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                h-64
                w-64
                rounded-full
                bg-[var(--primary-container)]
                opacity-20
                blur-3xl
            "
                        />

                        <div className="relative">

                            {/* HEADER */}

                            <div
                                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
                            >

                                <div className="min-w-0">

                                    <div
                                        className="
                            flex
                            items-center
                            gap-2
                            text-[var(--primary)]
                        "
                                    >
                                        <div
                                            className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                bg-[var(--primary-container)]
                                text-[var(--on-primary-container)]
                            "
                                        >
                                            <Video size={14} />
                                        </div>

                                        <span
                                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                            "
                                        >
                                            Interview readiness
                                        </span>
                                    </div>

                                    <h2
                                        className="
                            mt-3
                            text-xl
                            font-bold
                            tracking-tight
                            text-[var(--on-surface)]
                            sm:text-2xl
                        "
                                        style={{
                                            fontFamily:
                                                "var(--font-heading)",
                                        }}
                                    >
                                        Practice before it matters.
                                    </h2>

                                    <p
                                        className="
                            mt-1.5
                            max-w-lg
                            text-sm
                            leading-6
                            text-[var(--on-surface-variant)]
                        "
                                    >
                                        Build confidence through realistic
                                        practice and measurable feedback.
                                    </p>

                                </div>

                                <Link
                                    to="/interviews"
                                    className="
                        inline-flex
                        w-fit
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-xl
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface)]
                        px-3.5
                        py-2
                        text-xs
                        font-bold
                        text-[var(--on-surface)]
                        transition
                        hover:border-[var(--primary)]
                        hover:text-[var(--primary)]
                    "
                                >
                                    Practice now
                                    <ArrowUpRight size={14} />
                                </Link>

                            </div>


                            {/* ==================================================
                UPCOMING INTERVIEW
            ================================================== */}

                            {upcomingInterview ? (

                                <div
                                    className="
                        mt-6
                        overflow-hidden
                        rounded-[1.4rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--primary-container)]
                    "
                                >

                                    <div className="p-5 sm:p-6">

                                        {/* Top */}

                                        <div
                                            className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            "
                                        >

                                            <div className="min-w-0">

                                                <span
                                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        bg-[var(--surface)]
                                        px-2.5
                                        py-1.5
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.08em]
                                        text-[var(--primary)]
                                    "
                                                >
                                                    <CalendarDays size={12} />

                                                    Upcoming
                                                </span>

                                                <h3
                                                    className="
                                        mt-4
                                        truncate
                                        text-lg
                                        font-bold
                                        tracking-tight
                                        text-[var(--on-surface)]
                                        sm:text-xl
                                    "
                                                >
                                                    {upcomingInterview?.title ||
                                                        "Interview session"}
                                                </h3>

                                                <div
                                                    className="
                                        mt-2
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-x-3
                                        gap-y-1.5
                                        text-xs
                                        font-medium
                                        text-[var(--on-surface-variant)]
                                    "
                                                >

                                                    <span
                                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                        "
                                                    >
                                                        <Clock3 size={13} />

                                                        {formatDate(
                                                            upcomingInterview?.scheduledAt ||
                                                            upcomingInterview?.scheduledFor ||
                                                            upcomingInterview?.interviewDate ||
                                                            upcomingInterview?.date
                                                        )}
                                                    </span>

                                                </div>

                                            </div>


                                            {/* Interview icon */}

                                            <div
                                                className="
                                    hidden
                                    h-11
                                    w-11
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[var(--surface)]
                                    text-[var(--primary)]
                                    sm:flex
                                "
                                            >
                                                <Video size={19} />
                                            </div>

                                        </div>


                                        {/* ==================================================
                            PREPARATION CHECKLIST
                        ================================================== */}

                                        <div className="mt-5">

                                            <p
                                                className="
                                    mb-2.5
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.12em]
                                    text-[var(--on-surface-variant)]
                                "
                                            >
                                                Before you go
                                            </p>

                                            <div
                                                className="
                                    grid
                                    gap-2
                                    sm:grid-cols-3
                                "
                                            >

                                                {[
                                                    {
                                                        icon: FileText,
                                                        label: "Review resume",
                                                    },
                                                    {
                                                        icon: Target,
                                                        label: "Practice role",
                                                    },
                                                    {
                                                        icon: MessageSquare,
                                                        label: "Prepare answers",
                                                    },
                                                ].map((item) => {

                                                    const Icon = item.icon;

                                                    return (
                                                        <div
                                                            key={item.label}
                                                            className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-2
                                                rounded-xl
                                                border
                                                border-[var(--outline-variant)]
                                                bg-[var(--surface)]
                                                px-3
                                                py-2.5
                                                text-[10px]
                                                font-semibold
                                                text-[var(--on-surface)]
                                            "
                                                        >

                                                            <Icon
                                                                size={14}
                                                                className="
                                                    shrink-0
                                                    text-[var(--primary)]
                                                "
                                                            />

                                                            <span className="truncate">
                                                                {item.label}
                                                            </span>

                                                        </div>
                                                    );
                                                })}

                                            </div>

                                        </div>


                                        {/* CTA */}

                                        <Link
                                            to="/interviews"
                                            className="
                                mt-5
                                flex
                                w-full
                                items-center
                                justify-between
                                gap-3
                                rounded-xl
                                bg-[var(--primary)]
                                px-4
                                py-3.5
                                text-sm
                                font-bold
                                text-[var(--on-primary)]
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]
                            "
                                        >
                                            <span>
                                                Prepare for interview
                                            </span>

                                            <ArrowRight
                                                size={16}
                                                className="
                                    shrink-0
                                    transition
                                    group-hover:translate-x-1
                                "
                                            />

                                        </Link>

                                    </div>

                                </div>

                            ) : (

                                /* ==================================================
                                    NO UPCOMING INTERVIEW
                                ================================================== */

                                <div
                                    className="
                        mt-6
                        overflow-hidden
                        rounded-[1.4rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container)]
                    "
                                >

                                    <div className="p-5 sm:p-6">

                                        {/* Intro */}

                                        <div
                                            className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            "
                                        >

                                            <div className="min-w-0">

                                                <p
                                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.12em]
                                        text-[var(--primary)]
                                    "
                                                >
                                                    Practice activity
                                                </p>

                                                <p
                                                    className="
                                        mt-1
                                        text-sm
                                        leading-5
                                        text-[var(--on-surface-variant)]
                                    "
                                                >
                                                    Keep improving your interview confidence.
                                                </p>

                                            </div>

                                            <div
                                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[var(--primary-container)]
                                    text-[var(--on-primary-container)]
                                "
                                            >
                                                <TrendingUp size={17} />
                                            </div>

                                        </div>


                                        {/* ================================
    METRICS
================================ */}

                                        <div
                                            className="
        mt-5
        grid
        grid-cols-3
        overflow-hidden
        rounded-xl
        border
        border-[var(--outline-variant)]
        bg-[var(--surface-container-lowest)]
        divide-x
        divide-[var(--outline-variant)]
    "
                                        >
                                            {/* SESSIONS */}
                                            <div
                                                className="
            flex
            min-w-0
            flex-col
            items-center
            justify-center
            px-3
            py-4
            sm:px-4
            sm:py-5
        "
                                            >
                                                <div
                                                    className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-[var(--primary-container)]
                text-[var(--primary)]
            "
                                                >
                                                    <MessageSquare size={15} strokeWidth={2.2} />
                                                </div>

                                                <p
                                                    className="
                mt-2
                text-xl
                font-bold
                leading-none
                text-[var(--on-surface)]
                sm:text-2xl
            "
                                                >
                                                    {interviewStats?.sessions ?? 0}
                                                </p>

                                                <p
                                                    className="
                mt-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-[var(--on-surface-variant)]
                sm:text-xs
                sm:normal-case
                sm:tracking-normal
            "
                                                >
                                                    Sessions
                                                </p>
                                            </div>


                                            {/* EVALUATED */}
                                            <div
                                                className="
            flex
            min-w-0
            flex-col
            items-center
            justify-center
            px-3
            py-4
            sm:px-4
            sm:py-5
        "
                                            >
                                                <div
                                                    className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-[var(--primary-container)]
                text-[var(--primary)]
            "
                                                >
                                                    <CheckCircle2 size={15} strokeWidth={2.2} />
                                                </div>

                                                <p
                                                    className="
                mt-2
                text-xl
                font-bold
                leading-none
                text-[var(--on-surface)]
                sm:text-2xl
            "
                                                >
                                                    {interviewStats?.evaluatedQuestions ?? 0}
                                                </p>

                                                <p
                                                    className="
                mt-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-[var(--on-surface-variant)]
                sm:text-xs
                sm:normal-case
                sm:tracking-normal
            "
                                                >
                                                    Evaluated
                                                </p>
                                            </div>


                                            {/* AVERAGE SCORE */}
                                            <div
                                                className="
            flex
            min-w-0
            flex-col
            items-center
            justify-center
            px-3
            py-4
            sm:px-4
            sm:py-5
        "
                                            >
                                                <div
                                                    className="
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-[var(--primary-container)]
                text-[var(--primary)]
            "
                                                >
                                                    <TrendingUp size={15} strokeWidth={2.2} />
                                                </div>

                                                <p
                                                    className="
                mt-2
                text-xl
                font-bold
                leading-none
                text-[var(--on-surface)]
                sm:text-2xl
            "
                                                >
                                                    {interviewStats?.averageScore ?? "—"}
                                                </p>

                                                <p
                                                    className="
                mt-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-wide
                text-[var(--on-surface-variant)]
                sm:text-xs
                sm:normal-case
                sm:tracking-normal
            "
                                                >
                                                    Avg. score
                                                </p>
                                            </div>
                                        </div>


                                        {/* Insight */}

                                        <div
                                            className="
                                mt-4
                                flex
                                items-start
                                gap-2.5
                                rounded-xl
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface)]
                                px-3.5
                                py-3
                            "
                                        >

                                            <Sparkles
                                                size={14}
                                                className="
                                    mt-0.5
                                    shrink-0
                                    text-[var(--primary)]
                                "
                                            />

                                            <p
                                                className="
                                    text-xs
                                    leading-5
                                    text-[var(--on-surface-variant)]
                                "
                                            >
                                                {interviewStats.sessions
                                                    ? "Keep practicing consistently. Every evaluated answer is another opportunity to improve."
                                                    : "Your first practice session is a great place to start building interview confidence."}
                                            </p>

                                        </div>


                                        {/* CTA */}

                                        <Link
                                            to="/interviews"
                                            className="
                                mt-5
                                flex
                                w-full
                                items-center
                                justify-between
                                gap-3
                                rounded-xl
                                bg-[var(--primary)]
                                px-4
                                py-3.5
                                text-sm
                                font-bold
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)]
                            "
                                        >
                                            <span className="text-white">
                                                Start an AI interview
                                            </span>

                                            <Play
                                                size={16}
                                                className="shrink-0 text-white"
                                            />

                                        </Link>

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* ==================================================
        RESUME INTELLIGENCE
    ================================================== */}

                    <div
                        className="
            relative
            overflow-hidden
            rounded-[1.75rem]
            border
            border-[var(--outline-variant)]
            bg-[var(--surface-container-lowest)]
            p-5
            shadow-[var(--shadow-sm)]
            sm:p-6
            lg:p-7
        "
                    >

                        {/* Decorative background */}

                        <div
                            className="
                pointer-events-none
                absolute
                -bottom-24
                -right-24
                h-64
                w-64
                rounded-full
                bg-[var(--secondary-container)]
                opacity-20
                blur-3xl
            "
                        />

                        <div className="relative">

                            {/* HEADER */}

                            <div
                                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-start
                    sm:justify-between
                "
                            >

                                <div className="min-w-0">

                                    <div
                                        className="
                            flex
                            items-center
                            gap-2
                            text-[var(--primary)]
                        "
                                    >

                                        <div
                                            className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                bg-[var(--primary-container)]
                                text-[var(--on-primary-container)]
                            "
                                        >
                                            <FileText size={14} />
                                        </div>

                                        <span
                                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                            "
                                        >
                                            Resume intelligence
                                        </span>

                                    </div>

                                    <h2
                                        className="
                            mt-3
                            text-xl
                            font-bold
                            tracking-tight
                            text-[var(--on-surface)]
                            sm:text-2xl
                        "
                                        style={{
                                            fontFamily:
                                                "var(--font-heading)",
                                        }}
                                    >
                                        Make your resume work harder.
                                    </h2>

                                    <p
                                        className="
                            mt-1.5
                            max-w-lg
                            text-sm
                            leading-6
                            text-[var(--on-surface-variant)]
                        "
                                    >
                                        Keep a strong base resume ready for
                                        every opportunity.
                                    </p>

                                </div>

                                <Link
                                    to="/resumes"
                                    className="
                        inline-flex
                        w-fit
                        shrink-0
                        items-center
                        gap-1.5
                        rounded-xl
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface)]
                        px-3.5
                        py-2
                        text-xs
                        font-bold
                        text-[var(--on-surface)]
                        transition
                        hover:border-[var(--primary)]
                        hover:text-[var(--primary)]
                    "
                                >
                                    Manage
                                    <ArrowUpRight size={14} />
                                </Link>

                            </div>


                            {/* ==================================================
                RESUME OVERVIEW
            ================================================== */}

                            <div
                                className="
                    mt-6
                    rounded-[1.4rem]
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container)]
                    p-5
                    sm:p-6
                "
                            >

                                {/* Main resume status */}

                                <div
                                    className="
                        flex
                        items-start
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
                            rounded-xl
                            bg-[var(--primary-container)]
                            text-[var(--on-primary-container)]
                            sm:h-14
                            sm:w-14
                            sm:rounded-2xl
                        "
                                    >
                                        <FileText
                                            size={22}
                                            className="sm:hidden"
                                        />

                                        <FileText
                                            size={25}
                                            className="hidden sm:block"
                                        />
                                    </div>


                                    <div className="min-w-0 flex-1">

                                        <div
                                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                                        >

                                            <p
                                                className="
                                    min-w-0
                                    text-sm
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                                            >
                                                {resumes.length
                                                    ? `${resumes.length} resume${resumes.length > 1 ? "s" : ""} available`
                                                    : "No resume yet"}
                                            </p>

                                            {resumes.length > 0 && (
                                                <span
                                                    className="
                                        rounded-full
                                        bg-[var(--primary-fixed)]
                                        px-2.5
                                        py-1
                                        text-[9px]
                                        font-bold
                                        text-[var(--on-primary-fixed)]
                                    "
                                                >
                                                    {resumes.some(
                                                        (resume) =>
                                                            resume?.isPrimary ||
                                                            resume?.primary
                                                    )
                                                        ? "READY"
                                                        : "SETUP NEEDED"}
                                                </span>
                                            )}

                                        </div>

                                        <p
                                            className="
                                mt-1.5
                                text-xs
                                leading-5
                                text-[var(--on-surface-variant)]
                            "
                                        >
                                            {resumes.some(
                                                (resume) =>
                                                    resume?.isPrimary ||
                                                    resume?.primary
                                            )
                                                ? "Your primary resume is ready to use for applications."
                                                : resumes.length
                                                    ? "Choose a primary resume so you always know which version to use."
                                                    : "Create or upload your first resume to unlock more of your career workflow."}
                                        </p>

                                    </div>

                                </div>


                                {/* ==================================================
                    STATUS METRICS
                ================================================== */}

                                <div
                                    className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-3
                    "
                                >

                                    <div
                                        className="
                            rounded-xl
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface)]
                            p-3.5
                        "
                                    >

                                        <p
                                            className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.1em]
                                text-[var(--on-surface-variant)]
                            "
                                        >
                                            Total resumes
                                        </p>

                                        <div
                                            className="
                                mt-1
                                flex
                                items-end
                                justify-between
                                gap-2
                            "
                                        >

                                            <p
                                                className="
                                    text-xl
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                                            >
                                                {resumes.length}
                                            </p>

                                            <FileText
                                                size={14}
                                                className="
                                    mb-1
                                    text-[var(--primary)]
                                "
                                            />

                                        </div>

                                    </div>


                                    <div
                                        className="
                            rounded-xl
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface)]
                            p-3.5
                        "
                                    >

                                        <p
                                            className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.1em]
                                text-[var(--on-surface-variant)]
                            "
                                        >
                                            Primary resume
                                        </p>

                                        <div
                                            className="
                                mt-1
                                flex
                                items-end
                                justify-between
                                gap-2
                            "
                                        >

                                            <p
                                                className="
                                    text-lg
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                                            >
                                                {resumes.some(
                                                    (resume) =>
                                                        resume?.isPrimary ||
                                                        resume?.primary
                                                )
                                                    ? "Ready"
                                                    : "Not set"}
                                            </p>

                                            <CheckCircle2
                                                size={14}
                                                className="
                                    mb-1
                                    text-[var(--primary)]
                                "
                                            />

                                        </div>

                                    </div>

                                </div>


                                {/* ==================================================
                    RESUME GUIDANCE
                ================================================== */}

                                <div
                                    className="
                        mt-4
                        rounded-xl
                        bg-[var(--surface)]
                        px-4
                        py-3
                    "
                                >

                                    <div
                                        className="
                            flex
                            items-start
                            gap-2.5
                        "
                                    >

                                        <Sparkles
                                            size={14}
                                            className="
                                mt-0.5
                                shrink-0
                                text-[var(--primary)]
                            "
                                        />

                                        <p
                                            className="
                                text-xs
                                leading-5
                                text-[var(--on-surface-variant)]
                            "
                                        >
                                            {resumes.some(
                                                (resume) =>
                                                    resume?.isPrimary ||
                                                    resume?.primary
                                            )
                                                ? "Your primary resume is ready. Keep it updated as your skills and experience grow."
                                                : resumes.length
                                                    ? "Set one resume as primary to make applications faster and more consistent."
                                                    : "Upload or create your first resume to start tailoring applications."}
                                        </p>

                                    </div>

                                </div>


                                {/* ==================================================
                    ACTIONS
                ================================================== */}

                                <div
                                    className="
                        mt-4
                        grid
                        gap-2.5
                        sm:grid-cols-2
                    "
                                >

                                    <Link
                                        to="/resumes"
                                        className="
                            flex
                            min-h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface)]
                            px-4
                            py-2.5
                            text-xs
                            font-bold
                            text-[var(--on-surface)]
                            transition
                            hover:border-[var(--primary)]
                            hover:text-[var(--primary)]
                        "
                                    >
                                        <FileText size={15} />
                                        View resumes
                                    </Link>

                                    <Link
                                        to="/resumes"
                                        className="
                            flex
                            min-h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[var(--primary)]
                            px-4
                            py-2.5
                            text-xs
                            font-bold
                            transition
                            hover:-translate-y-0.5
                            hover:shadow-[0_8px_20px_rgba(0,0,0,0.10)]
                        "
                                    >
                                        <Plus size={15} className="text-white" />
                                        <span className="text-white">
                                            Add resume
                                        </span>
                                    </Link>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* ==================================================
    AI CAREER INSIGHT
================================================== */}

                <section className="mt-6">

                    <div
                        className="
            group
            relative
            overflow-hidden
            rounded-[1.75rem]
            border
            border-[var(--outline-variant)]
            bg-[var(--surface-container-lowest)]
            p-6
            sm:p-7
        "
                    >

                        {/* Decorative background */}

                        <div
                            className="
                pointer-events-none
                absolute
                -right-16
                -top-24
                h-64
                w-64
                rounded-full
                bg-[var(--primary-container)]
                opacity-20
                blur-3xl
            "
                        />

                        <div
                            className="
                pointer-events-none
                absolute
                -bottom-24
                left-1/3
                h-40
                w-40
                rounded-full
                bg-[var(--secondary-container)]
                opacity-20
                blur-3xl
            "
                        />


                        <div
                            className="
                relative
                flex
                flex-col
                gap-6
                md:flex-row
                md:items-center
                md:justify-between
            "
                        >

                            {/* Insight */}

                            <div
                                className="
                    flex
                    items-start
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
                        bg-[var(--primary)]
                        text-[var(--on-primary)]
                        shadow-[0_8px_24px_rgba(62,74,55,0.16)]
                    "
                                >
                                    <Sparkles size={21} />
                                </div>


                                <div>

                                    <p
                                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.15em]
                            text-[var(--primary)]
                        "
                                    >
                                        AI career insight
                                    </p>

                                    <h2
                                        className="
                            mt-1.5
                            text-lg
                            font-bold
                            tracking-tight
                            text-[var(--on-surface)]
                            sm:text-xl
                        "
                                    >
                                        {conversations.length
                                            ? "Continue where you left off."
                                            : "Your career coach is ready."}
                                    </h2>

                                    <p
                                        className="
                            mt-1.5
                            max-w-2xl
                            text-sm
                            leading-6
                            text-[var(--on-surface-variant)]
                        "
                                    >
                                        {conversations.length
                                            ? "You already have career conversations. Revisit the latest advice and turn it into a concrete next step."
                                            : "Ask Skillio about applications, interviews, resume strategy, preparation, or what you should prioritize next."}
                                    </p>

                                </div>

                            </div>


                            {/* CTA */}

                            <Link
                                to="/career-coach"
                                className="
                    group/cta
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[var(--primary)]
                    px-5
                    py-3
                    text-sm
                    font-bold
                    
                    shadow-[0_6px_18px_rgba(62,74,55,0.12)]
                    transition
                    hover:-translate-y-0.5
                    hover:shadow-[0_10px_24px_rgba(62,74,55,0.18)]
                "
                            >
                                <span className="text-[var(--on-primary)]">Ask Career Coach</span>

                                <ArrowRight
                                    size={16}
                                    className="
                        transition
                        group-hover/cta:translate-x-1 text-[var(--on-primary)]
                    "
                                />
                            </Link>

                        </div>

                    </div>

                </section>


                {/* ==================================================
    RECENT ACTIVITY
================================================== */}

                <section className="mt-8">

                    <div
                        className="
            relative
            overflow-hidden
            rounded-[1.75rem]
            border
            border-[var(--outline-variant)]
            bg-[var(--surface-container-lowest)]
            p-5
            sm:p-6
            lg:p-7
        "
                    >

                        {/* Subtle decorative atmosphere */}

                        <div
                            className="
                pointer-events-none
                absolute
                -right-24
                -top-28
                h-72
                w-72
                rounded-full
                bg-[var(--primary-container)]
                opacity-[0.10]
                blur-3xl
            "
                        />

                        <div
                            className="
                pointer-events-none
                absolute
                bottom-0
                left-1/3
                h-32
                w-32
                rounded-full
                bg-[var(--secondary-container)]
                opacity-[0.08]
                blur-3xl
            "
                        />


                        <div className="relative">

                            {/* ------------------------------------------------
                HEADER
            ------------------------------------------------ */}

                            <div
                                className="
                    flex
                    flex-col
                    gap-4
                    sm:flex-row
                    sm:items-end
                    sm:justify-between
                "
                            >

                                <div>

                                    <div
                                        className="
                            flex
                            items-center
                            gap-2
                        "
                                    >

                                        <div
                                            className="
                                flex
                                h-7
                                w-7
                                items-center
                                justify-center
                                rounded-lg
                                bg-[var(--primary-container)]
                                text-[var(--on-primary-container)]
                            "
                                        >
                                            <Clock3 size={14} />
                                        </div>

                                        <p
                                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-[var(--primary)]
                            "
                                        >
                                            Activity
                                        </p>

                                    </div>


                                    <h2
                                        className="
                            mt-3
                            text-xl
                            font-bold
                            tracking-tight
                            text-[var(--on-surface)]
                            sm:text-2xl
                        "
                                        style={{
                                            fontFamily:
                                                "var(--font-heading)",
                                        }}
                                    >
                                        Your career activity
                                    </h2>


                                    <p
                                        className="
                            mt-1.5
                            max-w-2xl
                            text-xs
                            leading-5
                            text-[var(--on-surface-variant)]
                            sm:text-sm
                            sm:leading-6
                        "
                                    >
                                        Keep track of the latest changes
                                        across your Skillio workspace.
                                    </p>

                                </div>


                                {recentActivity.length > 0 && (

                                    <div
                                        className="
                            inline-flex
                            w-fit
                            items-center
                            gap-3
                            rounded-full
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-low)]
                            px-3
                            py-1.5
                            text-[10px]
                            font-semibold
                            text-[var(--on-surface-variant)]
                        "
                                    >

                                        <span
                                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-[var(--primary)]
                            "
                                        />

                                        {recentActivity.length} recent{" "}
                                        {recentActivity.length === 1
                                            ? "update"
                                            : "updates"}

                                    </div>

                                )}

                            </div>


                            {/* ------------------------------------------------
                EMPTY STATE
            ------------------------------------------------ */}

                            {recentActivity.length === 0 ? (

                                <div
                                    className="
                        relative
                        mt-7
                        overflow-hidden
                        rounded-[1.4rem]
                        border
                        border-dashed
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-low)]
                        px-6
                        py-12
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
                            rounded-[1.25rem]
                            bg-[var(--primary-container)]
                            text-[var(--on-primary-container)]
                            shadow-[var(--shadow-sm)]
                        "
                                    >
                                        <Clock3 size={25} />
                                    </div>


                                    <h3
                                        className="
                            mt-5
                            text-base
                            font-bold
                            text-[var(--on-surface)]
                            sm:text-lg
                        "
                                    >
                                        Your career journey starts here
                                    </h3>


                                    <p
                                        className="
                            mx-auto
                            mt-2
                            text-xs
                            leading-5
                            text-[var(--on-surface-variant)]
                            sm:text-sm
                            sm:leading-6
                        "
                                    >
                                        Once you create a profile, resume,
                                        application, job workspace or
                                        preparation plan, your latest
                                        activity will appear here.
                                    </p>


                                    <div
                                        className="
                            mx-auto
                            mt-6
                            flex
                            max-w-md
                            flex-wrap
                            justify-center
                            gap-2
                        "
                                    >

                                        {[
                                            "Build profile",
                                            "Create resume",
                                            "Add opportunity",
                                        ].map((item) => (

                                            <span
                                                key={item}
                                                className="
                                    rounded-full
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface)]
                                    px-3
                                    py-1.5
                                    text-[10px]
                                    font-semibold
                                    text-[var(--on-surface-variant)]
                                "
                                            >
                                                {item}
                                            </span>

                                        ))}

                                    </div>

                                </div>

                            ) : (

                                /* ------------------------------------------------
                                    POPULATED ACTIVITY
                                ------------------------------------------------ */

                                <div
                                    className="
                        relative
                        mt-7
                    "
                                >

                                    {/* Timeline rail */}

                                    <div
                                        className="
                            absolute
                            bottom-6
                            left-[30px]
                            top-6
                            hidden
                            w-px
                            bg-gradient-to-b
                            from-[var(--primary)]
                            via-[var(--outline-variant)]
                            to-transparent
                            sm:block
                        "
                                    />


                                    <div
                                        className="
                            grid
                            gap-2
                        "
                                    >

                                        {recentActivity.map(
                                            (item, index) => {

                                                const Icon = item.icon;

                                                return (

                                                    <div
                                                        key={`${item.type}-${index}`}
                                                        className="
                                            group
                                            relative
                                            flex
                                            items-start
                                            gap-4
                                            rounded-2xl
                                            border
                                            border-transparent
                                            p-3
                                            transition-all
                                            duration-200
                                            hover:border-[var(--outline-variant)]
                                            hover:bg-[var(--surface-container-low)]
                                        "
                                                    >

                                                        {/* Timeline node */}

                                                        <div
                                                            className="
                                                relative
                                                z-10
                                                flex
                                                h-10
                                                w-10
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-[var(--outline-variant)]
                                                bg-[var(--surface)]
                                                text-[var(--primary)]
                                                shadow-[0_2px_8px_rgba(85,98,77,0.04)]
                                                transition-all
                                                duration-200
                                                group-hover:border-[var(--primary)]
                                                group-hover:bg-[var(--primary-container)]
                                                group-hover:text-[var(--on-primary-container)]
                                            "
                                                        >
                                                            <Icon size={17} />
                                                        </div>


                                                        {/* Activity content */}

                                                        <div
                                                            className="
                                                min-w-0
                                                flex-1
                                                pt-0.5
                                            "
                                                        >

                                                            <div
                                                                className="
                                                    flex
                                                    flex-col
                                                    gap-1
                                                    sm:flex-row
                                                    sm:items-center
                                                    sm:justify-between
                                                    sm:gap-4
                                                "
                                                            >

                                                                <p
                                                                    className="
                                                        truncate
                                                        text-sm
                                                        font-bold
                                                        text-[var(--on-surface)]
                                                    "
                                                                >
                                                                    {item.title}
                                                                </p>


                                                                <span
                                                                    className="
                                                        shrink-0
                                                        text-[10px]
                                                        font-medium
                                                        text-[var(--on-surface-variant)]
                                                    "
                                                                >
                                                                    {getTimeAgo(
                                                                        item.date
                                                                    )}
                                                                </span>

                                                            </div>


                                                            <p
                                                                className="
                                                    mt-1
                                                    line-clamp-2
                                                    text-xs
                                                    leading-5
                                                    text-[var(--on-surface-variant)]
                                                "
                                                            >
                                                                {item.description}
                                                            </p>

                                                        </div>

                                                    </div>

                                                );
                                            }
                                        )}

                                    </div>

                                </div>

                            )}

                        </div>

                    </div>

                </section>


                {/* ==================================================
    QUICK ACTIONS
================================================== */}

                <section className="mt-8">

                    {/* ------------------------------------------------
        SECTION HEADER
    ------------------------------------------------ */}

                    <div
                        className="
            mb-5
            flex
            flex-col
            gap-1
        "
                    >

                        <p
                            className="
                text-[10px]
                font-bold
                uppercase
                tracking-[0.16em]
                text-[var(--primary)]
            "
                        >
                            Quick actions
                        </p>


                        <h2
                            className="
                text-xl
                font-bold
                tracking-tight
                text-[var(--on-surface)]
                sm:text-2xl
            "
                            style={{
                                fontFamily:
                                    "var(--font-heading)",
                            }}
                        >
                            What would you like to work on?
                        </h2>


                        <p
                            className="
                mt-1
                max-w-2xl
                text-xs
                leading-5
                text-[var(--on-surface-variant)]
                sm:text-sm
                sm:leading-6
            "
                        >
                            Jump directly into the part of your career
                            workflow that needs your attention.
                        </p>

                    </div>


                    {/* ------------------------------------------------
        ACTION GRID
    ------------------------------------------------ */}

                    <div
                        className="
            grid
            gap-3
            sm:grid-cols-2
            xl:grid-cols-4
        "
                    >

                        {[
                            {
                                icon: UserRound,
                                title: "Update profile",
                                description:
                                    "Keep your skills, experience and career goals current.",
                                to: "/career-profile",
                                eyebrow: "Profile",
                                action: "Manage profile",
                            },

                            {
                                icon: BriefcaseBusiness,
                                title: "Add a job",
                                description:
                                    "Create a workspace around a role you want to pursue.",
                                to: "/job-workspaces",
                                eyebrow: "Opportunity",
                                action: "Add opportunity",
                            },

                            {
                                icon: Target,
                                title: "Prepare",
                                description:
                                    "Turn your target role into a focused preparation plan.",
                                to: "/preparation",
                                eyebrow: "Preparation",
                                action: "Open preparation",
                            },

                            {
                                icon: Video,
                                title: "Practice",
                                description:
                                    "Run an AI interview simulation and improve your answers.",
                                to: "/interviews",
                                eyebrow: "Interview",
                                action: "Start practice",
                            },

                        ].map((action) => {

                            const Icon = action.icon;

                            return (

                                <Link
                                    key={action.title}
                                    to={action.to}
                                    className="
                        group
                        relative
                        flex
                        min-h-[225px]
                        flex-col
                        overflow-hidden
                        rounded-[1.5rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        p-5
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-[var(--primary)]
                        hover:shadow-[0_16px_40px_rgba(85,98,77,0.10)]
                    "
                                >

                                    {/* Decorative background */}

                                    <div
                                        className="
                            pointer-events-none
                            absolute
                            -right-14
                            -top-14
                            h-32
                            w-32
                            rounded-full
                            bg-[var(--primary-container)]
                            opacity-0
                            blur-3xl
                            transition-all
                            duration-500
                            group-hover:opacity-40
                        "
                                    />


                                    {/* Top row */}

                                    <div
                                        className="
                            relative
                            flex
                            items-start
                            justify-between
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
                                bg-[var(--surface-container)]
                                text-[var(--primary)]
                                transition-all
                                duration-300
                                group-hover:bg-[var(--primary-container)]
                                group-hover:text-[var(--on-primary-container)]
                            "
                                        >
                                            <Icon size={19} />
                                        </div>


                                        <div
                                            className="
                                flex
                                h-8
                                w-8
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-[var(--outline-variant)]
                                text-[var(--on-surface-variant)]
                                transition-all
                                duration-300
                                group-hover:border-[var(--primary)]
                                group-hover:bg-[var(--primary)]
                                group-hover:text-[var(--on-primary)]
                            "
                                        >
                                            <ArrowUpRight
                                                size={15}
                                            />
                                        </div>

                                    </div>


                                    {/* Content */}

                                    <div className="relative mt-5">

                                        <p
                                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.13em]
                                text-[var(--primary)]
                            "
                                        >
                                            {action.eyebrow}
                                        </p>


                                        <h3
                                            className="
                                mt-1.5
                                text-base
                                font-bold
                                text-[var(--on-surface)]
                            "
                                            style={{
                                                fontFamily:
                                                    "var(--font-heading)",
                                            }}
                                        >
                                            {action.title}
                                        </h3>


                                        <p
                                            className="
                                mt-2
                                text-xs
                                leading-5
                                text-[var(--on-surface-variant)]
                            "
                                        >
                                            {action.description}
                                        </p>

                                    </div>


                                    {/* Bottom CTA */}

                                    <div
                                        className="
                            relative
                            mt-auto
                            flex
                            items-center
                            justify-between
                            pt-5
                        "
                                    >

                                        <span
                                            className="
                                text-xs
                                font-bold
                                text-[var(--primary)]
                            "
                                        >
                                            {action.action}
                                        </span>


                                        <ArrowRight
                                            size={15}
                                            className="
                                text-[var(--primary)]
                                transition-transform
                                duration-300
                                group-hover:translate-x-1
                            "
                                        />

                                    </div>

                                </Link>

                            );

                        })}

                    </div>

                </section>


                {/* ==================================================
    BOTTOM COACH PROMPT
================================================== */}

                <section className="mt-8">

                    <div
                        className="
            group
            relative
            overflow-hidden
            rounded-[1.75rem]
            border
            border-[var(--outline-variant)]
           bg-[var(--surface-container-lowest)]
            p-5
            sm:p-6
            lg:p-7
        "
                    >

                        {/* ==================================================
            DECORATIVE BACKGROUND
        ================================================== */}

                        <div
                            className="
                pointer-events-none
                absolute
                -right-20
                -top-24
                h-64
                w-64
                rounded-full
                bg-[var(--primary-container)]
                opacity-[0.12]
                blur-3xl
            "
                        />

                        <div
                            className="
                pointer-events-none
                absolute
                -bottom-20
                left-1/3
                h-48
                w-48
                rounded-full
                bg-[var(--secondary-container)]
                opacity-[0.08]
                blur-3xl
            "
                        />


                        <div
                            className="
                relative
                flex
                flex-col
                gap-6
                lg:flex-row
                lg:items-center
                lg:justify-between
            "
                        >

                            {/* ==================================================
                COACH INTRO
            ================================================== */}

                            <div
                                className="
                    flex
                    min-w-0
                    items-start
                    gap-4
                "
                            >

                                {/* Coach icon */}

                                <div
                                    className="
                        relative
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[var(--primary)]
                        text-[var(--on-primary)]
                        shadow-[0_6px_18px_rgba(62,74,55,0.18)]
                    "
                                >

                                    <MessageCircle
                                        size={21}
                                    />

                                    {/* Online indicator */}

                                    <span
                                        className="
                            absolute
                            -bottom-0.5
                            -right-0.5
                            h-3
                            w-3
                            rounded-full
                            border-2
                            border-[var(--surface)]
                            bg-[var(--primary)]
                        "
                                    />

                                </div>


                                {/* Text */}

                                <div className="min-w-0">

                                    <div
                                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-2
                        "
                                    >

                                        <p
                                            className="
                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-[var(--primary)]
                            "
                                        >
                                            AI Career Coach
                                        </p>


                                        <span
                                            className="
                                rounded-full
                                bg-[var(--primary-container)]
                                px-2
                                py-0.5
                                text-[9px]
                                font-bold
                                text-[var(--on-primary-container)]
                            "
                                        >
                                            READY
                                        </span>

                                    </div>


                                    <h2
                                        className="
                            mt-1.5
                            text-lg
                            font-bold
                            tracking-tight
                            text-[var(--on-surface)]
                            sm:text-xl
                        "
                                        style={{
                                            fontFamily:
                                                "var(--font-heading)",
                                        }}
                                    >
                                        Not sure what to work on next?
                                    </h2>


                                    <p
                                        className="
                            mt-1.5
                            max-w-xl
                            text-xs
                            leading-5
                            text-[var(--on-surface-variant)]
                            sm:text-sm
                            sm:leading-6
                        "
                                    >
                                        Tell your Career Coach what you're
                                        trying to achieve and get a
                                        personalized next step.
                                    </p>

                                </div>

                            </div>


                            {/* ==================================================
                PROMPTS + CTA
            ================================================== */}

                            <div
                                className="
                    flex
                    flex-col
                    gap-3
                    lg:max-w-[620px]
                    lg:items-end
                "
                            >

                                {/* Prompt chips */}

                                <div
                                    className="
                        flex
                        flex-wrap
                        gap-2
                        lg:justify-end
                    "
                                >

                                    {[
                                        {
                                            label:
                                                "I have an interview soon",
                                            icon:
                                                CalendarDays,
                                        },

                                        {
                                            label:
                                                "I need a better resume",
                                            icon:
                                                FileText,
                                        },

                                        {
                                            label:
                                                "What should I do next?",
                                            icon:
                                                Compass,
                                        },
                                    ].map((prompt) => {

                                        const Icon =
                                            prompt.icon;

                                        return (

                                            <Link
                                                key={prompt.label}
                                                to="/career-coach"
                                                className="
                                    group/prompt
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-low)]
                                    px-3
                                    py-2
                                    text-[11px]
                                    font-semibold
                                    text-[var(--on-surface)]
                                    transition-all
                                    duration-200
                                    hover:border-[var(--primary)]
                                    hover:bg-[var(--primary-container)]
                                    hover:text-[var(--on-primary-container)]
                                "
                                            >

                                                <Icon
                                                    size={13}
                                                    className="
                                        text-[var(--primary)]
                                        transition
                                        group-hover/prompt:text-[var(--on-primary-container)]
                                    "
                                                />

                                                {prompt.label}

                                            </Link>

                                        );

                                    })}

                                </div>


                                {/* Main CTA */}

                                <Link
                                    to="/career-coach"
                                    className="
                        inline-flex
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-[var(--primary)]
                        px-5
                        py-3
                        text-xs
                        font-bold
                        shadow-[0_5px_16px_rgba(62,74,55,0.14)]
                        transition-all
                        duration-200
                        hover:-translate-y-0.5
                        hover:bg-[var(--primary-container)]
                        hover:shadow-[0_8px_22px_rgba(62,74,55,0.18)]
                        sm:w-fit
                    "
                                >
                                    <span className="text-[var(--on-primary)]">

                                        Open Career Coach
                                    </span>

                                    <ArrowRight
                                        size={15}
                                        className="
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                            text-[var(--on-primary)]
                        "
                                    />

                                </Link>

                            </div>

                        </div>


                        {/* ==================================================
            BOTTOM MICRO COPY
        ================================================== */}

                        <div
                            className="
                relative
                mt-5
                flex
                flex-wrap
                items-center
                gap-x-5
                gap-y-2
                border-t
                border-[var(--outline-variant)]
                pt-4
            "
                        >

                            <div
                                className="
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    font-medium
                    text-[var(--on-surface-variant)]
                "
                            >
                                <Sparkles
                                    size={13}
                                    className="text-[var(--primary)]"
                                />

                                Personalized guidance
                            </div>


                            <div
                                className="
                    h-1
                    w-1
                    rounded-full
                    bg-[var(--outline)]
                "
                            />


                            <div
                                className="
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    font-medium
                    text-[var(--on-surface-variant)]
                "
                            >
                                <Target
                                    size={13}
                                    className="text-[var(--primary)]"
                                />

                                Based on your career goals
                            </div>


                            <div
                                className="
                    h-1
                    w-1
                    rounded-full
                    bg-[var(--outline)]
                "
                            />


                            <div
                                className="
                    flex
                    items-center
                    gap-2
                    text-[10px]
                    font-medium
                    text-[var(--on-surface-variant)]
                "
                            >
                                <ArrowUpRight
                                    size={13}
                                    className="text-[var(--primary)]"
                                />

                                Turn advice into action
                            </div>

                        </div>

                    </div>

                </section>

            </div>

        </div>
    );
};



/* =========================================================
   DASHBOARD STAT CARD
========================================================= */

const DashboardStatCard = ({
    icon: Icon,
    iconStyle = "sage",
    label,
    value,
    description,
    secondary,
    progress = 0,
    progressLabel,
    to,
}) => {

    const iconStyles = {
        sage: {
            background:
                "var(--primary-fixed)",
            color:
                "var(--on-primary-fixed-variant)",
        },

        blush: {
            background:
                "var(--secondary-container)",
            color:
                "var(--secondary)",
        },

        neutral: {
            background:
                "var(--surface-container)",
            color:
                "var(--on-surface-variant)",
        },
    };

    const safeProgress = Math.max(
        0,
        Math.min(100, Number(progress) || 0)
    );

    return (
        <Link
            to={to}
            className="
                group
                relative
                overflow-hidden
                rounded-[1.4rem]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                p-5
                shadow-[var(--shadow-sm)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:border-[var(--outline)]
                hover:shadow-[var(--shadow-md)]
            "
        >

            {/* Decorative background */}
            <div
                className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-28
                    w-28
                    rounded-full
                    bg-[var(--primary-fixed)]
                    opacity-20
                    blur-2xl
                    transition
                    duration-500
                    group-hover:scale-125
                    group-hover:opacity-30
                "
            />


            {/* =================================================
                TOP
            ================================================= */}

            <div
                className="
                    relative
                    flex
                    items-start
                    justify-between
                "
            >

                {/* Icon */}
                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl
                    "
                    style={
                        iconStyles[iconStyle] ||
                        iconStyles.sage
                    }
                >
                    <Icon size={18} strokeWidth={2} />
                </div>


                {/* Arrow */}
                <div
                    className="
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        text-[var(--on-surface-variant)]
                        transition-all
                        duration-300
                        group-hover:bg-[var(--surface-container)]
                        group-hover:text-[var(--primary)]
                    "
                >
                    <ArrowUpRight
                        size={16}
                        className="
                            transition
                            duration-300
                            group-hover:-translate-y-0.5
                            group-hover:translate-x-0.5
                        "
                    />
                </div>

            </div>


            {/* =================================================
                VALUE
            ================================================= */}

            <div className="relative mt-5">

                <p
                    className="
                        text-3xl
                        font-extrabold
                        tracking-tight
                        text-[var(--on-surface)]
                        sm:text-[2rem]
                    "
                    style={{
                        fontFamily:
                            "var(--font-heading)",
                    }}
                >
                    {value}
                </p>

                <p
                    className="
                        mt-1
                        text-sm
                        font-semibold
                        text-[var(--on-surface)]
                    "
                >
                    {label}
                </p>

            </div>


            {/* =================================================
                DESCRIPTION
            ================================================= */}

            <p
                className="
                    relative
                    mt-2
                    min-h-[40px]
                    text-xs
                    leading-5
                    text-[var(--on-surface-variant)]
                "
            >
                {description}
            </p>


            {/* =================================================
                PROGRESS
            ================================================= */}

            {progressLabel && (
                <div className="relative mt-4">

                    <div
                        className="
                            mb-1.5
                            flex
                            items-center
                            justify-between
                        "
                    >

                        <span
                            className="
                                text-[10px]
                                font-medium
                                text-[var(--on-surface-variant)]
                            "
                        >
                            {progressLabel}
                        </span>

                        <span
                            className="
                                text-[10px]
                                font-bold
                                text-[var(--on-surface)]
                            "
                        >
                            {safeProgress}%
                        </span>

                    </div>


                    <div
                        className="
                            h-1.5
                            overflow-hidden
                            rounded-full
                            bg-[var(--surface-container-high)]
                        "
                    >
                        <div
                            className="
                                h-full
                                rounded-full
                                bg-[var(--primary)]
                                transition-all
                                duration-700
                            "
                            style={{
                                width: `${safeProgress}%`,
                            }}
                        />
                    </div>

                </div>
            )}


            {/* =================================================
                FOOTER
            ================================================= */}

            <div
                className="
                    relative
                    mt-5
                    flex
                    items-center
                    justify-between
                    border-t
                    border-[var(--outline-variant)]
                    pt-3.5
                "
            >

                <span
                    className="
                        truncate
                        pr-3
                        text-[11px]
                        font-medium
                        text-[var(--on-surface-variant)]
                    "
                >
                    {secondary}
                </span>

                <ArrowRight
                    size={14}
                    className="
                        shrink-0
                        text-[var(--on-surface-variant)]
                        transition
                        duration-300
                        group-hover:translate-x-1
                        group-hover:text-[var(--primary)]
                    "
                />

            </div>

        </Link>
    );
};


// ============================================================
// SMALL SEND ICON ALIAS
// ============================================================

const SendIcon = (props) => (
    <Zap {...props} />
);


export default Dashboard;