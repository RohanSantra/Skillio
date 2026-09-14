import {
    BriefcaseBusiness,
    Plus,
} from "lucide-react";


const ApplicationEmptyState = ({
    onCreate,
}) => {

    return (

        <div
            className="
                flex
                min-h-[420px]
                flex-col
                items-center
                justify-center
                rounded-[2rem]
                border
                border-dashed
                border-[var(--outline-variant)]
                bg-[var(--surface-container-low)]
                px-6
                py-12
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
                    rounded-3xl
                    bg-[var(--primary-fixed)]
                    text-[var(--primary)]
                "
            >

                <BriefcaseBusiness
                    size={28}
                />

            </div>


            <h3
                className="
                    mt-6
                    text-xl
                    font-extrabold
                    text-[var(--on-surface)]
                "
            >
                No applications yet
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
                Start tracking your job applications
                by connecting one with a job workspace
                you have already created.
            </p>


            <button
                type="button"
                onClick={onCreate}
                className="
                    mt-7
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
                    shadow-sm
                    transition
                    hover:opacity-90
                "
            >

                <Plus
                    size={17}
                />

                New Application

            </button>

        </div>

    );

};


export default ApplicationEmptyState;