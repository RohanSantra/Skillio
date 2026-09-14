import CoachConversation from "../models/coachConversation.model.js";
import CareerProfile from "../models/careerProfile.model.js";
import Resume from "../models/resume.model.js";
import JobWorkspace from "../models/jobWorkspace.model.js";
import PreparationPlan from "../models/preparationPlan.model.js";

import {
    generateStructuredResponse,
} from "../services/ai/gemini.service.js";

import CoachResponseSchema from "../services/ai/schemas/coachResponse.schema.js";

import buildCoachPrompt from "../services/ai/prompts/coach.prompt.js";

import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * @Name : createConversation
 * @POST : /coach-conversation/create-coach-conversation
 * @access : Private
 * @description :
 * Creates a new AI Career Coach conversation for the authenticated user.
 *
 * The conversation can optionally be associated with a specific
 * job workspace for job-specific career guidance.
 */

const createConversation = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const {
        jobId,
        title,
        messages,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const conversation = await CoachConversation.create({
        userId,
        jobId: jobId || null,
        title,
        messages,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                conversation,
            },
            "Coach conversation created successfully."
        )
    );
});


/**
 * @Name : getConversations
 * @GET : /coach-conversation/getAll-coach-conversation
 * @access : Private
 * @description :
 * Retrieves all AI Career Coach conversations belonging to
 * the authenticated user.
 */

const getConversations = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const conversations = await CoachConversation.find({
        userId,
    }).sort({
        lastMessageAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                conversations,
            },
            "Coach conversations retrieved successfully."
        )
    );
});


/**
 * @Name : getConversation
 * @GET : /coach-conversation/:conversationId
 * @access : Private
 * @description :
 * Retrieves a specific AI Career Coach conversation belonging
 * to the authenticated user.
 */

const getConversation = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { conversationId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!conversationId) {
        throw new ApiError(
            400,
            "Conversation ID is required."
        );
    }

    const conversation = await CoachConversation.findOne({
        _id: conversationId,
        userId,
    });

    if (!conversation) {
        throw new ApiError(
            404,
            "Coach conversation not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                conversation,
            },
            "Coach conversation retrieved successfully."
        )
    );
});


/**
 * @Name : updateConversation
 * @PATCH : /coach-conversation/:conversationId
 * @access : Private
 * @description :
 * Updates the title or job association of a specific
 * AI Career Coach conversation.
 */

const updateConversation = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { conversationId } = req.params;

    const {
        title,
        jobId,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!conversationId) {
        throw new ApiError(
            400,
            "Conversation ID is required."
        );
    }

    const conversation = await CoachConversation.findOne({
        _id: conversationId,
        userId,
    });

    if (!conversation) {
        throw new ApiError(
            404,
            "Coach conversation not found."
        );
    }

    if (title !== undefined) {
        conversation.title = title;
    }

    if (jobId !== undefined) {
        conversation.jobId = jobId || null;
    }

    await conversation.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                conversation,
            },
            "Coach conversation updated successfully."
        )
    );
});


/**
 * @Name : addMessage
 * @POST : /coach-conversation/:conversationId/messages
 * @access : Private
 * @description :
 * Adds a user or assistant message to an existing
 * AI Career Coach conversation.
 */

const addMessage = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { conversationId } = req.params;

    const {
        role,
        content,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!conversationId) {
        throw new ApiError(
            400,
            "Conversation ID is required."
        );
    }

    if (!role || !content) {
        throw new ApiError(
            400,
            "Message role and content are required."
        );
    }

    if (!["user", "assistant"].includes(role)) {
        throw new ApiError(
            400,
            "Message role must be either user or assistant."
        );
    }

    const conversation = await CoachConversation.findOne({
        _id: conversationId,
        userId,
    });

    if (!conversation) {
        throw new ApiError(
            404,
            "Coach conversation not found."
        );
    }

    conversation.messages.push({
        role,
        content,
    });

    conversation.lastMessageAt = new Date();

    await conversation.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                conversation,
            },
            "Message added successfully."
        )
    );
});


/**
 * @Name : deleteMessage
 * @DELETE : /coach-conversation/:conversationId/messages/:messageId
 * @access : Private
 * @description :
 * Deletes a specific message from an AI Career Coach conversation.
 *
 * The message is identified using its MongoDB _id.
 */

