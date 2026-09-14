import Resume from "../models/resume.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteFileFromCloudinary, uploadFileToCloudinary } from "../services/cloudinary.service.js";
import { extractResumeText } from "../services/resumeTextExtraction.service.js";
import {
    generateStructuredResponse,
} from "../services/ai/gemini.service.js";

import ResumeParseSchema from "../services/ai/schemas/resumeParse.schema.js";
import buildResumeParsePrompt from "../services/ai/prompts/resumeParse.prompt.js";



/**
 * @Name : uploadResume
 * @POST : /resume/upload
 * @access : Private
 * @description :
 *
 * Uploads a resume file, extracts its text,
 * uploads the original file to Cloudinary,
 * and creates a Resume document.
 *
 */

const uploadResume = asyncHandler(
    async (req, res) => {

        const userId =
            req.user?.userId;


        // =========================================
        // Authentication
        // =========================================

        if (!userId) {

            throw new ApiError(
                401,
                "Authentication required."
            );

        }


        // =========================================
        // Validate File
        // =========================================

        if (!req.file) {

            throw new ApiError(
                400,
                "Resume file is required."
            );

        }


        const file =
            req.file;


        // =========================================
        // Extract Resume Text
        // =========================================

        const extractedText =
            await extractResumeText(
                file
            );


        // =========================================
        // Determine File Type
        // =========================================

        let fileType;


        if (
            file.mimetype ===
            "application/pdf"
        ) {

            fileType = "pdf";

        }

        else if (

            file.mimetype ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

        ) {

            fileType = "docx";

        }


        // =========================================
        // Upload File To Cloudinary
        // =========================================

        const uploadResult =
            await uploadFileToCloudinary(

                file.buffer,

                {

                    resource_type:
                        "raw",

                    folder:
                        "careerflow/resumes",

                    public_id:
                        `${userId}-${Date.now()}`,

                }

            );


        // =========================================
        // Check If User Has Existing Resume
        // =========================================

        const existingResumeCount =
            await Resume.countDocuments({

                userId,

            });


        // =========================================
        // Create Resume
        // =========================================

        const resume =
            await Resume.create({

                userId,

                fileName:
                    file.originalname,

                fileUrl:
                    uploadResult.secure_url,

                cloudinaryPublicId:
                    uploadResult.public_id,

                fileType,

                fileSize:
                    file.size,

                extractedText,

                isPrimary:
                    existingResumeCount === 0,

            });


        // =========================================
        // Response
        // =========================================

        return res.status(201).json(

            new ApiResponse(

                201,

                {
                    resume,
                },

                "Resume uploaded successfully."

            )

        );

    }
);



/**
 * @Name : createResume
 * @POST : /resume/create-resume
 * @access : Private
 * @description :
 * Creates a new resume record for the authenticated user.
 *
 * The actual resume file is assumed to have already been uploaded and
 * its URL is provided through the request body. The resume can also
 * contain extracted text, parsed resume data, and ATS analysis.
 */
const createResume = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    const {
        fileName,
        fileUrl,
        fileType,
        fileSize,
        extractedText,
        parsedData,
        isPrimary,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (
        !fileName ||
        !fileUrl ||
        !fileType ||
        fileSize === undefined
    ) {
        throw new ApiError(
            400,
            "File name, file URL, file type and file size are required."
        );
    }

    /**
     * If this resume is being marked as primary,
     * remove the primary status from the user's previous resume.
     */
    if (isPrimary === true) {
        await Resume.updateMany(
            {
                userId,
                isPrimary: true,
            },
            {
                $set: {
                    isPrimary: false,
                },
            }
        );
    }

    const resume = await Resume.create({
        userId,
        fileName,
        fileUrl,
        fileType,
        fileSize,
        extractedText,
        parsedData,
        isPrimary,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                resume,
            },
            "Resume created successfully."
        )
    );
});

/**
 * @Name : getResumes
 * @GET : /resume/getAll-resume
 * @access : Private
 * @description :
 * Retrieves all resumes belonging to the authenticated user.
 */
const getResumes = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const resumes = await Resume.find({
        userId,
    }).sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                resumes,
            },
            "Resumes retrieved successfully."
        )
    );
});

/**
 * @Name : getResume
 * @GET : /resume/:resumeId
 * @access : Private
 * @description :
 * Retrieves a specific resume belonging to the authenticated user.
 */
const getResume = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    const {
        resumeId,
    } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!resumeId) {
        throw new ApiError(
            400,
            "Resume ID is required."
        );
    }

    const resume = await Resume.findOne({
        _id: resumeId,
        userId,
    });

    if (!resume) {
        throw new ApiError(
            404,
            "Resume not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                resume,
            },
            "Resume retrieved successfully."
        )
    );
});

/**
 * @Name : updateResume
 * @PATCH : /resume/:resumeId
 * @access : Private
 * @description :
 * Updates the editable information of a specific resume.
 *
 * The resume must belong to the authenticated user.
 */
