import express from "express";

import {
    createPreparationPlan,
    getPreparationPlans,
    getPreparationPlan,
    updatePreparationPlan,
    deletePreparationPlan,
    addTask,
    updateTask,
    deleteTask,
    generatePreparationPlan,
} from "../controllers/preparationPlan.controller.js";

import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @GET : /getAll-preparation-plan
 * @description :
 * Retrieves all preparation plans belonging to the authenticated user.
 * @access : Private
 */
router.get("/getAll-preparation-plan", authenticate, getPreparationPlans);

/**
 * @POST : /create-preparation-plan
 * @description :
 * Creates a new preparation plan for a specific job workspace.
 * @access : Private
 */
router.post("/create-preparation-plan", authenticate, createPreparationPlan);

/**
 * @GET : /:planId
 * @description :
 * Retrieves a specific preparation plan belonging to the authenticated user.
 * @access : Private
 */
router.get("/:planId", authenticate, getPreparationPlan);

/**
 * @PATCH : /:planId
 * @description :
 * Updates a specific preparation plan.
 * @access : Private
 */
router.patch("/:planId", authenticate, updatePreparationPlan);

/**
 * @DELETE : /:planId
 * @description :
 * Deletes a specific preparation plan.
 * @access : Private
 */
router.delete("/:planId", authenticate, deletePreparationPlan);

/**
 * @POST : /:planId/tasks
 * @description :
 * Adds a new preparation task to an existing preparation plan.
 * @access : Private
 */
router.post("/:planId/tasks", authenticate, addTask);

/**
 * @PATCH : /:planId/tasks/:taskId
 * @description :
 * Updates a specific preparation task.
 * @access : Private
 */
router.patch("/:planId/tasks/:taskId", authenticate, updateTask);

/**
 * @DELETE : /:planId/tasks/:taskId
 * @description :
 * Deletes a specific preparation task.
 * @access : Private
 */
router.delete("/:planId/tasks/:taskId", authenticate, deleteTask);


/**
 * @POST : /preparation-plans/:jobId/generate
 * @description :
 * Generates a personalized AI preparation plan for a job.
 * @access : Private
 */
router.post("/:jobId/generate",authenticate,generatePreparationPlan);

export default router;