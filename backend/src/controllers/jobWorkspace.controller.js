import JobWorkspace from "../models/jobWorkspace.model.js";
import CareerProfile from "../models/careerProfile.model.js";
import Resume from "../models/resume.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
    generateStructuredResponse,
} from "../services/ai/gemini.service.js";

import JobAnalysisSchema from "../services/ai/schemas/jobAnalysis.schema.js";
import buildJobAnalysisPrompt from "../services/ai/prompts/jobAnalysis.prompt.js";

import JobMatchSchema from "../services/ai/schemas/jobMatch.schema.js";
import buildJobMatchPrompt from "../services/ai/prompts/jobMatch.prompt.js";

import SkillGapSchema from "../services/ai/schemas/skillGap.schema.js";
import buildSkillGapPrompt from "../services/ai/prompts/skillGap.prompt.js";

import ResumeATSSchema from "../services/ai/schemas/resumeATS.schema.js";
import buildResumeATSPrompt from "../services/ai/prompts/resumeATS.prompt.js";


/**
 * @Name : getJobWorkspaces
 * @GET : /job-workspaces/getAll-jobWorkspaces
 * @access : Private
 * @description :
 * Retrieves all job workspaces belonging to the authenticated user.
 *
 * Only workspaces owned by the authenticated user are returned.
 */
const getJobWorkspaces = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const jobWorkspaces = await JobWorkspace.find({
        userId,
    }).sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobWorkspaces,
            },
            "Job workspaces retrieved successfully."
        )
    );
});


/**
 * @Name : getJobWorkspace
 * @GET : /job-workspaces/:jobId
 * @access : Private
 * @description :
 * Retrieves a specific job workspace belonging to the authenticated user.
 *
 * The userId is included in the database query so that a user cannot
 * access another user's job workspace by knowing its ID.
 */
const getJobWorkspace = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const jobWorkspace = await JobWorkspace.findOne({
        _id: jobId,
        userId,
    });

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobWorkspace,
            },
            "Job workspace retrieved successfully."
        )
    );
});


/**
 * @Name : createJobWorkspace
 * @POST : /job-workspaces/create-jobWorkspaces
 * @access : Private
 * @description :
 * Creates a new job workspace for the authenticated user.
 *
 * The workspace stores the basic job information that will later be used
 * for job analysis, profile matching, skill-gap identification,
 * interview preparation, and career assistance.
 */
const createJobWorkspace = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const {
        company,
        role,
        jobDescription,
        source,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!company || !role || !jobDescription) {
        throw new ApiError(
            400,
            "Company, role and job description are required."
        );
    }

    /*
     * Step 1:
     * Create the basic job workspace.
     */
    const jobWorkspace = await JobWorkspace.create({
        userId,
        company,
        role,
        jobDescription,
        source,
    });

    /*
     * Step 2:
     * Build the AI analysis prompt.
     */
    const prompt = buildJobAnalysisPrompt(
        jobDescription
    );

    /*
     * Step 3:
     * Ask Gemini to analyze the job description.
     *
     * The Zod schema controls and validates
     * the expected structure.
     */
    const jobAnalysis =
        await generateStructuredResponse(
            prompt,
            JobAnalysisSchema
        );

    /*
     * Step 4:
     * Store the AI-generated analysis.
     */
    jobWorkspace.jobAnalysis = {
        ...jobAnalysis,
        analyzedAt: new Date(),
    };

    await jobWorkspace.save();

    /*
     * Step 5:
     * Return the complete workspace.
     */
    return res.status(201).json(
        new ApiResponse(
            201,
            {
                jobWorkspace,
            },
            "Job workspace created and analyzed successfully."
        )
    );
});


/**
 * @Name : updateJobWorkspace
 * @PATCH : /job-workspaces/:jobId
 * @access : Private
 * @description :
 * Updates the basic information of an existing job workspace.
 *
 * Only the workspace owner can update the workspace.
 */
