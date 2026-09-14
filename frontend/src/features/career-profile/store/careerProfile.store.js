import { create } from "zustand";

const useCareerProfileStore = create((set) => ({
    careerProfile: null,

    isProfileLoading: false,
    isSubmitting: false,
    isImporting: false,

    error: null,

    hasProfile: false,

    setCareerProfile: (careerProfile) =>
        set({
            careerProfile,
            hasProfile: Boolean(careerProfile),
        }),

    setProfileLoading: (isProfileLoading) =>
        set({
            isProfileLoading,
        }),

    setSubmitting: (isSubmitting) =>
        set({
            isSubmitting,
        }),

    setImporting: (isImporting) =>
        set({
            isImporting,
        }),

    setError: (error) =>
        set({
            error,
        }),

    clearError: () =>
        set({
            error: null,
        }),

    clearCareerProfile: () =>
        set({
            careerProfile: null,
            hasProfile: false,
            error: null,
        }),
}));

export default useCareerProfileStore;