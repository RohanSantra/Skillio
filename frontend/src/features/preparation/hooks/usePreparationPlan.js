import { useCallback } from "react";

import usePreparationPlanStore
    from "../store/preparationPlan.store.js";

import {

    getAllPreparationPlans as
        getAllPreparationPlansApi,

    getPreparationPlan as
        getPreparationPlanApi,

    createPreparationPlan as
        createPreparationPlanApi,

    updatePreparationPlan as
        updatePreparationPlanApi,

    deletePreparationPlan as
        deletePreparationPlanApi,

    addPreparationTask as
        addPreparationTaskApi,

    updatePreparationTask as
        updatePreparationTaskApi,

    deletePreparationTask as
        deletePreparationTaskApi,

    generatePreparationPlan as
        generatePreparationPlanApi,

} from "../services/preparationPlan.api.js";


const usePreparationPlan = () => {


    // =============================================
    // State
    // =============================================

    const preparationPlans =
        usePreparationPlanStore(
            (state) =>
                state.preparationPlans
        );


    const currentPreparationPlan =
        usePreparationPlanStore(
            (state) =>
                state.currentPreparationPlan
        );


    const isLoading =
        usePreparationPlanStore(
            (state) =>
                state.isLoading
        );


    const isCreating =
        usePreparationPlanStore(
            (state) =>
                state.isCreating
        );


    const isUpdating =
        usePreparationPlanStore(
            (state) =>
                state.isUpdating
        );


    const isGenerating =
        usePreparationPlanStore(
            (state) =>
                state.isGenerating
        );


    const error =
        usePreparationPlanStore(
            (state) =>
                state.error
        );


    // =============================================
    // Actions
    // =============================================

    const setPreparationPlans =
        usePreparationPlanStore(
            (state) =>
                state.setPreparationPlans
        );


    const setCurrentPreparationPlan =
        usePreparationPlanStore(
            (state) =>
                state.setCurrentPreparationPlan
        );


    const addPreparationPlanToStore =
        usePreparationPlanStore(
            (state) =>
                state.addPreparationPlan
        );


    const updatePreparationPlanInStore =
        usePreparationPlanStore(
            (state) =>
                state.updatePreparationPlanInStore
        );


    const removePreparationPlan =
        usePreparationPlanStore(
            (state) =>
                state.removePreparationPlan
        );


    const setLoading =
        usePreparationPlanStore(
            (state) =>
                state.setLoading
        );


    const setCreating =
        usePreparationPlanStore(
            (state) =>
                state.setCreating
        );


    const setUpdating =
        usePreparationPlanStore(
            (state) =>
                state.setUpdating
        );


    const setGenerating =
        usePreparationPlanStore(
            (state) =>
                state.setGenerating
        );


    const setError =
        usePreparationPlanStore(
            (state) =>
                state.setError
        );


    const clearError =
        usePreparationPlanStore(
            (state) =>
                state.clearError
        );

    const clearCurrentPreparationPlan =
        usePreparationPlanStore(
            (state) =>
                state.clearCurrentPreparationPlan
        );


    // =============================================
    // GET ALL PREPARATION PLANS
    // =============================================

    const getAllPreparationPlans =
        useCallback(async () => {

            try {

                setLoading(true);

                clearError();

                const response =
                    await getAllPreparationPlansApi();


                const preparationPlans =
                    response?.data?.data
                        ?.preparationPlans ?? [];


                setPreparationPlans(
                    preparationPlans
                );


                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to fetch preparation plans."
                );

                throw error;

            } finally {

                setLoading(false);

            }

        }, [
            setLoading,
            clearError,
            setPreparationPlans,
            setError,
        ]);


    // =============================================
    // GET SINGLE PREPARATION PLAN
    // =============================================

    const getPreparationPlan =
        useCallback(async (planId) => {

            try {

                setLoading(true);

                clearError();

                const response =
                    await getPreparationPlanApi(
                        planId
                    );


                const preparationPlan =
                    response?.data?.data
                        ?.preparationPlan;


                if (preparationPlan) {

                    setCurrentPreparationPlan(
                        preparationPlan
                    );

                }


                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to fetch preparation plan."
                );

                throw error;

            } finally {

                setLoading(false);

            }

        }, [
            setLoading,
            clearError,
            setCurrentPreparationPlan,
            setError,
        ]);


    // =============================================
    // CREATE PREPARATION PLAN
    // =============================================

    const createPreparationPlan =
        useCallback(async (data) => {

            try {

                setCreating(true);

                clearError();

                const response =
                    await createPreparationPlanApi(
                        data
                    );


                const preparationPlan =
                    response?.data?.data
                        ?.preparationPlan;


                if (preparationPlan) {

                    addPreparationPlanToStore(
                        preparationPlan
                    );

                    setCurrentPreparationPlan(
                        preparationPlan
                    );

                }


                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to create preparation plan."
                );

                throw error;

            } finally {

                setCreating(false);

            }

        }, [
            setCreating,
            clearError,
            addPreparationPlanToStore,
            setCurrentPreparationPlan,
            setError,
        ]);


    // =============================================
    // UPDATE PREPARATION PLAN
    // =============================================

    const updatePreparationPlan =
        useCallback(async (
            planId,
            data
        ) => {

            try {

                setUpdating(true);

                clearError();

                const response =
                    await updatePreparationPlanApi(
                        planId,
                        data
                    );


                const preparationPlan =
                    response?.data?.data
                        ?.preparationPlan;


                if (preparationPlan) {

                    updatePreparationPlanInStore(
                        preparationPlan
                    );

                }


                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to update preparation plan."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        }, [
            setUpdating,
            clearError,
            updatePreparationPlanInStore,
            setError,
        ]);


    // =============================================
    // DELETE PREPARATION PLAN
    // =============================================

    const deletePreparationPlan =
        useCallback(async (planId) => {

            try {

                setUpdating(true);

                clearError();

                const response =
                    await deletePreparationPlanApi(
                        planId
                    );


                removePreparationPlan(planId);


                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to delete preparation plan."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        }, [
            setUpdating,
            clearError,
            removePreparationPlan,
            setError,
        ]);


    // =============================================
    // ADD TASK
    // =============================================

    const addTask =
        useCallback(async (
            planId,
            data
        ) => {

            try {

                setUpdating(true);

                clearError();

                const response =
                    await addPreparationTaskApi(
                        planId,
                        data
                    );


                const preparationPlan =
                    response?.data?.data
                        ?.preparationPlan;


                if (preparationPlan) {

                    updatePreparationPlanInStore(
                        preparationPlan
                    );

                }


                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to add preparation task."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        }, [
            setUpdating,
            clearError,
            updatePreparationPlanInStore,
            setError,
        ]);


    // =============================================
    // UPDATE TASK
    // =============================================

    const updateTask =
        useCallback(async (
            planId,
            taskId,
            data
        ) => {

            try {

                setUpdating(true);

                clearError();

                const response =
                    await updatePreparationTaskApi(
                        planId,
                        taskId,
                        data
                    );


                const preparationPlan =
                    response?.data?.data
                        ?.preparationPlan;


                if (preparationPlan) {

                    updatePreparationPlanInStore(
                        preparationPlan
                    );

                }


                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to update preparation task."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        }, [
            setUpdating,
            clearError,
            updatePreparationPlanInStore,
            setError,
        ]);


    // =============================================
    // DELETE TASK
    // =============================================

    const deleteTask =
        useCallback(async (
            planId,
            taskId
        ) => {

            try {

                setUpdating(true);

                clearError();

                const response =
                    await deletePreparationTaskApi(
                        planId,
                        taskId
                    );


                const preparationPlan =
                    response?.data?.data
                        ?.preparationPlan;


                if (preparationPlan) {

                    updatePreparationPlanInStore(
                        preparationPlan
                    );

                }


                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to delete preparation task."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        }, [
            setUpdating,
            clearError,
            updatePreparationPlanInStore,
            setError,
        ]);


    // =============================================
    // GENERATE AI PREPARATION PLAN
    // =============================================

    const generatePreparationPlan =
        useCallback(async (jobId) => {

            try {

                setGenerating(true);

                clearError();

                const response =
                    await generatePreparationPlanApi(
                        jobId
                    );


                const preparationPlan =
                    response?.data?.data
                        ?.preparationPlan;


                if (preparationPlan) {

                    const existingPlan =
                        usePreparationPlanStore
                            .getState()
                            .preparationPlans
                            .find(
                                (plan) =>
                                    plan._id ===
                                    preparationPlan._id
                            );


                    if (existingPlan) {

                        updatePreparationPlanInStore(
                            preparationPlan
                        );

                    } else {

                        addPreparationPlanToStore(
                            preparationPlan
                        );

                    }


                    setCurrentPreparationPlan(
                        preparationPlan
                    );

                }


                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to generate preparation plan."
                );

                throw error;

            } finally {

                setGenerating(false);

            }

        }, [
            setGenerating,
            clearError,
            updatePreparationPlanInStore,
            addPreparationPlanToStore,
            setCurrentPreparationPlan,
            setError,
        ]);


    return {

        // =========================================
        // State
        // =========================================

        preparationPlans,

        currentPreparationPlan,

        isLoading,

        isCreating,

        isUpdating,

        isGenerating,

        error,


        // =========================================
        // Preparation plan actions
        // =========================================

        getAllPreparationPlans,

        getPreparationPlan,

        createPreparationPlan,

        updatePreparationPlan,

        deletePreparationPlan,


        // =========================================
        // Task actions
        // =========================================

        addTask,

        updateTask,

        deleteTask,


        // =========================================
        // AI generation
        // =========================================

        generatePreparationPlan,


        // =========================================
        // Utilities
        // =========================================

        clearError,

        clearCurrentPreparationPlan,

    };

};


export default usePreparationPlan;
