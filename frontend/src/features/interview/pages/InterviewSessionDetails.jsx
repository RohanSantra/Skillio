import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    Brain,
    BriefcaseBusiness,
    Check,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    ClipboardCheck,
    Clock3,
    Code2,
    Lightbulb,
    ListChecks,
    LoaderCircle,
    MessageSquareText,
    Play,
    RotateCcw,
    Sparkles,
    Target,
    Trophy,
    Zap,
} from "lucide-react";

import useInterviewSession
    from "../hooks/useInterviewSession.js";
import ErrorToast from "../../../components/feedback/ErrorToast.jsx";


/* =========================================================
   HELPERS
========================================================= */

const EMPTY_ARRAY = [];


/* ---------------------------------------------------------
   Session
--------------------------------------------------------- */

function getQuestions(session) {
    return Array.isArray(session?.questions)
        ? session.questions
        : EMPTY_ARRAY;
}


/* ---------------------------------------------------------
   Question text
--------------------------------------------------------- */

function getQuestionText(question) {
    return (
        question?.question ||
        question?.questionText ||
        question?.text ||
        ""
    );
}


/* ---------------------------------------------------------
   USER ANSWER
   Your backend uses userAnswer
--------------------------------------------------------- */

function getAnswerText(question) {
    return (
        question?.userAnswer ||
        ""
    );
}


/* ---------------------------------------------------------
   FEEDBACK
--------------------------------------------------------- */

function getFeedback(question) {
    return (
        question?.feedback ||
        question?.evaluation?.feedback ||
        question?.evaluation?.summary ||
        question?.aiEvaluation?.feedback ||
        ""
    );
}


/* ---------------------------------------------------------
   SCORE
--------------------------------------------------------- */

function normalizeScore(score) {
 if (
        score === null ||
        score === undefined ||
        score === ""
    ) {
        return null;
    }

    const numericScore = Number(score);

    if (Number.isNaN(numericScore)) {
        return null;
    }

    return numericScore / 10;
}


function getQuestionScore(question) {
    return normalizeScore(
        question?.score ??
        question?.evaluation?.score ??
        question?.evaluation?.overallScore ??
        question?.aiEvaluation?.score
    );
}


/* ---------------------------------------------------------
   Evaluation
--------------------------------------------------------- */

function hasEvaluation(question) {
    const score = getQuestionScore(question);
    const feedback = getFeedback(question);

    return (
        score !== null ||
        Boolean(feedback)
    );
}


/* ---------------------------------------------------------
   Question status
--------------------------------------------------------- */

function getQuestionStatus(question) {
    if (hasEvaluation(question)) {
        return "evaluated";
    }

    if (
        getAnswerText(question)
            .trim()
            .length > 0
    ) {
        return "answered";
    }

    return "pending";
}


/* ---------------------------------------------------------
   Humanize
--------------------------------------------------------- */

function humanize(value = "") {
    return String(value)
        .replace(/([A-Z])/g, " $1")
        .replace(/[-_]/g, " ")
        .replace(/^./, (character) =>
            character.toUpperCase()
        );
}


/* ---------------------------------------------------------
   Date
--------------------------------------------------------- */

function formatDate(date) {
    if (!date) {
        return null;
    }

    try {
        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        ).format(new Date(date));
    } catch {
        return null;
    }
}


/* ---------------------------------------------------------
   Arrays
--------------------------------------------------------- */

function getArray(value) {
    if (!value) {
        return EMPTY_ARRAY;
    }

    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}


/* =========================================================
   SCORE RING
========================================================= */

function ScoreRing({
    score = 0,
    size = 140,
    strokeWidth = 11,
}) {
    const normalizedScore =
        Math.max(
            0,
            Math.min(
                10,
                Number(score) || 0
            )
        );

    const radius =
        (size - strokeWidth) / 2;

    const circumference =
        2 * Math.PI * radius;

    const offset =
        circumference -
        (normalizedScore / 10) *
        circumference;

    return (
        <div
            className="
                relative
                flex
                shrink-0
                items-center
                justify-center
            "
            style={{
                width: size,
                height: size,
            }}
        >
            <svg
                width={size}
                height={size}
                className="-rotate-90"
            >
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(255,255,255,0.14)"
                    strokeWidth={strokeWidth}
                />

                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="white"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition:
                            "stroke-dashoffset 700ms ease",
                    }}
                />
            </svg>

            <div
                className="
                    absolute
                    text-center
                    text-white
                "
            >
                <p
                    className="
                        text-3xl
                        font-extrabold
                        tracking-tight
                    "
                >
                    {normalizedScore.toFixed(1)}
                </p>

                <p
                    className="
                        mt-0.5
                        text-xs
                        font-semibold
                        text-white/60
                    "
                >
                    / 10
                </p>
            </div>
        </div>
    );
}


/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
    label,
    score,
    icon: Icon,
}) {
    const normalizedScore =
        normalizeScore(score);

    const percentage =
        normalizedScore !== null
            ? Math.min(
                100,
                Math.max(
                    0,
                    normalizedScore * 10
                )
            )
            : 0;

    return (
        <div
            className="
                rounded-2xl
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-low)]
                p-5
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
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
                        text-[var(--primary)]
                    "
                >
                    <Icon size={19} />
                </div>

                <div className="text-right">
                    <p
                        className="
                            text-xl
                            font-extrabold
                            text-[var(--on-surface)]
                        "
                    >
                        {
                            normalizedScore !== null
                                ? normalizedScore.toFixed(1)
                                : "—"
                        }
                    </p>

                    <p
                        className="
                            text-xs
                            text-[var(--on-surface-variant)]
                        "
                    >
                        / 10
                    </p>
                </div>
            </div>

            <p
                className="
                    mt-5
                    text-sm
                    font-bold
                    text-[var(--on-surface)]
                "
            >
                {label}
            </p>

            <div
                className="
                    mt-3
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
                        width: `${percentage}%`,
                    }}
                />
            </div>
        </div>
    );
}


/* =========================================================
   INSIGHT LIST
========================================================= */

function InsightList({
    title,
    items,
    icon: Icon,
    positive = false,
}) {
    const list = getArray(items);

    return (
        <div
            className={`
                rounded-[1.5rem]
                border
                p-6

                ${positive
                    ? `
                            border-[var(--primary-fixed-dim)]
                            bg-[var(--primary-fixed)]
                        `
                    : `
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-low)]
                        `
                }
            `}
        >
            <div
                className="
                    flex
                    items-center
                    gap-3
                "
            >
                <div
                    className={`
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-xl

                        ${positive
                            ? `
                                    bg-[var(--primary)]
                                    text-white
                                `
                            : `
                                    bg-[var(--secondary-container)]
                                    text-[var(--on-secondary-container)]
                                `
                        }
                    `}
                >
                    <Icon size={19} />
                </div>

                <h3
                    className="
                        text-base
                        font-extrabold
                        text-[var(--on-surface)]
                    "
                >
                    {title}
                </h3>
            </div>

            {list.length > 0 ? (
                <div
                    className="
                        mt-5
                        space-y-3
                    "
                >
                    {list.map(
                        (item, index) => (
                            <div
                                key={index}
                                className="
                                    flex
                                    items-start
                                    gap-3
                                "
                            >
                                {positive ? (
                                    <CheckCircle2
                                        size={17}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-[var(--primary)]
                                        "
                                    />
                                ) : (
                                    <Target
                                        size={17}
                                        className="
                                            mt-0.5
                                            shrink-0
                                            text-[var(--secondary)]
                                        "
                                    />
                                )}

                                <p
                                    className="
                                        text-sm
                                        leading-6
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    {
                                        typeof item === "object"
                                            ? (
                                                item?.text ||
                                                item?.title ||
                                                item?.description ||
                                                JSON.stringify(item)
                                            )
                                            : item
                                    }
                                </p>
                            </div>
                        )
                    )}
                </div>
            ) : (
                <p
                    className="
                        mt-5
                        text-sm
                        leading-6
                        text-[var(--on-surface-variant)]
                    "
                >
                    No insights available yet.
                </p>
            )}
        </div>
    );
}


