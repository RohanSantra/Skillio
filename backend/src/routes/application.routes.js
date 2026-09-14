import express from "express";

import {
    createApplication,
    getApplications,
    getApplication,
    updateApplication,
    deleteApplication,
} from "../controllers/application.controller.js";

import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @GET : /getAll-application
 * @description :
 * Retrieves all applications belonging to the authenticated user.
 * @access : Private
 */
router.get("/getAll-application", authenticate, getApplications);

/**
 * @POST : /create-application
 * @description :
 * Creates a new job application for the authenticated user.
 * @access : Private
 */
router.post("/create-application", authenticate, createApplication);

/**
 * @GET : /:applicationId
 * @description :
 * Retrieves a specific application belonging to the authenticated user.
 * @access : Private
 */
router.get("/:applicationId", authenticate, getApplication);

/**
 * @PATCH : /:applicationId
 * @description :
 * Updates a specific application belonging to the authenticated user.
 * @access : Private
 */
router.patch("/:applicationId", authenticate, updateApplication);

/**
 * @DELETE : /:applicationId
 * @description :
 * Deletes a specific application belonging to the authenticated user.
 * @access : Private
 */
router.delete("/:applicationId", authenticate, deleteApplication);

export default router;