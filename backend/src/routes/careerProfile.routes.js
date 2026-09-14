import express from "express";

import {
    getCareerProfile,
    createCareerProfile,
    updateCareerProfile,
    deleteCareerProfile,

    updateSkills,
    clearSkills,

    getExperiences,
    addExperience,
    updateExperience,
    deleteExperience,

    getProjects,
    addProject,
    updateProject,
    deleteProject,

    getEducation,
    addEducation,
    updateEducation,
    deleteEducation,

    getCertifications,
    addCertification,
    updateCertification,
    deleteCertification,
    importCareerProfileFromResume,
} from "../controllers/careerProfile.controller.js";

import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @GET : /get-career-profile
 * @description :
 * Retrieves the authenticated user's career profile.
 * @access : Private
 */
router.get("/get-career-profile", authenticate, getCareerProfile);

/**
 * @POST : /create-career-profile
 * @description :
 * Creates a new career profile for the authenticated user.
 * @access : Private
 */
router.post("/create-career-profile", authenticate, createCareerProfile);

/**
 * @PATCH : /update-career-profile
 * @description :
 * Updates the authenticated user's career profile.
 * @access : Private
 */
router.patch("/update-career-profile", authenticate, updateCareerProfile);



/**
 * @POST : /import-from-resume/:resumeId
 *
 * @description :
 * Imports parsed resume data into the authenticated user's
 * career profile and replaces the existing career profile data.
 *
 * The resume must belong to the authenticated user and must
 * have already been parsed.
 *
 * @access : Private
 */
router.post("/import-from-resume/:resumeId",authenticate,importCareerProfileFromResume);



/**
 * @DELETE : /delete-career-profile
 * @description :
 * Deletes the authenticated user's complete career profile.
 * @access : Private
 */
router.delete("/delete-career-profile", authenticate, deleteCareerProfile);

/**
 * @PATCH : /skills
 * @description :
 * Replaces the authenticated user's complete skills list.
 * @access : Private
 */
router.patch("/skills", authenticate, updateSkills);

/**
 * @DELETE : /skills
 * @description :
 * Removes all skills from the authenticated user's career profile.
 * @access : Private
 */
router.delete("/skills", authenticate, clearSkills);


/**
 * @GET : /experience
 * @description :
 * Retrieves all work experiences from the authenticated user's profile.
 * @access : Private
 */
router.get("/experience", authenticate, getExperiences);

/**
 * @POST : /experience
 * @description :
 * Adds a new work experience to the authenticated user's profile.
 * @access : Private
 */
router.post("/experience", authenticate, addExperience);

/**
 * @PATCH : /experience/:experienceId
 * @description :
 * Updates a specific work experience.
 * @access : Private
 */
router.patch("/experience/:experienceId", authenticate, updateExperience);

/**
 * @DELETE : /experience/:experienceId
 * @description :
 * Deletes a specific work experience.
 * @access : Private
 */
router.delete("/experience/:experienceId", authenticate, deleteExperience);

/**
 * @GET : /project
 * @description :
 * Retrieves all projects from the authenticated user's profile.
 * @access : Private
 */
router.get("/project", authenticate, getProjects);

/**
 * @POST : /project
 * @description :
 * Adds a new project to the authenticated user's profile.
 * @access : Private
 */
router.post("/project", authenticate, addProject);

/**
 * @PATCH : /project/:projectId
 * @description :
 * Updates a specific project.
 * @access : Private
 */
router.patch("/project/:projectId", authenticate, updateProject);

/**
 * @DELETE : /project/:projectId
 * @description :
 * Deletes a specific project.
 * @access : Private
 */
router.delete("/project/:projectId", authenticate, deleteProject);


/**
 * @GET : /education
 * @description :
 * Retrieves all education records from the authenticated user's profile.
 * @access : Private
 */
router.get("/education", authenticate, getEducation);

/**
 * @POST : /education
 * @description :
 * Adds a new education record to the authenticated user's profile.
 * @access : Private
 */
router.post("/education", authenticate, addEducation);

/**
 * @PATCH : /education/:educationId
 * @description :
 * Updates a specific education record.
 * @access : Private
 */
router.patch("/education/:educationId", authenticate, updateEducation);

/**
 * @DELETE : /education/:educationId
 * @description :
 * Deletes a specific education record.
 * @access : Private
 */
router.delete("/education/:educationId", authenticate, deleteEducation);


/**
 * @GET : /certification
 * @description :
 * Retrieves all certifications from the authenticated user's profile.
 * @access : Private
 */
router.get("/certification", authenticate, getCertifications);

/**
 * @POST : /certification
 * @description :
 * Adds a new certification to the authenticated user's profile.
 * @access : Private
 */
router.post("/certification", authenticate, addCertification);

/**
 * @PATCH : /certification/:certificationId
 * @description :
 * Updates a specific certification.
 * @access : Private
 */
router.patch("/certification/:certificationId", authenticate, updateCertification);

/**
 * @DELETE : /certification/:certificationId
 * @description :
 * Deletes a specific certification.
 * @access : Private
 */
router.delete("/certification/:certificationId", authenticate, deleteCertification);


export default router;