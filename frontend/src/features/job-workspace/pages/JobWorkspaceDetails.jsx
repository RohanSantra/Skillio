import { useEffect, useMemo, useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    BarChart3,
    BrainCircuit,
    BriefcaseBusiness,
    Building2,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    CircleAlert,
    Clock3,
    Code2,
    FileSearch,
    GraduationCap,
    Lightbulb,
    LoaderCircle,
    Search,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingUp,
    TriangleAlert,
    XCircle,
    FileCheck2,
    ClipboardCheck,
    ClipboardList,
    WandSparkles,
} from "lucide-react";

import { toast } from "sonner";

import useJobWorkspace from "../hooks/useJobWorkspace";
import useResume from "../../resume/hooks/useResume";
import usePreparationPlan from "../../preparation/hooks/usePreparationPlan";


/* =========================================================
   ## CONSTANTS
========================================================= */

const EMPTY_ARRAY = [];


/* =========================================================
   ## SMALL UTILITY FUNCTIONS
========================================================= */

function formatDate(date) {

    if (!date) return null;

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


function formatDateTime(date) {

    if (!date) return null;

    try {

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        ).format(new Date(date));

    } catch {

        return null;

    }

}


function formatJobDescription(description) {

    if (!description) return "";

    return description
        .replace(/\r\n/g, "\n")
        .replace(/\s*\[\d+\]\s*\(\[[^\]]*\]\([^)]*\)\)\s*,?/g, "")
        .replace(/\s*\[\d+\]\s*\([^)]*\)\s*,?/g, "")
        .replace(
            /\s*(?=(Role Overview:|About the Job|Minimum Qualifications|Preferred Qualifications|Core Responsibilities)\b)/g,
            "\n\n"
        )
        .replace(/\n{3,}/g, "\n\n")
        .trim();

}


function getScoreLabel(score) {

    if (typeof score !== "number") {

        return {
            label: "Not analyzed",
            description: "Run the AI analysis to see your score.",
        };

    }


    if (score >= 80) {

        return {
            label: "Excellent Match",
            description: "Your profile aligns strongly with this opportunity.",
        };

    }


    if (score >= 60) {

        return {
            label: "Strong Potential",
            description: "You have a solid foundation with some areas to improve.",
        };

    }


    if (score >= 40) {

        return {
            label: "Room to Strengthen",
            description: "You have relevant strengths, but important gaps remain.",
        };

    }


    return {
        label: "Needs Preparation",
        description: "Focus on strengthening your profile for this opportunity.",
    };

}


function getImportanceConfig(importance) {

    const value = importance?.toLowerCase();


    if (value === "critical") {

        return {
            label: "Critical",
            badge:
                "bg-[var(--error-container)] text-[var(--on-error-container)]",
            border:
                "border-l-[var(--error)]",
            icon:
                <TriangleAlert size={18} />,
        };

    }


    if (value === "high") {

        return {
            label: "High Priority",
            badge:
                "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
            border:
                "border-l-[var(--secondary)]",
            icon:
                <CircleAlert size={18} />,
        };

    }


    if (value === "medium") {

        return {
            label: "Medium Priority",
            badge:
                "bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]",
            border:
                "border-l-[var(--primary)]",
            icon:
                <Target size={18} />,
        };

    }


    return {
        label: "Low Priority",
        badge:
            "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]",
        border:
            "border-l-[var(--outline)]",
        icon:
            <TrendingUp size={18} />,
    };

}


/* =========================================================
   ## REUSABLE SECTION CARD
========================================================= */

function SectionCard({

    children,
    className = "",

}) {

    return (

        <section
            className={`
                overflow-hidden
                rounded-[1.75rem]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                shadow-[var(--shadow-sm)]
                ${className}
            `}
        >
            {children}
        </section>

    );

}


/* =========================================================
   ## SECTION HEADER
========================================================= */

