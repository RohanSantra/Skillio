import {
    Building2,
    CalendarDays,
    FileText,
    Pencil,
    Trash2,
    X,
} from "lucide-react";

import ApplicationStatusBadge
    from "./ApplicationStatusBadge";


const formatDate = (date) => {

    if (!date) {
        return "Not specified";
    }

    try {

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        ).format(
            new Date(date)
        );

    } catch {

        return "Not specified";

    }

};


const ApplicationDetailsModal = ({
    isOpen,
    onClose,
    application,
    workspace,
    onEdit,
    onDelete,
}) => {

    if (
        !isOpen ||
        !application
    ) {
        return null;
    }


    const role =
        workspace?.role ||
        workspace?.jobTitle ||
        workspace?.title ||
        "Untitled position";


    const company =
        workspace?.company ||
        workspace?.companyName ||
        "Unknown company";


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
                    max-w-2xl
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
                                bg-[var(--primary-fixed)]
                                text-[var(--primary)]
                            "
                        >

                            <Building2
                                size={22}
                            />

                        </div>


                        <div>

                            <h2
                                className="
                                    text-xl
                                    font-extrabold
                                    text-[var(--on-surface)]
                                "
                            >
                                {role}
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                {company}
                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        onClick={onClose}
                        className="
                            flex
                            h-9
                            w-9
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


                {/* CONTENT */}

                <div
                    className="
                        space-y-6
                        p-6
                    "
                >

                    {/* STATUS */}

                    <div
                        className="
                            rounded-2xl
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-low)]
                            p-5
                        "
                    >

                        <p
                            className="
                                mb-3
                                text-xs
                                font-bold
                                uppercase
                                tracking-wider
                                text-[var(--on-surface-variant)]
                            "
                        >
                            Current status
                        </p>

                        <ApplicationStatusBadge
                            status={
                                application.status
                            }
                        />

                    </div>


                    {/* DATES */}

                    <div
                        className="
                            grid
                            gap-4
                            sm:grid-cols-2
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
                                    items-center
                                    gap-2
                                    text-[var(--on-surface-variant)]
                                "
                            >

                                <CalendarDays
                                    size={17}
                                />

                                <span
                                    className="
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wider
                                    "
                                >
                                    Applied
                                </span>

                            </div>


                            <p
                                className="
                                    mt-3
                                    text-sm
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                            >
                                {formatDate(
                                    application.appliedAt
                                )}
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
                                    items-center
                                    gap-2
                                    text-[var(--on-surface-variant)]
                                "
                            >

                                <CalendarDays
                                    size={17}
                                />

                                <span
                                    className="
                                        text-xs
                                        font-bold
                                        uppercase
                                        tracking-wider
                                    "
                                >
                                    Added
                                </span>

                            </div>


                            <p
                                className="
                                    mt-3
                                    text-sm
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                            >
                                {formatDate(
                                    application.createdAt
                                )}
                            </p>

                        </div>

                    </div>


                    {/* NOTES */}

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
                                gap-2
                            "
                        >

                            <FileText
                                size={17}
                                className="
                                    text-[var(--primary)]
                                "
                            />

                            <h3
                                className="
                                    text-sm
                                    font-extrabold
                                    text-[var(--on-surface)]
                                "
                            >
                                Notes
                            </h3>

                        </div>


                        <p
                            className="
                                mt-4
                                whitespace-pre-wrap
                                text-sm
                                leading-7
                                text-[var(--on-surface-variant)]
                            "
                        >
                            {application.notes?.trim()
                                ? application.notes
                                : "No notes added for this application."}
                        </p>

                    </div>

                </div>


                {/* FOOTER */}

                <div
                    className="
                        flex
                        flex-col-reverse
                        gap-3
                        border-t
                        border-[var(--outline-variant)]
                        px-6
                        py-5
                        sm:flex-row
                        sm:justify-between
                    "
                >

                    <button
                        type="button"
                        onClick={onDelete}
                        className="
                            inline-flex
                            min-h-11
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            px-4
                            text-sm
                            font-bold
                            text-[var(--error)]
                            transition
                            hover:bg-[var(--error-container)]
                        "
                    >

                        <Trash2
                            size={17}
                        />

                        Delete

                    </button>


                    <div
                        className="
                            flex
                            gap-3
                        "
                    >

                        <button
                            type="button"
                            onClick={onClose}
                            className="
                                min-h-11
                                rounded-xl
                                border
                                border-[var(--outline-variant)]
                                px-5
                                text-sm
                                font-bold
                                text-[var(--on-surface)]
                                hover:bg-[var(--surface-container-low)]
                            "
                        >
                            Close
                        </button>


                        <button
                            type="button"
                            onClick={onEdit}
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
                                hover:opacity-90
                            "
                        >

                            <Pencil
                                size={16}
                            />

                            Edit

                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

};


export default ApplicationDetailsModal;