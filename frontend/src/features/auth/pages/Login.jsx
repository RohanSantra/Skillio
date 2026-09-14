import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
    ArrowRight,
    Check,
    CheckCircle2,
    CircleDot,
    Eye,
    EyeOff,
    Loader2,
    ShieldCheck,
    Sparkles,
    Target,
    TrendingUp,
} from "lucide-react";

import { toast } from "sonner";

import useAuth from "../hooks/useAuth.js";

import GoogleAuthButton from "../components/GoogleAuthButton.jsx";
import SkillioLogo from "../../../components/SkillioLogo.jsx";



const Login = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const { login } = useAuth();


    // =========================================================
    // STATE
    // =========================================================

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

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
    // LOGIN
    // =========================================================

    const handleSubmit = async (event) => {

        event.preventDefault();


        const email = formData.email.trim();
        const password = formData.password;


        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (!email) {

            toast.error(
                "Please enter your email address."
            );

            return;
        }


        if (!password) {

            toast.error(
                "Please enter your password."
            );

            return;
        }


        // -----------------------------------------------------
        // REQUEST
        // -----------------------------------------------------

        try {

            setIsLoading(true);


            await login({
                email,
                password,
            });


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            toast.success(
                "Welcome back!"
            );


            const redirectTo =
                location.state?.from?.pathname ||
                "/dashboard";


            navigate(
                redirectTo,
                {
                    replace: true,
                }
            );

        } catch (error) {

            const message =
                error?.response?.data?.message ||
                "Unable to sign in. Please check your credentials and try again.";


            toast.error(message);

        } finally {

            setIsLoading(false);

        }

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
                    LEFT — CAREER WORKSPACE ARTWORK
                ====================================================== */}

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
                        BACKGROUND GLOWS
                    ================================================== */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -left-[18%]
                            -top-[12%]
                            h-[45%]
                            w-[45%]
                            rounded-full
                            bg-[#d3e1ce]
                            opacity-80
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -bottom-[18%]
                            -right-[12%]
                            h-[50%]
                            w-[50%]
                            rounded-full
                            bg-[#dbe7d7]
                            opacity-90
                            blur-3xl
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            left-[35%]
                            top-[20%]
                            h-[28%]
                            w-[28%]
                            rounded-full
                            bg-[#e4ece0]
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
                            opacity-45
                        "
                        style={{
                            backgroundImage:
                                "radial-gradient(#9eaf99 1px, transparent 1px)",
                            backgroundSize:
                                "24px 24px",
                        }}
                    />


                    {/* =================================================
                        LARGE ABSTRACT RINGS
                    ================================================== */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-[8%]
                            top-[12%]
                            aspect-square
                            w-[24%]
                            rounded-full
                            border-[18px]
                            border-[#d7e3d3]
                            opacity-80
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -left-[9%]
                            bottom-[14%]
                            aspect-square
                            w-[27%]
                            rounded-full
                            border-[24px]
                            border-[#dce7d9]
                            opacity-90
                        "
                    />


                    {/* =================================================
                        ORBIT SYSTEM
                    ================================================== */}

                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-[12%]
                            top-[13%]
                            aspect-square
                            w-[14%]
                            rounded-full
                            border
                            border-[#aebaad]
                            opacity-60
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-[15%]
                            top-[16%]
                            aspect-square
                            w-[8%]
                            rounded-full
                            border
                            border-dashed
                            border-[#aebaad]
                            opacity-60
                        "
                    />

                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-[18.5%]
                            top-[19.5%]
                            h-2
                            w-2
                            rounded-full
                            bg-[#71896b]
                            shadow-[0_0_0_7px_rgba(113,137,107,0.12)]
                        "
                    />


                    {/* =================================================
                        MAIN ARTWORK AREA

                        Uses vw-based sizing so it never grows
                        uncontrollably on large screens.
                    ================================================== */}

                    <div
                        className="
                            absolute
                            left-1/2
                            top-[46%]
                            aspect-square
                            w-[min(44vw,680px)]
                            -translate-x-1/2
                            -translate-y-1/2
                        "
                    >


                        {/* =================================================
                            CONNECTION LINES
                        ================================================== */}

                        <div
                            className="
                                absolute
                                left-[16%]
                                top-[43%]
                                h-px
                                w-[68%]
                                rotate-[-15deg]
                                bg-[#b5c4b0]
                            "
                        />

                        <div
                            className="
                                absolute
                                left-[20%]
                                top-[48%]
                                h-px
                                w-[62%]
                                rotate-[18deg]
                                bg-[#b5c4b0]
                            "
                        />

                        <div
                            className="
                                absolute
                                left-[48%]
                                top-[18%]
                                h-[64%]
                                w-px
                                rotate-[25deg]
                                bg-[#b5c4b0]
                            "
                        />


                        {/* =================================================
                            ORBIT RING BEHIND CARD
                        ================================================== */}

                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                aspect-square
                                w-[72%]
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full
                                border
                                border-[#c5d2c0]
                                opacity-70
                            "
                        />

                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                aspect-square
                                w-[86%]
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full
                                border
                                border-dashed
                                border-[#d0dbcc]
                                opacity-80
                            "
                        />


                        {/* =================================================
                            CENTRAL DASHBOARD
                        ================================================== */}

                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                z-20
                                w-[53%]
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-[28px]
                                border
                                border-[#d3ded0]
                                bg-white/95
                                p-[4.5%]
                                shadow-[0_30px_80px_rgba(50,67,45,0.16)]
                                backdrop-blur-xl
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
                                        min-w-0
                                        items-center
                                        gap-3
                                    "
                                >

                                    <div
                                        className="
                                            flex
                                            aspect-square
                                            w-10
                                            shrink-0
                                            items-center
                                            justify-center
                                            rounded-xl
                                            bg-[#e5eee2]
                                            text-[#526d4c]
                                        "
                                    >

                                        <Sparkles size={18} />

                                    </div>


                                    <div className="min-w-0">

                                        <p
                                            className="
                                                truncate
                                                text-[11px]
                                                font-bold
                                                text-[#293328]
                                            "
                                        >
                                            Skillio workspace
                                        </p>

                                        <p
                                            className="
                                                mt-0.5
                                                truncate
                                                text-[9px]
                                                text-[#7b8678]
                                            "
                                        >
                                            AI career preparation
                                        </p>

                                    </div>

                                </div>


                                <span
                                    className="
                                        shrink-0
                                        rounded-full
                                        bg-[#e7f1e4]
                                        px-2.5
                                        py-1
                                        text-[8px]
                                        font-bold
                                        text-[#567052]
                                    "
                                >
                                    READY
                                </span>

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
                                            text-[#687365]
                                        "
                                    >
                                        Career readiness
                                    </span>

                                    <span
                                        className="
                                            text-[10px]
                                            font-bold
                                            text-[#4d6748]
                                        "
                                    >
                                        82%
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
                                            w-[82%]
                                            rounded-full
                                            bg-[#789471]
                                        "
                                    />

                                </div>

                            </div>


                            {/* Journey */}

                            <div
                                className="
                                    mt-6
                                    grid
                                    grid-cols-5
                                    gap-1
                                "
                            >

                                {[
                                    "Understand",
                                    "Match",
                                    "Improve",
                                    "Prepare",
                                    "Practice",
                                ].map((item, index) => {

                                    const completed =
                                        index < 3;


                                    return (

                                        <div
                                            key={item}
                                            className="
                                                flex
                                                flex-col
                                                items-center
                                                gap-2
                                            "
                                        >

                                            <div
                                                className={`
                                                    flex
                                                    h-8
                                                    w-8
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    text-[9px]
                                                    font-bold
                                                    ${completed
                                                        ? "bg-[#dce9d8] text-[#55704f]"
                                                        : "border border-[#d6dfd2] bg-[#f8faf7] text-[#9ba498]"
                                                    }
                                                `}
                                            >

                                                {completed ? (
                                                    <Check size={14} />
                                                ) : (
                                                    index + 1
                                                )}

                                            </div>


                                            <span
                                                className="
                                                    text-center
                                                    text-[7px]
                                                    font-medium
                                                    leading-tight
                                                    text-[#7c8678]
                                                "
                                            >
                                                {item}
                                            </span>

                                        </div>

                                    );

                                })}

                            </div>


                            {/* Bottom insight */}

                            <div
                                className="
                                    mt-6
                                    flex
                                    items-center
                                    gap-3
                                    rounded-xl
                                    bg-[#f4f7f2]
                                    p-3
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[#e2ecdf]
                                        text-[#5d7757]
                                    "
                                >

                                    <TrendingUp size={15} />

                                </div>


                                <div className="min-w-0">

                                    <p
                                        className="
                                            text-[9px]
                                            font-bold
                                            text-[#3e4c3a]
                                        "
                                    >
                                        You're getting closer
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-[8px]
                                            leading-4
                                            text-[#7d8779]
                                        "
                                    >
                                        3 areas improved this week
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FLOATING CARD — ROLE MATCH
                        ================================================== */}

                        <div
                            className="
                                absolute
                                left-[1%]
                                top-[17%]
                                z-30
                                w-[31%]
                                rotate-[-7deg]
                                rounded-2xl
                                border
                                border-[#d5e0d2]
                                bg-white/95
                                p-[4%]
                                shadow-[0_20px_50px_rgba(48,63,43,0.13)]
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
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[#e6efe3]
                                        text-[#587253]
                                    "
                                >

                                    <Target size={15} />

                                </div>


                                <div className="min-w-0">

                                    <p
                                        className="
                                            truncate
                                            text-[9px]
                                            font-bold
                                            text-[#30392e]
                                        "
                                    >
                                        Role match
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            truncate
                                            text-[8px]
                                            text-[#899286]
                                        "
                                    >
                                        Strong alignment
                                    </p>

                                </div>

                            </div>


                            <div className="mt-4">

                                <div
                                    className="
                                        flex
                                        justify-between
                                    "
                                >

                                    <span
                                        className="
                                            text-[8px]
                                            text-[#7f897c]
                                        "
                                    >
                                        Compatibility
                                    </span>

                                    <span
                                        className="
                                            text-[8px]
                                            font-bold
                                            text-[#56704f]
                                        "
                                    >
                                        91%
                                    </span>

                                </div>


                                <div
                                    className="
                                        mt-1.5
                                        h-1.5
                                        rounded-full
                                        bg-[#e9eee7]
                                    "
                                >

                                    <div
                                        className="
                                            h-full
                                            w-[91%]
                                            rounded-full
                                            bg-[#7d9977]
                                        "
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FLOATING CARD — AI INSIGHT
                        ================================================== */}

                        <div
                            className="
                                absolute
                                right-[0%]
                                top-[8%]
                                z-30
                                w-[28%]
                                rotate-[6deg]
                                rounded-2xl
                                border
                                border-[#d5e0d2]
                                bg-white/95
                                p-[4%]
                                shadow-[0_20px_50px_rgba(48,63,43,0.12)]
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
                                        h-8
                                        w-8
                                        shrink-0
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[#edf3ea]
                                        text-[#63795e]
                                    "
                                >

                                    <Sparkles size={14} />

                                </div>


                                <div>

                                    <p
                                        className="
                                            text-[9px]
                                            font-bold
                                            text-[#30392e]
                                        "
                                    >
                                        AI insight
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-[8px]
                                            text-[#899286]
                                        "
                                    >
                                        Personalized
                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    mt-3
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <CircleDot
                                    size={12}
                                    className="text-[#6f8969]"
                                />

                                <span
                                    className="
                                        text-[8px]
                                        font-medium
                                        text-[#687365]
                                    "
                                >
                                    Interview readiness
                                </span>

                            </div>

                        </div>


                        {/* =================================================
                            FLOATING CARD — SKILL GAPS
                        ================================================== */}

                        <div
                            className="
                                absolute
                                bottom-[4%]
                                right-[1%]
                                z-30
                                w-[32%]
                                rotate-[5deg]
                                rounded-2xl
                                border
                                border-[#d5e0d2]
                                bg-white/95
                                p-[4%]
                                shadow-[0_20px_50px_rgba(48,63,43,0.12)]
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
                                        Skill gaps
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-[8px]
                                            text-[#899286]
                                        "
                                    >
                                        Areas to improve
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
                                        bg-[#f0f3ed]
                                        text-[#63745e]
                                    "
                                >

                                    <ArrowRight size={14} />

                                </div>

                            </div>


                            <div className="mt-4 space-y-2">

                                {[
                                    ["Communication", "Strong"],
                                    ["System design", "Improve"],
                                    ["Interview", "Ready"],
                                ].map(
                                    ([skill, status]) => (

                                        <div
                                            key={skill}
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                gap-2
                                            "
                                        >

                                            <span
                                                className="
                                                    truncate
                                                    text-[8px]
                                                    text-[#707a6d]
                                                "
                                            >
                                                {skill}
                                            </span>


                                            <span
                                                className={`
                                                    shrink-0
                                                    rounded-full
                                                    px-2
                                                    py-0.5
                                                    text-[7px]
                                                    font-bold
                                                    ${status ===
                                                        "Strong"
                                                        ? "bg-[#e5eee2] text-[#5d7657]"
                                                        : status ===
                                                            "Ready"
                                                            ? "bg-[#e9f0e7] text-[#5b7255]"
                                                            : "bg-[#f1f2ed] text-[#777f71]"
                                                    }
                                                `}
                                            >
                                                {status}
                                            </span>

                                        </div>

                                    )
                                )}

                            </div>

                        </div>


                        {/* =================================================
                            SMALL DECORATIVE POINTS
                        ================================================== */}

                        <div
                            className="
                                absolute
                                bottom-[12%]
                                left-[11%]
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
                                right-[11%]
                                bottom-[22%]
                                h-2
                                w-2
                                rounded-full
                                bg-[#91a78b]
                            "
                        />

                        <div
                            className="
                                absolute
                                left-[18%]
                                top-[4%]
                                h-2
                                w-2
                                rounded-full
                                bg-[#a2b49d]
                            "
                        />

                    </div>


                    {/* =================================================
                        LEFT TEXT
                    ================================================== */}

                    <div
                        className="
                            absolute
                            bottom-0
                            left-0
                            z-40
                            w-full
                            p-8
                            xl:p-12
                            2xl:p-14
                        "
                    >

                        <div
                            className="
                                max-w-[620px]
                            "
                        >

                            {/* Label */}

                            <div
                                className="
                                    mb-4
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

                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-[#6f8d69]
                                    "
                                />

                                <span
                                    className="
                                        text-[10px]
                                        font-bold
                                        uppercase
                                        tracking-[0.16em]
                                        text-[#60705c]
                                    "
                                >
                                    Prepare with purpose
                                </span>

                            </div>


                            {/* Heading */}

                            <h1
                                className="
                                    max-w-[600px]
                                    text-display-lg
                                    !text-[#253024]
                                "
                            >
                                Turn preparation into your next opportunity.
                            </h1>


                            {/* Description */}

                            <p
                                className="
                                    mt-4
                                    max-w-[560px]
                                    text-body-lg
                                    !text-[#687265]
                                "
                            >
                                Understand the role. Know your fit. Close
                                your gaps. Get ready with Skillio.
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
                                    "Understand",
                                    "Match",
                                    "Improve",
                                    "Prepare",
                                    "Practice",
                                ].map(
                                    (item, index) => (

                                        <div
                                            key={item}
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >

                                            <span
                                                className="
                                                    text-[10px]
                                                    font-semibold
                                                    text-[#667061]
                                                "
                                            >
                                                {item}
                                            </span>


                                            {index < 4 && (

                                                <ArrowRight
                                                    size={13}
                                                    className="
                                                        text-[#9ba697]
                                                    "
                                                />

                                            )}

                                        </div>

                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </section>


                {/* =====================================================
                    RIGHT — LOGIN
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
                    "
                >

                    {/* =================================================
                        MAIN
                    ================================================== */}

                    <div
                        className="
                            flex
                            flex-1
                            w-full
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
                                max-w-[470px]
                            "
                        >

                            {/* =================================================
                                BRAND
                            ================================================== */}

                            <div
                                className="
                                    mb-10
                                    sm:mb-12
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
                                        focus-visible:ring-2
                                        focus-visible:ring-[var(--primary)]
                                        focus-visible:ring-offset-2
                                    "
                                >

                                    <SkillioLogo size={150} />

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

                            <div
                                className="
                                    mb-8
                                    sm:mb-9
                                "
                            >

                                <h2
                                    className="
                                        text-headline-lg-mobile
                                        font-semibold
                                        tracking-tight
                                        text-[var(--on-surface)]
                                        sm:text-headline-lg
                                    "
                                >
                                    Welcome back
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
                                    Continue preparing for the
                                    opportunities that matter.
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
                                FORM
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
                                            placeholder="Enter your password"
                                            autoComplete="current-password"
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

                                </div>


                                {/* =================================================
                                    FORGOT PASSWORD
                                ================================================== */}

                                <div
                                    className="
                                        -mt-1
                                        flex
                                        justify-end
                                    "
                                >

                                    <Link
                                        to="/forgot-password"
                                        className="
                                            text-label-md
                                            font-medium
                                            text-[var(--secondary)]
                                            transition-colors
                                            hover:text-[var(--primary)]
                                            hover:underline
                                            underline-offset-4
                                        "
                                    >
                                        Forgot password?
                                    </Link>

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

                                            Signing you in...

                                        </>

                                    ) : (

                                        "Log in"

                                    )}

                                </button>

                            </form>


                            {/* =================================================
                                REGISTER
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

                                Don't have a Skillio account?{" "}

                                <Link
                                    to="/register"
                                    className="
                                        font-semibold
                                        text-[var(--primary)]
                                        transition-colors
                                        hover:text-[var(--secondary)]
                                        hover:underline
                                        underline-offset-4
                                    "
                                >
                                    Create an account
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
                                Your account and career data are securely
                                protected.
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


export default Login;