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
    BrainCircuit,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronUp,
    CircleAlert,
    Clock3,
    Code2,
    FileText,
    Filter,
    GraduationCap,
    LoaderCircle,
    Pencil,
    Plus,
    Search,
    Sparkles,
    Target,
    Trash2,
    Trophy,
    X,
    XCircle,
    Building2,
    LayoutList,
    RotateCcw,
    CircleDashed,
    BriefcaseBusiness,
    Lightbulb,
} from "lucide-react";

import { toast } from "sonner";

import usePreparationPlan
    from "../hooks/usePreparationPlan";


/* =========================================================
   ## CONSTANTS
========================================================= */

const EMPTY_ARRAY = [];


const CATEGORY_CONFIG = {

    technical: {
        label: "Technical",
        icon: <Code2 size={16} />,
        className:
            "bg-[var(--primary-fixed)] text-[var(--primary)]",
    },

    resume: {
        label: "Resume",
        icon: <FileText size={16} />,
        className:
            "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
    },

    behavioral: {
        label: "Behavioral",
        icon: <BrainCircuit size={16} />,
        className:
            "bg-[var(--surface-container-high)] text-[var(--on-surface)]",
    },

    "system-design": {
        label: "System Design",
        icon: <LayoutList size={16} />,
        className:
            "bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]",
    },

    company: {
        label: "Company",
        icon: <Building2 size={16} />,
        className:
            "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
    },

    other: {
        label: "Other",
        icon: <Lightbulb size={16} />,
        className:
            "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]",
    },

};


const PRIORITY_CONFIG = {

    high: {
        label: "High",
        className:
            "bg-[var(--error-container)] text-[var(--on-error-container)]",
        dot:
            "bg-[var(--error)]",
    },

    medium: {
        label: "Medium",
        className:
            "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
        dot:
            "bg-[var(--secondary)]",
    },

    low: {
        label: "Low",
        className:
            "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]",
        dot:
            "bg-[var(--outline)]",
    },

};


/* =========================================================
   ## UTILITY FUNCTIONS
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


function formatMinutes(minutes) {

    if (!minutes || minutes <= 0) {
        return "No estimate";
    }

    if (minutes < 60) {
        return `${minutes} min`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours}h`;
    }

    return `${hours}h ${remainingMinutes}m`;

}


function getCategoryConfig(category) {

    return (
        CATEGORY_CONFIG[category] ||
        CATEGORY_CONFIG.other
    );

}


function getPriorityConfig(priority) {

    return (
        PRIORITY_CONFIG[priority] ||
        PRIORITY_CONFIG.medium
    );

}


function getStatusConfig(status) {

    if (status === "completed") {

        return {
            label: "Completed",
            className:
                "bg-[var(--primary-fixed)] text-[var(--primary)]",
        };

    }


    if (status === "in-progress") {

        return {
            label: "In Progress",
            className:
                "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
        };

    }


    return {
        label: "Not Started",
        className:
            "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]",
    };

}


/* =========================================================
   ## SECTION CARD
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
   ## CIRCULAR PROGRESS
========================================================= */

function CircularProgress({

    progress = 0,

}) {

    const radius = 42;

    const circumference =
        2 * Math.PI * radius;

    const offset =
        circumference -
        (Math.min(progress, 100) / 100) *
        circumference;


    return (

        <div
            className="
                relative
                h-36
                w-36
                shrink-0
            "
        >

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


                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="var(--primary)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="
                        transition-all
                        duration-700
                    "
                />

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
                    {progress}%
                </span>


                <span
                    className="
                        mt-1
                        text-[11px]
                        font-semibold
                        uppercase
                        tracking-[0.1em]
                        text-[var(--on-surface-variant)]
                    "
                >
                    Complete
                </span>

            </div>

        </div>

    );

}


/* =========================================================
   ## STAT CARD
========================================================= */

function StatCard({

    icon,
    label,
    value,
    description,

}) {

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
                    {icon}
                </div>


                <span
                    className="
                        font-[var(--font-heading)]
                        text-2xl
                        font-extrabold
                        text-[var(--on-surface)]
                    "
                >
                    {value}
                </span>

            </div>


            <p
                className="
                    mt-4
                    text-sm
                    font-bold
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

    );

}


/* =========================================================
   ## CATEGORY BADGE
========================================================= */

function CategoryBadge({

    category,

}) {

    const config =
        getCategoryConfig(category);


    return (

        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-3
                py-1.5
                text-xs
                font-bold
                ${config.className}
            `}
        >

            {config.icon}

            {config.label}

        </span>

    );

}


/* =========================================================
   ## PRIORITY BADGE
========================================================= */

function PriorityBadge({

    priority,

}) {

    const config =
        getPriorityConfig(priority);


    return (

        <span
            className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                px-3
                py-1.5
                text-xs
                font-bold
                ${config.className}
            `}
        >

            <span
                className={`
                    h-1.5
                    w-1.5
                    rounded-full
                    ${config.dot}
                `}
            />

            {config.label}

        </span>

    );

}


/* =========================================================
   ## TASK CARD
========================================================= */

