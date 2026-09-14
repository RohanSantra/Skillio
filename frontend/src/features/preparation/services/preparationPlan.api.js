import api from "../../../lib/axios";

const PREPARATION_PLAN_ENDPOINT = "/preparation-plan";

// ---------------------------------------------
// Get all preparation plans
// GET /preparation-plan/getAll-preparation-plan
// ---------------------------------------------

export const getAllPreparationPlans =
    async () => {

        return await api.get(
            `${PREPARATION_PLAN_ENDPOINT}/getAll-preparation-plan`
        );

    };


// ---------------------------------------------
// Get single preparation plan
// GET /preparation-plan/:planId
// ---------------------------------------------

export const getPreparationPlan =
    async (planId) => {

        return await api.get(
            `${PREPARATION_PLAN_ENDPOINT}/${planId}`
        );

    };


// ---------------------------------------------
// Create preparation plan
// POST /preparation-plan/create-preparation-plan
// ---------------------------------------------

export const createPreparationPlan =
    async (data) => {

        return await api.post(
            `${PREPARATION_PLAN_ENDPOINT}/create-preparation-plan`,
            data
        );

    };


// ---------------------------------------------
// Update preparation plan
// PATCH /preparation-plan/:planId
// ---------------------------------------------

export const updatePreparationPlan =
    async (
        planId,
        data
    ) => {

        return await api.patch(
            `${PREPARATION_PLAN_ENDPOINT}/${planId}`,
            data
        );

    };


// ---------------------------------------------
// Delete preparation plan
// DELETE /preparation-plan/:planId
// ---------------------------------------------

export const deletePreparationPlan =
    async (planId) => {

        return await api.delete(
            `${PREPARATION_PLAN_ENDPOINT}/${planId}`
        );

    };


// ---------------------------------------------
// Add task
// POST /preparation-plan/:planId/tasks
// ---------------------------------------------

export const addPreparationTask =
    async (
        planId,
        data
    ) => {

        return await api.post(
            `${PREPARATION_PLAN_ENDPOINT}/${planId}/tasks`,
            data
        );

    };


// ---------------------------------------------
// Update task
// PATCH /preparation-plan/:planId/tasks/:taskId
// ---------------------------------------------

export const updatePreparationTask =
    async (
        planId,
        taskId,
        data
    ) => {

        return await api.patch(
            `${PREPARATION_PLAN_ENDPOINT}/${planId}/tasks/${taskId}`,
            data
        );

    };


// ---------------------------------------------
// Delete task
// DELETE /preparation-plan/:planId/tasks/:taskId
// ---------------------------------------------

export const deletePreparationTask =
    async (
        planId,
        taskId
    ) => {

        return await api.delete(
            `${PREPARATION_PLAN_ENDPOINT}/${planId}/tasks/${taskId}`
        );

    };


// ---------------------------------------------
// Generate AI preparation plan
// POST /preparation-plan/:jobId/generate
// ---------------------------------------------

export const generatePreparationPlan =
    async (jobId) => {

        return await api.post(
            `${PREPARATION_PLAN_ENDPOINT}/${jobId}/generate`
        );

    };
