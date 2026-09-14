import express from "express";

import {
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
} from "../controllers/jobWorkspace.controller.js";

import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();


/**
 * @GET :/ getAll-jobWorkspaces
 * @description :
 * Retrieves all job workspaces belonging to the authenticated user.
 * @access : Private
 */
router.get("/getAll-jobWorkspaces", authenticate, getJobWorkspaces);


/**
 * @GET : /:jobId
 * @description :
 * Retrieves a specific job workspace belonging to the authenticated user.
 * @access : Private
 */
router.get("/:jobId", authenticate, getJobWorkspace);


/**
 * @POST : /create-jobWorkspaces
 * @description :
 * Creates a new job workspace for the authenticated user.
 * @access : Private
 */
router.post("/create-jobWorkspaces", authenticate, createJobWorkspace);


/**
 * @PATCH : /:jobId
 * @description :
 * Updates the basic information of an existing job workspace.
 * @access : Private
 */
router.patch("/:jobId", authenticate, updateJobWorkspace);


/**
 * @DELETE : /:jobId
 * @description :
 * Permanently deletes a specific job workspace.
 * @access : Private
 */
router.delete("/:jobId", authenticate, deleteJobWorkspace);


/**
 * @PATCH : /:jobId/status
 * @description :
 * Updates the active or archived status of a job workspace.
 * @access : Private
 */
router.patch("/:jobId/status", authenticate, updateJobWorkspaceStatus);


/**
 * @PATCH : /:jobId/analysis
 * @description :
 * Updates the job analysis information for a specific job workspace.
 * @access : Private
 */
router.patch("/:jobId/analysis", authenticate, updateJobAnalysis);

/**
 * @PATCH : /:jobId/analyze
 * @description :
 * Analyzes the job description using Gemini and stores the
 * structured AI-generated job analysis.
 * @access : Private
 */
router.post("/:jobId/analyze", authenticate, analyzeJobWorkspace);


/**
 * @PATCH : /:jobId/match
 * @description :
 * Analyzes the job description using Gemini and stores the
 * structured AI-generated job analysis.
 * @access : Private
 */
router.post("/:jobId/match", authenticate, analyzeJobMatch);


/**
 * @POST : /job-workspaces/:jobId/skill-gaps/analyze
 * @description :
 * Uses Gemini to identify and prioritize the candidate's
 * skill gaps for a specific job.
 * @access : Private
 */
router.post("/:jobId/skill-gaps/analyze", authenticate, analyzeSkillGaps);


/**
 * @PATCH : /:jobId/match
 * @description :
 * Updates the user's profile-to-job matching analysis.
 * @access : Private
 */
router.patch("/:jobId/match", authenticate, updateJobMatch);


/**
 * @PATCH : /:jobId/skill-gaps
 * @description :
 * Replaces the skill-gap analysis for a specific job workspace.
 * @access : Private
 */
router.patch("/:jobId/skill-gaps", authenticate, updateSkillGaps);

/**
 * @POST : /:jobId/resume-ats/analyze
 * @description :
 * analyse resume ATS using AI
 * @access : Private
 */
router.post("/:jobId/resume-ats/analyze", authenticate, analyzeResumeATS);


export default router;