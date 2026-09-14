import CareerProfile from "../models/careerProfile.model.js";
import JobWorkspace from "../models/jobWorkspace.model.js";
import PreparationPlan from "../models/preparationPlan.model.js";

import { generateStructuredResponse } from "../services/ai/gemini.service.js";
import buildPreparationPlanPrompt from "../services/ai/prompts/preparationPlan.prompt.js";
import PreparationPlanSchema from "../services/ai/schemas/preparationPlan.schema.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


const updatePlanProgress = (preparationPlan) => {
    const totalTasks = preparationPlan.tasks.length;

    if (totalTasks === 0) {
        preparationPlan.progress = 0;
        preparationPlan.status = "not-started";
        return;
    }

    const completedTasks =
        preparationPlan.tasks.filter(
            (task) => task.isCompleted
        ).length;

    const progress = Math.round(
        (completedTasks / totalTasks) * 100
    );

    preparationPlan.progress = progress;

    if (completedTasks === 0) {
        preparationPlan.status = "not-started";
    } else if (completedTasks === totalTasks) {
        preparationPlan.status = "completed";
    } else {
        preparationPlan.status = "in-progress";
    }
};



/**
 * @Name : createPreparationPlan
 * @POST : /preparation-plan/create-preparation-plan
 * @access : Private
 * @description :
 * Creates a preparation plan for a specific job workspace.
 *
 * Only one preparation plan is allowed for each job belonging
 * to the authenticated user.
 */

const createPreparationPlan = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const {
        jobId,
        title,
        overview,
        tasks,
        generatedAt,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!jobId || !title) {
        throw new ApiError(
            400,
            "Job ID and title are required."
        );
    }

    const existingPlan = await PreparationPlan.findOne({
        userId,
        jobId,
    });

    if (existingPlan) {
        throw new ApiError(
            409,
            "A preparation plan already exists for this job."
        );
    }

    const preparationPlan =
        await PreparationPlan.create({
            userId,
            jobId,
            title,
            overview,
            tasks: tasks || [],
            generatedAt,
        });

    updatePlanProgress(preparationPlan);

    await preparationPlan.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                preparationPlan,
            },
            "Preparation plan created successfully."
        )
    );
});


/**
 * @Name : getPreparationPlans
 * @GET : /preparation-plan/getAll-preparation-plan
 * @access : Private
 * @description :
 * Retrieves all preparation plans belonging to the authenticated user.
 */

const getPreparationPlans = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const preparationPlans = await PreparationPlan.find({
        userId,
    }).sort({
        updatedAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                preparationPlans,
            },
            "Preparation plans retrieved successfully."
        )
    );
});


/**
 * @Name : getPreparationPlan
 * @GET : /preparation-plan/:planId
 * @access : Private
 * @description :
 * Retrieves a specific preparation plan belonging to the
 * authenticated user.
 */

const getPreparationPlan = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { planId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!planId) {
        throw new ApiError(
            400,
            "Preparation plan ID is required."
        );
    }

    const preparationPlan = await PreparationPlan.findOne({
        _id: planId,
        userId,
    });

    if (!preparationPlan) {
        throw new ApiError(
            404,
            "Preparation plan not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                preparationPlan,
            },
            "Preparation plan retrieved successfully."
        )
    );
});


/**
 * @Name : updatePreparationPlan
 * @PATCH : /preparation-plan/:planId
 * @access : Private
 * @description :
 * Updates the general information of a specific preparation plan.
 *
 * This route can update the title, overview, tasks, progress,
 * status, and generatedAt fields.
 */

const updatePreparationPlan = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { planId } = req.params;

    const {
        title,
        overview,
        tasks,
        generatedAt,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!planId) {
        throw new ApiError(
            400,
            "Preparation plan ID is required."
        );
    }

    const preparationPlan =
        await PreparationPlan.findOne({
            _id: planId,
            userId,
        });

    if (!preparationPlan) {
        throw new ApiError(
            404,
            "Preparation plan not found."
        );
    }

    if (title !== undefined) {
        preparationPlan.title = title;
    }

    if (overview !== undefined) {
        preparationPlan.overview = overview;
    }

    if (tasks !== undefined) {
        preparationPlan.tasks = tasks;

        updatePlanProgress(preparationPlan);
    }

    if (generatedAt !== undefined) {
        preparationPlan.generatedAt = generatedAt;
    }

    await preparationPlan.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                preparationPlan,
            },
            "Preparation plan updated successfully."
        )
    );
});


/**
 * @Name : deletePreparationPlan
 * @DELETE : /preparation-plan/:planId
 * @access : Private
 * @description :
 * Deletes a specific preparation plan belonging to the
 * authenticated user.
 */

const deletePreparationPlan = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { planId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!planId) {
        throw new ApiError(
            400,
            "Preparation plan ID is required."
        );
    }

    const preparationPlan = await PreparationPlan.findOneAndDelete({
        _id: planId,
        userId,
    });

    if (!preparationPlan) {
        throw new ApiError(
            404,
            "Preparation plan not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Preparation plan deleted successfully."
        )
    );
});


/**
 * @Name : updateTask
 * @PATCH : /preparation-plan/:planId/tasks/:taskId
 * @access : Private
 * @description :
 * Updates a specific task inside a preparation plan.
 */

