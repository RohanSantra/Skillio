import {
    useCallback,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    ArrowLeft,
    BrainCircuit,
    Check,
    CheckCircle2,
    CircleAlert,
    File,
    FileArchive,
    FileText,
    LoaderCircle,
    ShieldCheck,
    Sparkles,
    UploadCloud,
    X,
} from "lucide-react";

import useResume from "../hooks/useResume.js";
import {
    uploadResume,
} from "../services/resume.api.js";
import ErrorToast from "../../../components/feedback/ErrorToast.jsx";


/* =========================================================
   ## CONFIGURATION
========================================================= */

const ACCEPTED_FILE_TYPES = [
    "application/pdf",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];


const ACCEPTED_EXTENSIONS = [
    "pdf",
    "docx",
];


const MAX_FILE_SIZE =
    5 * 1024 * 1024;


/* =========================================================
   ## HELPER FUNCTIONS
========================================================= */

function formatFileSize(bytes = 0) {

    if (!bytes) {
        return "0 Bytes";
    }


    const units = [
        "Bytes",
        "KB",
        "MB",
        "GB",
    ];


    const index = Math.floor(
        Math.log(bytes) /
        Math.log(1024)
    );


    const value =
        bytes /
        Math.pow(1024, index);


    return `${value.toFixed(
        index === 0
            ? 0
            : 2
    )} ${units[index]}`;

}


function getFileExtension(fileName = "") {

    return fileName
        .split(".")
        .pop()
        ?.toLowerCase();

}


function getFileTypeLabel(extension) {

    const labels = {

        pdf: "PDF Document",

        doc: "Word Document",

        docx: "Word Document",

    };


    return (
        labels[extension] ||
        "Resume Document"
    );

}


function getFileIcon(extension) {

    if (extension === "pdf") {
        return FileText;
    }


    if (
        extension === "doc" ||
        extension === "docx"
    ) {
        return File;
    }


    return FileArchive;

}


/* =========================================================
   ## PROCESSING STEP
========================================================= */

function ProcessingStep({

    icon,

    title,

    description,

    status,

    isLast = false,

}) {

    const Icon = icon;


    const isComplete =
        status === "complete";


    const isActive =
        status === "active";


    return (

        <div className="relative flex gap-4">


            {/* =============================================
                ## CONNECTING LINE
            ============================================= */}

            {!isLast && (

                <div
                    className="
                        absolute
                        left-[21px]
                        top-11
                        h-[calc(100%-28px)]
                        w-px
                        bg-[var(--outline-variant)]
                    "
                />

            )}


            {/* =============================================
                ## ICON
            ============================================= */}

            <div
                className={`
                    relative
                    z-10
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    transition-all
                    duration-300

                    ${
                        isComplete
                            ? `
                                bg-[var(--primary)]
                                text-white
                            `
                            : ""
                    }

                    ${
                        isActive
                            ? `
                                bg-[var(--primary-fixed)]
                                text-[var(--primary)]
                                ring-4
                                ring-[var(--primary-fixed)]/60
                            `
                            : ""
                    }

                    ${
                        !isComplete &&
                        !isActive
                            ? `
                                bg-[var(--surface-container-low)]
                                text-[var(--on-surface-variant)]
                            `
                            : ""
                    }
                `}
            >

                {isComplete ? (

                    <Check
                        size={19}
                        strokeWidth={2.5}
                    />

                ) : isActive ? (

                    <LoaderCircle
                        size={19}
                        className="animate-spin"
                    />

                ) : (

                    <Icon size={19} />

                )}

            </div>


            {/* =============================================
                ## CONTENT
            ============================================= */}

            <div
                className="
                    min-w-0
                    pb-8
                    pt-1
                "
            >

                <h4
                    className={`
                        text-sm
                        font-bold

                        ${
                            isComplete ||
                            isActive
                                ? "text-[var(--on-surface)]"
                                : "text-[var(--on-surface-variant)]"
                        }
                    `}
                >

                    {title}

                </h4>


                <p
                    className="
                        mt-1
                        text-xs
                        leading-5
                        text-[var(--on-surface-variant)]
                    "
                >

                    {description}

                </p>

            </div>

        </div>

    );

}


/* =========================================================
   ## CREATE RESUME
========================================================= */

