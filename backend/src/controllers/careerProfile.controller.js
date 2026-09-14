import mongoose from "mongoose";
import CareerProfile from "../models/careerProfile.model.js";
import Resume from "../models/resume.model.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";



// =========================================
// SAFE DATE PARSER
// =========================================

const parseDateOrNull = (value) => {
    // No value
    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {
        return null;
    }

    // Already a Date
    if (value instanceof Date) {
        return isNaN(value.getTime())
            ? null
            : value;
    }

    // Convert string/number to Date
    const date = new Date(value);

    // Invalid date
    if (isNaN(date.getTime())) {
        return null;
    }

    return date;
};


/**
 * @Name : getCareerProfile
 * @GET : /career-profile/get-career-profile
 * @access : Private
 * @description :
 * Retrieves the authenticated user's career profile.
 *
 * Each user can have only one career profile, identified by the
 * unique userId field in the CareerProfile model.
 */
const getCareerProfile = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                careerProfile,
            },
            "Career profile retrieved successfully."
        )
    );
});

/**
 * @Name : createCareerProfile
 * @POST : /career-profile/create-career-profile
 * @access : Private
 * @description :
 * Creates a career profile for the authenticated user.
 *
 * A user can have only one career profile. The controller checks for
 * an existing profile before creating a new document.
 */
const createCareerProfile = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    /**
     * Prevent the authenticated user from creating multiple
     * career profiles.
     */
    const existingProfile = await CareerProfile.findOne({
        userId,
    });

    if (existingProfile) {
        throw new ApiError(
            409,
            "Career profile already exists."
        );
    }

    const {
        headline,
        summary,
        skills,
        experiences,
        projects,
        education,
        certifications,
    } = req.body;

    const careerProfile = await CareerProfile.create({
        userId,
        headline: headline || "",
        summary: summary || "",
        skills: skills || [],
        experiences: experiences || [],
        projects: projects || [],
        education: education || [],
        certifications: certifications || [],
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                careerProfile,
            },
            "Career profile created successfully."
        )
    );
});

/**
 * @Name : updateCareerProfile
 * @PATCH : /career-profile/update-career-profile
 * @access : Private
 * @description :
 * Updates the authenticated user's career profile.
 *
 * Only fields provided by the client are updated. This allows the
 * frontend to modify individual profile sections without replacing
 * the entire career profile document.
 */
const updateCareerProfile = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const allowedFields = [
        "headline",
        "summary",
        "skills",
        "experiences",
        "projects",
        "education",
        "certifications",
    ];

    /**
     * Build the update object using only fields that belong
     * to the CareerProfile model.
     */
    const updates = {};

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    }

    /**
     * Prevent an empty PATCH request.
     */
    if (Object.keys(updates).length === 0) {
        throw new ApiError(
            400,
            "No valid fields provided for update."
        );
    }

    const careerProfile = await CareerProfile.findOneAndUpdate(
        {
            userId,
        },
        {
            $set: updates,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                careerProfile,
            },
            "Career profile updated successfully."
        )
    );
});

/**
 * @Name : deleteCareerProfile
 * @DELETE : /career-profile/delete-career-profile
 * @access : Private
 * @description :
 * Deletes the authenticated user's career profile.
 *
 * This removes the complete career profile document including
 * skills, experience, projects, education, and certifications.
 */
const deleteCareerProfile = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const careerProfile = await CareerProfile.findOneAndDelete({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Career profile deleted successfully."
        )
    );
});


/**
 * @Name : updateSkills
 * @PATCH : /career-profile/skills
 * @access : Private
 * @description :
 * Replaces the authenticated user's complete skills list.
 *
 * The skills array is validated before updating the career profile.
 * Duplicate skills are removed so that the profile maintains a clean
 * and consistent list of professional skills.
 */
