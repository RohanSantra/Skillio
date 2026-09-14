import Application from "../models/application.model.js";
import JobWorkspace from "../models/jobWorkspace.model.js";

import ApiError from "../utils/ApiError.js";

import ApiResponse from "../utils/ApiResponse.js";

import asyncHandler from "../utils/asyncHandler.js";

/**
 * @Name : createApplication
 * @POST : /application/create-application
 * @access : Private
 * @description :
 * Creates a new job application for the authenticated user.
 *
 * The application is linked to a Job Workspace through jobId.
 * Only one application can exist for the same user and job.
 */
const createApplication = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const {
        jobId,
        status,
        appliedAt,
        notes,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!jobId) {
        throw new ApiError(
            400,
            "Job ID is required."
        );
    }

    const jobWorkspace = await JobWorkspace.findOne({
        _id: jobId,
        userId,
    });

    if (!jobWorkspace) {
        throw new ApiError(
            404,
            "Job workspace not found."
        );
    }

    const existingApplication = await Application.findOne({
        userId,
        jobId,
    });

    if (existingApplication) {
        throw new ApiError(
            409,
            "An application already exists for this job."
        );
    }

    const application = await Application.create({
        userId,
        jobId,
        status,
        appliedAt:
            status === "applied"
                ? appliedAt || new Date()
                : appliedAt || null,
        notes,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                application,
            },
            "Application created successfully."
        )
    );
});

/**
 * @Name : getApplications
 * @GET : /application/getAll-application
 * @access : Private
 * @description :
 * Retrieves all job applications belonging to the authenticated user.
 */
const getApplications = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const applications = await Application.find({
        userId,
    }).sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                applications,
            },
            "Applications retrieved successfully."
        )
    );
});

/**
 * @Name : getApplication
 * @GET : /application/:applicationId
 * @access : Private
 * @description :
 * Retrieves a specific application belonging to the authenticated user.
 */
const getApplication = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const {
        applicationId,
    } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const application = await Application.findOne({
        _id: applicationId,
        userId,
    });

    if (!application) {
        throw new ApiError(
            404,
            "Application not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                application,
            },
            "Application retrieved successfully."
        )
    );
});

/**
 * @Name : updateApplication
 * @PATCH : /application/:applicationId
 * @access : Private
 * @description :
 * Updates a specific job application belonging to the authenticated user.
 *
 * Only the provided fields are updated.
 */
const updateApplication = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const {
        applicationId,
    } = req.params;

    const {
        status,
        appliedAt,
        notes,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const application = await Application.findOne({
        _id: applicationId,
        userId,
    });

    if (!application) {
        throw new ApiError(
            404,
            "Application not found."
        );
    }

    if (status !== undefined) {
        application.status = status;

        if (
            status === "applied" &&
            !application.appliedAt
        ) {
            application.appliedAt = new Date();
        }
    }

    if (appliedAt !== undefined) {
        application.appliedAt = appliedAt;
    }

    if (notes !== undefined) {
        application.notes = notes;
    }

    await application.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                application,
            },
            "Application updated successfully."
        )
    );
});

/**
 * @Name : deleteApplication
 * @DELETE : /application/:applicationId
 * @access : Private
 * @description :
 * Deletes a specific job application belonging to the authenticated user.
 */
const deleteApplication = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const {
        applicationId,
    } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const application = await Application.findOneAndDelete({
        _id: applicationId,
        userId,
    });

    if (!application) {
        throw new ApiError(
            404,
            "Application not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Application deleted successfully."
        )
    );
});

export {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication,
};