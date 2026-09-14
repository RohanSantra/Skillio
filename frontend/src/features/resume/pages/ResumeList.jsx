import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";
import { toast } from "sonner";

import {
    Award,
    BriefcaseBusiness,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    Clock3,
    FileText,
    FileCheck2,
    Filter,
    Loader2,
    Plus,
    Search,
    Sparkles,
    Star,
    Trash2,
    Upload,
    X,
} from "lucide-react";

import useResume from "../hooks/useResume.js";
import useCareerProfile from "../../career-profile/hooks/useCareerProfile.js";
import HeroStat from "../../../components/HeroStat .jsx";
import ErrorToast from "../../../components/feedback/ErrorToast.jsx";


/* ============================================================
    ## Helper Functions
============================================================ */

const formatDate = (date) => {

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
        ).format(
            new Date(date)
        );

    } catch {

        return null;

    }

};


const formatFileSize = (bytes) => {

    if (
        typeof bytes !== "number" ||
        bytes < 0
    ) {
        return "Unknown size";
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const kb = bytes / 1024;

    if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
    }

    const mb = kb / 1024;

    return `${mb.toFixed(1)} MB`;

};


const getFileTypeLabel = (fileType) => {

    if (!fileType) {
        return "DOCUMENT";
    }

    return fileType.toUpperCase();

};


const hasParsedData = (resume) => {

    const parsedData =
        resume?.parsedData;

    if (!parsedData) {
        return false;
    }

    return Boolean(

        parsedData.name ||
        parsedData.headline ||
        parsedData.summary ||
        parsedData.skills?.length ||
        parsedData.experience?.length ||
        parsedData.projects?.length ||
        parsedData.education?.length

    );

};


/* ============================================================
    ## Resume Card
============================================================ */

