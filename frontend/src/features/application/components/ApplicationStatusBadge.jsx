import {
    Bookmark,
    CheckCircle2,
    CircleX,
    Gift,
    MessageSquareText,
} from "lucide-react";


const STATUS_CONFIG = {

    saved: {
        label: "Saved",
        icon: Bookmark,
        className:
            "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
    },

    applied: {
        label: "Applied",
        icon: CheckCircle2,
        className:
            "bg-[var(--primary-fixed)] text-[var(--primary)]",
    },

    interview: {
        label: "Interview",
        icon: MessageSquareText,
        className:
            "bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]",
    },

    offer: {
        label: "Offer",
        icon: Gift,
        className:
            "bg-[var(--primary-fixed)] text-[var(--primary)]",
    },

    rejected: {
        label: "Rejected",
        icon: CircleX,
        className:
            "bg-[var(--error-container)] text-[var(--on-error-container)]",
    },

};


const ApplicationStatusBadge = ({
    status,
}) => {

    const config =
        STATUS_CONFIG[status] ||
        STATUS_CONFIG.saved;

    const Icon = config.icon;

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

            <Icon size={14} />

            {config.label}

        </span>

    );

};


export default ApplicationStatusBadge;