function CreateResume() {


    /* =====================================================
       ## HOOKS
    ===================================================== */

    const navigate =
        useNavigate();


    const fileInputRef =
        useRef(null);


    const {

        parseResume,

        isParsing,

    } = useResume();


    /* =====================================================
       ## LOCAL STATE
    ===================================================== */

    const [

        selectedFile,

        setSelectedFile,

    ] = useState(null);


    const [

        uploadedResume,

        setUploadedResume,

    ] = useState(null);


    const [

        isUploading,

        setIsUploading,

    ] = useState(false);


    const [

        isDragging,

        setIsDragging,

    ] = useState(false);


    const [

        error,

        setError,

    ] = useState("");


    /* =====================================================
       ## DERIVED STATE
    ===================================================== */

    const isProcessing =
        isUploading ||
        isParsing;


    const fileExtension =
        selectedFile
            ? getFileExtension(
                selectedFile.name
            )
            : "";


    const FileIcon =
        getFileIcon(
            fileExtension
        );


    const isUploaded =
        Boolean(
            uploadedResume?._id
        );


    /* =====================================================
       ## FILE VALIDATION
    ===================================================== */

    const validateFile =
        useCallback((file) => {

            if (!file) {
                return false;
            }


            const extension =
                getFileExtension(
                    file.name
                );


            const isValidType =

                ACCEPTED_FILE_TYPES.includes(
                    file.type
                )

                ||

                ACCEPTED_EXTENSIONS.includes(
                    extension
                );


            if (!isValidType) {

                setError(
                    "Please upload a PDF or DOCX resume."
                );

                return false;

            }


            if (
                file.size >
                MAX_FILE_SIZE
            ) {

                setError(
                    "Your resume must be smaller than 5 MB."
                );

                return false;

            }


            return true;

        }, []);


    /* =====================================================
       ## HANDLE FILE SELECTION
    ===================================================== */

    const handleFileSelect =
        useCallback((file) => {

            setError("");


            if (
                !validateFile(file)
            ) {
                return;
            }


            setSelectedFile(file);

            setUploadedResume(null);

        }, [
            validateFile,
        ]);


    /* =====================================================
       ## INPUT CHANGE
    ===================================================== */

    const handleInputChange =
        (event) => {

            const file =
                event.target.files?.[0];


            if (file) {

                handleFileSelect(
                    file
                );

            }


            event.target.value = "";

        };


    /* =====================================================
       ## DRAG EVENTS
    ===================================================== */

    const handleDragOver =
        (event) => {

            event.preventDefault();


            if (!isProcessing) {

                setIsDragging(true);

            }

        };


    const handleDragLeave =
        (event) => {

            event.preventDefault();

            setIsDragging(false);

        };


    const handleDrop =
        (event) => {

            event.preventDefault();

            setIsDragging(false);


            if (isProcessing) {
                return;
            }


            const file =
                event.dataTransfer.files?.[0];


            if (file) {

                handleFileSelect(
                    file
                );

            }

        };


    /* =====================================================
       ## REMOVE FILE
    ===================================================== */

    const handleRemoveFile =
        () => {

            if (isProcessing) {
                return;
            }


            setSelectedFile(null);

            setUploadedResume(null);

            setError("");

        };


    /* =====================================================
       ## UPLOAD RESUME
    ===================================================== */

    const handleUploadResume =
        async () => {

            if (!selectedFile) {

                setError(
                    "Please select a resume first."
                );

                return;

            }


            try {

                setError("");

                setIsUploading(true);


                /* =========================================
                   ## UPLOAD TO BACKEND
                ========================================= */

                const response =
                    await uploadResume(
                        selectedFile
                    );


                const resume =
                    response?.data?.data?.resume;


                if (!resume?._id) {

                    throw new Error(
                        "Resume upload completed, but no resume ID was returned."
                    );

                }


                /* =========================================
                   ## SAVE UPLOADED RESUME
                ========================================= */

                setUploadedResume(
                    resume
                );


            } catch (error) {

                setError(

                    error?.response?.data?.message ||

                    error?.message ||

                    "Failed to upload and extract your resume."

                );

            } finally {

                setIsUploading(false);

            }

        };


    /* =====================================================
       ## PARSE WITH AI
    ===================================================== */

    const handleParseResume =
        async () => {

            if (!uploadedResume?._id) {
                return;
            }


            try {

                setError("");


                await parseResume(
                    uploadedResume._id
                );


                navigate(
                    `/resumes/${uploadedResume._id}`
                );


            } catch (error) {

                setError(

                    error?.response?.data?.message ||

                    error?.message ||

                    "Failed to parse your resume with AI."

                );

            }

        };


    /* =====================================================
       ## PROCESSING STATE
    ===================================================== */

    const uploadStatus =

        isUploaded
            ? "complete"

            : isUploading
                ? "active"
                : selectedFile
                    ? "complete"
                    : "pending";


    const extractionStatus =

        isUploaded
            ? "complete"

            : isUploading
                ? "active"
                : "pending";


    const parsingStatus =

        uploadedResume?.parsedData?.name
            ? "complete"

            : isParsing
                ? "active"
                : "pending";


    /* =====================================================
       ## RENDER
    ===================================================== */

    return (

        <div
            className="
                min-h-screen
                bg-[var(--background)]
            "
        >

            <div
                className="
                    mx-auto
                    max-w-7xl
                    px-4
                    py-5
                    sm:px-6
                    sm:py-8
                    lg:px-8
                    lg:py-10
                "
            >


                {/* =========================================
                    ## BACK BUTTON
                ========================================= */}

                <button
                    type="button"

                    onClick={() =>
                        navigate("/resumes")
                    }

                    disabled={isProcessing}

                    className="
                        mb-7
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        px-3
                        py-2
                        text-sm
                        font-semibold
                        text-[var(--on-surface-variant)]
                        transition
                        hover:bg-[var(--surface-container-low)]
                        hover:text-[var(--on-surface)]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >

                    <ArrowLeft size={17} />

                    Back to Resumes

                </button>


                {/* =========================================
                    ## PAGE HERO
                ========================================= */}

                <section
                    className="
                        relative
                        mb-8
                        overflow-hidden
                        rounded-[2rem]
                        border
                        border-[var(--outline-variant)]
                        bg-[var(--surface-container-lowest)]
                        p-6
                        shadow-[var(--shadow-sm)]
                        sm:p-8
                        lg:p-10
                    "
                >

                    <div
                        className="
                            absolute
                            -right-24
                            -top-24
                            h-72
                            w-72
                            rounded-full
                            bg-[var(--primary-fixed)]
                            opacity-60
                            blur-3xl
                        "
                    />


                    <div className="relative max-w-3xl">


                        <div
                            className="
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-2xl
                                bg-[var(--primary)]
                                text-white
                                shadow-sm
                            "
                        >

                            <Sparkles size={25} />

                        </div>


                        <h1
                            className="
                                mt-6
                                font-[var(--font-heading)]
                                text-3xl
                                font-extrabold
                                tracking-tight
                                text-[var(--on-surface)]
                                sm:text-4xl
                            "
                        >

                            Upload and Analyze Your Resume

                        </h1>


                        <p
                            className="
                                mt-4
                                max-w-2xl
                                text-sm
                                leading-7
                                text-[var(--on-surface-variant)]
                                sm:text-base
                            "
                        >

                            Upload your resume to securely extract its
                            content, then use AI to organize your
                            experience into a structured professional
                            profile.

                        </p>


                        <div
                            className="
                                mt-6
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            {[
                                "Secure file upload",
                                "Automatic text extraction",
                                "AI profile structuring",
                            ].map((item) => (

                                <span
                                    key={item}

                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        bg-[var(--surface-container-low)]
                                        px-3
                                        py-1.5
                                        text-xs
                                        font-semibold
                                        text-[var(--on-surface-variant)]
                                    "
                                >

                                    <Check
                                        size={14}
                                        className="
                                            text-[var(--primary)]
                                        "
                                    />

                                    {item}

                                </span>

                            ))}

                        </div>

                    </div>

                </section>


                {/* =========================================
                    ## MAIN LAYOUT
                ========================================= */}

                <div
                    className="
                        grid
                        gap-6
                        xl:grid-cols-[minmax(0,1fr)_360px]
                    "
                >


                    {/* =====================================
                        ## MAIN CONTENT
                    ===================================== */}

                    <main className="space-y-6">


                        {/* =================================
                            ## UPLOAD CARD
                        ================================= */}

                        <section
                            className="
                                overflow-hidden
                                rounded-[2rem]
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface-container-lowest)]
                                shadow-[var(--shadow-sm)]
                            "
                        >


                            {/* Header */}

                            <div
                                className="
                                    border-b
                                    border-[var(--outline-variant)]
                                    p-6
                                    sm:p-7
                                "
                            >

                                <div
                                    className="
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
                                            rounded-2xl
                                            bg-[var(--primary-fixed)]
                                            text-[var(--primary)]
                                        "
                                    >

                                        <UploadCloud size={21} />

                                    </div>


                                    <div>

                                        <h2
                                            className="
                                                font-[var(--font-heading)]
                                                text-xl
                                                font-bold
                                                text-[var(--on-surface)]
                                            "
                                        >

                                            Upload Your Resume

                                        </h2>


                                        <p
                                            className="
                                                mt-1
                                                text-sm
                                                leading-6
                                                text-[var(--on-surface-variant)]
                                            "
                                        >

                                            Upload your latest resume to
                                            extract its content and create
                                            your professional profile.

                                        </p>

                                    </div>

                                </div>

                            </div>


                            {/* Content */}

                            <div className="p-6 sm:p-7">


                                {!selectedFile ? (

                                    /* =====================
                                       ## DROPZONE
                                    ===================== */

                                    <div
                                        onDragOver={handleDragOver}

                                        onDragLeave={handleDragLeave}

                                        onDrop={handleDrop}

                                        onClick={() =>
                                            !isProcessing &&
                                            fileInputRef.current?.click()
                                        }

                                        className={`
                                            group
                                            flex
                                            min-h-[320px]
                                            cursor-pointer
                                            flex-col
                                            items-center
                                            justify-center
                                            rounded-3xl
                                            border-2
                                            border-dashed
                                            px-6
                                            text-center
                                            transition
                                            duration-200

                                            ${
                                                isDragging
                                                    ? `
                                                        border-[var(--primary)]
                                                        bg-[var(--primary-fixed)]/50
                                                    `
                                                    : `
                                                        border-[var(--outline-variant)]
                                                        bg-[var(--surface-container-low)]
                                                        hover:border-[var(--primary)]
                                                        hover:bg-[var(--primary-fixed)]/30
                                                    `
                                            }
                                        `}
                                    >

                                        <div
                                            className="
                                                flex
                                                h-16
                                                w-16
                                                items-center
                                                justify-center
                                                rounded-3xl
                                                bg-[var(--surface-container-lowest)]
                                                text-[var(--primary)]
                                                shadow-sm
                                                transition
                                                group-hover:scale-105
                                            "
                                        >

                                            <UploadCloud size={30} />

                                        </div>


                                        <h3
                                            className="
                                                mt-6
                                                text-lg
                                                font-bold
                                                text-[var(--on-surface)]
                                            "
                                        >

                                            Drop your resume here

                                        </h3>


                                        <p
                                            className="
                                                mt-2
                                                max-w-sm
                                                text-sm
                                                leading-6
                                                text-[var(--on-surface-variant)]
                                            "
                                        >

                                            Drag and drop your resume here,
                                            or click to browse from your
                                            computer.

                                        </p>


                                        <div
                                            className="
                                                mt-6
                                                inline-flex
                                                items-center
                                                gap-2
                                                rounded-xl
                                                bg-[var(--primary)]
                                                px-5
                                                py-3
                                                text-sm
                                                font-bold
                                                text-white
                                            "
                                        >

                                            <UploadCloud size={17} />

                                            Choose Resume

                                        </div>


                                        <p
                                            className="
                                                mt-5
                                                text-xs
                                                text-[var(--on-surface-variant)]
                                            "
                                        >

                                            PDF or DOCX · Maximum 5 MB

                                        </p>

                                    </div>

                                ) : (

                                    /* =====================
                                       ## SELECTED FILE
                                    ===================== */

                                    <div
                                        className="
                                            rounded-3xl
                                            border
                                            border-[var(--outline-variant)]
                                            bg-[var(--surface-container-low)]
                                            p-5
                                            sm:p-6
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
                                                    min-w-0
                                                    items-center
                                                    gap-4
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        h-14
                                                        w-14
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-2xl
                                                        bg-[var(--surface-container-lowest)]
                                                        text-[var(--primary)]
                                                        shadow-sm
                                                    "
                                                >

                                                    <FileIcon size={25} />

                                                </div>


                                                <div className="min-w-0">

                                                    <p
                                                        className="
                                                            truncate
                                                            font-semibold
                                                            text-[var(--on-surface)]
                                                        "
                                                    >

                                                        {selectedFile.name}

                                                    </p>


                                                    <div
                                                        className="
                                                            mt-2
                                                            flex
                                                            flex-wrap
                                                            items-center
                                                            gap-2
                                                            text-xs
                                                            text-[var(--on-surface-variant)]
                                                        "
                                                    >

                                                        <span>

                                                            {getFileTypeLabel(
                                                                fileExtension
                                                            )}

                                                        </span>

                                                        <span>•</span>

                                                        <span>

                                                            {formatFileSize(
                                                                selectedFile.size
                                                            )}

                                                        </span>

                                                    </div>

                                                </div>

                                            </div>


                                            {!isUploaded && (

                                                <button
                                                    type="button"

                                                    onClick={
                                                        handleRemoveFile
                                                    }

                                                    disabled={
                                                        isProcessing
                                                    }

                                                    className="
                                                        inline-flex
                                                        h-10
                                                        w-10
                                                        shrink-0
                                                        self-end
                                                        items-center
                                                        justify-center
                                                        rounded-xl
                                                        text-[var(--on-surface-variant)]
                                                        transition
                                                        hover:bg-[var(--surface-container-lowest)]
                                                        hover:text-[var(--error)]
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50
                                                        sm:self-auto
                                                    "

                                                    aria-label="Remove resume"
                                                >

                                                    <X size={19} />

                                                </button>

                                            )}

                                        </div>


                                        {/* Uploading */}

                                        {isUploading && (

                                            <div
                                                className="
                                                    mt-6
                                                    rounded-2xl
                                                    bg-[var(--primary-fixed)]/50
                                                    p-5
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        gap-4
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
                                                            bg-[var(--primary)]
                                                            text-white
                                                        "
                                                    >

                                                        <LoaderCircle
                                                            size={19}
                                                            className="animate-spin"
                                                        />

                                                    </div>


                                                    <div>

                                                        <h3
                                                            className="
                                                                text-sm
                                                                font-bold
                                                                text-[var(--on-primary-fixed)]
                                                            "
                                                        >

                                                            Uploading and extracting your resume

                                                        </h3>


                                                        <p
                                                            className="
                                                                mt-2
                                                                text-sm
                                                                leading-6
                                                                text-[var(--on-primary-fixed-variant)]
                                                            "
                                                        >

                                                            Please wait while
                                                            your resume is
                                                            securely uploaded
                                                            and its content is
                                                            extracted.

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        )}


                                        {/* Upload Success */}

                                        {isUploaded && (

                                            <div
                                                className="
                                                    mt-6
                                                    rounded-2xl
                                                    bg-[var(--surface-container-lowest)]
                                                    p-5
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        gap-4
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
                                                            bg-[var(--primary)]
                                                            text-white
                                                        "
                                                    >

                                                        <CheckCircle2
                                                            size={19}
                                                        />

                                                    </div>


                                                    <div>

                                                        <h3
                                                            className="
                                                                text-sm
                                                                font-bold
                                                                text-[var(--on-surface)]
                                                            "
                                                        >

                                                            Resume uploaded successfully

                                                        </h3>


                                                        <p
                                                            className="
                                                                mt-2
                                                                text-sm
                                                                leading-6
                                                                text-[var(--on-surface-variant)]
                                                            "
                                                        >

                                                            Your resume has been
                                                            uploaded and its text
                                                            is ready for AI
                                                            processing.

                                                        </p>

                                                    </div>

                                                </div>

                                            </div>

                                        )}


                                        {/* Actions */}

                                        <div
                                            className="
                                                mt-6
                                                flex
                                                flex-col
                                                gap-3
                                                sm:flex-row
                                            "
                                        >

                                            {!isUploaded ? (

                                                <button
                                                    type="button"

                                                    onClick={
                                                        handleUploadResume
                                                    }

                                                    disabled={
                                                        isUploading
                                                    }

                                                    className="
                                                        inline-flex
                                                        min-h-12
                                                        flex-1
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        bg-[var(--primary)]
                                                        px-5
                                                        py-3
                                                        text-sm
                                                        font-bold
                                                        text-white
                                                        shadow-sm
                                                        transition
                                                        hover:opacity-90
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-70
                                                    "
                                                >

                                                    {isUploading ? (

                                                        <>

                                                            <LoaderCircle
                                                                size={18}
                                                                className="animate-spin"
                                                            />

                                                            Uploading Resume...

                                                        </>

                                                    ) : (

                                                        <>

                                                            <UploadCloud
                                                                size={18}
                                                            />

                                                            Upload & Extract Resume

                                                        </>

                                                    )}

                                                </button>

                                            ) : (

                                                <button
                                                    type="button"

                                                    onClick={
                                                        handleParseResume
                                                    }

                                                    disabled={
                                                        isParsing
                                                    }

                                                    className="
                                                        inline-flex
                                                        min-h-12
                                                        flex-1
                                                        items-center
                                                        justify-center
                                                        gap-2
                                                        rounded-xl
                                                        bg-[var(--primary)]
                                                        px-5
                                                        py-3
                                                        text-sm
                                                        font-bold
                                                        text-white
                                                        shadow-sm
                                                        transition
                                                        hover:opacity-90
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-70
                                                    "
                                                >

                                                    {isParsing ? (

                                                        <>

                                                            <LoaderCircle
                                                                size={18}
                                                                className="animate-spin"
                                                            />

                                                            AI is parsing your resume...

                                                        </>

                                                    ) : (

                                                        <>

                                                            <Sparkles
                                                                size={18}
                                                            />

                                                            Parse with AI

                                                        </>

                                                    )}

                                                </button>

                                            )}

                                        </div>

                                    </div>

                                )}


                                {/* Error */}

                                <ErrorToast error={error} />


                                {/* Hidden Input */}

                                <input
                                    ref={fileInputRef}

                                    type="file"

                                    accept=".pdf,.doc,.docx"

                                    onChange={handleInputChange}

                                    className="hidden"
                                />

                            </div>

                        </section>


                        {/* =================================
                            ## HOW IT WORKS
                        ================================= */}

                        <section
                            className="
                                rounded-[2rem]
                                border
                                border-[var(--outline-variant)]
                                bg-[var(--surface-container-lowest)]
                                p-6
                                shadow-[var(--shadow-sm)]
                                sm:p-7
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
                                        h-10
                                        w-10
                                        items-center
                                        justify-center
                                        rounded-2xl
                                        bg-[var(--secondary-fixed)]
                                        text-[var(--secondary)]
                                    "
                                >

                                    <BrainCircuit size={19} />

                                </div>


                                <div>

                                    <h2
                                        className="
                                            font-[var(--font-heading)]
                                            text-lg
                                            font-bold
                                            text-[var(--on-surface)]
                                        "
                                    >

                                        How your resume is processed

                                    </h2>


                                    <p
                                        className="
                                            text-xs
                                            text-[var(--on-surface-variant)]
                                        "
                                    >

                                        From document upload to a structured
                                        professional profile.

                                    </p>

                                </div>

                            </div>


                            <div
                                className="
                                    mt-7
                                    grid
                                    gap-4
                                    sm:grid-cols-2
                                    lg:grid-cols-4
                                "
                            >

                                {[
                                    {
                                        step: "01",
                                        title: "Select",
                                        description:
                                            "Choose your latest resume document.",
                                    },
                                    {
                                        step: "02",
                                        title: "Upload",
                                        description:
                                            "Your file is securely uploaded and stored.",
                                    },
                                    {
                                        step: "03",
                                        title: "Extract",
                                        description:
                                            "The resume text is extracted for processing.",
                                    },
                                    {
                                        step: "04",
                                        title: "AI Parse",
                                        description:
                                            "AI structures your skills, experience and education.",
                                    },
                                ].map((item) => (

                                    <article
                                        key={item.step}

                                        className="
                                            rounded-2xl
                                            bg-[var(--surface-container-low)]
                                            p-4
                                        "
                                    >

                                        <span
                                            className="
                                                text-xs
                                                font-extrabold
                                                text-[var(--primary)]
                                            "
                                        >

                                            {item.step}

                                        </span>


                                        <h3
                                            className="
                                                mt-3
                                                text-sm
                                                font-bold
                                                text-[var(--on-surface)]
                                            "
                                        >

                                            {item.title}

                                        </h3>


                                        <p
                                            className="
                                                mt-2
                                                text-xs
                                                leading-5
                                                text-[var(--on-surface-variant)]
                                            "
                                        >

                                            {item.description}

                                        </p>

                                    </article>

                                ))}

                            </div>

                        </section>

                    </main>


                    {/* =====================================
                        ## SIDEBAR
                    ===================================== */}

                    <aside
                        className="
                            space-y-6
                            xl:sticky
                            xl:top-6
                            xl:h-fit
                        "
                    >


                        {/* =================================
                            ## PROCESSING PROGRESS
                        ================================= */}

                        <section
                            className="
                                overflow-hidden
                                rounded-[2rem]
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
                                    p-6
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
                                            h-10
                                            w-10
                                            items-center
                                            justify-center
                                            rounded-2xl
                                            bg-[var(--primary-fixed)]
                                            text-[var(--primary)]
                                        "
                                    >

                                        <BrainCircuit size={19} />

                                    </div>


                                    <div>

                                        <h2
                                            className="
                                                font-[var(--font-heading)]
                                                text-lg
                                                font-bold
                                                text-[var(--on-surface)]
                                            "
                                        >

                                            Processing Progress

                                        </h2>


                                        <p
                                            className="
                                                text-xs
                                                text-[var(--on-surface-variant)]
                                            "
                                        >

                                            Track your resume preparation

                                        </p>

                                    </div>

                                </div>

                            </div>


                            <div className="p-6">


                                <ProcessingStep
                                    icon={UploadCloud}

                                    title="Resume Selected"

                                    description="Choose a resume from your device."

                                    status={
                                        selectedFile
                                            ? "complete"
                                            : "pending"
                                    }
                                />


                                <ProcessingStep
                                    icon={FileText}

                                    title="Upload & Extract"

                                    description="Upload the document and extract its text."

                                    status={
                                        extractionStatus
                                    }
                                />


                                <ProcessingStep
                                    icon={Sparkles}

                                    title="Parse with AI"

                                    description="Structure your professional information."

                                    status={
                                        parsingStatus
                                    }
                                />


                                <ProcessingStep
                                    icon={CheckCircle2}

                                    title="Profile Ready"

                                    description="Your resume profile is ready to explore."

                                    status={
                                        isParsing
                                            ? "pending"
                                            : uploadedResume
                                                ? "active"
                                                : "pending"
                                    }

                                    isLast
                                />

                            </div>

                        </section>


                        {/* =================================
                            ## SECURITY / INFO
                        ================================= */}

                        <section
                            className="
                                rounded-[2rem]
                                bg-[var(--primary)]
                                p-6
                                text-white
                                shadow-[var(--shadow-md)]
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
                                    bg-white/10
                                "
                            >

                                <ShieldCheck size={21} />

                            </div>


                            <h3
                                className="
                                    mt-5
                                    font-[var(--font-heading)]
                                    text-xl
                                    font-bold
                                "
                            >

                                AI Resume Intelligence

                            </h3>


                            <p
                                className="
                                    mt-3
                                    text-sm
                                    leading-6
                                    text-white/75
                                "
                            >

                                Your resume becomes structured data that
                                can later be used for profile insights and
                                job-specific ATS analysis.

                            </p>


                            <div className="mt-6 space-y-3">

                                {[
                                    "Skills & technologies",
                                    "Experience & positions",
                                    "Projects & achievements",
                                    "Education & certifications",
                                ].map((item) => (

                                    <div
                                        key={item}

                                        className="
                                            flex
                                            items-center
                                            gap-3
                                            text-sm
                                            text-white/90
                                        "
                                    >

                                        <Check
                                            size={16}
                                            className="
                                                shrink-0
                                                text-white/70
                                            "
                                        />

                                        {item}

                                    </div>

                                ))}

                            </div>

                        </section>

                    </aside>

                </div>

            </div>

        </div>

    );

}


export default CreateResume;
