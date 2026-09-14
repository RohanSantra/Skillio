import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    Archive,
    ArchiveRestore,
    BriefcaseBusiness,
    Building2,
    ChevronRight,
    CircleAlert,
    ClipboardList,
    Clock3,
    FileSearch,
    FolderPlus,
    Loader2,
    MoreHorizontal,
    Plus,
    Search,
    Sparkles,
    Target,
    Trash2,
    X,
    ArrowUpRight,
} from "lucide-react";

import {
    toast,
} from "sonner";

import useJobWorkspace from
    "../hooks/useJobWorkspace";
import HeroStat from "../../../components/HeroStat ";
import ErrorToast from "../../../components/feedback/ErrorToast.jsx";


// ============================================================
// ## CONSTANTS
// ============================================================

const TABS = [
    {
        id: "active",
        label: "Active",
    },
    {
        id: "archived",
        label: "Archived",
    },
];


// ============================================================
// ## UTILITY FUNCTIONS
// ============================================================

const getInitials = (company = "") => {

    return company
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0])
        .join("")
        .toUpperCase();

};


const formatDate = (date) => {

    if (!date) {
        return "Recently";
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


const truncateText = (
    text = "",
    length = 150
) => {

    if (text.length <= length) {
        return text;
    }

    return `${text.slice(0, length)}...`;

};


// ============================================================
// ## JOB MATCH SCORE COMPONENT
// ============================================================

const JobMatchScore = ({
    score,
}) => {

    if (
        score === null ||
        score === undefined
    ) {
        return (
            <div className="
                flex
                items-center
                gap-2
                text-sm
                text-[var(--on-surface-variant)]
            ">
                <Target size={16} />

                <span>
                    Match not analyzed
                </span>
            </div>
        );
    }


    let scoreClasses =
        "bg-[var(--primary-fixed)] text-[var(--on-primary-fixed)]";

    if (score < 50) {

        scoreClasses =
            "bg-[var(--error-container)] text-[var(--on-error-container)]";

    } else if (score < 75) {

        scoreClasses =
            "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]";

    }


    return (
        <div
            className={`
                inline-flex
                items-center
                gap-2
                rounded-full
                px-3
                py-1.5
                text-sm
                font-semibold
                ${scoreClasses}
            `}
        >
            <Target size={15} />

            {score}% Match
        </div>
    );

};


// ============================================================
// ## AI ANALYSIS STATUS COMPONENT
// ============================================================

const AnalysisStatus = ({
    workspace,
}) => {

    const isAnalyzed =
        workspace?.jobAnalysis?.analyzedAt;

    if (isAnalyzed) {

        return (
            <div className="
                flex
                items-center
                gap-2
                text-sm
                text-[var(--primary)]
            ">
                <Sparkles size={16} />

                <span>
                    AI analyzed
                </span>
            </div>
        );

    }


    return (
        <div className="
            flex
            items-center
            gap-2
            text-sm
            text-[var(--on-surface-variant)]
        ">
            <Clock3 size={16} />

            <span>
                Analysis pending
            </span>
        </div>
    );

};


// ============================================================
// ## WORKSPACE CARD COMPONENT
// ============================================================

const WorkspaceCard = ({
    workspace,
    onOpen,
    onArchive,
    onDelete,
    isUpdating,
}) => {

    const [menuOpen, setMenuOpen] =
        useState(false);


    const isArchived =
        workspace.status === "archived";


    const jobMatchScore =
        workspace?.jobMatch?.score;


    const requiredSkills =
        workspace?.jobAnalysis?.requiredSkills || [];


    return (
        <article
            className="
                group
                relative
                flex
                flex-col
                rounded-[var(--radius-xl)]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                p-5
                shadow-[var(--shadow-sm)]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[var(--shadow-md)]
                sm:p-6
            "
        >

            {/* ============================================= */}
            {/* ## CARD HEADER */}
            {/* ============================================= */}

            <div className="
                flex
                items-start
                justify-between
                gap-4
            ">

                <button
                    type="button"
                    onClick={onOpen}
                    className="
                        flex
                        min-w-0
                        flex-1
                        items-start
                        gap-4
                        text-left
                    "
                >

                    {/* Company Avatar */}

                    <div className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-2xl
                        bg-[var(--primary-fixed)]
                        font-[var(--font-heading)]
                        text-sm
                        font-bold
                        text-[var(--on-primary-fixed)]
                    ">
                        {getInitials(
                            workspace.company
                        )}
                    </div>


                    {/* Company + Role */}

                    <div className="
                        min-w-0
                        flex-1
                    ">

                        <p className="
                            truncate
                            text-sm
                            font-semibold
                            text-[var(--on-surface-variant)]
                        ">
                            {workspace.company}
                        </p>


                        <h3 className="
                            mt-1
                            line-clamp-2
                            font-[var(--font-heading)]
                            text-lg
                            font-bold
                            leading-6
                            text-[var(--on-surface)]
                        ">
                            {workspace.role}
                        </h3>

                    </div>

                </button>


                {/* ========================================= */}
                {/* ## ACTION MENU */}
                {/* ========================================= */}

                <div className="relative">

                    <button
                        type="button"
                        aria-label="Workspace actions"
                        onClick={() =>
                            setMenuOpen(
                                (value) => !value
                            )
                        }
                        className="
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            text-[var(--on-surface-variant)]
                            transition
                            hover:bg-[var(--surface-container-low)]
                            hover:text-[var(--on-surface)]
                        "
                    >
                        <MoreHorizontal
                            size={20}
                        />
                    </button>


                    {menuOpen && (

                        <div className="
                            absolute
                            right-0
                            top-12
                            z-20
                            w-48
                            overflow-hidden
                            rounded-xl
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-lowest)]
                            p-1.5
                            shadow-[var(--shadow-lg)]
                        ">

                            <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => {

                                    setMenuOpen(false);

                                    onArchive();

                                }}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-3
                                    py-2.5
                                    text-left
                                    text-sm
                                    font-medium
                                    text-[var(--on-surface)]
                                    transition
                                    hover:bg-[var(--surface-container-low)]
                                    disabled:opacity-50
                                "
                            >

                                {isArchived ? (
                                    <ArchiveRestore
                                        size={17}
                                    />
                                ) : (
                                    <Archive
                                        size={17}
                                    />
                                )}

                                {isArchived
                                    ? "Restore workspace"
                                    : "Archive workspace"
                                }

                            </button>


                            {/* TODO : make it soft delete to avoid application crash  */}
                            {/* <div className="
                                my-1
                                h-px
                                bg-[var(--outline-variant)]
                            " />


                            <button
                                type="button"
                                disabled={isUpdating}
                                onClick={() => {

                                    setMenuOpen(false);

                                    onDelete();

                                }}
                                className="
                                    flex
                                    w-full
                                    items-center
                                    gap-3
                                    rounded-lg
                                    px-3
                                    py-2.5
                                    text-left
                                    text-sm
                                    font-medium
                                    text-[var(--error)]
                                    transition
                                    hover:bg-[var(--error-container)]
                                    disabled:opacity-50
                                "
                            >
                                <Trash2
                                    size={17}
                                />

                                Delete workspace

                            </button> */}

                        </div>

                    )}

                </div>

            </div>


            {/* ============================================= */}
            {/* ## JOB DESCRIPTION */}
            {/* ============================================= */}

            <p className="
                mt-5
                line-clamp-3
                text-sm
                leading-6
                text-[var(--on-surface-variant)]
            ">
                {truncateText(
                    workspace.jobDescription,
                    180
                )}
            </p>


            {/* ============================================= */}
            {/* ## STATUS */}
            {/* ============================================= */}

            <div className="
                mt-5
                flex
                flex-wrap
                items-center
                gap-3
            ">

                <AnalysisStatus
                    workspace={workspace}
                />

                <span className="
                    hidden
                    h-1
                    w-1
                    rounded-full
                    bg-[var(--outline)]
                    sm:block
                " />

                <JobMatchScore
                    score={jobMatchScore}
                />

            </div>


            {/* ============================================= */}
            {/* ## SKILLS */}
            {/* ============================================= */}

            {requiredSkills.length > 0 && (

                <div className="
                    mt-5
                    flex
                    flex-wrap
                    gap-2
                ">

                    {requiredSkills
                        .slice(0, 4)
                        .map((skill) => (

                            <span
                                key={skill}
                                className="
                                    rounded-full
                                    bg-[var(--surface-container-low)]
                                    px-3
                                    py-1
                                    text-xs
                                    font-medium
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                {skill}
                            </span>

                        ))}


                    {requiredSkills.length > 4 && (

                        <span className="
                            rounded-full
                            bg-[var(--surface-container)]
                            px-3
                            py-1
                            text-xs
                            font-semibold
                            text-[var(--on-surface-variant)]
                        ">
                            +{requiredSkills.length - 4}
                        </span>

                    )}

                </div>

            )}


            {/* ============================================= */}
            {/* ## FOOTER */}
            {/* ============================================= */}

            <div className="
                mt-auto
                flex
                items-center
                justify-between
                gap-4
                border-t
                border-[var(--outline-variant)]
                pt-5
            ">

                <div className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-[var(--on-surface-variant)]
                ">

                    <Clock3 size={14} />

                    Updated{" "}

                    {formatDate(
                        workspace.updatedAt
                    )}

                </div>


                <button
                    type="button"
                    onClick={onOpen}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-[var(--primary)]
                        transition
                        hover:bg-[var(--primary-fixed)]
                    "
                >
                    Open

                    <ChevronRight
                        size={17}
                    />
                </button>

            </div>

        </article>
    );

};