const updateJobWorkspace = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    const {
        company,
        role,
        jobDescription,
        source,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const jobWorkspace = await JobWorkspace.findOne({
        _id: jobId,
        userId,
    });

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    if (company !== undefined) {
        jobWorkspace.company = company;
    }

    if (role !== undefined) {
        jobWorkspace.role = role;
    }

    if (jobDescription !== undefined) {
        jobWorkspace.jobDescription = jobDescription;
        jobWorkspace.jobAnalysis = {
            summary: "",
            responsibilities: [],
            requiredSkills: [],
            preferredSkills: [],
            experienceRequired: "",
            educationRequired: "",
            keywords: [],
            analyzedAt: null,
        };

        jobWorkspace.jobMatch = {
            score: null,
            matchedSkills: [],
            missingSkills: [],
            strengths: [],
            analyzedAt: null,
        };

        jobWorkspace.skillGaps = [];

        jobWorkspace.resumeATSAnalysis = {
            resumeId: null,
            score: null,
            matchedKeywords: [],
            missingKeywords: [],
            strengths: [],
            weaknesses: [],
            suggestions: [],
            analyzedAt: null,
        };
    }

    if (source !== undefined) {
        jobWorkspace.source = source;
    }

    await jobWorkspace.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobWorkspace,
            },
            "Job workspace updated successfully."
        )
    );
});


/**
 * @Name : deleteJobWorkspace
 * @DELETE : /job-workspaces/:jobId
 * @access : Private
 * @description :
 * Permanently deletes a job workspace belonging to the authenticated user.
 *
 * Related documents such as preparation plans, interview sessions,
 * conversations, and applications are not deleted automatically here.
 */
const deleteJobWorkspace = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const jobWorkspace = await JobWorkspace.findOneAndDelete({
        _id: jobId,
        userId,
    });

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Job workspace deleted successfully."
        )
    );
});


/**
 * @Name : updateJobWorkspaceStatus
 * @PATCH : /job-workspaces/:jobId/status
 * @access : Private
 * @description :
 * Updates the status of a job workspace.
 *
 * A workspace can be either active or archived.
 */
const updateJobWorkspaceStatus = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { jobId } = req.params;
    const { status } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!status || !["active", "archived"].includes(status)) {
        throw new ApiError(
            400,
            "Status must be either active or archived."
        );
    }

    const jobWorkspace = await JobWorkspace.findOneAndUpdate(
        {
            _id: jobId,
            userId,
        },
        {
            $set: {
                status,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobWorkspace,
            },
            "Job workspace status updated successfully."
        )
    );
});


/**
 * @Name : updateJobAnalysis
 * @PATCH : /job-workspaces/:jobId/analysis
 * @access : Private
 * @description :
 * Updates the AI-generated job analysis for a specific job workspace.
 *
 * This endpoint stores structured information extracted from the job
 * description, such as responsibilities, required skills, preferred skills,
 * experience requirements, education requirements, and keywords.
 */
const updateJobAnalysis = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    const {
        summary,
        responsibilities,
        requiredSkills,
        preferredSkills,
        experienceRequired,
        educationRequired,
        keywords,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const jobWorkspace = await JobWorkspace.findOne({
        _id: jobId,
        userId,
    });

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    jobWorkspace.jobAnalysis = {
        summary: summary ?? jobWorkspace.jobAnalysis?.summary ?? "",
        responsibilities:
            responsibilities ??
            jobWorkspace.jobAnalysis?.responsibilities ??
            [],
        requiredSkills:
            requiredSkills ??
            jobWorkspace.jobAnalysis?.requiredSkills ??
            [],
        preferredSkills:
            preferredSkills ??
            jobWorkspace.jobAnalysis?.preferredSkills ??
            [],
        experienceRequired:
            experienceRequired ??
            jobWorkspace.jobAnalysis?.experienceRequired ??
            "",
        educationRequired:
            educationRequired ??
            jobWorkspace.jobAnalysis?.educationRequired ??
            "",
        keywords:
            keywords ??
            jobWorkspace.jobAnalysis?.keywords ??
            [],
        analyzedAt: new Date(),
    };

    await jobWorkspace.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobAnalysis: jobWorkspace.jobAnalysis,
            },
            "Job analysis updated successfully."
        )
    );
});