const updateResume = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    const {
        resumeId,
    } = req.params;

    const {
        fileName,
        fileUrl,
        fileType,
        fileSize,
        extractedText,
        parsedData,
        isPrimary,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!resumeId) {
        throw new ApiError(
            400,
            "Resume ID is required."
        );
    }

    /**
     * If the resume is being made primary,
     * remove primary status from all other resumes.
     */
    if (isPrimary === true) {
        await Resume.updateMany(
            {
                userId,
                _id: {
                    $ne: resumeId,
                },
                isPrimary: true,
            },
            {
                $set: {
                    isPrimary: false,
                },
            }
        );
    }

    const updateData = {};

    if (fileName !== undefined) {
        updateData.fileName = fileName;
    }

    if (fileUrl !== undefined) {
        updateData.fileUrl = fileUrl;
    }

    if (fileType !== undefined) {
        updateData.fileType = fileType;
    }

    if (fileSize !== undefined) {
        updateData.fileSize = fileSize;
    }

    if (extractedText !== undefined) {
        updateData.extractedText = extractedText;
    }

    if (parsedData !== undefined) {
        updateData.parsedData = parsedData;
    }

    if (isPrimary !== undefined) {
        updateData.isPrimary = isPrimary;
    }

    const resume = await Resume.findOneAndUpdate(
        {
            _id: resumeId,
            userId,
        },
        {
            $set: updateData,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!resume) {
        throw new ApiError(
            404,
            "Resume not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                resume,
            },
            "Resume updated successfully."
        )
    );
});

/**
 * @Name : setPrimaryResume
 * @PATCH : /resume/:resumeId/primary
 * @access : Private
 * @description :
 * Sets a specific resume as the authenticated user's primary resume.
 *
 * Any previously primary resume is automatically changed to non-primary.
 */
const setPrimaryResume = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    const {
        resumeId,
    } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!resumeId) {
        throw new ApiError(
            400,
            "Resume ID is required."
        );
    }

    /**
     * First check if the selected resume exist 
     * if yes - set all resume isPrimary: false and the current to true
     * if no - Throw an error
     */
    const resume = await Resume.findOne({
        _id: resumeId,
        userId,
    });

    if (!resume) {
        throw new ApiError(
            404,
            "Resume not found."
        );
    }

    await Resume.updateMany(
        {
            userId,
            _id: { $ne: resumeId },
        },
        {
            $set: {
                isPrimary: false,
            },
        }
    );

    resume.isPrimary = true;

    await resume.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                resume,
            },
            "Primary resume updated successfully."
        )
    );
});

/**
 * @Name : deleteResume
 * @DELETE : /resume/:resumeId
 * @access : Private
 * @description :
 * Deletes a specific resume belonging to the authenticated user.
 */
const deleteResume = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    const {
        resumeId,
    } = req.params;


    // =============================================
    // Authentication Check
    // =============================================

    if (!userId) {

        throw new ApiError(
            401,
            "Authentication required."
        );

    }


    // =============================================
    // Resume ID Check
    // =============================================

    if (!resumeId) {

        throw new ApiError(
            400,
            "Resume ID is required."
        );

    }


    // =============================================
    // Find Resume First
    // =============================================

    const resume = await Resume.findOne({
        _id: resumeId,
        userId,
    });


    if (!resume) {

        throw new ApiError(
            404,
            "Resume not found."
        );

    }


    // =============================================
    // Delete File From Cloudinary
    // =============================================

    if (resume.cloudinaryPublicId) {

        await deleteFileFromCloudinary(
            resume.cloudinaryPublicId,
            "raw"
        );

    }


    // =============================================
    // Delete Resume From Database
    // =============================================

    await Resume.deleteOne({
        _id: resumeId,
    });


    // =============================================
    // Response
    // =============================================

    return res.status(200).json(

        new ApiResponse(
            200,
            null,
            "Resume deleted successfully."
        )

    );

});





/**
 * @Name : parseResume
 * @POST : /resume/:resumeId/parse
 * @description :
 *
 * Uses AI to convert extracted resume text
 * into structured resume information.
 *
 * @access : Private
 *
 */

const parseResume = asyncHandler(
    async (req, res) => {

        const userId =
            req.user?.userId;

        const {
            resumeId,
        } = req.params;


        // =========================================
        // Authentication
        // =========================================

        if (!userId) {

            throw new ApiError(
                401,
                "Authentication required."
            );

        }


        // =========================================
        // Find Resume
        // =========================================

        const resume =
            await Resume.findOne({

                _id:
                    resumeId,

                userId,

            });


        if (!resume) {

            throw new ApiError(
                404,
                "Resume not found."
            );

        }


        // =========================================
        // Validate Extracted Text
        // =========================================

        if (
            !resume.extractedText?.trim()
        ) {

            throw new ApiError(
                400,
                "Resume text is not available for AI parsing."
            );

        }


        // =========================================
        // Build AI Prompt
        // =========================================

        const prompt =
            buildResumeParsePrompt(

                resume.extractedText

            );


        // =========================================
        // Generate Structured Resume Data
        // =========================================

        const parsedData =
            await generateStructuredResponse(

                prompt,

                ResumeParseSchema

            );


        // =========================================
        // Save Parsed Data
        // =========================================

        resume.parsedData =
            parsedData;

        await resume.save();


        // =========================================
        // Response
        // =========================================

        return res.status(200).json(

            new ApiResponse(

                200,

                {

                    parsedData:
                        resume.parsedData,

                },

                "Resume parsed successfully."

            )

        );

    }
);



export {
    uploadResume,
    createResume,
    getResumes,
    getResume,
    updateResume,
    setPrimaryResume,
    deleteResume,
    parseResume,
};