/* =========================================================
   LOADING
========================================================= */

function PageLoading() {
    return (
        <div
            className="
                min-h-screen
                bg-[var(--background)]
                px-4
                py-6
                sm:px-6
                lg:px-8
            "
        >
            <div
                className="
                    mx-auto
                    max-w-7xl
                    animate-pulse
                    space-y-6
                "
            >
                <div
                    className="
                        h-72
                        rounded-[2rem]
                        bg-[var(--surface-container-high)]
                    "
                />

                <div
                    className="
                        grid
                        gap-6
                        lg:grid-cols-[280px_1fr]
                    "
                >
                    <div
                        className="
                            h-[520px]
                            rounded-[2rem]
                            bg-[var(--surface-container-high)]
                        "
                    />

                    <div
                        className="
                            h-[520px]
                            rounded-[2rem]
                            bg-[var(--surface-container-high)]
                        "
                    />
                </div>
            </div>
        </div>
    );
}


/* =========================================================
   ERROR
========================================================= */

function PageError({
    message,
    onBack,
    onRetry,
}) {
    return (
        <div
            className="
                flex
                min-h-[70vh]
                items-center
                justify-center
                px-4
            "
        >
            <div
                className="
                    w-full
                    max-w-md
                    rounded-[2rem]
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-lowest)]
                    p-8
                    text-center
                    shadow-[var(--shadow-md)]
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
                        rounded-3xl
                        bg-[var(--error-container)]
                        text-[var(--on-error-container)]
                    "
                >
                    <CircleAlert size={30} />
                </div>

                <h1
                    className="
                        mt-6
                        text-2xl
                        font-extrabold
                        text-[var(--on-surface)]
                    "
                >
                    Unable to load interview
                </h1>

                <p
                    className="
                        mt-3
                        text-sm
                        leading-6
                        text-[var(--on-surface-variant)]
                    "
                >
                    {message}
                </p>

                <div
                    className="
                        mt-7
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                    "
                >
                    <button
                        type="button"
                        onClick={onBack}
                        className="
                            inline-flex
                            min-h-12
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-lowest)]
                            px-5
                            text-sm
                            font-bold
                            text-[var(--on-surface)]
                        "
                    >
                        <ArrowLeft size={17} />
                        Back
                    </button>

                    <button
                        type="button"
                        onClick={onRetry}
                        className="
                            inline-flex
                            min-h-12
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[var(--primary)]
                            px-5
                            text-sm
                            font-bold
                            text-white
                        "
                    >
                        <RotateCcw size={17} />
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
}


/* =========================================================
   MAIN COMPONENT
========================================================= */

