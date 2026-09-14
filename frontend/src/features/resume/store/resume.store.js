import { create } from "zustand";

const useResumeStore = create((set) => ({

    // ---------------------------------------------
    // State
    // ---------------------------------------------

    resumes: [],

    currentResume: null,

    isLoading: false,

    isCreating: false,

    isUpdating: false,

    isParsing: false,

    error: null,


    // ---------------------------------------------
    // Set all resumes
    // ---------------------------------------------

    setResumes: (resumes) =>
        set({
            resumes,
        }),


    // ---------------------------------------------
    // Set current resume
    // ---------------------------------------------

    setCurrentResume: (resume) =>
        set({
            currentResume: resume,
        }),


    // ---------------------------------------------
    // Add resume
    // ---------------------------------------------

    addResume: (resume) =>
        set((state) => ({
            resumes: [
                resume,
                ...state.resumes,
            ],
        })),


    // ---------------------------------------------
    // Update resume in list
    // ---------------------------------------------

    updateResumeInStore: (updatedResume) =>
        set((state) => ({
            resumes: state.resumes.map((resume) =>
                resume._id === updatedResume._id
                    ? updatedResume
                    : resume
            ),

            currentResume:
                state.currentResume?._id === updatedResume._id
                    ? updatedResume
                    : state.currentResume,
        })),


    // ---------------------------------------------
    // Remove resume
    // ---------------------------------------------

    removeResume: (resumeId) =>
        set((state) => ({
            resumes: state.resumes.filter(
                (resume) => resume._id !== resumeId
            ),

            currentResume:
                state.currentResume?._id === resumeId
                    ? null
                    : state.currentResume,
        })),


    // ---------------------------------------------
    // Set loading
    // ---------------------------------------------

    setLoading: (value) =>
        set({
            isLoading: value,
        }),


    // ---------------------------------------------
    // Set creating
    // ---------------------------------------------

    setCreating: (value) =>
        set({
            isCreating: value,
        }),


    // ---------------------------------------------
    // Set updating
    // ---------------------------------------------

    setUpdating: (value) =>
        set({
            isUpdating: value,
        }),


    // ---------------------------------------------
    // Set parsing
    // ---------------------------------------------

    setParsing: (value) =>
        set({
            isParsing: value,
        }),


    // ---------------------------------------------
    // Set error
    // ---------------------------------------------

    setError: (error) =>
        set({
            error,
        }),


    // ---------------------------------------------
    // Clear error
    // ---------------------------------------------

    clearError: () =>
        set({
            error: null,
        }),


    // ---------------------------------------------
    // Clear current resume
    // ---------------------------------------------

    clearCurrentResume: () =>
        set({
            currentResume: null,
        }),


    // ---------------------------------------------
    // Reset resume store
    // ---------------------------------------------

    resetResumeStore: () =>
        set({
            resumes: [],
            currentResume: null,
            isLoading: false,
            isCreating: false,
            isUpdating: false,
            isParsing: false,
            error: null,
        }),

}));

export default useResumeStore;