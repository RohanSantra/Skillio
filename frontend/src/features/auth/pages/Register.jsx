import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
    ArrowRight,
    Check,
    CheckCircle2,
    Eye,
    EyeOff,
    Loader2,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingUp,
    UserRound,
} from "lucide-react";

import { toast } from "sonner";

import useAuth from "../hooks/useAuth.js";

import PasswordStrength from "../components/PasswordStrength.jsx";
import { isPasswordValid } from "../utils/passwordValidation.js";
import GoogleAuthButton from "../components/GoogleAuthButton.jsx";
import SkillioLogo from "../../../components/SkillioLogo.jsx";


const Register = () => {

    const navigate = useNavigate();

    const { register } = useAuth();


    // =========================================================
    // STATE
    // =========================================================

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [isLoading, setIsLoading] = useState(false);


    // =========================================================
    // INPUT
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
    // REGISTER
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        const name = formData.name.trim();

        const email = formData.email.trim();

        const password = formData.password;

        const confirmPassword =
            formData.confirmPassword;


        // -----------------------------------------------------
        // NAME
        // -----------------------------------------------------

        if (!name) {

            toast.error(
                "Please enter your name."
            );

            return;
        }


        if (name.length < 2) {

            toast.error(
                "Name must be at least 2 characters."
            );

            return;
        }


        if (name.length > 50) {

            toast.error(
                "Name cannot be longer than 50 characters."
            );

            return;
        }


        // -----------------------------------------------------
        // EMAIL
        // -----------------------------------------------------

        if (!email) {

            toast.error(
                "Please enter your email address."
            );

            return;
        }


        // -----------------------------------------------------
        // PASSWORD
        // -----------------------------------------------------

        if (!password) {

            toast.error(
                "Please create a password."
            );

            return;
        }


        if (!isPasswordValid(password)) {

            toast.error(
                "Please make sure your password meets all the requirements."
            );

            return;
        }


        // -----------------------------------------------------
        // CONFIRM PASSWORD
        // -----------------------------------------------------

        if (!confirmPassword) {

            toast.error(
                "Please confirm your password."
            );

            return;
        }


        if (password !== confirmPassword) {

            toast.error(
                "Passwords do not match."
            );

            return;
        }


        // -----------------------------------------------------
        // API
        // -----------------------------------------------------

        try {

            setIsLoading(true);


            await register({
                name,
                email,
                password,
            });


            toast.success(
                "Account created successfully!"
            );


            navigate(
                `/verify-email?email=${encodeURIComponent(email)}`,
                {
                    replace: true,
                }
            );


        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Unable to create your account. Please try again.";


            toast.error(message);


        } finally {

            setIsLoading(false);

        }
    };


    // =========================================================
    // UI
    // =========================================================

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


                {/* =================================================
    LEFT — SKILLIO CAREER ARTWORK
================================================= */}

                <section
                    className="
                        relative
                        hidden
                        min-h-[100dvh]
                        w-full
                        overflow-hidden
                        bg-[#eef3eb]
                        lg:block
                        lg:w-[55%]
                        lg:flex-none
    "
                >

                    {/* =================================================
        BACKGROUND
    ================================================== */}

                    {/* Main soft glow */}

                    <div
                        className="
            absolute
            -left-[180px]
            -top-[180px]
            h-[520px]
            w-[520px]
            rounded-full
            bg-[#d7e6d2]
            opacity-80
            blur-3xl
        "
                    />

                    <div
                        className="
            absolute
            -bottom-[220px]
            -right-[180px]
            h-[600px]
            w-[600px]
            rounded-full
            bg-[#d5e4cf]
            opacity-80
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
            opacity-45
        "
                        style={{
                            backgroundImage:
                                "radial-gradient(#a8b9a2 1px, transparent 1px)",
                            backgroundSize: "22px 22px",
                        }}
                    />


                    {/* =================================================
        LARGE ORBIT
    ================================================== */}

                    <div
                        className="
            pointer-events-none
            absolute
            -right-[155px]
            top-[80px]
            h-[430px]
            w-[430px]
            rounded-full
            border-[42px]
            border-[#d5e2d1]
        "
                    />

                    <div
                        className="
            pointer-events-none
            absolute
            -right-[95px]
            top-[140px]
            h-[310px]
            w-[310px]
            rounded-full
            border
            border-dashed
            border-[#b9cbb4]
        "
                    />

                    <div
                        className="
            pointer-events-none
            absolute
            right-[48px]
            top-[260px]
            h-3
            w-3
            rounded-full
            bg-[#76916f]
            shadow-[0_0_0_9px_rgba(118,145,111,0.12)]
        "
                    />


                    {/* =================================================
        TOP BRAND / LABEL
    ================================================== */}

                    <div
                        className="
            relative
            z-20
            px-8
            pt-8
            xl:px-12
            xl:pt-10
            2xl:px-16
            2xl:pt-12
        "
                    >

                        <div className="flex items-center gap-3">

                            {/* Small Skillio mark */}

                            <div
                                className="
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#c9d9c4]
                    bg-white/70
                    text-[#526a4d]
                    shadow-sm
                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                >
                                    <path
                                        d="M12 20V10"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M12 13C8.5 13 6 10.8 6 7.5C9.8 7.4 12 9.1 12 13Z"
                                    />

                                    <path
                                        d="M12 10C12 6.5 14.4 4.4 18 4.3C18 8 15.5 10 12 10Z"
                                    />
                                </svg>
                            </div>


                            <div
                                className="
                    inline-flex
                    items-center
                    rounded-full
                    border
                    border-[#cbd9c7]
                    bg-white/60
                    px-4
                    py-2
                    backdrop-blur-md
                "
                            >

                                <span
                                    className="
                        text-[10px]
                        font-bold
                        uppercase
                        tracking-[0.15em]
                        text-[#62725e]
                    "
                                >
                                    More skills. Brighter opportunities.
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
        MAIN LEFT CONTENT
    ================================================== */}

                    <div
                        className="
            relative
            z-20
            flex
            flex-1
            flex-col
            px-8
            pb-8
            pt-10
            xl:px-12
            xl:pb-10
            xl:pt-12
            2xl:px-16
        "
                    >

                        {/* =================================================
            HEADLINE
        ================================================== */}

                        <div className="max-w-[540px]">

                            <h1
                                className="
                    text-4xl
                    font-semibold
                    leading-[1.08]
                    tracking-[-0.035em]
                    text-[#263125]
                    xl:text-5xl
                    2xl:text-[56px]
                "
                            >
                                Turn your goals
                                <br />
                                into real progress.
                            </h1>


                            <p
                                className="
                    mt-5
                    max-w-[500px]
                    text-base
                    leading-7
                    text-[#687465]
                    xl:text-lg
                "
                            >
                                Build your career workspace, understand your
                                strengths, close your gaps, and prepare smarter
                                for the opportunities ahead.
                            </p>


                            {/* =================================================
                BENEFITS
            ================================================== */}

                            <div className="mt-7 space-y-3">

                                {[
                                    "Understand your target roles",
                                    "Identify and close skill gaps",
                                    "Get personalized recommendations",
                                    "Prepare with confidence",
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
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-[#73916d]
                                text-white
                            "
                                        >

                                            <svg
                                                viewBox="0 0 20 20"
                                                className="h-3.5 w-3.5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2.5"
                                            >
                                                <path
                                                    d="m5 10 3 3 7-7"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>

                                        </div>


                                        <span
                                            className="
                                text-sm
                                font-medium
                                text-[#596556]
                            "
                                        >
                                            {item}
                                        </span>

                                    </div>

                                ))}

                            </div>

                        </div>


                        {/* =================================================
            ARTWORK AREA
        ================================================== */}

                        <div
                            className="
                relative
                mt-8
                min-h-[390px]
                flex-1
                xl:mt-4
            "
                        >

                            {/* =================================================
                CONNECTION LINES
            ================================================== */}

                            <div
                                className="
                    pointer-events-none
                    absolute
                    left-[18%]
                    top-[35%]
                    h-px
                    w-[58%]
                    rotate-[-12deg]
                    bg-[#b8c9b2]
                "
                            />

                            <div
                                className="
                    pointer-events-none
                    absolute
                    left-[22%]
                    top-[45%]
                    h-px
                    w-[55%]
                    rotate-[14deg]
                    bg-[#b8c9b2]
                "
                            />

                            <div
                                className="
                    pointer-events-none
                    absolute
                    left-[40%]
                    top-[15%]
                    h-[300px]
                    w-px
                    rotate-[38deg]
                    bg-[#c0ceb9]
                "
                            />


                            {/* =================================================
                FLOATING — SKILL MATCH
            ================================================== */}

                            <div
                                className="
                    absolute
                    left-[2%]
                    top-[8%]
                    z-30
                    w-[175px]
                    rotate-[-6deg]
                    rounded-2xl
                    border
                    border-[#d2dfce]
                    bg-white/90
                    p-4
                    shadow-[0_20px_55px_rgba(54,72,49,0.14)]
                    backdrop-blur-xl
                    transition-transform
                    duration-300
                    hover:-translate-y-1
                "
                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p
                                            className="
                                text-[10px]
                                font-bold
                                text-[#344030]
                            "
                                        >
                                            Skill match
                                        </p>

                                        <p
                                            className="
                                mt-1
                                text-[8px]
                                text-[#8a9586]
                            "
                                        >
                                            Strong alignment
                                        </p>

                                    </div>


                                    <div
                                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#e7f0e4]
                            text-[#5f7a59]
                        "
                                    >

                                        <svg
                                            viewBox="0 0 24 24"
                                            className="h-4 w-4"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                        >
                                            <path
                                                d="m7 17 10-10"
                                                strokeLinecap="round"
                                            />

                                            <path
                                                d="M9 7h8v8"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>

                                    </div>

                                </div>


                                <div className="mt-4 flex items-center gap-4">

                                    <div
                                        className="
                            relative
                            h-16
                            w-16
                            rounded-full
                            bg-[#edf3eb]
                        "
                                    >

                                        <div
                                            className="
                                absolute
                                inset-[7px]
                                rounded-full
                                border-[6px]
                                border-[#73916d]
                                border-r-transparent
                            "
                                        />

                                        <span
                                            className="
                                absolute
                                inset-0
                                flex
                                items-center
                                justify-center
                                text-[11px]
                                font-bold
                                text-[#4f674a]
                            "
                                        >
                                            91%
                                        </span>

                                    </div>

                                    <div>

                                        <p className="text-[9px] font-semibold text-[#556251]">
                                            Great fit
                                        </p>

                                        <p className="mt-1 text-[8px] leading-4 text-[#929b8e]">
                                            You're close to
                                            <br />
                                            being ready.
                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                MAIN CAREER JOURNEY CARD
            ================================================== */}

                            <div
                                className="
                    absolute
                    left-1/2
                    top-[28%]
                    z-20
                    w-[min(78%,430px)]
                    -translate-x-1/2
                    rounded-[26px]
                    border
                    border-[#d5e0d2]
                    bg-white/95
                    p-5
                    shadow-[0_25px_70px_rgba(48,63,43,0.15)]
                    backdrop-blur-xl
                    xl:w-[430px]
                "
                            >

                                {/* Header */}

                                <div className="flex items-center justify-between">

                                    <div className="flex items-center gap-3">

                                        <div
                                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#e5eee2]
                                text-[#5c7656]
                            "
                                        >

                                            <svg
                                                viewBox="0 0 24 24"
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1.8"
                                            >
                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="8"
                                                />

                                                <circle
                                                    cx="12"
                                                    cy="12"
                                                    r="3"
                                                />

                                                <path
                                                    d="M12 4v3"
                                                    strokeLinecap="round"
                                                />

                                                <path
                                                    d="M20 12h-3"
                                                    strokeLinecap="round"
                                                />

                                            </svg>

                                        </div>


                                        <div>

                                            <p
                                                className="
                                    text-[11px]
                                    font-bold
                                    text-[#2f392d]
                                "
                                            >
                                                Your career journey
                                            </p>

                                            <p
                                                className="
                                    mt-1
                                    text-[8px]
                                    text-[#899386]
                                "
                                            >
                                                Step by step, towards your goals
                                            </p>

                                        </div>

                                    </div>


                                    <span
                                        className="
                            rounded-full
                            bg-[#e6f0e3]
                            px-2.5
                            py-1
                            text-[8px]
                            font-bold
                            text-[#5c7756]
                        "
                                    >
                                        IN PROGRESS
                                    </span>

                                </div>


                                {/* Progress */}

                                <div className="mt-6">

                                    <div className="flex justify-between">

                                        <span
                                            className="
                                text-[9px]
                                font-semibold
                                text-[#697466]
                            "
                                        >
                                            Preparation level
                                        </span>

                                        <span
                                            className="
                                text-[9px]
                                font-bold
                                text-[#536d4e]
                            "
                                        >
                                            68%
                                        </span>

                                    </div>


                                    <div
                                        className="
                            mt-2
                            h-2
                            overflow-hidden
                            rounded-full
                            bg-[#e8eee6]
                        "
                                    >

                                        <div
                                            className="
                                h-full
                                w-[68%]
                                rounded-full
                                bg-[#789674]
                            "
                                        />

                                    </div>

                                </div>


                                {/* Journey steps */}

                                <div className="mt-7 flex items-start">

                                    {[
                                        ["Profile", true],
                                        ["Skills", true],
                                        ["Improve", false],
                                        ["Ready", false],
                                    ].map(([label, complete], index) => (

                                        <div
                                            key={label}
                                            className="
                                relative
                                flex
                                flex-1
                                flex-col
                                items-center
                            "
                                        >

                                            {index > 0 && (
                                                <div
                                                    className="
                                        absolute
                                        right-1/2
                                        top-4
                                        h-px
                                        w-full
                                        -translate-y-1/2
                                        bg-[#d9e3d6]
                                    "
                                                />
                                            )}


                                            <div
                                                className={`
                                    relative
                                    z-10
                                    flex
                                    h-8
                                    w-8
                                    items-center
                                    justify-center
                                    rounded-full
                                    ${complete
                                                        ? "bg-[#dcead9] text-[#597454]"
                                                        : "border border-[#d6dfd3] bg-[#f8faf7] text-[#9aa497]"
                                                    }
                                `}
                                            >

                                                {complete ? (
                                                    <svg
                                                        viewBox="0 0 20 20"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2.5"
                                                    >
                                                        <path
                                                            d="m5 10 3 3 7-7"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                        />
                                                    </svg>
                                                ) : (
                                                    index + 1
                                                )}

                                            </div>


                                            <span
                                                className="
                                    mt-2
                                    text-[8px]
                                    font-medium
                                    text-[#7b8578]
                                "
                                            >
                                                {label}
                                            </span>

                                        </div>

                                    ))}

                                </div>


                                {/* Bottom status */}

                                <div
                                    className="
                        mt-6
                        flex
                        items-center
                        justify-between
                        rounded-xl
                        bg-[#f1f5ef]
                        px-4
                        py-3
                    "
                                >

                                    <div className="flex items-center gap-2">

                                        <span
                                            className="
                                h-2
                                w-2
                                rounded-full
                                bg-[#769471]
                                shadow-[0_0_0_4px_rgba(118,148,113,0.10)]
                            "
                                        />

                                        <span
                                            className="
                                text-[9px]
                                font-medium
                                text-[#697466]
                            "
                                        >
                                            Building momentum
                                        </span>

                                    </div>


                                    <ArrowRight
                                        size={14}
                                        className="text-[#81917d]"
                                    />

                                </div>

                            </div>


                            {/* =================================================
                FLOATING — SKILL GROWTH
            ================================================== */}

                            <div
                                className="
                    absolute
                    bottom-[5%]
                    left-[4%]
                    z-30
                    w-[175px]
                    rotate-[4deg]
                    rounded-2xl
                    border
                    border-[#d4e0d1]
                    bg-white/95
                    p-4
                    shadow-[0_18px_50px_rgba(48,63,43,0.13)]
                    backdrop-blur-xl
                "
                            >

                                <div className="flex items-start justify-between">

                                    <div>

                                        <p
                                            className="
                                text-[9px]
                                font-bold
                                text-[#354032]
                            "
                                        >
                                            Skill growth
                                        </p>

                                        <p
                                            className="
                                mt-1
                                text-[8px]
                                text-[#899286]
                            "
                                        >
                                            This month
                                        </p>

                                    </div>


                                    <span
                                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#e7f0e4]
                            text-[#5d7658]
                        "
                                    >
                                        ↑
                                    </span>

                                </div>


                                <div className="mt-3 flex items-end gap-1.5">

                                    {[25, 34, 43, 54, 67, 80].map(
                                        (height, index) => (

                                            <div
                                                key={index}
                                                className="
                                    flex-1
                                    rounded-t-md
                                    bg-[#a9bea3]
                                "
                                                style={{
                                                    height: `${height}px`,
                                                    opacity:
                                                        0.35 +
                                                        index * 0.1,
                                                }}
                                            />

                                        )
                                    )}

                                </div>


                                <div className="mt-2 flex items-center justify-between">

                                    <span className="text-[8px] text-[#8a9487]">
                                        Overall improvement
                                    </span>

                                    <span className="text-[9px] font-bold text-[#597254]">
                                        +62%
                                    </span>

                                </div>

                            </div>


                            {/* =================================================
                FLOATING — INTERVIEW READINESS
            ================================================== */}

                            <div
                                className="
                    absolute
                    bottom-[3%]
                    right-[1%]
                    z-30
                    w-[190px]
                    rotate-[-5deg]
                    rounded-2xl
                    border
                    border-[#d5e0d2]
                    bg-white/95
                    p-4
                    shadow-[0_20px_55px_rgba(48,63,43,0.13)]
                    backdrop-blur-xl
                "
                            >

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p
                                            className="
                                text-[9px]
                                font-bold
                                text-[#354032]
                            "
                                        >
                                            Interview readiness
                                        </p>

                                        <p
                                            className="
                                mt-1
                                text-[8px]
                                text-[#899286]
                            "
                                        >
                                            Keep practicing
                                        </p>

                                    </div>


                                    <div
                                        className="
                            flex
                            h-7
                            w-7
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#e8f0e5]
                            text-[#5e7758]
                        "
                                    >
                                        <ArrowRight size={13} />
                                    </div>

                                </div>


                                {/* Mini chart */}

                                <div className="relative mt-4 h-12">

                                    <svg
                                        viewBox="0 0 190 48"
                                        className="h-full w-full"
                                        preserveAspectRatio="none"
                                    >

                                        <path
                                            d="
                                M0 39
                                C15 37 20 30 34 33
                                C48 36 55 20 69 25
                                C83 30 89 13 105 18
                                C120 23 129 29 141 17
                                C154 5 165 18 174 12
                                C181 8 185 9 190 5
                                L190 48
                                L0 48
                                Z
                            "
                                            fill="#e7f0e4"
                                        />

                                        <path
                                            d="
                                M0 39
                                C15 37 20 30 34 33
                                C48 36 55 20 69 25
                                C83 30 89 13 105 18
                                C120 23 129 29 141 17
                                C154 5 165 18 174 12
                                C181 8 185 9 190 5
                            "
                                            fill="none"
                                            stroke="#779472"
                                            strokeWidth="2"
                                        />

                                    </svg>

                                </div>

                            </div>


                            {/* =================================================
                DECORATIVE TARGET
            ================================================== */}

                            <div
                                className="
                    absolute
                    right-[14%]
                    top-[3%]
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-full
                    bg-[#e3ede0]
                    text-[#5d7757]
                    shadow-sm
                "
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-6 w-6"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="8"
                                    />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="4"
                                    />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="1.5"
                                        fill="currentColor"
                                    />

                                </svg>

                            </div>


                            {/* =================================================
                DECORATIVE LIGHTBULB
            ================================================== */}

                            <div
                                className="
                    absolute
                    right-[8%]
                    bottom-[31%]
                    flex
                    h-11
                    w-11
                    items-center
                    justify-center
                    rounded-full
                    bg-[#e2eddf]
                    text-[#60795b]
                "
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-5 w-5"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                >
                                    <path
                                        d="
                            M9 18h6
                            M10 21h4
                            M8.5 14.5
                            C7.5 13.4 7 12 7 10.5
                            A5 5 0 0 1 17 10.5
                            C17 12 16.5 13.4 15.5 14.5
                            C15 15.1 15 16 15 17
                            H9
                            C9 16 9 15.1 8.5 14.5Z
                        "
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>

                            </div>


                            {/* =================================================
                DECORATIVE DOTS
            ================================================== */}

                            <span
                                className="
                    absolute
                    left-[20%]
                    bottom-[2%]
                    h-3
                    w-3
                    rounded-full
                    bg-[#789674]
                    shadow-[0_0_0_8px_rgba(120,150,116,0.12)]
                "
                            />

                            <span
                                className="
                    absolute
                    left-[72%]
                    top-[22%]
                    h-2
                    w-2
                    rounded-full
                    bg-[#91a68b]
                "
                            />

                        </div>


                        {/* =================================================
            BOTTOM MESSAGE
        ================================================== */}

                        <div
                            className="
                relative
                z-30
                flex
                items-center
                justify-between
                gap-5
            "
                        >

                            <div
                                className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-[#cbdac7]
                    bg-white/65
                    px-4
                    py-2.5
                    backdrop-blur-md
                "
                            >

                                <svg
                                    viewBox="0 0 24 24"
                                    className="h-4 w-4 text-[#627b5c]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.7"
                                >
                                    <path
                                        d="M12 20V10"
                                        strokeLinecap="round"
                                    />

                                    <path
                                        d="M12 13C8.5 13 6 10.8 6 7.5C9.8 7.4 12 9.1 12 13Z"
                                    />

                                    <path
                                        d="M12 10C12 6.5 14.4 4.4 18 4.3C18 8 15.5 10 12 10Z"
                                    />
                                </svg>


                                <span
                                    className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.13em]
                        text-[#60705c]
                    "
                                >
                                    A smarter career journey starts here
                                </span>

                            </div>


                            {/* Handwritten-style decorative text */}

                            <div
                                className="
                    hidden
                    rotate-[-5deg]
                    text-right
                    text-[13px]
                    leading-5
                    text-[#758271]
                    xl:block
                "
                            >
                                Better
                                <br />
                                opportunities
                                <br />
                                await →
                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    RIGHT — REGISTER
                ====================================================== */}

                <section
                    className="
                        flex
                        min-h-[100dvh]
                        w-full
                        flex-col
                        overflow-hidden
                        bg-[var(--surface)]
                    "
                >

                    {/* =================================================
                        FORM AREA
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
                            md:px-10
                            lg:px-10
                            xl:px-14
                            2xl:px-16
                        "
                    >

                        <div
                            className="
                                w-full
                                max-w-[470px]
                            "
                        >

                            {/* =================================================
                                BRAND
                            ================================================== */}

                            <div className="mb-8 sm:mb-9">

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
                                        mt-2
                                        text-[10px]
                                        font-medium
                                        uppercase
                                        tracking-[0.08em]
                                        text-[var(--on-surface-variant)]
                                        sm:text-label-sm
                                    "
                                >
                                    AI-powered career workspace
                                </p>

                            </div>


                            {/* =================================================
                                HEADER
                            ================================================== */}

                            <div className="mb-7 sm:mb-8">

                                <h2
                                    className="
                                        text-headline-lg-mobile
                                        font-semibold
                                        tracking-tight
                                        text-[var(--on-surface)]
                                        sm:text-headline-lg
                                    "
                                >
                                    Create your account
                                </h2>


                                <p
                                    className="
                                        mt-2
                                        max-w-[430px]
                                        text-body-md
                                        leading-6
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    Build your career workspace and
                                    start preparing smarter.
                                </p>

                            </div>


                            {/* =================================================
                                GOOGLE
                            ================================================== */}

                            <GoogleAuthButton />


                            {/* =================================================
                                DIVIDER
                            ================================================== */}

                            <div
                                className="
                                    my-7
                                    flex
                                    items-center
                                    sm:my-8
                                "
                            >

                                <div
                                    className="
                                        h-px
                                        flex-1
                                        bg-[var(--outline-variant)]
                                    "
                                />


                                <span
                                    className="
                                        px-4
                                        text-[10px]
                                        font-medium
                                        tracking-wide
                                        text-[var(--on-surface-variant)]
                                        sm:text-label-sm
                                    "
                                >
                                    OR
                                </span>


                                <div
                                    className="
                                        h-px
                                        flex-1
                                        bg-[var(--outline-variant)]
                                    "
                                />

                            </div>


                            {/* =================================================
                                REGISTER FORM
                            ================================================== */}

                            <form
                                onSubmit={handleSubmit}
                                noValidate
                                className="
                                    flex
                                    flex-col
                                    gap-5
                                "
                            >

                                {/* =================================================
                                    NAME
                                ================================================== */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-2
                                    "
                                >

                                    <label
                                        htmlFor="name"
                                        className="
                                            text-label-md
                                            font-medium
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Full name
                                    </label>


                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your full name"
                                        autoComplete="name"
                                        maxLength={50}
                                        disabled={isLoading}
                                        className="
                                            skillio-input
                                            h-12
                                            w-full
                                        "
                                    />

                                </div>


                                {/* =================================================
                                    EMAIL
                                ================================================== */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-2
                                    "
                                >

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


                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="you@example.com"
                                        autoComplete="email"
                                        inputMode="email"
                                        disabled={isLoading}
                                        className="
                                            skillio-input
                                            h-12
                                            w-full
                                        "
                                    />

                                </div>


                                {/* =================================================
                                    PASSWORD
                                ================================================== */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-2
                                    "
                                >

                                    <label
                                        htmlFor="password"
                                        className="
                                            text-label-md
                                            font-medium
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Password
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
                                            placeholder="Create a password"
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                            className="
                                                skillio-input
                                                h-12
                                                w-full
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
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-r-xl
                                                text-[var(--on-surface-variant)]
                                                transition-colors
                                                hover:text-[var(--primary)]
                                                disabled:cursor-not-allowed
                                            "
                                        >

                                            {showPassword ? (
                                                <EyeOff size={19} />
                                            ) : (
                                                <Eye size={19} />
                                            )}

                                        </button>

                                    </div>


                                    <PasswordStrength
                                        password={formData.password}
                                    />

                                </div>


                                {/* =================================================
                                    CONFIRM PASSWORD
                                ================================================== */}

                                <div
                                    className="
                                        flex
                                        flex-col
                                        gap-2
                                    "
                                >

                                    <label
                                        htmlFor="confirmPassword"
                                        className="
                                            text-label-md
                                            font-medium
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Confirm password
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
                                            placeholder="Confirm your password"
                                            autoComplete="new-password"
                                            disabled={isLoading}
                                            className="
                                                skillio-input
                                                h-12
                                                w-full
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
                                                h-12
                                                w-12
                                                items-center
                                                justify-center
                                                rounded-r-xl
                                                text-[var(--on-surface-variant)]
                                                transition-colors
                                                hover:text-[var(--primary)]
                                                disabled:cursor-not-allowed
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

                                        <div
                                            className={`
                                                flex
                                                items-center
                                                gap-1.5
                                                text-label-sm
                                                ${formData.password ===
                                                    formData.confirmPassword
                                                    ? "text-[var(--primary)]"
                                                    : "text-[var(--error)]"
                                                }
                                            `}
                                        >

                                            {formData.password ===
                                                formData.confirmPassword ? (

                                                <>
                                                    <CheckCircle2 size={14} />
                                                    Passwords match
                                                </>

                                            ) : (

                                                <>
                                                    Passwords do not match
                                                </>

                                            )}

                                        </div>

                                    )}

                                </div>


                                {/* =================================================
                                    SUBMIT
                                ================================================== */}

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="
                                        skillio-primary-button
                                        mt-1
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

                                            Creating your account...

                                        </>

                                    ) : (

                                        "Create account"

                                    )}

                                </button>

                            </form>


                            {/* =================================================
                                LOGIN
                            ================================================== */}

                            <p
                                className="
                                    mt-7
                                    text-center
                                    text-body-md
                                    leading-6
                                    text-[var(--on-surface-variant)]
                                    sm:mt-8
                                "
                            >

                                Already have a Skillio account?{" "}


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
                                    Log in
                                </Link>

                            </p>

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
                            sm:px-8
                            sm:pb-7
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
                                    text-center
                                    text-[10px]
                                    leading-5
                                    text-[var(--on-surface-variant)]
                                    sm:text-label-sm
                                "
                            >
                                Your account and career data are
                                securely protected.
                            </p>


                            <div
                                className="
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-center
                                    gap-3
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
                                    © 2026 Skillio
                                </span>

                            </div>

                        </div>

                    </footer>

                </section>

            </div>

        </main>
    );
};


export default Register;