// ============================================================
// ## EMPTY STATE COMPONENT
// ============================================================

const EmptyState = ({
    isArchived,
    onCreate,
}) => {

    return (
        <div className="
            flex
            min-h-[420px]
            flex-col
            items-center
            justify-center
            rounded-[var(--radius-xl)]
            border
            border-dashed
            border-[var(--outline-variant)]
            bg-[var(--surface-container-low)]
            px-6
            text-center
        ">

            <div className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-3xl
                bg-[var(--primary-fixed)]
                text-[var(--primary)]
            ">

                {isArchived ? (
                    <Archive size={30} />
                ) : (
                    <BriefcaseBusiness
                        size={30}
                    />
                )}

            </div>


            <h2 className="
                mt-6
                font-[var(--font-heading)]
                text-xl
                font-bold
                text-[var(--on-surface)]
            ">

                {isArchived
                    ? "No archived workspaces"
                    : "Create your first job workspace"
                }

            </h2>


            <p className="
                mt-3
                max-w-md
                text-sm
                leading-6
                text-[var(--on-surface-variant)]
            ">

                {isArchived
                    ? "Archived opportunities will appear here. You can restore them anytime."
                    : "Add a job description and let Skillio analyze the role, match your profile, identify skill gaps, and help you prepare."
                }

            </p>


            {!isArchived && (

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
                        font-semibold
                        text-[var(--on-primary)]
                        shadow-[var(--shadow-sm)]
                        transition
                        hover:-translate-y-0.5
                        hover:bg-[var(--primary-container)]
                    "
                >
                    <Plus size={18} />

                    Create workspace

                </button>

            )}

        </div>
    );

};