const updateTask = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    const {
        planId,
        taskId,
    } = req.params;

    const {
        title,
        description,
        category,
        priority,
        estimatedMinutes,
        dueDate,
        isCompleted,
    } = req.body;


    if (!userId) {

        throw new ApiError(
            401,
            "Authentication required."
        );

    }


    if (!planId || !taskId) {

        throw new ApiError(
            400,
            "Preparation plan ID and task ID are required."
        );

    }


    const preparationPlan =
        await PreparationPlan.findOne({
            _id: planId,
            userId,
        });


    if (!preparationPlan) {

        throw new ApiError(
            404,
            "Preparation plan not found."
        );

    }


    const task =
        preparationPlan.tasks.id(taskId);


    if (!task) {

        throw new ApiError(
            404,
            "Preparation task not found."
        );

    }


    if (title !== undefined) {

        task.title = title;

    }


    if (description !== undefined) {

        task.description = description;

    }


    if (category !== undefined) {

        task.category = category;

    }


    if (priority !== undefined) {

        task.priority = priority;

    }


    if (estimatedMinutes !== undefined) {

        task.estimatedMinutes =
            estimatedMinutes;

    }


    if (dueDate !== undefined) {

        task.dueDate = dueDate;

    }


    if (isCompleted !== undefined) {

        task.isCompleted = isCompleted;

        task.completedAt =
            isCompleted
                ? new Date()
                : null;

    }


    updatePlanProgress(preparationPlan);


    await preparationPlan.save();


    return res.status(200).json(

        new ApiResponse(
            200,
            {
                preparationPlan,
            },
            "Preparation task updated successfully."
        )

    );

});


/**
 * @Name : addTask
 * @POST : /preparation-plan/:planId/tasks
 * @access : Private
 * @description :
 * Adds a new preparation task to an existing preparation plan.
 */

const addTask = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { planId } = req.params;

    const {
        title,
        description,
        category,
        priority,
        estimatedMinutes,
        dueDate,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!planId) {
        throw new ApiError(
            400,
            "Preparation plan ID is required."
        );
    }

    if (!title) {
        throw new ApiError(
            400,
            "Task title is required."
        );
    }

    const preparationPlan = await PreparationPlan.findOne({
        _id: planId,
        userId,
    });

    if (!preparationPlan) {
        throw new ApiError(
            404,
            "Preparation plan not found."
        );
    }

    preparationPlan.tasks.push({
        title,
        description,
        category,
        priority,
        estimatedMinutes,
        dueDate,
    });

    updatePlanProgress(preparationPlan);

    await preparationPlan.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                preparationPlan,
            },
            "Preparation task added successfully."
        )
    );
});


/**
 * @Name : deleteTask
 * @DELETE : /preparation-plan/:planId/tasks/:taskId
 * @access : Private
 * @description :
 * Deletes a specific preparation task from a preparation plan.
 */

const deleteTask = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    const {
        planId,
        taskId,
    } = req.params;


    if (!userId) {

        throw new ApiError(
            401,
            "Authentication required."
        );

    }


    if (!planId || !taskId) {

        throw new ApiError(
            400,
            "Preparation plan ID and task ID are required."
        );

    }


    const preparationPlan =
        await PreparationPlan.findOne({
            _id: planId,
            userId,
        });


    if (!preparationPlan) {

        throw new ApiError(
            404,
            "Preparation plan not found."
        );

    }


    const task =
        preparationPlan.tasks.id(taskId);


    if (!task) {

        throw new ApiError(
            404,
            "Preparation task not found."
        );

    }


    task.deleteOne();


    updatePlanProgress(preparationPlan);


    await preparationPlan.save();


    return res.status(200).json(

        new ApiResponse(
            200,
            {
                preparationPlan,
            },
            "Preparation task deleted successfully."
        )

    );

});


/**
 * @Name : generatePreparationPlan
 * @POST : /preparation-plans/:jobId/generate
 * @access : Private
 * @description :
 * Generates a personalized AI preparation plan for a job.
 */
const generatePreparationPlan = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;
    const { jobId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
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

    const careerProfile = await CareerProfile.findOne({
        userId,
    });

    if (!careerProfile) {
        throw new ApiError(
            404,
            "Career profile not found."
        );
    }

    if (!jobWorkspace.jobAnalysis?.analyzedAt) {
        throw new ApiError(
            400,
            "Job analysis is required before generating a preparation plan."
        );
    }

    if (!jobWorkspace.jobMatch?.analyzedAt) {
        throw new ApiError(
            400,
            "Job match analysis is required before generating a preparation plan."
        );
    }

    if (!jobWorkspace.skillGaps?.length) {
        throw new ApiError(
            400,
            "Skill gap analysis is required before generating a preparation plan."
        );
    }

    const prompt = buildPreparationPlanPrompt({
        careerProfile,
        jobWorkspace,
    });

    const generatedPlan =
        await generateStructuredResponse(
            prompt,
            PreparationPlanSchema
        );

    /*
     * Because PreparationPlan has a unique
     * userId + jobId combination, update an existing
     * plan instead of creating duplicates.
     */
    const preparationPlan =
        await PreparationPlan.findOneAndUpdate(
            {
                userId,
                jobId,
            },
            {
                $set: {
                    title: generatedPlan.title,
                    overview: generatedPlan.overview,
                    tasks: generatedPlan.tasks.map(
                        (task) => ({
                            ...task,
                            isCompleted: false,
                            completedAt: null,
                            dueDate: null,
                        })
                    ),
                    progress: 0,
                    status: "not-started",
                    generatedAt: new Date(),
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                preparationPlan,
            },
            "Preparation plan generated successfully."
        )
    );
});


export {
    createPreparationPlan,
    getPreparationPlans,
    getPreparationPlan,
    updatePreparationPlan,
    deletePreparationPlan,
    addTask,
    updateTask,
    deleteTask,
    generatePreparationPlan,
};