const updateSkills = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const { skills } = req.body;

    if (!Array.isArray(skills)) {
        throw new ApiError(
            400,
            "Skills must be provided as an array."
        );
    }

    /**
     * Remove empty values, trim whitespace, and remove duplicates.
     */
    const cleanedSkills = [
        ...new Set(
            skills
                .filter(
                    (skill) =>
                        typeof skill === "string" &&
                        skill.trim().length > 0
                )
                .map((skill) => skill.trim())
        ),
    ];

    const careerProfile = await CareerProfile.findOneAndUpdate(
        {
            userId,
        },
        {
            $set: {
                skills: cleanedSkills,
            },
        },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                skills: careerProfile.skills,
            },
            "Skills updated successfully."
        )
    );
});

/**
 * @Name : clearSkills
 * @DELETE : /career-profile/skills
 * @access : Private
 * @description :
 * Removes all skills from the authenticated user's career profile.
 *
 * This operation only clears the skills array and does not affect
 * any other career profile information.
 */
const clearSkills = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const careerProfile = await CareerProfile.findOneAndUpdate(
        {
            userId,
        },
        {
            $set: {
                skills: [],
            },
        },
        {
            new: true,
        }
    );

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                skills: careerProfile.skills,
            },
            "All skills removed successfully."
        )
    );
});


/**
 * @Name : addExperience
 * @POST : /career-profile/experience
 * @access : Private
 * @description :
 * Adds a new work experience to the authenticated user's career profile.
 */
const addExperience = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const {
        company,
        position,
        location,
        startDate,
        endDate,
        isCurrent,
        description,
        technologies,
    } = req.body;

    if (!company || !position || !startDate) {
        throw new ApiError(
            400,
            "Company, position and start date are required."
        );
    }

    if (isCurrent && endDate) {
        throw new ApiError(
            400,
            "A current experience cannot have an end date."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    careerProfile.experiences.push({
        company: company.trim(),
        position: position.trim(),
        location: location?.trim() || "",
        startDate,
        endDate: isCurrent ? null : endDate || null,
        isCurrent: Boolean(isCurrent),
        description: description?.trim() || "",
        technologies: technologies || [],
    });

    await careerProfile.save();

    const experience =
        careerProfile.experiences[
        careerProfile.experiences.length - 1
        ];

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                experience,
            },
            "Experience added successfully."
        )
    );
});

/**
 * @Name : updateExperience
 * @PATCH : /career-profile/experience/:experienceId
 * @access : Private
 * @description :
 * Updates a specific work experience belonging to the authenticated user.
 */
const updateExperience = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { experienceId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!experienceId) {
        throw new ApiError(
            400,
            "Experience ID is required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    const experience =
        careerProfile.experiences.id(experienceId);

    if (!experience) {
        throw new ApiError(
            404,
            "Experience not found."
        );
    }

    const allowedFields = [
        "company",
        "position",
        "location",
        "startDate",
        "endDate",
        "isCurrent",
        "description",
        "technologies",
    ];

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            experience[field] = req.body[field];
        }
    }

    /**
     * Prevent an experience marked as current from
     * simultaneously having an end date.
     */
    if (experience.isCurrent) {
        experience.endDate = null;
    }

    await careerProfile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                experience,
            },
            "Experience updated successfully."
        )
    );
});

/**
 * @Name : deleteExperience
 * @DELETE : /career-profile/experience/:experienceId
 * @access : Private
 * @description :
 * Removes a specific work experience from the authenticated user's
 * career profile.
 */
const deleteExperience = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { experienceId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!experienceId) {
        throw new ApiError(
            400,
            "Experience ID is required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    const experience =
        careerProfile.experiences.id(experienceId);

    if (!experience) {
        throw new ApiError(
            404,
            "Experience not found."
        );
    }

    experience.deleteOne();

    await careerProfile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Experience deleted successfully."
        )
    );
});

/**
 * @Name : getExperiences
 * @GET : /career-profile/experience
 * @access : Private
 * @description :
 * Retrieves all work experiences belonging to the authenticated user.
 */
