import { useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    KeyRound,
    Loader2,
    Mail,
    LockKeyhole,
    ShieldCheck,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import SuccessToast from "../../../components/feedback/SuccessToast.jsx";

import useAuth from "../hooks/useAuth.js";

import SkillioLogo from "../../../components/SkillioLogo.jsx";


const ForgotPassword = () => {
    const { forgotPassword } = useAuth();

    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);


    // =========================================================
    // EMAIL VALIDATION
    // =========================================================

    const validateEmail = () => {
        const value = email.trim();

        if (!value) {
            toast.error("Email address is required.");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(value)) {
            toast.error("Please enter a valid email address.");
            return false;
        }

        return true;
    };


    // =========================================================
    // SUBMIT
    // =========================================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateEmail()) {
            return;
        }

        try {
            setIsLoading(true);

            await forgotPassword(email.trim());

            setIsSuccess(true);

        } catch (error) {
            console.error("Forgot password error:", error);

            const message =
                error?.response?.data?.message ||
                "Something went wrong. Please try again.";

            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };


    // =========================================================
    // INPUT
    // =========================================================

    const handleChange = (event) => {
        setEmail(event.target.value);
    };


    // =========================================================
    // RESET SUCCESS STATE
    // =========================================================

    const handleDifferentEmail = () => {
        setIsSuccess(false);
        setEmail("");
    };


    return (
        <main
            className="
                min-h-[100dvh]
                w-full
                overflow-x-hidden
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

                {/* =====================================================
                    LEFT — PASSWORD RECOVERY ARTWORK
                ====================================================== */}

                <section
                    className="
                        relative
                        hidden
                        min-h-[100dvh]
                        w-full
                        overflow-hidden
                        bg-[#edf3e9]
                        lg:block
                        lg:w-[55%]
                        lg:flex-none
                    "
                >

                    {/* =================================================
                        BACKGROUND GLOW
                    ================================================== */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -left-40
                            -top-40
                            h-[520px]
                            w-[520px]
                            rounded-full
                            bg-[#d2e2cd]
                            opacity-70
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-48
                            -right-32
                            h-[560px]
                            w-[560px]
                            rounded-full
                            bg-[#dce8d8]
                            opacity-80
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-[20%]
                            top-[8%]
                            h-[260px]
                            w-[260px]
                            rounded-full
                            bg-[#e4eee0]
                            opacity-70
                            blur-3xl
                        "
                    />


                    {/* =================================================
                        DOT GRID
                    ================================================== */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-0
                            opacity-50
                        "
                        style={{
                            backgroundImage:
                                "radial-gradient(#9cad97 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                        }}
                    />


                    {/* =================================================
                        LARGE SECURITY ORBIT
                    ================================================== */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-[-130px]
                            top-[15%]
                            h-[430px]
                            w-[430px]
                            rounded-full
                            border-[38px]
                            border-[#d6e3d2]
                            opacity-80
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-[-65px]
                            top-[22%]
                            h-[290px]
                            w-[290px]
                            rounded-full
                            border
                            border-dashed
                            border-[#b9cbb4]
                            opacity-70
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-[7%]
                            top-[31%]
                            h-3
                            w-3
                            rounded-full
                            bg-[#789471]
                            shadow-[0_0_0_9px_rgba(120,148,113,0.12)]
                        "
                    />


                    {/* =================================================
                        BRAND
                    ================================================== */}

                    <Link
                        to="/"
                        aria-label="Skillio home"
                        className="
                            absolute
                            left-10
                            top-10
                            z-40
                            inline-flex
                            items-center
                            rounded-lg
                            outline-none
                            xl:left-14
                            xl:top-12
                            2xl:left-16
                        "
                    >
                        <SkillioLogo size={150}/>
                    </Link>


                    {/* =================================================
                        MAIN ARTWORK AREA
                    ================================================== */}

                    <div
                        className="
                            absolute
                            left-1/2
                            top-[46%]
                            h-[430px]
                            w-[min(650px,88%)]
                            -translate-x-1/2
                            -translate-y-1/2
                        "
                    >

                        {/* ---------------------------------------------
                            CONNECTION LINES
                        --------------------------------------------- */}

                        <div
                            className="
                                absolute
                                left-[18%]
                                top-[44%]
                                h-px
                                w-[63%]
                                rotate-[-12deg]
                                bg-[#b4c5af]
                            "
                        />

                        <div
                            className="
                                absolute
                                left-[20%]
                                top-[51%]
                                h-px
                                w-[59%]
                                rotate-[12deg]
                                bg-[#b4c5af]
                            "
                        />

                        <div
                            className="
                                absolute
                                left-[48%]
                                top-[22%]
                                h-[58%]
                                w-px
                                rotate-[28deg]
                                bg-[#b4c5af]
                            "
                        />


                        {/* ---------------------------------------------
                            MAIN SECURITY CARD
                        --------------------------------------------- */}

                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                z-20
                                w-[min(360px,72%)]
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-[30px]
                                border
                                border-[#d4dfd0]
                                bg-white/90
                                p-6
                                shadow-[0_30px_80px_rgba(48,63,43,0.14)]
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

                                <div className="flex min-w-0 items-center gap-3">

                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-[#e5eee2]
                                            text-[#50694b]
                                        "
                                    >
                                        <LockKeyhole
                                            size={20}
                                            strokeWidth={1.8}
                                        />
                                    </div>

                                    <div className="min-w-0">

                                        <p
                                            className="
                                                truncate
                                                text-[11px]
                                                font-bold
                                                text-[#293228]
                                            "
                                        >
                                            Account security
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                text-[9px]
                                                text-[#7b8577]
                                            "
                                        >
                                            Recovery protected
                                        </p>

                                    </div>

                                </div>

                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-[#e7f0e4]
                                        text-[#597353]
                                    "
                                >
                                    <CheckCircle2 size={16} />
                                </div>

                            </div>


                            {/* -----------------------------------------
                                RECOVERY FLOW
                            ------------------------------------------ */}

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
                                            text-[10px]
                                            font-semibold
                                            text-[#626c5e]
                                        "
                                    >
                                        Recovery process
                                    </span>

                                    <span
                                        className="
                                            text-[10px]
                                            font-bold
                                            text-[#587052]
                                        "
                                    >
                                        1 of 3
                                    </span>

                                </div>


                                <div
                                    className="
                                        mt-2
                                        h-2
                                        overflow-hidden
                                        rounded-full
                                        bg-[#e8ede6]
                                    "
                                >

                                    <div
                                        className="
                                            h-full
                                            w-1/3
                                            rounded-full
                                            bg-[#789471]
                                        "
                                    />

                                </div>

                            </div>


                            {/* -----------------------------------------
                                STEPS
                            ------------------------------------------ */}

                            <div className="mt-7 space-y-3">

                                {[
                                    {
                                        icon: Mail,
                                        title: "Verify your email",
                                        description:
                                            "Confirm your Skillio account",
                                        active: true,
                                    },
                                    {
                                        icon: KeyRound,
                                        title: "Create new password",
                                        description:
                                            "Choose a secure password",
                                        active: false,
                                    },
                                    {
                                        icon: ShieldCheck,
                                        title: "Return to workspace",
                                        description:
                                            "Continue your preparation",
                                        active: false,
                                    },
                                ].map((step, index) => {

                                    const Icon = step.icon;

                                    return (
                                        <div
                                            key={step.title}
                                            className={`
                                                flex
                                                items-center
                                                gap-3
                                                rounded-2xl
                                                p-3
                                                ${
                                                    step.active
                                                        ? "bg-[#f0f5ed]"
                                                        : "bg-transparent"
                                                }
                                            `}
                                        >

                                            <div
                                                className={`
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-xl
                                                    ${
                                                        step.active
                                                            ? "bg-[#dce9d8] text-[#587052]"
                                                            : "border border-[#dbe2d8] text-[#9aa397]"
                                                    }
                                                `}
                                            >
                                                <Icon size={16} />
                                            </div>

                                            <div className="min-w-0 flex-1">

                                                <p
                                                    className={`
                                                        text-[9px]
                                                        font-bold
                                                        ${
                                                            step.active
                                                                ? "text-[#3d4d39]"
                                                                : "text-[#697367]"
                                                        }
                                                    `}
                                                >
                                                    {step.title}
                                                </p>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-[8px]
                                                        text-[#899287]
                                                    "
                                                >
                                                    {step.description}
                                                </p>

                                            </div>

                                            <span
                                                className="
                                                    text-[8px]
                                                    font-semibold
                                                    text-[#a0a89d]
                                                "
                                            >
                                                {index + 1}
                                            </span>

                                        </div>
                                    );
                                })}

                            </div>


                            {/* -----------------------------------------
                                BOTTOM MESSAGE
                            ------------------------------------------ */}

                            <div
                                className="
                                    mt-5
                                    flex
                                    items-center
                                    gap-2
                                    rounded-xl
                                    bg-[#f1f5ee]
                                    px-3
                                    py-2.5
                                "
                            >

                                <ShieldCheck
                                    size={13}
                                    className="
                                        shrink-0
                                        text-[#70856b]
                                    "
                                />

                                <span
                                    className="
                                        text-[8px]
                                        font-medium
                                        text-[#6e796b]
                                    "
                                >
                                    Your recovery link stays private.
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            FLOATING — EMAIL CARD
                        ================================================== */}

                        <div
                            className="
                                absolute
                                left-[1%]
                                top-[13%]
                                z-30
                                w-[190px]
                                rotate-[-7deg]
                                rounded-2xl
                                border
                                border-[#d6e1d2]
                                bg-white/90
                                p-4
                                shadow-[0_20px_50px_rgba(48,63,43,0.12)]
                                backdrop-blur-xl
                            "
                        >

                            <div className="flex items-center gap-2.5">

                                <div
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#e7f0e4]
                                        text-[#597253]
                                    "
                                >
                                    <Mail size={16} />
                                </div>

                                <div className="min-w-0">

                                    <p
                                        className="
                                            text-[9px]
                                            font-bold
                                            text-[#30382e]
                                        "
                                    >
                                        Reset email
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            truncate
                                            text-[8px]
                                            text-[#899286]
                                        "
                                    >
                                        Secure delivery
                                    </p>

                                </div>

                            </div>


                            <div className="mt-4 space-y-2">

                                <div
                                    className="
                                        h-2
                                        w-[88%]
                                        rounded-full
                                        bg-[#e7ece5]
                                    "
                                />

                                <div
                                    className="
                                        h-2
                                        w-[65%]
                                        rounded-full
                                        bg-[#edf1eb]
                                    "
                                />

                            </div>

                        </div>


                        {/* =================================================
                            FLOATING — SECURE BADGE
                        ================================================== */}

                        <div
                            className="
                                absolute
                                bottom-[7%]
                                right-[1%]
                                z-30
                                flex
                                w-[190px]
                                rotate-[6deg]
                                items-center
                                gap-3
                                rounded-2xl
                                border
                                border-[#d6e1d2]
                                bg-white/90
                                p-4
                                shadow-[0_20px_50px_rgba(48,63,43,0.12)]
                                backdrop-blur-xl
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
                                    bg-[#e7f0e4]
                                    text-[#587252]
                                "
                            >
                                <ShieldCheck size={18} />
                            </div>

                            <div className="min-w-0">

                                <p
                                    className="
                                        text-[9px]
                                        font-bold
                                        text-[#30382e]
                                    "
                                >
                                    Protected recovery
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        leading-4
                                        text-[#899286]
                                    "
                                >
                                    Temporary links keep your
                                    account secure.
                                </p>

                            </div>

                        </div>


                        {/* =================================================
                            DECORATIVE NODES
                        ================================================== */}

                        <div
                            className="
                                absolute
                                bottom-[17%]
                                left-[15%]
                                h-3
                                w-3
                                rounded-full
                                bg-[#789471]
                                shadow-[0_0_0_8px_rgba(120,148,113,0.12)]
                            "
                        />

                        <div
                            className="
                                absolute
                                right-[16%]
                                top-[12%]
                                h-2
                                w-2
                                rounded-full
                                bg-[#91a78b]
                            "
                        />

                        <div
                            className="
                                absolute
                                bottom-[30%]
                                left-[7%]
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-[#a9b9a4]
                            "
                        />

                    </div>


                    {/* =================================================
                        LEFT BOTTOM COPY
                    ================================================== */}

                    <div
                        className="
                            absolute
                            bottom-10
                            left-10
                            z-40
                            max-w-[560px]
                            xl:bottom-14
                            xl:left-14
                            2xl:bottom-16
                            2xl:left-16
                        "
                    >

                        <div
                            className="
                                mb-5
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-[#cbd8c7]
                                bg-white/60
                                px-3
                                py-1.5
                                backdrop-blur-md
                            "
                        >

                            <Sparkles
                                size={12}
                                className="text-[#60755b]"
                            />

                            <span
                                className="
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#60705c]
                                "
                            >
                                Secure your next step
                            </span>

                        </div>


                        <h1
                            className="
                                max-w-[540px]
                                text-3xl
                                font-bold
                                leading-[1.08]
                                tracking-tight
                                text-[#263125]
                                xl:text-4xl
                                2xl:text-5xl
                            "
                        >
                            Your career workspace
                            is still waiting for you.
                        </h1>


                        <p
                            className="
                                mt-4
                                max-w-[500px]
                                text-sm
                                leading-6
                                text-[#687265]
                                xl:text-base
                                xl:leading-7
                            "
                        >
                            Recover your account securely and get
                            back to preparing for the opportunities
                            that matter.
                        </p>


                        {/* Journey */}

                        <div
                            className="
                                mt-6
                                flex
                                flex-wrap
                                items-center
                                gap-x-3
                                gap-y-2
                                text-[10px]
                                font-semibold
                                text-[#667061]
                                xl:text-xs
                            "
                        >

                            <span>Recover</span>

                            <ArrowRight
                                size={12}
                                className="text-[#a0aa9b]"
                            />

                            <span>Reset</span>

                            <ArrowRight
                                size={12}
                                className="text-[#a0aa9b]"
                            />

                            <span>Sign in</span>

                            <ArrowRight
                                size={12}
                                className="text-[#a0aa9b]"
                            />

                            <span>Keep preparing</span>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    RIGHT — FORM
                ====================================================== */}

                <section
                    className="
                        flex
                        min-h-[100dvh]
                        w-full
                        flex-1
                        flex-col
                        bg-[var(--surface)]
                        lg:w-[45%]
                        lg:flex-none
                    "
                >

                    {/* =================================================
                        MAIN CONTENT
                    ================================================== */}

                    <div
                        className="
                            flex
                            w-full
                            flex-1
                            items-center
                            justify-center
                            px-5
                            py-8
                            sm:px-8
                            sm:py-10
                            md:px-12
                            lg:px-10
                            xl:px-16
                            2xl:px-20
                        "
                    >

                        <div
                            className="
                                w-full
                                max-w-[440px]
                            "
                        >

                            {/* =================================================
                                MOBILE BRAND
                            ================================================== */}

                            <Link
                                to="/"
                                aria-label="Skillio home"
                                className="
                                    mb-10
                                    inline-flex
                                    rounded-lg
                                    outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-[var(--primary)]
                                    focus-visible:ring-offset-2
                                    lg:hidden
                                "
                            >

                                <SkillioLogo size={150}/>

                            </Link>


                            {/* =================================================
                                DESKTOP BRAND
                            ================================================== */}

                            <div
                                className="
                                    mb-11
                                    hidden
                                    lg:block
                                "
                            >

                                <Link
                                    to="/"
                                    aria-label="Skillio home"
                                    className="
                                        inline-flex
                                        rounded-lg
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
                                        mt-2
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-[0.08em]
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    AI-powered career workspace
                                </p>

                            </div>


                            {/* =================================================
                                FORM STATE
                            ================================================== */}

                            {!isSuccess ? (
                                <>

                                    {/* Header */}

                                    <div>

                                        <h1
                                            className="
                                                text-3xl
                                                font-semibold
                                                tracking-tight
                                                text-[var(--on-surface)]
                                                sm:text-4xl
                                            "
                                        >
                                            Forgot your password?
                                        </h1>

                                        <p
                                            className="
                                                mt-3
                                                max-w-[430px]
                                                text-sm
                                                leading-6
                                                text-[var(--on-surface-variant)]
                                                sm:text-[15px]
                                                sm:leading-7
                                            "
                                        >
                                            Enter the email address associated
                                            with your Skillio account and we'll
                                            send you a secure password reset link.
                                        </p>

                                    </div>


                                    {/* Email form */}

                                    <form
                                        onSubmit={handleSubmit}
                                        noValidate
                                        className="
                                            mt-8
                                            flex
                                            flex-col
                                            gap-5
                                        "
                                    >

                                        <div className="flex flex-col gap-2">

                                            <label
                                                htmlFor="email"
                                                className="
                                                    text-label-md
                                                    font-medium
                                                    text-[var(--on-surface)]
                                                "
                                            >
                                                Email address
                                            </label>


                                            <div className="relative">

                                                <Mail
                                                    size={18}
                                                    strokeWidth={1.8}
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
                                                    id="email"
                                                    type="email"
                                                    value={email}
                                                    onChange={handleChange}
                                                    placeholder="you@example.com"
                                                    autoComplete="email"
                                                    inputMode="email"
                                                    disabled={isLoading}
                                                    className="
                                                        skillio-input
                                                        h-12
                                                        w-full
                                                        !pl-11
                                                    "
                                                />

                                            </div>

                                        </div>


                                        {/* Submit */}

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="
                                                skillio-primary-button
                                                h-12
                                                w-full
                                            "
                                        >

                                            {isLoading ? (
                                                <>
                                                    <Loader2
                                                        size={18}
                                                        className="animate-spin"
                                                    />

                                                    Sending reset link...
                                                </>
                                            ) : (
                                                <>
                                                    <SuccessToast
                                                        success={isSuccess}
                                                        message="Password reset link sent."
                                                    />
                                                    Send reset link

                                                    <ArrowRight
                                                        size={17}
                                                    />
                                                </>
                                            )}

                                        </button>

                                    </form>


                                    {/* Back to login */}

                                    <div
                                        className="
                                            mt-7
                                            text-center
                                        "
                                    >

                                        <p
                                            className="
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
                                                    hover:text-[var(--secondary)]
                                                    hover:underline
                                                    underline-offset-4
                                                "
                                            >
                                                Back to login
                                            </Link>

                                        </p>

                                    </div>


                                    {/* Security message */}

                                    <div
                                        className="
                                            mt-10
                                            flex
                                            items-start
                                            gap-3
                                            rounded-2xl
                                            border
                                            border-[var(--outline-variant)]
                                            bg-[var(--background)]
                                            p-4
                                        "
                                    >

                                        <ShieldCheck
                                            size={19}
                                            strokeWidth={1.8}
                                            className="
                                                mt-0.5
                                                shrink-0
                                                text-[var(--on-surface-variant)]
                                            "
                                        />

                                        <p
                                            className="
                                                text-xs
                                                leading-5
                                                text-[var(--on-surface-variant)]
                                            "
                                        >
                                            Reset links are temporary and can
                                            only be used to securely reset your
                                            password.
                                        </p>

                                    </div>

                                </>
                            ) : (

                                /* =================================================
                                    SUCCESS STATE
                                ================================================== */

                                <div
                                    className="
                                        animate-in
                                        fade-in
                                        slide-in-from-bottom-4
                                        duration-500
                                    "
                                >

                                    {/* Success icon */}

                                    <div
                                        className="
                                            flex
                                            h-16
                                            w-16
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-[#e2eedf]
                                            text-[#4f694a]
                                        "
                                    >
                                        <CheckCircle2
                                            size={30}
                                            strokeWidth={1.8}
                                        />
                                    </div>


                                    <h1
                                        className="
                                            mt-7
                                            text-3xl
                                            font-semibold
                                            tracking-tight
                                            text-[var(--on-surface)]
                                            sm:text-4xl
                                        "
                                    >
                                        Check your inbox
                                    </h1>


                                    <p
                                        className="
                                            mt-4
                                            text-sm
                                            leading-6
                                            text-[var(--on-surface-variant)]
                                            sm:text-[15px]
                                            sm:leading-7
                                        "
                                    >
                                        If an account exists for{" "}

                                        <span
                                            className="
                                                font-semibold
                                                text-[var(--on-surface)]
                                            "
                                        >
                                            {email}
                                        </span>

                                        , we've sent a secure password reset
                                        link to that email address.
                                    </p>


                                    {/* Info card */}

                                    <div
                                        className="
                                            mt-7
                                            rounded-2xl
                                            border
                                            border-[var(--outline-variant)]
                                            bg-[var(--background)]
                                            p-5
                                        "
                                    >

                                        <div className="flex gap-3">

                                            <ShieldCheck
                                                size={20}
                                                strokeWidth={1.8}
                                                className="
                                                    mt-0.5
                                                    shrink-0
                                                    text-[var(--primary)]
                                                "
                                            />

                                            <div>

                                                <p
                                                    className="
                                                        text-sm
                                                        font-semibold
                                                        text-[var(--on-surface)]
                                                    "
                                                >
                                                    Secure password recovery
                                                </p>

                                                <p
                                                    className="
                                                        mt-1
                                                        text-sm
                                                        leading-6
                                                        text-[var(--on-surface-variant)]
                                                    "
                                                >
                                                    The reset link is temporary
                                                    and can only be used to
                                                    securely update your password.
                                                </p>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Actions */}

                                    <div
                                        className="
                                            mt-8
                                            flex
                                            flex-col
                                            gap-3
                                        "
                                    >

                                        <Link
                                            to="/login"
                                            className="
                                                skillio-primary-button
                                                h-12
                                                w-full
                                            "
                                        >
                                            Back to login
                                        </Link>


                                        <button
                                            type="button"
                                            onClick={handleDifferentEmail}
                                            className="
                                                flex
                                                h-12
                                                w-full
                                                items-center
                                                justify-center
                                                gap-2
                                                rounded-xl
                                                border
                                                border-[var(--outline)]
                                                bg-transparent
                                                px-5
                                                text-sm
                                                font-semibold
                                                text-[var(--on-surface)]
                                                transition-colors
                                                hover:bg-[var(--background)]
                                            "
                                        >

                                            <ArrowLeft size={17} />

                                            Use a different email

                                        </button>

                                    </div>

                                </div>
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <footer
                        className="
                            w-full
                            px-5
                            pb-6
                            pt-2
                            text-center
                            sm:px-8
                            sm:pb-7
                        "
                    >

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                justify-center
                                gap-x-3
                                gap-y-1
                                text-[10px]
                                text-[var(--outline)]
                                sm:text-label-sm
                            "
                        >

                            <Link
                                to="/privacy"
                                className="
                                    transition-colors
                                    hover:text-[var(--on-surface)]
                                "
                            >
                                Privacy
                            </Link>

                            <span>·</span>

                            <Link
                                to="/terms"
                                className="
                                    transition-colors
                                    hover:text-[var(--on-surface)]
                                "
                            >
                                Terms
                            </Link>

                            <span>·</span>

                            <span>
                                © {new Date().getFullYear()} Skillio
                            </span>

                        </div>

                    </footer>

                </section>

            </div>

        </main>
    );
};


export default ForgotPassword;