// ============================================================
// ## CREATE WORKSPACE MODAL
// ============================================================

const CreateWorkspaceModal = ({
    onClose,
    onCreate,
    isCreating,
}) => {

    const [formData, setFormData] =
        useState({
            company: "",
            role: "",
            jobDescription: "",
            source: "manual",
        });


    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );

    };


    const handleSubmit =
        async (event) => {

            event.preventDefault();


            if (
                !formData.company.trim() ||
                !formData.role.trim() ||
                !formData.jobDescription.trim()
            ) {

                toast.error(
                    "Please fill in all required fields."
                );

                return;

            }


            try {

                const response =
                    await onCreate({
                        ...formData,
                        company:
                            formData.company.trim(),
                        role:
                            formData.role.trim(),
                        jobDescription:
                            formData.jobDescription.trim(),
                    });


                const workspace =
                    response?.data?.data
                        ?.jobWorkspace;


                toast.success(
                    "Workspace created and analyzed successfully!"
                );


                if (workspace?._id) {
                    onClose(
                        workspace._id
                    );
                } else {
                    onClose();
                }

            } catch (error) {

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to create workspace."
                );

            }

        };


    return (

        <div className="
            fixed
            inset-0
            z-50
            flex
            items-end
            justify-center
            bg-black/35
            p-0
            backdrop-blur-sm
            sm:items-center
            sm:p-6
        ">

            <div className="
                max-h-[92vh]
                w-full
                max-w-2xl
                overflow-y-auto
                rounded-t-[var(--radius-xl)]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                shadow-[var(--shadow-lg)]
                sm:rounded-[var(--radius-xl)]
            ">

                {/* ========================================= */}
                {/* ## MODAL HEADER */}
                {/* ========================================= */}

                <div className="
                    flex
                    items-start
                    justify-between
                    gap-4
                    border-b
                    border-[var(--outline-variant)]
                    p-6
                ">

                    <div>

                        <div className="
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-2xl
                            bg-[var(--primary-fixed)]
                            text-[var(--primary)]
                        ">
                            <FolderPlus
                                size={22}
                            />
                        </div>


                        <h2 className="
                            mt-4
                            font-[var(--font-heading)]
                            text-2xl
                            font-bold
                            text-[var(--on-surface)]
                        ">
                            New job workspace
                        </h2>


                        <p className="
                            mt-2
                            text-sm
                            leading-6
                            text-[var(--on-surface-variant)]
                        ">
                            Add a job opportunity and Skillio will automatically analyze the job description.
                        </p>

                    </div>


                    <button
                        type="button"
                        disabled={isCreating}
                        onClick={onClose}
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
                            hover:bg-[var(--surface-container-low)]
                            disabled:opacity-50
                        "
                    >
                        <X size={20} />
                    </button>

                </div>


                {/* ========================================= */}
                {/* ## CREATE FORM */}
                {/* ========================================= */}

                <form
                    onSubmit={handleSubmit}
                    className="p-6"
                >

                    <div className="
                        grid
                        gap-5
                        sm:grid-cols-2
                    ">

                        {/* Company */}

                        <div>

                            <label
                                htmlFor="company"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-[var(--on-surface)]
                                "
                            >
                                Company
                            </label>


                            <div className="relative">

                                <Building2
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
                                    id="company"
                                    name="company"
                                    type="text"
                                    placeholder="e.g. Google"
                                    value={
                                        formData.company
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        isCreating
                                    }
                                    className="
                                        form-input
                                        pl-11
                                    "
                                />

                            </div>

                        </div>


                        {/* Role */}

                        <div>

                            <label
                                htmlFor="role"
                                className="
                                    mb-2
                                    block
                                    text-sm
                                    font-semibold
                                    text-[var(--on-surface)]
                                "
                            >
                                Role
                            </label>


                            <div className="relative">

                                <BriefcaseBusiness
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
                                    id="role"
                                    name="role"
                                    type="text"
                                    placeholder="e.g. Software Engineer"
                                    value={
                                        formData.role
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={
                                        isCreating
                                    }
                                    className="
                                        form-input
                                        pl-11
                                    "
                                />

                            </div>

                        </div>

                    </div>


                    {/* Job Description */}

                    <div className="mt-5">

                        <label
                            htmlFor="jobDescription"
                            className="
                                mb-2
                                flex
                                items-center
                                justify-between
                                gap-3
                                text-sm
                                font-semibold
                                text-[var(--on-surface)]
                            "
                        >

                            Job description

                            <span className="
                                text-xs
                                font-normal
                                text-[var(--on-surface-variant)]
                            ">
                                Required
                            </span>

                        </label>


                        <textarea
                            id="jobDescription"
                            name="jobDescription"
                            rows={10}
                            placeholder="Paste the complete job description here..."
                            value={
                                formData.jobDescription
                            }
                            onChange={
                                handleChange
                            }
                            disabled={
                                isCreating
                            }
                            className="
                                min-h-[220px]
                                w-full
                                resize-y
                                rounded-[var(--radius-md)]
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface-container-low)]
                                p-4
                                text-sm
                                leading-6
                                text-[var(--on-surface)]
                                outline-none
                                transition
                                placeholder:text-[var(--on-surface-variant)]/60
                                hover:border-[var(--outline)]
                                focus:border-[var(--primary)]
                                focus:ring-2
                                focus:ring-[var(--primary-fixed)]
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        />


                        <p className="
                            mt-2
                            text-xs
                            text-[var(--on-surface-variant)]
                        ">
                            The AI will extract responsibilities, required skills, keywords, and other important information.
                        </p>

                    </div>


                    {/* ===================================== */}
                    {/* ## MODAL ACTIONS */}
                    {/* ===================================== */}

                    <div className="
                        mt-7
                        flex
                        flex-col-reverse
                        gap-3
                        sm:flex-row
                        sm:justify-end
                    ">

                        <button
                            type="button"
                            disabled={isCreating}
                            onClick={onClose}
                            className="
                                rounded-xl
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface-container-lowest)]
                                px-5
                                py-3
                                text-sm
                                font-semibold
                                text-[var(--on-surface)]
                                transition
                                hover:bg-[var(--surface-container-low)]
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={isCreating}
                            className="
                                inline-flex
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-[var(--primary)]
                                px-6
                                py-3
                                text-sm
                                font-semibold
                                text-[var(--on-primary)]
                                shadow-[var(--shadow-sm)]
                                transition
                                hover:bg-[var(--primary-container)]
                                disabled:cursor-not-allowed
                                disabled:opacity-65
                            "
                        >

                            {isCreating ? (

                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />

                                    Creating & analyzing...

                                </>

                            ) : (

                                <>
                                    <Sparkles
                                        size={18}
                                    />

                                    Create workspace
                                </>

                            )}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


