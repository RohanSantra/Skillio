import { useEffect, useRef, useState } from "react";

import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import {
    ArrowRight,
    CheckCircle2,
    CircleCheck,
    Clock3,
    KeyRound,
    Loader2,
    Mail,
    RefreshCw,
    ShieldCheck,
    Sparkles,
    TriangleAlert,
    UserCheck,
} from "lucide-react";
import ErrorToast from "../../../components/feedback/ErrorToast.jsx";

import { toast } from "sonner";

import useAuth from "../hooks/useAuth.js";
import SkillioLogo from "../../../components/SkillioLogo.jsx";


const EmailVerification = () => {

    const navigate = useNavigate();

    const { token } = useParams();

    const [searchParams] = useSearchParams();

    const {
        verifyEmail,
        resendVerificationEmail,
    } = useAuth();


    /*
     * =========================================================
     * EMAIL
     * =========================================================
     */

    const email =
        searchParams.get("email") || "";


    /*
     * =========================================================
     * STATE
     * =========================================================
     */

    const [status, setStatus] = useState(
        token
            ? "verifying"
            : "pending"
    );

    const [isResending, setIsResending] =
        useState(false);

    const [resendCooldown, setResendCooldown] =
        useState(45);

    const [error, setError] =
        useState("");


    /*
     * =========================================================
     * VERIFY EMAIL
     * =========================================================
     */

    const verificationStarted =
        useRef(false);


    useEffect(() => {

        if (!token) {
            return;
        }


        if (verificationStarted.current) {
            return;
        }


        verificationStarted.current = true;


        const verify = async () => {

            try {

                setStatus("verifying");
                setError("");


                const response =
                    await verifyEmail(token);


                console.log(
                    "VERIFY SUCCESS:",
                    response
                );


                setStatus("success");


                toast.success(
                    "Your email has been verified!"
                );

            } catch (error) {

                console.error(
                    "VERIFY ERROR:",
                    error
                );


                const message =
                    error?.response?.data?.message ||
                    "This verification link is invalid or has expired.";


                setError(message);

                setStatus("expired");


                toast.error(message);

            }

        };


        verify();

    }, [token, verifyEmail]);


    /*
     * =========================================================
     * RESEND COUNTDOWN
     * =========================================================
     */

    useEffect(() => {

        if (status !== "pending") {
            return;
        }


        if (resendCooldown <= 0) {
            return;
        }


        const timer =
            setInterval(() => {

                setResendCooldown(
                    (previous) =>
                        previous > 0
                            ? previous - 1
                            : 0
                );

            }, 1000);


        return () =>
            clearInterval(timer);

    }, [
        resendCooldown,
        status,
    ]);


    /*
     * =========================================================
     * RESEND VERIFICATION
     * =========================================================
     */

    const handleResend = async () => {

        if (!email) {

            toast.error(
                "We need your email address to resend the verification email."
            );


            navigate("/register");

            return;
        }


        if (
            resendCooldown > 0 ||
            isResending
        ) {
            return;
        }


        try {

            setIsResending(true);
            setError("");


            await resendVerificationEmail(
                email
            );


            toast.success(
                "A new verification email has been sent."
            );


            setResendCooldown(45);

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Unable to resend the verification email.";


            setError(message);


            toast.error(message);

        } finally {

            setIsResending(false);

        }

    };


    /*
     * =========================================================
     * MASK EMAIL
     * =========================================================
     */

    const displayEmail =
        maskEmail(email);


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

            {/* =====================================================
                DESKTOP LAYOUT
            ====================================================== */}

            <div
                className="
                    hidden
                    min-h-[100dvh]
                    lg:grid
                    lg:grid-cols-[55%_45%]
                "
            >

                {/* =================================================
                    LEFT — CODED ARTWORK
                ================================================== */}

                <section
                    className="
                        relative
                        min-h-[100dvh]
                        overflow-hidden
                        bg-[#edf4e9]
                    "
                >

                    <VerificationArtwork />


                    {/* =================================================
                        BRAND
                    ================================================== */}

                    <div
                        className="
                            absolute
                            left-10
                            top-9
                            z-50
                            flex
                            items-center
                            gap-3
                            xl:left-14
                        "
                    >



                        <div>

                            <p
                                className="
                                    text-lg
                                    font-semibold
                                    tracking-tight
                                    text-[#30402d]
                                "
                            >
                                <SkillioLogo size={150} />
                            </p>


                            <p
                                className="
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-[0.18em]
                                    text-[#7a8875]
                                "
                            >
                                AI career workspace
                            </p>

                        </div>

                    </div>


                    {/* =================================================
                        LEFT TEXT
                    ================================================== */}

                    <div
                        className="
                            absolute
                            bottom-10
                            left-10
                            z-50
                            max-w-[620px]
                            xl:left-14
                            xl:bottom-12
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
                                border-[#cbdcc5]
                                bg-white/65
                                px-3.5
                                py-2
                                shadow-[0_8px_30px_rgba(61,86,55,0.06)]
                                backdrop-blur-xl
                            "
                        >

                            <span
                                className="
                                    flex
                                    h-5
                                    w-5
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#dcebd7]
                                    text-[#557052]
                                "
                            >
                                <ShieldCheck
                                    size={12}
                                    strokeWidth={2}
                                />
                            </span>


                            <span
                                className="
                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.16em]
                                    text-[#61725d]
                                "
                            >
                                Secure your journey
                            </span>

                        </div>


                        <h1
                            className="
                                max-w-[620px]
                                text-4xl
                                font-semibold
                                leading-[1.08]
                                tracking-[-0.035em]
                                text-[#263425]
                                xl:text-5xl
                                2xl:text-[54px]
                            "
                        >
                            One small step.
                            <br />
                            A verified career workspace.
                        </h1>


                        <p
                            className="
                                mt-5
                                max-w-[540px]
                                text-sm
                                leading-6
                                text-[#6b7867]
                                xl:text-base
                                xl:leading-7
                            "
                        >
                            Confirm your email and unlock the
                            workspace designed to help you understand,
                            prepare, practice, and grow.
                        </p>


                        {/* Journey */}

                        <div
                            className="
                                mt-7
                                flex
                                flex-wrap
                                items-center
                                gap-x-3
                                gap-y-2
                            "
                        >

                            {[
                                {
                                    label: "Create",
                                    active: false,
                                    done: true,
                                },
                                {
                                    label: "Verify",
                                    active: true,
                                    done: false,
                                },
                                {
                                    label: "Prepare",
                                    active: false,
                                    done: false,
                                },
                                {
                                    label: "Grow",
                                    active: false,
                                    done: false,
                                },
                            ].map((item, index) => (

                                <div
                                    key={item.label}
                                    className="
                                        flex
                                        items-center
                                        gap-2.5
                                    "
                                >

                                    <div
                                        className={`
                                            flex
                                            items-center
                                            gap-2
                                            rounded-full
                                            px-2.5
                                            py-1.5
                                            ${item.active
                                                ? "bg-[#dbead6] text-[#526d4d]"
                                                : "text-[#788575]"
                                            }
                                        `}
                                    >

                                        <span
                                            className={`
                                                flex
                                                h-5
                                                w-5
                                                items-center
                                                justify-center
                                                rounded-full
                                                text-[9px]
                                                font-bold
                                                ${item.done
                                                    ? "bg-[#7c9b75] text-white"
                                                    : item.active
                                                        ? "border border-[#91aa8b] bg-white text-[#5e7658]"
                                                        : "border border-[#ccd8c8] bg-white/60 text-[#899487]"
                                                }
                                            `}
                                        >

                                            {item.done ? (
                                                <CheckCircle2
                                                    size={11}
                                                />
                                            ) : (
                                                index + 1
                                            )}

                                        </span>


                                        <span
                                            className="
                                                text-[10px]
                                                font-semibold
                                            "
                                        >
                                            {item.label}
                                        </span>

                                    </div>


                                    {index < 3 && (
                                        <ArrowRight
                                            size={12}
                                            className="
                                                text-[#aab7a6]
                                            "
                                        />
                                    )}

                                </div>

                            ))}

                        </div>

                    </div>

                </section>


                {/* =================================================
                    RIGHT
                ================================================== */}

                <VerificationPanel
                    status={status}
                    displayEmail={displayEmail}
                    hasEmail={Boolean(email)}
                    resendCooldown={resendCooldown}
                    isResending={isResending}
                    error={error}
                    onResend={handleResend}
                    onContinue={() =>
                        navigate(
                            "/login",
                            {
                                replace: true,
                            }
                        )
                    }
                />

            </div>


            {/* =====================================================
                MOBILE
            ====================================================== */}

            <div
                className="
                    flex
                    min-h-[100dvh]
                    flex-col
                    lg:hidden
                "
            >

                {/* =================================================
                    MOBILE ARTWORK
                ================================================== */}

                <section
                    className="
                        relative
                        h-[260px]
                        w-full
                        shrink-0
                        overflow-hidden
                        bg-[#edf4e9]
                    "
                >

                    <MobileVerificationArtwork />


                    {/* Mobile brand */}

                    <div
                        className="
                            absolute
                            left-5
                            top-5
                            z-50
                            flex
                            items-center
                            gap-2.5
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
                                border
                                border-white/70
                                bg-white/75
                                shadow-sm
                                backdrop-blur-xl
                            "
                        >

                            <SkillioLogo size={150}/>

                        </div>


                        <div>

                            <p
                                className="
                                    text-base
                                    font-semibold
                                    text-[#30402d]
                                "
                            >
                                Skillio
                            </p>

                            <p
                                className="
                                    text-[7px]
                                    font-bold
                                    uppercase
                                    tracking-[0.14em]
                                    text-[#788575]
                                "
                            >
                                AI career workspace
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            absolute
                            bottom-5
                            left-5
                            right-5
                            z-50
                        "
                    >

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-[#cbdcc5]
                                bg-white/70
                                px-3
                                py-1.5
                                backdrop-blur-xl
                            "
                        >

                            <span
                                className="
                                    h-1.5
                                    w-1.5
                                    rounded-full
                                    bg-[#789472]
                                "
                            />

                            <span
                                className="
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-[0.14em]
                                    text-[#5f705b]
                                "
                            >
                                Verify your account
                            </span>

                        </div>


                        <h1
                            className="
                                mt-3
                                max-w-[360px]
                                text-2xl
                                font-semibold
                                leading-tight
                                tracking-tight
                                text-[#263425]
                            "
                        >
                            Almost there.
                            Your workspace is waiting.
                        </h1>

                    </div>

                </section>


                {/* =================================================
                    MOBILE FORM
                ================================================== */}

                <VerificationPanel
                    status={status}
                    displayEmail={displayEmail}
                    hasEmail={Boolean(email)}
                    resendCooldown={resendCooldown}
                    isResending={isResending}
                    error={error}
                    onResend={handleResend}
                    onContinue={() =>
                        navigate(
                            "/login",
                            {
                                replace: true,
                            }
                        )
                    }
                    mobile
                />

            </div>

        </main>
    );
};


/* ================================================================
   DESKTOP ARTWORK
================================================================ */

const VerificationArtwork = () => {

    return (

        <div
            className="
                absolute
                inset-0
                overflow-hidden
            "
        >

            {/* =====================================================
                SOFT BACKGROUND GLOWS
            ====================================================== */}

            <div
                className="
                    absolute
                    -left-40
                    -top-40
                    h-[520px]
                    w-[520px]
                    rounded-full
                    bg-[#d4e6ce]
                    opacity-70
                    blur-3xl
                "
            />

            <div
                className="
                    absolute
                    -bottom-48
                    right-[-100px]
                    h-[580px]
                    w-[580px]
                    rounded-full
                    bg-[#dcebd7]
                    opacity-80
                    blur-3xl
                "
            />

            <div
                className="
                    absolute
                    right-[15%]
                    top-[10%]
                    h-[260px]
                    w-[260px]
                    rounded-full
                    bg-[#e7efe3]
                    blur-3xl
                "
            />


            {/* =====================================================
                DOT FIELD
            ====================================================== */}

            <div
                className="
                    absolute
                    inset-0
                    opacity-40
                "
                style={{
                    backgroundImage:
                        "radial-gradient(#9caf98 1px, transparent 1px)",
                    backgroundSize: "23px 23px",
                }}
            />


            {/* =====================================================
                LARGE ORBIT
            ====================================================== */}

            <div
                className="
                    absolute
                    right-[-90px]
                    top-[13%]
                    h-[410px]
                    w-[410px]
                    rounded-full
                    border-[34px]
                    border-[#d5e4d0]
                "
            />

            <div
                className="
                    absolute
                    right-[-10px]
                    top-[21%]
                    h-[270px]
                    w-[270px]
                    rounded-full
                    border
                    border-dashed
                    border-[#a9bba5]
                "
            />

            <div
                className="
                    absolute
                    right-[95px]
                    top-[31%]
                    h-3
                    w-3
                    rounded-full
                    bg-[#7d9977]
                    shadow-[0_0_0_8px_rgba(125,153,119,0.12)]
                "
            />


            {/* =====================================================
                CONNECTION LINES
            ====================================================== */}

            <div
                className="
                    absolute
                    left-[20%]
                    top-[42%]
                    h-px
                    w-[470px]
                    rotate-[-18deg]
                    bg-[#b8c9b3]
                    opacity-70
                "
            />

            <div
                className="
                    absolute
                    left-[29%]
                    top-[49%]
                    h-[280px]
                    w-px
                    rotate-[29deg]
                    bg-[#b8c9b3]
                    opacity-60
                "
            />

            <div
                className="
                    absolute
                    left-[15%]
                    top-[63%]
                    h-px
                    w-[430px]
                    rotate-[12deg]
                    bg-[#c0cfbb]
                    opacity-70
                "
            />


            {/* =====================================================
                CENTRAL VERIFICATION CARD
            ====================================================== */}

            <div
                className="
                    absolute
                    left-[51%]
                    top-[43%]
                    z-30
                    w-[360px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-[30px]
                    border
                    border-white/80
                    bg-white/85
                    p-6
                    shadow-[0_30px_90px_rgba(54,76,49,0.15)]
                    backdrop-blur-2xl
                "
            >

                {/* Header */}

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
                                bg-[#e2eee0]
                                text-[#5c7856]
                            "
                        >

                            <Mail
                                size={20}
                                strokeWidth={1.8}
                            />

                        </div>


                        <div>

                            <p
                                className="
                                    text-[11px]
                                    font-bold
                                    text-[#2d392b]
                                "
                            >
                                Email verification
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[9px]
                                    text-[#849080]
                                "
                            >
                                Secure account setup
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
                            bg-[#e8f1e5]
                            text-[#64815e]
                        "
                    >

                        <ShieldCheck
                            size={15}
                        />

                    </div>

                </div>


                {/* Verification visualization */}

                <div
                    className="
                        relative
                        mx-auto
                        mt-7
                        flex
                        h-[145px]
                        w-[145px]
                        items-center
                        justify-center
                    "
                >

                    <div
                        className="
                            absolute
                            inset-0
                            rounded-full
                            border
                            border-[#d6e5d1]
                        "
                    />

                    <div
                        className="
                            absolute
                            inset-[13px]
                            rounded-full
                            border
                            border-dashed
                            border-[#b8cbb2]
                        "
                    />

                    <div
                        className="
                            absolute
                            inset-[27px]
                            rounded-full
                            bg-[#e4eee1]
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            h-16
                            w-16
                            items-center
                            justify-center
                            rounded-[20px]
                            bg-white
                            text-[#607b5b]
                            shadow-[0_12px_30px_rgba(72,95,67,0.12)]
                        "
                    >

                        <Mail
                            size={28}
                            strokeWidth={1.7}
                        />

                    </div>


                    {/* Orbit dots */}

                    <span
                        className="
                            absolute
                            left-[4px]
                            top-[55px]
                            h-2.5
                            w-2.5
                            rounded-full
                            bg-[#7e9b78]
                        "
                    />

                    <span
                        className="
                            absolute
                            right-[8px]
                            top-[28px]
                            h-2
                            w-2
                            rounded-full
                            bg-[#a3b89e]
                        "
                    />

                    <span
                        className="
                            absolute
                            bottom-[8px]
                            left-[48px]
                            h-2
                            w-2
                            rounded-full
                            bg-[#b0c2aa]
                        "
                    />

                </div>


                {/* Status */}

                <div
                    className="
                        mt-5
                        text-center
                    "
                >

                    <p
                        className="
                            text-[13px]
                            font-bold
                            text-[#303a2e]
                        "
                    >
                        Waiting for confirmation
                    </p>

                    <p
                        className="
                            mt-1
                            text-[9px]
                            leading-4
                            text-[#899486]
                        "
                    >
                        Verify your email to activate
                        your career workspace.
                    </p>

                </div>


                {/* Progress */}

                <div className="mt-6">

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
                                text-[#6d796a]
                            "
                        >
                            Account setup
                        </span>

                        <span
                            className="
                                text-[9px]
                                font-bold
                                text-[#607b5b]
                            "
                        >
                            50%
                        </span>

                    </div>


                    <div
                        className="
                            mt-2
                            h-2
                            overflow-hidden
                            rounded-full
                            bg-[#e8eee5]
                        "
                    >

                        <div
                            className="
                                h-full
                                w-1/2
                                rounded-full
                                bg-[#789572]
                            "
                        />

                    </div>

                </div>


                {/* Journey */}

                <div
                    className="
                        mt-6
                        grid
                        grid-cols-3
                        gap-2
                    "
                >

                    <ArtworkStep
                        icon={<UserCheck size={13} />}
                        label="Account"
                        done
                    />

                    <ArtworkStep
                        icon={<Mail size={13} />}
                        label="Verify"
                        active
                    />

                    <ArtworkStep
                        icon={<Sparkles size={13} />}
                        label="Workspace"
                    />

                </div>

            </div>


            {/* =====================================================
                FLOATING — SECURITY CARD
            ====================================================== */}

            <div
                className="
                    absolute
                    left-[9%]
                    top-[28%]
                    z-40
                    w-[190px]
                    -rotate-[6deg]
                    rounded-2xl
                    border
                    border-white/80
                    bg-white/85
                    p-4
                    shadow-[0_22px_55px_rgba(54,76,49,0.12)]
                    backdrop-blur-xl
                "
            >

                <div
                    className="
                        flex
                        items-center
                        gap-2.5
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
                            bg-[#e4eee1]
                            text-[#5f7a59]
                        "
                    >

                        <KeyRound
                            size={16}
                        />

                    </div>


                    <div>

                        <p
                            className="
                                text-[9px]
                                font-bold
                                text-[#303a2e]
                            "
                        >
                            Secure access
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-[8px]
                                text-[#899486]
                            "
                        >
                            Protected workspace
                        </p>

                    </div>

                </div>


                <div
                    className="
                        mt-4
                        flex
                        items-center
                        gap-2
                    "
                >

                    <CircleCheck
                        size={13}
                        className="text-[#71906b]"
                    />

                    <span
                        className="
                            text-[8px]
                            font-semibold
                            text-[#667363]
                        "
                    >
                        Identity confirmation
                    </span>

                </div>

            </div>


            {/* =====================================================
                FLOATING — DELIVERY CARD
            ====================================================== */}

            <div
                className="
                    absolute
                    bottom-[19%]
                    right-[7%]
                    z-40
                    w-[205px]
                    rotate-[5deg]
                    rounded-2xl
                    border
                    border-white/80
                    bg-white/85
                    p-4
                    shadow-[0_22px_55px_rgba(54,76,49,0.12)]
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
                                text-[#303a2e]
                            "
                        >
                            Verification link
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-[8px]
                                text-[#899486]
                            "
                        >
                            Sent to your inbox
                        </p>

                    </div>


                    <div
                        className="
                            flex
                            h-8
                            w-8
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#e6efe3]
                            text-[#64815e]
                        "
                    >

                        <Mail
                            size={14}
                        />

                    </div>

                </div>


                <div
                    className="
                        mt-4
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        bg-[#f0f5ed]
                        px-3
                        py-2.5
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-[#7d9977]
                            "
                        />

                        <span
                            className="
                                text-[8px]
                                font-medium
                                text-[#687465]
                            "
                        >
                            Waiting
                        </span>

                    </div>


                    <Clock3
                        size={12}
                        className="text-[#82907e]"
                    />

                </div>

            </div>


            {/* =====================================================
                SMALL DECORATIVE ELEMENTS
            ====================================================== */}

            <div
                className="
                    absolute
                    left-[38%]
                    top-[19%]
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-white/70
                    bg-white/55
                    text-[#7c9277]
                    shadow-sm
                    backdrop-blur-xl
                "
            >

                <Sparkles
                    size={15}
                />

            </div>


            <div
                className="
                    absolute
                    bottom-[27%]
                    left-[14%]
                    h-3
                    w-3
                    rounded-full
                    bg-[#7f9b79]
                    shadow-[0_0_0_9px_rgba(127,155,121,0.12)]
                "
            />

            <div
                className="
                    absolute
                    right-[25%]
                    bottom-[15%]
                    h-2
                    w-2
                    rounded-full
                    bg-[#9caf98]
                "
            />

        </div>
    );
};


/* ================================================================
   ARTWORK STEP
================================================================ */

const ArtworkStep = ({
    icon,
    label,
    done = false,
    active = false,
}) => {

    return (

        <div
            className={`
                flex
                flex-col
                items-center
                gap-1.5
                rounded-xl
                py-2
                ${active
                    ? "bg-[#edf4ea]"
                    : ""
                }
            `}
        >

            <div
                className={`
                    flex
                    h-7
                    w-7
                    items-center
                    justify-center
                    rounded-full
                    ${done
                        ? "bg-[#dbead6] text-[#64815e]"
                        : active
                            ? "bg-[#7d9977] text-white"
                            : "border border-[#d6dfd3] bg-white text-[#9aa598]"
                    }
                `}
            >
                {done ? (
                    <CheckCircle2
                        size={13}
                    />
                ) : (
                    icon
                )}
            </div>


            <span
                className="
                    text-[7px]
                    font-semibold
                    text-[#7d887a]
                "
            >
                {label}
            </span>

        </div>

    );
};


/* ================================================================
   MOBILE ARTWORK
================================================================ */

const MobileVerificationArtwork = () => {

    return (

        <div
            className="
                absolute
                inset-0
                overflow-hidden
            "
        >

            {/* Background */}

            <div
                className="
                    absolute
                    -left-20
                    -top-28
                    h-64
                    w-64
                    rounded-full
                    bg-[#d6e8d0]
                    blur-3xl
                "
            />

            <div
                className="
                    absolute
                    -bottom-24
                    -right-20
                    h-64
                    w-64
                    rounded-full
                    bg-[#dfeadd]
                    blur-3xl
                "
            />


            {/* Dot grid */}

            <div
                className="
                    absolute
                    inset-0
                    opacity-35
                "
                style={{
                    backgroundImage:
                        "radial-gradient(#9caf98 1px, transparent 1px)",
                    backgroundSize: "18px 18px",
                }}
            />


            {/* Orbit */}

            <div
                className="
                    absolute
                    right-[-70px]
                    top-[-60px]
                    h-72
                    w-72
                    rounded-full
                    border-[24px]
                    border-[#d4e4cf]
                "
            />

            <div
                className="
                    absolute
                    right-[20px]
                    top-[-5px]
                    h-48
                    w-48
                    rounded-full
                    border
                    border-dashed
                    border-[#aebeaa]
                "
            />


            {/* Central email artwork */}

            <div
                className="
                    absolute
                    left-1/2
                    top-[48%]
                    flex
                    h-[105px]
                    w-[105px]
                    -translate-x-1/2
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#cfdfca]
                    bg-white/35
                "
            >

                <div
                    className="
                        absolute
                        inset-[12px]
                        rounded-full
                        border
                        border-dashed
                        border-[#b8cab3]
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        flex
                        h-14
                        w-14
                        items-center
                        justify-center
                        rounded-2xl
                        bg-white/90
                        text-[#607c5a]
                        shadow-[0_14px_35px_rgba(60,84,55,0.12)]
                        backdrop-blur-xl
                    "
                >

                    <Mail
                        size={25}
                        strokeWidth={1.7}
                    />

                </div>

            </div>


            {/* Floating mini card */}

            <div
                className="
                    absolute
                    left-[8%]
                    top-[46%]
                    w-[130px]
                    -rotate-[7deg]
                    rounded-2xl
                    border
                    border-white/75
                    bg-white/80
                    p-3
                    shadow-[0_15px_35px_rgba(60,84,55,0.1)]
                    backdrop-blur-xl
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
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#e3eee0]
                            text-[#617d5b]
                        "
                    >

                        <ShieldCheck
                            size={13}
                        />

                    </div>


                    <div>

                        <p
                            className="
                                text-[7px]
                                font-bold
                                text-[#354033]
                            "
                        >
                            Secure
                        </p>

                        <p
                            className="
                                text-[6px]
                                text-[#899487]
                            "
                        >
                            Account protected
                        </p>

                    </div>

                </div>

            </div>


            {/* Floating progress */}

            <div
                className="
                    absolute
                    bottom-[15%]
                    right-[8%]
                    w-[145px]
                    rotate-[5deg]
                    rounded-2xl
                    border
                    border-white/75
                    bg-white/80
                    p-3
                    shadow-[0_15px_35px_rgba(60,84,55,0.1)]
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

                    <span
                        className="
                            text-[7px]
                            font-bold
                            text-[#3c4939]
                        "
                    >
                        Verification
                    </span>

                    <span
                        className="
                            text-[7px]
                            font-bold
                            text-[#6b8765]
                        "
                    >
                        50%
                    </span>

                </div>


                <div
                    className="
                        mt-2
                        h-1.5
                        overflow-hidden
                        rounded-full
                        bg-[#e5ece2]
                    "
                >

                    <div
                        className="
                            h-full
                            w-1/2
                            rounded-full
                            bg-[#789572]
                        "
                    />

                </div>

            </div>


            {/* Decorative dots */}

            <span
                className="
                    absolute
                    bottom-[22%]
                    left-[18%]
                    h-2
                    w-2
                    rounded-full
                    bg-[#809b7a]
                "
            />

            <span
                className="
                    absolute
                    left-[45%]
                    top-[31%]
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#a0b39b]
                "
            />

        </div>
    );
};


/* ================================================================
   VERIFICATION PANEL
================================================================ */

const VerificationPanel = ({
    status,
    displayEmail,
    hasEmail,
    resendCooldown,
    isResending,
    error,
    onResend,
    onContinue,
    mobile = false,
}) => {

    return (

        <section
            className={`
                flex
                min-h-[100dvh]
                flex-col
                bg-[var(--surface)]
                ${mobile
                    ? "min-h-0 flex-1"
                    : ""
                }
            `}
        >

            <div
                className="
                    flex
                    flex-1
                    w-full
                    items-center
                    justify-center
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
                        text-center
                    "
                >

                    {/* =================================================
                        BRAND
                    ================================================== */}

                    <div
                        className="
                            mb-10
                            flex
                            flex-col
                            items-center
                        "
                    >

                        <Link
                            to="/"
                            aria-label="Skillio home"
                            className="
                                inline-flex
                                items-center
                                rounded-md
                                outline-none
                            "
                        >

                            <SkillioLogo size={150}/>

                        </Link>


                        <p
                            className="
                                mt-2
                                text-[9px]
                                font-medium
                                uppercase
                                tracking-[0.1em]
                                text-[var(--on-surface-variant)]
                            "
                        >
                            AI-powered career workspace
                        </p>

                    </div>


                    {/* =================================================
                        VERIFYING
                    ================================================== */}

                    {status === "verifying" && (
                        <VerifyingState />
                    )}


                    {/* =================================================
                        PENDING
                    ================================================== */}

                    {status === "pending" && (
                        <PendingState
                            email={displayEmail}
                            hasEmail={hasEmail}
                            resendCooldown={resendCooldown}
                            isResending={isResending}
                            error={error}
                            onResend={onResend}
                        />
                    )}


                    {/* =================================================
                        SUCCESS
                    ================================================== */}

                    {status === "success" && (
                        <SuccessState
                            onContinue={onContinue}
                        />
                    )}


                    {/* =================================================
                        EXPIRED
                    ================================================== */}

                    {status === "expired" && (
                        <ExpiredState
                            error={error}
                            onResend={onResend}
                        />
                    )}

                </div>

            </div>


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer
                className="
                    w-full
                    px-6
                    pb-6
                    text-center
                "
            >

                <div
                    className="
                        flex
                        flex-col
                        items-center
                        gap-2
                    "
                >

                    <ShieldCheck
                        size={17}
                        strokeWidth={1.8}
                        className="
                            text-[var(--outline)]
                        "
                    />


                    <p
                        className="
                            text-[10px]
                            text-[var(--on-surface-variant)]
                        "
                    >
                        Your account and career data
                        are securely protected.
                    </p>


                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            text-[10px]
                            text-[var(--outline)]
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
                            © 2026 Skillio
                        </span>

                    </div>

                </div>

            </footer>

        </section>
    );
};


/* ================================================================
   VERIFYING STATE
================================================================ */

const VerifyingState = () => {

    return (

        <div
            className="
                flex
                flex-col
                items-center
            "
        >

            <div
                className="
                    relative
                    mb-7
                    flex
                    h-20
                    w-20
                    items-center
                    justify-center
                    rounded-full
                    bg-[var(--surface-container)]
                    text-[var(--primary)]
                "
            >

                <div
                    className="
                        absolute
                        inset-0
                        rounded-full
                        border
                        border-[var(--outline-variant)]
                    "
                />

                <Loader2
                    size={30}
                    className="animate-spin"
                />

            </div>


            <h2
                className="
                    text-headline-md
                    font-semibold
                    text-[var(--on-surface)]
                "
            >
                Verifying your email
            </h2>


            <p
                className="
                    mt-3
                    text-body-md
                    leading-6
                    text-[var(--on-surface-variant)]
                "
            >
                Please wait while we secure your account.
            </p>

        </div>
    );
};


/* ================================================================
   PENDING STATE
================================================================ */

const PendingState = ({
    email,
    hasEmail,
    resendCooldown,
    isResending,
    error,
    onResend,
}) => {

    return (

        <div
            className="
                flex
                flex-col
                items-center
            "
        >

            <div
                className="
                    mb-6
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[var(--secondary-container)]
                    text-[var(--on-secondary-container)]
                "
            >

                <Mail
                    size={30}
                    strokeWidth={1.8}
                />

            </div>


            <h2
                className="
                    text-headline-md
                    font-semibold
                    text-[var(--on-surface)]
                "
            >
                Check your inbox
            </h2>


            <p
                className="
                    mt-3
                    text-body-md
                    leading-6
                    text-[var(--on-surface-variant)]
                "
            >

                We've sent a verification link to{" "}

                {hasEmail ? (

                    <strong
                        className="
                            font-semibold
                            text-[var(--on-surface)]
                        "
                    >
                        {email}
                    </strong>

                ) : (

                    "your email address"

                )}

                . Click the link in the email to verify
                your account and continue to Skillio.

            </p>


            {/* =================================================
                OPEN EMAIL
            ================================================== */}

            <button
                type="button"
                onClick={() => {
                    window.location.href =
                        "mailto:";
                }}
                className="
                    skillio-primary-button
                    mt-8
                    h-12
                    w-full
                "
            >
                Open email

                <Mail
                    size={17}
                />
            </button>


            {/* =================================================
                ERROR
            ================================================== */}

            <ErrorToast error={error} />


            {/* =================================================
                RESEND
            ================================================== */}

            <div
                className="
                    mt-6
                    flex
                    flex-col
                    items-center
                    gap-3
                "
            >

                <button
                    type="button"
                    onClick={onResend}
                    disabled={
                        resendCooldown > 0 ||
                        isResending
                    }
                    className="
                        inline-flex
                        items-center
                        gap-2
                        text-label-md
                        text-[var(--primary)]
                        transition-colors
                        hover:text-[var(--secondary)]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    {isResending ? (

                        <Loader2
                            size={16}
                            className="animate-spin"
                        />

                    ) : (

                        <RefreshCw
                            size={16}
                        />

                    )}


                    {isResending
                        ? "Sending..."
                        : "Resend verification email"}


                    {resendCooldown > 0 && (

                        <span
                            className="
                                font-normal
                                text-[var(--on-surface-variant)]
                            "
                        >
                            ({resendCooldown}s)
                        </span>

                    )}

                </button>


                <Link
                    to="/register"
                    className="
                        text-label-md
                        text-[var(--on-surface-variant)]
                        underline
                        underline-offset-4
                        transition-colors
                        hover:text-[var(--on-surface)]
                    "
                >
                    Change email address
                </Link>

            </div>

        </div>
    );
};


/* ================================================================
   SUCCESS STATE
================================================================ */

const SuccessState = ({
    onContinue,
}) => {

    return (

        <div
            className="
                flex
                flex-col
                items-center
            "
        >

            <div
                className="
                    mb-6
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[var(--primary-fixed)]
                    text-[var(--on-primary-fixed-variant)]
                "
            >

                <CheckCircle2
                    size={32}
                    strokeWidth={1.8}
                />

            </div>


            <h2
                className="
                    text-headline-md
                    font-semibold
                    text-[var(--on-surface)]
                "
            >
                Email verified!
            </h2>


            <p
                className="
                    mt-3
                    text-body-md
                    leading-6
                    text-[var(--on-surface-variant)]
                "
            >
                Your account is now secure. Let's start
                building your career workspace.
            </p>


            <button
                type="button"
                onClick={onContinue}
                className="
                    skillio-primary-button
                    mt-8
                    h-12
                    w-full
                "
            >
                Continue to Skillio

                <ArrowRight
                    size={17}
                />

            </button>


            <div
                className="
                    mt-6
                    flex
                    w-full
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    border-[var(--outline-variant)]
                    bg-[var(--surface-container-low)]
                    p-4
                    text-left
                "
            >

                <ShieldCheck
                    size={19}
                    className="
                        mt-0.5
                        shrink-0
                        text-[var(--primary)]
                    "
                />


                <p
                    className="
                        text-[10px]
                        leading-5
                        text-[var(--on-surface-variant)]
                    "
                >
                    Your account is now protected.
                    You can continue to Skillio and
                    begin preparing for your next opportunity.
                </p>

            </div>

        </div>
    );
};


/* ================================================================
   EXPIRED STATE
================================================================ */

const ExpiredState = ({
    error,
    onResend,
}) => {

    return (

        <div
            className="
                flex
                flex-col
                items-center
            "
        >

            <div
                className="
                    mb-6
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[var(--error-container)]
                    text-[var(--on-error-container)]
                "
            >

                <TriangleAlert
                    size={30}
                    strokeWidth={1.8}
                />

            </div>


            <h2
                className="
                    text-headline-md
                    font-semibold
                    text-[var(--on-surface)]
                "
            >
                Verification link expired
            </h2>


            <p
                className="
                    mt-3
                    text-body-md
                    leading-6
                    text-[var(--on-surface-variant)]
                "
            >
                {error ||
                    "For your security, verification links expire after 24 hours. Please request a new one."}
            </p>


            <button
                type="button"
                onClick={onResend}
                className="
                    skillio-primary-button
                    mt-8
                    h-12
                    w-full
                "
            >
                Send new verification email

                <RefreshCw
                    size={17}
                />

            </button>


            <Link
                to="/login"
                className="
                    mt-5
                    text-label-md
                    text-[var(--on-surface-variant)]
                    underline
                    underline-offset-4
                    transition-colors
                    hover:text-[var(--on-surface)]
                "
            >
                Return to login
            </Link>

        </div>
    );
};


/* ================================================================
   EMAIL MASKING
================================================================ */

const maskEmail = (email) => {

    if (!email) {
        return "";
    }


    const [
        username,
        domain,
    ] = email.split("@");


    if (!username || !domain) {
        return email;
    }


    if (username.length <= 2) {

        return `${username[0] || ""}***@${domain}`;

    }


    return `${username.slice(0, 2)}***@${domain}`;
};


export default EmailVerification;