function ResumeCard({

    resume,
    onView,
    onSetPrimary,
    onDelete,
    onImport,
    isUpdating,
    isImporting,

}) {

    const parsedData =
        resume?.parsedData || {};

    const parsed =
        hasParsedData(resume);

    const updatedDate =
        formatDate(
            resume?.updatedAt
        );

    const skillCount =
        parsedData.skills?.length || 0;

    const experienceCount =
        parsedData.experience?.length || 0;

    const projectCount =
        parsedData.projects?.length || 0;


    return (

        <article
            className="
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
                hover:-translate-y-1
                hover:shadow-[var(--shadow-md)]
            "
        >

            {/* Primary Accent */}

            {resume.isPrimary && (

                <div
                    className="
                        absolute
                        left-0
                        top-0
                        h-1
                        w-full
                        bg-[var(--primary)]
                    "
                />

            )}


            <div className="p-5 sm:p-6">


                {/* ====================================================
                    Header
                ==================================================== */}

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

                    {/* Identity */}

                    <div
                        className="
                            flex
                            min-w-0
                            flex-1
                            gap-4
                        "
                    >

                        {/* File Icon */}

                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-[var(--primary-fixed)]
                                text-[var(--primary)]
                                transition-transform
                                duration-300
                                group-hover:scale-105
                            "
                        >
                            <FileText size={22} />
                        </div>


                        <div className="min-w-0">

                            {/* Badges */}

                            <div
                                className="
                                    mb-2
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-2
                                "
                            >

                                {resume.isPrimary && (

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1.5
                                            rounded-full
                                            bg-[var(--primary)]
                                            px-2.5
                                            py-1
                                            text-[11px]
                                            font-bold
                                            text-white
                                        "
                                    >
                                        <Star size={12} />

                                        Primary

                                    </span>

                                )}


                                <span
                                    className="
                                        rounded-full
                                        bg-[var(--surface-container-low)]
                                        px-2.5
                                        py-1
                                        text-[11px]
                                        font-bold
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    {getFileTypeLabel(
                                        resume.fileType
                                    )}
                                </span>


                                {parsed && (

                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1
                                            rounded-full
                                            bg-[var(--primary-fixed)]
                                            px-2.5
                                            py-1
                                            text-[11px]
                                            font-bold
                                            text-[var(--primary)]
                                        "
                                    >
                                        <CheckCircle2
                                            size={12}
                                        />

                                        AI Parsed

                                    </span>

                                )}

                            </div>


                            {/* Name */}

                            <h2
                                className="
                                    break-words
                                    font-[var(--font-heading)]
                                    text-lg
                                    font-extrabold
                                    leading-tight
                                    text-[var(--on-surface)]
                                    sm:text-xl
                                "
                            >
                                {parsedData.name ||
                                    resume.fileName}
                            </h2>


                            {/* Headline */}

                            <p
                                className="
                                    mt-1
                                    line-clamp-1
                                    text-sm
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                {parsedData.headline ||
                                    resume.fileName}
                            </p>

                        </div>

                    </div>


                    {/* View Button */}

                    <button
                        type="button"
                        onClick={() =>
                            onView(resume._id)
                        }
                        className="
                            inline-flex
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-[var(--surface-container-low)]
                            px-4
                            py-2.5
                            text-sm
                            font-bold
                            text-[var(--on-surface)]
                            transition-all
                            hover:bg-[var(--primary-fixed)]
                            hover:text-[var(--primary)]
                            sm:w-auto
                            sm:shrink-0
                        "
                    >

                        View Resume

                        <ChevronRight
                            size={16}
                            className="
                                transition-transform
                                duration-200
                                group-hover:translate-x-0.5
                            "
                        />

                    </button>

                </div>


                {/* ====================================================
                    Summary
                ==================================================== */}

                {parsedData.summary && (

                    <div
                        className="
                            mt-6
                            rounded-2xl
                            bg-[var(--surface-container-low)]
                            p-4
                        "
                    >

                        <p
                            className="
                                line-clamp-3
                                text-sm
                                leading-7
                                text-[var(--on-surface-variant)]
                            "
                        >
                            {parsedData.summary}
                        </p>

                    </div>

                )}


                {/* ====================================================
                    Statistics
                ==================================================== */}

                {parsed && (

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
                        "
                    >

                        <ResumeStat
                            icon={
                                <Sparkles size={16} />
                            }
                            label="Skills"
                            value={skillCount}
                        />


                        <ResumeStat
                            icon={
                                <BriefcaseBusiness
                                    size={16}
                                />
                            }
                            label="Experience"
                            value={experienceCount}
                        />


                        <ResumeStat
                            icon={
                                <Award size={16} />
                            }
                            label="Projects"
                            value={projectCount}
                        />

                    </div>

                )}


                {/* ====================================================
                    Footer
                ==================================================== */}

                <div
                    className="
                        mt-6
                        flex
                        flex-col
                        gap-4
                        border-t
                        border-[var(--outline-variant)]
                        pt-5
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* File Info */}

                    <div
                        className="
                            flex
                            flex-wrap
                            items-center
                            gap-x-4
                            gap-y-2
                            text-xs
                            text-[var(--on-surface-variant)]
                        "
                    >

                        <span>
                            {formatFileSize(
                                resume.fileSize
                            )}
                        </span>


                        {updatedDate && (

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                "
                            >
                                <Clock3 size={13} />

                                Updated {updatedDate}

                            </span>

                        )}

                    </div>


                    {/* Actions */}

                    <div
                        className="
                            flex
                            w-full
                            items-center
                            gap-2
                            sm:w-auto
                            sm:justify-end
                        "
                    >
                        <button
                            type="button"
                            disabled={
                                isUpdating ||
                                isImporting ||
                                !hasParsedData(resume)
                            }
                            onClick={() => onImport(resume)}
                            className="
        inline-flex
        flex-1
        items-center
        justify-center
        gap-1.5
        rounded-xl
        bg-[var(--primary-fixed)]
        px-3
        py-2
        text-xs
        font-bold
        text-[var(--primary)]
        transition
        hover:opacity-80
        disabled:cursor-not-allowed
        disabled:opacity-50
        sm:flex-none
    "
                            title={
                                hasParsedData(resume)
                                    ? "Import this resume into your Career Profile"
                                    : "Parse this resume before importing"
                            }
                        >
                            {isImporting ? (
                                <Loader2
                                    size={14}
                                    className="animate-spin"
                                />
                            ) : (
                                <Sparkles size={14} />
                            )}

                            {isImporting
                                ? "Importing..."
                                : "Import to Profile"}
                        </button>

                        {!resume.isPrimary && (

                            <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() =>
                                    onSetPrimary(
                                        resume._id
                                    )
                                }
                                className="
                                    inline-flex
                                    flex-1
                                    items-center
                                    justify-center
                                    gap-1.5
                                    rounded-xl
                                    px-3
                                    py-2
                                    text-xs
                                    font-bold
                                    text-[var(--on-surface-variant)]
                                    transition
                                    hover:bg-[var(--primary-fixed)]
                                    hover:text-[var(--primary)]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    sm:flex-none
                                "
                            >

                                {isUpdating ? (

                                    <Loader2
                                        size={14}
                                        className="
                                            animate-spin
                                        "
                                    />

                                ) : (

                                    <Star size={14} />

                                )}

                                Set Primary

                            </button>

                        )}


                        <button
                            type="button"
                            disabled={isUpdating}
                            onClick={() =>
                                onDelete(resume)
                            }
                            className="
                                inline-flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                text-[var(--error)]
                                transition
                                hover:bg-[var(--error-container)]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                            title="Delete resume"
                        >
                            <Trash2 size={16} />
                        </button>

                    </div>

                </div>

            </div>

        </article>

    );

}


