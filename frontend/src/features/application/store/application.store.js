import { create } from "zustand";


const useApplicationStore = create((set) => ({

    // ---------------------------------------------
    // State
    // ---------------------------------------------

    applications: [],

    selectedApplication: null,

    isLoading: false,

    isCreating: false,

    isUpdating: false,

    isDeleting: false,

    error: null,


    // ---------------------------------------------
    // Applications
    // ---------------------------------------------

    setApplications: (applications) =>
        set({
            applications,
        }),


    setSelectedApplication: (
        selectedApplication
    ) =>
        set({
            selectedApplication,
        }),


    addApplication: (application) =>
        set((state) => ({
            applications: [
                application,
                ...state.applications,
            ],
        })),


    updateApplicationInStore: (
        applicationId,
        updatedApplication
    ) =>
        set((state) => ({

            applications:
                state.applications.map(
                    (application) =>
                        application._id ===
                            applicationId
                            ? updatedApplication
                            : application
                ),

            selectedApplication:
                state.selectedApplication?._id ===
                    applicationId
                    ? updatedApplication
                    : state.selectedApplication,

        })),


    removeApplication: (
        applicationId
    ) =>
        set((state) => ({

            applications:
                state.applications.filter(
                    (application) =>
                        application._id !==
                        applicationId
                ),

            selectedApplication:
                state.selectedApplication?._id ===
                    applicationId
                    ? null
                    : state.selectedApplication,

        })),


    // ---------------------------------------------
    // Loading states
    // ---------------------------------------------

    setLoading: (isLoading) =>
        set({
            isLoading,
        }),


    setCreating: (isCreating) =>
        set({
            isCreating,
        }),


    setUpdating: (isUpdating) =>
        set({
            isUpdating,
        }),


    setDeleting: (isDeleting) =>
        set({
            isDeleting,
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
    // Clear selected
    // ---------------------------------------------

    clearSelectedApplication: () =>
        set({
            selectedApplication: null,
        }),


    // ---------------------------------------------
    // Reset
    // ---------------------------------------------

    resetApplicationStore: () =>
        set({

            applications: [],

            selectedApplication: null,

            isLoading: false,

            isCreating: false,

            isUpdating: false,

            isDeleting: false,

            error: null,

        }),

}));


export default useApplicationStore;