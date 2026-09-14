import { useState } from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    ArrowRight,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    KeyRound,
    LockKeyhole,
    Loader2,
    ShieldCheck,
    Sparkles,
    RefreshCw,
    Fingerprint,
} from "lucide-react";

import { toast } from "sonner";

import useAuth from "../hooks/useAuth.js";

import SkillioLogo from "../../../components/SkillioLogo.jsx";

import PasswordStrength from "../components/PasswordStrength.jsx";
import ErrorToast from "../../../components/feedback/ErrorToast.jsx";
import SuccessToast from "../../../components/feedback/SuccessToast.jsx";

import {
    isPasswordValid,
} from "../utils/passwordValidation.js";


const ResetPassword = () => {

    const navigate = useNavigate();

    const { token } = useParams();

    const { resetPassword } = useAuth();


    // =========================================================
    // STATE
    // =========================================================

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [isLoading, setIsLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [isSuccess, setIsSuccess] =
        useState(false);


    // =========================================================
    // HANDLE INPUT CHANGE
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


        if (error) {
            setError("");
        }

    };


    // =========================================================
    // HANDLE RESET PASSWORD
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();

        setError("");


        // -----------------------------------------------------
        // TOKEN VALIDATION
        // -----------------------------------------------------

        if (!token) {

            const message =
                "This password reset link is invalid.";

            setError(message);
            toast.error(message);

            return;

        }


        // -----------------------------------------------------
        // PASSWORD VALIDATION
        // -----------------------------------------------------

        if (!formData.password) {

            const message =
                "Please enter a new password.";

            setError(message);
            toast.error(message);

            return;

        }


        if (
            !isPasswordValid(
                formData.password
            )
        ) {

            const message =
                "Please make sure your password meets all the requirements.";

            setError(message);
            toast.error(message);

            return;

        }


        // -----------------------------------------------------
        // CONFIRM PASSWORD VALIDATION
        // -----------------------------------------------------

        if (!formData.confirmPassword) {

            const message =
                "Please confirm your new password.";

            setError(message);
            toast.error(message);

            return;

        }


        if (
            formData.password !==
            formData.confirmPassword
        ) {

            const message =
                "Passwords do not match.";

            setError(message);
            toast.error(message);

            return;

        }


        // -----------------------------------------------------
        // RESET PASSWORD
        // -----------------------------------------------------

        try {

            setIsLoading(true);


            await resetPassword(
                token,
                formData.password
            );


            setIsSuccess(true);


        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );


            const message =
                error?.response?.data?.message ||
                "Unable to reset your password. Please try again.";


            setError(message);

            toast.error(message);

        } finally {

            setIsLoading(false);

        }

    };


    // =========================================================
    // LEFT ARTWORK
    // =========================================================

    const SecurityArtwork = ({ success = false }) => {

        return (

            <section
                className="
                    relative
                    hidden
                    min-h-screen
                    w-full
                    overflow-hidden
                    bg-[#eef4eb]
                    lg:flex
                "
            >

                {/* =================================================
                    BACKGROUND GLOW
                ================================================== */}

                <div
                    className="
                        absolute
                        -left-32
                        -top-32
                        h-[520px]
                        w-[520px]
                        rounded-full
                        bg-[#d4e5cf]
                        opacity-80
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-44
                        -right-36
                        h-[600px]
                        w-[600px]
                        rounded-full
                        bg-[#dcebd8]
                        opacity-80
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        left-[42%]
                        top-[35%]
                        h-[360px]
                        w-[360px]
                        rounded-full
                        bg-[#f4f7ee]
                        opacity-90
                        blur-3xl
                    "
                />


                {/* =================================================
                    DOT GRID
                ================================================== */}

                <div
                    className="
                        absolute
                        inset-0
                        opacity-45
                    "
                    style={{
                        backgroundImage:
                            "radial-gradient(#a8b9a2 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                    }}
                />


                {/* =================================================
                    LARGE ORBIT
                ================================================== */}

                <div
                    className="
                        absolute
                        right-[-110px]
                        top-[8%]
                        h-[390px]
                        w-[390px]
                        rounded-full
                        border-[42px]
                        border-[#d6e4d1]
                    "
                />

                <div
                    className="
                        absolute
                        right-[-40px]
                        top-[16%]
                        h-[260px]
                        w-[260px]
                        rounded-full
                        border
                        border-dashed
                        border-[#aabca5]
                        opacity-70
                    "
                />


                {/* =================================================
                    SMALL ORBIT
                ================================================== */}

                <div
                    className="
                        absolute
                        bottom-[22%]
                        left-[5%]
                        h-[150px]
                        w-[150px]
                        rounded-full
                        border
                        border-[#c1d2bc]
                        opacity-70
                    "
                />

                <div
                    className="
                        absolute
                        bottom-[25%]
                        left-[8%]
                        h-3
                        w-3
                        rounded-full
                        bg-[#789471]
                        shadow-[0_0_0_9px_rgba(120,148,113,0.12)]
                    "
                />


                {/* =================================================
                    TOP BRAND
                ================================================== */}

                <div
                    className="
                        absolute
                        left-10
                        top-9
                        z-50
                        xl:left-14
                        xl:top-12
                    "
                >

                    <Link
                        to="/"
                        aria-label="Skillio home"
                        className="
                            inline-flex
                            items-center
                            rounded-lg
                            outline-none
                            focus-visible:ring-2
                            focus-visible:ring-[#6f8d69]
                            focus-visible:ring-offset-2
                        "
                    >

                        <SkillioLogo size={150}/>

                    </Link>


                    <p
                        className="
                            mt-2
                            text-[9px]
                            font-bold
                            uppercase
                            tracking-[0.18em]
                            text-[#71806d]
                        "
                    >
                        AI-powered career workspace
                    </p>

                </div>


                {/* =================================================
                    ARTWORK AREA
                ================================================== */}

                <div
                    className="
                        absolute
                        inset-x-0
                        top-[45%]
                        mx-auto
                        h-[500px]
                        w-[650px]
                        -translate-y-1/2
                    "
                >

                    {/* =================================================
                        CONNECTION LINES
                    ================================================== */}

                    <div
                        className="
                            absolute
                            left-[70px]
                            top-[230px]
                            h-px
                            w-[510px]
                            rotate-[-16deg]
                            bg-[#b9cbb4]
                            opacity-70
                        "
                    />

                    <div
                        className="
                            absolute
                            left-[100px]
                            top-[260px]
                            h-px
                            w-[470px]
                            rotate-[15deg]
                            bg-[#b9cbb4]
                            opacity-70
                        "
                    />

                    <div
                        className="
                            absolute
                            left-[325px]
                            top-[80px]
                            h-[350px]
                            w-px
                            rotate-[26deg]
                            bg-[#bdcdb9]
                            opacity-50
                        "
                    />


                    {/* =================================================
                        MAIN SECURITY CARD
                    ================================================== */}

                    <div
                        className="
                            absolute
                            left-1/2
                            top-1/2
                            z-20
                            w-[350px]
                            -translate-x-1/2
                            -translate-y-1/2
                            rounded-[30px]
                            border
                            border-[#d5e0d1]
                            bg-white/90
                            p-6
                            shadow-[0_30px_90px_rgba(55,73,50,0.16)]
                            backdrop-blur-xl
                        "
                    >

                        {/* Card header */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >

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
                                        h-11
                                        w-11
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-[#e4eee0]
                                        text-[#587052]
                                    "
                                >

                                    <LockKeyhole
                                        size={20}
                                        strokeWidth={1.9}
                                    />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-[11px]
                                            font-bold
                                            text-[#293327]
                                        "
                                    >
                                        Password security
                                    </p>

                                    <p
                                        className="
                                            mt-1
                                            text-[9px]
                                            text-[#899487]
                                        "
                                    >
                                        Protect your workspace
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#e5efe2]
                                    text-[#64815e]
                                "
                            >

                                <Check
                                    size={15}
                                    strokeWidth={2.5}
                                />

                            </div>

                        </div>


                        {/* Security score */}

                        <div className="mt-7">

                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                "
                            >

                                <span
                                    className="
                                        text-[9px]
                                        font-semibold
                                        text-[#6f796c]
                                    "
                                >
                                    Security strength
                                </span>

                                <span
                                    className="
                                        text-[10px]
                                        font-bold
                                        text-[#55704f]
                                    "
                                >
                                    STRONG
                                </span>

                            </div>


                            <div
                                className="
                                    mt-2
                                    flex
                                    gap-1.5
                                "
                            >

                                <div
                                    className="
                                        h-2
                                        flex-1
                                        rounded-full
                                        bg-[#789471]
                                    "
                                />

                                <div
                                    className="
                                        h-2
                                        flex-1
                                        rounded-full
                                        bg-[#789471]
                                    "
                                />

                                <div
                                    className="
                                        h-2
                                        flex-1
                                        rounded-full
                                        bg-[#789471]
                                    "
                                />

                                <div
                                    className="
                                        h-2
                                        flex-1
                                        rounded-full
                                        bg-[#dce6d9]
                                    "
                                />

                            </div>

                        </div>


                        {/* Requirements */}

                        <div className="mt-7 space-y-3">

                            {[
                                "Minimum 8 characters",
                                "At least one number",
                                "At least one symbol",
                            ].map((item) => (

                                <div
                                    key={item}
                                    className="
                                        flex
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            h-6
                                            w-6
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-[#e6efe3]
                                            text-[#607b59]
                                        "
                                    >

                                        <Check size={12} />

                                    </div>


                                    <span
                                        className="
                                            text-[9px]
                                            font-medium
                                            text-[#6f796c]
                                        "
                                    >
                                        {item}
                                    </span>

                                </div>

                            ))}

                        </div>


                        {/* Bottom status */}

                        <div
                            className="
                                mt-7
                                flex
                                items-center
                                justify-between
                                rounded-2xl
                                bg-[#f1f5ee]
                                px-4
                                py-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <div
                                    className="
                                        h-2
                                        w-2
                                        rounded-full
                                        bg-[#789471]
                                    "
                                />

                                <span
                                    className="
                                        text-[8px]
                                        font-semibold
                                        text-[#687466]
                                    "
                                >
                                    Secure recovery
                                </span>

                            </div>


                            <ShieldCheck
                                size={15}
                                className="text-[#718b6b]"
                            />

                        </div>

                    </div>


                    {/* =================================================
                        FLOATING — RECOVERY CARD
                    ================================================== */}

                    <div
                        className="
                            absolute
                            left-[5px]
                            top-[90px]
                            z-30
                            w-[190px]
                            -rotate-[7deg]
                            rounded-2xl
                            border
                            border-[#d7e2d3]
                            bg-white/90
                            p-4
                            shadow-[0_20px_55px_rgba(55,73,50,0.12)]
                            backdrop-blur-xl
                        "
                    >

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
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#e7f0e4]
                                    text-[#5d7757]
                                "
                            >

                                <RefreshCw size={16} />

                            </div>


                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        font-bold
                                        text-[#30392e]
                                    "
                                >
                                    Recovery ready
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-[8px]
                                        text-[#8a9386]
                                    "
                                >
                                    Secure reset flow
                                </p>

                            </div>

                        </div>


                        <div
                            className="
                                mt-4
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <span
                                className="
                                    text-[8px]
                                    text-[#7c8579]
                                "
                            >
                                Verification
                            </span>

                            <span
                                className="
                                    rounded-full
                                    bg-[#e6efe3]
                                    px-2
                                    py-1
                                    text-[7px]
                                    font-bold
                                    text-[#5c7556]
                                "
                            >
                                VERIFIED
                            </span>

                        </div>

                    </div>


                    {/* =================================================
                        FLOATING — KEY CARD
                    ================================================== */}

                    <div
                        className="
                            absolute
                            bottom-[45px]
                            right-[0px]
                            z-30
                            w-[190px]
                            rotate-[6deg]
                            rounded-2xl
                            border
                            border-[#d7e2d3]
                            bg-white/90
                            p-4
                            shadow-[0_20px_55px_rgba(55,73,50,0.12)]
                            backdrop-blur-xl
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                            "
                        >

                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        font-bold
                                        text-[#30392e]
                                    "
                                >
                                    New credentials
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        text-[#899286]
                                    "
                                >
                                    Ready to secure
                                </p>

                            </div>


                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[#edf3ea]
                                    text-[#637c5d]
                                "
                            >

                                <KeyRound size={17} />

                            </div>

                        </div>


                        <div
                            className="
                                mt-4
                                flex
                                items-center
                                gap-1
                            "
                        >

                            {[1, 2, 3, 4, 5, 6, 7, 8].map(
                                (item) => (

                                    <span
                                        key={item}
                                        className="
                                            h-1.5
                                            w-1.5
                                            rounded-full
                                            bg-[#829b7c]
                                        "
                                    />

                                )
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        FLOATING — IDENTITY CARD
                    ================================================== */}

                    <div
                        className="
                            absolute
                            right-[70px]
                            top-[30px]
                            z-10
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-[#d7e2d3]
                            bg-white/75
                            text-[#71896b]
                            shadow-[0_15px_40px_rgba(55,73,50,0.08)]
                            backdrop-blur-xl
                        "
                    >

                        <Fingerprint
                            size={27}
                            strokeWidth={1.6}
                        />

                    </div>


                    {/* =================================================
                        SPARKLES / DOTS
                    ================================================== */}

                    <Sparkles
                        size={17}
                        className="
                            absolute
                            left-[100px]
                            bottom-[30px]
                            text-[#92a88c]
                        "
                    />

                    <div
                        className="
                            absolute
                            right-[120px]
                            bottom-[20px]
                            h-2
                            w-2
                            rounded-full
                            bg-[#8ca485]
                        "
                    />

                    <div
                        className="
                            absolute
                            left-[245px]
                            top-[40px]
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-[#9aae95]
                        "
                    />

                </div>


                {/* =================================================
                    BOTTOM COPY
                ================================================== */}

                <div
                    className="
                        absolute
                        bottom-10
                        left-10
                        z-40
                        xl:bottom-14
                        xl:left-14
                    "
                >

                    <div
                        className="
                            mb-4
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[#cbdac6]
                            bg-white/60
                            px-3
                            py-1.5
                            backdrop-blur-md
                        "
                    >

                        <ShieldCheck
                            size={13}
                            className="text-[#607b59]"
                        />

                        <span
                            className="
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.14em]
                                text-[#63745e]
                            "
                        >
                            {success
                                ? "Account protected"
                                : "Secure password recovery"}
                        </span>

                    </div>


                    <h2
                        className="
                            max-w-[570px]
                            text-4xl
                            font-semibold
                            leading-[1.08]
                            tracking-tight
                            text-[#253024]
                            xl:text-5xl
                        "
                    >

                        {success
                            ? "Your account is protected again."
                            : "Build a stronger key to your career workspace."}

                    </h2>


                    <p
                        className="
                            mt-4
                            max-w-[510px]
                            text-base
                            leading-7
                            text-[#6c7669]
                        "
                    >

                        {success
                            ? "Your new password is active. You can safely continue your journey with Skillio."
                            : "Create a unique password, secure your workspace, and get back to preparing for your next opportunity."}

                    </p>


                    {/* Journey */}

                    <div
                        className="
                            mt-6
                            flex
                            items-center
                            gap-3
                            text-[10px]
                            font-semibold
                            text-[#73806f]
                        "
                    >

                        <span
                            className={
                                success
                                    ? "text-[#55704f]"
                                    : "text-[#55704f]"
                            }
                        >
                            Verify
                        </span>

                        <ArrowRight
                            size={13}
                            className="text-[#a1ada0]"
                        />

                        <span
                            className={
                                success
                                    ? "text-[#55704f]"
                                    : ""
                            }
                        >
                            Reset
                        </span>

                        <ArrowRight
                            size={13}
                            className="text-[#a1ada0]"
                        />

                        <span>
                            Continue
                        </span>

                    </div>

                </div>

            </section>

        );

    };


    // =========================================================
    // SUCCESS STATE
    // =========================================================

    if (isSuccess) {

        return (

            <main
                className="
                    min-h-[100dvh]
                    w-full
                    bg-[var(--background)]
                    text-[var(--on-background)]
                "
            >
                <SuccessToast
                    success={isSuccess}
                    message="Password reset successfully!"
                />

                <div
                    className="
                        flex
                        min-h-[100dvh]
                        w-full
                        flex-col
                        lg:flex-row
                    "
                >

                    {/* =================================================
                        LEFT ARTWORK
                    ================================================== */}

                    <div className="w-full lg:w-[55%]">
                        <SecurityArtwork success />
                    </div>


                    {/* =================================================
                        RIGHT SUCCESS
                    ================================================== */}

                    <section
                        className="
                            flex
                            min-h-[100dvh]
                            w-full
                            flex-1
                            items-center
                            justify-center
                            bg-[var(--surface)]
                            px-6
                            py-10
                            sm:px-10
                            lg:px-12
                            xl:px-16
                        "
                    >

                        <div
                            className="
                                w-full
                                max-w-[440px]
                            "
                        >

                            {/* Brand */}

                            <div className="mb-10">

                                <Link
                                    to="/"
                                    aria-label="Skillio home"
                                    className="
                                        inline-flex
                                        items-center
                                        rounded-md
                                    "
                                >

                                    <SkillioLogo size={150}/>

                                </Link>


                                <p
                                    className="
                                        mt-3
                                        text-label-sm
                                        uppercase
                                        tracking-widest
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    AI-powered career workspace
                                </p>

                            </div>


                            {/* Success icon */}

                            <div
                                className="
                                    mb-6
                                    flex
                                    h-16
                                    w-16
                                    items-center
                                    justify-center
                                    rounded-2xl
                                    bg-[var(--primary-container)]
                                    text-[var(--primary)]
                                "
                            >

                                <CheckCircle2 size={32} />

                            </div>


                            {/* Heading */}

                            <h1
                                className="
                                    text-headline-lg
                                    font-semibold
                                    text-[var(--on-surface)]
                                "
                            >
                                Password reset successfully
                            </h1>


                            <p
                                className="
                                    mt-4
                                    text-body-md
                                    leading-7
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                Your password has been updated successfully.
                                You can now sign in using your new password.
                            </p>


                            {/* Continue */}

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/login",
                                        {
                                            replace: true,
                                        }
                                    )
                                }
                                className="
                                    skillio-primary-button
                                    mt-8
                                    w-full
                                "
                            >

                                Continue to login

                                <ArrowRight size={18} />

                            </button>


                            {/* Security card */}

                            <div
                                className="
                                    mt-6
                                    flex
                                    items-start
                                    gap-3
                                    rounded-xl
                                    bg-[var(--surface-container-low)]
                                    p-4
                                "
                            >

                                <ShieldCheck
                                    size={20}
                                    className="
                                        mt-0.5
                                        shrink-0
                                        text-[var(--primary)]
                                    "
                                />


                                <p
                                    className="
                                        text-label-sm
                                        leading-6
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    For your security, all previous sessions
                                    have been signed out. Please sign in again
                                    with your new password.
                                </p>

                            </div>

                        </div>

                    </section>

                </div>

            </main>

        );

    }


    // =========================================================
    // DEFAULT FORM
    // =========================================================

    return (

        <main
            className="
                min-h-[100dvh]
                w-full
                bg-[var(--background)]
                text-[var(--on-background)]
            "
        >

            <div
                className="
                    flex
                    min-h-[100dvh]
                    w-full
                    flex-col
                    lg:flex-row
                "
            >

                {/* =================================================
                    LEFT ARTWORK
                ================================================== */}

                <div className="w-full lg:w-[55%]">
                    <SecurityArtwork />
                </div>


                {/* =================================================
                    RIGHT — RESET FORM
                ================================================== */}

                <section
                    className="
                        flex
                        min-h-[100dvh]
                        w-full
                        flex-1
                        items-center
                        justify-center
                        bg-[var(--surface)]
                        px-6
                        py-10
                        sm:px-10
                        lg:px-12
                        xl:px-16
                    "
                >

                    <div
                        className="
                            w-full
                            max-w-[440px]
                        "
                    >

                        {/* =================================================
                            BRAND
                        ================================================= */}

                        <div className="mb-9">

                            <Link
                                to="/"
                                aria-label="Skillio home"
                                className="
                                    inline-flex
                                    items-center
                                    rounded-md
                                    outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-[var(--primary)]
                                    focus-visible:ring-offset-2
                                "
                            >

                                <SkillioLogo size={150}/>

                            </Link>


                            <p
                                className="
                                    mt-3
                                    text-label-sm
                                    uppercase
                                    tracking-widest
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                AI-powered career workspace
                            </p>

                        </div>


                        {/* =================================================
                            HEADING
                        ================================================== */}

                        <div>

                            <h1
                                className="
                                    text-headline-lg
                                    font-semibold
                                    text-[var(--on-surface)]
                                "
                            >
                                Create a new password
                            </h1>


                            <p
                                className="
                                    mt-3
                                    text-body-md
                                    leading-7
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                Choose a strong new password for your
                                Skillio account.
                            </p>

                        </div>


                        {/* =================================================
                            ERROR
                        ================================================== */}

                        <ErrorToast error={error} />


                        {/* =================================================
                            FORM
                        ================================================== */}

                        <form
                            onSubmit={handleSubmit}
                            className="
                                mt-8
                                space-y-5
                            "
                        >

                            {/* =================================================
                                NEW PASSWORD
                            ================================================== */}

                            <div>

                                <label
                                    htmlFor="password"
                                    className="
                                        mb-2
                                        block
                                        text-label-md
                                        text-[var(--on-surface)]
                                    "
                                >
                                    New password
                                </label>


                                <div className="relative">

                                    <input
                                        id="password"
                                        name="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a new password"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        className="
                                            skillio-input
                                            !pr-12
                                        "
                                    />


                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) =>
                                                    !previous
                                            )
                                        }
                                        disabled={isLoading}
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
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
                                            transition-colors
                                            hover:text-[var(--primary)]
                                        "
                                    >

                                        {showPassword ? (

                                            <EyeOff size={19} />

                                        ) : (

                                            <Eye size={19} />

                                        )}

                                    </button>

                                </div>

                            </div>


                            {/* =================================================
                                PASSWORD STRENGTH
                            ================================================== */}

                            <PasswordStrength
                                password={formData.password}
                            />


                            {/* =================================================
                                CONFIRM PASSWORD
                            ================================================== */}

                            <div>

                                <label
                                    htmlFor="confirmPassword"
                                    className="
                                        mb-2
                                        block
                                        text-label-md
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
                                        aria-label={
                                            showConfirmPassword
                                                ? "Hide confirm password"
                                                : "Show confirm password"
                                        }
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
                                            transition-colors
                                            hover:text-[var(--primary)]
                                        "
                                    >

                                        {showConfirmPassword ? (

                                            <EyeOff size={19} />

                                        ) : (

                                            <Eye size={19} />

                                        )}

                                    </button>

                                </div>


                                {/* Password match */}

                                {formData.confirmPassword && (

                                    <p
                                        className={`
                                            mt-2
                                            text-label-sm
                                            ${
                                                formData.password ===
                                                formData.confirmPassword
                                                    ? "text-green-600"
                                                    : "text-[var(--error)]"
                                            }
                                        `}
                                    >

                                        {formData.password ===
                                        formData.confirmPassword
                                            ? "Passwords match ✓"
                                            : "Passwords do not match"}

                                    </p>

                                )}

                            </div>


                            {/* =================================================
                                SECURITY INFORMATION
                            ================================================== */}

                            <div
                                className="
                                    flex
                                    items-start
                                    gap-3
                                    rounded-xl
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface-container-low)]
                                    p-4
                                "
                            >

                                <ShieldCheck
                                    size={20}
                                    className="
                                        mt-0.5
                                        shrink-0
                                        text-[var(--primary)]
                                    "
                                />


                                <div>

                                    <p
                                        className="
                                            text-label-md
                                            font-semibold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Password security
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-label-sm
                                            leading-6
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        Use a unique password that you don't
                                        use for other accounts.
                                    </p>

                                </div>

                            </div>


                            {/* =================================================
                                SUBMIT
                            ================================================== */}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="
                                    skillio-primary-button
                                    mt-2
                                    w-full
                                "
                            >

                                {isLoading ? (

                                    <>

                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />

                                        Resetting password...

                                    </>

                                ) : (

                                    <>

                                        Reset password

                                        <ArrowRight size={18} />

                                    </>

                                )}

                            </button>

                        </form>


                        {/* =================================================
                            BACK TO LOGIN
                        ================================================== */}

                        <p
                            className="
                                mt-8
                                text-center
                                text-body-md
                                text-[var(--on-surface-variant)]
                            "
                        >

                            Remember your password?{" "}

                            <Link
                                to="/login"
                                className="
                                    font-semibold
                                    text-[var(--primary)]
                                    transition-colors
                                    hover:underline
                                    decoration-2
                                    underline-offset-4
                                "
                            >
                                Back to login
                            </Link>

                        </p>

                    </div>

                </section>

            </div>

        </main>

    );

};


export default ResetPassword;