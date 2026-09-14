import { create } from "zustand";


const useJobWorkspaceStore = create((set) => ({

    // ---------------------------------------------
    // State
    // ---------------------------------------------

    jobWorkspaces: [],

    currentJobWorkspace: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isAnalyzingJob: false,
    isAnalyzingMatch: false,
    isAnalyzingSkillGaps: false,
    isAnalyzingResumeATS: false,

    error: null,


    // ---------------------------------------------
    // Set all workspaces
    // ---------------------------------------------

    setJobWorkspaces: (jobWorkspaces) =>
        set({
            jobWorkspaces,
        }),


    // ---------------------------------------------
    // Set current workspace
    // ---------------------------------------------

    setCurrentJobWorkspace: (
        currentJobWorkspace
    ) =>
        set({
            currentJobWorkspace,
        }),


    // ---------------------------------------------
    // Add workspace
    // ---------------------------------------------

    addJobWorkspace: (jobWorkspace) =>
        set((state) => ({
            jobWorkspaces: [
                jobWorkspace,
                ...state.jobWorkspaces,
            ],
        })),


    // ---------------------------------------------
    // Update workspace
    // ---------------------------------------------

    updateJobWorkspaceInStore: (
        updatedWorkspace
    ) =>
        set((state) => ({

            jobWorkspaces:
                state.jobWorkspaces.map(
                    (workspace) =>
                        workspace._id ===
                            updatedWorkspace._id
                            ? updatedWorkspace
                            : workspace
                ),

            currentJobWorkspace:
                state.currentJobWorkspace?._id ===
                    updatedWorkspace._id
                    ? updatedWorkspace
                    : state.currentJobWorkspace,

        })),


    // ---------------------------------------------
    // Remove workspace
    // ---------------------------------------------

    removeJobWorkspace: (jobId) =>
        set((state) => ({

            jobWorkspaces:
                state.jobWorkspaces.filter(
                    (workspace) =>
                        workspace._id !== jobId
                ),

            currentJobWorkspace:
                state.currentJobWorkspace?._id ===
                    jobId
                    ? null
                    : state.currentJobWorkspace,

        })),


    // ---------------------------------------------
    // Loading
    // ---------------------------------------------

    setLoading: (value) =>
        set({
            isLoading: value,
        }),


    // ---------------------------------------------
    // Creating
    // ---------------------------------------------

    setCreating: (value) =>
        set({
            isCreating: value,
        }),


    // ---------------------------------------------
    // Updating
    // ---------------------------------------------

    setUpdating: (value) =>
        set({
            isUpdating: value,
        }),


    // ---------------------------------------------
    // AI Job Analysis
    // ---------------------------------------------

    setAnalyzingJob: (value) =>
        set({
            isAnalyzingJob: value,
        }),


    // ---------------------------------------------
    // AI Job Match
    // ---------------------------------------------

    setAnalyzingMatch: (value) =>
        set({
            isAnalyzingMatch: value,
        }),


    // ---------------------------------------------
    // AI Skill Gaps
    // ---------------------------------------------

    setAnalyzingSkillGaps: (value) =>
        set({
            isAnalyzingSkillGaps: value,
        }),

    // ---------------------------------------------
    // AI Resume ATS Analysis
    // ---------------------------------------------

    setAnalyzingResumeATS: (value) =>
        set({
            isAnalyzingResumeATS: value,
        }),


    // ---------------------------------------------
    // Error
    // ---------------------------------------------

    setError: (error) =>
        set({
            error,
        }),


    clearError: () =>
        set({
            error: null,
        }),


    // ---------------------------------------------
    // Clear current workspace
    // ---------------------------------------------

    clearCurrentJobWorkspace: () =>
        set({
            currentJobWorkspace: null,
        }),


    // ---------------------------------------------
    // Reset store
    // ---------------------------------------------

    resetJobWorkspaceStore: () =>
        set({

            jobWorkspaces: [],
            currentJobWorkspace: null,

            isLoading: false,
            isCreating: false,
            isUpdating: false,

            isAnalyzingJob: false,
            isAnalyzingMatch: false,
            isAnalyzingSkillGaps: false,
            isAnalyzingResumeATS: false,

            error: null,

        }),

}));


export default useJobWorkspaceStore;