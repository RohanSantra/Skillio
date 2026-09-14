import {
    CalendarDays,
    Check,
    ChevronDown,
    FileText,
    LoaderCircle,
    X,
} from "lucide-react";
import { toast } from "sonner";

import {
    useEffect,
    useMemo,
    useState,
} from "react";

import ApplicationStatusBadge
    from "./ApplicationStatusBadge";


const STATUS_OPTIONS = [
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
        label: "Offer",
    },
    {
        value: "rejected",
        label: "Rejected",
    },
];


const formatWorkspaceLabel = (
    workspace
) => {

    const role =
        workspace?.role ||
        workspace?.jobTitle ||
        workspace?.title ||
        "Untitled position";

    const company =
        workspace?.company ||
        workspace?.companyName ||
        "";

    return company
        ? `${role} — ${company}`
        : role;

};


const ApplicationModal = ({
    isOpen,
    onClose,
    onSubmit,
    isSubmitting,
    workspaces = [],
    initialApplication = null,
    mode = "create",
}) => {

    const isEdit =
        mode === "edit";


    const [
        selectedJobId,
        setSelectedJobId,
    ] = useState("");


    const [
        status,
        setStatus,
    ] = useState("saved");


    const [
        appliedAt,
        setAppliedAt,
    ] = useState("");


    const [
        notes,
        setNotes,
    ] = useState("");



    // ---------------------------------------------
    // Initialize form
    // ---------------------------------------------

    useEffect(() => {

        if (!isOpen) {
            return;
        }

        if (initialApplication) {

            setSelectedJobId(
                initialApplication.jobId || ""
            );

            setStatus(
                initialApplication.status ||
                "saved"
            );

            setAppliedAt(
                initialApplication.appliedAt
                    ? new Date(
                        initialApplication.appliedAt
                    )
                        .toISOString()
                        .slice(0, 10)
                    : ""
            );

            setNotes(
                initialApplication.notes ||
                ""
            );

        } else {

            setSelectedJobId("");

            setStatus("saved");

            setAppliedAt("");

            setNotes("");

        }

    }, [
        isOpen,
        initialApplication,
    ]);


    // ---------------------------------------------
    // Selected workspace
    // ---------------------------------------------

    const selectedWorkspace =
        useMemo(
            () =>
                workspaces.find(
                    (workspace) =>
                        workspace._id ===
                        selectedJobId
                ),
            [
                workspaces,
                selectedJobId,
            ]
        );


    // ---------------------------------------------
    // Submit
    // ---------------------------------------------

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();

        if (!isEdit && !selectedJobId) {

            toast.error("Please choose a job workspace.");

            return;

        }


        if (
            status === "applied" &&
            !appliedAt
        ) {

            toast.error("Please select the application date.");

            return;

        }


        const data = {

            ...(isEdit
                ? {}
                : {
                    jobId:
                        selectedJobId,
                }),

            status,

            appliedAt:
                appliedAt
                    ? new Date(
                        `${appliedAt}T00:00:00`
                    ).toISOString()
                    : null,

            notes:
                notes.trim(),

        };


        try {

            await onSubmit(
                data
            );

        } catch {
            // Parent handles server error.
        }

    };


    if (!isOpen) {
        return null;
    }


    return (

        <div
            className="
                fixed
                inset-0
                z-50
                flex
                items-center
                justify-center
                bg-black/40
                p-4
                backdrop-blur-sm
            "
            onMouseDown={(event) => {

                if (
                    event.target ===
                    event.currentTarget
                ) {
                    onClose();
                }

            }}
        >

            <div
                className="
                    max-h-[90vh]
                    w-full
                    max-w-xl
                    overflow-y-auto
                    rounded-[2rem]
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-lowest)]
                    shadow-[var(--shadow-lg)]
                "
            >

                {/* HEADER */}

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-[var(--outline-variant)]
                        px-6
                        py-5
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
                            {isEdit
                                ? "Update application"
                                : "New application"}
                        </h2>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-[var(--on-surface-variant)]
                            "
                        >
                            {isEdit
                                ? "Keep your application status and notes up to date."
                                : "Connect this application to one of your job workspaces."}
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            text-[var(--on-surface-variant)]
                            hover:bg-[var(--surface-container-low)]
                        "
                    >

                        <X
                            size={19}
                        />

                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className="
                        space-y-6
                        p-6
                    "
                >

                    {/* JOB */}

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
                            Job workspace
                        </label>


                        {isEdit ? (

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-low)]
                                    px-4
                                    py-3
                                    text-sm
                                    text-[var(--on-surface)]
                                "
                            >

                                {formatWorkspaceLabel(
                                    selectedWorkspace
                                )}

                            </div>

                        ) : (

                            <div
                                className="
                                    relative
                                "
                            >

                                <select
                                    value={
                                        selectedJobId
                                    }
                                    onChange={(event) =>
                                        setSelectedJobId(
                                            event.target.value
                                        )
                                    }
                                    className="
                                        h-13
                                        w-full
                                        appearance-none
                                        rounded-xl
                                        border
                                        border-[var(--outline-variant)]
                                        bg-[var(--surface-container-low)]
                                        px-4
                                        pr-11
                                        text-sm
                                        text-[var(--on-surface)]
                                        outline-none
                                        transition
                                        focus:border-[var(--primary)]
                                        focus:bg-white
                                        focus:ring-4
                                        focus:ring-[var(--primary-fixed)]/60
                                    "
                                >

                                    <option value="">
                                        Choose a job workspace
                                    </option>

                                    {workspaces.map(
                                        (
                                            workspace
                                        ) => (

                                            <option
                                                key={
                                                    workspace._id
                                                }
                                                value={
                                                    workspace._id
                                                }
                                            >
                                                {formatWorkspaceLabel(
                                                    workspace
                                                )}
                                            </option>

                                        )
                                    )}

                                </select>


                                <ChevronDown
                                    size={18}
                                    className="
                                        pointer-events-none
                                        absolute
                                        right-4
                                        top-1/2
                                        -translate-y-1/2
                                        text-[var(--on-surface-variant)]
                                    "
                                />

                            </div>

                        )}


                        {!workspaces.length &&
                            !isEdit && (

                                <p
                                    className="
                                    mt-2
                                    text-xs
                                    text-[var(--error)]
                                "
                                >
                                    Create a job workspace first
                                    before adding an application.
                                </p>

                            )}

                    </div>


                    {/* STATUS */}

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
                            Application status
                        </label>


                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-2
                                sm:grid-cols-5
                            "
                        >

                            {STATUS_OPTIONS.map(
                                (option) => (

                                    <button
                                        key={
                                            option.value
                                        }
                                        type="button"
                                        onClick={() =>
                                            setStatus(
                                                option.value
                                            )
                                        }
                                        className={`
                                            flex
                                            min-h-11
                                            items-center
                                            justify-center
                                            rounded-xl
                                            border
                                            px-3
                                            text-xs
                                            font-bold
                                            transition
                                            ${status ===
                                                option.value
                                                ? `
                                                        border-[var(--primary)]
                                                        bg-[var(--primary-fixed)]
                                                        text-[var(--primary)]
                                                    `
                                                : `
                                                        border-[var(--outline-variant)]
                                                        bg-[var(--surface-container-lowest)]
                                                        text-[var(--on-surface-variant)]
                                                        hover:bg-[var(--surface-container-low)]
                                                    `
                                            }
                                        `}
                                    >
                                        {option.label}
                                    </button>

                                )
                            )}

                        </div>

                    </div>


                    {/* DATE */}

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
                            Application date
                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <CalendarDays
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
                                type="date"
                                value={
                                    appliedAt
                                }
                                onChange={(event) =>
                                    setAppliedAt(
                                        event.target.value
                                    )
                                }
                                className="
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-low)]
                                    px-4
                                    pl-11
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


                        <p
                            className="
                                mt-2
                                text-xs
                                text-[var(--on-surface-variant)]
                            "
                        >
                            Required when the status is
                            Applied.
                        </p>

                    </div>


                    {/* NOTES */}

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
                            Notes
                        </label>


                        <div
                            className="
                                relative
                            "
                        >

                            <FileText
                                size={18}
                                className="
                                    pointer-events-none
                                    absolute
                                    left-4
                                    top-4
                                    text-[var(--on-surface-variant)]
                                "
                            />

                            <textarea
                                value={
                                    notes
                                }
                                onChange={(event) =>
                                    setNotes(
                                        event.target.value
                                    )
                                }
                                maxLength={3000}
                                rows={5}
                                placeholder="Add interview details, recruiter information, follow-ups, or anything you want to remember..."
                                className="
                                    w-full
                                    resize-y
                                    rounded-xl
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-low)]
                                    p-4
                                    pl-11
                                    text-sm
                                    leading-6
                                    text-[var(--on-surface)]
                                    outline-none
                                    transition
                                    placeholder:text-[var(--on-surface-variant)]/60
                                    focus:border-[var(--primary)]
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-[var(--primary-fixed)]/60
                                "
                            />

                        </div>


                        <div
                            className="
                                mt-1.5
                                text-right
                                text-xs
                                text-[var(--on-surface-variant)]
                            "
                        >
                            {notes.length}/3000
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
                            pt-5
                            sm:flex-row
                            sm:justify-end
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            disabled={
                                isSubmitting
                            }
                            className="
                                min-h-11
                                rounded-xl
                                border
                                border-[var(--outline-variant)]
                                px-5
                                text-sm
                                font-bold
                                text-[var(--on-surface)]
                                transition
                                hover:bg-[var(--surface-container-low)]
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                (
                                    !isEdit &&
                                    !workspaces.length
                                )
                            }
                            className="
                                inline-flex
                                min-h-11
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                bg-[var(--primary)]
                                px-6
                                text-sm
                                font-bold
                                text-white
                                transition
                                hover:opacity-90
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                            "
                        >

                            {isSubmitting ? (

                                <LoaderCircle
                                    size={17}
                                    className="
                                        animate-spin
                                    "
                                />

                            ) : (

                                <Check
                                    size={17}
                                />

                            )}

                            {isEdit
                                ? "Save changes"
                                : "Create application"}

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default ApplicationModal;