/* ============================================================
    ## Resume Stat
============================================================ */

function ResumeStat({

    icon,
    label,
    value,

}) {

    return (

        <div
            className="
                flex
                flex-col
                items-center
                justify-center
                gap-1
                px-3
                py-4
                text-center
            "
        >

            <div
                className="
                    flex
                    items-center
                    gap-1.5
                    text-[var(--on-surface-variant)]
                "
            >

                {icon}

                <span
                    className="
                        text-xs
                        font-semibold
                    "
                >
                    {label}
                </span>

            </div>


            <span
                className="
                    text-lg
                    font-extrabold
                    text-[var(--on-surface)]
                "
            >
                {value}
            </span>

        </div>

    );

}


/* ============================================================
    ## Loading Skeleton
============================================================ */

function ResumeCardSkeleton() {

    return (

        <div
            className="
                animate-pulse
                rounded-[1.75rem]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                p-6
            "
        >

            <div className="flex gap-4">

                <div
                    className="
                        h-12
                        w-12
                        shrink-0
                        rounded-2xl
                        bg-[var(--surface-container-low)]
                    "
                />


                <div className="flex-1">

                    <div
                        className="
                            h-4
                            w-20
                            rounded
                            bg-[var(--surface-container-low)]
                        "
                    />

                    <div
                        className="
                            mt-3
                            h-6
                            w-2/3
                            rounded
                            bg-[var(--surface-container-low)]
                        "
                    />

                    <div
                        className="
                            mt-2
                            h-4
                            w-1/2
                            rounded
                            bg-[var(--surface-container-low)]
                        "
                    />

                </div>

            </div>


            <div
                className="
                    mt-6
                    h-20
                    rounded-2xl
                    bg-[var(--surface-container-low)]
                "
            />

        </div>

    );

}


/* ============================================================
    ## Empty State
============================================================ */

function EmptyResumes({

    onCreate,

}) {

    return (

        <div
            className="
                rounded-[2rem]
                border
                border-dashed
                border-[var(--outline)]
                bg-[var(--surface-container-lowest)]
                px-6
                py-16
                text-center
                sm:px-10
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
                    bg-[var(--primary-fixed)]
                    text-[var(--primary)]
                "
            >
                <FileText size={30} />
            </div>


            <h2
                className="
                    mt-6
                    font-[var(--font-heading)]
                    text-2xl
                    font-extrabold
                    text-[var(--on-surface)]
                "
            >
                No resumes yet
            </h2>


            <p
                className="
                    mx-auto
                    mt-3
                    text-sm
                    leading-7
                    text-[var(--on-surface-variant)]
                "
            >
                Upload your resume to build your
                professional profile and use it for job
                matching and ATS analysis.
            </p>


            <button
                type="button"
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
                    font-bold
                    text-white
                    shadow-sm
                    transition
                    hover:-translate-y-0.5
                    hover:opacity-90
                "
            >

                <Upload size={17} />

                Upload Resume

            </button>

        </div>

    );

}


