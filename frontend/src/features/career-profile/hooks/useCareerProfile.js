import { useCallback } from "react";
import axios from "axios";

import useCareerProfileStore from "../store/careerProfile.store";

import {
  getCareerProfile,
  createCareerProfile,
  updateCareerProfile,
  deleteCareerProfile,

  importFromResume,

  updateSkills,
  clearSkills,

  addExperience,
  updateExperience,
  deleteExperience,

  addProject,
  updateProject,
  deleteProject,

  addEducation,
  updateEducation,
  deleteEducation,

  addCertification,
  updateCertification,
  deleteCertification,
} from "../services/careerProfile.api.js";

const getErrorMessage = (error) => {
  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong."
  );
};

const useCareerProfile = () => {
  const {
    careerProfile,
    hasProfile,
    isProfileLoading,
    isSubmitting,
    isImporting,
    error,

    setCareerProfile,
    setProfileLoading,
    setSubmitting,
    setImporting,
    setError,
    clearError,
    clearCareerProfile,
  } = useCareerProfileStore();

  // =====================================
  // LOAD PROFILE
  // =====================================

  const fetchCareerProfile = useCallback(async () => {
    try {
      setProfileLoading(true);
      clearError();

      const response = await getCareerProfile();

      const profile =
        response?.data?.careerProfile;

      setCareerProfile(profile);

      return {
        success: true,
        profile,
      };
    } catch (error) {
      // 404 means profile simply does not exist yet.
      if (
        axios.isAxiosError(error) &&
        error.response?.status === 404
      ) {
        clearCareerProfile();

        return {
          success: true,
          profile: null,
          notFound: true,
        };
      }

      const message = getErrorMessage(error);

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setProfileLoading(false);
    }
  }, [
    setProfileLoading,
    clearError,
    setCareerProfile,
    clearCareerProfile,
    setError,
  ]);

  // =====================================
  // CREATE PROFILE
  // =====================================

  const createProfile = useCallback(
    async (profileData = {}) => {
      try {
        setSubmitting(true);
        clearError();

        const response =
          await createCareerProfile(profileData);

        const profile =
          response?.data?.careerProfile;

        setCareerProfile(profile);

        return {
          success: true,
          profile,
          message: response?.message,
        };
      } catch (error) {
        // IMPORTANT:
        // 409 means the profile already exists.
        // Fetch it instead of treating it as a fatal error.
        if (
          axios.isAxiosError(error) &&
          error.response?.status === 409
        ) {
          return await fetchCareerProfile();
        }

        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      setSubmitting,
      clearError,
      setCareerProfile,
      fetchCareerProfile,
      setError,
    ]
  );

  // =====================================
  // UPDATE PROFILE
  // =====================================

  const updateProfile = useCallback(
    async (updates) => {
      try {
        setSubmitting(true);
        clearError();

        const response =
          await updateCareerProfile(updates);

        const profile =
          response?.data?.careerProfile;

        setCareerProfile(profile);

        return {
          success: true,
          profile,
          message: response?.message,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      setSubmitting,
      clearError,
      setCareerProfile,
      setError,
    ]
  );

  // =====================================
  // SAVE BASIC INFO
  // CREATE IF NOT EXISTS
  // UPDATE IF EXISTS
  // =====================================

  const saveBasicInfo = useCallback(
    async ({ headline, summary }) => {
      if (!hasProfile) {
        return createProfile({
          headline,
          summary,
          skills: [],
          experiences: [],
          projects: [],
          education: [],
          certifications: [],
        });
      }

      return updateProfile({
        headline,
        summary,
      });
    },
    [
      hasProfile,
      createProfile,
      updateProfile,
    ]
  );

  // =====================================
  // SKILLS
  // =====================================

  const saveSkills = useCallback(
    async (skills) => {
      if (!hasProfile) {
        return {
          success: false,
          error:
            "Please create your career profile first.",
        };
      }

      try {
        setSubmitting(true);
        clearError();

        const response =
          await updateSkills(skills);

        const updatedSkills =
          response?.data?.skills || [];

        setCareerProfile({
          ...careerProfile,
          skills: updatedSkills,
        });

        return {
          success: true,
          skills: updatedSkills,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      hasProfile,
      careerProfile,
      setSubmitting,
      clearError,
      setCareerProfile,
      setError,
    ]
  );

  const removeAllSkills = useCallback(async () => {
    try {
      setSubmitting(true);

      const response = await clearSkills();

      const skills =
        response?.data?.skills || [];

      setCareerProfile({
        ...careerProfile,
        skills,
      });

      return {
        success: true,
      };
    } catch (error) {
      const message = getErrorMessage(error);

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setSubmitting(false);
    }
  }, [
    careerProfile,
    setSubmitting,
    setCareerProfile,
    setError,
  ]);

  // =====================================
  // EXPERIENCE
  // =====================================

  const createExperience = useCallback(
    async (data) => {
      try {
        setSubmitting(true);
        clearError();

        const response =
          await addExperience(data);

        const experience =
          response?.data?.experience;

        setCareerProfile({
          ...careerProfile,
          experiences: [
            ...(careerProfile?.experiences || []),
            experience,
          ],
        });

        return {
          success: true,
          experience,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      clearError,
      setCareerProfile,
      setError,
    ]
  );

  const editExperience = useCallback(
    async (experienceId, data) => {
      try {
        setSubmitting(true);

        const response =
          await updateExperience(
            experienceId,
            data
          );

        const updatedExperience =
          response?.data?.experience;

        setCareerProfile({
          ...careerProfile,
          experiences:
            careerProfile.experiences.map(
              (item) =>
                item._id === experienceId
                  ? updatedExperience
                  : item
            ),
        });

        return {
          success: true,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      setCareerProfile,
      setError,
    ]
  );

  const removeExperience = useCallback(
    async (experienceId) => {
      try {
        setSubmitting(true);

        await deleteExperience(experienceId);

        setCareerProfile({
          ...careerProfile,
          experiences:
            careerProfile.experiences.filter(
              (item) =>
                item._id !== experienceId
            ),
        });

        return {
          success: true,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      setCareerProfile,
      setError,
    ]
  );

  // =====================================
  // PROJECTS
  // =====================================

  const createProject = useCallback(
    async (data) => {
      try {
        setSubmitting(true);

        const response =
          await addProject(data);

        const project =
          response?.data?.project;

        setCareerProfile({
          ...careerProfile,
          projects: [
            ...(careerProfile?.projects || []),
            project,
          ],
        });

        return {
          success: true,
          project,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      setCareerProfile,
      setError,
    ]
  );

  const editProject = useCallback(
    async (projectId, data) => {
      try {
        setSubmitting(true);

        const response =
          await updateProject(
            projectId,
            data
          );

        const updatedProject =
          response?.data?.project;

        setCareerProfile({
          ...careerProfile,
          projects:
            careerProfile.projects.map(
              (item) =>
                item._id === projectId
                  ? updatedProject
                  : item
            ),
        });

        return {
          success: true,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      setCareerProfile,
      setError,
    ]
  );

  const removeProject = useCallback(
    async (projectId) => {
      try {
        setSubmitting(true);

        await deleteProject(projectId);

        setCareerProfile({
          ...careerProfile,
          projects:
            careerProfile.projects.filter(
              (item) =>
                item._id !== projectId
            ),
        });

        return {
          success: true,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      setCareerProfile,
      setError,
    ]
  );

  // =====================================
  // EDUCATION
  // =====================================

  const createEducation = useCallback(
    async (data) => {
      try {
        setSubmitting(true);

        const response =
          await addEducation(data);

        const education =
          response?.data?.education;

        setCareerProfile({
          ...careerProfile,
          education: [
            ...(careerProfile?.education || []),
            education,
          ],
        });

        return {
          success: true,
          education,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      setCareerProfile,
      setError,
    ]
  );

  const editEducation = useCallback(
    async (educationId, data) => {
      try {
        setSubmitting(true);

        const response =
          await updateEducation(
            educationId,
            data
          );

        const updatedEducation =
          response?.data?.education;

        setCareerProfile({
          ...careerProfile,
          education:
            careerProfile.education.map(
              (item) =>
                item._id === educationId
                  ? updatedEducation
                  : item
            ),
        });

        return {
          success: true,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      setCareerProfile,
      setError,
    ]
  );

  const removeEducation = useCallback(
    async (educationId) => {
      try {
        setSubmitting(true);

        await deleteEducation(educationId);

        setCareerProfile({
          ...careerProfile,
          education:
            careerProfile.education.filter(
              (item) =>
                item._id !== educationId
            ),
        });

        return {
          success: true,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      setCareerProfile,
      setError,
    ]
  );

  // =====================================
  // CERTIFICATIONS
  // =====================================

  const createCertification = useCallback(
    async (data) => {
      try {
        setSubmitting(true);

        const response =
          await addCertification(data);

        const certification =
          response?.data?.certification;

        setCareerProfile({
          ...careerProfile,
          certifications: [
            ...(careerProfile?.certifications || []),
            certification,
          ],
        });

        return {
          success: true,
          certification,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      setCareerProfile,
      setError,
    ]
  );

  const editCertification = useCallback(
    async (certificationId, data) => {
      try {
        setSubmitting(true);

        const response =
          await updateCertification(
            certificationId,
            data
          );

        const updatedCertification =
          response?.data?.certification;

        setCareerProfile({
          ...careerProfile,
          certifications:
            careerProfile.certifications.map(
              (item) =>
                item._id === certificationId
                  ? updatedCertification
                  : item
            ),
        });

        return {
          success: true,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      setCareerProfile,
      setError,
    ]
  );

  const removeCertification = useCallback(
    async (certificationId) => {
      try {
        setSubmitting(true);

        await deleteCertification(
          certificationId
        );

        setCareerProfile({
          ...careerProfile,
          certifications:
            careerProfile.certifications.filter(
              (item) =>
                item._id !== certificationId
            ),
        });

        return {
          success: true,
        };
      } catch (error) {
        const message = getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setSubmitting(false);
      }
    },
    [
      careerProfile,
      setSubmitting,
      setCareerProfile,
      setError,
    ]
  );

  // =====================================
  // DELETE PROFILE
  // =====================================

  const removeCareerProfile = useCallback(async () => {
    try {
      setSubmitting(true);

      await deleteCareerProfile();

      clearCareerProfile();

      return {
        success: true,
      };
    } catch (error) {
      const message = getErrorMessage(error);

      setError(message);

      return {
        success: false,
        error: message,
      };
    } finally {
      setSubmitting(false);
    }
  }, [
    setSubmitting,
    clearCareerProfile,
    setError,
  ]);


  // =====================================
  // IMPORT FROM RESUME
  // =====================================

  const importCareerProfileFromResume = useCallback(
    async (resumeId) => {
      if (!resumeId) {
        return {
          success: false,
          error: "Resume ID is required.",
        };
      }

      try {
        setImporting(true);
        clearError();

        const response =
          await importFromResume(resumeId);

        const profile =
          response?.data?.careerProfile;

        if (!profile) {
          throw new Error(
            "Career profile was not returned by the server."
          );
        }

        setCareerProfile(profile);

        return {
          success: true,
          profile,
          message: response?.message,
        };
      } catch (error) {
        const message =
          getErrorMessage(error);

        setError(message);

        return {
          success: false,
          error: message,
        };
      } finally {
        setImporting(false);
      }
    },
    [
      setImporting,
      clearError,
      setCareerProfile,
      setError,
    ]
  );



  return {
    careerProfile,
    hasProfile,

    isProfileLoading,
    isSubmitting,
    isImporting,

    error,
    clearError,

    fetchCareerProfile,

    createProfile,
    updateProfile,
    saveBasicInfo,
    removeCareerProfile,

    importCareerProfileFromResume,

    saveSkills,
    removeAllSkills,

    createExperience,
    editExperience,
    removeExperience,

    createProject,
    editProject,
    removeProject,

    createEducation,
    editEducation,
    removeEducation,

    createCertification,
    editCertification,
    removeCertification,
  };
};

export default useCareerProfile;