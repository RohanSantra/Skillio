import { useCallback } from "react";

import useJobWorkspaceStore from
    "../store/jobWorkspace.store.js";

import {

    getAllJobWorkspaces as getAllJobWorkspacesApi,
    getJobWorkspace as getJobWorkspaceApi,
    createJobWorkspace as createJobWorkspaceApi,
    updateJobWorkspace as updateJobWorkspaceApi,
    deleteJobWorkspace as deleteJobWorkspaceApi,
    updateJobWorkspaceStatus as updateJobWorkspaceStatusApi,
    updateJobAnalysis as updateJobAnalysisApi,
    analyzeJobWorkspace as analyzeJobWorkspaceApi,
    analyzeJobMatch as analyzeJobMatchApi,
    analyzeSkillGaps as analyzeSkillGapsApi,
    updateJobMatch as updateJobMatchApi,
    updateSkillGaps as updateSkillGapsApi,
    analyzeResumeATS as analyzeResumeATSApi,

} from "../services/jobWorkspace.api.js";


const useJobWorkspace = () => {

    // ---------------------------------------------
    // State
    // ---------------------------------------------

    const jobWorkspaces =
        useJobWorkspaceStore(
            (state) => state.jobWorkspaces
        );

    const currentJobWorkspace =
        useJobWorkspaceStore(
            (state) =>
                state.currentJobWorkspace
        );

    const isLoading =
        useJobWorkspaceStore(
            (state) => state.isLoading
        );

    const isCreating =
        useJobWorkspaceStore(
            (state) => state.isCreating
        );

    const isUpdating =
        useJobWorkspaceStore(
            (state) => state.isUpdating
        );

    const isAnalyzingJob =
        useJobWorkspaceStore(
            (state) => state.isAnalyzingJob
        );

    const isAnalyzingMatch =
        useJobWorkspaceStore(
            (state) => state.isAnalyzingMatch
        );

    const isAnalyzingSkillGaps =
        useJobWorkspaceStore(
            (state) =>
                state.isAnalyzingSkillGaps
        );

    const isAnalyzingResumeATS =
        useJobWorkspaceStore(
            (state) =>
                state.isAnalyzingResumeATS
        );

    const error =
        useJobWorkspaceStore(
            (state) => state.error
        );


    // ---------------------------------------------
    // Actions
    // ---------------------------------------------

    const setJobWorkspaces =
        useJobWorkspaceStore(
            (state) =>
                state.setJobWorkspaces
        );

    const setCurrentJobWorkspace =
        useJobWorkspaceStore(
            (state) =>
                state.setCurrentJobWorkspace
        );

    const addJobWorkspace =
        useJobWorkspaceStore(
            (state) =>
                state.addJobWorkspace
        );

    const updateJobWorkspaceInStore =
        useJobWorkspaceStore(
            (state) =>
                state.updateJobWorkspaceInStore
        );

    const removeJobWorkspace =
        useJobWorkspaceStore(
            (state) =>
                state.removeJobWorkspace
        );

    const setLoading =
        useJobWorkspaceStore(
            (state) => state.setLoading
        );

    const setCreating =
        useJobWorkspaceStore(
            (state) => state.setCreating
        );

    const setUpdating =
        useJobWorkspaceStore(
            (state) => state.setUpdating
        );

    const setAnalyzingJob =
        useJobWorkspaceStore(
            (state) =>
                state.setAnalyzingJob
        );

    const setAnalyzingMatch =
        useJobWorkspaceStore(
            (state) =>
                state.setAnalyzingMatch
        );

    const setAnalyzingSkillGaps =
        useJobWorkspaceStore(
            (state) =>
                state.setAnalyzingSkillGaps
        );

    const setAnalyzingResumeATS =
        useJobWorkspaceStore(
            (state) =>
                state.setAnalyzingResumeATS
        );

    const setError =
        useJobWorkspaceStore(
            (state) => state.setError
        );

    const clearError =
        useJobWorkspaceStore(
            (state) => state.clearError
        );


    // =============================================
    // GET ALL WORKSPACES
    // =============================================

    const getAllJobWorkspaces =
        useCallback(async () => {

            try {

                setLoading(true);
                clearError();

                const response =
                    await getAllJobWorkspacesApi();

                const data =
                    response?.data?.data
                        ?.jobWorkspaces ?? [];

                setJobWorkspaces(data);

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to fetch job workspaces."
                );

                throw error;

            } finally {

                setLoading(false);

            }

        }, [
            setLoading,
            clearError,
            setJobWorkspaces,
            setError,
        ]);


    // =============================================
    // GET SINGLE WORKSPACE
    // =============================================

    const getJobWorkspace =
        useCallback(async (jobId) => {

            try {

                setLoading(true);
                clearError();

                const response =
                    await getJobWorkspaceApi(jobId);

                const workspace =
                    response?.data?.data
                        ?.jobWorkspace;

                if (workspace) {
                    setCurrentJobWorkspace(
                        workspace
                    );
                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to fetch job workspace."
                );

                throw error;

            } finally {

                setLoading(false);

            }

        }, [
            setLoading,
            clearError,
            setCurrentJobWorkspace,
            setError,
        ]);


    // =============================================
    // CREATE WORKSPACE
    // =============================================

    const createJobWorkspace =
        useCallback(async (data) => {

            try {

                setCreating(true);
                clearError();

                const response =
                    await createJobWorkspaceApi(
                        data
                    );

                const workspace =
                    response?.data?.data
                        ?.jobWorkspace;

                if (workspace) {

                    addJobWorkspace(
                        workspace
                    );

                    setCurrentJobWorkspace(
                        workspace
                    );

                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to create job workspace."
                );

                throw error;

            } finally {

                setCreating(false);

            }

        }, [
            setCreating,
            clearError,
            addJobWorkspace,
            setCurrentJobWorkspace,
            setError,
        ]);


    // =============================================
    // UPDATE WORKSPACE
    // =============================================

    const updateJobWorkspace =
        useCallback(async (
            jobId,
            data
        ) => {

            try {

                setUpdating(true);
                clearError();

                const response =
                    await updateJobWorkspaceApi(
                        jobId,
                        data
                    );

                const workspace =
                    response?.data?.data
                        ?.jobWorkspace;

                if (workspace) {
                    updateJobWorkspaceInStore(
                        workspace
                    );
                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to update job workspace."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        }, [
            setUpdating,
            clearError,
            updateJobWorkspaceInStore,
            setError,
        ]);


    // =============================================
    // DELETE WORKSPACE
    // =============================================

    const deleteJobWorkspace =
        useCallback(async (jobId) => {

            try {

                setUpdating(true);
                clearError();

                const response =
                    await deleteJobWorkspaceApi(
                        jobId
                    );

                removeJobWorkspace(jobId);

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to delete job workspace."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        }, [
            setUpdating,
            clearError,
            removeJobWorkspace,
            setError,
        ]);


    // =============================================
    // UPDATE STATUS
    // =============================================

    const updateJobWorkspaceStatus =
        useCallback(async (
            jobId,
            status
        ) => {

            try {

                setUpdating(true);
                clearError();

                const response =
                    await updateJobWorkspaceStatusApi(
                        jobId,
                        status
                    );

                const workspace =
                    response?.data?.data
                        ?.jobWorkspace;

                if (workspace) {
                    updateJobWorkspaceInStore(
                        workspace
                    );
                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to update workspace status."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        }, [
            setUpdating,
            clearError,
            updateJobWorkspaceInStore,
            setError,
        ]);


    // =============================================
    // ANALYZE JOB
    // =============================================

    const analyzeJobWorkspace =
        useCallback(async (jobId) => {

            try {

                setAnalyzingJob(true);
                clearError();

                const response =
                    await analyzeJobWorkspaceApi(
                        jobId
                    );

                const jobAnalysis =
                    response?.data?.data
                        ?.jobAnalysis;

                if (jobAnalysis) {

                    const workspace =
                        useJobWorkspaceStore
                            .getState()
                            .jobWorkspaces
                            .find(
                                (item) =>
                                    item._id === jobId
                            );

                    if (workspace) {

                        updateJobWorkspaceInStore({
                            ...workspace,
                            jobAnalysis,
                        });

                    }

                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to analyze job."
                );

                throw error;

            } finally {

                setAnalyzingJob(false);

            }

        }, [
            setAnalyzingJob,
            clearError,
            updateJobWorkspaceInStore,
            setError,
        ]);


    // =============================================
    // ANALYZE JOB MATCH
    // =============================================

    const analyzeJobMatch =
        useCallback(async (jobId) => {

            try {

                setAnalyzingMatch(true);
                clearError();

                const response =
                    await analyzeJobMatchApi(
                        jobId
                    );

                const jobMatch =
                    response?.data?.data
                        ?.jobMatch;

                if (jobMatch) {

                    const workspace =
                        useJobWorkspaceStore
                            .getState()
                            .jobWorkspaces
                            .find(
                                (item) =>
                                    item._id === jobId
                            );

                    if (workspace) {

                        updateJobWorkspaceInStore({
                            ...workspace,
                            jobMatch,
                        });

                    }

                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to analyze job match."
                );

                throw error;

            } finally {

                setAnalyzingMatch(false);

            }

        }, [
            setAnalyzingMatch,
            clearError,
            updateJobWorkspaceInStore,
            setError,
        ]);


    // =============================================
    // ANALYZE SKILL GAPS
    // =============================================

    const analyzeSkillGaps =
        useCallback(async (jobId) => {

            try {

                setAnalyzingSkillGaps(true);
                clearError();

                const response =
                    await analyzeSkillGapsApi(
                        jobId
                    );

                const skillGaps =
                    response?.data?.data
                        ?.skillGaps;

                if (skillGaps) {

                    const workspace =
                        useJobWorkspaceStore
                            .getState()
                            .jobWorkspaces
                            .find(
                                (item) =>
                                    item._id === jobId
                            );

                    if (workspace) {

                        updateJobWorkspaceInStore({
                            ...workspace,
                            skillGaps,
                        });

                    }

                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to analyze skill gaps."
                );

                throw error;

            } finally {

                setAnalyzingSkillGaps(false);

            }

        }, [
            setAnalyzingSkillGaps,
            clearError,
            updateJobWorkspaceInStore,
            setError,
        ]);


    // =============================================
    // UPDATE JOB ANALYSIS
    // =============================================

    const updateJobAnalysis =
        useCallback(async (
            jobId,
            data
        ) => {

            try {

                setUpdating(true);
                clearError();

                const response =
                    await updateJobAnalysisApi(
                        jobId,
                        data
                    );

                const jobAnalysis =
                    response?.data?.data
                        ?.jobAnalysis;

                const workspace =
                    useJobWorkspaceStore
                        .getState()
                        .jobWorkspaces
                        .find(
                            (item) =>
                                item._id === jobId
                        );

                if (
                    workspace &&
                    jobAnalysis
                ) {

                    updateJobWorkspaceInStore({
                        ...workspace,
                        jobAnalysis,
                    });

                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to update job analysis."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        }, [
            setUpdating,
            clearError,
            updateJobWorkspaceInStore,
            setError,
        ]);


    // =============================================
    // UPDATE JOB MATCH
    // =============================================

    const updateJobMatch =
        useCallback(async (
            jobId,
            data
        ) => {

            try {

                setUpdating(true);
                clearError();

                const response =
                    await updateJobMatchApi(
                        jobId,
                        data
                    );

                const jobMatch =
                    response?.data?.data
                        ?.jobMatch;

                const workspace =
                    useJobWorkspaceStore
                        .getState()
                        .jobWorkspaces
                        .find(
                            (item) =>
                                item._id === jobId
                        );

                if (
                    workspace &&
                    jobMatch
                ) {

                    updateJobWorkspaceInStore({
                        ...workspace,
                        jobMatch,
                    });

                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to update job match."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        }, [
            setUpdating,
            clearError,
            updateJobWorkspaceInStore,
            setError,
        ]);


    // =============================================
    // UPDATE SKILL GAPS
    // =============================================

    const updateSkillGaps =
        useCallback(async (
            jobId,
            skillGaps
        ) => {

            try {

                setUpdating(true);
                clearError();

                const response =
                    await updateSkillGapsApi(
                        jobId,
                        skillGaps
                    );

                const updatedSkillGaps =
                    response?.data?.data
                        ?.skillGaps;

                const workspace =
                    useJobWorkspaceStore
                        .getState()
                        .jobWorkspaces
                        .find(
                            (item) =>
                                item._id === jobId
                        );

                if (
                    workspace &&
                    updatedSkillGaps
                ) {

                    updateJobWorkspaceInStore({
                        ...workspace,
                        skillGaps:
                            updatedSkillGaps,
                    });

                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to update skill gaps."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        }, [
            setUpdating,
            clearError,
            updateJobWorkspaceInStore,
            setError,
        ]);

    // =============================================
    // ANALYZE RESUME ATS
    // =============================================

    const analyzeResumeATS =
        useCallback(async (
            jobId,
            resumeId
        ) => {

            try {

                setAnalyzingResumeATS(true);
                clearError();

                const response =
                    await analyzeResumeATSApi(
                        jobId,
                        resumeId
                    );

                const resumeATSAnalysis =
                    response?.data?.data
                        ?.resumeATSAnalysis;

                if (resumeATSAnalysis) {

                    const workspace =
                        useJobWorkspaceStore
                            .getState()
                            .jobWorkspaces
                            .find(
                                (item) =>
                                    item._id === jobId
                            );

                    if (workspace) {

                        updateJobWorkspaceInStore({
                            ...workspace,
                            resumeATSAnalysis,
                        });

                    }

                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to analyze resume ATS."
                );

                throw error;

            } finally {

                setAnalyzingResumeATS(false);

            }

        }, [
            setAnalyzingResumeATS,
            clearError,
            updateJobWorkspaceInStore,
            setError,
        ]);


    return {

        // State

        jobWorkspaces,
        currentJobWorkspace,

        isLoading,
        isCreating,
        isUpdating,

        isAnalyzingJob,
        isAnalyzingMatch,
        isAnalyzingSkillGaps,
        isAnalyzingResumeATS,

        error,

        // Workspace actions

        getAllJobWorkspaces,
        getJobWorkspace,
        createJobWorkspace,
        updateJobWorkspace,
        deleteJobWorkspace,
        updateJobWorkspaceStatus,

        // Job analysis

        updateJobAnalysis,
        analyzeJobWorkspace,

        // Job match

        analyzeJobMatch,
        updateJobMatch,

        // Skill gaps

        analyzeSkillGaps,
        updateSkillGaps,

        // Resume ATS

        analyzeResumeATS,

        // Utilities

        clearError,

    };

};


export default useJobWorkspace;