function TaskCard({

    task,
    onToggle,
    onEdit,
    onDelete,
    isUpdating,

}) {

    const [expanded, setExpanded] =
        useState(false);


    const category =
        getCategoryConfig(task.category);


    const formattedDueDate =
        formatDate(task.dueDate);


    return (

        <article
            className={`
                group
                rounded-2xl
                border
                transition-all
                duration-200
                ${
                    task.isCompleted
                        ? `
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-low)]
                            opacity-80
                        `
                        : `
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-lowest)]
                            hover:-translate-y-0.5
                            hover:shadow-[var(--shadow-sm)]
                        `
                }
            `}
        >

            <div
                className="
                    flex
                    gap-4
                    p-4
                    sm:p-5
                "
            >

                {/* CHECKBOX */}

                <button
                    type="button"
                    onClick={() =>
                        onToggle(task)
                    }
                    disabled={isUpdating}
                    className={`
                        mt-0.5
                        flex
                        h-7
                        w-7
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border
                        transition
                        ${
                            task.isCompleted
                                ? `
                                    border-[var(--primary)]
                                    bg-[var(--primary)]
                                    text-white
                                `
                                : `
                                    border-[var(--outline)]
                                    text-transparent
                                    hover:border-[var(--primary)]
                                `
                        }
                    `}
                    aria-label={
                        task.isCompleted
                            ? "Mark task incomplete"
                            : "Mark task complete"
                    }
                >

                    {task.isCompleted && (

                        <Check
                            size={16}
                            strokeWidth={3}
                        />

                    )}

                </button>


                {/* CONTENT */}

                <div className="min-w-0 flex-1">

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
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
                                    gap-2
                                "
                            >

                                <CategoryBadge
                                    category={
                                        task.category
                                    }
                                />


                                <PriorityBadge
                                    priority={
                                        task.priority
                                    }
                                />

                            </div>


                            <h3
                                className={`
                                    mt-3
                                    font-[var(--font-heading)]
                                    text-base
                                    font-bold
                                    text-[var(--on-surface)]
                                    sm:text-lg
                                    ${
                                        task.isCompleted
                                            ? "line-through"
                                            : ""
                                    }
                                `}
                            >
                                {task.title}
                            </h3>

                        </div>


                        {/* ACTIONS */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                self-start
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    onEdit(task)
                                }
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-[var(--on-surface-variant)]
                                    transition
                                    hover:bg-[var(--surface-container-high)]
                                    hover:text-[var(--primary)]
                                "
                                aria-label="Edit task"
                            >
                                <Pencil size={16} />
                            </button>


                            <button
                                type="button"
                                onClick={() =>
                                    onDelete(task)
                                }
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    text-[var(--on-surface-variant)]
                                    transition
                                    hover:bg-[var(--error-container)]
                                    hover:text-[var(--error)]
                                "
                                aria-label="Delete task"
                            >
                                <Trash2 size={16} />
                            </button>

                        </div>

                    </div>


                    {/* DESCRIPTION */}

                    {task.description && (

                        <div className="mt-3">

                            <p
                                className={`
                                    text-sm
                                    leading-6
                                    text-[var(--on-surface-variant)]
                                    ${
                                        expanded
                                            ? ""
                                            : "line-clamp-2"
                                    }
                                `}
                            >
                                {task.description}
                            </p>


                            {task.description.length > 140 && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setExpanded(
                                            !expanded
                                        )
                                    }
                                    className="
                                        mt-2
                                        inline-flex
                                        items-center
                                        gap-1
                                        text-xs
                                        font-bold
                                        text-[var(--primary)]
                                    "
                                >

                                    {expanded
                                        ? "Show less"
                                        : "Read more"}

                                    {expanded ? (
                                        <ChevronUp size={14} />
                                    ) : (
                                        <ChevronDown size={14} />
                                    )}

                                </button>

                            )}

                        </div>

                    )}


                    {/* META */}

                    <div
                        className="
                            mt-4
                            flex
                            flex-wrap
                            items-center
                            gap-x-5
                            gap-y-2
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
                            <Clock3 size={15} />

                            {formatMinutes(
                                task.estimatedMinutes
                            )}

                        </span>


                        {formattedDueDate && (

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                "
                            >
                                <CalendarDays size={15} />

                                Due {formattedDueDate}

                            </span>

                        )}


                        {task.isCompleted &&
                            task.completedAt && (

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        text-[var(--primary)]
                                    "
                                >

                                    <CheckCircle2
                                        size={15}
                                    />

                                    Completed {
                                        formatDate(
                                            task.completedAt
                                        )
                                    }

                                </span>

                            )}

                    </div>

                </div>

            </div>

        </article>

    );

}


/* =========================================================
   ## TASK MODAL
========================================================= */

