import api from "../../../lib/axios";


// =============================================
// Upload Resume File
//
// POST /resume/upload
// =============================================

export const uploadResume = async (file) => {

    const formData = new FormData();
    formData.append("resume", file);

    return await api.post(
        "/resume/upload",
        formData,
        {
            // Let Axios/browser create the multipart boundary; the default
            // JSON header on the shared API client is not valid for a file.
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

};

// ---------------------------------------------
// Get all resumes
// GET /resume/getAll-resume
// ---------------------------------------------

export const getAllResumes = async () => {
    return await api.get("/resume/getAll-resume");
};


// ---------------------------------------------
// Get single resume
// GET /resume/:resumeId
// ---------------------------------------------

export const getResume = async (resumeId) => {
    return await api.get(`/resume/${resumeId}`);
};


// ---------------------------------------------
// Create resume
// POST /resume/create-resume
// ---------------------------------------------

export const createResume = async (data) => {
    return await api.post("/resume/create-resume", data);
};


// ---------------------------------------------
// Update resume
// PATCH /resume/:resumeId
// ---------------------------------------------

export const updateResume = async (resumeId, data) => {
    return await api.patch(`/resume/${resumeId}`, data);
};


// ---------------------------------------------
// Set primary resume
// PATCH /resume/:resumeId/primary
// ---------------------------------------------

export const setPrimaryResume = async (resumeId) => {
    return await api.patch(`/resume/${resumeId}/primary`);
};


// ---------------------------------------------
// Delete resume
// DELETE /resume/:resumeId
// ---------------------------------------------

export const deleteResume = async (resumeId) => {
    return await api.delete(`/resume/${resumeId}`);
};


// ---------------------------------------------
// Parse resume using AI
// POST /resume/:resumeId/parse
// ---------------------------------------------

export const parseResume = async (resumeId) => {
    return await api.post(`/resume/${resumeId}/parse`);
};