// ============================================================
// ## DELETE CONFIRMATION MODAL
// ============================================================

const DeleteConfirmationModal = ({
    workspace,
    onClose,
    onConfirm,
    isUpdating,
}) => {

    if (!workspace) {
        return null;
    }


    return (

        <div className="
            fixed
            inset-0
            z-[60]
            flex
            items-center
            justify-center
            bg-black/40
            p-4
            backdrop-blur-sm
        ">

            <div className="
                w-full
                max-w-md
                rounded-[var(--radius-xl)]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                p-6
                shadow-[var(--shadow-lg)]
            ">

                <div className="
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[var(--error-container)]
                    text-[var(--error)]
                ">
                    <Trash2 size={22} />
                </div>


                <h2 className="
                    mt-5
                    font-[var(--font-heading)]
                    text-xl
                    font-bold
                    text-[var(--on-surface)]
                ">
                    Delete workspace?
                </h2>


                <p className="
                    mt-3
                    text-sm
                    leading-6
                    text-[var(--on-surface-variant)]
                ">
                    You are about to permanently delete the{" "}

                    <span className="
                        font-semibold
                        text-[var(--on-surface)]
                    ">
                        {workspace.role}
                    </span>

                    {" "}workspace at{" "}

                    <span className="
                        font-semibold
                        text-[var(--on-surface)]
                    ">
                        {workspace.company}
                    </span>

                    . This action cannot be undone.
                </p>


                <div className="
                    mt-7
                    flex
                    justify-end
                    gap-3
                ">

                    <button
                        type="button"
                        disabled={isUpdating}
                        onClick={onClose}
                        className="
                            rounded-xl
                            border
                            border-[var(--outline-variant)]
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-[var(--on-surface)]
                            transition
                            hover:bg-[var(--surface-container-low)]
                            disabled:opacity-50
                        "
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        disabled={isUpdating}
                        onClick={onConfirm}
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            bg-[var(--error)]
                            px-4
                            py-2.5
                            text-sm
                            font-semibold
                            text-[var(--on-error)]
                            transition
                            hover:opacity-90
                            disabled:opacity-60
                        "
                    >

                        {isUpdating && (
                            <Loader2
                                size={17}
                                className="animate-spin"
                            />
                        )}

                        Delete

                    </button>

                </div>

            </div>

        </div>

    );

};


