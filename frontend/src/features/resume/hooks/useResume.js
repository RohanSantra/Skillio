import { useCallback } from "react";

import useResumeStore from "../store/resume.store.js";

import {
    getAllResumes as getAllResumesApi,
    getResume as getResumeApi,
    createResume as createResumeApi,
    updateResume as updateResumeApi,
    setPrimaryResume as setPrimaryResumeApi,
    deleteResume as deleteResumeApi,
    parseResume as parseResumeApi,
    uploadResume as uploadResumeApi,
} from "../services/resume.api.js";


const useResume = () => {

    // ---------------------------------------------
    // Store state
    // ---------------------------------------------

    const resumes = useResumeStore(
        (state) => state.resumes
    );

    const currentResume = useResumeStore(
        (state) => state.currentResume
    );

    const isLoading = useResumeStore(
        (state) => state.isLoading
    );

    const isCreating = useResumeStore(
        (state) => state.isCreating
    );

    const isUpdating = useResumeStore(
        (state) => state.isUpdating
    );

    const isParsing = useResumeStore(
        (state) => state.isParsing
    );

    const error = useResumeStore(
        (state) => state.error
    );


    // ---------------------------------------------
    // Store actions
    // ---------------------------------------------

    const setResumes = useResumeStore(
        (state) => state.setResumes
    );

    const setCurrentResume = useResumeStore(
        (state) => state.setCurrentResume
    );

    const addResume = useResumeStore(
        (state) => state.addResume
    );

    const updateResumeInStore = useResumeStore(
        (state) => state.updateResumeInStore
    );

    const removeResume = useResumeStore(
        (state) => state.removeResume
    );

    const setLoading = useResumeStore(
        (state) => state.setLoading
    );

    const setCreating = useResumeStore(
        (state) => state.setCreating
    );

    const setUpdating = useResumeStore(
        (state) => state.setUpdating
    );

    const setParsing = useResumeStore(
        (state) => state.setParsing
    );

    const setError = useResumeStore(
        (state) => state.setError
    );

    const clearError = useResumeStore(
        (state) => state.clearError
    );


    // ---------------------------------------------
    // Get all resumes
    // ---------------------------------------------

    const getAllResumes = useCallback(async () => {

        try {

            setLoading(true);
            clearError();

            const response =
                await getAllResumesApi();

            const resumesData =
                response?.data?.data?.resumes ?? [];

            setResumes(resumesData);

            return response;

        } catch (error) {

            setError(
                error?.response?.data?.message ||
                "Failed to fetch resumes."
            );

            throw error;

        } finally {

            setLoading(false);

        }

    }, [
        setLoading,
        clearError,
        setResumes,
        setError,
    ]);


    // ---------------------------------------------
    // Get single resume
    // ---------------------------------------------

    const getResume = useCallback(
        async (resumeId) => {

            try {

                setLoading(true);
                clearError();

                const response =
                    await getResumeApi(resumeId);

                const resume =
                    response?.data?.data?.resume;

                if (resume) {
                    setCurrentResume(resume);
                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to fetch resume."
                );

                throw error;

            } finally {

                setLoading(false);

            }

        },
        [
            setLoading,
            clearError,
            setCurrentResume,
            setError,
        ]
    );


    // ---------------------------------------------
    // Create resume
    // ---------------------------------------------

    const createResume = useCallback(
        async (data) => {

            try {

                setCreating(true);
                clearError();

                const response =
                    await createResumeApi(data);

                const resume =
                    response?.data?.data?.resume;

                if (resume) {

                    addResume(resume);

                    setCurrentResume(resume);

                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to create resume."
                );

                throw error;

            } finally {

                setCreating(false);

            }

        },
        [
            setCreating,
            clearError,
            addResume,
            setCurrentResume,
            setError,
        ]
    );


    // ---------------------------------------------
    // Update resume
    // ---------------------------------------------

    const updateResume = useCallback(
        async (resumeId, data) => {

            try {

                setUpdating(true);
                clearError();

                const response =
                    await updateResumeApi(
                        resumeId,
                        data
                    );

                const resume =
                    response?.data?.data?.resume;

                if (resume) {
                    updateResumeInStore(resume);
                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to update resume."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        },
        [
            setUpdating,
            clearError,
            updateResumeInStore,
            setError,
        ]
    );


    // ---------------------------------------------
    // Set primary resume
    // ---------------------------------------------

    const setPrimaryResume = useCallback(
        async (resumeId) => {

            try {

                setUpdating(true);
                clearError();

                const response =
                    await setPrimaryResumeApi(
                        resumeId
                    );

                const updatedResume =
                    response?.data?.data?.resume;

                if (updatedResume) {

                    // Update selected resume
                    updateResumeInStore(updatedResume);

                    // Update all other resumes
                    const updatedResumes =
                        useResumeStore
                            .getState()
                            .resumes
                            .map((resume) => ({
                                ...resume,
                                isPrimary:
                                    resume._id === resumeId,
                            }));

                    setResumes(updatedResumes);

                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to set primary resume."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        },
        [
            setUpdating,
            clearError,
            updateResumeInStore,
            setResumes,
            setError,
        ]
    );


    // ---------------------------------------------
    // Delete resume
    // ---------------------------------------------

    const deleteResume = useCallback(
        async (resumeId) => {

            try {

                setUpdating(true);
                clearError();

                const response =
                    await deleteResumeApi(resumeId);

                removeResume(resumeId);

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to delete resume."
                );

                throw error;

            } finally {

                setUpdating(false);

            }

        },
        [
            setUpdating,
            clearError,
            removeResume,
            setError,
        ]
    );


    // ---------------------------------------------
    // Parse resume with AI
    // ---------------------------------------------

    const parseResume = useCallback(
        async (resumeId) => {

            try {

                setParsing(true);
                clearError();

                const response =
                    await parseResumeApi(resumeId);

                const parsedData =
                    response?.data?.data?.parsedData;

                if (parsedData) {

                    const existingResume =
                        useResumeStore
                            .getState()
                            .resumes
                            .find(
                                (resume) =>
                                    resume._id === resumeId
                            );

                    if (existingResume) {

                        updateResumeInStore({
                            ...existingResume,
                            parsedData,
                        });

                    }

                }

                return response;

            } catch (error) {

                setError(
                    error?.response?.data?.message ||
                    "Failed to parse resume."
                );

                throw error;

            } finally {

                setParsing(false);

            }

        },
        [
            setParsing,
            clearError,
            updateResumeInStore,
            setError,
        ]
    );


    // =============================================
    // Upload Resume
    // =============================================

    const uploadResume = useCallback(

        async (file) => {

            try {

                setCreating(true);

                clearError();


                const response =
                    await uploadResumeApi(
                        file
                    );


                const resume =
                    response?.data?.data?.resume;


                if (resume) {

                    addResume(resume);

                    setCurrentResume(resume);

                }


                return response;

            }

            catch (error) {

                setError(

                    error?.response?.data?.message ||

                    "Failed to upload resume."

                );

                throw error;

            }

            finally {

                setCreating(false);

            }

        },
        [
            setCreating,
            clearError,
            addResume,
            setCurrentResume,
            setError,
        ]

    );



    return {

        // State
        resumes,
        currentResume,

        isLoading,
        isCreating,
        isUpdating,
        isParsing,

        error,


        // API actions
        uploadResume,
        getAllResumes,
        getResume,
        createResume,
        updateResume,
        setPrimaryResume,
        deleteResume,
        parseResume,

        // Utility
        clearError,

    };

};


export default useResume;