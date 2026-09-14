import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Camera,
    Check,
    CheckCircle2,
    ChevronRight,
    ImagePlus,
    KeyRound,
    Laptop,
    LogOut,
    Mail,
    ShieldCheck,
    User,
    UsersRound,
} from "lucide-react";

import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import useAuth from "../../auth/hooks/useAuth";


export default function Settings() {

    const navigate = useNavigate();

    const {
        user,
        updateProfile,
        logout,
        logoutAll,
    } = useAuth();

    const fileInputRef = useRef(null);


    /* =========================================================
       STATE
    ========================================================= */

    const [name, setName] = useState(
        user?.name || ""
    );

    const [avatarPreview, setAvatarPreview] = useState(
        user?.avatar || null
    );

    const [selectedAvatar, setSelectedAvatar] =
        useState(null);

    const [savingProfile, setSavingProfile] =
        useState(false);

    const [loggingOut, setLoggingOut] =
        useState(false);

    const [loggingOutAll, setLoggingOutAll] =
        useState(false);

    const [logoutConfirmation, setLogoutConfirmation] =
        useState(null);


    /* =========================================================
       SYNC USER
    ========================================================= */

    useEffect(() => {

        setName(user?.name || "");
        setAvatarPreview(user?.avatar || null);
        setSelectedAvatar(null);

    }, [user]);


    /* =========================================================
       CLEANUP OBJECT URL
    ========================================================= */

    useEffect(() => {

        return () => {

            if (
                avatarPreview &&
                avatarPreview.startsWith("blob:")
            ) {
                URL.revokeObjectURL(
                    avatarPreview
                );
            }

        };

    }, [avatarPreview]);


    /* =========================================================
       PROFILE CHANGES
    ========================================================= */

    const trimmedName = name.trim();

    const nameChanged =
        trimmedName !== (user?.name || "");

    const avatarChanged =
        Boolean(selectedAvatar);

    const hasChanges =
        nameChanged || avatarChanged;


    /* =========================================================
       AVATAR LETTER
    ========================================================= */

    const avatarLetter =
        user?.name
            ?.trim()
            ?.charAt(0)
            ?.toUpperCase() || "U";


    /* =========================================================
       AVATAR CHANGE
    ========================================================= */

    const handleAvatarChange = (event) => {

        const file =
            event.target.files?.[0];

        if (!file) return;


        /* IMAGE TYPE */

        if (!file.type.startsWith("image/")) {

            toast.error(
                "Please select a valid image."
            );

            return;
        }


        /* IMAGE SIZE */

        if (file.size > 5 * 1024 * 1024) {

            toast.error(
                "Image must be smaller than 5 MB."
            );

            return;
        }


        const previewUrl =
            URL.createObjectURL(file);


        setSelectedAvatar(file);
        setAvatarPreview(previewUrl);

        toast.success(
            "Profile photo selected."
        );

    };


    /* =========================================================
       SAVE PROFILE
    ========================================================= */

    const handleSaveProfile = async () => {

        if (!trimmedName) {

            toast.error(
                "Name cannot be empty."
            );

            return;
        }


        if (trimmedName.length < 2) {

            toast.error(
                "Name must contain at least 2 characters."
            );

            return;
        }


        if (trimmedName.length > 50) {

            toast.error(
                "Name cannot exceed 50 characters."
            );

            return;
        }


        if (!hasChanges) {

            toast.info(
                "There are no changes to save."
            );

            return;
        }


        try {

            setSavingProfile(true);


            await updateProfile({
                name: trimmedName,
                avatar: selectedAvatar,
            });


            setSelectedAvatar(null);


            toast.success(
                "Profile updated successfully."
            );

        } catch (error) {

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Unable to update your profile."
            );

        } finally {

            setSavingProfile(false);

        }

    };


    /* =========================================================
       LOGOUT
    ========================================================= */

    const handleLogout = async () => {

        if (loggingOut) return;

        try {

            setLoggingOut(true);

            await logout();

            toast.success(
                "You have been signed out."
            );

            navigate("/login", {
                replace: true,
            });

        } catch (error) {

            toast.error(
                "Unable to sign out."
            );

        } finally {

            setLoggingOut(false);

        }

    };


    /* =========================================================
       LOGOUT ALL
    ========================================================= */

    const handleLogoutAll = async () => {

        if (loggingOutAll) return;

        try {

            setLoggingOutAll(true);

            await logoutAll();

            toast.success(
                "Signed out of all active sessions."
            );

            navigate("/login", {
                replace: true,
            });

        } catch (error) {

            toast.error(
                "Unable to sign out of all sessions."
            );

        } finally {

            setLoggingOutAll(false);

        }

    };


    const openLogoutConfirmation = (scope) => {

        if (loggingOut || loggingOutAll) return;

        setLogoutConfirmation(scope);

    };


    const closeLogoutConfirmation = () => {

        if (loggingOut || loggingOutAll) return;

        setLogoutConfirmation(null);

    };


    const confirmLogout = async () => {

        if (logoutConfirmation === "all") {

            await handleLogoutAll();

            return;
        }

        await handleLogout();

    };


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <main
            className="
                min-h-full
                bg-[var(--surface)]
                px-4
                py-6
                sm:px-6
                sm:py-8
                lg:px-8
                lg:py-10
            "
        >

            <div
                className="
                    mx-auto
                    w-full
                "
            >


                {/* =====================================================
                    PAGE HEADER
                ===================================================== */}

                <header className="mb-8 sm:mb-10">

                    <div
                        className="
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-low)]
                            px-3
                            py-1.5
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-[var(--primary)]
                        "
                    >

                        <User size={12} />

                        Account settings

                    </div>


                    <h1
                        className="
                            mt-4
                            font-[var(--font-heading)]
                            text-3xl
                            font-bold
                            tracking-tight
                            text-[var(--on-surface)]
                            sm:text-4xl
                        "
                    >
                        Settings
                    </h1>


                    <p
                        className="
                            mt-2
                            max-w-2xl
                            text-sm
                            leading-6
                            text-[var(--on-surface-variant)]
                            sm:text-[15px]
                        "
                    >
                        Manage your profile, password, and
                        active sessions from one place.
                    </p>

                </header>



                {/* =====================================================
                    PROFILE SECTION
                ===================================================== */}

                <section
                    className="
                        overflow-hidden
                        rounded-[1.75rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        shadow-[var(--shadow-sm)]
                    "
                >

                    {/* Profile heading */}

                    <div
                        className="
                            border-b
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-low)]
                            px-5
                            py-5
                            sm:px-7
                            sm:py-6
                        "
                    >

                        <div className="flex items-center gap-3">

                            <div
                                className="
                                    flex
                                    h-10
                                    w-10
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    bg-[var(--primary-container)]
                                    text-[var(--on-primary-container)]
                                "
                            >
                                <User size={18} />
                            </div>


                            <div>

                                <h2
                                    className="
                                        text-sm
                                        font-bold
                                        text-[var(--on-surface)]
                                    "
                                >
                                    Profile
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    Your public account information.
                                </p>

                            </div>

                        </div>

                    </div>



                    {/* Profile body */}

                    <div className="p-5 sm:p-7">


                        {/* =================================================
                            AVATAR AREA
                        ================================================= */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface)]
                                p-4
                                sm:p-5
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-5
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-4
                                    "
                                >

                                    {/* Avatar */}

                                    <div className="relative">

                                        {avatarPreview ? (

                                            <img
                                                src={avatarPreview}
                                                alt=""
                                                className="
                                                    h-20
                                                    w-20
                                                    rounded-2xl
                                                    object-cover
                                                    ring-1
                                                    ring-[var(--outline-variant)]
                                                "
                                            />

                                        ) : (

                                            <div
                                                className="
                                                    flex
                                                    h-20
                                                    w-20
                                                    items-center
                                                    justify-center
                                                    rounded-2xl
                                                    bg-[var(--primary-container)]
                                                    font-[var(--font-heading)]
                                                    text-2xl
                                                    font-bold
                                                    text-[var(--on-primary-container)]
                                                "
                                            >
                                                {avatarLetter}
                                            </div>

                                        )}


                                        {/* Camera */}

                                        <button
                                            type="button"
                                            onClick={() =>
                                                fileInputRef.current?.click()
                                            }
                                            aria-label="Change profile photo"
                                            className="
                                                absolute
                                                -bottom-2
                                                -right-2
                                                flex
                                                h-9
                                                w-9
                                                items-center
                                                justify-center
                                                rounded-xl
                                                border
                                                border-[var(--outline-variant)]
                                                bg-[var(--surface-container-lowest)]
                                                text-[var(--on-surface-variant)]
                                                shadow-[var(--shadow-sm)]
                                                transition-all
                                                hover:border-[var(--primary)]
                                                hover:bg-[var(--primary-container)]
                                                hover:text-[var(--on-primary-container)]
                                                active:scale-95
                                            "
                                        >
                                            <Camera size={16} />
                                        </button>


                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/png,image/jpeg,image/webp"
                                            onChange={handleAvatarChange}
                                            className="hidden"
                                        />

                                    </div>


                                    <div>

                                        <p
                                            className="
                                                text-sm
                                                font-bold
                                                text-[var(--on-surface)]
                                            "
                                        >
                                            Profile photo
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-xs
                                                leading-5
                                                text-[var(--on-surface-variant)]
                                            "
                                        >
                                            Use a clear photo so
                                            your profile feels personal.
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                font-medium
                                                text-[var(--on-surface-variant)]/70
                                            "
                                        >
                                            JPG, PNG or WebP · Max 5 MB
                                        </p>

                                    </div>

                                </div>


                                <button
                                    type="button"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="
                                        inline-flex
                                        h-10
                                        w-fit
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-[var(--outline-variant)]
                                        bg-[var(--surface-container-lowest)]
                                        px-3.5
                                        text-xs
                                        font-bold
                                        text-[var(--on-surface)]
                                        transition-all
                                        hover:border-[var(--primary)]
                                        hover:text-[var(--primary)]
                                        active:scale-[0.98]
                                    "
                                >

                                    <ImagePlus size={15} />

                                    Change photo

                                </button>

                            </div>

                        </div>



                        {/* =================================================
                            PERSONAL DETAILS
                        ================================================= */}

                        <div className="mt-6">

                            <div className="mb-4">

                                <h3
                                    className="
                                        text-sm
                                        font-bold
                                        text-[var(--on-surface)]
                                    "
                                >
                                    Personal details
                                </h3>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    Keep your account information up to date.
                                </p>

                            </div>


                            <div
                                className="
                                    grid
                                    gap-5
                                    md:grid-cols-2
                                "
                            >

                                {/* NAME */}

                                <div>

                                    <label
                                        htmlFor="settings-name"
                                        className="
                                            mb-2
                                            block
                                            text-xs
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Full name
                                    </label>

                                    <input
                                        id="settings-name"
                                        type="text"
                                        value={name}
                                        maxLength={50}
                                        onChange={(event) =>
                                            setName(event.target.value)
                                        }
                                        placeholder="Your name"
                                        className="
                                            h-11
                                            w-full
                                            rounded-xl
                                            border
                                            border-[var(--outline-variant)]
                                            bg-[var(--surface)]
                                            px-3.5
                                            text-sm
                                            text-[var(--on-surface)]
                                            outline-none
                                            transition-all
                                            placeholder:text-[var(--on-surface-variant)]/50
                                            hover:border-[var(--outline)]
                                            focus:border-[var(--primary)]
                                            focus:ring-4
                                            focus:ring-[color:var(--primary)]/10
                                        "
                                    />

                                    <p
                                        className="
                                            mt-1.5
                                            text-[10px]
                                            text-[var(--on-surface-variant)]/70
                                        "
                                    >
                                        {name.length}/50 characters
                                    </p>

                                </div>



                                {/* EMAIL */}

                                <div>

                                    <label
                                        className="
                                            mb-2
                                            block
                                            text-xs
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Email address
                                    </label>


                                    <div
                                        className="
                                            flex
                                            h-11
                                            items-center
                                            gap-2.5
                                            rounded-xl
                                            border
                                            border-[var(--outline-variant)]
                                            bg-[var(--surface-container)]
                                            px-3.5
                                        "
                                    >

                                        <Mail
                                            size={15}
                                            className="
                                                shrink-0
                                                text-[var(--on-surface-variant)]
                                            "
                                        />

                                        <span
                                            className="
                                                min-w-0
                                                flex-1
                                                truncate
                                                text-sm
                                                text-[var(--on-surface-variant)]
                                            "
                                        >
                                            {user?.email || "—"}
                                        </span>


                                        {user?.isEmailVerified && (

                                            <CheckCircle2
                                                size={15}
                                                className="
                                                    shrink-0
                                                    text-[var(--primary)]
                                                "
                                            />

                                        )}

                                    </div>


                                    <div className="mt-2">

                                        {user?.isEmailVerified ? (

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-1.5
                                                    rounded-full
                                                    bg-[var(--primary-container)]
                                                    px-2
                                                    py-1
                                                    text-[9px]
                                                    font-bold
                                                    text-[var(--on-primary-container)]
                                                "
                                            >

                                                <Check size={11} />

                                                Email verified

                                            </span>

                                        ) : (

                                            <span
                                                className="
                                                    inline-flex
                                                    items-center
                                                    gap-1.5
                                                    rounded-full
                                                    bg-[var(--surface-container)]
                                                    px-2
                                                    py-1
                                                    text-[9px]
                                                    font-semibold
                                                    text-[var(--on-surface-variant)]
                                                "
                                            >
                                                Email not verified
                                            </span>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>



                        {/* =================================================
                            SAVE BAR
                        ================================================= */}

                        <div
                            className="
                                mt-7
                                flex
                                flex-col
                                gap-3
                                border-t
                                border-[var(--outline-variant)]
                                pt-5
                                sm:flex-row
                                sm:items-center
                                sm:justify-between
                            "
                        >

                            <div>

                                {hasChanges ? (

                                    <p
                                        className="
                                            text-xs
                                            font-medium
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        You have unsaved changes.
                                    </p>

                                ) : (

                                    <p
                                        className="
                                            text-xs
                                            text-[var(--on-surface-variant)]/60
                                        "
                                    >
                                        Your profile is up to date.
                                    </p>

                                )}

                            </div>


                            <button
                                type="button"
                                disabled={
                                    savingProfile ||
                                    !hasChanges
                                }
                                onClick={handleSaveProfile}
                                className="
                                    inline-flex
                                    h-10
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    bg-[var(--primary)]
                                    px-4
                                    text-sm
                                    font-bold
                                    text-[var(--on-primary)]
                                    shadow-[var(--shadow-sm)]
                                    transition-all
                                    hover:-translate-y-0.5
                                    hover:shadow-[var(--shadow-md)]
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    disabled:hover:translate-y-0
                                "
                            >

                                {savingProfile ? (
                                    "Saving..."
                                ) : (
                                    <>
                                        <Check size={16} />
                                        Save changes
                                    </>
                                )}

                            </button>

                        </div>

                    </div>

                </section>



                {/* =====================================================
                    SECURITY
                ===================================================== */}

                <section
                    className="
                        mt-7
                        overflow-hidden
                        rounded-[1.75rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        shadow-[var(--shadow-sm)]
                    "
                >

                    <div
                        className="
                            border-b
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-low)]
                            px-5
                            py-5
                            sm:px-7
                            sm:py-6
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
                                    text-[var(--on-primary-container)]
                                "
                            >
                                <ShieldCheck size={18} />
                            </div>

                            <div>

                                <h2
                                    className="
                                        text-sm
                                        font-bold
                                        text-[var(--on-surface)]
                                    "
                                >
                                    Security
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    Protect your Skillio account.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="p-4 sm:p-5">

                        {/* Change password */}

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/settings/change-password"
                                )
                            }
                            className="
                                group
                                flex
                                w-full
                                items-center
                                gap-4
                                rounded-2xl
                                border
                                border-transparent
                                p-4
                                text-left
                                transition-all
                                hover:border-[var(--outline-variant)]
                                hover:bg-[var(--surface-container-low)]
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
                                <KeyRound size={18} />
                            </div>


                            <div className="min-w-0 flex-1">

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >

                                    <p
                                        className="
                                            text-sm
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Change password
                                    </p>

                                    <span
                                        className="
                                            rounded-full
                                            bg-[var(--surface-container)]
                                            px-2
                                            py-0.5
                                            text-[9px]
                                            font-semibold
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        Account security
                                    </span>

                                </div>


                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        leading-5
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    Update your password whenever
                                    you want to keep your account secure.
                                </p>

                            </div>


                            <ChevronRight
                                size={18}
                                className="
                                    shrink-0
                                    text-[var(--on-surface-variant)]/60
                                    transition-all
                                    group-hover:translate-x-0.5
                                    group-hover:text-[var(--primary)]
                                "
                            />

                        </button>

                    </div>

                </section>



                {/* =====================================================
                    SESSIONS
                ===================================================== */}

                <section
                    className="
                        mt-7
                        overflow-hidden
                        rounded-[1.75rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        shadow-[var(--shadow-sm)]
                    "
                >

                    <div
                        className="
                            border-b
                            border-[var(--outline-variant)]
                            bg-[var(--surface-container-low)]
                            px-5
                            py-5
                            sm:px-7
                            sm:py-6
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
                                    text-[var(--on-primary-container)]
                                "
                            >
                                <UsersRound size={18} />
                            </div>


                            <div>

                                <h2
                                    className="
                                        text-sm
                                        font-bold
                                        text-[var(--on-surface)]
                                    "
                                >
                                    Sessions
                                </h2>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-[var(--on-surface-variant)]
                                    "
                                >
                                    Control where your account is signed in.
                                </p>

                            </div>

                        </div>

                    </div>


                    <div className="p-5 sm:p-7">


                        {/* Current device */}

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface)]
                                p-4
                            "
                        >

                            <div className="flex items-center gap-3">

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
                                    <Laptop size={18} />
                                </div>


                                <div className="min-w-0 flex-1">

                                    <div
                                        className="
                                            flex
                                            flex-wrap
                                            items-center
                                            gap-2
                                        "
                                    >

                                        <p
                                            className="
                                                text-sm
                                                font-bold
                                                text-[var(--on-surface)]
                                            "
                                        >
                                            Current device
                                        </p>

                                        <span
                                            className="
                                                inline-flex
                                                items-center
                                                gap-1.5
                                                rounded-full
                                                bg-[var(--primary-container)]
                                                px-2
                                                py-1
                                                text-[9px]
                                                font-bold
                                                text-[var(--on-primary-container)]
                                            "
                                        >

                                            <span
                                                className="
                                                    h-1.5
                                                    w-1.5
                                                    rounded-full
                                                    bg-[var(--primary)]
                                                "
                                            />

                                            Active

                                        </span>

                                    </div>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        You are currently signed in on this device.
                                    </p>

                                </div>


                                <ShieldCheck
                                    size={18}
                                    className="
                                        hidden
                                        shrink-0
                                        text-[var(--primary)]
                                        sm:block
                                    "
                                />

                            </div>

                        </div>

                    </div>

                </section>



                {/* =====================================================
                    SIGN OUT
                ===================================================== */}

                <section
                    className="
                        mt-7
                        overflow-hidden
                        rounded-[1.75rem]
                        border-2
                        border-[var(--error)]/40
                        bg-[var(--error-container)]/35
                        shadow-[var(--shadow-sm)]
                    "
                >

                    <div
                        className="
                            border-b
                            border-[var(--error)]/25
                            bg-[var(--error-container)]
                            p-5
                            sm:p-6
                        "
                    >

                        <div>

                            <div className="flex items-center gap-3">

                                <div
                                    className="
                                        flex
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[var(--error)]
                                        text-[var(--on-error)]
                                    "
                                >
                                    <LogOut size={17} />
                                </div>


                                <div>

                                    <h2
                                        className="
                                            text-sm
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                    >
                                        Danger zone
                                    </h2>

                                    <p
                                        className="
                                            mt-0.5
                                            text-xs
                                            text-[var(--on-surface-variant)]
                                        "
                                    >
                                        End the current session or sign out everywhere. These actions cannot be undone.
                                    </p>

                                </div>

                            </div>

                        </div>


                    </div>

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            p-5
                            sm:p-6
                        "
                    >

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface)]
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <div className="min-w-0">
                                <p className="text-sm font-bold text-[var(--on-surface)]">
                                    Sign out this device
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[var(--on-surface-variant)]">
                                    End the current session on this device.
                                </p>
                                </div>

                                <button
                                type="button"
                                disabled={loggingOut}
                                onClick={() => openLogoutConfirmation("current")}
                                className="
                                    inline-flex
                                    h-10
                                    w-full
                                    shrink-0
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[var(--error)]
                                    bg-[var(--error)]
                                    px-4
                                    text-xs
                                    font-bold
                                    text-[var(--on-error)]
                                    transition-all
                                    hover:bg-[var(--error)]/90
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    sm:w-auto
                                "
                            >
                                <LogOut size={15} />
                                {loggingOut ? "Signing out..." : "Sign out this device"}
                                </button>

                            </div>

                        </div>

                        <div
                            className="
                                rounded-2xl
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface)]
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <div className="min-w-0">
                                <p className="text-sm font-bold text-[var(--on-surface)]">
                                    Sign out everywhere
                                </p>
                                <p className="mt-1 text-xs leading-5 text-[var(--on-surface-variant)]">
                                    End all active sessions on every device.
                                </p>
                                </div>

                                <button
                                type="button"
                                disabled={loggingOutAll}
                                onClick={() => openLogoutConfirmation("all")}
                                className="
                                    inline-flex
                                    h-10
                                    w-full
                                    shrink-0
                                    items-center
                                    justify-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-[var(--error)]
                                    bg-transparent
                                    px-4
                                    text-xs
                                    font-bold
                                    text-[var(--error)]
                                    transition-all
                                    hover:bg-[var(--error)]/10
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                    sm:w-auto
                                "
                            >
                                <LogOut size={15} />
                                {loggingOutAll ? "Signing out..." : "Sign out everywhere"}
                                </button>

                            </div>

                        </div>

                    </div>

                </section>


                {logoutConfirmation && (
                    <div
                        className="
                            fixed
                            inset-0
                            z-50
                            flex
                            items-center
                            justify-center
                            bg-black/45
                            p-4
                        "
                        role="presentation"
                        onClick={closeLogoutConfirmation}
                    >

                        <div
                            className="
                                w-full
                                max-w-md
                                rounded-2xl
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface-container-lowest)]
                                p-5
                                shadow-[var(--shadow-lg)]
                                sm:p-6
                            "
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="logout-confirmation-title"
                            onClick={(event) => event.stopPropagation()}
                        >

                            <h2
                                id="logout-confirmation-title"
                                className="
                                    text-base
                                    font-bold
                                    text-[var(--on-surface)]
                                "
                            >
                                {logoutConfirmation === "all"
                                    ? "Sign out of all devices?"
                                    : "Sign out of this device?"}
                            </h2>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    leading-6
                                    text-[var(--on-surface-variant)]
                                "
                            >
                                {logoutConfirmation === "all"
                                    ? "This will end every active session, including the session you are using now."
                                    : "You will need to sign in again on this device to access your account."}
                            </p>

                            <div
                                className="
                                    mt-6
                                    flex
                                    flex-col-reverse
                                    gap-2
                                    sm:flex-row
                                    sm:justify-end
                                "
                            >

                                <button
                                    type="button"
                                    disabled={loggingOut || loggingOutAll}
                                    onClick={closeLogoutConfirmation}
                                    className="
                                        inline-flex
                                        h-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-[var(--outline-variant)]
                                        bg-[var(--surface-container)]
                                        px-4
                                        text-xs
                                        font-bold
                                        text-[var(--on-surface)]
                                        transition-colors
                                        hover:bg-[var(--surface-container-high)]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    disabled={loggingOut || loggingOutAll}
                                    onClick={confirmLogout}
                                    className="
                                        inline-flex
                                        h-10
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[var(--error)]
                                        px-4
                                        text-xs
                                        font-bold
                                        text-[var(--on-error)]
                                        transition-colors
                                        hover:bg-[var(--error)]/90
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >
                                    {loggingOut || loggingOutAll
                                        ? "Signing out..."
                                        : logoutConfirmation === "all"
                                            ? "Sign out everywhere"
                                            : "Sign out"}
                                </button>

                            </div>

                        </div>

                    </div>
                )}



                {/* =====================================================
                    FOOTER
                ===================================================== */}

                <footer
                    className="
                        px-2
                        py-8
                        text-center
                    "
                >

                    <div
                        className="
                            mx-auto
                            mb-3
                            h-px
                            max-w-xs
                            bg-[var(--outline-variant)]
                        "
                    />

                    <p
                        className="
                            text-[10px]
                            font-medium
                            text-[var(--on-surface-variant)]/55
                        "
                    >
                        Your account information is private and
                        protected by Skillio.
                    </p>

                </footer>

            </div>

        </main>
    );
}