import { create } from "zustand";

import {
    getInterviewSessionsApi,
    getInterviewSessionApi,
    createInterviewSessionApi,
    updateInterviewSessionApi,
    deleteInterviewSessionApi,
    addInterviewQuestionApi,
    updateInterviewQuestionApi,
    deleteInterviewQuestionApi,
    generateInterviewQuestionsApi,
    evaluateInterviewAnswerApi,
    completeInterviewSessionApi,
} from "../services/interviewSession.api.js";


const useInterviewSessionStore = create(
    (set, get) => ({

        // =========================
        // STATE
        // =========================

        interviewSessions: [],

        currentInterviewSession: null,

        isLoading: false,

        error: null,


        // =========================
        // HELPERS
        // =========================

        setLoading: (isLoading) =>
            set({ isLoading }),


        setError: (error) =>
            set({ error }),


        clearError: () =>
            set({ error: null }),


        clearCurrentInterviewSession: () =>
            set({
                currentInterviewSession: null,
            }),


        // =========================
        // GET ALL SESSIONS
        // =========================

        getInterviewSessions: async () => {

            try {

                set({
                    isLoading: true,
                    error: null,
                });

                const response =
                    await getInterviewSessionsApi();

                set({
                    interviewSessions:
                        response.data.interviewSessions,
                });

                return response;

            } catch (error) {

                set({
                    error:
                        error.response?.data?.message ||
                        "Failed to fetch interview sessions.",
                });

                throw error;

            } finally {

                set({
                    isLoading: false,
                });

            }

        },


        // =========================
        // GET SINGLE SESSION
        // =========================

        getInterviewSession: async (
            sessionId
        ) => {

            try {

                set({
                    isLoading: true,
                    error: null,
                });

                const response =
                    await getInterviewSessionApi(
                        sessionId
                    );

                set({
                    currentInterviewSession:
                        response.data.interviewSession,
                });

                return response;

            } catch (error) {

                set({
                    error:
                        error.response?.data?.message ||
                        "Failed to fetch interview session.",
                });

                throw error;

            } finally {

                set({
                    isLoading: false,
                });

            }

        },


        // =========================
        // CREATE SESSION
        // =========================

        createInterviewSession: async (
            data
        ) => {

            try {

                set({
                    isLoading: true,
                    error: null,
                });

                const response =
                    await createInterviewSessionApi(
                        data
                    );

                const interviewSession =
                    response.data.interviewSession;

                set((state) => ({
                    interviewSessions: [
                        interviewSession,
                        ...state.interviewSessions,
                    ],

                    currentInterviewSession:
                        interviewSession,
                }));

                return response;

            } catch (error) {

                set({
                    error:
                        error.response?.data?.message ||
                        "Failed to create interview session.",
                });

                throw error;

            } finally {

                set({
                    isLoading: false,
                });

            }

        },


        // =========================
        // UPDATE SESSION
        // =========================

        updateInterviewSession: async (
            sessionId,
            data
        ) => {

            try {

                set({
                    isLoading: true,
                    error: null,
                });

                const response =
                    await updateInterviewSessionApi(
                        sessionId,
                        data
                    );

                const updatedSession =
                    response.data.interviewSession;

                set((state) => ({

                    interviewSessions:
                        state.interviewSessions.map(
                            (session) =>
                                session._id === sessionId
                                    ? updatedSession
                                    : session
                        ),

                    currentInterviewSession:
                        updatedSession,

                }));

                return response;

            } catch (error) {

                set({
                    error:
                        error.response?.data?.message ||
                        "Failed to update interview session.",
                });

                throw error;

            } finally {

                set({
                    isLoading: false,
                });

            }

        },


        // =========================
        // DELETE SESSION
        // =========================

        deleteInterviewSession: async (
            sessionId
        ) => {

            try {

                set({
                    isLoading: true,
                    error: null,
                });

                const response =
                    await deleteInterviewSessionApi(
                        sessionId
                    );

                set((state) => ({

                    interviewSessions:
                        state.interviewSessions.filter(
                            (session) =>
                                session._id !== sessionId
                        ),

                    currentInterviewSession:
                        state.currentInterviewSession?._id ===
                        sessionId
                            ? null
                            : state.currentInterviewSession,

                }));

                return response;

            } catch (error) {

                set({
                    error:
                        error.response?.data?.message ||
                        "Failed to delete interview session.",
                });

                throw error;

            } finally {

                set({
                    isLoading: false,
                });

            }

        },


        // =========================
        // ADD QUESTION
        // =========================

        addInterviewQuestion: async (
            sessionId,
            data
        ) => {

            try {

                set({
                    isLoading: true,
                    error: null,
                });

                const response =
                    await addInterviewQuestionApi(
                        sessionId,
                        data
                    );

                const updatedSession =
                    response.data.interviewSession;

                set((state) => ({

                    currentInterviewSession:
                        updatedSession,

                    interviewSessions:
                        state.interviewSessions.map(
                            (session) =>
                                session._id === sessionId
                                    ? updatedSession
                                    : session
                        ),

                }));

                return response;

            } catch (error) {

                set({
                    error:
                        error.response?.data?.message ||
                        "Failed to add interview question.",
                });

                throw error;

            } finally {

                set({
                    isLoading: false,
                });

            }

        },


        // =========================
        // UPDATE QUESTION
        // =========================

        updateInterviewQuestion: async (
            sessionId,
            questionId,
            data
        ) => {

            try {

                set({
                    isLoading: true,
                    error: null,
                });

                const response =
                    await updateInterviewQuestionApi(
                        sessionId,
                        questionId,
                        data
                    );

                const updatedSession =
                    response.data.interviewSession;

                set((state) => ({

                    currentInterviewSession:
                        updatedSession,

                    interviewSessions:
                        state.interviewSessions.map(
                            (session) =>
                                session._id === sessionId
                                    ? updatedSession
                                    : session
                        ),

                }));

                return response;

            } catch (error) {

                set({
                    error:
                        error.response?.data?.message ||
                        "Failed to update interview question.",
                });

                throw error;

            } finally {

                set({
                    isLoading: false,
                });

            }

        },


        // =========================
        // DELETE QUESTION
        // =========================

        deleteInterviewQuestion: async (
            sessionId,
            questionId
        ) => {

            try {

                set({
                    isLoading: true,
                    error: null,
                });

                const response =
                    await deleteInterviewQuestionApi(
                        sessionId,
                        questionId
                    );

                const updatedSession =
                    response.data.interviewSession;

                set((state) => ({

                    currentInterviewSession:
                        updatedSession,

                    interviewSessions:
                        state.interviewSessions.map(
                            (session) =>
                                session._id === sessionId
                                    ? updatedSession
                                    : session
                        ),

                }));

                return response;

            } catch (error) {

                set({
                    error:
                        error.response?.data?.message ||
                        "Failed to delete interview question.",
                });

                throw error;

            } finally {

                set({
                    isLoading: false,
                });

            }

        },


        // =========================
        // GENERATE AI INTERVIEW
        // =========================

        generateInterviewQuestions: async (
            data
        ) => {

            try {

                set({
                    isLoading: true,
                    error: null,
                });

                const response =
                    await generateInterviewQuestionsApi(
                        data
                    );

                const interviewSession =
                    response.data.interviewSession;

                set((state) => ({

                    interviewSessions: [
                        interviewSession,
                        ...state.interviewSessions,
                    ],

                    currentInterviewSession:
                        interviewSession,

                }));

                return response;

            } catch (error) {

                set({
                    error:
                        error.response?.data?.message ||
                        "Failed to generate interview questions.",
                });

                throw error;

            } finally {

                set({
                    isLoading: false,
                });

            }

        },


        // =========================
        // EVALUATE ANSWER
        // =========================

        evaluateInterviewAnswer: async (
            sessionId,
            questionId,
            data
        ) => {

            try {

                set({
                    isLoading: true,
                    error: null,
                });

                const response =
                    await evaluateInterviewAnswerApi(
                        sessionId,
                        questionId,
                        data
                    );

                const updatedQuestion =
                    response.data.question;

                set((state) => {

                    if (
                        !state.currentInterviewSession
                    ) {
                        return {};
                    }

                    const updatedSession = {
                        ...state.currentInterviewSession,

                        questions:
                            state.currentInterviewSession.questions.map(
                                (question) =>
                                    question._id === questionId
                                        ? updatedQuestion
                                        : question
                            ),
                    };

                    return {
                        currentInterviewSession:
                            updatedSession,

                        interviewSessions:
                            state.interviewSessions.map(
                                (session) =>
                                    session._id === sessionId
                                        ? updatedSession
                                        : session
                            ),
                    };

                });

                return response;

            } catch (error) {

                set({
                    error:
                        error.response?.data?.message ||
                        "Failed to evaluate interview answer.",
                });

                throw error;

            } finally {

                set({
                    isLoading: false,
                });

            }

        },


        // =========================
        // COMPLETE INTERVIEW
        // =========================

        completeInterviewSession: async (
            sessionId
        ) => {

            try {

                set({
                    isLoading: true,
                    error: null,
                });

                const response =
                    await completeInterviewSessionApi(
                        sessionId
                    );

                const completedSession =
                    response.data.interviewSession;

                set((state) => ({

                    currentInterviewSession:
                        completedSession,

                    interviewSessions:
                        state.interviewSessions.map(
                            (session) =>
                                session._id === sessionId
                                    ? completedSession
                                    : session
                        ),

                }));

                return response;

            } catch (error) {

                set({
                    error:
                        error.response?.data?.message ||
                        "Failed to complete interview session.",
                });

                throw error;

            } finally {

                set({
                    isLoading: false,
                });

            }

        },

    })
);


export default useInterviewSessionStore;