const getExperiences = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    }).select("experiences");

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                experiences: careerProfile.experiences,
            },
            "Experiences retrieved successfully."
        )
    );
});

/**
 * @Name : getProjects
 * @GET : /career-profile/project
 * @access : Private
 * @description :
 * Retrieves all projects belonging to the authenticated user's career profile.
 */
const getProjects = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    }).select("projects");

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                projects: careerProfile.projects,
            },
            "Projects retrieved successfully."
        )
    );
});


/**
 * @Name : addProject
 * @POST : /career-profile/project
 * @access : Private
 * @description :
 * Adds a new project to the authenticated user's career profile.
 */
const addProject = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const {
        name,
        description,
        technologies,
        projectUrl,
        githubUrl,
    } = req.body;

    if (!name) {
        throw new ApiError(
            400,
            "Project name is required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    careerProfile.projects.push({
        name: name.trim(),
        description: description?.trim() || "",
        technologies: technologies || [],
        projectUrl: projectUrl?.trim() || "",
        githubUrl: githubUrl?.trim() || "",
    });

    await careerProfile.save();

    const project =
        careerProfile.projects[
        careerProfile.projects.length - 1
        ];

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                project,
            },
            "Project added successfully."
        )
    );
});


/**
 * @Name : updateProject
 * @PATCH : /career-profile/project/:projectId
 * @access : Private
 * @description :
 * Updates a specific project belonging to the authenticated user.
 */
const updateProject = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { projectId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!projectId) {
        throw new ApiError(
            400,
            "Project ID is required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    const project =
        careerProfile.projects.id(projectId);

    if (!project) {
        throw new ApiError(
            404,
            "Project not found."
        );
    }

    const allowedFields = [
        "name",
        "description",
        "technologies",
        "projectUrl",
        "githubUrl",
    ];

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            project[field] = req.body[field];
        }
    }

    await careerProfile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                project,
            },
            "Project updated successfully."
        )
    );
});


/**
 * @Name : deleteProject
 * @DELETE : /career-profile/project/:projectId
 * @access : Private
 * @description :
 * Removes a specific project from the authenticated user's career profile.
 */
const deleteProject = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { projectId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!projectId) {
        throw new ApiError(
            400,
            "Project ID is required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    const project =
        careerProfile.projects.id(projectId);

    if (!project) {
        throw new ApiError(
            404,
            "Project not found."
        );
    }

    project.deleteOne();

    await careerProfile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Project deleted successfully."
        )
    );
});


/**
 * @Name : getEducation
 * @GET : /career-profile/education
 * @access : Private
 * @description :
 * Retrieves all education records belonging to the authenticated user's
 * career profile.
 */
const getEducation = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    }).select("education");

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                education: careerProfile.education,
            },
            "Education retrieved successfully."
        )
    );
});


/**
 * @Name : addEducation
 * @POST : /career-profile/education
 * @access : Private
 * @description :
 * Adds a new education record to the authenticated user's career profile.
 */
const addEducation = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const {
        institution,
        degree,
        fieldOfStudy,
        startDate,
        endDate,
    } = req.body;

    if (!institution) {
        throw new ApiError(
            400,
            "Institution is required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    careerProfile.education.push({
        institution: institution.trim(),
        degree: degree?.trim() || "",
        fieldOfStudy: fieldOfStudy?.trim() || "",
        startDate: startDate || null,
        endDate: endDate || null,
    });

    await careerProfile.save();

    const education =
        careerProfile.education[
        careerProfile.education.length - 1
        ];

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                education,
            },
            "Education added successfully."
        )
    );
});


/**
 * @Name : updateEducation
 * @PATCH : /career-profile/education/:educationId
 * @access : Private
 * @description :
 * Updates a specific education record belonging to the authenticated user.
 */