function SectionHeader({

    icon,
    eyebrow,
    title,
    description,
    action,

}) {

    return (

        <div
            className="
                flex
                flex-col
                gap-5
                border-b
                border-[var(--outline-variant)]
                px-5
                py-5
                sm:flex-row
                sm:items-start
                sm:justify-between
                sm:px-7
                sm:py-6
            "
        >

            <div className="flex gap-4">

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
                    {icon}
                </div>


                <div>

                    {eyebrow && (

                        <p
                            className="
                                mb-1
                                text-[11px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-[var(--primary)]
                            "
                        >
                            {eyebrow}
                        </p>

                    )}


                    <h2
                        className="
                            font-[var(--font-heading)]
                            text-xl
                            font-extrabold
                            tracking-tight
                            text-[var(--on-surface)]
                            sm:text-2xl
                        "
                    >
                        {title}
                    </h2>


                    {description && (

                        <p
                            className="
                                mt-1.5
                                max-w-2xl
                                text-sm
                                leading-6
                                text-[var(--on-surface-variant)]
                            "
                        >
                            {description}
                        </p>

                    )}

                </div>

            </div>


            {action}

        </div>

    );

}


/* =========================================================
   ## AI RUN BUTTON
========================================================= */

function RunAIButton({

    onClick,
    loading,
    label = "Run Analysis",

}) {

    return (

        <button
            type="button"
            onClick={onClick}
            disabled={loading}
            className="
                inline-flex
                min-h-11
                shrink-0
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[var(--primary)]
                px-4
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:bg-[var(--primary-container)]
                disabled:cursor-not-allowed
                disabled:opacity-70
                disabled:hover:translate-y-0
            "
        >

            {loading ? (

                <LoaderCircle
                    size={17}
                    className="animate-spin"
                />

            ) : (

                <Sparkles size={17} />

            )}


            {loading
                ? "Analyzing..."
                : label}

        </button>

    );

}


/* =========================================================
   ## LOADING CONTENT
========================================================= */

function AnalysisLoading({

    message = "AI is analyzing your information...",

}) {

    return (

        <div
            className="
                flex
                min-h-55
                flex-col
                items-center
                justify-center
                px-6
                py-12
                text-center
            "
        >

            <div
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[var(--primary-fixed)]
                    text-[var(--primary)]
                "
            >
                <LoaderCircle
                    size={27}
                    className="animate-spin"
                />
            </div>


            <h3
                className="
                    mt-5
                    font-[var(--font-heading)]
                    text-base
                    font-bold
                    text-[var(--on-surface)]
                "
            >
                Working on your analysis
            </h3>


            <p
                className="
                    mt-2
                    max-w-sm
                    text-sm
                    leading-6
                    text-[var(--on-surface-variant)]
                "
            >
                {message}
            </p>

        </div>

    );

}


/* =========================================================
   ## EMPTY STATE
========================================================= */

function EmptyAnalysis({

    icon,
    title,
    description,

}) {

    return (

        <div
            className="
                flex
                min-h-55
                flex-col
                items-center
                justify-center
                px-6
                py-12
                text-center
            "
        >

            <div
                className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[var(--surface-container-low)]
                    text-[var(--on-surface-variant)]
                "
            >
                {icon}
            </div>


            <h3
                className="
                    mt-5
                    font-[var(--font-heading)]
                    text-lg
                    font-bold
                    text-[var(--on-surface)]
                "
            >
                {title}
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
                {description}
            </p>

        </div>

    );

}


/* =========================================================
   ## TAG COMPONENT
========================================================= */

function Tag({

    children,
    variant = "default",

}) {

    const variants = {

        default:
            "bg-[var(--surface-container-low)] text-[var(--on-surface)]",

        primary:
            "bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]",

        success:
            "bg-[var(--primary-fixed)] text-[var(--primary)]",

        warning:
            "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",

        danger:
            "bg-[var(--error-container)] text-[var(--on-error-container)]",

    };


    return (

        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-3
                py-1.5
                text-xs
                font-semibold
                leading-5
                ${variants[variant]}
            `}
        >
            {children}
        </span>

    );

}


/* =========================================================
   ## SCORE CARD
========================================================= */

function ScoreDisplay({

    score,
    title = "Score",

}) {

    const scoreInfo = getScoreLabel(score);

    const hasScore =
        typeof score === "number";


    const radius = 42;

    const circumference =
        2 * Math.PI * radius;

    const progress = hasScore
        ? (score / 100) * circumference
        : 0;


    return (

        <div
            className="
                flex
                flex-col
                items-center
                rounded-3xl
                bg-[var(--surface-container-low)]
                px-6
                py-7
                text-center
                sm:flex-row
                sm:gap-8
                sm:text-left
            "
        >

            <div className="relative h-32 w-32 shrink-0">

                <svg
                    viewBox="0 0 100 100"
                    className="-rotate-90"
                >

                    <circle
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        stroke="var(--surface-container-highest)"
                        strokeWidth="8"
                    />


                    {hasScore && (

                        <circle
                            cx="50"
                            cy="50"
                            r={radius}
                            fill="none"
                            stroke="var(--primary)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={
                                circumference - progress
                            }
                            className="transition-all duration-700"
                        />

                    )}

                </svg>


                <div
                    className="
                        absolute
                        inset-0
                        flex
                        flex-col
                        items-center
                        justify-center
                    "
                >

                    <span
                        className="
                            font-[var(--font-heading)]
                            text-3xl
                            font-extrabold
                            text-[var(--on-surface)]
                        "
                    >
                        {hasScore
                            ? score
                            : "—"}
                    </span>


                    <span
                        className="
                            text-xs
                            font-medium
                            text-[var(--on-surface-variant)]
                        "
                    >
                        / 100
                    </span>

                </div>

            </div>


            <div className="mt-5 sm:mt-0">

                <p
                    className="
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.14em]
                        text-[var(--on-surface-variant)]
                    "
                >
                    {title}
                </p>


                <h3
                    className="
                        mt-2
                        font-[var(--font-heading)]
                        text-2xl
                        font-extrabold
                        text-[var(--on-surface)]
                    "
                >
                    {scoreInfo.label}
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
                    {scoreInfo.description}
                </p>

            </div>

        </div>

    );

}


/* =========================================================
   ## LIST PANEL
========================================================= */

function InsightList({

    title,
    icon,
    items = EMPTY_ARRAY,
    variant = "default",

}) {

    if (!items?.length) return null;


    const variants = {

        default: {
            icon:
                "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]",
        },

        success: {
            icon:
                "bg-[var(--primary-fixed)] text-[var(--primary)]",
        },

        warning: {
            icon:
                "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
        },

        danger: {
            icon:
                "bg-[var(--error-container)] text-[var(--on-error-container)]",
        },

    };


    return (

        <div>

            <div className="mb-4 flex items-center gap-2">

                <div
                    className={`
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-xl
                        ${variants[variant].icon}
                    `}
                >
                    {icon}
                </div>


                <h3
                    className="
                        font-[var(--font-heading)]
                        text-base
                        font-bold
                        text-[var(--on-surface)]
                    "
                >
                    {title}
                </h3>


                <span
                    className="
                        rounded-full
                        bg-[var(--surface-container-high)]
                        px-2
                        py-0.5
                        text-[11px]
                        font-bold
                        text-[var(--on-surface-variant)]
                    "
                >
                    {items.length}
                </span>

            </div>


            <div className="space-y-2">

                {items.map((item, index) => (

                    <div
                        key={`${item}-${index}`}
                        className="
                            flex
                            gap-3
                            rounded-xl
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-lowest)]
                            px-4
                            py-3
                        "
                    >

                        <CheckCircle2
                            size={17}
                            className="
                                mt-0.5
                                shrink-0
                                text-[var(--primary)]
                            "
                        />


                        <p
                            className="
                                text-sm
                                leading-6
                                text-[var(--on-surface-variant)]
                            "
                        >
                            {item}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    );

}


/* =========================================================
   ## JOB DESCRIPTION SECTION
========================================================= */

function JobDescriptionSection({

    jobDescription,

}) {

    const [expanded, setExpanded] =
        useState(false);


    const formattedDescription =
        formatJobDescription(jobDescription);

    const shouldTruncate =
        formattedDescription.length > 900;


    const visibleText =
        expanded || !shouldTruncate
            ? formattedDescription
            : `${formattedDescription.slice(0, 900)}...`;


    return (

        <SectionCard>

            <SectionHeader
                icon={<FileSearch size={21} />}
                eyebrow="Opportunity"
                title="Job Description"
                description="The original job information used for your AI analysis."
            />


            <div className="p-5 sm:p-7">

                {jobDescription ? (

                    <>

                        <div
                            className="
                                rounded-2xl
                                bg-[var(--surface-container-low)]
                                p-5
                                sm:p-6
                            "
                        >

                            <p
                                className="
                                    whitespace-pre-wrap
                                    text-sm
                                    leading-7
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                {visibleText}
                            </p>

                        </div>


                        {shouldTruncate && (

                            <button
                                type="button"
                                onClick={() =>
                                    setExpanded(
                                        !expanded
                                    )
                                }
                                className="
                                    mt-4
                                    inline-flex
                                    items-center
                                    gap-2
                                    text-sm
                                    font-bold
                                    text-[var(--primary)]
                                    transition
                                    hover:opacity-75
                                "
                            >

                                {expanded
                                    ? (
                                        <>
                                            Show less
                                            <ChevronUp size={17} />
                                        </>
                                    )
                                    : (
                                        <>
                                            Read full description
                                            <ChevronDown size={17} />
                                        </>
                                    )}

                            </button>

                        )}

                    </>

                ) : (

                    <EmptyAnalysis
                        icon={<FileSearch size={25} />}
                        title="No job description available"
                        description="The job description has not been added to this workspace."
                    />

                )}

            </div>

        </SectionCard>

    );

}


/* =========================================================
   ## JOB ANALYSIS SECTION
========================================================= */

function JobAnalysisSection({

    analysis,
    onRun,
    loading,

}) {

    const hasAnalysis =
        Boolean(
            analysis?.summary ||
            analysis?.responsibilities?.length ||
            analysis?.requiredSkills?.length ||
            analysis?.preferredSkills?.length
        );


    return (

        <SectionCard>

            <SectionHeader
                icon={<BrainCircuit size={21} />}
                eyebrow="AI Intelligence"
                title="Job Analysis"
                description="A structured breakdown of what this role expects from a candidate."
                action={
                    <RunAIButton
                        onClick={onRun}
                        loading={loading}
                        label={
                            hasAnalysis
                                ? "Run Again"
                                : "Analyze Job"
                        }
                    />
                }
            />


            {loading ? (

                <AnalysisLoading
                    message="Understanding the responsibilities, skills, qualifications, and important keywords for this role."
                />

            ) : !hasAnalysis ? (

                <EmptyAnalysis
                    icon={<BrainCircuit size={26} />}
                    title="Job analysis is ready to begin"
                    description="Run the analysis to extract the most important requirements from this job opportunity."
                />

            ) : (

                <div className="space-y-8 p-5 sm:p-7">


                    {/* =====================================
                        ## AI SUMMARY
                    ===================================== */}

                    {analysis.summary && (

                        <div
                            className="
                                rounded-3xl
                                border
                                border-[var(--primary-fixed)]
                                bg-[var(--primary-fixed)]/40
                                p-5
                                sm:p-6
                            "
                        >

                            <div className="flex gap-4">

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-[var(--primary)]
                                        text-white
                                    "
                                >
                                    <Sparkles size={18} />
                                </div>


                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            uppercase
                                            tracking-[0.12em]
                                            text-[var(--primary)]
                                        "
                                    >
                                        AI Summary
                                    </p>


                                    <p
                                        className="
                                            mt-3
                                            text-sm
                                            leading-7
                                            text-[var(--on-primary-fixed)]
                                        "
                                    >
                                        {analysis.summary}
                                    </p>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* =====================================
                        ## RESPONSIBILITIES
                    ===================================== */}

                    {analysis.responsibilities?.length > 0 && (

                        <InsightList
                            title="Core Responsibilities"
                            icon={<BriefcaseBusiness size={16} />}
                            items={analysis.responsibilities}
                            variant="success"
                        />

                    )}


                    {/* =====================================
                        ## SKILLS
                    ===================================== */}

                    <div
                        className="
                            grid
                            gap-6
                            lg:grid-cols-2
                        "
                    >

                        {analysis.requiredSkills?.length > 0 && (

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-[var(--outline-variant)]
                                    p-5
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-[var(--primary-fixed)]
                                            text-[var(--primary)]
                                        "
                                    >
                                        <Check size={18} />
                                    </div>


                                    <div>

                                        <h3 className="font-bold text-[var(--on-surface)]">
                                            Required Skills
                                        </h3>

                                        <p className="text-xs text-[var(--on-surface-variant)]">
                                            Important for the role
                                        </p>

                                    </div>

                                </div>


                                <div className="mt-5 flex flex-wrap gap-2">

                                    {analysis.requiredSkills.map(
                                        (skill, index) => (

                                            <Tag
                                                key={`${skill}-${index}`}
                                                variant="primary"
                                            >
                                                {skill}
                                            </Tag>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {analysis.preferredSkills?.length > 0 && (

                            <div
                                className="
                                    rounded-2xl
                                    border
                                    border-[var(--outline-variant)]
                                    p-5
                                "
                            >

                                <div className="flex items-center gap-3">

                                    <div
                                        className="
                                            flex
                                            h-9
                                            w-9
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-[var(--secondary-container)]
                                            text-[var(--secondary)]
                                        "
                                    >
                                        <TrendingUp size={18} />
                                    </div>


                                    <div>

                                        <h3 className="font-bold text-[var(--on-surface)]">
                                            Preferred Skills
                                        </h3>

                                        <p className="text-xs text-[var(--on-surface-variant)]">
                                            Helpful additional strengths
                                        </p>

                                    </div>

                                </div>


                                <div className="mt-5 flex flex-wrap gap-2">

                                    {analysis.preferredSkills.map(
                                        (skill, index) => (

                                            <Tag
                                                key={`${skill}-${index}`}
                                                variant="warning"
                                            >
                                                {skill}
                                            </Tag>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    {/* =====================================
                        ## QUALIFICATIONS
                    ===================================== */}

                    {(analysis.experienceRequired ||
                        analysis.educationRequired) && (

                            <div>

                                <div className="mb-4 flex items-center gap-2">

                                    <GraduationCap
                                        size={18}
                                        className="text-[var(--primary)]"
                                    />

                                    <h3 className="font-[var(--font-heading)] font-bold text-[var(--on-surface)]">
                                        Qualifications
                                    </h3>

                                </div>


                                <div className="grid gap-4 md:grid-cols-2">

                                    {analysis.experienceRequired && (

                                        <div
                                            className="
                                            rounded-2xl
                                            bg-[var(--surface-container-low)]
                                            p-5
                                        "
                                        >

                                            <p
                                                className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.12em]
                                                text-[var(--on-surface-variant)]
                                            "
                                            >
                                                Experience Required
                                            </p>


                                            <p
                                                className="
                                                mt-3
                                                text-sm
                                                leading-6
                                                text-[var(--on-surface)]
                                            "
                                            >
                                                {analysis.experienceRequired}
                                            </p>

                                        </div>

                                    )}


                                    {analysis.educationRequired && (

                                        <div
                                            className="
                                            rounded-2xl
                                            bg-[var(--surface-container-low)]
                                            p-5
                                        "
                                        >

                                            <p
                                                className="
                                                text-xs
                                                font-bold
                                                uppercase
                                                tracking-[0.12em]
                                                text-[var(--on-surface-variant)]
                                            "
                                            >
                                                Education Required
                                            </p>


                                            <p
                                                className="
                                                mt-3
                                                text-sm
                                                leading-6
                                                text-[var(--on-surface)]
                                            "
                                            >
                                                {analysis.educationRequired}
                                            </p>

                                        </div>

                                    )}

                                </div>

                            </div>

                        )}


                    {/* =====================================
                        ## KEYWORDS
                    ===================================== */}

                    {analysis.keywords?.length > 0 && (

                        <div>

                            <div className="mb-4 flex items-center gap-2">

                                <Search
                                    size={18}
                                    className="text-[var(--primary)]"
                                />

                                <h3 className="font-[var(--font-heading)] font-bold text-[var(--on-surface)]">
                                    Important Keywords
                                </h3>

                            </div>


                            <div className="flex flex-wrap gap-2">

                                {analysis.keywords.map(
                                    (keyword, index) => (

                                        <Tag
                                            key={`${keyword}-${index}`}
                                        >
                                            {keyword}
                                        </Tag>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </div>

            )}

        </SectionCard>

    );

}


/* =========================================================
   ## JOB MATCH SECTION
========================================================= */

function JobMatchSection({

    jobMatch,
    onRun,
    loading,

}) {

    const hasMatch =
        typeof jobMatch?.score === "number";


    return (

        <SectionCard>

            <SectionHeader
                icon={<Target size={21} />}
                eyebrow="AI Intelligence"
                title="Your Job Match"
                description="How well your current profile aligns with this opportunity."
                action={
                    <RunAIButton
                        onClick={onRun}
                        loading={loading}
                        label={
                            hasMatch
                                ? "Run Again"
                                : "Check Match"
                        }
                    />
                }
            />


            {loading ? (

                <AnalysisLoading
                    message="Comparing your profile, education, skills, and experience with the job requirements."
                />

            ) : !hasMatch ? (

                <EmptyAnalysis
                    icon={<Target size={26} />}
                    title="Your match has not been analyzed"
                    description="Run the AI match analysis to understand where your profile aligns and where you can improve."
                />

            ) : (

                <div className="space-y-8 p-5 sm:p-7">


                    <ScoreDisplay
                        score={jobMatch.score}
                        title="Job Match Score"
                    />


                    <div className="grid gap-8 lg:grid-cols-2">

                        <InsightList
                            title="What Already Matches"
                            icon={<BadgeCheck size={16} />}
                            items={jobMatch.matchedSkills}
                            variant="success"
                        />


                        <InsightList
                            title="Skills to Strengthen"
                            icon={<TriangleAlert size={16} />}
                            items={jobMatch.missingSkills}
                            variant="warning"
                        />

                    </div>


                    {jobMatch.strengths?.length > 0 && (

                        <div>

                            <div className="mb-4 flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[var(--primary-fixed)]
                                        text-[var(--primary)]
                                    "
                                >
                                    <TrendingUp size={17} />
                                </div>


                                <div>

                                    <h3 className="font-[var(--font-heading)] font-bold text-[var(--on-surface)]">
                                        Your Existing Strengths
                                    </h3>

                                    <p className="text-xs text-[var(--on-surface-variant)]">
                                        Things your profile already demonstrates
                                    </p>

                                </div>

                            </div>


                            <div className="space-y-3">

                                {jobMatch.strengths.map(
                                    (strength, index) => (

                                        <div
                                            key={`${strength}-${index}`}
                                            className="
                                                flex
                                                gap-4
                                                rounded-2xl
                                                border
                                                border-[var(--outline-variant)]
                                                bg-[var(--surface-container-low)]
                                                p-4
                                            "
                                        >

                                            <CheckCircle2
                                                size={19}
                                                className="
                                                    mt-0.5
                                                    shrink-0
                                                    text-[var(--primary)]
                                                "
                                            />


                                            <p
                                                className="
                                                    text-sm
                                                    leading-6
                                                    text-[var(--on-surface-variant)]
                                                "
                                            >
                                                {strength}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}


                    {jobMatch.analyzedAt && (

                        <p className="text-xs text-[var(--on-surface-variant)]">

                            Last analyzed{" "}

                            {formatDateTime(
                                jobMatch.analyzedAt
                            )}

                        </p>

                    )}

                </div>

            )}

        </SectionCard>

    );

}


/* =========================================================
   ## SKILL GAP CARD
========================================================= */

function SkillGapCard({ gap, index }) {
    const config = getImportanceConfig(gap.importance);

    return (
        <article
            className={`
                group
                relative
                overflow-hidden
                rounded-[1.75rem]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                shadow-[var(--shadow-sm)]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-[var(--shadow-md)]
            `}
        >
            {/* =====================================================
                ## PRIORITY ACCENT
            ===================================================== */}

            <div
                className={`
                    absolute
                    left-0
                    top-0
                    h-full
                    w-1.5
                    ${config.border}
                `}
            />


            <div className="p-5 pl-6 sm:p-7 sm:pl-8">


                {/* =================================================
                    ## HEADER
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


                    {/* =============================================
                        ## SKILL IDENTITY
                    ============================================= */}

                    <div className="flex min-w-0 items-start gap-4">


                        {/* Number */}

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-[var(--surface-container-low)]
                                font-[var(--font-heading)]
                                text-sm
                                font-extrabold
                                text-[var(--primary)]
                            "
                        >
                            {String(index + 1).padStart(2, "0")}
                        </div>


                        {/* Skill */}

                        <div className="min-w-0">


                            <p
                                className="
                                    mb-2
                                    text-[11px]
                                    font-bold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                Skill Gap
                            </p>


                            <h3
                                className="
                                    font-[var(--font-heading)]
                                    text-xl
                                    font-extrabold
                                    leading-tight
                                    tracking-tight
                                    text-[var(--on-surface)]
                                    sm:text-2xl
                                "
                            >
                                {gap.skill}
                            </h3>

                        </div>

                    </div>


                    {/* =============================================
                        ## IMPORTANCE BADGE
                    ============================================= */}

                    <span
                        className={`
                            inline-flex
                            shrink-0
                            items-center
                            gap-2
                            self-start
                            rounded-full
                            px-3.5
                            py-2
                            text-xs
                            font-bold
                            ${config.badge}
                        `}
                    >
                        <span className="flex items-center">
                            {config.icon}
                        </span>

                        {config.label}
                    </span>

                </div>


                {/* =================================================
                    ## DIVIDER
                ================================================= */}

                {(gap.reason || gap.recommendation) && (
                    <div className="my-7 h-px bg-[var(--outline-variant)]" />
                )}


                {/* =================================================
                    ## CONTENT
                ================================================= */}

                <div className="space-y-6">


                    {/* =============================================
                        ## WHY THIS MATTERS
                    ============================================= */}

                    {gap.reason && (

                        <section>


                            {/* Section Label */}

                            <div className="mb-3 flex items-center gap-2.5">


                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[var(--secondary-container)]
                                        text-[var(--secondary)]
                                    "
                                >
                                    <CircleAlert size={16} />
                                </div>


                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-extrabold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Why this matters
                                    </p>


                                    <p
                                        className="
                                            text-xs
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        Why this skill is important for this role
                                    </p>

                                </div>

                            </div>


                            {/* Reason */}

                            <p
                                className="
                                    max-w-4xl
                                    text-sm
                                    leading-7
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                {gap.reason}
                            </p>

                        </section>

                    )}


                    {/* =============================================
                        ## RECOMMENDED ACTION
                    ============================================= */}

                    {gap.recommendation && (

                        <section
                            className="
                                relative
                                overflow-hidden
                                rounded-2xl
                                border
                                border-[var(--primary-fixed-dim)]
                                bg-[var(--primary-fixed)]/55
                                p-5
                                sm:p-6
                            "
                        >


                            {/* Decorative circle */}

                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-10
                                    -top-10
                                    h-28
                                    w-28
                                    rounded-full
                                    bg-white/30
                                    blur-2xl
                                "
                            />


                            <div className="relative flex gap-4">


                                {/* Icon */}

                                <div
                                    className="
                                        flex
                                        h-11
                                        w-11
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-[var(--primary)]
                                        text-white
                                        shadow-sm
                                    "
                                >
                                    <Lightbulb size={19} />
                                </div>


                                {/* Recommendation */}

                                <div className="min-w-0">


                                    <div className="flex flex-wrap items-center gap-2">

                                        <h4
                                            className="
                                                text-base
                                                font-extrabold
                                                text-[var(--on-primary-fixed)]
                                            "
                                        >
                                            Recommended next step
                                        </h4>


                                        <span
                                            className="
                                                rounded-full
                                                bg-white/45
                                                px-2.5
                                                py-1
                                                text-[10px]
                                                font-bold
                                                uppercase
                                                tracking-wider
                                                text-[var(--on-primary-fixed-variant)]
                                            "
                                        >
                                            Action Plan
                                        </span>

                                    </div>


                                    <p
                                        className="
                                            mt-3
                                            max-w-4xl
                                            text-sm
                                            leading-7
                                            text-[var(--on-primary-fixed-variant)]
                                        "
                                    >
                                        {gap.recommendation}
                                    </p>

                                </div>

                            </div>

                        </section>

                    )}

                </div>

            </div>

        </article>
    );
}


/* =========================================================
   ## SKILL GAPS SECTION
========================================================= */

function SkillGapsSection({

    skillGaps,
    onRun,
    loading,

}) {

    const gaps =
        skillGaps || EMPTY_ARRAY;


    return (

        <SectionCard>

            <SectionHeader
                icon={<TrendingUp size={21} />}
                eyebrow="AI Intelligence"
                title="Skill Gaps"
                description="The most important areas you can strengthen to become a better fit for this role."
                action={
                    <RunAIButton
                        onClick={onRun}
                        loading={loading}
                        label={
                            gaps.length
                                ? "Run Again"
                                : "Find Skill Gaps"
                        }
                    />
                }
            />


            {loading ? (

                <AnalysisLoading
                    message="Identifying the most important skills missing from your current profile and creating actionable recommendations."
                />

            ) : gaps.length === 0 ? (

                <EmptyAnalysis
                    icon={<TrendingUp size={26} />}
                    title="No skill gap analysis yet"
                    description="Run the analysis to discover which skills could have the biggest impact on your job readiness."
                />

            ) : (

                <div className="p-5 sm:p-7">


                    {/* =====================================
                        ## INTRODUCTION
                    ===================================== */}

                    <div
                        className="
                            mb-6
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            bg-[var(--surface-container-low)]
                            p-4
                        "
                    >

                        <Target
                            size={19}
                            className="
                                mt-0.5
                                shrink-0
                                text-[var(--primary)]
                            "
                        />


                        <p
                            className="
                                text-sm
                                leading-6
                                text-[var(--on-surface-variant)]
                            "
                        >
                            These recommendations are ordered by
                            importance. Focus first on{" "}

                            <strong className="text-[var(--on-surface)]">
                                critical
                            </strong>{" "}

                            and{" "}

                            <strong className="text-[var(--on-surface)]">
                                high-priority
                            </strong>{" "}

                            skills for the greatest impact.

                        </p>

                    </div>


                    <div className="space-y-5">

                        {gaps.map(
                            (gap, index) => (

                                <SkillGapCard
                                    key={
                                        gap._id ||
                                        `${gap.skill}-${index}`
                                    }
                                    gap={gap}
                                    index={index}
                                />

                            )
                        )}

                    </div>

                </div>

            )}

        </SectionCard>

    );

}


/* =========================================================
   ## RESUME ATS SECTION
========================================================= */

function ResumeATSSection({

    ats,
    onRun,
    loading,

}) {

    const hasATS =
        typeof ats?.score === "number";


    return (

        <SectionCard>

            <SectionHeader
                icon={<ShieldCheck size={21} />}
                eyebrow="AI Intelligence"
                title="Resume ATS Analysis"
                description="See how well your resume aligns with the keywords and requirements of this job."
                action={
                    <RunAIButton
                        onClick={onRun}
                        loading={loading}
                        label={
                            hasATS
                                ? "Run Again"
                                : "Analyze Resume"
                        }
                    />
                }
            />


            {loading ? (

                <AnalysisLoading
                    message="Comparing your resume with the job requirements and checking important ATS keywords."
                />

            ) : !hasATS ? (

                <EmptyAnalysis
                    icon={<ShieldCheck size={26} />}
                    title="No resume analysis available"
                    description="Once you have a resume connected to this workspace, AI can analyze its ATS compatibility with this job."
                />

            ) : (

                <div className="space-y-8 p-5 sm:p-7">


                    <ScoreDisplay
                        score={ats.score}
                        title="ATS Compatibility Score"
                    />


                    <div className="grid gap-8 lg:grid-cols-2">

                        {ats.matchedKeywords?.length > 0 && (

                            <div>

                                <div className="mb-4 flex items-center gap-2">

                                    <CheckCircle2
                                        size={18}
                                        className="text-[var(--primary)]"
                                    />

                                    <h3 className="font-bold text-[var(--on-surface)]">
                                        Matched Keywords
                                    </h3>

                                </div>


                                <div className="flex flex-wrap gap-2">

                                    {ats.matchedKeywords.map(
                                        (keyword, index) => (

                                            <Tag
                                                key={`${keyword}-${index}`}
                                                variant="success"
                                            >
                                                {keyword}
                                            </Tag>

                                        )
                                    )}

                                </div>

                            </div>

                        )}


                        {ats.missingKeywords?.length > 0 && (

                            <div>

                                <div className="mb-4 flex items-center gap-2">

                                    <XCircle
                                        size={18}
                                        className="text-[var(--error)]"
                                    />

                                    <h3 className="font-bold text-[var(--on-surface)]">
                                        Missing Keywords
                                    </h3>

                                </div>


                                <div className="flex flex-wrap gap-2">

                                    {ats.missingKeywords.map(
                                        (keyword, index) => (

                                            <Tag
                                                key={`${keyword}-${index}`}
                                                variant="danger"
                                            >
                                                {keyword}
                                            </Tag>

                                        )
                                    )}

                                </div>

                            </div>

                        )}

                    </div>


                    <div className="grid gap-8 lg:grid-cols-2">

                        <InsightList
                            title="Resume Strengths"
                            icon={<CheckCircle2 size={16} />}
                            items={ats.strengths}
                            variant="success"
                        />


                        <InsightList
                            title="Areas to Improve"
                            icon={<TriangleAlert size={16} />}
                            items={ats.weaknesses}
                            variant="danger"
                        />

                    </div>


                    {ats.suggestions?.length > 0 && (

                        <div
                            className="
                                rounded-3xl
                                bg-[var(--primary-fixed)]/50
                                p-5
                                sm:p-6
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
                                        rounded-2xl
                                        bg-[var(--primary)]
                                        text-white
                                    "
                                >
                                    <Lightbulb size={19} />
                                </div>


                                <div>

                                    <h3
                                        className="
                                            font-[var(--font-heading)]
                                            text-lg
                                            font-bold
                                            text-[var(--on-primary-fixed)]
                                        "
                                    >
                                        Suggested Improvements
                                    </h3>


                                    <p className="text-xs text-[var(--on-primary-fixed-variant)]">
                                        Practical actions to improve your resume
                                    </p>

                                </div>

                            </div>


                            <div className="mt-5 space-y-3">

                                {ats.suggestions.map(
                                    (suggestion, index) => (

                                        <div
                                            key={`${suggestion}-${index}`}
                                            className="
                                                flex
                                                gap-3
                                                rounded-xl
                                                bg-white/50
                                                p-4
                                            "
                                        >

                                            <ArrowRight
                                                size={17}
                                                className="
                                                    mt-0.5
                                                    shrink-0
                                                    text-[var(--primary)]
                                                "
                                            />


                                            <p
                                                className="
                                                    text-sm
                                                    leading-6
                                                    text-[var(--on-primary-fixed-variant)]
                                                "
                                            >
                                                {suggestion}
                                            </p>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    )}

                </div>

            )}

        </SectionCard>

    );

}



/* =========================================================
   ## PREPARATION PLAN SECTION
========================================================= */

function PreparationPlanSection({

    workspace,

    onGenerate,

    loading,

}) {


    /* =============================================
       ## REQUIREMENTS
    ============================================= */

    const hasJobAnalysis =

        Boolean(
            workspace?.jobAnalysis?.analyzedAt
        );


    const hasJobMatch =

        Boolean(
            workspace?.jobMatch?.analyzedAt
        );


    const hasSkillGaps =

        workspace?.skillGaps?.length > 0;


    const isReady =

        hasJobAnalysis &&
        hasJobMatch &&
        hasSkillGaps;


    const completedSteps = [

        hasJobAnalysis,

        hasJobMatch,

        hasSkillGaps,

    ].filter(Boolean).length;


    const requirements = [

        {
            label: "Job Analysis",

            completed: hasJobAnalysis,

            description:
                "Understand the role requirements and responsibilities.",
        },

        {
            label: "Job Match",

            completed: hasJobMatch,

            description:
                "Evaluate how your profile fits this opportunity.",
        },

        {
            label: "Skill Gap Analysis",

            completed: hasSkillGaps,

            description:
                "Identify the most important areas to improve.",
        },

    ];


    return (

        <section

            className="
                relative
                overflow-hidden
                rounded-[2rem]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                shadow-[var(--shadow-sm)]
            "

        >


            {/* =========================================
                BACKGROUND DECORATION
            ========================================= */}

            <div

                className="
                    pointer-events-none
                    absolute
                    -right-24
                    -top-24
                    h-64
                    w-64
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
                    -bottom-28
                    -left-28
                    h-64
                    w-64
                    rounded-full
                    bg-[var(--secondary-fixed)]
                    opacity-30
                    blur-3xl
                "

            />


            <div className="relative p-5 sm:p-7 lg:p-8">


                {/* =====================================
                    HEADER
                ===================================== */}

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
                                text-xs
                                font-bold
                                text-[var(--on-primary-fixed)]
                            "

                        >

                            <Sparkles
                                size={14}
                            />

                            AI Preparation


                        </div>


                        {/* Title */}

                        <h2

                            className="
                                mt-5
                                text-2xl
                                font-black
                                tracking-tight
                                text-[var(--on-surface)]
                                sm:text-3xl
                            "

                        >

                            Your personalized preparation plan


                        </h2>


                        {/* Description */}

                        <p

                            className="
                                mt-3
                                max-w-xl
                                text-sm
                                leading-7
                                text-[var(--on-surface-variant)]
                                sm:text-base
                            "

                        >

                            Skillio will combine your job requirements,
                            profile match, and skill gaps into a
                            personalized step-by-step preparation roadmap.


                        </p>


                    </div>


                    {/* =================================
                        PROGRESS BADGE
                    ================================= */}

                    <div

                        className="
                            flex
                            shrink-0
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-low)]
                            px-4
                            py-3
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

                            <ClipboardList
                                size={21}
                            />

                        </div>


                        <div>


                            <p

                                className="
                                    text-xs
                                    font-semibold
                                    text-[var(--on-surface-variant)]
                                "

                            >

                                Preparation readiness


                            </p>


                            <p

                                className="
                                    mt-0.5
                                    text-lg
                                    font-black
                                    text-[var(--on-surface)]
                                "

                            >

                                {completedSteps}/3 complete


                            </p>


                        </div>


                    </div>


                </div>


                {/* =====================================
                    REQUIREMENTS
                ===================================== */}

                <div

                    className="
                        mt-8
                        grid
                        gap-3
                        md:grid-cols-3
                    "

                >

                    {requirements.map(
                        (requirement) => (

                            <div

                                key={
                                    requirement.label
                                }

                                className={`
                                    rounded-2xl
                                    border
                                    p-4
                                    transition-all
                                    ${requirement.completed

                                        ? `
                                                border-[var(--primary-fixed)]
                                                bg-[var(--primary-fixed)]/40
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
                                        items-start
                                        gap-3
                                    "

                                >


                                    {/* Status Icon */}

                                    <div

                                        className={`
                                            flex
                                            h-9
                                            w-9
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            ${requirement.completed

                                                ? `
                                                        bg-[var(--primary)]
                                                        text-[var(--on-primary)]
                                                    `

                                                : `
                                                        bg-[var(--surface-container-high)]
                                                        text-[var(--on-surface-variant)]
                                                    `
                                            }
                                        `}

                                    >

                                        {requirement.completed ? (

                                            <Check
                                                size={18}
                                                strokeWidth={3}
                                            />

                                        ) : (

                                            <Clock3
                                                size={17}
                                            />

                                        )}

                                    </div>


                                    <div>


                                        <p

                                            className="
                                                text-sm
                                                font-bold
                                                text-[var(--on-surface)]
                                            "

                                        >

                                            {
                                                requirement.label
                                            }


                                        </p>


                                        <p

                                            className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-[var(--on-surface-variant)]
                                            "

                                        >

                                            {
                                                requirement.description
                                            }


                                        </p>


                                    </div>


                                </div>


                            </div>

                        )

                    )}


                </div>


                {/* =====================================
                    PROGRESS BAR
                ===================================== */}

                <div className="mt-7">


                    <div

                        className="
                            flex
                            items-center
                            justify-between
                            gap-4
                            text-xs
                        "

                    >

                        <span

                            className="
                                font-semibold
                                text-[var(--on-surface-variant)]
                            "

                        >

                            AI analysis progress


                        </span>


                        <span

                            className="
                                font-black
                                text-[var(--primary)]
                            "

                        >

                            {Math.round(
                                (completedSteps / 3) * 100
                            )}%


                        </span>


                    </div>


                    <div

                        className="
                            mt-2
                            h-2.5
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

                                width:
                                    `${(completedSteps / 3) * 100}%`,

                            }}

                        />

                    </div>


                </div>


                {/* =====================================
                    CTA AREA
                ===================================== */}

                <div

                    className="
                        mt-8
                        flex
                        flex-col
                        gap-5
                        rounded-[1.5rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-low)]
                        p-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:p-6
                    "

                >


                    {/* Text */}

                    <div className="max-w-xl">


                        {isReady ? (

                            <>

                                <div

                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "

                                >

                                    <BadgeCheck

                                        size={20}

                                        className="
                                            text-[var(--primary)]
                                        "

                                    />


                                    <h3

                                        className="
                                            text-base
                                            font-black
                                            text-[var(--on-surface)]
                                        "

                                    >

                                        You're ready to start preparing


                                    </h3>


                                </div>


                                <p

                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-[var(--on-surface-variant)]
                                    "

                                >

                                    Generate your personalized AI roadmap
                                    with prioritized tasks for technical
                                    skills, behavioral preparation,
                                    resume improvements, and more.


                                </p>

                            </>

                        ) : (

                            <>

                                <div

                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "

                                >

                                    <CircleAlert

                                        size={20}

                                        className="
                                            text-[var(--secondary)]
                                        "

                                    />


                                    <h3

                                        className="
                                            text-base
                                            font-black
                                            text-[var(--on-surface)]
                                        "

                                    >

                                        Complete the required analyses first


                                    </h3>


                                </div>


                                <p

                                    className="
                                        mt-2
                                        text-sm
                                        leading-6
                                        text-[var(--on-surface-variant)]
                                    "

                                >

                                    Complete Job Analysis, Job Match,
                                    and Skill Gap Analysis to unlock
                                    your personalized preparation plan.


                                </p>

                            </>

                        )}


                    </div>


                    {/* =================================
                        BUTTON
                    ================================= */}

                    <button

                        type="button"

                        onClick={onGenerate}

                        disabled={
                            !isReady ||
                            loading
                        }

                        className={`
                            inline-flex
                            min-h-12
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            px-5
                            py-3
                            text-sm
                            font-bold
                            transition-all
                            duration-300

                            ${isReady && !loading

                                ? `
                                        bg-[var(--primary)]
                                        text-[var(--on-primary)]
                                        shadow-[var(--shadow-sm)]
                                        hover:-translate-y-0.5
                                        hover:shadow-[var(--shadow-md)]
                                    `

                                : `
                                        cursor-not-allowed
                                        bg-[var(--surface-container-high)]
                                        text-[var(--on-surface-variant)]
                                    `
                            }
                        `}

                    >

                        {loading ? (

                            <>

                                <LoaderCircle

                                    size={18}

                                    className="animate-spin"

                                />


                                Generating plan...


                            </>

                        ) : (

                            <>

                                <WandSparkles
                                    size={18}
                                />


                                Generate Plan


                            </>

                        )}


                    </button>


                </div>


                {/* =====================================
                    READY MESSAGE
                ===================================== */}

                {isReady && (

                    <div

                        className="
                            mt-5
                            flex
                            items-start
                            gap-3
                            rounded-2xl
                            bg-[var(--primary-fixed)]/50
                            px-4
                            py-3
                        "

                    >

                        <Sparkles

                            size={18}

                            className="
                                mt-0.5
                                shrink-0
                                text-[var(--primary)]
                            "

                        />


                        <p

                            className="
                                text-xs
                                leading-6
                                text-[var(--on-primary-fixed-variant)]
                            "

                        >

                            Your AI analyses are complete.
                            Generate the plan whenever you're ready—
                            you can regenerate it later if your
                            job analysis changes.


                        </p>


                    </div>

                )}


            </div>


        </section>

    );

}


/* =========================================================
   ## MAIN PAGE
========================================================= */

export default function JobWorkspaceDetails() {


    /* =============================================
       ## ROUTER
    ============================================= */

    const navigate = useNavigate();

    const { jobId } = useParams();


    /* =============================================
       ## LOCAL STATE
    ============================================= */

    const [workspaceLoading, setWorkspaceLoading] =
        useState(true);


    /* =============================================
       ## JOB WORKSPACE HOOK

       IMPORTANT:
       Adjust only these method names if your existing
       hook uses different names.
    ============================================= */

    const {

        currentJobWorkspace: workspace,
        isLoading,
        isAnalyzingJob,
        isAnalyzingMatch,
        isAnalyzingSkillGaps,
        isAnalyzingResumeATS,

        getJobWorkspace,

        analyzeJobWorkspace,

        analyzeJobMatch,

        analyzeSkillGaps,

        analyzeResumeATS,

    } = useJobWorkspace();

    const {
        currentResume,
        resumes,
        getAllResumes,
    } = useResume();


    const {

        currentPreparationPlan,

        generatePreparationPlan,

        isGenerating,

    } = usePreparationPlan();


    /* =============================================
       ## LOADING STATES

       Supports either an object-based loading structure
       or simple boolean fallback.
    ============================================= */

    const jobAnalysisLoading =
        isAnalyzingJob;

    const jobMatchLoading =
        isAnalyzingMatch;

    const skillGapsLoading =
        isAnalyzingSkillGaps;

    const atsLoading =
        isAnalyzingResumeATS;


    /* =============================================
       ## FETCH WORKSPACE
    ============================================= */

    useEffect(() => {

        async function loadWorkspace() {

            try {

                setWorkspaceLoading(true);

                await getJobWorkspace(
                    jobId
                );

            } catch (error) {

                console.error(error);

                toast.error(
                    error?.message ||
                    "Unable to load workspace."
                );

            } finally {

                setWorkspaceLoading(false);

            }

        }


        if (jobId) {

            loadWorkspace();

        }

        getAllResumes().catch((error) => {
            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to load resumes."
            );
        });


    }, [
        jobId,
        getJobWorkspace,
        getAllResumes,
    ]);


    /* =============================================
       ## AI ACTIONS
    ============================================= */

    async function handleJobAnalysis() {

        try {

            await analyzeJobWorkspace(
                workspace._id
            );

            toast.success(
                "Job analysis completed."
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error?.message ||
                "Job analysis failed."
            );

        }

    }


    async function handleJobMatch() {

        try {

            await analyzeJobMatch(
                workspace._id
            );

            toast.success(
                "Job match analysis completed."
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error?.message ||
                "Job match analysis failed."
            );

        }

    }


    async function handleSkillGaps() {

        try {

            await analyzeSkillGaps(
                workspace._id
            );

            toast.success(
                "Skill gap analysis completed."
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error?.message ||
                "Skill gap analysis failed."
            );

        }

    }


    async function handleATSAnalysis() {

        const resumeId =
            workspace?.resumeATSAnalysis?.resumeId ||
            currentResume?._id ||
            resumes.find(
                (resume) =>
                    resume.isPrimary &&
                    resume.extractedText
            )?._id ||
            resumes.find(
                (resume) => resume.extractedText
            )?._id;

        if (!resumeId) {
            toast.error(
                "Upload or parse a resume before running ATS analysis."
            );
            return;
        }

        try {

            await analyzeResumeATS(
                workspace._id,
                resumeId
            );

            toast.success(
                "Resume ATS analysis completed."
            );

        } catch (error) {

            console.error(error);

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Resume ATS analysis failed."
            );

        }

    }


    /* =============================================
   ## GENERATE PREPARATION PLAN
============================================= */

    async function handleGeneratePreparationPlan() {

        if (!workspace?._id) {

            toast.error(
                "Job workspace is not available."
            );

            return;

        }


        const hasJobAnalysis =
            Boolean(
                workspace?.jobAnalysis?.analyzedAt
            );


        const hasJobMatch =
            Boolean(
                workspace?.jobMatch?.analyzedAt
            );


        const hasSkillGaps =
            workspace?.skillGaps?.length > 0;


        /*
            Your backend requires:
    
            - Job analysis
            - Job match analysis
            - Skill gap analysis
    
            ATS analysis is NOT required by your backend.
        */

        if (!hasJobAnalysis) {

            toast.error(
                "Please complete the Job Analysis first."
            );

            return;

        }


        if (!hasJobMatch) {

            toast.error(
                "Please complete the Job Match Analysis first."
            );

            return;

        }


        if (!hasSkillGaps) {

            toast.error(
                "Please complete the Skill Gap Analysis first."
            );

            return;

        }


        try {

            const response =
                await generatePreparationPlan(
                    workspace._id
                );


            const preparationPlan =
                response?.data?.data
                    ?.preparationPlan;


            toast.success(
                "Your AI preparation plan is ready!"
            );


            if (preparationPlan?._id) {

                navigate(
                    `/preparation-plans/${preparationPlan._id}`
                );

            }

        } catch (error) {

            console.error(error);


            toast.error(

                error?.response?.data?.message ||

                "Failed to generate preparation plan."

            );

        }

    }


    /* =============================================
       ## DATES
    ============================================= */

    const createdDate =
        useMemo(
            () =>
                formatDate(
                    workspace?.createdAt
                ),
            [workspace?.createdAt]
        );


    const updatedDate =
        useMemo(
            () =>
                formatDate(
                    workspace?.updatedAt
                ),
            [workspace?.updatedAt]
        );


    /* =============================================
       ## PAGE LOADING
    ============================================= */

    if (workspaceLoading || (isLoading && !workspace)) {

        return (

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-[var(--background)]
                    px-4
                "
            >

                <div className="text-center">

                    <div
                        className="
                            mx-auto
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
                        <LoaderCircle
                            size={30}
                            className="animate-spin"
                        />
                    </div>


                    <h2
                        className="
                            mt-5
                            font-[var(--font-heading)]
                            text-xl
                            font-bold
                            text-[var(--on-surface)]
                        "
                    >
                        Loading workspace
                    </h2>


                    <p className="mt-2 text-sm text-[var(--on-surface-variant)]">
                        Preparing your job intelligence.
                    </p>

                </div>

            </div>

        );

    }


    /* =============================================
       ## NOT FOUND
    ============================================= */

    if (!workspace) {

        return (

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-[var(--background)]
                    px-4
                "
            >

                <div className="max-w-md text-center">

                    <div
                        className="
                            mx-auto
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-3xl
                            bg-[var(--surface-container-low)]
                            text-[var(--on-surface-variant)]
                        "
                    >
                        <BriefcaseBusiness size={30} />
                    </div>


                    <h1
                        className="
                            mt-6
                            font-[var(--font-heading)]
                            text-2xl
                            font-extrabold
                            text-[var(--on-surface)]
                        "
                    >
                        Workspace not found
                    </h1>


                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6
                            text-[var(--on-surface-variant)]
                        "
                    >
                        This job workspace may have been deleted or is no longer available.
                    </p>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/job-workspaces")
                        }
                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-[var(--primary)]
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                        "
                    >
                        <ArrowLeft size={17} />

                        Back to Workspaces

                    </button>

                </div>

            </div>

        );

    }


    /* =====================================================
       ## PAGE UI
    ===================================================== */

    return (

        <div className="min-h-screen bg-[var(--background)]">


            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-5
                    sm:px-6
                    sm:py-8
                    lg:px-8
                    lg:py-10
                "
            >


                {/* =========================================
                    ## BACK BUTTON
                ========================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/job-workspaces")
                    }
                    className="
                        mb-6
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        px-3
                        py-2
                        text-sm
                        font-bold
                        text-[var(--on-surface-variant)]
                        transition
                        hover:bg-[var(--surface-container-low)]
                        hover:text-[var(--on-surface)]
                    "
                >

                    <ArrowLeft size={17} />

                    Back to Workspaces

                </button>


                {/* =========================================
                    ## WORKSPACE HERO
                ========================================= */}

                <header
                    className="
                        relative
                        mb-7
                        overflow-hidden
                        rounded-[2rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        p-6
                        shadow-[var(--shadow-sm)]
                        sm:p-8
                        lg:p-10
                    "
                >

                    <div
                        className="
                            absolute
                            -right-24
                            -top-24
                            h-72
                            w-72
                            rounded-full
                            bg-[var(--primary-fixed)]/60
                            blur-3xl
                        "
                    />


                    <div className="relative">

                        <div
                            className="
                                flex
                                flex-col
                                gap-7
                                lg:flex-row
                                lg:items-start
                                lg:justify-between
                            "
                        >


                            <div
                                className="
                                    flex
                                    min-w-0
                                    items-start
                                    gap-4
                                    sm:gap-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-15
                                        w-15
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-[var(--primary)]
                                        text-white
                                        shadow-md
                                        sm:h-17
                                        sm:w-17
                                    "
                                >
                                    <Building2 size={28} />
                                </div>


                                <div className="min-w-0">

                                    <div
                                        className="
                                            mb-3
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <span
                                            className="
                                                rounded-full
                                                bg-[var(--primary-fixed)]
                                                px-3
                                                py-1
                                                text-xs
                                                font-bold
                                                capitalize
                                                text-[var(--on-primary-fixed)]
                                            "
                                        >
                                            {workspace.status || "active"}
                                        </span>


                                        {workspace.source && (

                                            <span
                                                className="
                                                    text-xs
                                                    font-semibold
                                                    capitalize
                                                    text-[var(--on-surface-variant)]
                                                "
                                            >
                                                {workspace.source} workspace
                                            </span>

                                        )}

                                    </div>


                                    <h1
                                        className="
                                            font-[var(--font-heading)]
                                            text-3xl
                                            font-extrabold
                                            tracking-tight
                                            text-[var(--on-surface)]
                                            sm:text-4xl
                                        "
                                    >
                                        {workspace.role}
                                    </h1>


                                    <div
                                        className="
                                            mt-3
                                            flex
                                            items-center
                                            gap-2
                                            text-[var(--on-surface-variant)]
                                        "
                                    >

                                        <Building2 size={17} />


                                        <span className="font-semibold">

                                            {workspace.company}

                                        </span>

                                    </div>

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-3
                                    lg:flex-col
                                    lg:items-end
                                "
                            >

                                {updatedDate && (

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            bg-[var(--surface-container-low)]
                                            px-3
                                            py-2
                                            text-xs
                                            font-medium
                                            text-[var(--on-surface-variant)]
                                        "
                                    >

                                        <Clock3 size={14} />

                                        Updated {updatedDate}

                                    </div>

                                )}


                                {createdDate && (

                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            px-2
                                            py-1
                                            text-xs
                                            text-[var(--on-surface-variant)]
                                        "
                                    >

                                        <CalendarDays size={14} />

                                        Created {createdDate}

                                    </div>

                                )}

                            </div>

                        </div>


                        {workspace.jobDescription && (

                            <div
                                className="
                                    mt-8
                                    border-t
                                    border-[var(--outline-variant)]
                                    pt-6
                                "
                            >

                                <p
                                    className="
                                        max-w-4xl
                                        text-sm
                                        leading-7
                                        text-[var(--on-surface-variant)]
                                    "
                                >

                                    {formatJobDescription(
                                        workspace.jobDescription
                                    ).slice(0, 320)}

                                    {formatJobDescription(
                                        workspace.jobDescription
                                    ).length > 320
                                        ? "..."
                                        : ""}

                                </p>

                            </div>

                        )}

                    </div>

                </header>


                {/* =========================================
                    ## MAIN LAYOUT
                ========================================= */}

                <div
                    className="
                        grid
                        gap-6
                        xl:grid-cols-[minmax(0,1fr)_340px]
                    "
                >


                    {/* =====================================
                        ## MAIN CONTENT
                    ===================================== */}

                    <main className="min-w-0 space-y-6">

                        <JobDescriptionSection
                            jobDescription={
                                workspace.jobDescription
                            }
                        />


                        <JobAnalysisSection
                            analysis={
                                workspace.jobAnalysis
                            }
                            onRun={handleJobAnalysis}
                            loading={jobAnalysisLoading}
                        />


                        <JobMatchSection
                            jobMatch={
                                workspace.jobMatch
                            }
                            onRun={handleJobMatch}
                            loading={jobMatchLoading}
                        />


                        <SkillGapsSection
                            skillGaps={
                                workspace.skillGaps
                            }
                            onRun={handleSkillGaps}
                            loading={skillGapsLoading}
                        />


                        <ResumeATSSection
                            ats={
                                workspace.resumeATSAnalysis
                            }
                            onRun={handleATSAnalysis}
                            loading={atsLoading}
                        />

                        <PreparationPlanSection

                            workspace={workspace}

                            onGenerate={
                                handleGeneratePreparationPlan
                            }

                            loading={
                                isGenerating
                            }

                        />

                    </main>


                    {/* =====================================
                        ## SIDEBAR
                    ===================================== */}

                    <aside
                        className="
                            space-y-6
                            xl:sticky
                            xl:top-6
                            xl:h-fit
                        "
                    >


                        {/* =============================================
    ## WORKSPACE OVERVIEW
============================================= */}

                        <SectionCard>

                            <div className="p-5 sm:p-6">


                                {/* =========================================
            ## CARD HEADER
        ========================================= */}

                                <div className="flex items-start justify-between gap-4">


                                    <div className="flex items-center gap-3">


                                        {/* Icon */}

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
                                            <BarChart3 size={20} />
                                        </div>


                                        {/* Title */}

                                        <div>

                                            <h2
                                                className="
                            font-[var(--font-heading)]
                            text-lg
                            font-extrabold
                            tracking-tight
                            text-[var(--on-surface)]
                        "
                                            >
                                                Workspace Overview
                                            </h2>


                                            <p
                                                className="
                            mt-0.5
                            text-xs
                            leading-5
                            text-[var(--on-surface-variant)]
                        "
                                            >
                                                Your preparation snapshot
                                            </p>

                                        </div>

                                    </div>


                                    {/* AI Badge */}

                                    <div
                                        className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--surface-container-low)]
                    text-[var(--primary)]
                "
                                    >
                                        <Sparkles size={16} />
                                    </div>

                                </div>


                                {/* =========================================
            ## OVERVIEW METRICS
        ========================================= */}

                                <div className="mt-7 space-y-3">


                                    {/* =====================================
                ## JOB MATCH
            ===================================== */}

                                    <OverviewMetric
                                        icon={
                                            <Target size={18} />
                                        }
                                        iconClassName="
                    bg-[var(--primary-fixed)]
                    text-[var(--primary)]
                "
                                        label="Job Match"
                                        description="How well your profile fits this role"
                                        value={
                                            typeof workspace.jobMatch?.score === "number"
                                                ? `${workspace.jobMatch.score}%`
                                                : "—"
                                        }
                                        score={
                                            typeof workspace.jobMatch?.score === "number"
                                                ? workspace.jobMatch.score
                                                : null
                                        }
                                        valueClassName={
                                            getScoreColor(
                                                workspace.jobMatch?.score
                                            )
                                        }
                                    />


                                    {/* =====================================
                ## SKILL GAPS
            ===================================== */}

                                    <OverviewMetric
                                        icon={
                                            <BrainCircuit size={18} />
                                        }
                                        iconClassName="
                    bg-[var(--secondary-container)]
                    text-[var(--secondary)]
                "
                                        label="Skill Gaps"
                                        description={
                                            workspace.skillGaps?.length
                                                ? `${workspace.skillGaps.length} areas identified for improvement`
                                                : "No skill gaps identified yet"
                                        }
                                        value={
                                            workspace.skillGaps?.length || 0
                                        }
                                        valueClassName="
                    text-[var(--secondary)]
                "
                                        footer={
                                            workspace.skillGaps?.length > 0 && (

                                                <SkillGapPrioritySummary
                                                    gaps={workspace.skillGaps}
                                                />

                                            )
                                        }
                                    />


                                    {/* =====================================
                ## RESUME ATS
            ===================================== */}

                                    <OverviewMetric
                                        icon={
                                            <FileCheck2 size={18} />
                                        }
                                        iconClassName="
                    bg-[var(--tertiary-fixed)]
                    text-[var(--tertiary)]
                "
                                        label="Resume ATS"
                                        description={
                                            typeof workspace.resumeATSAnalysis?.score ===
                                                "number"
                                                ? "Resume compatibility with this job"
                                                : "Resume analysis not available yet"
                                        }
                                        value={
                                            typeof workspace.resumeATSAnalysis?.score ===
                                                "number"
                                                ? `${workspace.resumeATSAnalysis.score}%`
                                                : "—"
                                        }
                                        score={
                                            typeof workspace.resumeATSAnalysis?.score ===
                                                "number"
                                                ? workspace.resumeATSAnalysis.score
                                                : null
                                        }
                                        valueClassName={
                                            getScoreColor(
                                                workspace.resumeATSAnalysis?.score
                                            )
                                        }
                                    />

                                </div>


                                {/* =========================================
            ## PREPARATION SUMMARY
        ========================================= */}

                                <div
                                    className="
                mt-6
                rounded-2xl
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-low)]
                p-4
            "
                                >


                                    <div className="flex items-start gap-3">


                                        <div
                                            className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--surface-container-lowest)]
                        text-[var(--primary)]
                        shadow-sm
                    "
                                        >
                                            <ClipboardCheck size={17} />
                                        </div>


                                        <div className="min-w-0">


                                            <p
                                                className="
                            text-sm
                            font-bold
                            text-[var(--on-surface)]
                        "
                                            >
                                                Preparation Status
                                            </p>


                                            <p
                                                className="
                            mt-1
                            text-xs
                            leading-5
                            text-[var(--on-surface-variant)]
                        "
                                            >
                                                {getPreparationStatus(workspace)}
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        </SectionCard>


                        {/* =================================
                            ## AI INTELLIGENCE CARD
                        ================================= */}

                        <div
                            className="
                                overflow-hidden
                                rounded-3xl
                                bg-[var(--primary)]
                                p-6
                                text-white
                                shadow-[var(--shadow-md)]
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
                                "
                            >
                                <Sparkles size={21} />
                            </div>


                            <h3
                                className="
                                    mt-5
                                    font-[var(--font-heading)]
                                    text-xl
                                    font-bold
                                "
                            >
                                AI Job Intelligence
                            </h3>


                            <p
                                className="
                                    mt-3
                                    text-sm
                                    leading-7
                                    text-white/75
                                "
                            >
                                Understand the opportunity, measure your
                                compatibility, identify important skill gaps,
                                and prepare a stronger resume.

                            </p>


                            <div className="mt-6 space-y-3 text-sm">

                                <div className="flex items-center gap-3">

                                    <CheckCircle2
                                        size={16}
                                        className="text-white/80"
                                    />

                                    Job requirements

                                </div>


                                <div className="flex items-center gap-3">

                                    <CheckCircle2
                                        size={16}
                                        className="text-white/80"
                                    />

                                    Profile match

                                </div>


                                <div className="flex items-center gap-3">

                                    <CheckCircle2
                                        size={16}
                                        className="text-white/80"
                                    />

                                    Personalized skill gaps

                                </div>


                                <div className="flex items-center gap-3">

                                    <CheckCircle2
                                        size={16}
                                        className="text-white/80"
                                    />

                                    Resume optimization

                                </div>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </div>

    );

}


/* =========================================================
   ## OVERVIEW METRIC
========================================================= */

function OverviewMetric({

    icon,

    iconClassName = "",

    label,

    description,

    value,

    valueClassName = "",

    score = null,

    footer,

}) {

    return (

        <div
            className="
                rounded-2xl
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                p-4
                transition
                duration-200
                hover:bg-[var(--surface-container-low)]
            "
        >


            {/* =========================================
                ## TOP CONTENT
            ========================================= */}

            <div className="flex items-start gap-3">


                {/* Icon */}

                <div
                    className={`
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        ${iconClassName}
                    `}
                >
                    {icon}
                </div>


                {/* Text */}

                <div className="min-w-0 flex-1">


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
                                    text-sm
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                            >
                                {label}
                            </p>


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

                        </div>


                        {/* Value */}

                        <span
                            className={`
                                shrink-0
                                font-[var(--font-heading)]
                                text-xl
                                font-extrabold
                                tracking-tight
                                ${valueClassName}
                            `}
                        >
                            {value}
                        </span>

                    </div>


                    {/* =================================
                        ## SCORE PROGRESS BAR
                    ================================= */}

                    {typeof score === "number" && (

                        <div className="mt-4">


                            <div
                                className="
                                    h-2
                                    overflow-hidden
                                    rounded-full
                                    bg-[var(--surface-container-high)]
                                "
                            >

                                <div
                                    className={`
                                        h-full
                                        rounded-full
                                        transition-all
                                        duration-700
                                        ${getScoreBarColor(score)}
                                    `}
                                    style={{
                                        width: `${Math.min(
                                            Math.max(score, 0),
                                            100
                                        )}%`,
                                    }}
                                />

                            </div>

                        </div>

                    )}


                    {/* =================================
                        ## OPTIONAL FOOTER
                    ================================= */}

                    {footer && (

                        <div className="mt-4">

                            {footer}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}


/* =========================================================
   ## SKILL GAP PRIORITY SUMMARY
========================================================= */

function SkillGapPrioritySummary({ gaps = [] }) {

    const criticalCount = gaps.filter(
        (gap) => gap.importance === "critical"
    ).length;


    const highCount = gaps.filter(
        (gap) => gap.importance === "high"
    ).length;


    const mediumCount = gaps.filter(
        (gap) => gap.importance === "medium"
    ).length;


    const lowCount = gaps.filter(
        (gap) => gap.importance === "low"
    ).length;


    return (

        <div
            className="
                flex
                flex-wrap
                gap-2
            "
        >


            {criticalCount > 0 && (

                <PriorityPill
                    label={`${criticalCount} Critical`}
                    className="
                        bg-[var(--error-container)]
                        text-[var(--on-error-container)]
                    "
                />

            )}


            {highCount > 0 && (

                <PriorityPill
                    label={`${highCount} High`}
                    className="
                        bg-[var(--secondary-container)]
                        text-[var(--secondary)]
                    "
                />

            )}


            {mediumCount > 0 && (

                <PriorityPill
                    label={`${mediumCount} Medium`}
                    className="
                        bg-[var(--surface-container-high)]
                        text-[var(--on-surface)]
                    "
                />

            )}


            {lowCount > 0 && (

                <PriorityPill
                    label={`${lowCount} Low`}
                    className="
                        bg-[var(--primary-fixed)]
                        text-[var(--primary)]
                    "
                />

            )}

        </div>

    );
}


/* =========================================================
   ## PRIORITY PILL
========================================================= */

function PriorityPill({

    label,

    className = "",

}) {

    return (

        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-2.5
                py-1
                text-[10px]
                font-bold
                ${className}
            `}
        >
            {label}
        </span>

    );
}

/* =========================================================
   ## SCORE TEXT COLOR
========================================================= */

function getScoreColor(score) {

    if (typeof score !== "number") {
        return "text-[var(--on-surface-variant)]";
    }


    if (score >= 75) {
        return "text-[var(--primary)]";
    }


    if (score >= 50) {
        return "text-[var(--secondary)]";
    }


    return "text-[var(--error)]";
}

/* =========================================================
   ## SCORE PROGRESS COLOR
========================================================= */

function getScoreBarColor(score) {

    if (score >= 75) {
        return "bg-[var(--primary)]";
    }


    if (score >= 50) {
        return "bg-[var(--secondary)]";
    }


    return "bg-[var(--error)]";
}

/* =========================================================
   ## PREPARATION STATUS
========================================================= */

function getPreparationStatus(workspace) {

    const hasJobAnalysis =
        Boolean(workspace.jobAnalysis?.summary);


    const hasJobMatch =
        typeof workspace.jobMatch?.score === "number";


    const hasSkillGaps =
        workspace.skillGaps?.length > 0;


    const hasATS =
        typeof workspace.resumeATSAnalysis?.score ===
        "number";


    const completedSteps = [

        hasJobAnalysis,

        hasJobMatch,

        hasSkillGaps,

        hasATS,

    ].filter(Boolean).length;


    if (completedSteps === 4) {

        return "Your workspace intelligence is complete and ready for preparation.";

    }


    if (completedSteps === 3) {

        return "Great progress. One more analysis will complete your preparation snapshot.";

    }


    if (completedSteps === 2) {

        return "Your job intelligence is taking shape. Continue with the remaining analyses.";

    }


    if (completedSteps === 1) {

        return "You have started your analysis. Run more AI tools to build your complete preparation profile.";

    }


    return "Run your AI analyses to build a complete understanding of this opportunity.";
}
