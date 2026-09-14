import {
    useCallback,
} from "react";

import useApplicationStore from
    "../store/application.store.js";

import {
    getAllApplications as getAllApplicationsApi,
    getApplication as getApplicationApi,
    createApplication as createApplicationApi,
    updateApplication as updateApplicationApi,
    deleteApplication as deleteApplicationApi,
} from "../services/application.api.js";


const useApplication = () => {

    // =============================================
    // STATE
    // =============================================

    const applications =
        useApplicationStore(
            (state) =>
                state.applications
        );

    const selectedApplication =
        useApplicationStore(
            (state) =>
                state.selectedApplication
        );

    const isLoading =
        useApplicationStore(
            (state) =>
                state.isLoading
        );

    const isCreating =
        useApplicationStore(
            (state) =>
                state.isCreating
        );

    const isUpdating =
        useApplicationStore(
            (state) =>
                state.isUpdating
        );

    const isDeleting =
        useApplicationStore(
            (state) =>
                state.isDeleting
        );

    const error =
        useApplicationStore(
            (state) =>
                state.error
        );


    // =============================================
    // STORE ACTIONS
    // =============================================

    const setApplications =
        useApplicationStore(
            (state) =>
                state.setApplications
        );

    const setSelectedApplication =
        useApplicationStore(
            (state) =>
                state.setSelectedApplication
        );

    const addApplication =
        useApplicationStore(
            (state) =>
                state.addApplication
        );

    const updateApplicationInStore =
        useApplicationStore(
            (state) =>
                state.updateApplicationInStore
        );

    const removeApplication =
        useApplicationStore(
            (state) =>
                state.removeApplication
        );

    const setLoading =
        useApplicationStore(
            (state) =>
                state.setLoading
        );

    const setCreating =
        useApplicationStore(
            (state) =>
                state.setCreating
        );

    const setUpdating =
        useApplicationStore(
            (state) =>
                state.setUpdating
        );

    const setDeleting =
        useApplicationStore(
            (state) =>
                state.setDeleting
        );

    const setError =
        useApplicationStore(
            (state) =>
                state.setError
        );

    const clearError =
        useApplicationStore(
            (state) =>
                state.clearError
        );

    const clearSelectedApplication =
        useApplicationStore(
            (state) =>
                state.clearSelectedApplication
        );


    // =============================================
    // GET ALL APPLICATIONS
    // =============================================

    const getAllApplications =
        useCallback(
            async () => {

                try {

                    setLoading(true);

                    clearError();

                    const response =
                        await getAllApplicationsApi();

                    const data =
                        response?.data?.data
                            ?.applications ?? [];

                    setApplications(data);

                    return response;

                } catch (error) {

                    const message =
                        error?.response?.data
                            ?.message ||
                        "Failed to fetch applications.";

                    setError(message);

                    throw error;

                } finally {

                    setLoading(false);

                }

            },
            [
                setLoading,
                clearError,
                setApplications,
                setError,
            ]
        );


    // =============================================
    // GET SINGLE APPLICATION
    // =============================================

    const getApplication =
        useCallback(
            async (
                applicationId
            ) => {

                try {

                    setLoading(true);

                    clearError();

                    const response =
                        await getApplicationApi(
                            applicationId
                        );

                    const application =
                        response?.data?.data
                            ?.application;

                    if (application) {

                        setSelectedApplication(
                            application
                        );

                    }

                    return response;

                } catch (error) {

                    const message =
                        error?.response?.data
                            ?.message ||
                        "Failed to fetch application.";

                    setError(message);

                    throw error;

                } finally {

                    setLoading(false);

                }

            },
            [
                setLoading,
                clearError,
                setSelectedApplication,
                setError,
            ]
        );


    // =============================================
    // CREATE APPLICATION
    // =============================================

    const createApplication =
        useCallback(
            async (data) => {

                try {

                    setCreating(true);

                    clearError();

                    const response =
                        await createApplicationApi(
                            data
                        );

                    const application =
                        response?.data?.data
                            ?.application;

                    if (application) {

                        addApplication(
                            application
                        );

                    }

                    return response;

                } catch (error) {

                    const message =
                        error?.response?.data
                            ?.message ||
                        "Failed to create application.";

                    setError(message);

                    throw error;

                } finally {

                    setCreating(false);

                }

            },
            [
                setCreating,
                clearError,
                addApplication,
                setError,
            ]
        );


    // =============================================
    // UPDATE APPLICATION
    // =============================================

    const updateApplication =
        useCallback(
            async (
                applicationId,
                data
            ) => {

                try {

                    setUpdating(true);

                    clearError();

                    const response =
                        await updateApplicationApi(
                            applicationId,
                            data
                        );

                    const application =
                        response?.data?.data
                            ?.application;

                    if (application) {

                        updateApplicationInStore(
                            applicationId,
                            application
                        );

                    }

                    return response;

                } catch (error) {

                    const message =
                        error?.response?.data
                            ?.message ||
                        "Failed to update application.";

                    setError(message);

                    throw error;

                } finally {

                    setUpdating(false);

                }

            },
            [
                setUpdating,
                clearError,
                updateApplicationInStore,
                setError,
            ]
        );


    // =============================================
    // DELETE APPLICATION
    // =============================================

    const deleteApplication =
        useCallback(
            async (
                applicationId
            ) => {

                try {

                    setDeleting(true);

                    clearError();

                    const response =
                        await deleteApplicationApi(
                            applicationId
                        );

                    removeApplication(
                        applicationId
                    );

                    return response;

                } catch (error) {

                    const message =
                        error?.response?.data
                            ?.message ||
                        "Failed to delete application.";

                    setError(message);

                    throw error;

                } finally {

                    setDeleting(false);

                }

            },
            [
                setDeleting,
                clearError,
                removeApplication,
                setError,
            ]
        );


    // =============================================
    // RETURN
    // =============================================

    return {

        applications,

        selectedApplication,

        isLoading,

        isCreating,

        isUpdating,

        isDeleting,

        error,

        getAllApplications,

        getApplication,

        createApplication,

        updateApplication,

        deleteApplication,

        clearError,

        clearSelectedApplication,

    };

};


export default useApplication;