/**
 * @Name : analyzeJobWorkspace
 * @POST : /job-workspaces/:jobId/analyze
 * @access : Private
 * @description :
 * Analyzes the job description using Gemini and stores the
 * structured AI-generated job analysis.
 */
const analyzeJobWorkspace = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const jobWorkspace = await JobWorkspace.findOne({
        _id: jobId,
        userId,
    });

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    if (!jobWorkspace.jobDescription) {
        throw new ApiError(
            400,
            "Job description is required for analysis."
        );
    }

    /*
     * Build the AI prompt using the current
     * job description.
     */
    const prompt = buildJobAnalysisPrompt(
        jobWorkspace.jobDescription
    );

    /*
     * Generate and validate the structured
     * Gemini response.
     */
    const jobAnalysis =
        await generateStructuredResponse(
            prompt,
            JobAnalysisSchema
        );

    /*
     * Store the new AI analysis.
     */
    jobWorkspace.jobAnalysis = {
        ...jobAnalysis,
        analyzedAt: new Date(),
    };

    await jobWorkspace.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobAnalysis: jobWorkspace.jobAnalysis,
            },
            "Job workspace analyzed successfully."
        )
    );
});


/**
 * @Name : analyzeJobMatch
 * @POST : /job-workspaces/:jobId/match
 * @access : Private
 * @description :
 * Analyzes the job description using Gemini and stores the
 * structured AI-generated job analysis.
 */
const analyzeJobMatch = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const jobWorkspace = await JobWorkspace.findOne({
        _id: jobId,
        userId,
    });

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found. Please create your career profile before analyzing job match."
        );
    }

    const prompt = buildJobMatchPrompt({
        careerProfile,
        jobWorkspace,
    });

    const jobMatch =
        await generateStructuredResponse(
            prompt,
            JobMatchSchema
        );

    jobWorkspace.jobMatch = {
        ...jobMatch,
        analyzedAt: new Date(),
    };

    await jobWorkspace.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobMatch: jobWorkspace.jobMatch,
            },
            "Job match analyzed successfully."
        )
    );
});


/**
 * @Name : analyzeSkillGaps
 * @POST : /job-workspaces/:jobId/skill-gaps/analyze
 * @access : Private
 * @description :
 * Uses Gemini to identify and prioritize the candidate's
 * skill gaps for a specific job.
 */
const analyzeSkillGaps = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const jobWorkspace = await JobWorkspace.findOne({
        _id: jobId,
        userId,
    });

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    if (!jobWorkspace.jobAnalysis?.analyzedAt) {
        throw new ApiError(
            400,
            "Job analysis is required before analyzing skill gaps."
        );
    }

    const prompt = buildSkillGapPrompt({
        careerProfile,
        jobWorkspace,
    });

    const result =
        await generateStructuredResponse(
            prompt,
            SkillGapSchema
        );

    jobWorkspace.skillGaps = result.skillGaps;

    await jobWorkspace.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                skillGaps: jobWorkspace.skillGaps,
            },
            "Skill gaps analyzed successfully."
        )
    );
});


/**
 * @Name : updateJobMatch
 * @PATCH : /job-workspaces/:jobId/match
 * @access : Private
 * @description :
 * Updates the profile-to-job matching analysis for a job workspace.
 *
 * Stores the match score, matched skills, missing skills, and identified
 * strengths between the user's career profile and the selected job.
 */
