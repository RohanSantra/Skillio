import {
    useEffect,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowLeft,
    Award,
    BriefcaseBusiness,
    CalendarDays,
    CheckCircle2,
    ChevronRight,
    CircleAlert,
    Clock3,
    Code2,
    Contact,
    FileText,
    GraduationCap,
    Lightbulb,
    Loader2,
    Mail,
    Phone,
    Sparkles,
    Star,
    UserRound,
} from "lucide-react";

import useResume from "../hooks/useResume.js";
import ErrorToast from "../../../components/feedback/ErrorToast.jsx";


/* =============================================
    ## Helper Functions
============================================= */

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
        return "Unknown";
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    const kb = bytes / 1024;

    if (kb < 1024) {
        return `${kb.toFixed(1)} KB`;
    }

    return `${(kb / 1024).toFixed(1)} MB`;

};


const hasParsedData = (resume) => {

    const data =
        resume?.parsedData;

    if (!data) {
        return false;
    }

    return Boolean(

        data.name ||
        data.email ||
        data.phone ||
        data.headline ||
        data.summary ||
        data.skills?.length ||
        data.experience?.length ||
        data.projects?.length ||
        data.education?.length ||
        data.certifications?.length

    );

};


const formatDuration = (

    startDate,
    endDate

) => {

    if (!startDate && !endDate) {
        return null;
    }

    if (startDate && endDate) {
        return `${startDate} — ${endDate}`;
    }

    if (startDate) {
        return `${startDate} — Present`;
    }

    return endDate;

};


/* =============================================
    ## Section Card
============================================= */

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


/* =============================================
    ## Section Header
============================================= */

function SectionHeader({

    icon,
    title,
    description,

}) {

    return (

        <div
            className="
                flex
                items-start
                gap-4
                border-b
                border-[var(--outline-variant)]
                p-5
                sm:p-6
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
                {icon}
            </div>


            <div>

                <h2
                    className="
                        font-[var(--font-heading)]
                        text-lg
                        font-extrabold
                        text-[var(--on-surface)]
                    "
                >
                    {title}
                </h2>


                {description && (

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[var(--on-surface-variant)]
                        "
                    >
                        {description}
                    </p>

                )}

            </div>

        </div>

    );

}


/* =============================================
    ## Skill Chip
============================================= */

function SkillChip({

    skill,

}) {

    return (

        <span
            className="
                inline-flex
                items-center
                rounded-xl
                bg-[var(--surface-container-low)]
                px-3
                py-2
                text-sm
                font-semibold
                text-[var(--on-surface)]
                transition
                hover:bg-[var(--primary-fixed)]
                hover:text-[var(--primary)]
            "
        >
            {skill}
        </span>

    );

}


/* =============================================
    ## Experience Card
============================================= */

function ExperienceCard({

    experience,

}) {

    const duration =
        formatDuration(
            experience.startDate,
            experience.endDate
        );


    return (

        <article
            className="
                relative
                border-l-2
                border-[var(--primary-fixed-dim)]
                pl-6
                last:border-l-0
            "
        >

            {/* Timeline Dot */}

            <div
                className="
                    absolute
                    -left-[7px]
                    top-1
                    h-3
                    w-3
                    rounded-full
                    bg-[var(--primary)]
                "
            />


            {/* Position */}

            <h3
                className="
                    font-[var(--font-heading)]
                    text-base
                    font-extrabold
                    text-[var(--on-surface)]
                    sm:text-lg
                "
            >
                {experience.position ||
                    "Position not specified"}
            </h3>


            {/* Company */}

            {experience.company && (

                <p
                    className="
                        mt-1
                        font-semibold
                        text-[var(--primary)]
                    "
                >
                    {experience.company}
                </p>

            )}


            {/* Duration */}

            {duration && (

                <p
                    className="
                        mt-2
                        inline-flex
                        items-center
                        gap-1.5
                        text-xs
                        font-semibold
                        text-[var(--on-surface-variant)]
                    "
                >
                    <CalendarDays size={14} />

                    {duration}

                </p>

            )}


            {/* Description */}

            {experience.description && (

                <p
                    className="
                        mt-4
                        text-sm
                        leading-7
                        text-[var(--on-surface-variant)]
                    "
                >
                    {experience.description}
                </p>

            )}

        </article>

    );

}