function TaskModal({

    mode = "create",
    initialTask,
    onClose,
    onSubmit,
    isSubmitting,

}) {

    const [formData, setFormData] =
        useState({

            title:
                initialTask?.title || "",

            description:
                initialTask?.description || "",

            category:
                initialTask?.category || "technical",

            priority:
                initialTask?.priority || "medium",

            estimatedMinutes:
                initialTask?.estimatedMinutes || 30,

            dueDate:
                initialTask?.dueDate
                    ? new Date(
                        initialTask.dueDate
                    )
                        .toISOString()
                        .split("T")[0]
                    : "",

        });


    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;


        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

    };


    const handleSubmit = (event) => {

        event.preventDefault();


        if (!formData.title.trim()) {

            toast.error(
                "Please enter a task title."
            );

            return;

        }


        onSubmit({
            ...formData,

            title:
                formData.title.trim(),

            description:
                formData.description.trim(),

            estimatedMinutes:
                Number(
                    formData.estimatedMinutes
                ),

            dueDate:
                formData.dueDate || null,

        });

    };


    return (

        <div
            className="
                fixed
                inset-0
                z-[100]
                flex
                items-end
                justify-center
                bg-black/45
                p-0
                backdrop-blur-sm
                sm:items-center
                sm:p-6
            "
        >

            <div
                className="
                    max-h-[94vh]
                    w-full
                    max-w-2xl
                    overflow-y-auto
                    rounded-t-[2rem]
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-lowest)]
                    shadow-2xl
                    sm:rounded-[2rem]
                "
            >

                {/* HEADER */}

                <div
                    className="
                        sticky
                        top-0
                        z-10
                        flex
                        items-center
                        justify-between
                        border-b
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        px-5
                        py-5
                        sm:px-7
                    "
                >

                    <div>

                        <p
                            className="
                                text-[11px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-[var(--primary)]
                            "
                        >
                            Preparation Task
                        </p>


                        <h2
                            className="
                                mt-1
                                font-[var(--font-heading)]
                                text-xl
                                font-extrabold
                                text-[var(--on-surface)]
                            "
                        >
                            {mode === "create"
                                ? "Add New Task"
                                : "Edit Task"}
                        </h2>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            text-[var(--on-surface-variant)]
                            transition
                            hover:bg-[var(--surface-container-high)]
                        "
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        space-y-6
                        p-5
                        sm:p-7
                    "
                >

                    {/* TITLE */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-[var(--on-surface)]
                            "
                        >
                            Task title
                        </label>


                        <input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="What do you need to prepare?"
                            className="
                                w-full
                                rounded-xl
                                border
                                border-[var(--outline)]
                                bg-[var(--surface-container-lowest)]
                                px-4
                                py-3
                                text-sm
                                text-[var(--on-surface)]
                                outline-none
                                transition
                                placeholder:text-[var(--on-surface-variant)]
                                focus:border-[var(--primary)]
                                focus:ring-4
                                focus:ring-[var(--primary-fixed)]
                            "
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div>

                        <label
                            className="
                                mb-2
                                block
                                text-sm
                                font-bold
                                text-[var(--on-surface)]
                            "
                        >
                            Description
                        </label>


                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            placeholder="Add helpful notes or preparation instructions..."
                            className="
                                w-full
                                resize-none
                                rounded-xl
                                border
                                border-[var(--outline)]
                                bg-[var(--surface-container-lowest)]
                                px-4
                                py-3
                                text-sm
                                leading-6
                                text-[var(--on-surface)]
                                outline-none
                                transition
                                placeholder:text-[var(--on-surface-variant)]
                                focus:border-[var(--primary)]
                                focus:ring-4
                                focus:ring-[var(--primary-fixed)]
                            "
                        />

                    </div>


                    {/* CATEGORY + PRIORITY */}

                    <div
                        className="
                            grid
                            gap-5
                            sm:grid-cols-2
                        "
                    >

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                            >
                                Category
                            </label>


                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--outline)]
                                    bg-[var(--surface-container-lowest)]
                                    px-4
                                    py-3
                                    text-sm
                                    text-[var(--on-surface)]
                                    outline-none
                                    focus:border-[var(--primary)]
                                "
                            >

                                <option value="technical">
                                    Technical
                                </option>

                                <option value="resume">
                                    Resume
                                </option>

                                <option value="behavioral">
                                    Behavioral
                                </option>

                                <option value="system-design">
                                    System Design
                                </option>

                                <option value="company">
                                    Company
                                </option>

                                <option value="other">
                                    Other
                                </option>

                            </select>

                        </div>


                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                            >
                                Priority
                            </label>


                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--outline)]
                                    bg-[var(--surface-container-lowest)]
                                    px-4
                                    py-3
                                    text-sm
                                    text-[var(--on-surface)]
                                    outline-none
                                    focus:border-[var(--primary)]
                                "
                            >

                                <option value="high">
                                    High
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="low">
                                    Low
                                </option>

                            </select>

                        </div>

                    </div>


                    {/* TIME + DATE */}

                    <div
                        className="
                            grid
                            gap-5
                            sm:grid-cols-2
                        "
                    >

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                            >
                                Estimated minutes
                            </label>


                            <input
                                type="number"
                                name="estimatedMinutes"
                                min="1"
                                value={
                                    formData.estimatedMinutes
                                }
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--outline)]
                                    bg-[var(--surface-container-lowest)]
                                    px-4
                                    py-3
                                    text-sm
                                    text-[var(--on-surface)]
                                    outline-none
                                    focus:border-[var(--primary)]
                                "
                            />

                        </div>


                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                            >
                                Due date
                            </label>


                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                className="
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--outline)]
                                    bg-[var(--surface-container-lowest)]
                                    px-4
                                    py-3
                                    text-sm
                                    text-[var(--on-surface)]
                                    outline-none
                                    focus:border-[var(--primary)]
                                "
                            />

                        </div>

                    </div>


                    {/* ACTIONS */}

                    <div
                        className="
                            flex
                            flex-col-reverse
                            gap-3
                            border-t
                            border-[var(--outline-variant)]
                            pt-6
                            sm:flex-row
                            sm:justify-end
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="
                                min-h-11
                                rounded-xl
                                border
                                border-[var(--outline)]
                                px-5
                                text-sm
                                font-bold
                                text-[var(--on-surface)]
                                transition
                                hover:bg-[var(--surface-container-high)]
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={isSubmitting}
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
                                transition
                                hover:-translate-y-0.5
                                disabled:cursor-not-allowed
                                disabled:opacity-70
                            "
                        >

                            {isSubmitting ? (

                                <LoaderCircle
                                    size={17}
                                    className="animate-spin"
                                />

                            ) : (

                                <Check size={17} />

                            )}

                            {mode === "create"
                                ? "Add Task"
                                : "Save Changes"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}


/* =========================================================
   ## DELETE MODAL
========================================================= */

