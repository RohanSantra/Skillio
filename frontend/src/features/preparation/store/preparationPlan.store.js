import { create } from "zustand";


const usePreparationPlanStore =
    create((set) => ({

        // -----------------------------------------
        // State
        // -----------------------------------------

        preparationPlans: [],

        currentPreparationPlan: null,

        isLoading: false,

        isCreating: false,

        isUpdating: false,

        isGenerating: false,

        error: null,


        // -----------------------------------------
        // Set all preparation plans
        // -----------------------------------------

        setPreparationPlans:
            (preparationPlans) =>

                set({
                    preparationPlans,
                }),


        // -----------------------------------------
        // Set current preparation plan
        // -----------------------------------------

        setCurrentPreparationPlan:
            (currentPreparationPlan) =>

                set({
                    currentPreparationPlan,
                }),


        // -----------------------------------------
        // Add preparation plan
        // -----------------------------------------

        addPreparationPlan:
            (preparationPlan) =>

                set((state) => ({
                    preparationPlans: [
                        preparationPlan,
                        ...state.preparationPlans,
                    ],
                })),


        // -----------------------------------------
        // Update preparation plan
        // -----------------------------------------

        updatePreparationPlanInStore:
            (updatedPlan) =>

                set((state) => ({
                    preparationPlans:
                        state.preparationPlans.map(
                            (plan) =>
                                plan._id ===
                                    updatedPlan._id
                                    ? updatedPlan
                                    : plan
                        ),

                    currentPreparationPlan:
                        state.currentPreparationPlan?._id ===
                            updatedPlan._id
                            ? updatedPlan
                            : state.currentPreparationPlan,
                })),


        // -----------------------------------------
        // Remove preparation plan
        // -----------------------------------------

        removePreparationPlan:
            (planId) =>

                set((state) => ({
                    preparationPlans:
                        state.preparationPlans.filter(
                            (plan) =>
                                plan._id !== planId
                        ),

                    currentPreparationPlan:
                        state.currentPreparationPlan?._id ===
                            planId
                            ? null
                            : state.currentPreparationPlan,
                })),


        // -----------------------------------------
        // Loading
        // -----------------------------------------

        setLoading:
            (value) =>

                set({
                    isLoading: value,
                }),


        // -----------------------------------------
        // Creating
        // -----------------------------------------

        setCreating:
            (value) =>

                set({
                    isCreating: value,
                }),


        // -----------------------------------------
        // Updating
        // -----------------------------------------

        setUpdating:
            (value) =>

                set({
                    isUpdating: value,
                }),


        // -----------------------------------------
        // Generating
        // -----------------------------------------

        setGenerating:
            (value) =>

                set({
                    isGenerating: value,
                }),


        // -----------------------------------------
        // Error
        // -----------------------------------------

        setError:
            (error) =>

                set({
                    error,
                }),


        clearError:
            () =>

                set({
                    error: null,
                }),


        // -----------------------------------------
        // Clear current plan
        // -----------------------------------------

        clearCurrentPreparationPlan:
            () =>

                set({
                    currentPreparationPlan: null,
                }),


        // -----------------------------------------
        // Reset store
        // -----------------------------------------

        resetPreparationPlanStore:
            () =>

                set({
                    preparationPlans: [],

                    currentPreparationPlan: null,

                    isLoading: false,

                    isCreating: false,

                    isUpdating: false,

                    isGenerating: false,

                    error: null,
                }),

    }));


export default usePreparationPlanStore;