function InterviewSessionDetails() {
    const navigate = useNavigate();

    const { sessionId } =
        useParams();


    /* =====================================================
       STORE
    ===================================================== */

    const {
        currentInterviewSession,
        isLoading,
        error,

        clearError,

        getInterviewSession,

        updateInterviewQuestion,

        evaluateInterviewAnswer,

        completeInterviewSession,
    } = useInterviewSession();


    /* =====================================================
       LOCAL UI STATE
    ===================================================== */

    const [
        activeQuestionIndex,
        setActiveQuestionIndex,
    ] = useState(0);

    const [
        answer,
        setAnswer,
    ] = useState("");

    const [
        isSaving,
        setIsSaving,
    ] = useState(false);

    const [
        isEvaluating,
        setIsEvaluating,
    ] = useState(false);

    const [
        isCompleting,
        setIsCompleting,
    ] = useState(false);

    const [
        hasStartedInterview,
        setHasStartedInterview,
    ] = useState(false);


    /* =====================================================
       LOAD SESSION
    ===================================================== */

    useEffect(() => {
        if (!sessionId) {
            return;
        }

        getInterviewSession(sessionId)
            .catch(() => { });
    }, [
        sessionId,
        getInterviewSession,
    ]);


    /* =====================================================
       SESSION DATA
    ===================================================== */

    const interviewSession =
        currentInterviewSession;

    const questions =
        useMemo(
            () => getQuestions(interviewSession),
            [interviewSession]
        );


    const activeQuestion =
        questions[
        activeQuestionIndex
        ] || null;


    /* =====================================================
       SYNC ACTIVE ANSWER
    ===================================================== */

    useEffect(() => {
        if (!activeQuestion) {
            setAnswer("");
            return;
        }

        setAnswer(
            getAnswerText(
                activeQuestion
            )
        );
    }, [
        activeQuestionIndex,
        activeQuestion,
    ]);


    /* =====================================================
       STATISTICS
    ===================================================== */

    const statistics =
        useMemo(() => {
            const total =
                questions.length;

            const answered =
                questions.filter(
                    (question) =>
                        Boolean(
                            getAnswerText(
                                question
                            ).trim()
                        )
                ).length;

            const evaluated =
                questions.filter(
                    (question) =>
                        hasEvaluation(
                            question
                        )
                ).length;

            const progress =
                total > 0
                    ? Math.round(
                        (evaluated / total) *
                        100
                    )
                    : 0;

            return {
                total,
                answered,
                evaluated,
                progress,
            };
        }, [
            questions,
        ]);


    /* =====================================================
       ACTIVE QUESTION DATA
    ===================================================== */

    const activeScore =
        getQuestionScore(
            activeQuestion
        );

    const activeFeedback =
        getFeedback(
            activeQuestion
        );


    /* =====================================================
       STATUS
    ===================================================== */

    const sessionStatus =
        String(
            interviewSession?.status || ""
        ).toLowerCase();

    const isCompleted =
        sessionStatus === "completed" ||
        sessionStatus === "complete";


    /* =====================================================
       EXISTING PROGRESS
    ===================================================== */

    const hasExistingProgress =
        Boolean(
            interviewSession?.startedAt
        ) ||
        statistics.answered > 0 ||
        statistics.evaluated > 0;

    const isInterviewStarted =
        hasStartedInterview ||
        hasExistingProgress;


    /* =====================================================
       START INTERVIEW
    ===================================================== */

    const handleStartInterview =
        async () => {

            setHasStartedInterview(
                true
            );

            /*
             * startedAt/status are optional from
             * the UI perspective.
             *
             * If your backend accepts these fields,
             * persist them.
             */

            try {
                await getInterviewSession(
                    sessionId
                );
            } catch {
                // Interview can continue locally.
            }
        };


    /* =====================================================
       SAVE ANSWER
    ===================================================== */

    const handleSaveAnswer =
        async () => {

            if (
                !activeQuestion ||
                !answer.trim()
            ) {
                return;
            }

            const questionId =
                activeQuestion?._id;

            if (!questionId) {
                return;
            }

            try {
                setIsSaving(true);

                clearError();

                /*
                 * IMPORTANT:
                 *
                 * Your question object uses:
                 *
                 * userAnswer
                 *
                 * NOT:
                 *
                 * answer
                 */

                await updateInterviewQuestion(
                    sessionId,
                    questionId,
                    {
                        userAnswer:
                            answer.trim(),
                    }
                );

            } catch {
                // Store already handles the error.
            } finally {
                setIsSaving(false);
            }
        };


    /* =====================================================
       EVALUATE ANSWER
    ===================================================== */

    const handleEvaluateAnswer =
        async () => {

            if (
                !activeQuestion ||
                !answer.trim()
            ) {
                return;
            }

            const questionId =
                activeQuestion?._id;

            if (!questionId) {
                return;
            }

            try {
                setIsEvaluating(true);

                clearError();

                /*
                 * First save the exact answer
                 * to userAnswer.
                 */

                await updateInterviewQuestion(
                    sessionId,
                    questionId,
                    {
                        userAnswer:
                            answer.trim(),
                    }
                );

                /*
                 * Then ask the backend AI
                 * to evaluate that answer.
                 */

                await evaluateInterviewAnswer(
                    sessionId,
                    questionId,
                    {
                        userAnswer:
                            answer.trim(),
                    }
                );

            } catch {
                // Store exposes the error.
            } finally {
                setIsEvaluating(false);
            }
        };


    /* =====================================================
       NAVIGATION
    ===================================================== */

    const goToQuestion =
        (index) => {

            if (
                index < 0 ||
                index >= questions.length
            ) {
                return;
            }

            setActiveQuestionIndex(
                index
            );
        };


    const goPrevious =
        () => {
            goToQuestion(
                activeQuestionIndex - 1
            );
        };


    const goNext =
        () => {
            goToQuestion(
                activeQuestionIndex + 1
            );
        };


    /* =====================================================
       COMPLETE INTERVIEW
    ===================================================== */

    const handleCompleteInterview =
        async () => {

            if (
                statistics.total === 0 ||
                statistics.evaluated <
                statistics.total
            ) {
                return;
            }

            try {
                setIsCompleting(true);

                clearError();

                await completeInterviewSession(
                    sessionId
                );

            } catch {
                // Store handles error.
            } finally {
                setIsCompleting(false);
            }
        };


    /* =====================================================
       FINAL REPORT
    ===================================================== */

    const finalReport =
        interviewSession?.report ||
        null;


    const overallScore =
        normalizeScore(
            interviewSession?.score
        );


    /* =====================================================
       LOADING
    ===================================================== */

    if (
        isLoading &&
        !interviewSession
    ) {
        return <PageLoading />;
    }


    /* =====================================================
       ERROR
    ===================================================== */

    if (
        error &&
        !interviewSession
    ) {
        return (
            <PageError
                message={error}
                onBack={() =>
                    navigate(
                        "/interviews"
                    )
                }
                onRetry={() =>
                    getInterviewSession(
                        sessionId
                    )
                }
            />
        );
    }


    /* =====================================================
       EMPTY
    ===================================================== */

    if (!interviewSession) {
        return (
            <PageError
                message="This interview session could not be found."
                onBack={() =>
                    navigate(
                        "/interviews"
                    )
                }
                onRetry={() =>
                    getInterviewSession(
                        sessionId
                    )
                }
            />
        );
    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (
        <div
            className="
                min-h-screen
                bg-[var(--background)]
            "
        >
            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-6
                    sm:px-6
                    sm:py-8
                    lg:px-8
                    lg:py-10
                "
            >

                {/* =================================================
                    BACK
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/interviews"
                        )
                    }
                    className="
                        mb-6
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-bold
                        text-[var(--on-surface-variant)]
                        transition
                        hover:text-[var(--primary)]
                    "
                >
                    <ArrowLeft size={17} />

                    Back to Interviews
                </button>


                {/* =================================================
                    HERO
                ================================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-[2rem]
                        bg-[var(--primary)]
                        p-6
                        text-white
                        shadow-[var(--shadow-lg)]
                        sm:p-8
                        lg:p-10
                    "
                >

                    <div
                        className="
                            absolute
                            -right-20
                            -top-20
                            h-72
                            w-72
                            rounded-full
                            bg-white/5
                        "
                    />

                    <div
                        className="
                            absolute
                            -bottom-32
                            left-1/3
                            h-72
                            w-72
                            rounded-full
                            bg-white/5
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            flex-col
                            gap-8
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >

                        <div
                            className="
                                max-w-3xl
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-3
                                "
                            >

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        bg-white/10
                                        px-4
                                        py-2
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-[0.14em]
                                        text-white/75
                                    "
                                >
                                    <Brain size={15} />

                                    AI Interview
                                </span>


                                <span
                                    className="
                                        rounded-full
                                        bg-white/10
                                        px-4
                                        py-2
                                        text-xs
                                        font-bold
                                        capitalize
                                        text-white/75
                                    "
                                >
                                    {humanize(
                                        interviewSession?.status ||
                                        (
                                            isInterviewStarted
                                                ? "in-progress"
                                                : "ready"
                                        )
                                    )}
                                </span>

                            </div>


                            <h1
                                className="
                                    mt-6
                                    text-3xl
                                    font-extrabold
                                    leading-tight
                                    tracking-[-0.035em]
                                    sm:text-4xl
                                    lg:text-5xl
                                "
                            >
                                {
                                    interviewSession?.title ||
                                    interviewSession?.jobTitle ||
                                    "Your AI Interview"
                                }
                            </h1>


                            <p
                                className="
                                    mt-5
                                    max-w-2xl
                                    text-base
                                    leading-7
                                    text-white/65
                                    sm:text-lg
                                "
                            >
                                {
                                    interviewSession?.description ||
                                    "Take one question at a time, receive intelligent feedback, and discover exactly where you can improve."
                                }
                            </p>


                            <div
                                className="
                                    mt-8
                                    flex
                                    flex-wrap
                                    gap-5
                                    text-sm
                                    text-white/70
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <MessageSquareText
                                        size={17}
                                    />

                                    {statistics.total} questions
                                </div>


                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <CheckCircle2
                                        size={17}
                                    />

                                    {statistics.evaluated} evaluated
                                </div>


                                {formatDate(
                                    interviewSession?.createdAt
                                ) && (
                                        <div
                                            className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                        >
                                            <Clock3
                                                size={17}
                                            />

                                            {formatDate(
                                                interviewSession?.createdAt
                                            )}
                                        </div>
                                    )}

                            </div>

                        </div>


                        {/* HERO SCORE */}

                        <div
                            className="
                                flex
                                flex-col
                                items-center
                                gap-4
                            "
                        >

                            {isCompleted ? (
                                <>
                                    <ScoreRing
                                        score={
                                            overallScore ?? 0
                                        }
                                    />

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.14em]
                                            text-white/50
                                        "
                                    >
                                        Final performance
                                    </p>
                                </>
                            ) : (
                                <>
                                    <div
                                        className="
                                            flex
                                            h-28
                                            w-28
                                            items-center
                                            justify-center
                                            rounded-full
                                            border
                                            border-white/15
                                            bg-white/5
                                        "
                                    >
                                        <Play
                                            size={32}
                                            className="text-white"
                                            fill="currentColor"
                                        />
                                    </div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.14em]
                                            text-white/50
                                        "
                                    >
                                        {
                                            isInterviewStarted
                                                ? "Interview in progress"
                                                : "Ready to begin"
                                        }
                                    </p>
                                </>
                            )}

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    uppercase
                                    tracking-[0.14em]
                                    text-white/50
                                "
                            >
                                Interview performance
                            </p>

                        </div>

                    </div>


                    {/* PROGRESS */}

                    <div
                        className="
                            relative
                            mt-10
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                text-xs
                                font-bold
                                text-white/60
                            "
                        >
                            <span>
                                Interview progress
                            </span>

                            <span>
                                {statistics.progress}%
                            </span>
                        </div>


                        <div
                            className="
                                mt-3
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
                                    bg-white
                                    transition-all
                                    duration-700
                                "
                                style={{
                                    width:
                                        `${statistics.progress}%`,
                                }}
                            />
                        </div>

                    </div>

                </section>


                {/* =================================================
                    ERROR BANNER
                ================================================= */}

                <ErrorToast error={error} />


                {/* =================================================
                    FINAL REPORT
                ================================================= */}

                {isCompleted &&
                    finalReport && (
                        <section
                            className="
                                mt-8
                                overflow-hidden
                                rounded-[2rem]
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface-container-lowest)]
                                shadow-[var(--shadow-md)]
                            "
                        >

                            <div
                                className="
                                    border-b
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-low)]
                                    px-6
                                    py-7
                                    sm:px-8
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-6
                                        sm:flex-row
                                        sm:items-center
                                        sm:justify-between
                                    "
                                >

                                    <div>

                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-full
                                                bg-[var(--primary-fixed)]
                                                px-3
                                                py-1.5
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.12em]
                                                text-[var(--primary)]
                                            "
                                        >
                                            <Sparkles
                                                size={14}
                                            />

                                            AI Final Report
                                        </span>


                                        <h2
                                            className="
                                                mt-4
                                                text-2xl
                                                font-extrabold
                                                tracking-tight
                                                text-[var(--on-surface)]
                                                sm:text-3xl
                                            "
                                        >
                                            Your interview performance
                                        </h2>


                                        <p
                                            className="
                                                mt-3
                                                max-w-2xl
                                                text-sm
                                                leading-7
                                                text-[var(--on-surface-variant)]
                                            "
                                        >
                                            {
                                                finalReport?.overallAssessment ||
                                                "Here is your AI-generated breakdown of this interview session."
                                            }
                                        </p>

                                    </div>


                                    <div
                                        className="
                                            flex
                                            h-24
                                            w-24
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-[var(--primary)]
                                            text-center
                                            text-white
                                            shadow-[var(--shadow-md)]
                                        "
                                    >
                                        <div>
                                            <p className="text-2xl font-extrabold">
                                                {
                                                    overallScore !== null
                                                        ? overallScore.toFixed(1)
                                                        : "—"
                                                }
                                            </p>

                                            <p
                                                className="
                                                    text-[10px]
                                                    font-bold
                                                    uppercase
                                                    tracking-wider
                                                    text-white/55
                                                "
                                            >
                                                Overall
                                            </p>
                                        </div>
                                    </div>

                                </div>

                            </div>


                            <div
                                className="
                                    p-6
                                    sm:p-8
                                "
                            >

                                {/* METRICS */}

                                <div
                                    className="
                                        grid
                                        gap-4
                                        sm:grid-cols-2
                                        xl:grid-cols-4
                                    "
                                >

                                    <MetricCard
                                        label="Technical"
                                        score={finalReport?.technicalScore}
                                        icon={Code2}
                                    />

                                    <MetricCard
                                        label="Communication"
                                        score={finalReport?.communicationScore}
                                        icon={MessageSquareText}
                                    />

                                    <MetricCard
                                        label="Problem Solving"
                                        score={finalReport?.problemSolvingScore}
                                        icon={Brain}
                                    />

                                    <MetricCard
                                        label="Confidence"
                                        score={finalReport?.confidenceScore}
                                        icon={Zap}
                                    />

                                </div>


                                {/* INSIGHTS */}

                                <div
                                    className="
                                        mt-7
                                        grid
                                        gap-5
                                        lg:grid-cols-2
                                    "
                                >

                                    <InsightList
                                        title="Your strengths"
                                        items={
                                            finalReport?.strengths ||
                                            finalReport?.keyStrengths
                                        }
                                        icon={Trophy}
                                        positive
                                    />

                                    <InsightList
                                        title="Areas to improve"
                                        items={
                                            finalReport?.weaknesses ||
                                            finalReport?.improvements ||
                                            finalReport?.areasForImprovement
                                        }
                                        icon={Target}
                                    />

                                </div>


                                {/* RECOMMENDATIONS */}

                                {getArray(
                                    finalReport?.recommendations
                                ).length > 0 && (
                                        <div
                                            className="
                                            mt-6
                                            rounded-[1.5rem]
                                            bg-[var(--primary)]
                                            p-6
                                            text-white
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
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    bg-white/10
                                                "
                                                >
                                                    <Lightbulb
                                                        size={20}
                                                    />
                                                </div>

                                                <div>
                                                    <h3 className="font-extrabold">
                                                        Recommended next steps
                                                    </h3>

                                                    <p
                                                        className="
                                                        mt-1
                                                        text-sm
                                                        text-white/60
                                                    "
                                                    >
                                                        Focus on these areas before your next interview.
                                                    </p>
                                                </div>
                                            </div>


                                            <div
                                                className="
                                                mt-6
                                                space-y-3
                                            "
                                            >
                                                {getArray(
                                                    finalReport?.recommendations
                                                ).map(
                                                    (
                                                        recommendation,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={index}
                                                            className="
                                                            flex
                                                            gap-3
                                                            rounded-xl
                                                            bg-white/8
                                                            p-4
                                                        "
                                                        >
                                                            <span
                                                                className="
                                                                flex
                                                                h-7
                                                                w-7
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-lg
                                                                bg-white/10
                                                                text-xs
                                                                font-bold
                                                            "
                                                            >
                                                                {index + 1}
                                                            </span>

                                                            <p
                                                                className="
                                                                text-sm
                                                                leading-6
                                                                text-white/75
                                                            "
                                                            >
                                                                {
                                                                    typeof recommendation === "object"
                                                                        ? (
                                                                            recommendation?.text ||
                                                                            recommendation?.description ||
                                                                            recommendation?.title
                                                                        )
                                                                        : recommendation
                                                                }
                                                            </p>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                        </div>
                                    )}

                            </div>

                        </section>
                    )}


                {/* =================================================
                    START INTERVIEW
                ================================================= */}

                {!isCompleted &&
                    !isInterviewStarted && (
                        <section
                            className="
                                mt-8
                                overflow-hidden
                                rounded-[2rem]
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface-container-lowest)]
                                shadow-[var(--shadow-md)]
                            "
                        >

                            <div
                                className="
                                    relative
                                    overflow-hidden
                                    bg-[var(--surface-container-low)]
                                    px-6
                                    py-8
                                    sm:px-8
                                    lg:px-10
                                "
                            >

                                <div
                                    className="
                                        absolute
                                        -right-20
                                        -top-20
                                        h-64
                                        w-64
                                        rounded-full
                                        bg-[var(--primary-fixed)]
                                        opacity-60
                                        blur-3xl
                                    "
                                />

                                <div
                                    className="
                                        absolute
                                        -bottom-24
                                        left-1/3
                                        h-56
                                        w-56
                                        rounded-full
                                        bg-[var(--secondary-fixed)]
                                        opacity-30
                                        blur-3xl
                                    "
                                />

                                <div
                                    className="
                                        relative
                                        z-10
                                        max-w-3xl
                                    "
                                >

                                    <div
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            bg-[var(--primary-fixed)]
                                            px-4
                                            py-2
                                            text-xs
                                            font-extrabold
                                            uppercase
                                            tracking-[0.12em]
                                            text-[var(--primary)]
                                        "
                                    >
                                        <Sparkles size={15} />

                                        AI Interview Ready
                                    </div>


                                    <h2
                                        className="
                                            mt-6
                                            text-3xl
                                            font-extrabold
                                            tracking-[-0.03em]
                                            text-[var(--on-surface)]
                                            sm:text-4xl
                                        "
                                    >
                                        Ready to begin your interview?
                                    </h2>


                                    <p
                                        className="
                                            mt-4
                                            max-w-2xl
                                            text-sm
                                            leading-7
                                            text-[var(--on-surface-variant)]
                                            sm:text-base
                                        "
                                    >
                                        Your AI interviewer has prepared the questions.
                                        Take your time, answer naturally, and receive
                                        intelligent feedback after every response.
                                    </p>

                                </div>
                            </div>


                            {/* DETAILS */}

                            <div
                                className="
                                    grid
                                    gap-5
                                    p-6
                                    sm:grid-cols-2
                                    lg:grid-cols-4
                                    sm:p-8
                                "
                            >

                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-[var(--outline-variant)]
                                        bg-[var(--surface-container-low)]
                                        p-5
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
                                            bg-[var(--primary-fixed)]
                                            text-[var(--primary)]
                                        "
                                    >
                                        <ListChecks size={20} />
                                    </div>

                                    <p
                                        className="
                                            mt-5
                                            text-2xl
                                            font-extrabold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        {statistics.total}
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        Interview Questions
                                    </p>
                                </div>


                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-[var(--outline-variant)]
                                        bg-[var(--surface-container-low)]
                                        p-5
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
                                            bg-[var(--secondary-container)]
                                            text-[var(--on-secondary-container)]
                                        "
                                    >
                                        <Brain size={20} />
                                    </div>

                                    <p
                                        className="
                                            mt-5
                                            text-lg
                                            font-extrabold
                                            capitalize
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        {
                                            humanize(
                                                interviewSession?.interviewType ||
                                                interviewSession?.type ||
                                                "AI Interview"
                                            )
                                        }
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        Interview Type
                                    </p>
                                </div>


                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-[var(--outline-variant)]
                                        bg-[var(--surface-container-low)]
                                        p-5
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
                                            bg-[var(--primary-fixed)]
                                            text-[var(--primary)]
                                        "
                                    >
                                        <Target size={20} />
                                    </div>

                                    <p
                                        className="
                                            mt-5
                                            text-lg
                                            font-extrabold
                                            capitalize
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        {
                                            humanize(
                                                interviewSession?.difficulty ||
                                                "Medium"
                                            )
                                        }
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        Difficulty
                                    </p>
                                </div>


                                <div
                                    className="
                                        rounded-2xl
                                        border
                                        border-[var(--outline-variant)]
                                        bg-[var(--surface-container-low)]
                                        p-5
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
                                            bg-[var(--secondary-container)]
                                            text-[var(--on-secondary-container)]
                                        "
                                    >
                                        <BriefcaseBusiness size={20} />
                                    </div>

                                    <p
                                        className="
                                            mt-5
                                            truncate
                                            text-lg
                                            font-extrabold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        {
                                            interviewSession?.jobTitle ||
                                            interviewSession?.jobWorkspace?.jobTitle ||
                                            "General Interview"
                                        }
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-sm
                                            font-semibold
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        Target Role
                                    </p>
                                </div>

                            </div>


                            {/* HOW IT WORKS */}

                            <div
                                className="
                                    border-t
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-low)]
                                    px-6
                                    py-7
                                    sm:px-8
                                "
                            >

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-7
                                        lg:flex-row
                                        lg:items-center
                                        lg:justify-between
                                    "
                                >

                                    <div>
                                        <p
                                            className="
                                                text-xs
                                                font-extrabold
                                                uppercase
                                                tracking-[0.14em]
                                                text-[var(--primary)]
                                            "
                                        >
                                            How it works
                                        </p>

                                        <div
                                            className="
                                                mt-4
                                                flex
                                                flex-col
                                                gap-3
                                                text-sm
                                                text-[var(--on-surface-variant)]
                                                sm:flex-row
                                                sm:flex-wrap
                                                sm:gap-6
                                            "
                                        >
                                            <div className="flex items-center gap-2">
                                                <ClipboardCheck
                                                    size={17}
                                                    className="text-[var(--primary)]"
                                                />

                                                Answer one question at a time
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Sparkles
                                                    size={17}
                                                    className="text-[var(--primary)]"
                                                />

                                                Receive AI feedback
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Trophy
                                                    size={17}
                                                    className="text-[var(--primary)]"
                                                />

                                                Get your final report
                                            </div>
                                        </div>
                                    </div>


                                    <button
                                        type="button"
                                        onClick={
                                            handleStartInterview
                                        }
                                        className="
                                            inline-flex
                                            min-h-14
                                            shrink-0
                                            items-center
                                            justify-center
                                            gap-3
                                            rounded-2xl
                                            bg-[var(--primary)]
                                            px-7
                                            text-sm
                                            font-extrabold
                                            text-white
                                            shadow-[var(--shadow-md)]
                                            transition
                                            hover:-translate-y-0.5
                                            hover:bg-[var(--primary-container)]
                                        "
                                    >
                                        <Play
                                            size={18}
                                            fill="currentColor"
                                        />

                                        Start Interview

                                        <ArrowRight
                                            size={17}
                                        />
                                    </button>

                                </div>

                            </div>

                        </section>
                    )}


                {/* =================================================
                    INTERVIEW WORKSPACE
                ================================================= */}

                {!isCompleted &&
                    isInterviewStarted && (

                        <div
                            className="
                                mt-8
                                grid
                                gap-6
                                lg:grid-cols-[280px_minmax(0,1fr)]
                            "
                        >

                            {/* =================================================
                                QUESTION NAVIGATOR
                            ================================================= */}

                            <aside
                                className="
                                    h-fit
                                    overflow-hidden
                                    rounded-[1.75rem]
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-lowest)]
                                    shadow-[var(--shadow-sm)]
                                    lg:sticky
                                    lg:top-6
                                "
                            >

                                <div
                                    className="
                                        border-b
                                        border-[var(--outline-variant)]
                                        px-5
                                        py-5
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
                                            <p
                                                className="
                                                    text-xs
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-[var(--primary)]
                                                "
                                            >
                                                Interview flow
                                            </p>

                                            <h2
                                                className="
                                                    mt-1
                                                    text-lg
                                                    font-extrabold
                                                    text-[var(--on-surface)]
                                                "
                                            >
                                                Questions
                                            </h2>
                                        </div>

                                        <span
                                            className="
                                                flex
                                                h-10
                                                w-10
                                                items-center
                                                justify-center
                                                rounded-xl
                                                bg-[var(--primary-fixed)]
                                                text-sm
                                                font-extrabold
                                                text-[var(--primary)]
                                            "
                                        >
                                            {statistics.evaluated}
                                        </span>

                                    </div>

                                </div>


                                <div
                                    className="
                                        max-h-[55vh]
                                        overflow-y-auto
                                        p-3
                                    "
                                >

                                    {questions.map(
                                        (
                                            question,
                                            index
                                        ) => {

                                            const status =
                                                getQuestionStatus(
                                                    question
                                                );

                                            const isActive =
                                                index ===
                                                activeQuestionIndex;

                                            return (
                                                <button
                                                    key={
                                                        question?._id ||
                                                        index
                                                    }
                                                    type="button"
                                                    onClick={() =>
                                                        goToQuestion(
                                                            index
                                                        )
                                                    }
                                                    className={`
                                                        mb-2
                                                        flex
                                                        w-full
                                                        items-center
                                                        gap-3
                                                        rounded-2xl
                                                        p-3
                                                        text-left
                                                        transition

                                                        ${isActive
                                                            ? `
                                                                    bg-[var(--primary)]
                                                                    text-white
                                                                    shadow-md
                                                                `
                                                            : `
                                                                    text-[var(--on-surface)]
                                                                    hover:bg-[var(--surface-container-low)]
                                                                `
                                                        }
                                                    `}
                                                >

                                                    <span
                                                        className={`
                                                            flex
                                                            h-9
                                                            w-9
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            text-sm
                                                            font-extrabold

                                                            ${isActive
                                                                ? "bg-white/15 text-white"
                                                                : status === "evaluated"
                                                                    ? "bg-[var(--primary-fixed)] text-[var(--primary)]"
                                                                    : status === "answered"
                                                                        ? "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]"
                                                                        : "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]"
                                                            }
                                                        `}
                                                    >
                                                        {status === "evaluated" ? (
                                                            <Check size={17} />
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </span>


                                                    <span className="min-w-0 flex-1">

                                                        <span
                                                            className="
                                                                block
                                                                text-sm
                                                                font-bold
                                                            "
                                                        >
                                                            Question {index + 1}
                                                        </span>

                                                        <span
                                                            className={`
                                                                mt-1
                                                                block
                                                                truncate
                                                                text-xs

                                                                ${isActive
                                                                    ? "text-white/60"
                                                                    : "text-[var(--on-surface-variant)]"
                                                                }
                                                            `}
                                                        >
                                                            {getQuestionText(
                                                                question
                                                            )}
                                                        </span>

                                                    </span>

                                                </button>
                                            );
                                        }
                                    )}

                                </div>


                                <div
                                    className="
                                        border-t
                                        border-[var(--outline-variant)]
                                        p-5
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            text-xs
                                            font-bold
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        <span>
                                            {statistics.evaluated} completed
                                        </span>

                                        <span>
                                            {statistics.total} total
                                        </span>
                                    </div>

                                    <div
                                        className="
                                            mt-3
                                            h-2
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
                                                duration-500
                                            "
                                            style={{
                                                width:
                                                    `${statistics.progress}%`,
                                            }}
                                        />
                                    </div>

                                </div>

                            </aside>


                            {/* =================================================
                                QUESTION AREA
                            ================================================= */}

                            <main
                                className="
                                    min-w-0
                                    space-y-6
                                "
                            >

                                {activeQuestion ? (
                                    <section
                                        className="
                                            overflow-hidden
                                            rounded-[2rem]
                                            border
                                            border-[var(--outline-variant)]
                                            bg-[var(--surface-container-lowest)]
                                            shadow-[var(--shadow-sm)]
                                        "
                                    >

                                        {/* QUESTION HEADER */}

                                        <div
                                            className="
                                                border-b
                                                border-[var(--outline-variant)]
                                                bg-[var(--surface-container-low)]
                                                p-6
                                                sm:p-8
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    flex-wrap
                                                    items-center
                                                    justify-between
                                                    gap-4
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
                                                            h-11
                                                            w-11
                                                            items-center
                                                            justify-center
                                                            rounded-2xl
                                                            bg-[var(--primary)]
                                                            font-extrabold
                                                            text-white
                                                        "
                                                    >
                                                        {activeQuestionIndex + 1}
                                                    </div>


                                                    <div>
                                                        <p
                                                            className="
                                                                text-xs
                                                                font-bold
                                                                uppercase
                                                                tracking-[0.14em]
                                                                text-[var(--primary)]
                                                            "
                                                        >
                                                            Question {activeQuestionIndex + 1} of {statistics.total}
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-sm
                                                                font-semibold
                                                                capitalize
                                                                text-[var(--on-surface-variant)]
                                                            "
                                                        >
                                                            {
                                                                activeQuestion?.category ||
                                                                activeQuestion?.type ||
                                                                "Interview Question"
                                                            }
                                                        </p>
                                                    </div>

                                                </div>


                                                {activeScore !== null && (
                                                    <div
                                                        className="
                                                            rounded-2xl
                                                            bg-[var(--primary-fixed)]
                                                            px-4
                                                            py-3
                                                            text-center
                                                        "
                                                    >
                                                        <p
                                                            className="
                                                                text-lg
                                                                font-extrabold
                                                                text-[var(--primary)]
                                                            "
                                                        >
                                                            {activeScore.toFixed(1)}/10
                                                        </p>

                                                        <p
                                                            className="
                                                                text-[10px]
                                                                font-bold
                                                                uppercase
                                                                tracking-wider
                                                                text-[var(--primary)]
                                                            "
                                                        >
                                                            AI Score
                                                        </p>
                                                    </div>
                                                )}

                                            </div>


                                            <h2
                                                className="
                                                    mt-7
                                                    max-w-4xl
                                                    text-2xl
                                                    font-extrabold
                                                    leading-[1.35]
                                                    tracking-tight
                                                    text-[var(--on-surface)]
                                                    sm:text-3xl
                                                "
                                            >
                                                {getQuestionText(
                                                    activeQuestion
                                                )}
                                            </h2>

                                        </div>


                                        {/* ANSWER */}

                                        <div
                                            className="
                                                p-6
                                                sm:p-8
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                "
                                            >

                                                <div>
                                                    <h3
                                                        className="
                                                            text-base
                                                            font-extrabold
                                                            text-[var(--on-surface)]
                                                        "
                                                    >
                                                        Your answer
                                                    </h3>

                                                    <p
                                                        className="
                                                            mt-1
                                                            text-sm
                                                            text-[var(--on-surface-variant)]
                                                        "
                                                    >
                                                        Answer naturally. The AI will evaluate your response.
                                                    </p>
                                                </div>


                                                <span
                                                    className="
                                                        rounded-full
                                                        bg-[var(--surface-container-low)]
                                                        px-3
                                                        py-1.5
                                                        text-xs
                                                        font-bold
                                                        text-[var(--on-surface-variant)]
                                                    "
                                                >
                                                    {
                                                        answer
                                                            .trim()
                                                            .split(/\s+/)
                                                            .filter(Boolean)
                                                            .length
                                                    } words
                                                </span>

                                            </div>


                                            <textarea
                                                value={answer}
                                                onChange={(event) => {
                                                    setAnswer(
                                                        event.target.value
                                                    );
                                                }}
                                                disabled={
                                                    isEvaluating ||
                                                    isCompleting
                                                }
                                                placeholder="Write your answer here..."
                                                className="
                                                    mt-6
                                                    min-h-[260px]
                                                    w-full
                                                    resize-y
                                                    rounded-[1.5rem]
                                                    border
                                                    border-[var(--outline-variant)]
                                                    bg-[var(--surface-container-low)]
                                                    p-5
                                                    text-sm
                                                    leading-7
                                                    text-[var(--on-surface)]
                                                    outline-none
                                                    transition
                                                    placeholder:text-[var(--on-surface-variant)]/60
                                                    focus:border-[var(--primary)]
                                                    focus:ring-2
                                                    focus:ring-[var(--primary-fixed)]
                                                "
                                            />


                                            <div
                                                className="
                                                    mt-3
                                                    flex
                                                    items-center
                                                    justify-between
                                                    gap-4
                                                    text-xs
                                                    text-[var(--on-surface-variant)]
                                                "
                                            >
                                                <span>
                                                    {answer.length} characters
                                                </span>

                                                {answer.length > 0 && (
                                                    <span
                                                        className="
                                                            text-[var(--primary)]
                                                        "
                                                    >
                                                        Ready for evaluation
                                                    </span>
                                                )}
                                            </div>


                                            {/* ACTIONS */}

                                            <div
                                                className="
                                                    mt-6
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
                                                        gap-3
                                                    "
                                                >

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleSaveAnswer
                                                        }
                                                        disabled={
                                                            !answer.trim() ||
                                                            isSaving ||
                                                            isEvaluating
                                                        }
                                                        className="
                                                            inline-flex
                                                            min-h-12
                                                            items-center
                                                            justify-center
                                                            gap-2
                                                            rounded-xl
                                                            border
                                                            border-[var(--outline-variant)]
                                                            bg-[var(--surface-container-lowest)]
                                                            px-5
                                                            text-sm
                                                            font-bold
                                                            text-[var(--on-surface)]
                                                            transition
                                                            hover:bg-[var(--surface-container-low)]
                                                            disabled:cursor-not-allowed
                                                            disabled:opacity-50
                                                        "
                                                    >
                                                        {isSaving ? (
                                                            <LoaderCircle
                                                                size={17}
                                                                className="animate-spin"
                                                            />
                                                        ) : (
                                                            <Check size={17} />
                                                        )}

                                                        Save answer
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setAnswer("")
                                                        }
                                                        disabled={
                                                            isEvaluating
                                                        }
                                                        className="
                                                            inline-flex
                                                            min-h-12
                                                            items-center
                                                            justify-center
                                                            rounded-xl
                                                            px-4
                                                            text-sm
                                                            font-bold
                                                            text-[var(--on-surface-variant)]
                                                            transition
                                                            hover:bg-[var(--surface-container-low)]
                                                        "
                                                    >
                                                        Clear
                                                    </button>

                                                </div>


                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleEvaluateAnswer
                                                    }
                                                    disabled={
                                                        !answer.trim() ||
                                                        isEvaluating ||
                                                        isCompleting
                                                    }
                                                    className="
                                                        inline-flex
                                                        min-h-12
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        bg-[var(--primary)]
                                                        px-6
                                                        text-sm
                                                        font-extrabold
                                                        text-white
                                                        shadow-[var(--shadow-sm)]
                                                        transition
                                                        hover:bg-[var(--primary-container)]
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-60
                                                    "
                                                >

                                                    {isEvaluating ? (
                                                        <LoaderCircle
                                                            size={18}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Sparkles size={18} />
                                                    )}

                                                    {isEvaluating
                                                        ? "AI is evaluating..."
                                                        : "Evaluate Answer"
                                                    }

                                                </button>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            AI EVALUATING
                                        ================================================= */}

                                        {isEvaluating && (
                                            <div
                                                className="
                                                    border-t
                                                    border-[var(--outline-variant)]
                                                    bg-[var(--primary-fixed)]
                                                    p-8
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        flex-col
                                                        items-center
                                                        justify-center
                                                        py-8
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
                                                            rounded-3xl
                                                            bg-[var(--primary)]
                                                            text-white
                                                        "
                                                    >
                                                        <Brain
                                                            size={28}
                                                            className="animate-pulse"
                                                        />
                                                    </div>

                                                    <h3
                                                        className="
                                                            mt-5
                                                            text-xl
                                                            font-extrabold
                                                            text-[var(--on-surface)]
                                                        "
                                                    >
                                                        Your AI interviewer is thinking
                                                    </h3>

                                                    <p
                                                        className="
                                                            mt-2
                                                            max-w-md
                                                            text-sm
                                                            leading-6
                                                            text-[var(--on-surface-variant)]
                                                        "
                                                    >
                                                        Analyzing technical accuracy,
                                                        communication, clarity and
                                                        problem-solving approach.
                                                    </p>

                                                    <div
                                                        className="
                                                            mt-6
                                                            flex
                                                            gap-2
                                                        "
                                                    >
                                                        {[0, 1, 2].map(
                                                            (item) => (
                                                                <span
                                                                    key={item}
                                                                    className="
                                                                        h-2.5
                                                                        w-2.5
                                                                        animate-bounce
                                                                        rounded-full
                                                                        bg-[var(--primary)]
                                                                    "
                                                                    style={{
                                                                        animationDelay:
                                                                            `${item * 150}ms`,
                                                                    }}
                                                                />
                                                            )
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                        )}


                                        {/* =================================================
                                            AI FEEDBACK
                                        ================================================= */}

                                        {!isEvaluating &&
                                            hasEvaluation(
                                                activeQuestion
                                            ) && (

                                                <div
                                                    className="
                                                        border-t
                                                        border-[var(--outline-variant)]
                                                        bg-[var(--surface-container-low)]
                                                        p-6
                                                        sm:p-8
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            flex-col
                                                            gap-6
                                                            lg:flex-row
                                                            lg:items-start
                                                            lg:justify-between
                                                        "
                                                    >

                                                        <div className="flex-1">

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
                                                                        h-11
                                                                        w-11
                                                                        items-center
                                                                        justify-center
                                                                        rounded-2xl
                                                                        bg-[var(--primary)]
                                                                        text-white
                                                                    "
                                                                >
                                                                    <Sparkles
                                                                        size={20}
                                                                    />
                                                                </div>


                                                                <div>

                                                                    <p
                                                                        className="
                                                                            text-xs
                                                                            font-bold
                                                                            uppercase
                                                                            tracking-[0.14em]
                                                                            text-[var(--primary)]
                                                                        "
                                                                    >
                                                                        AI Evaluation
                                                                    </p>

                                                                    <h3
                                                                        className="
                                                                            mt-1
                                                                            text-xl
                                                                            font-extrabold
                                                                            text-[var(--on-surface)]
                                                                        "
                                                                    >
                                                                        Feedback on your answer
                                                                    </h3>

                                                                </div>

                                                            </div>


                                                            <p
                                                                className="
                                                                    mt-6
                                                                    text-sm
                                                                    leading-7
                                                                    text-[var(--on-surface-variant)]
                                                                "
                                                            >
                                                                {activeFeedback ||
                                                                    "Your answer has been evaluated successfully."}
                                                            </p>

                                                        </div>


                                                        {activeScore !== null && (
                                                            <div
                                                                className="
                                                                    shrink-0
                                                                    rounded-[1.5rem]
                                                                    bg-[var(--primary)]
                                                                    px-6
                                                                    py-5
                                                                    text-center
                                                                    text-white
                                                                "
                                                            >
                                                                <p
                                                                    className="
                                                                        text-3xl
                                                                        font-extrabold
                                                                    "
                                                                >
                                                                    {activeScore.toFixed(1)}
                                                                </p>

                                                                <p
                                                                    className="
                                                                        mt-1
                                                                        text-xs
                                                                        font-bold
                                                                        uppercase
                                                                        tracking-[0.12em]
                                                                        text-white/55
                                                                    "
                                                                >
                                                                    Score / 10
                                                                </p>
                                                            </div>
                                                        )}

                                                    </div>


                                                    <div
                                                        className="
                                                            mt-7
                                                            grid
                                                            gap-5
                                                            lg:grid-cols-2
                                                        "
                                                    >

                                                        <InsightList
                                                            title="What you did well"
                                                            items={
                                                                activeQuestion?.strengths ||
                                                                activeQuestion?.goodPoints ||
                                                                activeQuestion?.positives ||
                                                                activeQuestion?.evaluation?.strengths
                                                            }
                                                            icon={CheckCircle2}
                                                            positive
                                                        />


                                                        <InsightList
                                                            title="What to improve"
                                                            items={
                                                                activeQuestion?.improvements ||
                                                                activeQuestion?.weaknesses ||
                                                                activeQuestion?.areasForImprovement ||
                                                                activeQuestion?.evaluation?.improvements
                                                            }
                                                            icon={Target}
                                                        />

                                                    </div>

                                                </div>
                                            )}


                                        {/* =================================================
                                            NAVIGATION
                                        ================================================= */}

                                        <div
                                            className="
                                                flex
                                                flex-col
                                                gap-4
                                                border-t
                                                border-[var(--outline-variant)]
                                                p-5
                                                sm:flex-row
                                                sm:items-center
                                                sm:justify-between
                                            "
                                        >

                                            <button
                                                type="button"
                                                onClick={
                                                    goPrevious
                                                }
                                                disabled={
                                                    activeQuestionIndex === 0
                                                }
                                                className="
                                                    inline-flex
                                                    min-h-11
                                                    items-center
                                                    justify-center
                                                    gap-2
                                                    rounded-xl
                                                    px-5
                                                    text-sm
                                                    font-bold
                                                    text-[var(--on-surface)]
                                                    transition
                                                    hover:bg-[var(--surface-container-low)]
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-40
                                                "
                                            >
                                                <ChevronLeft
                                                    size={18}
                                                />

                                                Previous
                                            </button>


                                            <p
                                                className="
                                                    text-center
                                                    text-sm
                                                    font-semibold
                                                    text-[var(--on-surface-variant)]
                                                "
                                            >
                                                {activeQuestionIndex + 1} / {statistics.total}
                                            </p>


                                            {activeQuestionIndex <
                                                statistics.total - 1 ? (

                                                <button
                                                    type="button"
                                                    onClick={
                                                        goNext
                                                    }
                                                    className="
                                                        inline-flex
                                                        min-h-11
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        bg-[var(--primary)]
                                                        px-5
                                                        text-sm
                                                        font-bold
                                                        text-white
                                                    "
                                                >
                                                    Next

                                                    <ChevronRight
                                                        size={18}
                                                    />
                                                </button>

                                            ) : (

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleCompleteInterview
                                                    }
                                                    disabled={
                                                        isCompleting ||
                                                        statistics.evaluated <
                                                        statistics.total
                                                    }
                                                    className="
                                                        inline-flex
                                                        min-h-11
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        bg-[var(--primary)]
                                                        px-5
                                                        text-sm
                                                        font-bold
                                                        text-white
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50
                                                    "
                                                >
                                                    {isCompleting ? (
                                                        <LoaderCircle
                                                            size={17}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Trophy
                                                            size={17}
                                                        />
                                                    )}

                                                    {isCompleting
                                                        ? "Generating report..."
                                                        : "Finish Interview"
                                                    }
                                                </button>

                                            )}

                                        </div>

                                    </section>

                                ) : (

                                    <section
                                        className="
                                            flex
                                            min-h-[500px]
                                            flex-col
                                            items-center
                                            justify-center
                                            rounded-[2rem]
                                            border
                                            border-dashed
                                            border-[var(--outline-variant)]
                                            bg-[var(--surface-container-low)]
                                            p-8
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
                                                rounded-3xl
                                                bg-[var(--primary-fixed)]
                                                text-[var(--primary)]
                                            "
                                        >
                                            <MessageSquareText
                                                size={28}
                                            />
                                        </div>

                                        <h2
                                            className="
                                                mt-6
                                                text-2xl
                                                font-extrabold
                                                text-[var(--on-surface)]
                                            "
                                        >
                                            No questions available
                                        </h2>

                                        <p
                                            className="
                                                mt-3
                                                max-w-md
                                                text-sm
                                                leading-6
                                                text-[var(--on-surface-variant)]
                                            "
                                        >
                                            This interview session does not contain any questions yet.
                                        </p>

                                    </section>
                                )}


                                {/* =================================================
                                    FINISH CTA
                                ================================================= */}

                                {statistics.total > 0 &&
                                    statistics.evaluated ===
                                    statistics.total && (

                                        <section
                                            className="
                                                relative
                                                overflow-hidden
                                                rounded-[1.75rem]
                                                bg-[var(--primary)]
                                                p-6
                                                text-white
                                                shadow-[var(--shadow-md)]
                                                sm:p-8
                                            "
                                        >

                                            <div
                                                className="
                                                    absolute
                                                    -right-10
                                                    -top-10
                                                    h-40
                                                    w-40
                                                    rounded-full
                                                    bg-white/5
                                                "
                                            />

                                            <div
                                                className="
                                                    relative
                                                    flex
                                                    flex-col
                                                    gap-5
                                                    sm:flex-row
                                                    sm:items-center
                                                    sm:justify-between
                                                "
                                            >

                                                <div>

                                                    <div
                                                        className="
                                                            flex
                                                            items-center
                                                            gap-2
                                                            text-white/60
                                                        "
                                                    >
                                                        <Trophy
                                                            size={18}
                                                        />

                                                        <span
                                                            className="
                                                                text-xs
                                                                font-bold
                                                                uppercase
                                                                tracking-[0.14em]
                                                            "
                                                        >
                                                            Ready to finish
                                                        </span>
                                                    </div>


                                                    <h2
                                                        className="
                                                            mt-3
                                                            text-2xl
                                                            font-extrabold
                                                        "
                                                    >
                                                        You've completed every question 🎉
                                                    </h2>


                                                    <p
                                                        className="
                                                            mt-2
                                                            max-w-xl
                                                            text-sm
                                                            leading-6
                                                            text-white/60
                                                        "
                                                    >
                                                        Generate your complete AI interview report and discover your strongest skills and biggest opportunities for improvement.
                                                    </p>

                                                </div>


                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleCompleteInterview
                                                    }
                                                    disabled={
                                                        isCompleting
                                                    }
                                                    className="
                                                        inline-flex
                                                        min-h-12
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        bg-white
                                                        px-6
                                                        text-sm
                                                        font-extrabold
                                                        text-[var(--primary)]
                                                        transition
                                                        hover:scale-[1.02]
                                                        disabled:opacity-60
                                                    "
                                                >
                                                    {isCompleting ? (
                                                        <LoaderCircle
                                                            size={18}
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Sparkles
                                                            size={18}
                                                        />
                                                    )}

                                                    {isCompleting
                                                        ? "Generating..."
                                                        : "Generate Final Report"
                                                    }
                                                </button>

                                            </div>

                                        </section>
                                    )}

                            </main>

                        </div>
                    )}

            </div>
        </div>
    );
}


export default InterviewSessionDetails;