const deleteMessage = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    const {
        conversationId,
        messageId,
    } = req.params;


    if (!userId) {

        throw new ApiError(
            401,
            "Authentication required."
        );

    }


    const conversation = await CoachConversation.findOne({

        _id: conversationId,
        userId,

    });


    if (!conversation) {

        throw new ApiError(
            404,
            "Coach conversation not found."
        );

    }


    const message = conversation.messages.id(
        messageId
    );


    if (!message) {

        throw new ApiError(
            404,
            "Message not found."
        );

    }


    message.deleteOne();


    /*
     * Update the last message timestamp.
     */

    if (conversation.messages.length > 0) {

        conversation.lastMessageAt =
            conversation.messages[
                conversation.messages.length - 1
            ].createdAt;

    } else {

        conversation.lastMessageAt = new Date();

    }


    await conversation.save();


    return res.status(200).json(

        new ApiResponse(
            200,
            {
                conversation,
            },
            "Message deleted successfully."
        )

    );

});


/**
 * @Name : deleteConversation
 * @DELETE : /coach-conversation/:conversationId
 * @access : Private
 * @description :
 * Deletes a specific AI Career Coach conversation belonging
 * to the authenticated user.
 */

const deleteConversation = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { conversationId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const conversation = await CoachConversation.findOneAndDelete({
        _id: conversationId,
        userId,
    });

    if (!conversation) {
        throw new ApiError(
            404,
            "Coach conversation not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Coach conversation deleted successfully."
        )
    );
});


/**
 * @POST : /conversations/message
 * @description :
 * Send coach message generated by AI
 * @access : Private
 */
const sendCoachMessage = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const {
        conversationId,
        jobId,
        message,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!message?.trim()) {
        throw new ApiError(
            400,
            "Message is required."
        );
    }

    let conversation;

    /*
     * Existing conversation
     */
    if (conversationId) {
        conversation =
            await CoachConversation.findOne({
                _id: conversationId,
                userId,
            });

        if (!conversation) {
            throw new ApiError(
                404,
                "Conversation not found."
            );
        }
    }

    /*
     * Create a new conversation when the
     * frontend doesn't provide one.
     */
    if (!conversation) {
        conversation =
            await CoachConversation.create({
                userId,
                jobId: jobId || null,
                title: "New Conversation",
                messages: [],
            });
    }

    /*
     * Load user's career context.
     */
    const careerProfile =
        await CareerProfile.findOne({
            userId,
        });

    /*
     * Load primary resume if available.
     */
    const resume =
        await Resume.findOne({
            userId,
            isPrimary: true,
        });

    /*
     * Load job context only when this is
     * a job-specific conversation.
     */
    let jobWorkspace = null;

    if (conversation.jobId) {
        jobWorkspace =
            await JobWorkspace.findOne({
                _id: conversation.jobId,
                userId,
            });
    }

    /*
     * Load preparation plan for the selected job.
     */
    let preparationPlan = null;

    if (conversation.jobId) {
        preparationPlan =
            await PreparationPlan.findOne({
                userId,
                jobId: conversation.jobId,
            });
    }

    /*
     * Keep the conversation history available
     * to Gemini.
     */
    const conversationHistory =
        conversation.messages.map(
            (message) => ({
                role: message.role,
                content: message.content,
            })
        );

    /*
     * Add the current user message to the
     * context sent to Gemini.
     */
    conversationHistory.push({
        role: "user",
        content: message.trim(),
    });

    const prompt = buildCoachPrompt({
        careerProfile,
        resume,
        jobWorkspace,
        preparationPlan,
        conversationHistory,
        userMessage: message.trim(),
    });

    /*
     * Generate structured AI response.
     */
    const coachResponse =
        await generateStructuredResponse(
            prompt,
            CoachResponseSchema
        );

    /*
     * Save user message.
     */
    conversation.messages.push({
        role: "user",
        content: message.trim(),
    });

    /*
     * Save assistant message.
     */
    conversation.messages.push({
        role: "assistant",
        content: coachResponse.message,
    });

    conversation.lastMessageAt =
        new Date();

    /*
     * Give the conversation a useful title
     * after the first user message.
     */
    if (
        conversation.messages.length === 2 &&
        conversation.title === "New Conversation"
    ) {
        conversation.title =
            message.trim().slice(0, 50);
    }

    await conversation.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                conversationId:
                    conversation._id,

                message:
                    coachResponse.message,

                suggestions:
                    coachResponse.suggestions,

                conversation,
            },
            "Coach response generated successfully."
        )
    );
});


export {
    createConversation,
    getConversations,
    getConversation,
    updateConversation,
    addMessage,
    deleteMessage,
    deleteConversation,
    sendCoachMessage
};