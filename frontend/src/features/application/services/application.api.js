import api from "../../../lib/axios";


// ---------------------------------------------
// Get all applications
// GET /application/getAll-application
// ---------------------------------------------

export const getAllApplications = async () => {
    return await api.get(
        "/application/getAll-application"
    );
};


// ---------------------------------------------
// Get single application
// GET /application/:applicationId
// ---------------------------------------------

export const getApplication = async (
    applicationId
) => {
    return await api.get(
        `/application/${applicationId}`
    );
};


// ---------------------------------------------
// Create application
// POST /application/create-application
// ---------------------------------------------

export const createApplication = async (
    data
) => {
    return await api.post(
        "/application/create-application",
        data
    );
};


// ---------------------------------------------
// Update application
// PATCH /application/:applicationId
// ---------------------------------------------

export const updateApplication = async (
    applicationId,
    data
) => {
    return await api.patch(
        `/application/${applicationId}`,
        data
    );
};


// ---------------------------------------------
// Delete application
// DELETE /application/:applicationId
// ---------------------------------------------

export const deleteApplication = async (
    applicationId
) => {
    return await api.delete(
        `/application/${applicationId}`
    );
};