// ============================================================
// ## LOADING SKELETON
// ============================================================

const WorkspaceSkeleton = () => {

    return (
        <div className="
            animate-pulse
            rounded-[var(--radius-xl)]
            border
            border-[var(--outline-variant)]
            bg-[var(--surface-container-lowest)]
            p-6
        ">

            <div className="
                flex
                items-start
                gap-4
            ">

                <div className="
                    h-12
                    w-12
                    rounded-2xl
                    bg-[var(--surface-container-high)]
                " />

                <div className="flex-1">

                    <div className="
                        h-4
                        w-24
                        rounded
                        bg-[var(--surface-container-high)]
                    " />

                    <div className="
                        mt-3
                        h-6
                        w-3/4
                        rounded
                        bg-[var(--surface-container-high)]
                    " />

                </div>

            </div>


            <div className="
                mt-6
                h-16
                rounded-xl
                bg-[var(--surface-container-high)]
            " />


            <div className="
                mt-5
                flex
                gap-2
            ">

                <div className="
                    h-7
                    w-20
                    rounded-full
                    bg-[var(--surface-container-high)]
                " />

                <div className="
                    h-7
                    w-24
                    rounded-full
                    bg-[var(--surface-container-high)]
                " />

            </div>

        </div>
    );

};


// ============================================================
// ## MAIN COMPONENT
// ============================================================

