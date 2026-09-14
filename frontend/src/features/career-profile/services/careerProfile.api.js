import api from "../../../lib/axios";

const CAREER_PROFILE_BASE = "/career-profile";

// ==============================
// PROFILE
// ==============================

export const getCareerProfile = async () => {
    const response = await api.get(
        `${CAREER_PROFILE_BASE}/get-career-profile`
    );

    return response.data;
};

export const createCareerProfile = async (data = {}) => {
    const response = await api.post(
        `${CAREER_PROFILE_BASE}/create-career-profile`,
        {
            headline: data.headline || "",
            summary: data.summary || "",
            skills: data.skills || [],
            experiences: data.experiences || [],
            projects: data.projects || [],
            education: data.education || [],
            certifications: data.certifications || [],
        }
    );

    return response.data;
};

export const updateCareerProfile = async (data) => {
    const response = await api.patch(
        `${CAREER_PROFILE_BASE}/update-career-profile`,
        data
    );

    return response.data;
};

export const deleteCareerProfile = async () => {
    const response = await api.delete(
        `${CAREER_PROFILE_BASE}/delete-career-profile`
    );

    return response.data;
};

// ==============================
// SKILLS
// ==============================

export const updateSkills = async (skills) => {
    const response = await api.patch(
        `${CAREER_PROFILE_BASE}/skills`,
        {
            skills,
        }
    );

    return response.data;
};

export const clearSkills = async () => {
    const response = await api.delete(
        `${CAREER_PROFILE_BASE}/skills`
    );

    return response.data;
};

// ==============================
// EXPERIENCE
// ==============================

export const getExperiences = async () => {
    const response = await api.get(
        `${CAREER_PROFILE_BASE}/experience`
    );

    return response.data;
};

export const addExperience = async (data) => {
    const response = await api.post(
        `${CAREER_PROFILE_BASE}/experience`,
        data
    );

    return response.data;
};

export const updateExperience = async (
    experienceId,
    data
) => {
    const response = await api.patch(
        `${CAREER_PROFILE_BASE}/experience/${experienceId}`,
        data
    );

    return response.data;
};

export const deleteExperience = async (
    experienceId
) => {
    const response = await api.delete(
        `${CAREER_PROFILE_BASE}/experience/${experienceId}`
    );

    return response.data;
};

// ==============================
// PROJECTS
// ==============================

export const getProjects = async () => {
    const response = await api.get(
        `${CAREER_PROFILE_BASE}/project`
    );

    return response.data;
};

export const addProject = async (data) => {
    const response = await api.post(
        `${CAREER_PROFILE_BASE}/project`,
        data
    );

    return response.data;
};

export const updateProject = async (
    projectId,
    data
) => {
    const response = await api.patch(
        `${CAREER_PROFILE_BASE}/project/${projectId}`,
        data
    );

    return response.data;
};

export const deleteProject = async (
    projectId
) => {
    const response = await api.delete(
        `${CAREER_PROFILE_BASE}/project/${projectId}`
    );

    return response.data;
};

// ==============================
// EDUCATION
// ==============================

export const getEducation = async () => {
    const response = await api.get(
        `${CAREER_PROFILE_BASE}/education`
    );

    return response.data;
};

export const addEducation = async (data) => {
    const response = await api.post(
        `${CAREER_PROFILE_BASE}/education`,
        data
    );

    return response.data;
};

export const updateEducation = async (
    educationId,
    data
) => {
    const response = await api.patch(
        `${CAREER_PROFILE_BASE}/education/${educationId}`,
        data
    );

    return response.data;
};

export const deleteEducation = async (
    educationId
) => {
    const response = await api.delete(
        `${CAREER_PROFILE_BASE}/education/${educationId}`
    );

    return response.data;
};

// ==============================
// CERTIFICATIONS
// ==============================

export const getCertifications = async () => {
    const response = await api.get(
        `${CAREER_PROFILE_BASE}/certification`
    );

    return response.data;
};

export const addCertification = async (data) => {
    const response = await api.post(
        `${CAREER_PROFILE_BASE}/certification`,
        data
    );

    return response.data;
};

export const updateCertification = async (
    certificationId,
    data
) => {
    const response = await api.patch(
        `${CAREER_PROFILE_BASE}/certification/${certificationId}`,
        data
    );

    return response.data;
};

export const deleteCertification = async (
    certificationId
) => {
    const response = await api.delete(
        `${CAREER_PROFILE_BASE}/certification/${certificationId}`
    );

    return response.data;
};


// ==============================
// RESUME → CAREER PROFILE
// ==============================

export const importFromResume = async (resumeId) => {
    const response = await api.post(
        `${CAREER_PROFILE_BASE}/import-from-resume/${resumeId}`
    );

    return response.data;
};