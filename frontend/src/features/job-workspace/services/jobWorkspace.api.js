import api from "../../../lib/axios";


// ---------------------------------------------
// Get all job workspaces
// GET /job-workspaces/getAll-jobWorkspaces
// ---------------------------------------------

export const getAllJobWorkspaces = async () => {
    return await api.get(
        "/job-workspaces/getAll-jobWorkspaces"
    );
};


// ---------------------------------------------
// Get single job workspace
// GET /job-workspaces/:jobId
// ---------------------------------------------

export const getJobWorkspace = async (jobId) => {
    return await api.get(
        `/job-workspaces/${jobId}`
    );
};


// ---------------------------------------------
// Create job workspace
// POST /job-workspaces/create-jobWorkspaces
// ---------------------------------------------

export const createJobWorkspace = async (data) => {
    return await api.post(
        "/job-workspaces/create-jobWorkspaces",
        data
    );
};


// ---------------------------------------------
// Update job workspace
// PATCH /job-workspaces/:jobId
// ---------------------------------------------

export const updateJobWorkspace = async (
    jobId,
    data
) => {
    return await api.patch(
        `/job-workspaces/${jobId}`,
        data
    );
};


// ---------------------------------------------
// Delete job workspace
// DELETE /job-workspaces/:jobId
// ---------------------------------------------

export const deleteJobWorkspace = async (
    jobId
) => {
    return await api.delete(
        `/job-workspaces/${jobId}`
    );
};


// ---------------------------------------------
// Update workspace status
// PATCH /job-workspaces/:jobId/status
// ---------------------------------------------

export const updateJobWorkspaceStatus = async (
    jobId,
    status
) => {
    return await api.patch(
        `/job-workspaces/${jobId}/status`,
        {
            status,
        }
    );
};


// ---------------------------------------------
// Update job analysis manually
// PATCH /job-workspaces/:jobId/analysis
// ---------------------------------------------

export const updateJobAnalysis = async (
    jobId,
    data
) => {
    return await api.patch(
        `/job-workspaces/${jobId}/analysis`,
        data
    );
};


// ---------------------------------------------
// Analyze job using AI
// POST /job-workspaces/:jobId/analyze
// ---------------------------------------------

export const analyzeJobWorkspace = async (
    jobId
) => {
    return await api.post(
        `/job-workspaces/${jobId}/analyze`
    );
};


// ---------------------------------------------
// Analyze job match
// POST /job-workspaces/:jobId/match
// ---------------------------------------------

export const analyzeJobMatch = async (
    jobId
) => {
    return await api.post(
        `/job-workspaces/${jobId}/match`
    );
};


// ---------------------------------------------
// Analyze skill gaps
// POST /job-workspaces/:jobId/skill-gaps/analyze
// ---------------------------------------------

export const analyzeSkillGaps = async (
    jobId
) => {
    return await api.post(
        `/job-workspaces/${jobId}/skill-gaps/analyze`
    );
};


// ---------------------------------------------
// Update job match manually
// PATCH /job-workspaces/:jobId/match
// ---------------------------------------------

export const updateJobMatch = async (
    jobId,
    data
) => {
    return await api.patch(
        `/job-workspaces/${jobId}/match`,
        data
    );
};


// ---------------------------------------------
// Update skill gaps manually
// PATCH /job-workspaces/:jobId/skill-gaps
// ---------------------------------------------

export const updateSkillGaps = async (
    jobId,
    skillGaps
) => {
    return await api.patch(
        `/job-workspaces/${jobId}/skill-gaps`,
        {
            skillGaps,
        }
    );
};


// ---------------------------------------------
// Analyze resume ATS for a job workspace
// POST /job-workspaces/:jobId/resume-ats/analyze
// ---------------------------------------------

export const analyzeResumeATS = async (
    jobId,
    resumeId
) => {

    return await api.post(
        `/job-workspaces/${jobId}/resume-ats/analyze`,
        {
            resumeId,
        }
    );

};