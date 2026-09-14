import { Link, useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    ArrowRight,
    Compass,
    Home,
    Search,
    Sparkles,
} from "lucide-react";

import SkillioLogo from "../../../components/SkillioLogo";


const NotFound = () => {
    const navigate = useNavigate();

    return (
        <main className="min-h-screen w-full overflow-hidden bg-[var(--background)] text-[var(--on-background)]">

            {/* =====================================================
                BACKGROUND
            ====================================================== */}

            <div className="pointer-events-none fixed inset-0 overflow-hidden">

                <div
                    className="
                        absolute
                        -left-40
                        -top-40
                        h-[500px]
                        w-[500px]
                        rounded-full
                        bg-[var(--primary-container)]
                        opacity-40
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        -bottom-40
                        -right-40
                        h-[500px]
                        w-[500px]
                        rounded-full
                        bg-[var(--secondary-container)]
                        opacity-40
                        blur-3xl
                    "
                />

                {/* subtle grid */}

                <div
                    className="
                        absolute
                        inset-0
                        opacity-[0.025]
                    "
                    style={{
                        backgroundImage:
                            `
                            linear-gradient(var(--on-background) 1px, transparent 1px),
                            linear-gradient(90deg, var(--on-background) 1px, transparent 1px)
                            `,
                        backgroundSize: "42px 42px",
                    }}
                />

            </div>


            {/* =====================================================
                NAVBAR
            ====================================================== */}

            <header
                className="
                    relative
                    z-20
                    flex
                    w-full
                    items-center
                    justify-between
                    px-6
                    py-6
                    sm:px-10
                    lg:px-14
                    xl:px-20
                "
            >

                {/* Logo */}

                <Link
                    to="/"
                    aria-label="Skillio home"
                    className="
                        inline-flex
                        items-center
                        rounded-lg
                        outline-none
                        transition-transform
                        hover:scale-[1.02]
                    "
                >
                    <SkillioLogo/>
                </Link>


                {/* Home button */}

                <Link
                    to="/"
                    className="
                        group
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface)]/70
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-[var(--on-surface)]
                        shadow-sm
                        backdrop-blur-md
                        transition-all
                        hover:-translate-y-0.5
                        hover:bg-[var(--surface)]
                        hover:shadow-md
                    "
                >
                    <Home
                        size={17}
                        className="
                            text-[var(--primary)]
                            transition-transform
                            group-hover:scale-110
                        "
                    />

                    <span className="hidden sm:inline">
                        Back home
                    </span>
                </Link>

            </header>


            {/* =====================================================
                MAIN
            ====================================================== */}

            <section
                className="
                    relative
                    z-10
                    flex
                    min-h-[calc(100vh-88px)]
                    items-center
                    px-6
                    pb-12
                    pt-4
                    sm:px-10
                    lg:px-14
                    xl:px-20
                "
            >

                <div
                    className="
                        mx-auto
                        grid
                        w-full
                        max-w-[1400px]
                        items-center
                        gap-12
                        lg:grid-cols-[0.9fr_1.1fr]
                        lg:gap-16
                        xl:gap-24
                    "
                >


                    {/* =================================================
                        LEFT — CONTENT
                    ================================================== */}

                    <div
                        className="
                            order-2
                            mx-auto
                            w-full
                            max-w-[560px]
                            text-center
                            lg:order-1
                            lg:mx-0
                            lg:text-left
                        "
                    >

                        {/* Small badge */}

                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface)]
                                px-4
                                py-2
                                text-label-sm
                                font-semibold
                                text-[var(--primary)]
                                shadow-sm
                            "
                        >

                            <Compass size={16} />

                            <span>
                                WRONG TURN?
                            </span>

                        </div>


                        {/* 404 */}

                        <div
                            className="
                                mt-7
                                text-[clamp(6rem,16vw,11rem)]
                                font-black
                                leading-[0.8]
                                tracking-[-0.08em]
                                text-[var(--primary)]
                                select-none
                            "
                        >
                            404
                        </div>


                        {/* Heading */}

                        <h1
                            className="
                                mt-8
                                text-[clamp(2rem,4vw,3.5rem)]
                                font-semibold
                                leading-[1.08]
                                tracking-[-0.035em]
                                text-[var(--on-surface)]
                            "
                        >
                            Looks like you've
                            <span className="text-[var(--primary)]">
                                {" "}taken a wrong turn.
                            </span>
                        </h1>


                        {/* Description */}

                        <p
                            className="
                                mx-auto
                                mt-5
                                max-w-[500px]
                                text-body-lg
                                leading-8
                                text-[var(--on-surface-variant)]
                                lg:mx-0
                            "
                        >
                            The page you're looking for doesn't exist or
                            may have moved. Don't worry — your career
                            journey is still on track.
                        </p>


                        {/* Actions */}

                        <div
                            className="
                                mt-9
                                flex
                                flex-col
                                justify-center
                                gap-3
                                sm:flex-row
                                lg:justify-start
                            "
                        >

                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="
                                    inline-flex
                                    h-12
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[var(--outline-variant)]
                                    bg-[var(--surface)]
                                    px-6
                                    text-sm
                                    font-semibold
                                    text-[var(--on-surface)]
                                    shadow-sm
                                    transition-all
                                    hover:-translate-y-0.5
                                    hover:shadow-md
                                "
                            >

                                <ArrowLeft size={18} />

                                Go back

                            </button>


                            <Link
                                to="/"
                                className="
                                    skillio-primary-button
                                    !mt-0
                                    h-12
                                    px-6
                                "
                            >

                                Take me home

                                <ArrowRight size={18} />

                            </Link>

                        </div>


                        {/* Helpful links */}

                        <div
                            className="
                                mt-9
                                flex
                                flex-wrap
                                items-center
                                justify-center
                                gap-x-6
                                gap-y-3
                                text-label-sm
                                text-[var(--on-surface-variant)]
                                lg:justify-start
                            "
                        >

                            <span className="font-medium">
                                Maybe you were looking for:
                            </span>

                            <Link
                                to="/login"
                                className="
                                    font-semibold
                                    text-[var(--primary)]
                                    transition-colors
                                    hover:underline
                                "
                            >
                                Login
                            </Link>

                            <Link
                                to="/register"
                                className="
                                    font-semibold
                                    text-[var(--primary)]
                                    transition-colors
                                    hover:underline
                                "
                            >
                                Register
                            </Link>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT — ORIGINAL ARTWORK
                    ================================================== */}

                    <div
                        className="
                            relative
                            order-1
                            flex
                            min-h-[380px]
                            items-center
                            justify-center
                            lg:order-2
                            lg:min-h-[620px]
                        "
                    >

                        {/* =================================================
                            ARTWORK GLOW
                        ================================================== */}

                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                h-[300px]
                                w-[300px]
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full
                                bg-[var(--primary-container)]
                                opacity-60
                                blur-[90px]
                                sm:h-[430px]
                                sm:w-[430px]
                            "
                        />


                        {/* =================================================
                            ORBIT
                        ================================================== */}

                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                h-[270px]
                                w-[270px]
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full
                                border
                                border-[var(--outline-variant)]/50
                                sm:h-[430px]
                                sm:w-[430px]
                            "
                        />

                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                h-[190px]
                                w-[190px]
                                -translate-x-1/2
                                -translate-y-1/2
                                rounded-full
                                border
                                border-dashed
                                border-[var(--outline-variant)]/70
                                sm:h-[310px]
                                sm:w-[310px]
                            "
                        />


                        {/* =================================================
                            FLOATING STARS
                        ================================================== */}

                        <Sparkles
                            size={24}
                            className="
                                absolute
                                left-[13%]
                                top-[18%]
                                animate-pulse
                                text-[var(--primary)]
                            "
                        />

                        <Sparkles
                            size={17}
                            className="
                                absolute
                                right-[14%]
                                top-[27%]
                                animate-pulse
                                text-[var(--secondary)]
                            "
                        />

                        <Sparkles
                            size={20}
                            className="
                                absolute
                                bottom-[18%]
                                left-[18%]
                                animate-pulse
                                text-[var(--primary)]
                            "
                        />


                        {/* =================================================
                            MAIN GLASS CARD
                        ================================================== */}

                        <div
                            className="
                                relative
                                z-10
                                h-[285px]
                                w-[285px]
                                rotate-[-4deg]
                                rounded-[2.5rem]
                                border
                                border-white/60
                                bg-[var(--surface)]/70
                                shadow-[0_35px_100px_rgba(40,55,35,0.14)]
                                backdrop-blur-2xl
                                transition-transform
                                duration-500
                                hover:rotate-0
                                sm:h-[410px]
                                sm:w-[410px]
                            "
                        >

                            {/* Card inner */}

                            <div
                                className="
                                    absolute
                                    inset-3
                                    rounded-[2.1rem]
                                    border
                                    border-[var(--outline-variant)]/40
                                "
                            />


                            {/* =================================================
                                MINI NAVIGATION
                            ================================================== */}

                            <div
                                className="
                                    absolute
                                    left-7
                                    right-7
                                    top-7
                                    flex
                                    items-center
                                    justify-between
                                    sm:left-9
                                    sm:right-9
                                    sm:top-9
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
                                            h-2.5
                                            w-2.5
                                            rounded-full
                                            bg-[var(--primary)]
                                        "
                                    />

                                    <span
                                        className="
                                            text-[10px]
                                            font-bold
                                            uppercase
                                            tracking-[0.18em]
                                            text-[var(--on-surface-variant)]
                                            sm:text-xs
                                        "
                                    >
                                        Skillio
                                    </span>

                                </div>


                                <div
                                    className="
                                        flex
                                        gap-1.5
                                    "
                                >

                                    <span className="h-2 w-2 rounded-full bg-[var(--outline-variant)]" />

                                    <span className="h-2 w-2 rounded-full bg-[var(--outline-variant)]" />

                                    <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />

                                </div>

                            </div>


                            {/* =================================================
                                MAP / JOURNEY
                            ================================================== */}

                            <div
                                className="
                                    absolute
                                    inset-x-8
                                    bottom-12
                                    top-20
                                    sm:inset-x-12
                                    sm:bottom-16
                                    sm:top-24
                                "
                            >

                                {/* Path */}

                                <svg
                                    viewBox="0 0 300 230"
                                    className="absolute inset-0 h-full w-full"
                                    fill="none"
                                >

                                    <path
                                        d="
                                            M 30 185
                                            C 65 175,
                                            65 120,
                                            105 130
                                            S 145 185,
                                            180 150
                                            S 220 75,
                                            270 55
                                        "
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        strokeDasharray="8 9"
                                        className="text-[var(--primary)]/35"
                                    />

                                    <path
                                        d="
                                            M 30 185
                                            C 65 175,
                                            65 120,
                                            105 130
                                            S 145 185,
                                            180 150
                                            S 220 75,
                                            270 55
                                        "
                                        stroke="currentColor"
                                        strokeWidth="1"
                                        className="text-[var(--primary)]/20"
                                    />

                                </svg>


                                {/* Starting point */}

                                <div
                                    className="
                                        absolute
                                        bottom-[13%]
                                        left-[7%]
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-white
                                        bg-[var(--primary-container)]
                                        shadow-lg
                                        sm:h-11
                                        sm:w-11
                                    "
                                >

                                    <div
                                        className="
                                            h-2.5
                                            w-2.5
                                            rounded-full
                                            bg-[var(--primary)]
                                        "
                                    />

                                </div>


                                {/* Wrong turn */}

                                <div
                                    className="
                                        absolute
                                        left-[47%]
                                        top-[42%]
                                        flex
                                        h-12
                                        w-12
                                        rotate-12
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        border
                                        border-white/70
                                        bg-white/80
                                        text-[var(--primary)]
                                        shadow-xl
                                        backdrop-blur-md
                                        sm:h-14
                                        sm:w-14
                                    "
                                >

                                    <Search
                                        size={23}
                                        strokeWidth={2}
                                    />

                                </div>


                                {/* Destination */}

                                <div
                                    className="
                                        absolute
                                        right-[3%]
                                        top-[8%]
                                        flex
                                        h-14
                                        w-14
                                        items-center
                                        justify-center
                                        rounded-[1.25rem]
                                        bg-[var(--primary)]
                                        text-white
                                        shadow-[0_15px_35px_rgba(62,74,55,0.25)]
                                        sm:h-16
                                        sm:w-16
                                    "
                                >

                                    <Compass
                                        size={29}
                                        strokeWidth={1.7}
                                    />

                                </div>


                                {/* Floating mini card */}

                                <div
                                    className="
                                        absolute
                                        bottom-[2%]
                                        right-[2%]
                                        rounded-xl
                                        border
                                        border-white/70
                                        bg-white/75
                                        px-3
                                        py-2
                                        shadow-lg
                                        backdrop-blur-xl
                                        sm:px-4
                                        sm:py-3
                                    "
                                >

                                    <p
                                        className="
                                            text-[9px]
                                            font-semibold
                                            uppercase
                                            tracking-wider
                                            text-[var(--on-surface-variant)]
                                            sm:text-[10px]
                                        "
                                    >
                                        Current status
                                    </p>

                                    <div
                                        className="
                                            mt-1
                                            flex
                                            items-center
                                            gap-1.5
                                        "
                                    >

                                        <span
                                            className="
                                                h-2
                                                w-2
                                                rounded-full
                                                bg-[var(--primary)]
                                            "
                                        />

                                        <span
                                            className="
                                                text-[10px]
                                                font-bold
                                                text-[var(--on-surface)]
                                                sm:text-xs
                                            "
                                        >
                                            Finding your way
                                        </span>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                404 LABEL
                            ================================================== */}

                            <div
                                className="
                                    absolute
                                    bottom-6
                                    left-7
                                    text-[10px]
                                    font-bold
                                    tracking-[0.2em]
                                    text-[var(--outline)]
                                    sm:bottom-8
                                    sm:left-9
                                    sm:text-xs
                                "
                            >
                                PAGE NOT FOUND
                            </div>

                        </div>


                        {/* =================================================
                            FLOATING CARD — TOP
                        ================================================== */}

                        <div
                            className="
                                absolute
                                right-[3%]
                                top-[7%]
                                z-20
                                hidden
                                rounded-2xl
                                border
                                border-white/70
                                bg-[var(--surface)]/75
                                p-4
                                shadow-xl
                                backdrop-blur-xl
                                sm:block
                            "
                        >

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[var(--primary-container)]
                                        text-[var(--primary)]
                                    "
                                >
                                    <Compass size={19} />
                                </div>

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Exploring...
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-[10px]
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        Finding your destination
                                    </p>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            FLOATING CARD — BOTTOM
                        ================================================== */}

                        <div
                            className="
                                absolute
                                bottom-[8%]
                                left-[3%]
                                z-20
                                hidden
                                rounded-2xl
                                border
                                border-white/70
                                bg-[var(--surface)]/75
                                px-4
                                py-3
                                shadow-xl
                                backdrop-blur-xl
                                sm:block
                            "
                        >

                            <div className="flex items-center gap-2.5">

                                <div
                                    className="
                                        flex
                                        h-8
                                        w-8
                                        items-center
                                        justify-center
                                        rounded-lg
                                        bg-[var(--primary)]
                                        text-white
                                    "
                                >
                                    <Sparkles size={15} />
                                </div>

                                <span
                                    className="
                                        text-xs
                                        font-semibold
                                        text-[var(--on-surface)]
                                    "
                                >
                                    Your journey continues
                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                FOOTER
            ====================================================== */}

            <footer
                className="
                    relative
                    z-10
                    px-6
                    pb-6
                    text-center
                "
            >

                <p
                    className="
                        text-label-sm
                        text-[var(--outline)]
                    "
                >
                    © {new Date().getFullYear()} Skillio · AI-powered
                    career workspace
                </p>

            </footer>

        </main>
    );
};


export default NotFound;