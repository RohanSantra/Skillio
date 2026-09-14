import express from "express";

import {
    createInterviewSession,
    getInterviewSessions,
    getInterviewSession,
    updateInterviewSession,
    deleteInterviewSession,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    generateInterviewQuestions,
    evaluateInterviewAnswer,
    completeInterviewSession,
} from "../controllers/interviewSession.controller.js";

import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @GET : /getAll-interview-session
 * @description :
 * Retrieves all interview sessions belonging to the authenticated user.
 * @access : Private
 */
router.get("/getAll-interview-session", authenticate, getInterviewSessions);

/**
 * @POST : /create-interview-session
 * @description :
 * Creates a new AI interview session.
 * @access : Private
 */
router.post("/create-interview-session", authenticate, createInterviewSession);

/**
 * @GET : /interview-session/:sessionId
 * @description :
 * Retrieves a specific interview session.
 * @access : Private
 */
router.get("/:sessionId", authenticate, getInterviewSession);

/**
 * @PATCH : /:sessionId
 * @description :
 * Updates a specific interview session.
 * @access : Private
 */
router.patch("/:sessionId", authenticate, updateInterviewSession);

/**
 * @DELETE : /:sessionId
 * @description :
 * Deletes a specific interview session.
 * @access : Private
 */
router.delete("/:sessionId", authenticate, deleteInterviewSession);

/**
 * @POST : /:sessionId/questions
 * @description :
 * Adds a new question to an interview session.
 * @access : Private
 */
router.post("/:sessionId/questions", authenticate, addQuestion);

/**
 * @PATCH : /:sessionId/questions/:questionId
 * @description :
 * Updates a specific interview question.
 * @access : Private
 */
router.patch("/:sessionId/questions/:questionId", authenticate, updateQuestion);

/**
 * @DELETE : /:sessionId/questions/:questionId
 * @description :
 * Deletes a specific interview question.
 * @access : Private
 */
router.delete("/:sessionId/questions/:questionId", authenticate, deleteQuestion);

/**
 * @POST : /interview-sessions
 * @description :
 * Generates a interview session using AI
 * @access : Private
 */
router.post("/", authenticate, generateInterviewQuestions);


/**
 * @PATCH : /interview-sessions/:sessionId/questions/:questionId/evaluate
 * @description :
 * Evaluates a candidate's answer using Gemini and stores the
 * generated feedback inside the interview question.
 * @access : Private
 */
router.patch("/:sessionId/questions/:questionId/evaluate", authenticate, evaluateInterviewAnswer);



/**
 * @Name : completeInterviewSession
 * @POST : /interview-sessions/:sessionId/complete
 * @access : Private
 * @description :
 * Generate a report of the interview using AI
 */
router.post("/:sessionId/complete", authenticate, completeInterviewSession);


export default router;