const JobWorkspaces = () => {

    // ========================================================
    // ## ROUTER
    // ========================================================

    const navigate =
        useNavigate();


    // ========================================================
    // ## JOB WORKSPACE HOOK
    // ========================================================

    const {

        jobWorkspaces,

        isLoading,
        isCreating,
        isUpdating,

        error,

        getAllJobWorkspaces,
        createJobWorkspace,
        updateJobWorkspaceStatus,
        deleteJobWorkspace,

        clearError,

    } = useJobWorkspace();


    // ========================================================
    // ## LOCAL UI STATE
    // ========================================================

    const [activeTab, setActiveTab] =
        useState("active");


    const [searchQuery, setSearchQuery] =
        useState("");


    const [showCreateModal,
        setShowCreateModal] =
        useState(false);


    const [workspaceToDelete,
        setWorkspaceToDelete] =
        useState(null);


    // ========================================================
    // ## FETCH WORKSPACES
    // ========================================================

    useEffect(() => {

        const loadWorkspaces =
            async () => {

                try {

                    await getAllJobWorkspaces();

                } catch (error) {

                    toast.error(
                        error?.response?.data?.message ||
                        "Failed to load job workspaces."
                    );

                }

            };


        loadWorkspaces();

    }, [
        getAllJobWorkspaces,
    ]);


    // ========================================================
    // ## FILTER WORKSPACES
    // ========================================================

    const filteredWorkspaces =
        useMemo(() => {

            const normalizedQuery =
                searchQuery
                    .trim()
                    .toLowerCase();


            return jobWorkspaces.filter(
                (workspace) => {

                    const matchesTab =
                        workspace.status ===
                        activeTab;


                    if (!matchesTab) {
                        return false;
                    }


                    if (!normalizedQuery) {
                        return true;
                    }


                    const searchableText = [
                        workspace.company,
                        workspace.role,
                    ]
                        .join(" ")
                        .toLowerCase();


                    return searchableText.includes(
                        normalizedQuery
                    );

                }
            );

        }, [
            jobWorkspaces,
            activeTab,
            searchQuery,
        ]);


    // ========================================================
    // ## COUNTS
    // ========================================================

    const activeCount =
        jobWorkspaces.filter(
            (workspace) =>
                workspace.status === "active"
        ).length;


    const archivedCount =
        jobWorkspaces.filter(
            (workspace) =>
                workspace.status === "archived"
        ).length;


    // ========================================================
    // ## OPEN WORKSPACE
    // ========================================================

    const handleOpenWorkspace =
        (jobId) => {

            navigate(
                `/job-workspaces/${jobId}`
            );

        };


    // ========================================================
    // ## CREATE WORKSPACE
    // ========================================================

    const handleCreateWorkspace =
        async (data) => {

            const response =
                await createJobWorkspace(data);


            const workspace =
                response?.data?.data
                    ?.jobWorkspace;


            if (workspace?._id) {

                navigate(
                    `/job-workspaces/${workspace._id}`
                );

            }


            return response;

        };


    // ========================================================
    // ## ARCHIVE / RESTORE
    // ========================================================

    const handleStatusChange =
        async (workspace) => {

            const nextStatus =
                workspace.status === "active"
                    ? "archived"
                    : "active";


            try {

                await updateJobWorkspaceStatus(
                    workspace._id,
                    nextStatus
                );


                toast.success(

                    nextStatus === "archived"
                        ? "Workspace archived."
                        : "Workspace restored."

                );

            } catch (error) {

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to update workspace."
                );

            }

        };


    // ========================================================
    // ## DELETE WORKSPACE
    // ========================================================

    const handleDeleteWorkspace =
        async () => {

            if (!workspaceToDelete) {
                return;
            }


            try {

                await deleteJobWorkspace(
                    workspaceToDelete._id
                );


                toast.success(
                    "Workspace deleted successfully."
                );


                setWorkspaceToDelete(
                    null
                );

            } catch (error) {

                toast.error(
                    error?.response?.data?.message ||
                    "Failed to delete workspace."
                );

            }

        };


    // ========================================================
    // ## ERROR BANNER CLOSE
    // ========================================================

    const handleCloseError =
        () => {

            clearError();

        };


    // ========================================================
    // ## RENDER
    // ========================================================

    return (

        <main className="
            min-h-screen
            bg-[var(--background)]
            px-4
            py-6
            sm:px-6
            lg:px-10
            lg:py-10
        ">

            <div className="
                mx-auto
                max-w-[1500px]
            ">


                {/* ============================================================
    JOB WORKSPACES HERO
============================================================ */}

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
                            "linear-gradient(135deg, var(--primary) 0%, var(--primary-container) 58%, #6d7865 100%)",
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

                                <BriefcaseBusiness size={16} />

                                AI-Powered Job Intelligence

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

                                Turn every opportunity
                                <br />

                                into a preparation plan.

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

                                Organize your target jobs, understand what employers
                                are looking for, measure your profile match, identify
                                skill gaps, and prepare with the right context.

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
                                        setShowCreateModal(true)
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

                                    New Job Workspace

                                </button>


                                {activeCount > 0 && (

                                    <button
                                        type="button"
                                        onClick={() => {
                                            const workspace =
                                                jobWorkspaces.find(
                                                    (job) =>
                                                        job.status ===
                                                        "active"
                                                );

                                            if (workspace) {
                                                navigate(
                                                    `/job-workspaces/${workspace._id}`
                                                );
                                            }
                                        }}
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

                                        <ArrowUpRight size={17} />

                                        Open Active Workspace

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
                                value={activeCount}
                                label="Active"
                                icon={BriefcaseBusiness}
                            />

                            <HeroStat
                                value={archivedCount}
                                label="Archived"
                                icon={Archive}
                            />

                            <HeroStat
                                value={jobWorkspaces.length}
                                label="Total"
                                icon={FileSearch}
                            />

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* ## ERROR BANNER */}
                {/* ================================================= */}

                <ErrorToast error={error} />



                {/* ================================================= */}
                {/* ## FILTERS */}
                {/* ================================================= */}

                <section className="
                    mt-8
                    flex
                    flex-col
                    gap-4
                    rounded-[var(--radius-lg)]
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-lowest)]
                    p-4
                    shadow-[var(--shadow-sm)]
                    md:flex-row
                    md:items-center
                    md:justify-between
                ">


                    {/* ============================================= */}
                    {/* ## TABS */}
                    {/* ============================================= */}

                    <div className="
                        inline-flex
                        w-full
                        rounded-xl
                        bg-[var(--surface-container-low)]
                        p-1
                        md:w-auto
                    ">

                        {TABS.map(
                            (tab) => {

                                const count =
                                    tab.id === "active"
                                        ? activeCount
                                        : archivedCount;


                                const isActive =
                                    activeTab === tab.id;


                                return (

                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() =>
                                            setActiveTab(
                                                tab.id
                                            )
                                        }
                                        className={`
                                            flex
                                            flex-1
                                            items-center
                                            justify-center
                                            gap-2
                                            rounded-lg
                                            px-4
                                            py-2.5
                                            text-sm
                                            font-semibold
                                            transition-all
                                            md:flex-none

                                            ${isActive

                                                ? `
                                                    bg-[var(--surface-container-lowest)]
                                                    text-[var(--on-surface)]
                                                    shadow-[var(--shadow-sm)]
                                                `

                                                : `
                                                    text-[var(--on-surface-variant)]
                                                    hover:text-[var(--on-surface)]
                                                `
                                            }
                                        `}
                                    >

                                        {tab.label}

                                        <span className={`
                                            rounded-full
                                            px-2
                                            py-0.5
                                            text-xs

                                            ${isActive

                                                ? `
                                                    bg-[var(--primary-fixed)]
                                                    text-[var(--on-primary-fixed)]
                                                `

                                                : `
                                                    bg-[var(--surface-container)]
                                                `
                                            }
                                        `}>
                                            {count}
                                        </span>

                                    </button>

                                );

                            }
                        )}

                    </div>


                    {/* ============================================= */}
                    {/* ## SEARCH */}
                    {/* ============================================= */}

                    <div className="
                        relative
                        w-full
                        md:max-w-sm
                    ">

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
                            type="text"
                            placeholder="Search company or role..."
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                            className="
                                form-input
                                pl-11
                                pr-10
                            "
                        />


                        {searchQuery && (

                            <button
                                type="button"
                                onClick={() =>
                                    setSearchQuery("")
                                }
                                className="
                                    absolute
                                    right-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-[var(--on-surface-variant)]
                                    transition
                                    hover:text-[var(--on-surface)]
                                "
                            >
                                <X size={17} />
                            </button>

                        )}

                    </div>

                </section>


                {/* ================================================= */}
                {/* ## WORKSPACE GRID */}
                {/* ================================================= */}

                <section className="mt-6">

                    {isLoading ? (

                        <div className="
                            grid
                            gap-5
                            md:grid-cols-2
                            xl:grid-cols-3
                        ">

                            {[1, 2, 3, 4, 5, 6].map(
                                (item) => (

                                    <WorkspaceSkeleton
                                        key={item}
                                    />

                                )
                            )}

                        </div>

                    ) : filteredWorkspaces.length === 0 ? (

                        searchQuery ? (

                            <div className="
                                flex
                                min-h-[350px]
                                flex-col
                                items-center
                                justify-center
                                rounded-[var(--radius-xl)]
                                border
                                border-dashed
                                border-[var(--outline-variant)]
                                bg-[var(--surface-container-low)]
                                px-6
                                text-center
                            ">

                                <Search
                                    size={34}
                                    className="
                                        text-[var(--on-surface-variant)]
                                    "
                                />


                                <h2 className="
                                    mt-5
                                    font-[var(--font-heading)]
                                    text-xl
                                    font-bold
                                    text-[var(--on-surface)]
                                ">
                                    No workspaces found
                                </h2>


                                <p className="
                                    mt-2
                                    text-sm
                                    text-[var(--on-surface-variant)]
                                ">
                                    Try searching with a different company or role.
                                </p>


                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearchQuery("")
                                    }
                                    className="
                                        mt-5
                                        text-sm
                                        font-semibold
                                        text-[var(--primary)]
                                    "
                                >
                                    Clear search
                                </button>

                            </div>

                        ) : (

                            <EmptyState
                                isArchived={
                                    activeTab ===
                                    "archived"
                                }
                                onCreate={() =>
                                    setShowCreateModal(
                                        true
                                    )
                                }
                            />

                        )

                    ) : (

                        <div className="
                            grid
                            gap-5
                            md:grid-cols-2
                            xl:grid-cols-3
                        ">

                            {filteredWorkspaces.map(
                                (workspace) => (

                                    <WorkspaceCard
                                        key={
                                            workspace._id
                                        }
                                        workspace={
                                            workspace
                                        }
                                        isUpdating={
                                            isUpdating
                                        }
                                        onOpen={() =>
                                            handleOpenWorkspace(
                                                workspace._id
                                            )
                                        }
                                        onArchive={() =>
                                            handleStatusChange(
                                                workspace
                                            )
                                        }
                                        onDelete={() =>
                                            setWorkspaceToDelete(
                                                workspace
                                            )
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

                </section>


                {/* ================================================= */}
                {/* ## CREATE MODAL */}
                {/* ================================================= */}

                {showCreateModal && (

                    <CreateWorkspaceModal
                        isCreating={
                            isCreating
                        }
                        onCreate={
                            handleCreateWorkspace
                        }
                        onClose={() =>
                            setShowCreateModal(
                                false
                            )
                        }
                    />

                )}


                {/* ================================================= */}
                {/* ## DELETE MODAL */}
                {/* ================================================= */}

                <DeleteConfirmationModal
                    workspace={
                        workspaceToDelete
                    }
                    isUpdating={
                        isUpdating
                    }
                    onClose={() =>
                        setWorkspaceToDelete(
                            null
                        )
                    }
                    onConfirm={
                        handleDeleteWorkspace
                    }
                />

            </div>

        </main>

    );

};


export default JobWorkspaces;