import {
    Building2,
    CalendarDays,
    ChevronRight,
    MoreHorizontal,
    Trash2,
} from "lucide-react";

import ApplicationStatusBadge
    from "./ApplicationStatusBadge";


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


const getWorkspaceTitle = (
    workspace
) => {

    if (!workspace) {
        return "Unknown position";
    }

    return (
        workspace.role ||
        workspace.jobTitle ||
        workspace.title ||
        "Untitled position"
    );

};


const getWorkspaceCompany = (
    workspace
) => {

    if (!workspace) {
        return "Unknown company";
    }

    return (
        workspace.company ||
        workspace.companyName ||
        "Unknown company"
    );

};


const ApplicationCard = ({
    application,
    workspace,
    onView,
    onDelete,
}) => {

    const role =
        getWorkspaceTitle(
            workspace
        );

    const company =
        getWorkspaceCompany(
            workspace
        );

    const appliedDate =
        formatDate(
            application.appliedAt
        );

    const createdDate =
        formatDate(
            application.createdAt
        );

    return (

        <div
            className="
                group
                rounded-[1.5rem]
                border
                border-[var(--outline-variant)]
                bg-[var(--surface-container-lowest)]
                p-5
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-[var(--shadow-md)]
            "
        >

            {/* TOP */}

            <div
                className="
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        min-w-0
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
                            size={21}
                        />

                    </div>


                    <div
                        className="
                            min-w-0
                        "
                    >

                        <h3
                            className="
                                truncate
                                text-base
                                font-extrabold
                                text-[var(--on-surface)]
                            "
                        >
                            {role}
                        </h3>

                        <p
                            className="
                                mt-1
                                truncate
                                text-sm
                                text-[var(--on-surface-variant)]
                            "
                        >
                            {company}
                        </p>

                    </div>

                </div>


                <div
                    className="
                        shrink-0
                    "
                >

                    <ApplicationStatusBadge
                        status={
                            application.status
                        }
                    />

                </div>

            </div>


            {/* DATE */}

            <div
                className="
                    mt-5
                    flex
                    flex-wrap
                    gap-x-5
                    gap-y-2
                "
            >

                {appliedDate && (

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-[var(--on-surface-variant)]
                        "
                    >

                        <CalendarDays
                            size={14}
                        />

                        <span>
                            Applied {appliedDate}
                        </span>

                    </div>

                )}


                {!appliedDate &&
                    createdDate && (

                        <div
                            className="
                            flex
                            items-center
                            gap-2
                            text-xs
                            text-[var(--on-surface-variant)]
                        "
                        >

                            <CalendarDays
                                size={14}
                            />

                            <span>
                                Added {createdDate}
                            </span>

                        </div>

                    )}

            </div>


            {/* NOTES */}

            {application.notes?.trim() && (

                <p
                    className="
                        mt-4
                        line-clamp-2
                        text-sm
                        leading-6
                        text-[var(--on-surface-variant)]
                    "
                >
                    {application.notes}
                </p>

            )}


            {/* ACTIONS */}

            <div
                className="
                    mt-5
                    flex
                    items-center
                    justify-between
                    border-t
                    border-[var(--outline-variant)]
                    pt-4
                "
            >

                <button
                    type="button"
                    onClick={onView}
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-sm
                        font-bold
                        text-[var(--primary)]
                        transition
                        hover:gap-2.5
                    "
                >

                    View application

                    <ChevronRight
                        size={16}
                    />

                </button>


                <button
                    type="button"
                    onClick={onDelete}
                    className="
                        inline-flex
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
                    title="Delete application"
                >

                    <Trash2
                        size={17}
                    />

                </button>

            </div>

        </div>

    );

};


export default ApplicationCard;