/* =============================================
    ## Project Card
============================================= */

function ProjectCard({

    project,

}) {

    return (

        <article
            className="
                rounded-2xl
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                p-5
                transition
                hover:shadow-[var(--shadow-sm)]
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
                        bg-[var(--surface-container-low)]
                        text-[var(--primary)]
                    "
                >
                    <Code2 size={18} />
                </div>


                <div className="min-w-0">


                    <h3
                        className="
                            font-[var(--font-heading)]
                            text-base
                            font-extrabold
                            text-[var(--on-surface)]
                        "
                    >
                        {project.name ||
                            "Untitled Project"}
                    </h3>


                    {project.description && (

                        <p
                            className="
                                mt-3
                                text-sm
                                leading-7
                                text-[var(--on-surface-variant)]
                            "
                        >
                            {project.description}
                        </p>

                    )}

                </div>

            </div>


            {/* Technologies */}

            {project.technologies?.length > 0 && (

                <div
                    className="
                        mt-5
                        flex
                        flex-wrap
                        gap-2
                    "
                >

                    {project.technologies.map(
                        (
                            technology,
                            index
                        ) => (

                            <span
                                key={`${technology}-${index}`}
                                className="
                                    rounded-lg
                                    bg-[var(--primary-fixed)]
                                    px-2.5
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    text-[var(--on-primary-fixed)]
                                "
                            >
                                {technology}
                            </span>

                        )
                    )}

                </div>

            )}

        </article>

    );

}


/* =============================================
    ## Education Card
============================================= */

function EducationCard({

    education,

}) {

    const duration =
        formatDuration(
            education.startDate,
            education.endDate
        );


    return (

        <article
            className="
                rounded-2xl
                bg-[var(--surface-container-low)]
                p-5
            "
        >

            <div
                className="
                    flex
                    gap-4
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
                        bg-[var(--surface-container-lowest)]
                        text-[var(--primary)]
                    "
                >
                    <GraduationCap size={19} />
                </div>


                <div>


                    <h3
                        className="
                            font-[var(--font-heading)]
                            text-base
                            font-extrabold
                            text-[var(--on-surface)]
                        "
                    >
                        {education.degree ||
                            "Degree not specified"}
                    </h3>


                    {education.fieldOfStudy && (

                        <p
                            className="
                                mt-1
                                text-sm
                                font-medium
                                text-[var(--on-surface-variant)]
                            "
                        >
                            {education.fieldOfStudy}
                        </p>

                    )}


                    {education.institution && (

                        <p
                            className="
                                mt-3
                                text-sm
                                font-semibold
                                text-[var(--primary)]
                            "
                        >
                            {education.institution}
                        </p>

                    )}


                    {duration && (

                        <p
                            className="
                                mt-2
                                text-xs
                                font-semibold
                                text-[var(--on-surface-variant)]
                            "
                        >
                            {duration}
                        </p>

                    )}

                </div>

            </div>

        </article>

    );

}


/* =============================================
    ## Resume Details
============================================= */