const updateEducation = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { educationId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!educationId) {
        throw new ApiError(
            400,
            "Education ID is required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    const education =
        careerProfile.education.id(educationId);

    if (!education) {
        throw new ApiError(
            404,
            "Education record not found."
        );
    }

    const allowedFields = [
        "institution",
        "degree",
        "fieldOfStudy",
        "startDate",
        "endDate",
    ];

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            education[field] = req.body[field];
        }
    }

    await careerProfile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                education,
            },
            "Education updated successfully."
        )
    );
});


/**
 * @Name : deleteEducation
 * @DELETE : /career-profile/education/:educationId
 * @access : Private
 * @description :
 * Removes a specific education record from the authenticated user's
 * career profile.
 */
const deleteEducation = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { educationId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!educationId) {
        throw new ApiError(
            400,
            "Education ID is required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    const education =
        careerProfile.education.id(educationId);

    if (!education) {
        throw new ApiError(
            404,
            "Education record not found."
        );
    }

    education.deleteOne();

    await careerProfile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Education deleted successfully."
        )
    );
});


/**
 * @Name : getCertifications
 * @GET : /career-profile/certification
 * @access : Private
 * @description :
 * Retrieves all certifications belonging to the authenticated user's
 * career profile.
 */
const getCertifications = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    }).select("certifications");

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                certifications: careerProfile.certifications,
            },
            "Certifications retrieved successfully."
        )
    );
});


/**
 * @Name : addCertification
 * @POST : /career-profile/certification
 * @access : Private
 * @description :
 * Adds a new certification to the authenticated user's career profile.
 */
const addCertification = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const {
        name,
        issuer,
        issueDate,
        credentialUrl,
    } = req.body;

    if (!name) {
        throw new ApiError(
            400,
            "Certification name is required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    careerProfile.certifications.push({
        name: name.trim(),
        issuer: issuer?.trim() || "",
        issueDate: issueDate || null,
        credentialUrl: credentialUrl?.trim() || "",
    });

    await careerProfile.save();

    const certification =
        careerProfile.certifications[
        careerProfile.certifications.length - 1
        ];

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                certification,
            },
            "Certification added successfully."
        )
    );
});


/**
 * @Name : updateCertification
 * @PATCH : /career-profile/certification/:certificationId
 * @access : Private
 * @description :
 * Updates a specific certification belonging to the authenticated user.
 */
const updateCertification = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { certificationId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!certificationId) {
        throw new ApiError(
            400,
            "Certification ID is required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    const certification =
        careerProfile.certifications.id(certificationId);

    if (!certification) {
        throw new ApiError(
            404,
            "Certification not found."
        );
    }

    const allowedFields = [
        "name",
        "issuer",
        "issueDate",
        "credentialUrl",
    ];

    for (const field of allowedFields) {
        if (req.body[field] !== undefined) {
            certification[field] = req.body[field];
        }
    }

    await careerProfile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                certification,
            },
            "Certification updated successfully."
        )
    );
});


/**
 * @Name : deleteCertification
 * @DELETE : /career-profile/certification/:certificationId
 * @access : Private
 * @description :
 * Removes a specific certification from the authenticated user's career
 * profile.
 */
const deleteCertification = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { certificationId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!certificationId) {
        throw new ApiError(
            400,
            "Certification ID is required."
        );
    }

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    const certification =
        careerProfile.certifications.id(certificationId);

    if (!certification) {
        throw new ApiError(
            404,
            "Certification not found."
        );
    }

    certification.deleteOne();

    await careerProfile.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Certification deleted successfully."
        )
    );
});



/**
 * @Name : importCareerProfileFromResume
 * @POST : /career-profile/import-from-resume/:resumeId
 * @access : Private
 *
 * @description :
 * Imports parsed resume data into the authenticated user's
 * Career Profile.
 *
 * The Resume must:
 * - belong to the authenticated user
 * - have parsedData
 *
 * Existing Career Profile data is replaced by the
 * parsed resume data.
 */