const updateJobMatch = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    const {
        score,
        matchedSkills,
        missingSkills,
        strengths,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const jobWorkspace = await JobWorkspace.findOne({
        _id: jobId,
        userId,
    });

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    if (
        score !== undefined &&
        (typeof score !== "number" || score < 0 || score > 100)
    ) {
        throw new ApiError(
            400,
            "Score must be a number between 0 and 100."
        );
    }

    jobWorkspace.jobMatch = {
        score:
            score ??
            jobWorkspace.jobMatch?.score ??
            null,

        matchedSkills:
            matchedSkills ??
            jobWorkspace.jobMatch?.matchedSkills ??
            [],

        missingSkills:
            missingSkills ??
            jobWorkspace.jobMatch?.missingSkills ??
            [],

        strengths:
            strengths ??
            jobWorkspace.jobMatch?.strengths ??
            [],

        analyzedAt: new Date(),
    };

    await jobWorkspace.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                jobMatch: jobWorkspace.jobMatch,
            },
            "Job match updated successfully."
        )
    );
});


/**
 * @Name : updateSkillGaps
 * @PATCH : /job-workspaces/:jobId/skill-gaps
 * @access : Private
 * @description :
 * Replaces the skill-gap analysis for a specific job workspace.
 *
 * Each skill gap contains its importance, reason, and recommendation
 * for improving the user's suitability for the selected job.
 */
const updateSkillGaps = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { jobId } = req.params;
    const { skillGaps } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!Array.isArray(skillGaps)) {
        throw new ApiError(
            400,
            "skillGaps must be an array."
        );
    }

    const jobWorkspace = await JobWorkspace.findOne({
        _id: jobId,
        userId,
    });

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    jobWorkspace.skillGaps = skillGaps;

    await jobWorkspace.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                skillGaps: jobWorkspace.skillGaps,
            },
            "Skill gaps updated successfully."
        )
    );
});



/**
 * @NAME : analyzeResumeATS
 * @POST : /:jobId/resume-ats/analyze
 * @access : Private
 * @description :
 * analyse resume ATS using AI
 */
const analyzeResumeATS = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { jobId } = req.params;

    const { resumeId } = req.body;

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

    /*
     * Step 1:
     * Find the job workspace.
     */
    const jobWorkspace = await JobWorkspace.findOne({
        _id: jobId,
        userId,
    });

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    /*
     * Step 2:
     * Find the user's resume.
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

    /*
     * Step 3:
     * Ensure resume text exists.
     */
    if (!resume.extractedText) {
        throw new ApiError(
            400,
            "Resume text has not been extracted yet."
        );
    }

    /*
     * Step 4:
     * Ensure job analysis exists.
     */
    if (!jobWorkspace.jobAnalysis?.analyzedAt) {
        throw new ApiError(
            400,
            "Job analysis is required before ATS analysis."
        );
    }

    /*
     * Step 5:
     * Build AI prompt.
     */
    const prompt = buildResumeATSPrompt({
        resume,
        jobWorkspace,
    });

    /*
     * Step 6:
     * Generate ATS analysis.
     */
    const atsAnalysis =
        await generateStructuredResponse(
            prompt,
            ResumeATSSchema
        );

    /*
     * Step 7:
     * Store analysis inside JobWorkspace.
     */
    jobWorkspace.resumeATSAnalysis = {
        resumeId: resume._id,

        score: atsAnalysis.score,

        matchedKeywords:
            atsAnalysis.matchedKeywords,

        missingKeywords:
            atsAnalysis.missingKeywords,

        strengths:
            atsAnalysis.strengths,

        weaknesses:
            atsAnalysis.weaknesses,

        suggestions:
            atsAnalysis.suggestions,

        analyzedAt: new Date(),
    };

    await jobWorkspace.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                resumeATSAnalysis:
                    jobWorkspace.resumeATSAnalysis,
            },
            "Resume ATS analysis completed successfully."
        )
    );
});

export {
    getJobWorkspaces,
    getJobWorkspace,
    createJobWorkspace,
    updateJobWorkspace,
    deleteJobWorkspace,
    updateJobWorkspaceStatus,
    updateJobAnalysis,
    analyzeJobWorkspace,
    analyzeJobMatch,
    analyzeSkillGaps,
    updateJobMatch,
    updateSkillGaps,
    analyzeResumeATS
};