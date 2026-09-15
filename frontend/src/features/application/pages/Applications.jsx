import {
    BriefcaseBusiness,
    CheckCircle2,
    CircleAlert,
    Clock3,
    Filter,
    Plus,
    Search,
    Sparkles,
    Target,
    X,
} from "lucide-react";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { toast } from "sonner";

import useApplication
    from "../hooks/useApplication.js";

import useJobWorkspace
    from "../../job-workspace/hooks/useJobWorkspace.js";

import ApplicationCard
    from "../components/ApplicationCard";

import ApplicationDetailsModal
    from "../components/ApplicationDetailsModal";

import ApplicationEmptyState
    from "../components/ApplicationEmptyState";

import ApplicationModal
    from "../components/ApplicationModal";

import ErrorToast
    from "../../../components/feedback/ErrorToast.jsx";


const STATUS_FILTERS = [
    {
        value: "all",
        label: "All",
    },
    {
        value: "saved",
        label: "Saved",
    },
    {
        value: "applied",
        label: "Applied",
    },
    {
        value: "interview",
        label: "Interview",
    },
    {
        value: "offer",
        label: "Offers",
    },
    {
        value: "rejected",
        label: "Rejected",
    },
];


const Applications = () => {

    // =========================================================
    // APPLICATION
    // =========================================================

    const {
        applications,
        isLoading,
        isCreating,
        isUpdating,
        isDeleting,
        error,
        getAllApplications,
        createApplication,
        updateApplication,
        deleteApplication,
        clearError,
    } = useApplication();


    // =========================================================
    // JOB WORKSPACE
    // =========================================================

    const {
        jobWorkspaces,
        isLoading: isLoadingWorkspaces,
        getAllJobWorkspaces,
    } = useJobWorkspace();


    // =========================================================
    // LOCAL STATE
    // =========================================================

    const [
        search,
        setSearch,
    ] = useState("");

    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");

    const [
        showCreateModal,
        setShowCreateModal,
    ] = useState(false);

    const [
        showDetailsModal,
        setShowDetailsModal,
    ] = useState(false);

    const [
        showEditModal,
        setShowEditModal,
    ] = useState(false);

    const [
        selectedApplication,
        setSelectedApplication,
    ] = useState(null);

    const [
        applicationToDelete,
        setApplicationToDelete,
    ] = useState(null);


    // =========================================================
    // LOAD DATA
    // =========================================================

    useEffect(() => {

        getAllApplications()
            .catch(() => { });

        getAllJobWorkspaces()
            .catch(() => { });

    }, [
        getAllApplications,
        getAllJobWorkspaces,
    ]);


    // =========================================================
    // WORKSPACE MAP
    // =========================================================

    const workspaceMap = useMemo(() => {

        const map = new Map();

        jobWorkspaces.forEach((workspace) => {

            map.set(
                workspace._id,
                workspace
            );

        });

        return map;

    }, [
        jobWorkspaces,
    ]);


    // =========================================================
    // FILTERED APPLICATIONS
    // =========================================================

    const filteredApplications = useMemo(() => {

        const query =
            search
                .trim()
                .toLowerCase();

        return applications.filter(
            (application) => {

                const workspace =
                    workspaceMap.get(
                        application.jobId
                    );

                const role =
                    workspace?.role ||
                    workspace?.jobTitle ||
                    workspace?.title ||
                    "";

                const company =
                    workspace?.company ||
                    workspace?.companyName ||
                    "";

                const notes =
                    application.notes ||
                    "";

                const matchesSearch =
                    !query ||
                    role
                        .toLowerCase()
                        .includes(query) ||
                    company
                        .toLowerCase()
                        .includes(query) ||
                    notes
                        .toLowerCase()
                        .includes(query);

                const matchesStatus =
                    statusFilter === "all" ||
                    application.status ===
                    statusFilter;

                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );

    }, [
        applications,
        workspaceMap,
        search,
        statusFilter,
    ]);


    // =========================================================
    // STATS
    // =========================================================

    const stats = useMemo(() => {

        return {

            total:
                applications.length,

            applied:
                applications.filter(
                    (item) =>
                        item.status === "applied"
                ).length,

            interviews:
                applications.filter(
                    (item) =>
                        item.status === "interview"
                ).length,

            offers:
                applications.filter(
                    (item) =>
                        item.status === "offer"
                ).length,

        };

    }, [
        applications,
    ]);


    // =========================================================
    // CREATE
    // =========================================================

    const handleCreate = async (data) => {

        try {

            await createApplication(data);

            toast.success(
                "Application created successfully."
            );

            setShowCreateModal(false);

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to create application."
            );

        }

    };


    // =========================================================
    // UPDATE
    // =========================================================

    const handleUpdate = async (data) => {

        if (!selectedApplication) {
            return;
        }

        try {

            await updateApplication(
                selectedApplication._id,
                data
            );

            toast.success(
                "Application updated successfully."
            );

            setShowEditModal(false);
            setShowDetailsModal(false);

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to update application."
            );

        }

    };


    // =========================================================
    // DELETE
    // =========================================================

    const handleDelete = (application) => {

        if (!application) {
            return;
        }

        setApplicationToDelete(
            application
        );

    };


    const handleConfirmDelete = async () => {

        if (!applicationToDelete?._id) {
            return;
        }

        try {

            await deleteApplication(
                applicationToDelete._id
            );

            toast.success(
                "Application deleted successfully."
            );

            setApplicationToDelete(null);
            setShowDetailsModal(false);
            setSelectedApplication(null);

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to delete application."
            );

        }

    };


    // =========================================================
    // VIEW
    // =========================================================

    const handleView = (application) => {

        setSelectedApplication(
            application
        );

        setShowDetailsModal(
            true
        );

    };


    // =========================================================
    // EDIT
    // =========================================================

    const handleEdit = () => {

        setShowDetailsModal(
            false
        );

        setShowEditModal(
            true
        );

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (
        isLoading &&
        !applications.length
    ) {

        return (

            <div
                className="
                    min-h-full
                    w-full
                    bg-[var(--background)]
                    px-3
                    py-4
                    sm:px-5
                    sm:py-6
                    lg:px-7
                    xl:px-8
                "
            >

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-[1500px]
                        space-y-5
                        sm:space-y-6
                    "
                >

                    <div
                        className="
                            h-64
                            animate-pulse
                            rounded-[1.5rem]
                            bg-[var(--surface-container-high)]
                            sm:h-72
                            lg:h-64
                        "
                    />

                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-3
                            sm:gap-4
                            lg:grid-cols-4
                        "
                    >

                        {[1, 2, 3, 4].map(
                            (item) => (

                                <div
                                    key={item}
                                    className="
                                        h-28
                                        animate-pulse
                                        rounded-2xl
                                        bg-[var(--surface-container-high)]
                                    "
                                />

                            )
                        )}

                    </div>

                    <div
                        className="
                            h-24
                            animate-pulse
                            rounded-2xl
                            bg-[var(--surface-container-high)]
                        "
                    />

                </div>

            </div>

        );

    }


    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div
            className="
                min-h-full
                w-full
                bg-[var(--background)]
                px-3
                py-4
                sm:px-5
                sm:py-6
                lg:px-7
                xl:px-8
            "
        >

            <div
                className="
                    mx-auto
                    w-full
                    max-w-[1500px]
                "
            >

                {/* =====================================================
                    HERO
                ====================================================== */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-[1.5rem]
                        bg-[var(--primary)]
                        px-5
                        py-6
                        shadow-[var(--shadow-md)]
                        sm:rounded-[2rem]
                        sm:px-8
                        sm:py-8
                        lg:px-10
                        lg:py-9
                    "
                >

                    {/* Decorative circles */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-20
                            -top-24
                            h-64
                            w-64
                            rounded-full
                            bg-white/10
                            blur-2xl
                            sm:h-80
                            sm:w-80
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-40
                            right-10
                            hidden
                            h-80
                            w-80
                            rounded-full
                            bg-white/5
                            blur-3xl
                            sm:block
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            bottom-0
                            left-1/2
                            h-40
                            w-40
                            -translate-x-1/2
                            rounded-full
                            bg-white/5
                            blur-3xl
                            lg:left-[55%]
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            flex-col
                            gap-7
                            lg:flex-row
                            lg:items-end
                            lg:justify-between
                        "
                    >

                        {/* HERO CONTENT */}

                        <div
                            className="
                                min-w-0
                                max-w-2xl
                            "
                        >

                            <div
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    bg-white/10
                                    px-3
                                    py-1.5
                                    text-[11px]
                                    font-bold
                                    tracking-wide
                                    text-white
                                    sm:text-xs
                                "
                            >

                                <Sparkles
                                    size={14}
                                />

                                Application Tracker

                            </div>


                            <h1
                                className="
                                    mt-4
                                    max-w-xl
                                    text-2xl
                                    font-extrabold
                                    leading-tight
                                    tracking-tight
                                    text-white
                                    sm:text-4xl
                                    lg:text-[2.6rem]
                                "
                            >
                                Keep every opportunity
                                organized.
                            </h1>


                            <p
                                className="
                                    mt-3
                                    max-w-xl
                                    text-sm
                                    leading-6
                                    text-white/75
                                    sm:text-base
                                "
                            >
                                Track where you applied,
                                what stage you are in,
                                and what needs your
                                attention next.
                            </p>

                        </div>


                        {/* HERO BUTTON */}

                        <button
                            type="button"
                            onClick={() => {

                                clearError();

                                setShowCreateModal(
                                    true
                                );

                            }}
                            className="
                                inline-flex
                                min-h-12
                                w-full
                                shrink-0
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-white
                                px-5
                                text-sm
                                font-extrabold
                                text-[var(--primary)]
                                shadow-sm
                                transition
                                hover:-translate-y-0.5
                                hover:shadow-md
                                active:translate-y-0
                                sm:w-auto
                            "
                        >

                            <Plus
                                size={18}
                            />

                            New Application

                        </button>

                    </div>

                </section>


                {/* =====================================================
                    STATS
                ====================================================== */}

                <section
                    className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-3
                        sm:mt-6
                        sm:gap-4
                        lg:grid-cols-4
                    "
                >

                    <StatCard
                        label="Total applications"
                        value={stats.total}
                        icon={BriefcaseBusiness}
                    />

                    <StatCard
                        label="Applied"
                        value={stats.applied}
                        icon={CheckCircle2}
                    />

                    <StatCard
                        label="Interviews"
                        value={stats.interviews}
                        icon={Clock3}
                    />

                    <StatCard
                        label="Offers"
                        value={stats.offers}
                        icon={Target}
                    />

                </section>


                {/* =====================================================
                    ERROR
                ====================================================== */}

                <ErrorToast
                    error={error}
                />


                {/* =====================================================
                    TOOLBAR
                ====================================================== */}

                <section
                    className="
                        mt-6
                        rounded-2xl
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        p-3
                        shadow-sm
                        sm:mt-8
                        sm:rounded-[1.5rem]
                        sm:p-4
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                        "
                    >

                        {/* SEARCH */}

                        <div
                            className="
                                relative
                                w-full
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
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="
                                    Search by role, company or notes...
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
                                    text-[var(--on-surface)]
                                    outline-none
                                    transition
                                    placeholder:text-[var(--on-surface-variant)]
                                    focus:border-[var(--primary)]
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-[var(--primary-fixed)]/60
                                "
                            />

                            {search && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        setSearch("")
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
                                    "
                                    aria-label="Clear search"
                                >

                                    <X
                                        size={16}
                                    />

                                </button>

                            )}

                        </div>


                        {/* FILTERS */}

                        <div
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-2
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[var(--surface-container-low)]
                                    px-3
                                    text-[var(--on-surface-variant)]
                                "
                            >

                                <Filter
                                    size={16}
                                />

                            </div>


                            <div
                                className="
                                    flex
                                    min-w-0
                                    flex-1
                                    gap-2
                                    overflow-x-auto
                                    pb-1
                                    scrollbar-thin
                                "
                            >

                                {STATUS_FILTERS.map(
                                    (filter) => (

                                        <button
                                            key={
                                                filter.value
                                            }
                                            type="button"
                                            onClick={() =>
                                                setStatusFilter(
                                                    filter.value
                                                )
                                            }
                                            className={`
                                                shrink-0
                                                whitespace-nowrap
                                                rounded-xl
                                                px-3.5
                                                py-2.5
                                                text-xs
                                                font-bold
                                                transition
                                                ${statusFilter ===
                                                    filter.value
                                                    ? `
                                                            bg-[var(--primary)]
                                                            text-white
                                                            shadow-sm
                                                        `
                                                    : `
                                                            text-[var(--on-surface-variant)]
                                                            hover:bg-[var(--surface-container-low)]
                                                        `
                                                }
                                            `}
                                        >
                                            {filter.label}
                                        </button>

                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    APPLICATION SECTION
                ====================================================== */}

                <section
                    className="
                        mt-7
                        sm:mt-8
                    "
                >

                    {/* SECTION HEADER */}

                    <div
                        className="
                            mb-4
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                            sm:items-end
                            sm:justify-between
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-lg
                                    font-extrabold
                                    text-[var(--on-surface)]
                                    sm:text-xl
                                "
                            >
                                Your applications
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-[var(--on-surface-variant)]
                                    sm:text-sm
                                "
                            >
                                {filteredApplications.length}{" "}
                                {filteredApplications.length === 1
                                    ? "application"
                                    : "applications"}{" "}
                                shown
                            </p>

                        </div>


                        {/* ACTIVE FILTER INDICATOR */}

                        {(search ||
                            statusFilter !== "all") && (

                                <button
                                    type="button"
                                    onClick={() => {

                                        setSearch("");
                                        setStatusFilter(
                                            "all"
                                        );

                                    }}
                                    className="
                                    inline-flex
                                    w-fit
                                    items-center
                                    gap-1.5
                                    rounded-lg
                                    px-2.5
                                    py-1.5
                                    text-xs
                                    font-bold
                                    text-[var(--primary)]
                                    transition
                                    hover:bg-[var(--primary-fixed)]
                                "
                                >

                                    <X
                                        size={13}
                                    />

                                    Clear filters

                                </button>

                            )}

                    </div>


                    {/* =================================================
                        EMPTY
                    ================================================== */}

                    {applications.length === 0 ? (

                        <ApplicationEmptyState
                            onCreate={() =>
                                setShowCreateModal(
                                    true
                                )
                            }
                        />

                    ) : filteredApplications.length === 0 ? (

                        <NoResults
                            search={search}
                            onClear={() => {

                                setSearch("");
                                setStatusFilter(
                                    "all"
                                );

                            }}
                        />

                    ) : (

                        <div
                            className="
                                grid
                                grid-cols-1
                                gap-4
                                sm:gap-5
                                md:grid-cols-2
                                2xl:grid-cols-3
                            "
                        >

                            {filteredApplications.map(
                                (application) => (

                                    <ApplicationCard
                                        key={
                                            application._id
                                        }
                                        application={
                                            application
                                        }
                                        workspace={
                                            workspaceMap.get(
                                                application.jobId
                                            )
                                        }
                                        onView={() =>
                                            handleView(
                                                application
                                            )
                                        }
                                        onDelete={() =>
                                            handleDelete(
                                                application
                                            )
                                        }
                                    />

                                )
                            )}

                        </div>

                    )}

                </section>

            </div>


            {/* =========================================================
                CREATE MODAL
            ========================================================== */}

            <ApplicationModal
                isOpen={
                    showCreateModal
                }
                onClose={() =>
                    setShowCreateModal(
                        false
                    )
                }
                onSubmit={
                    handleCreate
                }
                isSubmitting={
                    isCreating
                }
                workspaces={
                    jobWorkspaces
                }
            />


            {/* =========================================================
                DETAILS MODAL
            ========================================================== */}

            <ApplicationDetailsModal
                isOpen={
                    showDetailsModal
                }
                onClose={() =>
                    setShowDetailsModal(
                        false
                    )
                }
                application={
                    selectedApplication
                }
                workspace={
                    selectedApplication
                        ? workspaceMap.get(
                            selectedApplication.jobId
                        )
                        : null
                }
                onEdit={
                    handleEdit
                }
                onDelete={() =>
                    handleDelete(
                        selectedApplication
                    )
                }
            />


            {/* =========================================================
                EDIT MODAL
            ========================================================== */}

            <ApplicationModal
                isOpen={
                    showEditModal
                }
                onClose={() =>
                    setShowEditModal(
                        false
                    )
                }
                onSubmit={
                    handleUpdate
                }
                isSubmitting={
                    isUpdating
                }
                workspaces={
                    jobWorkspaces
                }
                initialApplication={
                    selectedApplication
                }
                mode="edit"
            />


            {/* =========================================================
                DELETE CONFIRMATION
            ========================================================== */}

            {applicationToDelete && (

                <div
                    className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-black/40
                        p-3
                        backdrop-blur-sm
                        sm:p-5
                    "
                    onMouseDown={(event) => {

                        if (
                            event.target ===
                            event.currentTarget &&
                            !isDeleting
                        ) {

                            setApplicationToDelete(
                                null
                            );

                        }

                    }}
                >

                    <div
                        className="
                            w-full
                            max-w-md
                            overflow-hidden
                            rounded-2xl
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-lowest)]
                            shadow-[var(--shadow-lg)]
                            sm:rounded-[28px]
                        "
                    >

                        {/* HEADER */}

                        <div
                            className="
                                flex
                                items-start
                                gap-3
                                border-b
                                border-[var(--outline-variant)]
                                bg-[var(--surface-container-low)]
                                px-4
                                py-5
                                sm:gap-4
                                sm:px-6
                                sm:py-6
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
                                    bg-[var(--error-container)]
                                    text-[var(--error)]
                                    sm:h-11
                                    sm:w-11
                                    sm:rounded-2xl
                                "
                            >

                                <CircleAlert
                                    size={20}
                                />

                            </div>


                            <div
                                className="
                                    min-w-0
                                "
                            >

                                <h2
                                    className="
                                        text-base
                                        font-bold
                                        text-[var(--on-surface)]
                                        sm:text-lg
                                    "
                                >
                                    Delete application?
                                </h2>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-[var(--on-surface-variant)]
                                        sm:text-sm
                                        sm:leading-6
                                    "
                                >
                                    This action cannot be
                                    undone. The application
                                    will be permanently removed.
                                </p>

                            </div>

                        </div>


                        {/* APPLICATION */}

                        <div
                            className="
                                px-4
                                py-4
                                sm:px-6
                                sm:py-5
                            "
                        >

                            <p
                                className="
                                    overflow-hidden
                                    text-ellipsis
                                    whitespace-nowrap
                                    rounded-xl
                                    bg-[var(--surface-container-low)]
                                    px-4
                                    py-3
                                    text-sm
                                    font-semibold
                                    text-[var(--on-surface)]
                                "
                            >

                                {workspaceMap.get(
                                    applicationToDelete.jobId
                                )?.role ||
                                    "Selected application"}

                            </p>

                        </div>


                        {/* ACTIONS */}

                        <div
                            className="
                                flex
                                flex-col-reverse
                                gap-2
                                border-t
                                border-[var(--outline-variant)]
                                bg-[var(--surface-container-low)]
                                px-4
                                py-4
                                sm:flex-row
                                sm:justify-end
                                sm:gap-3
                                sm:px-6
                                sm:py-5
                            "
                        >

                            <button
                                type="button"
                                onClick={() =>
                                    setApplicationToDelete(
                                        null
                                    )
                                }
                                disabled={
                                    isDeleting
                                }
                                className="
                                    min-h-11
                                    rounded-xl
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-semibold
                                    text-[var(--on-surface-variant)]
                                    transition
                                    hover:bg-[var(--surface-container-high)]
                                    disabled:opacity-50
                                    sm:min-h-0
                                "
                            >
                                Cancel
                            </button>


                            <button
                                type="button"
                                onClick={
                                    handleConfirmDelete
                                }
                                disabled={
                                    isDeleting
                                }
                                className="
                                    inline-flex
                                    min-h-11
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[var(--error)]
                                    px-5
                                    py-2.5
                                    text-sm
                                    font-bold
                                    text-white
                                    transition
                                    hover:opacity-90
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    sm:min-h-0
                                "
                            >

                                {isDeleting
                                    ? "Deleting..."
                                    : "Delete application"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

};


// =============================================================
// STAT CARD
// =============================================================

const StatCard = ({
    label,
    value,
    icon: Icon,
}) => {

    return (

        <div
            className="
                min-w-0
                rounded-2xl
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                p-4
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
                sm:p-5
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
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
                        bg-[var(--primary-fixed)]
                        text-[var(--primary)]
                        sm:h-10
                        sm:w-10
                    "
                >

                    <Icon
                        size={18}
                    />

                </div>


                <p
                    className="
                        min-w-0
                        truncate
                        text-xl
                        font-extrabold
                        text-[var(--on-surface)]
                        sm:text-2xl
                    "
                >
                    {value}
                </p>

            </div>


            <p
                className="
                    mt-3
                    truncate
                    text-xs
                    font-bold
                    text-[var(--on-surface-variant)]
                    sm:mt-4
                    sm:text-sm
                "
            >
                {label}
            </p>

        </div>

    );

};


// =============================================================
// NO RESULTS
// =============================================================

const NoResults = ({
    search,
    onClear,
}) => {

    return (

        <div
            className="
                flex
                min-h-[280px]
                flex-col
                items-center
                justify-center
                rounded-[1.5rem]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-low)]
                px-5
                text-center
                sm:min-h-[320px]
                sm:rounded-[2rem]
                sm:px-6
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
                    bg-[var(--surface-container-high)]
                    text-[var(--on-surface-variant)]
                "
            >

                <Search
                    size={23}
                />

            </div>


            <h3
                className="
                    mt-5
                    text-base
                    font-extrabold
                    text-[var(--on-surface)]
                    sm:text-lg
                "
            >
                No applications found
            </h3>


            <p
                className="
                    mt-2
                    max-w-md
                    text-xs
                    leading-5
                    text-[var(--on-surface-variant)]
                    sm:text-sm
                    sm:leading-6
                "
            >
                {search
                    ? `Nothing matched "${search}". Try a different search or change your application status filter.`
                    : "Try changing your application status filter."}
            </p>


            <button
                type="button"
                onClick={onClear}
                className="
                    mt-5
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
                    hover:shadow-md
                "
            >
                Clear filters
            </button>

        </div>

    );

};


export default Applications;