import {
    BriefcaseBusiness,
    CheckCircle2,
    CircleAlert,
    Clock3,
    Filter,
    LoaderCircle,
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

import useJobWorkspace from "../../job-workspace/hooks/useJobWorkspace.js"

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
        label: "All applications",
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

    // =============================================
    // APPLICATION
    // =============================================

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


    // =============================================
    // JOB WORKSPACE
    // =============================================

    const {
        jobWorkspaces,

        isLoading:
            isLoadingWorkspaces,

        getAllJobWorkspaces,
    } = useJobWorkspace();


    // =============================================
    // LOCAL STATE
    // =============================================

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


    // =============================================
    // LOAD DATA
    // =============================================

    useEffect(() => {

        getAllApplications()
            .catch(() => {});

        getAllJobWorkspaces()
            .catch(() => {});

    }, [
        getAllApplications,
        getAllJobWorkspaces,
    ]);


    // =============================================
    // WORKSPACE MAP
    // =============================================

    const workspaceMap =
        useMemo(() => {

            const map =
                new Map();

            jobWorkspaces.forEach(
                (workspace) => {

                    map.set(
                        workspace._id,
                        workspace
                    );

                }
            );

            return map;

        }, [
            jobWorkspaces,
        ]);


    // =============================================
    // FILTERED APPLICATIONS
    // =============================================

    const filteredApplications =
        useMemo(() => {

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


    // =============================================
    // STATS
    // =============================================

    const stats =
        useMemo(() => {

            return {

                total:
                    applications.length,

                applied:
                    applications.filter(
                        (item) =>
                            item.status ===
                            "applied"
                    ).length,

                interviews:
                    applications.filter(
                        (item) =>
                            item.status ===
                            "interview"
                    ).length,

                offers:
                    applications.filter(
                        (item) =>
                            item.status ===
                            "offer"
                    ).length,

            };

        }, [
            applications,
        ]);


    // =============================================
    // CREATE
    // =============================================

    const handleCreate =
        async (data) => {

            try {
                await createApplication(data);
                toast.success("Application created successfully.");
                setShowCreateModal(false);
            } catch (error) {
                toast.error(
                    error?.response?.data?.message ||
                    error?.message ||
                    "Unable to create application."
                );
            }

        };


    // =============================================
    // UPDATE
    // =============================================

    const handleUpdate =
        async (data) => {

            if (
                !selectedApplication
            ) {
                return;
            }


            try {
                await updateApplication(
                    selectedApplication._id,
                    data
                );

                toast.success("Application updated successfully.");
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


    // =============================================
    // DELETE
    // =============================================

    const handleDelete =
        async (application) => {

            if (!application) {
                return;
            }


            setApplicationToDelete(application);

        };

    const handleConfirmDelete = async () => {
        if (!applicationToDelete?._id) {
            return;
        }

        try {
            await deleteApplication(applicationToDelete._id);
            toast.success("Application deleted successfully.");
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


    // =============================================
    // OPEN DETAILS
    // =============================================

    const handleView =
        (application) => {

            setSelectedApplication(
                application
            );

            setShowDetailsModal(
                true
            );

        };


    // =============================================
    // OPEN EDIT
    // =============================================

    const handleEdit =
        () => {

            setShowDetailsModal(
                false
            );

            setShowEditModal(
                true
            );

        };


    // =============================================
    // LOADING
    // =============================================

    if (
        isLoading &&
        !applications.length
    ) {

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
                        space-y-6
                    "
                >

                    <div
                        className="
                            h-56
                            animate-pulse
                            rounded-[2rem]
                            bg-[var(--surface-container-high)]
                        "
                    />

                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-2
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

                </div>

            </div>

        );

    }


    // =============================================
    // PAGE
    // =============================================

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
                "
            >

                {/* =================================
                    HERO
                ================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-[2rem]
                        bg-[var(--primary)]
                        px-6
                        py-8
                        shadow-[var(--shadow-md)]
                        sm:px-8
                        sm:py-10
                    "
                >

                    {/* Decorative */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-24
                            h-64
                            w-64
                            rounded-full
                            bg-white/10
                            blur-2xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-32
                            right-20
                            h-72
                            w-72
                            rounded-full
                            bg-white/5
                            blur-3xl
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            flex-col
                            justify-between
                            gap-7
                            lg:flex-row
                            lg:items-end
                        "
                    >

                        <div
                            className="
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
                                    text-xs
                                    font-bold
                                    text-white
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
                                    text-3xl
                                    font-extrabold
                                    tracking-tight
                                    text-white
                                    sm:text-4xl
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
                            "
                        >

                            <Plus
                                size={18}
                            />

                            New Application

                        </button>

                    </div>

                </section>


                {/* =================================
                    STATS
                ================================= */}

                <section
                    className="
                        mt-6
                        grid
                        gap-4
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    <StatCard
                        label="Total applications"
                        value={
                            stats.total
                        }
                        icon={
                            BriefcaseBusiness
                        }
                    />

                    <StatCard
                        label="Applied"
                        value={
                            stats.applied
                        }
                        icon={
                            CheckCircle2
                        }
                    />

                    <StatCard
                        label="Interviews"
                        value={
                            stats.interviews
                        }
                        icon={
                            Clock3
                        }
                    />

                    <StatCard
                        label="Offers"
                        value={
                            stats.offers
                        }
                        icon={
                            Target
                        }
                    />

                </section>


                {/* =================================
                    ERROR
                ================================= */}

                <ErrorToast error={error} />


                {/* =================================
                    TOOLBAR
                ================================= */}

                <section
                    className="
                        mt-8
                        rounded-[1.5rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        p-4
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >

                        {/* SEARCH */}

                        <div
                            className="
                                relative
                                w-full
                                lg:max-w-md
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
                                value={
                                    search
                                }
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search by role, company or notes..."
                                className="
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-low)]
                                    pl-11
                                    pr-4
                                    text-sm
                                    text-[var(--on-surface)]
                                    outline-none
                                    transition
                                    focus:border-[var(--primary)]
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-[var(--primary-fixed)]/60
                                "
                            />

                        </div>


                        {/* FILTER */}

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                overflow-x-auto
                                pb-1
                            "
                        >

                            <Filter
                                size={17}
                                className="
                                    shrink-0
                                    text-[var(--on-surface-variant)]
                                "
                            />

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
                                            whitespace-nowrap
                                            rounded-xl
                                            px-3.5
                                            py-2.5
                                            text-xs
                                            font-bold
                                            transition
                                            ${
                                                statusFilter ===
                                                filter.value
                                                    ? `
                                                        bg-[var(--primary)]
                                                        text-white
                                                    `
                                                    : `
                                                        text-[var(--on-surface-variant)]
                                                        hover:bg-[var(--surface-container-low)]
                                                    `
                                            }
                                        `}
                                    >
                                        {
                                            filter.label
                                        }
                                    </button>

                                )
                            )}

                        </div>

                    </div>

                </section>


                {/* =================================
                    APPLICATIONS
                ================================= */}

                <section
                    className="
                        mt-6
                    "
                >

                    <div
                        className="
                            mb-4
                            flex
                            items-center
                            justify-between
                            gap-4
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-xl
                                    font-extrabold
                                    text-[var(--on-surface)]
                                "
                            >
                                Your applications
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                {filteredApplications.length}
                                {" "}
                                {filteredApplications.length ===
                                1
                                    ? "application"
                                    : "applications"}
                                {" "}
                                shown
                            </p>

                        </div>

                    </div>


                    {applications.length ===
                        0 ? (

                        <ApplicationEmptyState
                            onCreate={() =>
                                setShowCreateModal(
                                    true
                                )
                            }
                        />

                    ) : filteredApplications.length ===
                      0 ? (

                        <NoResults
                            search={
                                search
                            }
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
                                gap-5
                                md:grid-cols-2
                                xl:grid-cols-3
                            "
                        >

                            {filteredApplications.map(
                                (
                                    application
                                ) => (

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


            {/* =================================
                CREATE MODAL
            ================================= */}

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


            {/* =================================
                DETAILS MODAL
            ================================= */}

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


            {/* =================================
                EDIT MODAL
            ================================= */}

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

            {applicationToDelete && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget && !isDeleting) {
                            setApplicationToDelete(null);
                        }
                    }}
                >
                    <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-[var(--outline-variant)] bg-[var(--surface-container-lowest)] shadow-[var(--shadow-lg)]">
                        <div className="flex items-start gap-4 border-b border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-6 py-6">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--error-container)] text-[var(--error)]">
                                <CircleAlert size={21} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[var(--on-surface)]">
                                    Delete application?
                                </h2>
                                <p className="mt-1 text-sm leading-6 text-[var(--on-surface-variant)]">
                                    This action cannot be undone. The application will be permanently removed.
                                </p>
                            </div>
                        </div>

                        <div className="px-6 py-5">
                            <p className="rounded-xl bg-[var(--surface-container-low)] px-4 py-3 text-sm font-semibold text-[var(--on-surface)]">
                                {workspaceMap.get(applicationToDelete.jobId)?.role ||
                                    "Selected application"}
                            </p>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-[var(--outline-variant)] bg-[var(--surface-container-low)] px-6 py-5 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setApplicationToDelete(null)}
                                disabled={isDeleting}
                                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-[var(--on-surface-variant)] transition hover:bg-[var(--surface-container-high)] disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                disabled={isDeleting}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--error)] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isDeleting ? "Deleting..." : "Delete application"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>

    );

};


// =================================================
// STAT CARD
// =================================================

const StatCard = ({
    label,
    value,
    icon: Icon,
}) => {

    return (

        <div
            className="
                rounded-2xl
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
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

                    <Icon
                        size={19}
                    />

                </div>


                <p
                    className="
                        text-2xl
                        font-extrabold
                        text-[var(--on-surface)]
                    "
                >
                    {value}
                </p>

            </div>


            <p
                className="
                    mt-4
                    text-sm
                    font-bold
                    text-[var(--on-surface-variant)]
                "
            >
                {label}
            </p>

        </div>

    );

};


// =================================================
// NO RESULTS
// =================================================

const NoResults = ({
    search,
    onClear,
}) => {

    return (

        <div
            className="
                flex
                min-h-[300px]
                flex-col
                items-center
                justify-center
                rounded-[2rem]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-low)]
                px-6
                text-center
            "
        >

            <Search
                size={28}
                className="
                    text-[var(--on-surface-variant)]
                "
            />


            <h3
                className="
                    mt-5
                    text-lg
                    font-extrabold
                    text-[var(--on-surface)]
                "
            >
                No applications found
            </h3>


            <p
                className="
                    mt-2
                    text-sm
                    text-[var(--on-surface-variant)]
                "
            >
                Try changing your search or
                application status filter.
            </p>


            <button
                type="button"
                onClick={
                    onClear
                }
                className="
                    mt-5
                    rounded-xl
                    bg-[var(--primary)]
                    px-4
                    py-2.5
                    text-sm
                    font-bold
                    text-white
                "
            >
                Clear filters
            </button>

        </div>

    );

};


export default Applications;