/* ============================================================
    ## No Search Results
============================================================ */

function NoSearchResults({

    searchQuery,
    onClear,

}) {

    return (

        <div
            className="
                rounded-[2rem]
                border
                border-dashed
                border-[var(--outline)]
                bg-[var(--surface-container-lowest)]
                px-6
                py-14
                text-center
                sm:px-10
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
                    bg-[var(--surface-container-low)]
                    text-[var(--on-surface-variant)]
                "
            >
                <Search size={25} />
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
                No matching resumes
            </h2>


            <p
                className="
                    mx-auto
                    mt-2
                    text-sm
                    leading-6
                    text-[var(--on-surface-variant)]
                "
            >
                We couldn't find a resume matching{" "}
                <span
                    className="
                        font-bold
                        text-[var(--on-surface)]
                    "
                >
                    "{searchQuery}"
                </span>
                .
            </p>


            <button
                type="button"
                onClick={onClear}
                className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[var(--primary-fixed)]
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-[var(--primary)]
                    transition
                    hover:opacity-80
                "
            >

                <X size={16} />

                Clear Search

            </button>

        </div>

    );

}


/* ============================================================
    ## Main Page
============================================================ */

function ResumeList() {

    const navigate =
        useNavigate();


    const {

        resumes,

        isLoading,
        isUpdating,
        error,

        getAllResumes,
        setPrimaryResume,
        deleteResume,

    } = useResume();


    const {
        importCareerProfileFromResume,
        isImporting,
    } = useCareerProfile();


    /* ========================================================
        Search State
    ======================================================== */

    const [
        searchQuery,
        setSearchQuery,
    ] = useState("");


    const [
        activeFilter,
        setActiveFilter,
    ] = useState("all");

    const [
        resumeToImport,
        setResumeToImport,
    ] = useState(null);


    /* ========================================================
        Fetch Resumes
    ======================================================== */

    useEffect(() => {

        getAllResumes()
            .catch(() => { });

    }, [
        getAllResumes,
    ]);


    /* ========================================================
        Filter Definitions
    ======================================================== */

    const filters = [

        {
            id: "all",
            label: "All Resumes",
            count: resumes.length,
        },

        {
            id: "primary",
            label: "Primary",
            count:
                resumes.filter(
                    (resume) =>
                        resume.isPrimary
                ).length,
        },

        {
            id: "parsed",
            label: "AI Parsed",
            count:
                resumes.filter(
                    hasParsedData
                ).length,
        },

        {
            id: "unparsed",
            label: "Not Parsed",
            count:
                resumes.filter(
                    (resume) =>
                        !hasParsedData(resume)
                ).length,
        },

    ];


    /* ========================================================
        Search + Filter
    ======================================================== */

    const filteredResumes = useMemo(() => {

        const query =
            searchQuery
                .trim()
                .toLowerCase();


        return [...resumes]

            .filter((resume) => {

                /* --------------------------------------------
                    Status Filter
                -------------------------------------------- */

                if (
                    activeFilter ===
                    "primary"
                ) {

                    return resume.isPrimary;

                }


                if (
                    activeFilter ===
                    "parsed"
                ) {

                    return hasParsedData(
                        resume
                    );

                }


                if (
                    activeFilter ===
                    "unparsed"
                ) {

                    return !hasParsedData(
                        resume
                    );

                }


                return true;

            })

            .filter((resume) => {

                /* --------------------------------------------
                    Search
                -------------------------------------------- */

                if (!query) {
                    return true;
                }


                const parsedData =
                    resume?.parsedData ||
                    {};


                const skills =
                    Array.isArray(
                        parsedData.skills
                    )
                        ? parsedData.skills
                            .map(
                                (skill) =>
                                    typeof skill ===
                                        "string"
                                        ? skill
                                        : skill?.name
                                            ? skill.name
                                            : ""
                            )
                            .join(" ")
                        : "";


                const experience =
                    Array.isArray(
                        parsedData.experience
                    )
                        ? parsedData.experience
                            .map(
                                (item) =>
                                    `${item?.company || ""} ${item?.position || ""
                                    } ${item?.title || ""
                                    }`
                            )
                            .join(" ")
                        : "";


                const searchableText = [

                    resume.fileName,

                    resume.fileType,

                    parsedData.name,

                    parsedData.headline,

                    parsedData.summary,

                    skills,

                    experience,

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                return searchableText.includes(
                    query
                );

            })

            .sort((a, b) => {

                /* Primary first */

                if (
                    a.isPrimary !==
                    b.isPrimary
                ) {

                    return a.isPrimary
                        ? -1
                        : 1;

                }


                /* Then newest */

                const dateA =
                    new Date(
                        a.updatedAt ||
                        a.createdAt ||
                        0
                    ).getTime();

                const dateB =
                    new Date(
                        b.updatedAt ||
                        b.createdAt ||
                        0
                    ).getTime();

                return dateB - dateA;

            });

    }, [
        resumes,
        searchQuery,
        activeFilter,
    ]);


    /* ========================================================
        Handlers
    ======================================================== */

    const handleViewResume = (
        resumeId
    ) => {

        navigate(
            `/resumes/${resumeId}`
        );

    };


    const handleCreateResume = () => {

        navigate(
            "/resumes/create"
        );

    };



    const handleImportToCareerProfile = async (resume) => {
        if (!resume?._id) {
            toast.error("This resume cannot be imported.");
            return;
        }

        setResumeToImport(resume);
    };

    const handleConfirmImport = async () => {
        if (!resumeToImport?._id) {
            return;
        }

        const result =
            await importCareerProfileFromResume(
                resumeToImport._id
            );

        if (result.success) {
            toast.success(
                "Career Profile imported successfully."
            );
            navigate("/career-profile");
        } else {
            toast.error(
                result.error ||
                "Unable to import this resume."
            );
        }
    };

    const handleCloseImport = () => {
        if (!isImporting) {
            setResumeToImport(null);
        }
    };


    const handleSetPrimary = async (
        resumeId
    ) => {

        try {

            await setPrimaryResume(
                resumeId
            );

        } catch {

            // Error handled by hook/store.

        }

    };




    const handleDelete = async (
        resume
    ) => {

        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${resume.fileName}"?`
            );

        if (!confirmed) {
            return;
        }


        try {

            await deleteResume(
                resume._id
            );

        } catch {

            // Error handled by hook/store.

        }

    };


    const handleClearSearch = () => {

        setSearchQuery("");

    };


    const handleClearFilters = () => {

        setSearchQuery("");
        setActiveFilter("all");

    };


    /* ========================================================
        Render
    ======================================================== */

    return (

        <>
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

                {/* ==================================================
                    HERO
                ================================================== */}

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

                    {/* Decorative Circle */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-24
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
                            right-1/3
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

                        {/* Hero Content */}

                        <div className="max-w-3xl">

                            <div
                                className="
                                    mb-5
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
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
                                    borderColor:
                                        "rgba(255,255,255,0.14)",
                                }}
                            >

                                <FileText size={16} />

                                AI-Powered Resume Workspace

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

                                Build a resume
                                <br />

                                that gets you noticed.

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

                                Manage your resumes in one place,
                                extract your professional experience
                                with AI, and choose the right resume
                                for every opportunity.

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
                                    onClick={
                                        handleCreateResume
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

                                    <Plus size={18} />

                                    Add Resume

                                </button>


                                {resumes.length > 0 && (

                                    <div
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
                                        "
                                        style={{
                                            borderColor:
                                                "rgba(255,255,255,0.2)",
                                            color:
                                                "var(--on-primary)",
                                        }}
                                    >

                                        <Sparkles
                                            size={17}
                                        />

                                        AI-ready resumes

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* Hero Stats */}

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
                                    resumes.length
                                }
                                label="Resumes"
                                icon={FileText}
                            />


                            <HeroStat
                                value={
                                    resumes.some(
                                        (resume) =>
                                            resume.isPrimary
                                    )
                                        ? "1"
                                        : "—"
                                }
                                label="Primary"
                                icon={Star}
                            />


                            <HeroStat
                                value={
                                    resumes.filter(
                                        hasParsedData
                                    ).length
                                }
                                label="AI Parsed"
                                icon={Sparkles}
                            />

                        </div>

                    </div>

                </section>


                {/* ==================================================
                    ERROR
                ================================================== */}

                <ErrorToast error={error} />


                {/* ==================================================
                    RESUME COLLECTION
                ================================================== */}

                <section className="mt-8">

                    {/* ==================================================
                        Section Header
                    ================================================== */}

                    <div
                        className="
                            mb-5
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

                                <h2
                                    className="
                                        font-[var(--font-heading)]
                                        text-xl
                                        font-extrabold
                                        text-[var(--on-surface)]
                                    "
                                >
                                    Your Resume Collection
                                </h2>


                                {!isLoading && (

                                    <span
                                        className="
                                            rounded-full
                                            bg-[var(--primary-fixed)]
                                            px-2.5
                                            py-1
                                            text-xs
                                            font-bold
                                            text-[var(--primary)]
                                        "
                                    >
                                        {filteredResumes.length}
                                    </span>

                                )}

                            </div>


                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                View, manage, and organize your
                                uploaded resumes.
                            </p>

                        </div>


                        {!isLoading &&
                            resumes.length > 0 && (

                                <button
                                    type="button"
                                    onClick={
                                        handleCreateResume
                                    }
                                    className="
                                        inline-flex
                                        w-full
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
                                        transition
                                        hover:opacity-90
                                        sm:w-auto
                                    "
                                >

                                    <Plus size={16} />

                                    Add Resume

                                </button>

                            )}

                    </div>


                    {/* ==================================================
                        SEARCH + FILTER PANEL
                    ================================================== */}

                    {!isLoading &&
                        resumes.length > 0 && (

                            <div
                                className="
                                    mb-6
                                    overflow-hidden
                                    rounded-[1.5rem]
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-lowest)]
                                    shadow-[var(--shadow-sm)]
                                "
                            >

                                <div className="p-4 sm:p-5">

                                    {/* Search */}

                                    <div
                                        className="
                                            flex
                                            flex-col
                                            gap-3
                                            lg:flex-row
                                            lg:items-center
                                        "
                                    >

                                        <div
                                            className="
                                                relative
                                                flex-1
                                            "
                                        >

                                            <Search
                                                size={18}
                                                className="
                                                    pointer-events-none
                                                    absolute
                                                    left-4
                                                    top-1/2
                                                    -translate-y-1/2
                                                    text-[var(--on-surface-variant)]
                                                "
                                            />


                                            <input
                                                type="text"
                                                value={
                                                    searchQuery
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setSearchQuery(
                                                        event
                                                            .target
                                                            .value
                                                    )
                                                }
                                                placeholder="
                                                    Search resumes by name, headline, skill, company...
                                                "
                                                className="
                                                    h-12
                                                    w-full
                                                    rounded-xl
                                                    border
                                                    border-[var(--outline-variant)]
                                                    bg-[var(--surface-container-low)]
                                                    pl-11
                                                    pr-11
                                                    text-sm
                                                    font-medium
                                                    text-[var(--on-surface)]
                                                    outline-none
                                                    transition
                                                    placeholder:text-[var(--on-surface-variant)]
                                                    focus:border-[var(--primary)]
                                                    focus:ring-2
                                                    focus:ring-[var(--primary)]
                                                    focus:ring-opacity-10
                                                "
                                            />


                                            {searchQuery && (

                                                <button
                                                    type="button"
                                                    onClick={
                                                        handleClearSearch
                                                    }
                                                    className="
                                                        absolute
                                                        right-3
                                                        top-1/2
                                                        flex
                                                        h-8
                                                        w-8
                                                        -translate-y-1/2
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        text-[var(--on-surface-variant)]
                                                        transition
                                                        hover:bg-[var(--surface-container-high)]
                                                        hover:text-[var(--on-surface)]
                                                    "
                                                    aria-label="
                                                        Clear search
                                                    "
                                                >

                                                    <X size={16} />

                                                </button>

                                            )}

                                        </div>


                                        {/* Filter Indicator */}

                                        <div
                                            className="
                                                hidden
                                                h-12
                                                items-center
                                                gap-2
                                                rounded-xl
                                                bg-[var(--surface-container-low)]
                                                px-4
                                                text-sm
                                                font-semibold
                                                text-[var(--on-surface-variant)]
                                                lg:flex
                                            "
                                        >

                                            <Filter
                                                size={16}
                                            />

                                            Filter

                                        </div>

                                    </div>


                                    {/* Filters */}

                                    <div
                                        className="
                                            mt-4
                                            flex
                                            gap-2
                                            overflow-x-auto
                                            pb-1
                                        "
                                    >

                                        {filters.map(
                                            (filter) => {

                                                const isActive =
                                                    activeFilter ===
                                                    filter.id;


                                                return (

                                                    <button
                                                        key={
                                                            filter.id
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            setActiveFilter(
                                                                filter.id
                                                            )
                                                        }
                                                        className={`
                                                            inline-flex
                                                            shrink-0
                                                            items-center
                                                            gap-2
                                                            rounded-xl
                                                            px-3.5
                                                            py-2.5
                                                            text-xs
                                                            font-bold
                                                            transition-all
                                                            ${isActive
                                                                ? `
                                                                        bg-[var(--primary)]
                                                                        text-white
                                                                    `
                                                                : `
                                                                        bg-[var(--surface-container-low)]
                                                                        text-[var(--on-surface-variant)]
                                                                        hover:bg-[var(--primary-fixed)]
                                                                        hover:text-[var(--primary)]
                                                                    `
                                                            }
                                                        `}
                                                    >

                                                        {filter.label}

                                                        <span
                                                            className={`
                                                                rounded-full
                                                                px-1.5
                                                                py-0.5
                                                                text-[10px]
                                                                ${isActive
                                                                    ? `
                                                                            bg-white/20
                                                                            text-white
                                                                        `
                                                                    : `
                                                                            bg-[var(--surface-container-high)]
                                                                            text-[var(--on-surface-variant)]
                                                                        `
                                                                }
                                                            `}
                                                        >
                                                            {
                                                                filter.count
                                                            }
                                                        </span>

                                                    </button>

                                                );

                                            }
                                        )}

                                    </div>

                                </div>


                                {/* Search Result Footer */}

                                {(searchQuery ||
                                    activeFilter !==
                                    "all") && (

                                        <div
                                            className="
                                            flex
                                            flex-col
                                            gap-2
                                            border-t
                                            border-[var(--outline-variant)]
                                            bg-[var(--surface-container-low)]
                                            px-4
                                            py-3
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                            sm:px-5
                                        "
                                        >

                                            <p
                                                className="
                                                text-xs
                                                font-semibold
                                                text-[var(--on-surface-variant)]
                                            "
                                            >

                                                Showing{" "}

                                                <span
                                                    className="
                                                    font-extrabold
                                                    text-[var(--on-surface)]
                                                "
                                                >
                                                    {
                                                        filteredResumes.length
                                                    }
                                                </span>{" "}

                                                of{" "}

                                                <span
                                                    className="
                                                    font-extrabold
                                                    text-[var(--on-surface)]
                                                "
                                                >
                                                    {
                                                        resumes.length
                                                    }
                                                </span>{" "}

                                                resumes

                                            </p>


                                            <button
                                                type="button"
                                                onClick={
                                                    handleClearFilters
                                                }
                                                className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                self-start
                                                text-xs
                                                font-bold
                                                text-[var(--primary)]
                                                transition
                                                hover:opacity-70
                                                sm:self-auto
                                            "
                                            >

                                                <X size={13} />

                                                Clear filters

                                            </button>

                                        </div>

                                    )}

                            </div>

                        )}


                    {/* ==================================================
                        LOADING
                    ================================================== */}

                    {isLoading && (

                        <div className="space-y-5">

                            <ResumeCardSkeleton />

                            <ResumeCardSkeleton />

                            <ResumeCardSkeleton />

                        </div>

                    )}


                    {/* ==================================================
                        EMPTY — NO RESUMES
                    ================================================== */}

                    {!isLoading &&
                        resumes.length === 0 && (

                            <EmptyResumes
                                onCreate={
                                    handleCreateResume
                                }
                            />

                        )}


                    {/* ==================================================
                        EMPTY — SEARCH
                    ================================================== */}

                    {!isLoading &&
                        resumes.length > 0 &&
                        filteredResumes.length === 0 && (

                            <NoSearchResults
                                searchQuery={
                                    searchQuery ||
                                    filters.find(
                                        (filter) =>
                                            filter.id ===
                                            activeFilter
                                    )?.label ||
                                    ""
                                }
                                onClear={
                                    handleClearFilters
                                }
                            />

                        )}


                    {/* ==================================================
                        RESUME CARDS
                    ================================================== */}

                    {!isLoading &&
                        filteredResumes.length > 0 && (

                            <div className="space-y-5">

                                {filteredResumes.map(
                                    (resume) => (

                                        <ResumeCard
                                            key={resume._id}
                                            resume={resume}
                                            onView={handleViewResume}
                                            onSetPrimary={handleSetPrimary}
                                            onDelete={handleDelete}
                                            onImport={handleImportToCareerProfile}
                                            isUpdating={isUpdating}
                                            isImporting={isImporting}
                                        />

                                    )
                                )}

                            </div>

                        )}

                </section>

            </div>

        </div>

        {resumeToImport && (
            <div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) {
                        handleCloseImport();
                    }
                }}
            >
                <div className="w-full max-w-lg overflow-hidden rounded-[28px] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-[var(--shadow-lg)]">
                    <div className="flex items-start justify-between gap-4 border-b border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-6 py-6">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--primary-fixed)] text-[var(--primary)]">
                                <FileCheck2 size={22} />
                            </div>
                            <div>
                                <h2 className="font-[var(--font-heading)] text-xl font-bold text-[var(--on-surface)]">
                                    Import to Career Profile
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-[var(--on-surface-variant)]">
                                    Use the information already extracted from this resume.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleCloseImport}
                            disabled={isImporting}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[var(--on-surface-variant)] transition hover:bg-[var(--surface-container-high)] disabled:opacity-50"
                            aria-label="Close import dialog"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="space-y-5 p-6 sm:p-7">
                        <div className="rounded-2xl border border-[var(--primary-fixed-dim)] bg-[var(--primary-fixed)]/50 p-4">
                            <p className="break-words text-sm font-bold text-[var(--on-surface)]">
                                {resumeToImport.parsedData?.name ||
                                    resumeToImport.fileName ||
                                    "Selected resume"}
                            </p>
                            <p className="mt-1 text-xs text-[var(--on-surface-variant)]">
                                {resumeToImport.parsedData?.headline ||
                                    "AI-parsed professional information"}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {[
                                ["Skills", resumeToImport.parsedData?.skills?.length || 0],
                                ["Experience", resumeToImport.parsedData?.experience?.length || 0],
                                ["Projects", resumeToImport.parsedData?.projects?.length || 0],
                                ["Education", resumeToImport.parsedData?.education?.length || 0],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="rounded-xl bg-[var(--surface-container-low)] px-3 py-3 text-center"
                                >
                                    <p className="text-lg font-extrabold text-[var(--on-surface)]">{value}</p>
                                    <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-[var(--on-surface-variant)]">{label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-start gap-3 rounded-2xl border border-[var(--error)]/40 bg-[var(--error-container)] p-4">
                            <CircleAlert size={18} className="mt-0.5 shrink-0 text-[var(--error)]" />
                            <p className="text-sm leading-6 text-[var(--on-error-container)]">
                                Importing replaces the current Career Profile information with this resume's parsed data.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-6 py-5 sm:flex-row sm:justify-end sm:px-7">
                        <button
                            type="button"
                            onClick={handleCloseImport}
                            disabled={isImporting}
                            className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[var(--on-surface-variant)] transition hover:bg-[var(--surface-container-high)] disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleConfirmImport}
                            disabled={isImporting}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-2.5 text-sm font-bold text-white shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isImporting ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <FileCheck2 size={16} />
                                    Replace & Import
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}
        </>

    );

}


export default ResumeList;