function ResumeDetails() {

    const {
        resumeId,
    } = useParams();

    const navigate = useNavigate();


    const {

        currentResume,

        isLoading,
        isUpdating,
        isParsing,
        error,

        getResume,
        parseResume,
        setPrimaryResume,

    } = useResume();


    /* =============================================
        ## Fetch Resume
    ============================================= */

    useEffect(() => {

        if (!resumeId) {
            return;
        }

        getResume(resumeId)
            .catch(() => { });

    }, [
        resumeId,
        getResume,
    ]);


    /* =============================================
        ## Handlers
    ============================================= */

    const handleParseResume = async () => {

        if (!resumeId) {
            return;
        }

        try {

            await parseResume(resumeId);

            await getResume(resumeId);

        } catch {

            // Error handled in Zustand.

        }

    };


    const handleSetPrimary = async () => {

        if (!resumeId) {
            return;
        }

        try {

            await setPrimaryResume(resumeId);

            await getResume(resumeId);

        } catch {

            // Error handled by store.

        }

    };


    /* =============================================
        ## Loading State
    ============================================= */

    if (isLoading && !currentResume) {

        return (

            <div
                className="
                    flex
                    min-h-screen
                    items-center
                    justify-center
                    bg-[var(--background)]
                "
            >

                <div className="text-center">

                    <Loader2
                        size={34}
                        className="
                            mx-auto
                            animate-spin
                            text-[var(--primary)]
                        "
                    />

                    <p
                        className="
                            mt-4
                            text-sm
                            font-semibold
                            text-[var(--on-surface-variant)]
                        "
                    >
                        Loading your resume...

                    </p>

                </div>

            </div>

        );

    }


    /* =============================================
        ## Resume Not Found
    ============================================= */

    if (!currentResume) {

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

                <div
                    className="
                        max-w-md
                        rounded-[2rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        p-8
                        text-center
                    "
                >

                    <CircleAlert
                        size={32}
                        className="
                            mx-auto
                            text-[var(--error)]
                        "
                    />


                    <h1
                        className="
                            mt-5
                            text-xl
                            font-extrabold
                            text-[var(--on-surface)]
                        "
                    >
                        Resume not found
                    </h1>


                    <button
                        type="button"
                        onClick={() =>
                            navigate("/resumes")
                        }
                        className="
                            mt-6
                            rounded-xl
                            bg-[var(--primary)]
                            px-5
                            py-3
                            text-sm
                            font-bold
                            text-white
                        "
                    >
                        Back to Resumes
                    </button>

                </div>

            </div>

        );

    }


    const resume =
        currentResume;

    const data =
        resume.parsedData || {};

    const parsed =
        hasParsedData(resume);


    const createdDate =
        formatDate(resume.createdAt);

    const updatedDate =
        formatDate(resume.updatedAt);


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
                    ## Back Button
                ========================================= */}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/resumes")
                    }
                    className="
                        mb-7
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-[var(--on-surface-variant)]
                        transition
                        hover:bg-[var(--surface-container-low)]
                        hover:text-[var(--on-surface)]
                    "
                >

                    <ArrowLeft size={17} />

                    Back to Resumes

                </button>


                {/* =========================================
                    ## Resume Hero
                ========================================= */}

                <section
                    className="
                        relative
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
                            h-64
                            w-64
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


                            {/* Resume Identity */}

                            <div
                                className="
                                flex
                                min-w-0
                                flex-col
                                gap-4
                                sm:flex-row
                                sm:gap-5
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-16
                                        w-16
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-3xl
                                        bg-[var(--primary)]
                                        text-white
                                        shadow-sm
                                    "
                                >
                                    <FileText size={28} />
                                </div>


                                <div className="min-w-0">


                                    {/* Status */}

                                    <div
                                        className="
                                            mb-3
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
                                                    px-3
                                                    py-1
                                                    text-xs
                                                    font-bold
                                                    text-white
                                                "
                                            >
                                                <Star size={13} />

                                                Primary Resume

                                            </span>

                                        )}


                                        <span
                                            className="
                                                rounded-full
                                                bg-[var(--surface-container-low)]
                                                px-3
                                                py-1
                                                text-xs
                                                font-bold
                                                text-[var(--on-surface-variant)]
                                            "
                                        >
                                            {resume.fileType?.toUpperCase()}
                                        </span>

                                    </div>


                                    <h1
                                        className="
                                            font-[var(--font-heading)]
                                            break-words
                                            text-2xl
                                            font-extrabold
                                            leading-tight
                                            tracking-tight
                                            text-[var(--on-surface)]
                                            sm:text-3xl
                                            lg:text-4xl
                                        "
                                    >
                                        {data.name ||
                                            resume.fileName}
                                    </h1>


                                    {data.headline && (

                                        <p
                                            className="
                                                mt-3
                                                text-base
                                                font-medium
                                                text-[var(--on-surface-variant)]
                                            "
                                        >
                                            {data.headline}
                                        </p>

                                    )}


                                    <p
                                        className="
                                            mt-3
                                            text-sm
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        {resume.fileName}
                                    </p>

                                </div>

                            </div>


                            {/* Hero Actions */}

                            <div
                                className="
                                flex
                                w-full
                                flex-wrap
                                gap-3
                                sm:w-auto
                                "
                            >


                                {!resume.isPrimary && (

                                    <button
                                        type="button"
                                        disabled={isUpdating}
                                        onClick={
                                            handleSetPrimary
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            bg-[var(--surface-container-low)]
                                            px-4
                                            py-3
                                            text-sm
                                            font-bold
                                            text-[var(--on-surface)]
                                            transition
                                            hover:bg-[var(--primary-fixed)]
                                            hover:text-[var(--primary)]
                                            disabled:opacity-50
                                        "
                                    >

                                        {isUpdating ? (

                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />

                                        ) : (

                                            <Star size={17} />

                                        )}

                                        Set Primary

                                    </button>

                                )}


                                <button
                                    type="button"
                                    disabled={
                                        isParsing ||
                                        !resume.extractedText
                                    }
                                    onClick={
                                        handleParseResume
                                    }
                                    className="
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
                                        hover:opacity-90
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {isParsing ? (

                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Sparkles size={17} />

                                    )}

                                    {parsed
                                        ? "Parse Again"
                                        : "Parse with AI"}

                                </button>

                            </div>

                        </div>


                        {/* Contact Information */}

                        {(data.email ||
                            data.phone) && (

                                <div
                                    className="
                                    mt-7
                                    flex
                                    flex-wrap
                                    gap-x-6
                                    gap-y-3
                                    border-t
                                    border-[var(--outline-variant)]
                                    pt-6
                                "
                                >

                                    {data.email && (

                                        <span
                                            className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-[var(--on-surface-variant)]
                                        "
                                        >
                                            <Mail size={16} />

                                            {data.email}

                                        </span>

                                    )}


                                    {data.phone && (

                                        <span
                                            className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            text-sm
                                            text-[var(--on-surface-variant)]
                                        "
                                        >
                                            <Phone size={16} />

                                            {data.phone}

                                        </span>

                                    )}

                                </div>

                            )}

                    </div>

                </section>


                {/* =========================================
                    ## Error
                ========================================= */}

                <ErrorToast error={error} />


                {/* =========================================
                    ## Main Layout
                ========================================= */}

                <div
                    className="
                        mt-8
                        grid
                        gap-6
                        xl:grid-cols-[minmax(0,1fr)_340px]
                    "
                >


                    {/* =====================================
                        ## Main Content
                    ===================================== */}

                    <main className="space-y-6">


                        {/* =================================
                            ## Empty Parsed State
                        ================================= */}

                        {!parsed && (

                            <SectionCard>

                                <div
                                    className="
                                        p-8
                                        text-center
                                        sm:p-10
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
                                            text-[var(--primary)]
                                        "
                                    >
                                        <Sparkles size={26} />
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
                                        Resume is ready for AI parsing
                                    </h2>


                                    <p
                                        className="
                                            mx-auto
                                            mt-3
                                            max-w-lg
                                            text-sm
                                            leading-7
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        Parse your resume to extract
                                        your skills, experience,
                                        projects, education, and other
                                        professional information into a
                                        structured profile.
                                    </p>


                                    <button
                                        type="button"
                                        disabled={
                                            isParsing ||
                                            !resume.extractedText
                                        }
                                        onClick={
                                            handleParseResume
                                        }
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
                                            disabled:opacity-50
                                        "
                                    >

                                        {isParsing ? (

                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />

                                        ) : (

                                            <Sparkles size={17} />

                                        )}

                                        Parse Resume with AI

                                    </button>


                                    {!resume.extractedText && (

                                        <p
                                            className="
                                                mt-4
                                                text-xs
                                                text-[var(--error)]
                                            "
                                        >
                                            No extracted resume text is
                                            available for AI parsing.

                                        </p>

                                    )}

                                </div>

                            </SectionCard>

                        )}


                        {/* =================================
                            ## Professional Summary
                        ================================= */}

                        {data.summary && (

                            <SectionCard>

                                <SectionHeader
                                    icon={
                                        <UserRound size={20} />
                                    }
                                    title="Professional Summary"
                                    description="A quick overview of your profile"
                                />


                                <div className="p-5 sm:p-6">

                                    <p
                                        className="
                                            text-sm
                                            leading-8
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        {data.summary}
                                    </p>

                                </div>

                            </SectionCard>

                        )}


                        {/* =================================
                            ## Skills
                        ================================= */}

                        {data.skills?.length > 0 && (

                            <SectionCard>

                                <SectionHeader
                                    icon={
                                        <Sparkles size={20} />
                                    }
                                    title="Skills"
                                    description={`${data.skills.length} skills identified from your resume`}
                                />


                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-2.5
                                        p-5
                                        sm:p-6
                                    "
                                >

                                    {data.skills.map(
                                        (
                                            skill,
                                            index
                                        ) => (

                                            <SkillChip
                                                key={`${skill}-${index}`}
                                                skill={skill}
                                            />

                                        )
                                    )}

                                </div>

                            </SectionCard>

                        )}


                        {/* =================================
                            ## Experience
                        ================================= */}

                        {data.experience?.length > 0 && (

                            <SectionCard>

                                <SectionHeader
                                    icon={
                                        <BriefcaseBusiness
                                            size={20}
                                        />
                                    }
                                    title="Experience"
                                    description="Professional work experience from your resume"
                                />


                                <div
                                    className="
                                        space-y-8
                                        p-6
                                    "
                                >

                                    {data.experience.map(
                                        (
                                            experience,
                                            index
                                        ) => (

                                            <ExperienceCard
                                                key={index}
                                                experience={
                                                    experience
                                                }
                                            />

                                        )
                                    )}

                                </div>

                            </SectionCard>

                        )}


                        {/* =================================
                            ## Projects
                        ================================= */}

                        {data.projects?.length > 0 && (

                            <SectionCard>

                                <SectionHeader
                                    icon={
                                        <Code2 size={20} />
                                    }
                                    title="Projects"
                                    description="Projects and technologies identified from your resume"
                                />


                                <div
                                    className="
                                        grid
                                        gap-4
                                        p-5
                                        sm:p-6
                                    "
                                >

                                    {data.projects.map(
                                        (
                                            project,
                                            index
                                        ) => (

                                            <ProjectCard
                                                key={index}
                                                project={
                                                    project
                                                }
                                            />

                                        )
                                    )}

                                </div>

                            </SectionCard>

                        )}


                        {/* =================================
                            ## Education
                        ================================= */}

                        {data.education?.length > 0 && (

                            <SectionCard>

                                <SectionHeader
                                    icon={
                                        <GraduationCap
                                            size={20}
                                        />
                                    }
                                    title="Education"
                                    description="Academic background identified from your resume"
                                />


                                <div
                                    className="
                                        space-y-4
                                        p-5
                                        sm:p-6
                                    "
                                >

                                    {data.education.map(
                                        (
                                            education,
                                            index
                                        ) => (

                                            <EducationCard
                                                key={index}
                                                education={
                                                    education
                                                }
                                            />

                                        )
                                    )}

                                </div>

                            </SectionCard>

                        )}


                        {/* =================================
                            ## Certifications
                        ================================= */}

                        {data.certifications?.length > 0 && (

                            <SectionCard>

                                <SectionHeader
                                    icon={
                                        <Award size={20} />
                                    }
                                    title="Certifications"
                                    description="Professional certifications identified from your resume"
                                />


                                <div
                                    className="
                                        grid
                                        gap-3
                                        p-5
                                        sm:grid-cols-2
                                        sm:p-6
                                    "
                                >

                                    {data.certifications.map(
                                        (
                                            certification,
                                            index
                                        ) => (

                                            <div
                                                key={`${certification}-${index}`}
                                                className="
                                                    flex
                                                    items-center
                                                    gap-3
                                                    rounded-xl
                                                    bg-[var(--surface-container-low)]
                                                    p-4
                                                "
                                            >

                                                <CheckCircle2
                                                    size={18}
                                                    className="
                                                        shrink-0
                                                        text-[var(--primary)]
                                                    "
                                                />


                                                <span
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-[var(--on-surface)]
                                                    "
                                                >
                                                    {certification}
                                                </span>

                                            </div>

                                        )
                                    )}

                                </div>

                            </SectionCard>

                        )}


                        {/* =================================
                            ## Extracted Text
                        ================================= */}

                        {resume.extractedText && (

                            <SectionCard>

                                <SectionHeader
                                    icon={
                                        <FileText size={20} />
                                    }
                                    title="Extracted Resume Text"
                                    description="Text extracted from the uploaded resume document"
                                />


                                <div className="p-5 sm:p-6">

                                    <div
                                        className="
                                            max-h-[500px]
                                            overflow-y-auto
                                            rounded-2xl
                                            bg-[var(--surface-container-low)]
                                            p-4
                                            sm:p-5
                                        "
                                    >

                                        <pre
                                            className="
                                                whitespace-pre-wrap
                                                break-words
                                                font-sans
                                                text-sm
                                                leading-7
                                                text-[var(--on-surface-variant)]
                                            "
                                        >
                                            {resume.extractedText}
                                        </pre>

                                    </div>

                                </div>

                            </SectionCard>

                        )}

                    </main>


                    {/* =====================================
                        ## Sidebar
                    ===================================== */}

                    <aside
                        className="
                            space-y-6
                            xl:sticky
                            xl:top-6
                            xl:h-fit
                        "
                    >


                        {/* =================================
                            ## Resume Overview
                        ================================= */}

                        <SectionCard>

                            <div className="p-6">


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
                                            rounded-2xl
                                            bg-[var(--primary-fixed)]
                                            text-[var(--primary)]
                                        "
                                    >
                                        <Contact size={19} />
                                    </div>


                                    <div>

                                        <h2
                                            className="
                                                font-[var(--font-heading)]
                                                text-lg
                                                font-bold
                                                text-[var(--on-surface)]
                                            "
                                        >
                                            Resume Overview
                                        </h2>


                                        <p
                                            className="
                                                text-xs
                                                text-[var(--on-surface-variant)]
                                            "
                                        >
                                            Your professional profile
                                        </p>

                                    </div>

                                </div>


                                <div
                                    className="
                                        mt-6
                                        space-y-5
                                    "
                                >

                                    <OverviewItem
                                        label="Skills"
                                        description="Technical and professional skills"
                                        value={
                                            data.skills?.length ||
                                            0
                                        }
                                    />


                                    <Divider />


                                    <OverviewItem
                                        label="Experience"
                                        description="Work experience entries"
                                        value={
                                            data.experience
                                                ?.length || 0
                                        }
                                    />


                                    <Divider />


                                    <OverviewItem
                                        label="Projects"
                                        description="Projects identified"
                                        value={
                                            data.projects?.length ||
                                            0
                                        }
                                    />


                                    <Divider />


                                    <OverviewItem
                                        label="Education"
                                        description="Academic entries"
                                        value={
                                            data.education
                                                ?.length || 0
                                        }
                                    />

                                </div>

                            </div>

                        </SectionCard>


                        {/* =================================
                            ## File Information
                        ================================= */}

                        <SectionCard>

                            <div className="p-6">


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
                                            rounded-2xl
                                            bg-[var(--surface-container-low)]
                                            text-[var(--primary)]
                                        "
                                    >
                                        <FileText size={19} />
                                    </div>


                                    <div>

                                        <h2
                                            className="
                                                font-[var(--font-heading)]
                                                text-base
                                                font-bold
                                                text-[var(--on-surface)]
                                            "
                                        >
                                            File Information
                                        </h2>

                                    </div>

                                </div>


                                <div
                                    className="
                                        mt-5
                                        space-y-4
                                    "
                                >

                                    <MetadataItem
                                        label="File Type"
                                        value={
                                            resume.fileType?.toUpperCase()
                                        }
                                    />


                                    <MetadataItem
                                        label="File Size"
                                        value={
                                            formatFileSize(
                                                resume.fileSize
                                            )
                                        }
                                    />


                                    {createdDate && (

                                        <MetadataItem
                                            label="Uploaded"
                                            value={createdDate}
                                        />

                                    )}


                                    {updatedDate && (

                                        <MetadataItem
                                            label="Last Updated"
                                            value={updatedDate}
                                        />

                                    )}

                                </div>

                            </div>

                        </SectionCard>


                        {/* =================================
                            ## AI Resume Intelligence
                        ================================= */}

                        <div
                            className="
                                rounded-[1.75rem]
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
                                AI Resume Intelligence
                            </h3>


                            <p
                                className="
                                    mt-3
                                    text-sm
                                    leading-7
                                    text-white/75
                                "
                            >
                                Turn your resume into a structured
                                professional profile that can be used
                                for job matching and ATS analysis.

                            </p>


                            {!parsed && (

                                <button
                                    type="button"
                                    disabled={
                                        isParsing ||
                                        !resume.extractedText
                                    }
                                    onClick={
                                        handleParseResume
                                    }
                                    className="
                                        mt-6
                                        inline-flex
                                        w-full
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-white
                                        px-4
                                        py-3
                                        text-sm
                                        font-bold
                                        text-[var(--primary)]
                                        transition
                                        hover:bg-white/90
                                        disabled:opacity-50
                                    "
                                >

                                    {isParsing ? (

                                        <Loader2
                                            size={17}
                                            className="animate-spin"
                                        />

                                    ) : (

                                        <Sparkles size={17} />

                                    )}

                                    Parse Resume

                                </button>

                            )}

                        </div>

                    </aside>

                </div>

            </div>

        </div>

    );

}


/* =============================================
    ## Overview Item
============================================= */

function OverviewItem({

    label,
    description,
    value,

}) {

    return (

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
                        text-sm
                        font-semibold
                        text-[var(--on-surface)]
                    "
                >
                    {label}
                </p>


                <p
                    className="
                        mt-1
                        text-xs
                        text-[var(--on-surface-variant)]
                    "
                >
                    {description}
                </p>

            </div>


            <span
                className="
                    text-lg
                    font-extrabold
                    text-[var(--primary)]
                "
            >
                {value}
            </span>

        </div>

    );

}


/* =============================================
    ## Metadata Item
============================================= */

function MetadataItem({

    label,
    value,

}) {

    return (

        <div>

            <p
                className="
                    text-xs
                    font-semibold
                    text-[var(--on-surface-variant)]
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    break-all
                    text-sm
                    font-bold
                    text-[var(--on-surface)]
                "
            >
                {value || "—"}
            </p>

        </div>

    );

}


/* =============================================
    ## Divider
============================================= */

function Divider() {

    return (

        <div
            className="
                h-px
                bg-[var(--outline-variant)]
            "
        />

    );

}


export default ResumeDetails;