function DeleteTaskModal({

    task,
    onClose,
    onConfirm,
    isDeleting,

}) {

    return (

        <div
            className="
                fixed
                inset-0
                z-[110]
                flex
                items-center
                justify-center
                bg-black/45
                p-5
                backdrop-blur-sm
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
                    p-6
                    shadow-2xl
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
                        bg-[var(--error-container)]
                        text-[var(--error)]
                    "
                >
                    <Trash2 size={22} />
                </div>


                <h2
                    className="
                        mt-5
                        font-[var(--font-heading)]
                        text-xl
                        font-extrabold
                        text-[var(--on-surface)]
                    "
                >
                    Delete task?
                </h2>


                <p
                    className="
                        mt-2
                        text-sm
                        leading-6
                        text-[var(--on-surface-variant)]
                    "
                >
                    Are you sure you want to delete
                    {" "}
                    <span
                        className="
                            font-bold
                            text-[var(--on-surface)]
                        "
                    >
                        "{task?.title}"
                    </span>
                    ? This action cannot be undone.
                </p>


                <div
                    className="
                        mt-6
                        flex
                        flex-col-reverse
                        gap-3
                        sm:flex-row
                        sm:justify-end
                    "
                >

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="
                            min-h-11
                            rounded-xl
                            border
                            border-[var(--outline)]
                            px-5
                            text-sm
                            font-bold
                            text-[var(--on-surface)]
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="
                            inline-flex
                            min-h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[var(--error)]
                            px-5
                            text-sm
                            font-bold
                            text-white
                            disabled:opacity-70
                        "
                    >

                        {isDeleting ? (

                            <LoaderCircle
                                size={17}
                                className="animate-spin"
                            />

                        ) : (

                            <Trash2 size={17} />

                        )}

                        Delete Task

                    </button>

                </div>

            </div>

        </div>

    );

}


/* =========================================================
   ## LOADING STATE
========================================================= */

function PageLoading() {

    return (

        <div
            className="
                flex
                min-h-[60vh]
                flex-col
                items-center
                justify-center
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
                    text-lg
                    font-bold
                    text-[var(--on-surface)]
                "
            >
                Loading your preparation plan
            </h2>


            <p
                className="
                    mt-2
                    text-sm
                    text-[var(--on-surface-variant)]
                "
            >
                Gathering your personalized preparation tasks...
            </p>

        </div>

    );

}


/* =========================================================
   ## ERROR STATE
========================================================= */

function ErrorState({

    message,
    onBack,

}) {

    return (

        <div
            className="
                flex
                min-h-[60vh]
                items-center
                justify-center
                px-5
            "
        >

            <div
                className="
                    max-w-md
                    rounded-[2rem]
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-lowest)]
                    p-8
                    text-center
                    shadow-[var(--shadow-sm)]
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
                        bg-[var(--error-container)]
                        text-[var(--error)]
                    "
                >
                    <CircleAlert size={26} />
                </div>


                <h2
                    className="
                        mt-5
                        font-[var(--font-heading)]
                        text-xl
                        font-extrabold
                        text-[var(--on-surface)]
                    "
                >
                    Unable to load plan
                </h2>


                <p
                    className="
                        mt-2
                        text-sm
                        leading-6
                        text-[var(--on-surface-variant)]
                    "
                >
                    {message}
                </p>


                <button
                    type="button"
                    onClick={onBack}
                    className="
                        mt-6
                        inline-flex
                        min-h-11
                        items-center
                        gap-2
                        rounded-xl
                        bg-[var(--primary)]
                        px-5
                        text-sm
                        font-bold
                        text-white
                    "
                >
                    <ArrowLeft size={17} />

                    Back to Plans

                </button>

            </div>

        </div>

    );

}


/* =========================================================
   ## MAIN COMPONENT
========================================================= */

