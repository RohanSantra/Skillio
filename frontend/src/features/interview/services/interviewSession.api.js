import api from "../../../lib/axios";

/**
 * Interview Session API Service
 */

/**
 * Get all interview sessions
 */
export const getInterviewSessionsApi = async () => {
    const response = await api.get(
        "/interview-session/getAll-interview-session"
    );

    return response.data;
};


/**
 * Get a single interview session
 */
export const getInterviewSessionApi = async (
    sessionId
) => {
    const response = await api.get(
        `/interview-session/${sessionId}`
    );

    return response.data;
};


/**
 * Create interview session manually
 */
export const createInterviewSessionApi = async (
    data
) => {
    const response = await api.post(
        "/interview-session/create-interview-session",
        data
    );

    return response.data;
};


/**
 * Update interview session
 */
export const updateInterviewSessionApi = async (
    sessionId,
    data
) => {
    const response = await api.patch(
        `/interview-session/${sessionId}`,
        data
    );

    return response.data;
};


/**
 * Delete interview session
 */
export const deleteInterviewSessionApi = async (
    sessionId
) => {
    const response = await api.delete(
        `/interview-session/${sessionId}`
    );

    return response.data;
};


/**
 * Add a question manually
 */
export const addInterviewQuestionApi = async (
    sessionId,
    data
) => {
    const response = await api.post(
        `/interview-session/${sessionId}/questions`,
        data
    );

    return response.data;
};


/**
 * Update interview question
 *
 * Uses questionId.
 */
export const updateInterviewQuestionApi = async (
    sessionId,
    questionId,
    data
) => {
    const response = await api.patch(
        `/interview-session/${sessionId}/questions/${questionId}`,
        data
    );

    return response.data;
};


/**
 * Delete interview question
 *
 * Uses questionId.
 */
export const deleteInterviewQuestionApi = async (
    sessionId,
    questionId
) => {
    const response = await api.delete(
        `/interview-session/${sessionId}/questions/${questionId}`
    );

    return response.data;
};


/**
 * Generate AI interview questions
 */
export const generateInterviewQuestionsApi = async (
    data
) => {
    const response = await api.post(
        "/interview-session",
        data
    );

    return response.data;
};


/**
 * Evaluate a user's interview answer
 */
export const evaluateInterviewAnswerApi = async (
    sessionId,
    questionId,
    data
) => {
    const response = await api.patch(
        `/interview-session/${sessionId}/questions/${questionId}/evaluate`,
        data
    );

    return response.data;
};


/**
 * Complete interview session
 * and generate final AI report
 */
export const completeInterviewSessionApi = async (
    sessionId
) => {
    const response = await api.post(
        `/interview-session/${sessionId}/complete`
    );

    return response.data;
};