const importCareerProfileFromResume = asyncHandler(
    async (req, res) => {
        const userId = req.user?.userId;
        const { resumeId } = req.params;

        // =========================================
        // AUTHENTICATION
        // =========================================

        if (!userId) {
            throw new ApiError(
                401,
                "Authentication required."
            );
        }

        // =========================================
        // VALIDATE RESUME ID
        // =========================================

        if (!resumeId) {
            throw new ApiError(
                400,
                "Resume ID is required."
            );
        }

        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            throw new ApiError(
                400,
                "Invalid resume ID."
            );
        }

        // =========================================
        // FIND RESUME
        // =========================================

        const resume = await Resume.findOne({
            _id: resumeId,
            userId,
        });

        if (!resume) {
            throw new ApiError(
                404,
                "Resume not found."
            );
        }

        // =========================================
        // VALIDATE PARSED DATA
        // =========================================

        const parsedData = resume.parsedData;

        if (
            !parsedData ||
            typeof parsedData !== "object" ||
            Array.isArray(parsedData)
        ) {
            throw new ApiError(
                400,
                "Resume has not been parsed yet or parsed data is invalid."
            );
        }

        // =========================================
        // NORMALIZE SKILLS
        // =========================================

        const skills = Array.isArray(parsedData.skills)
            ? parsedData.skills
                .filter(
                    (skill) =>
                        typeof skill === "string" &&
                        skill.trim()
                )
                .map((skill) => skill.trim())
            : [];

        // =========================================
        // NORMALIZE EXPERIENCES
        // Resume:
        // experience
        //
        // CareerProfile:
        // experiences
        // =========================================

        const experiences = Array.isArray(
            parsedData.experience
        )
            ? parsedData.experience
                .filter(
                    (experience) =>
                        experience &&
                        typeof experience === "object"
                )
                .map((experience) => {

                    const startDate =
                        parseDateOrNull(
                            experience.startDate
                        );

                    const endDate =
                        parseDateOrNull(
                            experience.endDate
                        );

                    // "Present", "Current", etc.
                    const endDateText =
                        typeof experience.endDate === "string"
                            ? experience.endDate
                                .trim()
                                .toLowerCase()
                            : "";

                    const isCurrent =
                        !endDate &&
                        (
                            !endDateText ||
                            endDateText === "present" ||
                            endDateText === "current" ||
                            endDateText === "now" ||
                            endDateText === "ongoing"
                        );

                    return {
                        company:
                            experience.company?.trim?.() || "",

                        position:
                            experience.position?.trim?.() || "",

                        location:
                            experience.location?.trim?.() || "",

                        startDate,

                        endDate,

                        isCurrent,

                        description:
                            experience.description
                                ?.trim?.() || "",

                        technologies:
                            Array.isArray(
                                experience.technologies
                            )
                                ? experience.technologies
                                    .filter(
                                        (technology) =>
                                            typeof technology ===
                                            "string" &&
                                            technology.trim()
                                    )
                                    .map(
                                        (technology) =>
                                            technology.trim()
                                    )
                                : [],
                    };
                })
                .filter(
                    (experience) =>
                        experience.company &&
                        experience.position
                )
            : [];

        // =========================================
        // NORMALIZE PROJECTS
        // =========================================

        const projects = Array.isArray(
            parsedData.projects
        )
            ? parsedData.projects
                .filter(
                    (project) =>
                        project &&
                        typeof project === "object"
                )
                .map((project) => ({
                    name:
                        project.name?.trim?.() || "",

                    description:
                        project.description?.trim?.() || "",

                    technologies:
                        Array.isArray(
                            project.technologies
                        )
                            ? project.technologies
                                .filter(
                                    (technology) =>
                                        typeof technology ===
                                        "string" &&
                                        technology.trim()
                                )
                                .map(
                                    (technology) =>
                                        technology.trim()
                                )
                            : [],

                    projectUrl:
                        project.projectUrl?.trim?.() || "",

                    githubUrl:
                        project.githubUrl?.trim?.() || "",
                }))
                .filter(
                    (project) => project.name
                )
            : [];

        // =========================================
        // NORMALIZE EDUCATION
        // =========================================

        const education = Array.isArray(
            parsedData.education
        )
            ? parsedData.education
                .filter(
                    (item) =>
                        item &&
                        typeof item === "object"
                )
                .map((item) => ({
                    institution:
                        item.institution?.trim?.() || "",

                    degree:
                        item.degree?.trim?.() || "",

                    fieldOfStudy:
                        item.fieldOfStudy?.trim?.() || "",

                    startDate:
                        parseDateOrNull(
                            item.startDate
                        ),

                    endDate:
                        parseDateOrNull(
                            item.endDate
                        ),
                }))
                .filter(
                    (item) => item.institution
                )
            : [];

        // =========================================
        // NORMALIZE CERTIFICATIONS
        //
        // Resume stores:
        //
        // [
        //     "AWS Cloud Practitioner",
        //     "MongoDB Associate"
        // ]
        //
        // CareerProfile expects:
        //
        // [
        //     {
        //         name: "AWS Cloud Practitioner",
        //         issuer: "",
        //         issueDate: null,
        //         credentialUrl: ""
        //     }
        // ]
        // =========================================

        const certifications = Array.isArray(
            parsedData.certifications
        )
            ? parsedData.certifications
                .map((certification) => {

                    if (
                        typeof certification ===
                        "string"
                    ) {
                        const name =
                            certification.trim();

                        if (!name) {
                            return null;
                        }

                        return {
                            name,
                            issuer: "",
                            issueDate: null,
                            credentialUrl: "",
                        };
                    }

                    if (
                        certification &&
                        typeof certification ===
                        "object"
                    ) {
                        return {
                            name:
                                certification.name
                                    ?.trim?.() || "",

                            issuer:
                                certification.issuer
                                    ?.trim?.() || "",

                            issueDate:
                                parseDateOrNull(
                                    certification.issueDate
                                ),

                            credentialUrl:
                                certification.credentialUrl
                                    ?.trim?.() || "",
                        };
                    }

                    return null;
                })
                .filter(
                    (certification) =>
                        certification?.name
                )
            : [];

        // =========================================
        // PREPARE CAREER PROFILE DATA
        // =========================================

        const profileData = {
            headline:
                typeof parsedData.headline ===
                    "string"
                    ? parsedData.headline.trim()
                    : "",

            summary:
                typeof parsedData.summary ===
                    "string"
                    ? parsedData.summary.trim()
                    : "",

            skills,

            experiences,

            projects,

            education,

            certifications,
        };

        // =========================================
        // FIND EXISTING CAREER PROFILE
        // =========================================

        let careerProfile =
            await CareerProfile.findOne({
                userId,
            });

        // =========================================
        // CREATE CAREER PROFILE
        // =========================================

        if (!careerProfile) {
            careerProfile =
                await CareerProfile.create({
                    userId,
                    ...profileData,
                });
        }

        // =========================================
        // UPDATE EXISTING CAREER PROFILE
        // =========================================

        else {
            careerProfile.headline =
                profileData.headline;

            careerProfile.summary =
                profileData.summary;

            careerProfile.skills =
                profileData.skills;

            careerProfile.experiences =
                profileData.experiences;

            careerProfile.projects =
                profileData.projects;

            careerProfile.education =
                profileData.education;

            careerProfile.certifications =
                profileData.certifications;

            await careerProfile.save();
        }

        // =========================================
        // RESPONSE
        // =========================================

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    careerProfile,
                    sourceResumeId: resume._id,
                    sourceResumeName:
                        resume.fileName,
                },
                "Career profile imported from resume successfully."
            )
        );
    }
);


export {
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
    importCareerProfileFromResume
};