function PreparationPlanDetails() {

    const navigate = useNavigate();

    const {
        planId,
    } = useParams();


    /* =====================================================
       ## API / STORE
    ===================================================== */

    const {

        currentPreparationPlan,

        isLoading,

        isUpdating,

        isGenerating,

        error,

        clearCurrentPreparationPlan,

        getPreparationPlan,

        updateTask,

        addTask,

        deleteTask,

        generatePreparationPlan,

    } = usePreparationPlan();


    /* =====================================================
       ## LOCAL STATE
    ===================================================== */

    const [

        searchQuery,

        setSearchQuery,

    ] = useState("");


    const [

        categoryFilter,

        setCategoryFilter,

    ] = useState("all");


    const [

        priorityFilter,

        setPriorityFilter,

    ] = useState("all");


    const [

        completionFilter,

        setCompletionFilter,

    ] = useState("all");


    const [

        isTaskModalOpen,

        setIsTaskModalOpen,

    ] = useState(false);


    const [

        editingTask,

        setEditingTask,

    ] = useState(null);


    const [

        deletingTask,

        setDeletingTask,

    ] = useState(null);


    const [

        isDeleteLoading,

        setIsDeleteLoading,

    ] = useState(false);


    /* =====================================================
       ## FETCH PLAN
    ===================================================== */

    useEffect(() => {

        if (!planId) return;

        clearCurrentPreparationPlan();


        const loadPlan = async () => {

            try {

                await getPreparationPlan(
                    planId
                );

            } catch {

                // Error handled by hook/store

            }

        };


        loadPlan();

    }, [
        planId,
        clearCurrentPreparationPlan,
        getPreparationPlan,
    ]);


    /* =====================================================
       ## PLAN DATA
    ===================================================== */

    const preparationPlan =
        currentPreparationPlan;


    const tasks =
        preparationPlan?.tasks ||
        EMPTY_ARRAY;


    /* =====================================================
       ## STATISTICS
    ===================================================== */

    const statistics = useMemo(() => {

        const total =
            tasks.length;


        const completed =
            tasks.filter(
                (task) =>
                    task.isCompleted
            ).length;


        const remaining =
            total - completed;


        const totalMinutes =
            tasks.reduce(
                (sum, task) =>
                    sum +
                    (
                        Number(
                            task.estimatedMinutes
                        ) || 0
                    ),
                0
            );


        const remainingMinutes =
            tasks
                .filter(
                    (task) =>
                        !task.isCompleted
                )
                .reduce(
                    (sum, task) =>
                        sum +
                        (
                            Number(
                                task.estimatedMinutes
                            ) || 0
                        ),
                    0
                );


        const highPriority =
            tasks.filter(
                (task) =>
                    task.priority === "high" &&
                    !task.isCompleted
            ).length;


        return {

            total,

            completed,

            remaining,

            totalMinutes,

            remainingMinutes,

            highPriority,

        };

    }, [tasks]);


    /* =====================================================
       ## FILTERED TASKS
    ===================================================== */

    const filteredTasks = useMemo(() => {

        const query =
            searchQuery
                .trim()
                .toLowerCase();


        return tasks.filter((task) => {

            const matchesSearch =
                !query ||
                task.title
                    ?.toLowerCase()
                    .includes(query) ||
                task.description
                    ?.toLowerCase()
                    .includes(query);


            const matchesCategory =
                categoryFilter === "all" ||
                task.category === categoryFilter;


            const matchesPriority =
                priorityFilter === "all" ||
                task.priority === priorityFilter;


            let matchesCompletion = true;


            if (
                completionFilter === "completed"
            ) {

                matchesCompletion =
                    task.isCompleted;

            }


            if (
                completionFilter === "pending"
            ) {

                matchesCompletion =
                    !task.isCompleted;

            }


            return (
                matchesSearch &&
                matchesCategory &&
                matchesPriority &&
                matchesCompletion
            );

        });

    }, [

        tasks,

        searchQuery,

        categoryFilter,

        priorityFilter,

        completionFilter,

    ]);


    /* =====================================================
       ## SORT TASKS
    ===================================================== */

    const sortedTasks = useMemo(() => {

        return [...filteredTasks].sort(
            (a, b) => {

                if (
                    a.isCompleted !==
                    b.isCompleted
                ) {

                    return a.isCompleted
                        ? 1
                        : -1;

                }


                const priorityOrder = {

                    high: 3,

                    medium: 2,

                    low: 1,

                };


                return (
                    (
                        priorityOrder[b.priority] || 0
                    ) -
                    (
                        priorityOrder[a.priority] || 0
                    )
                );

            }
        );

    }, [filteredTasks]);


    /* =====================================================
       ## TOGGLE TASK
    ===================================================== */

    const handleToggleTask =
        async (task) => {

            if (
                !preparationPlan?._id ||
                !task?._id
            ) {
                return;
            }


            try {

                await updateTask(
                    preparationPlan._id,
                    task._id,
                    {
                        isCompleted:
                            !task.isCompleted,
                    }
                );


                toast.success(

                    !task.isCompleted
                        ? "Task completed! 🎉"
                        : "Task marked as incomplete."

                );

            } catch (error) {

                toast.error(

                    error?.response?.data?.message ||
                    "Failed to update task."

                );

            }

        };


    /* =====================================================
       ## ADD TASK
    ===================================================== */

    const handleAddTask =
        async (data) => {

            try {

                await addTask(
                    preparationPlan._id,
                    data
                );


                toast.success(
                    "Task added successfully."
                );


                setIsTaskModalOpen(false);

            } catch (error) {

                toast.error(

                    error?.response?.data?.message ||
                    "Failed to add task."

                );

            }

        };


    /* =====================================================
       ## EDIT TASK
    ===================================================== */

    const handleEditTask =
        async (data) => {

            if (!editingTask) return;


            try {

                await updateTask(

                    preparationPlan._id,

                    editingTask._id,

                    data

                );


                toast.success(
                    "Task updated successfully."
                );


                setEditingTask(null);

            } catch (error) {

                toast.error(

                    error?.response?.data?.message ||
                    "Failed to update task."

                );

            }

        };


    /* =====================================================
       ## DELETE TASK
    ===================================================== */

    const handleDeleteTask =
        async () => {

            if (!deletingTask) return;


            try {

                setIsDeleteLoading(true);


                await deleteTask(

                    preparationPlan._id,

                    deletingTask._id

                );


                toast.success(
                    "Task deleted successfully."
                );


                setDeletingTask(null);

            } catch (error) {

                toast.error(

                    error?.response?.data?.message ||
                    "Failed to delete task."

                );

            } finally {

                setIsDeleteLoading(false);

            }

        };


    /* =====================================================
       ## AI REGENERATE
    ===================================================== */

    const handleRegenerate =
        async () => {

            if (!preparationPlan?.jobId) {

                toast.error(
                    "Job information is unavailable."
                );

                return;

            }


            try {

                await generatePreparationPlan(
                    preparationPlan.jobId
                );


                toast.success(
                    "Your AI preparation plan has been regenerated."
                );

            } catch (error) {

                toast.error(

                    error?.response?.data?.message ||
                    "Failed to regenerate preparation plan."

                );

            }

        };


    /* =====================================================
       ## LOADING
    ===================================================== */

    if (
        isLoading &&
        !preparationPlan
    ) {

        return <PageLoading />;

    }


    /* =====================================================
       ## ERROR
    ===================================================== */

    if (
        !preparationPlan &&
        error
    ) {

        return (

            <ErrorState
                message={error}
                onBack={() =>
                    navigate(
                        "/preparation"
                    )
                }
            />

        );

    }


    if (!preparationPlan) {

        return <PageLoading />;

    }


    /* =====================================================
       ## STATUS
    ===================================================== */

    const statusConfig =
        getStatusConfig(
            preparationPlan.status
        );


    const isCompleted =
        preparationPlan.status ===
        "completed";


    /* =====================================================
       ## RENDER
    ===================================================== */

    return (

        <div
            className="
                min-h-screen
                bg-[var(--surface)]
            "
        >

            <main
                className="
                    mx-auto
                    w-full
                    max-w-[1500px]
                    px-4
                    py-5
                    sm:px-6
                    sm:py-7
                    lg:px-8
                "
            >

                {/* =================================================
                   ## BACK BUTTON
                ================================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/preparation"
                        )
                    }
                    className="
                        mb-5
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
                        hover:bg-[var(--surface-container-high)]
                        hover:text-[var(--on-surface)]
                    "
                >

                    <ArrowLeft size={17} />

                    Back to Preparation Plans

                </button>


                {/* =================================================
                   ## HERO
                ================================================= */}

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

                    <div
                        className="
                            relative
                            overflow-hidden
                            bg-[var(--surface-container-low)]
                            px-5
                            py-7
                            sm:px-8
                            sm:py-9
                        "
                    >

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
                                opacity-60
                                blur-3xl
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

                            {/* LEFT */}

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
                                        gap-2
                                    "
                                >

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
                                            text-[var(--primary)]
                                        "
                                    >

                                        <Sparkles
                                            size={14}
                                        />

                                        AI Preparation Plan

                                    </span>


                                    <span
                                        className={`
                                            inline-flex
                                            items-center
                                            rounded-full
                                            px-3
                                            py-1.5
                                            text-xs
                                            font-bold
                                            ${statusConfig.className}
                                        `}
                                    >
                                        {statusConfig.label}
                                    </span>

                                </div>


                                <h1
                                    className="
                                        mt-4
                                        font-[var(--font-heading)]
                                        text-3xl
                                        font-extrabold
                                        tracking-tight
                                        text-[var(--on-surface)]
                                        sm:text-4xl
                                    "
                                >
                                    {preparationPlan.title}
                                </h1>


                                {preparationPlan.overview && (

                                    <p
                                        className="
                                            mt-4
                                            max-w-3xl
                                            text-sm
                                            leading-7
                                            text-[var(--on-surface-variant)]
                                            sm:text-base
                                        "
                                    >
                                        {
                                            preparationPlan.overview
                                        }
                                    </p>

                                )}


                                <div
                                    className="
                                        mt-5
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-x-5
                                        gap-y-2
                                        text-xs
                                        font-medium
                                        text-[var(--on-surface-variant)]
                                    "
                                >

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <BriefcaseBusiness
                                            size={15}
                                        />

                                        Personalized for your job

                                    </span>


                                    {preparationPlan.generatedAt && (

                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-2
                                            "
                                        >
                                            <CalendarDays
                                                size={15}
                                            />

                                            Generated {
                                                formatDateTime(
                                                    preparationPlan.generatedAt
                                                )
                                            }

                                        </span>

                                    )}

                                </div>

                            </div>


                            {/* RIGHT */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    items-center
                                    gap-5
                                    rounded-[1.75rem]
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-lowest)]
                                    p-6
                                    text-center
                                    sm:flex-row
                                    sm:text-left
                                    lg:flex-col
                                    lg:text-center
                                "
                            >

                                <CircularProgress
                                    progress={
                                        preparationPlan.progress ||
                                        0
                                    }
                                />


                                <div>

                                    <p
                                        className="
                                            text-sm
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        {
                                            statistics.completed
                                        } of {
                                            statistics.total
                                        } tasks completed
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        {
                                            statistics.remaining
                                        } tasks remaining
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* HERO ACTIONS */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            border-t
                            border-[var(--outline-variant)]
                            px-5
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:px-8
                        "
                    >

                        <p
                            className="
                                text-sm
                                text-[var(--on-surface-variant)]
                            "
                        >
                            Keep completing tasks to improve your preparation progress.
                        </p>


                        <div
                            className="
                                flex
                                flex-col
                                gap-3
                                sm:flex-row
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setIsTaskModalOpen(
                                        true
                                    )
                                }
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[var(--outline)]
                                    px-4
                                    text-sm
                                    font-bold
                                    text-[var(--on-surface)]
                                    transition
                                    hover:bg-[var(--surface-container-high)]
                                "
                            >

                                <Plus size={17} />

                                Add Task

                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleRegenerate
                                }
                                disabled={isGenerating}
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
                                    transition
                                    hover:-translate-y-0.5
                                    disabled:cursor-not-allowed
                                    disabled:opacity-70
                                "
                            >

                                {isGenerating ? (

                                    <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                    />

                                ) : (

                                    <RotateCcw
                                        size={17}
                                    />

                                )}

                                {isGenerating
                                    ? "Regenerating..."
                                    : "Regenerate with AI"}

                            </button>

                        </div>

                    </div>

                </section>


                {/* =================================================
                   ## COMPLETED BANNER
                ================================================= */}

                {isCompleted && (

                    <section
                        className="
                            mt-6
                            flex
                            flex-col
                            gap-4
                            rounded-[1.75rem]
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--primary-fixed)]
                            p-6
                            sm:flex-row
                            sm:items-center
                        "
                    >

                        <div
                            className="
                                flex
                                h-14
                                w-14
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-[var(--primary)]
                                text-white
                            "
                        >
                            <Trophy size={27} />
                        </div>


                        <div>

                            <h2
                                className="
                                    font-[var(--font-heading)]
                                    text-xl
                                    font-extrabold
                                    text-[var(--on-primary-fixed)]
                                "
                            >
                                Preparation complete! 🎉
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    leading-6
                                    text-[var(--on-primary-fixed)]
                                    opacity-80
                                "
                            >
                                You've completed every task in this preparation plan. Great work preparing for your opportunity.
                            </p>

                        </div>

                    </section>

                )}


                {/* =================================================
                   ## STATISTICS
                ================================================= */}

                <section
                    className="
                        mt-6
                        grid
                        gap-4
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    <StatCard
                        icon={
                            <CheckCircle2
                                size={20}
                            />
                        }
                        label="Completed"
                        value={
                            statistics.completed
                        }
                        description="Tasks finished successfully"
                    />


                    <StatCard
                        icon={
                            <CircleDashed
                                size={20}
                            />
                        }
                        label="Remaining"
                        value={
                            statistics.remaining
                        }
                        description="Tasks still waiting"
                    />


                    <StatCard
                        icon={
                            <Clock3
                                size={20}
                            />
                        }
                        label="Preparation Time"
                        value={
                            formatMinutes(
                                statistics.remainingMinutes
                            )
                        }
                        description="Estimated remaining time"
                    />


                    <StatCard
                        icon={
                            <Target
                                size={20}
                            />
                        }
                        label="High Priority"
                        value={
                            statistics.highPriority
                        }
                        description="Important tasks remaining"
                    />

                </section>


                {/* =================================================
                   ## TASK SECTION
                ================================================= */}

                <section className="mt-6">

                    <SectionCard>

                        <SectionHeader

                            icon={
                                <LayoutList
                                    size={21}
                                />
                            }

                            eyebrow="Your Roadmap"

                            title="Preparation Tasks"

                            description={`${statistics.total} personalized tasks designed to help you prepare effectively.`}

                        />


                        {/* FILTERS */}

                        <div
                            className="
                                border-b
                                border-[var(--outline-variant)]
                                px-5
                                py-5
                                sm:px-7
                            "
                        >

                            <div
                                className="
                                    grid
                                    gap-4
                                    lg:grid-cols-[1fr_auto_auto_auto]
                                "
                            >

                                {/* SEARCH */}

                                <div
                                    className="
                                        relative
                                    "
                                >

                                    <Search
                                        size={18}
                                        className="
                                            absolute
                                            left-4
                                            top-1/2
                                            -translate-y-1/2
                                            text-[var(--on-surface-variant)]
                                        "
                                    />


                                    <input
                                        value={searchQuery}
                                        onChange={(event) =>
                                            setSearchQuery(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Search tasks..."
                                        className="
                                            min-h-11
                                            w-full
                                            rounded-xl
                                            border
                                            border-[var(--outline)]
                                            bg-[var(--surface-container-lowest)]
                                            py-2
                                            pl-11
                                            pr-4
                                            text-sm
                                            text-[var(--on-surface)]
                                            outline-none
                                            transition
                                            placeholder:text-[var(--on-surface-variant)]
                                            focus:border-[var(--primary)]
                                            focus:ring-4
                                            focus:ring-[var(--primary-fixed)]
                                        "
                                    />

                                </div>


                                {/* CATEGORY */}

                                <select
                                    value={categoryFilter}
                                    onChange={(event) =>
                                        setCategoryFilter(
                                            event.target.value
                                        )
                                    }
                                    className="
                                        min-h-11
                                        rounded-xl
                                        border
                                        border-[var(--outline)]
                                        bg-[var(--surface-container-lowest)]
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-[var(--on-surface)]
                                        outline-none
                                        focus:border-[var(--primary)]
                                    "
                                >

                                    <option value="all">
                                        All Categories
                                    </option>

                                    <option value="technical">
                                        Technical
                                    </option>

                                    <option value="resume">
                                        Resume
                                    </option>

                                    <option value="behavioral">
                                        Behavioral
                                    </option>

                                    <option value="system-design">
                                        System Design
                                    </option>

                                    <option value="company">
                                        Company
                                    </option>

                                    <option value="other">
                                        Other
                                    </option>

                                </select>


                                {/* PRIORITY */}

                                <select
                                    value={priorityFilter}
                                    onChange={(event) =>
                                        setPriorityFilter(
                                            event.target.value
                                        )
                                    }
                                    className="
                                        min-h-11
                                        rounded-xl
                                        border
                                        border-[var(--outline)]
                                        bg-[var(--surface-container-lowest)]
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-[var(--on-surface)]
                                        outline-none
                                        focus:border-[var(--primary)]
                                    "
                                >

                                    <option value="all">
                                        All Priorities
                                    </option>

                                    <option value="high">
                                        High Priority
                                    </option>

                                    <option value="medium">
                                        Medium Priority
                                    </option>

                                    <option value="low">
                                        Low Priority
                                    </option>

                                </select>


                                {/* COMPLETION */}

                                <select
                                    value={completionFilter}
                                    onChange={(event) =>
                                        setCompletionFilter(
                                            event.target.value
                                        )
                                    }
                                    className="
                                        min-h-11
                                        rounded-xl
                                        border
                                        border-[var(--outline)]
                                        bg-[var(--surface-container-lowest)]
                                        px-4
                                        text-sm
                                        font-semibold
                                        text-[var(--on-surface)]
                                        outline-none
                                        focus:border-[var(--primary)]
                                    "
                                >

                                    <option value="all">
                                        All Tasks
                                    </option>

                                    <option value="pending">
                                        Pending
                                    </option>

                                    <option value="completed">
                                        Completed
                                    </option>

                                </select>

                            </div>


                            {/* ACTIVE FILTER INFO */}

                            <div
                                className="
                                    mt-4
                                    flex
                                    items-center
                                    justify-between
                                    gap-4
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        font-medium
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    Showing
                                    {" "}
                                    <span
                                        className="
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        {
                                            sortedTasks.length
                                        }
                                    </span>
                                    {" "}
                                    of
                                    {" "}
                                    {
                                        tasks.length
                                    }
                                    {" "}
                                    tasks
                                </p>


                                {(
                                    searchQuery ||
                                    categoryFilter !== "all" ||
                                    priorityFilter !== "all" ||
                                    completionFilter !== "all"
                                ) && (

                                    <button
                                        type="button"
                                        onClick={() => {

                                            setSearchQuery("");

                                            setCategoryFilter(
                                                "all"
                                            );

                                            setPriorityFilter(
                                                "all"
                                            );

                                            setCompletionFilter(
                                                "all"
                                            );

                                        }}
                                        className="
                                            text-xs
                                            font-bold
                                            text-[var(--primary)]
                                        "
                                    >
                                        Clear filters
                                    </button>

                                )}

                            </div>

                        </div>


                        {/* TASK LIST */}

                        <div
                            className="
                                p-4
                                sm:p-6
                            "
                        >

                            {isUpdating && (

                                <div
                                    className="
                                        mb-4
                                        flex
                                        items-center
                                        gap-3
                                        rounded-xl
                                        bg-[var(--primary-fixed)]
                                        px-4
                                        py-3
                                        text-sm
                                        font-semibold
                                        text-[var(--primary)]
                                    "
                                >

                                    <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                    />

                                    Saving changes...

                                </div>

                            )}


                            {sortedTasks.length > 0 ? (

                                <div className="space-y-3">

                                    {sortedTasks.map(
                                        (task) => (

                                            <TaskCard

                                                key={task._id}

                                                task={task}

                                                onToggle={
                                                    handleToggleTask
                                                }

                                                onEdit={
                                                    setEditingTask
                                                }

                                                onDelete={
                                                    setDeletingTask
                                                }

                                                isUpdating={
                                                    isUpdating
                                                }

                                            />

                                        )
                                    )}

                                </div>

                            ) : (

                                <div
                                    className="
                                        flex
                                        min-h-[320px]
                                        flex-col
                                        items-center
                                        justify-center
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
                                            bg-[var(--surface-container-low)]
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        {tasks.length === 0 ? (
                                            <LayoutList
                                                size={28}
                                            />
                                        ) : (
                                            <Search
                                                size={28}
                                            />
                                        )}
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
                                        {tasks.length === 0
                                            ? "No tasks yet"
                                            : "No matching tasks"}
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
                                        {tasks.length === 0
                                            ? "Add your first preparation task or regenerate this plan with AI."
                                            : "Try changing your search or filters to find the tasks you're looking for."}
                                    </p>


                                    {tasks.length === 0 && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setIsTaskModalOpen(
                                                    true
                                                )
                                            }
                                            className="
                                                mt-5
                                                inline-flex
                                                min-h-11
                                                items-center
                                                gap-2
                                                rounded-xl
                                                bg-[var(--primary)]
                                                px-5
                                                text-sm
                                                font-bold
                                                text-white
                                            "
                                        >

                                            <Plus size={17} />

                                            Add First Task

                                        </button>

                                    )}

                                </div>

                            )}

                        </div>

                    </SectionCard>

                </section>


                {/* =================================================
                   ## FOOTER INFO
                ================================================= */}

                <div
                    className="
                        mt-6
                        flex
                        flex-col
                        gap-4
                        rounded-[1.5rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-low)]
                        p-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
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
                                bg-[var(--primary-fixed)]
                                text-[var(--primary)]
                            "
                        >
                            <Sparkles size={19} />
                        </div>


                        <div>

                            <p
                                className="
                                    text-sm
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                            >
                                AI-powered preparation
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    leading-5
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                Your plan is personalized using your career profile, job analysis, job match, and identified skill gaps.
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={handleRegenerate}
                        disabled={isGenerating}
                        className="
                            inline-flex
                            min-h-11
                            shrink-0
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-[var(--outline)]
                            px-4
                            text-sm
                            font-bold
                            text-[var(--on-surface)]
                            transition
                            hover:bg-[var(--surface-container-high)]
                            disabled:opacity-60
                        "
                    >

                        {isGenerating ? (

                            <LoaderCircle
                                size={17}
                                className="animate-spin"
                            />

                        ) : (

                            <Sparkles size={17} />

                        )}

                        Improve with AI

                    </button>

                </div>

            </main>


            {/* =================================================
               ## ADD TASK MODAL
            ================================================= */}

            {isTaskModalOpen && (

                <TaskModal

                    mode="create"

                    onClose={() =>
                        setIsTaskModalOpen(false)
                    }

                    onSubmit={handleAddTask}

                    isSubmitting={
                        isUpdating
                    }

                />

            )}


            {/* =================================================
               ## EDIT TASK MODAL
            ================================================= */}

            {editingTask && (

                <TaskModal

                    mode="edit"

                    initialTask={
                        editingTask
                    }

                    onClose={() =>
                        setEditingTask(null)
                    }

                    onSubmit={
                        handleEditTask
                    }

                    isSubmitting={
                        isUpdating
                    }

                />

            )}


            {/* =================================================
               ## DELETE TASK MODAL
            ================================================= */}

            {deletingTask && (

                <DeleteTaskModal

                    task={
                        deletingTask
                    }

                    onClose={() =>
                        setDeletingTask(null)
                    }

                    onConfirm={
                        handleDeleteTask
                    }

                    isDeleting={
                        isDeleteLoading
                    }

                />

            )}

        </div>

    );

}


export default PreparationPlanDetails;
