import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    Loader2,
    ShieldCheck,
} from "lucide-react";
import SuccessToast from "../../../components/feedback/SuccessToast.jsx";

import { toast } from "sonner";

import useAuth from "../hooks/useAuth.js";

import PasswordStrength from "../components/PasswordStrength.jsx";

import {
    isPasswordValid,
} from "../utils/passwordValidation.js";


const ChangePassword = () => {

    const navigate = useNavigate();

    const {
        changePassword,
    } = useAuth();


    // =========================================================
    // STATE
    // =========================================================

    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [showCurrentPassword, setShowCurrentPassword] =
        useState(false);

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const [isSuccess, setIsSuccess] = useState(false);


    // =========================================================
    // HANDLE CHANGE
    // =========================================================

    const handleChange = (event) => {

        const {
            name,
            value,
        } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };


    // =========================================================
    // HANDLE SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        if (isLoading) return;


        // -----------------------------------------------------
        // CURRENT PASSWORD
        // -----------------------------------------------------

        if (!formData.currentPassword) {

            toast.error(
                "Current password is required."
            );

            return;
        }


        // -----------------------------------------------------
        // NEW PASSWORD
        // -----------------------------------------------------

        if (!formData.newPassword) {

            toast.error(
                "Please enter a new password."
            );

            return;
        }


        if (!isPasswordValid(formData.newPassword)) {

            toast.error(
                "Your new password does not meet the requirements."
            );

            return;
        }


        // -----------------------------------------------------
        // SAME PASSWORD
        // -----------------------------------------------------

        if (
            formData.currentPassword ===
            formData.newPassword
        ) {

            toast.error(
                "Your new password must be different from your current password."
            );

            return;
        }


        // -----------------------------------------------------
        // CONFIRM PASSWORD
        // -----------------------------------------------------

        if (!formData.confirmPassword) {

            toast.error(
                "Please confirm your new password."
            );

            return;
        }


        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            toast.error(
                "New passwords do not match."
            );

            return;
        }


        // -----------------------------------------------------
        // API
        // -----------------------------------------------------

        try {

            setIsLoading(true);

            await changePassword(
                formData.currentPassword,
                formData.newPassword
            );


            setIsSuccess(true);

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Unable to change your password. Please try again.";

            toast.error(message);

        } finally {

            setIsLoading(false);
        }
    };


    // =========================================================
    // SUCCESS STATE
    // =========================================================

    if (isSuccess) {

        return (
            <main
                className="
                    min-h-full
                    bg-[var(--surface)]
                    px-4
                    py-6
                    sm:px-6
                    lg:px-8
                    lg:py-8
                "
            >
                <SuccessToast
                    success={isSuccess}
                    message="Password changed successfully."
                />

                <div
                    className="
                        mx-auto
                        w-full
                        max-w-6xl
                    "
                >

                    {/* -------------------------------------------------
                        BACK
                    ------------------------------------------------- */}

                    <Link
                        to="/settings"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-xs
                            font-semibold
                            text-[var(--on-surface-variant)]
                            transition
                            hover:text-[var(--primary)]
                        "
                    >
                        <ArrowLeft size={16} />

                        Back to Settings
                    </Link>


                    {/* -------------------------------------------------
                        SUCCESS CARD
                    ------------------------------------------------- */}

                    <div
                        className="
                            mt-6
                            flex
                            min-h-[calc(100vh-150px)]
                            items-center
                            justify-center
                            rounded-[1.5rem]
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-lowest)]
                            px-6
                            py-16
                            shadow-[var(--shadow-sm)]
                        "
                    >

                        <div
                            className="
                                w-full
                                max-w-xl
                                text-center
                            "
                        >

                            {/* ICON */}

                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-20
                                    w-20
                                    items-center
                                    justify-center
                                    rounded-[1.5rem]
                                    bg-[var(--primary-container)]
                                    text-[var(--primary)]
                                "
                            >
                                <CheckCircle2 size={38} />
                            </div>


                            {/* LABEL */}

                            <div
                                className="
                                    mt-7
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-[var(--primary)]
                                "
                            >
                                Security updated
                            </div>


                            {/* TITLE */}

                            <h1
                                className="
                                    mt-3
                                    font-[var(--font-heading)]
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-[var(--on-surface)]
                                    sm:text-3xl
                                "
                            >
                                Password changed successfully
                            </h1>


                            {/* DESCRIPTION */}

                            <p
                                className="
                                    mx-auto
                                    mt-3
                                    max-w-lg
                                    text-sm
                                    leading-6
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                Your new password is now active.
                                Your account is protected with the
                                updated credentials.
                            </p>


                            {/* ACTIONS */}

                            <div
                                className="
                                    mt-8
                                    flex
                                    flex-col
                                    justify-center
                                    gap-3
                                    sm:flex-row
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/settings",
                                            {
                                                replace: true,
                                            }
                                        )
                                    }
                                    className="
                                        inline-flex
                                        h-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[var(--primary)]
                                        px-5
                                        text-sm
                                        font-bold
                                        text-[var(--on-primary)]
                                        shadow-[var(--shadow-sm)]
                                        transition
                                        hover:-translate-y-0.5
                                        hover:opacity-90
                                    "
                                >
                                    Back to Settings
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            </main>
        );
    }


    // =========================================================
    // MAIN PAGE
    // =========================================================

    return (
        <main
            className="
                min-h-full
                bg-[var(--surface)]
                px-4
                py-6
                sm:px-6
                lg:px-8
                lg:py-8
            "
        >

            <div
                className="
                    mx-auto
                    w-full
                    max-w-6xl
                "
            >

                {/* =====================================================
                    PAGE HEADER
                ===================================================== */}

                <div>

                    <Link
                        to="/settings"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-xs
                            font-semibold
                            text-[var(--on-surface-variant)]
                            transition
                            hover:text-[var(--primary)]
                        "
                    >

                        <ArrowLeft size={16} />

                        Back to Settings

                    </Link>


                    <div
                        className="
                            mt-7
                            flex
                            items-start
                            gap-4
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
                                rounded-xl
                                bg-[var(--primary-container)]
                                text-[var(--on-primary-container)]
                            "
                        >

                            <KeyRound size={20} />

                        </div>


                        <div>

                            <p
                                className="
                                    text-[10px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-[var(--primary)]
                                "
                            >
                                Account security
                            </p>


                            <h1
                                className="
                                    mt-1.5
                                    font-[var(--font-heading)]
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-[var(--on-surface)]
                                    sm:text-3xl
                                "
                            >
                                Change password
                            </h1>


                            <p
                                className="
                                    mt-2
                                    max-w-2xl
                                    text-sm
                                    leading-6
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                Update your password to keep your
                                Skillio account secure.
                            </p>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    FORM CONTAINER
                ===================================================== */}

                <div
                    className="
                        mt-8
                        overflow-hidden
                        rounded-[1.5rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        shadow-[var(--shadow-sm)]
                    "
                >

                    {/* -------------------------------------------------
                        FORM HEADER
                    ------------------------------------------------- */}

                    <div
                        className="
                            border-b
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-low)]
                            px-5
                            py-5
                            sm:px-7
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <ShieldCheck
                                size={18}
                                className="text-[var(--primary)]"
                            />

                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-bold
                                        text-[var(--on-surface)]
                                    "
                                >
                                    Password credentials
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    Enter your current password and
                                    choose a new one.
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* -------------------------------------------------
                        FORM
                    ------------------------------------------------- */}

                    <form
                        onSubmit={handleSubmit}
                        className="
                            px-5
                            py-6
                            sm:px-7
                            sm:py-8
                        "
                    >

                        <div
                            className="
                                grid
                                gap-7
                                lg:grid-cols-2
                            "
                        >

                            {/* =========================================
                                LEFT
                            ========================================== */}

                            <div className="space-y-6">

                                {/* CURRENT PASSWORD */}

                                <div>

                                    <label
                                        htmlFor="currentPassword"
                                        className="
                                            mb-2
                                            block
                                            text-xs
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Current password
                                    </label>


                                    <div className="relative">

                                        <input
                                            id="currentPassword"
                                            name="currentPassword"
                                            type={
                                                showCurrentPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                formData.currentPassword
                                            }
                                            onChange={handleChange}
                                            placeholder="Enter your current password"
                                            autoComplete="current-password"
                                            disabled={isLoading}
                                            className="
                                                skillio-input
                                                !h-12
                                                !pr-12
                                            "
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowCurrentPassword(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
                                            disabled={isLoading}
                                            className="
                                                absolute
                                                right-0
                                                top-0
                                                flex
                                                h-full
                                                w-12
                                                items-center
                                                justify-center
                                                text-[var(--on-surface-variant)]
                                                transition
                                                hover:text-[var(--primary)]
                                            "
                                            aria-label={
                                                showCurrentPassword
                                                    ? "Hide current password"
                                                    : "Show current password"
                                            }
                                        >

                                            {showCurrentPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}

                                        </button>

                                    </div>

                                </div>


                                {/* SECURITY NOTE */}

                                <div
                                    className="
                                        rounded-xl
                                        border
                                        border-[var(--outline-variant)]
                                        bg-[var(--surface-container-low)]
                                        p-4
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            items-start
                                            gap-3
                                        "
                                    >

                                        <ShieldCheck
                                            size={18}
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-[var(--primary)]
                                            "
                                        />

                                        <div>

                                            <p
                                                className="
                                                    text-xs
                                                    font-bold
                                                    text-[var(--on-surface)]
                                                "
                                            >
                                                Protect your account
                                            </p>

                                            <p
                                                className="
                                                    mt-1
                                                    text-xs
                                                    leading-5
                                                    text-[var(--on-surface-variant)]
                                                "
                                            >
                                                Never share your password
                                                with anyone. Use a unique
                                                password that you don't
                                                use elsewhere.
                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =========================================
                                RIGHT
                            ========================================== */}

                            <div className="space-y-6">

                                {/* NEW PASSWORD */}

                                <div>

                                    <label
                                        htmlFor="newPassword"
                                        className="
                                            mb-2
                                            block
                                            text-xs
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        New password
                                    </label>


                                    <div className="relative">

                                        <input
                                            id="newPassword"
                                            name="newPassword"
                                            type={
                                                showNewPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                formData.newPassword
                                            }
                                            onChange={handleChange}
                                            placeholder="Create a new password"
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                            className="
                                                skillio-input
                                                !h-12
                                                !pr-12
                                            "
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNewPassword(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
                                            disabled={isLoading}
                                            className="
                                                absolute
                                                right-0
                                                top-0
                                                flex
                                                h-full
                                                w-12
                                                items-center
                                                justify-center
                                                text-[var(--on-surface-variant)]
                                                transition
                                                hover:text-[var(--primary)]
                                            "
                                            aria-label={
                                                showNewPassword
                                                    ? "Hide new password"
                                                    : "Show new password"
                                            }
                                        >

                                            {showNewPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}

                                        </button>

                                    </div>

                                </div>


                                {/* PASSWORD STRENGTH */}

                                <PasswordStrength
                                    password={
                                        formData.newPassword
                                    }
                                />


                                {/* CONFIRM PASSWORD */}

                                <div>

                                    <label
                                        htmlFor="confirmPassword"
                                        className="
                                            mb-2
                                            block
                                            text-xs
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Confirm new password
                                    </label>


                                    <div className="relative">

                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            value={
                                                formData.confirmPassword
                                            }
                                            onChange={handleChange}
                                            placeholder="Confirm your new password"
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                            className="
                                                skillio-input
                                                !h-12
                                                !pr-12
                                            "
                                        />


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (previous) =>
                                                        !previous
                                                )
                                            }
                                            disabled={isLoading}
                                            className="
                                                absolute
                                                right-0
                                                top-0
                                                flex
                                                h-full
                                                w-12
                                                items-center
                                                justify-center
                                                text-[var(--on-surface-variant)]
                                                transition
                                                hover:text-[var(--primary)]
                                            "
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                        >

                                            {showConfirmPassword ? (
                                                <EyeOff size={18} />
                                            ) : (
                                                <Eye size={18} />
                                            )}

                                        </button>

                                    </div>


                                    {/* MATCH STATUS */}

                                    {formData.confirmPassword && (

                                        <div
                                            className="
                                                mt-2
                                                flex
                                                items-center
                                                gap-1.5
                                            "
                                        >

                                            <CheckCircle2
                                                size={13}
                                                className={
                                                    formData.newPassword ===
                                                        formData.confirmPassword
                                                        ? "text-green-600"
                                                        : "text-[var(--on-surface-variant)]"
                                                }
                                            />

                                            <span
                                                className={`
                                                    text-[11px]
                                                    font-semibold
                                                    ${formData.newPassword ===
                                                        formData.confirmPassword
                                                        ? "text-green-600"
                                                        : "text-[var(--on-surface-variant)]"
                                                    }
                                                `}
                                            >

                                                {formData.newPassword ===
                                                    formData.confirmPassword
                                                    ? "Passwords match"
                                                    : "Passwords must match"}

                                            </span>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FOOTER
                        ================================================= */}

                        <div
                            className="
                                mt-8
                                flex
                                flex-col
                                gap-3
                                border-t
                                border-[var(--outline-variant)]
                                pt-6
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <p
                                className="
                                    max-w-xl
                                    text-[11px]
                                    leading-5
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                Choose a password that is difficult
                                to guess and different from your
                                previous password.
                            </p>


                            <div
                                className="
                                    flex
                                    flex-col-reverse
                                    gap-2
                                    sm:flex-row
                                "
                            >

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/settings")
                                    }
                                    disabled={isLoading}
                                    className="
                                        inline-flex
                                        h-11
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-[var(--outline-variant)]
                                        bg-[var(--surface)]
                                        px-5
                                        text-sm
                                        font-bold
                                        text-[var(--on-surface)]
                                        transition
                                        hover:border-[var(--primary)]
                                        hover:text-[var(--primary)]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="
                                        inline-flex
                                        h-11
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        bg-[var(--primary)]
                                        px-5
                                        text-sm
                                        font-bold
                                        text-[var(--on-primary)]
                                        shadow-[var(--shadow-sm)]
                                        transition
                                        hover:-translate-y-0.5
                                        hover:opacity-90
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >

                                    {isLoading ? (
                                        <>
                                            <Loader2
                                                size={17}
                                                className="animate-spin"
                                            />

                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            Update password

                                            <CheckCircle2
                                                size={17}
                                            />
                                        </>
                                    )}

                                </button>

                            </div>

                        </div>

                    </form>

                </div>


                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <div
                    className="
                        px-1
                        py-7
                        text-center
                    "
                >

                    <p
                        className="
                            text-[10px]
                            font-medium
                            text-[var(--on-surface-variant)]/60
                        "
                    >
                        Your password is securely handled by
                        Skillio's authentication system.
                    </p>

                </div>

            </div>

        </main>
    );
};


export default ChangePassword;