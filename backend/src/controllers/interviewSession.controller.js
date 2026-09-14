import CareerProfile from "../models/careerProfile.model.js";
import JobWorkspace from "../models/jobWorkspace.model.js";
import InterviewSession from "../models/interviewSession.model.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";


import {
    generateStructuredResponse,
} from "../services/ai/gemini.service.js";

import InterviewQuestionSchema from "../services/ai/schemas/interviewQuestion.schema.js";
import buildInterviewQuestionPrompt from "../services/ai/prompts/interviewQuestion.prompt.js";
import InterviewFeedbackSchema from "../services/ai/schemas/interviewFeedback.schema.js";
import buildInterviewFeedbackPrompt from "../services/ai/prompts/interviewFeedback.prompt.js";
import InterviewReportSchema from "../services/ai/schemas/interviewReport.schema.js";
import buildInterviewReportPrompt from "../services/ai/prompts/interviewReport.prompt.js";

/**
 * @Name : createInterviewSession
 * @POST : /interview-session/create-interview-session
 * @access : Private
 * @description :
 * Creates a new AI interview session for a specific job workspace.
 *
 * The session stores the interview type, difficulty, questions,
 * answers, feedback, and performance information.
 */

const createInterviewSession = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const {
        jobId,
        type,
        difficulty,
        questions,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!jobId || !type) {
        throw new ApiError(
            400,
            "Job ID and interview type are required."
        );
    }

    const interviewSession = await InterviewSession.create({
        userId,
        jobId,
        type,
        difficulty,
        questions,
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                interviewSession,
            },
            "Interview session created successfully."
        )
    );
});


/**
 * @Name : getInterviewSessions
 * @GET : /interview-session/getAll-interview-session
 * @access : Private
 * @description :
 * Retrieves all interview sessions belonging to the authenticated user.
 */

const getInterviewSessions = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const interviewSessions = await InterviewSession.find({
        userId,
    }).sort({
        createdAt: -1,
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                interviewSessions,
            },
            "Interview sessions retrieved successfully."
        )
    );
});


/**
 * @Name : getInterviewSession
 * @GET : /interview-session/:sessionId
 * @access : Private
 * @description :
 * Retrieves a specific interview session belonging to the
 * authenticated user.
 */

const getInterviewSession = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { sessionId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!sessionId) {
        throw new ApiError(
            400,
            "Interview session ID is required."
        );
    }

    const interviewSession = await InterviewSession.findOne({
        _id: sessionId,
        userId,
    });

    if (!interviewSession) {
        throw new ApiError(
            404,
            "Interview session not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                interviewSession,
            },
            "Interview session retrieved successfully."
        )
    );
});


/**
 * @Name : updateInterviewSession
 * @PATCH : /interview-session/:sessionId
 * @access : Private
 * @description :
 * Updates an interview session belonging to the authenticated user.
 *
 * This route can be used to update the session status, questions,
 * score, feedback, report, and completion time.
 */

const updateInterviewSession = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { sessionId } = req.params;

    const {
        difficulty,
        status,
        score,
        feedback,
        report,
        startedAt,
        completedAt,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!sessionId) {
        throw new ApiError(
            400,
            "Interview session ID is required."
        );
    }

    const interviewSession = await InterviewSession.findOne({
        _id: sessionId,
        userId,
    });

    if (!interviewSession) {
        throw new ApiError(
            404,
            "Interview session not found."
        );
    }

    if (difficulty !== undefined) {
        interviewSession.difficulty = difficulty;
    }

    if (status !== undefined) {
        interviewSession.status = status;
    }

    if (score !== undefined) {
        interviewSession.score = score;
    }

    if (feedback !== undefined) {
        interviewSession.feedback = feedback;
    }

    if (report !== undefined) {
        interviewSession.report = report;
    }

    if (startedAt !== undefined) {
        interviewSession.startedAt = startedAt;
    }

    if (completedAt !== undefined) {
        interviewSession.completedAt = completedAt;
    }

    await interviewSession.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                interviewSession,
            },
            "Interview session updated successfully."
        )
    );
});


/**
 * @Name : updateQuestion
 * @PATCH : /interview-session/:sessionId/questions/:questionId
 * @access : Private
 * @description :
 * Updates a specific interview question.
 *
 * The question is identified by its array index because the
 * question sub-schema intentionally uses _id: false.
 */

const updateQuestion = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    const {
        sessionId,
        questionId,
    } = req.params;

    const {
        question,
        category,
        userAnswer,
        feedback,
        score,
        strengths,
        improvements,
    } = req.body;


    if (!userId) {

        throw new ApiError(
            401,
            "Authentication required."
        );

    }


    if (!sessionId || !questionId) {

        throw new ApiError(
            400,
            "Interview session ID and question ID are required."
        );

    }


    const interviewSession =
        await InterviewSession.findOne({
            _id: sessionId,
            userId,
        });


    if (!interviewSession) {

        throw new ApiError(
            404,
            "Interview session not found."
        );

    }


    const interviewQuestion =
        interviewSession.questions.id(questionId);


    if (!interviewQuestion) {

        throw new ApiError(
            404,
            "Interview question not found."
        );

    }


    if (question !== undefined) {

        interviewQuestion.question = question;

    }


    if (category !== undefined) {

        interviewQuestion.category = category;

    }


    if (userAnswer !== undefined) {

        interviewQuestion.userAnswer = userAnswer;

    }


    if (feedback !== undefined) {

        interviewQuestion.feedback = feedback;

    }


    if (score !== undefined) {

        interviewQuestion.score = score;

    }


    if (strengths !== undefined) {

        interviewQuestion.strengths = strengths;

    }


    if (improvements !== undefined) {

        interviewQuestion.improvements =
            improvements;

    }


    await interviewSession.save();


    return res.status(200).json(

        new ApiResponse(
            200,
            {
                interviewSession,
            },
            "Interview question updated successfully."
        )

    );

});


/**
 * @Name : addQuestion
 * @POST : /interview-session/:sessionId/questions
 * @access : Private
 * @description :
 * Adds a new question to an existing interview session.
 */

const addQuestion = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { sessionId } = req.params;

    const {
        question,
        category,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!question) {
        throw new ApiError(
            400,
            "Question is required."
        );
    }

    const interviewSession = await InterviewSession.findOne({
        _id: sessionId,
        userId,
    });

    if (!interviewSession) {
        throw new ApiError(
            404,
            "Interview session not found."
        );
    }

    interviewSession.questions.push({
        question,
        category,
    });

    await interviewSession.save();

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                interviewSession,
            },
            "Interview question added successfully."
        )
    );
});


/**
 * @Name : deleteQuestion
 * @DELETE : /interview-session/:sessionId/questions/:questionId
 * @access : Private
 * @description :
 * Deletes a specific question from an interview session.
 */

const deleteQuestion = asyncHandler(async (req, res) => {

    const userId = req.user?.userId;

    const {
        sessionId,
        questionId,
    } = req.params;


    if (!userId) {

        throw new ApiError(
            401,
            "Authentication required."
        );

    }


    if (!sessionId || !questionId) {

        throw new ApiError(
            400,
            "Interview session ID and question ID are required."
        );

    }


    const interviewSession =
        await InterviewSession.findOne({
            _id: sessionId,
            userId,
        });


    if (!interviewSession) {

        throw new ApiError(
            404,
            "Interview session not found."
        );

    }


    const interviewQuestion =
        interviewSession.questions.id(questionId);


    if (!interviewQuestion) {

        throw new ApiError(
            404,
            "Interview question not found."
        );

    }


    interviewQuestion.deleteOne();


    await interviewSession.save();


    return res.status(200).json(

        new ApiResponse(
            200,
            {
                interviewSession,
            },
            "Interview question deleted successfully."
        )

    );

});


/**
 * @Name : deleteInterviewSession
 * @DELETE : /interview-session/:sessionId
 * @access : Private
 * @description :
 * Deletes a specific interview session belonging to the
 * authenticated user.
 */

const deleteInterviewSession = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const { sessionId } = req.params;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    const interviewSession = await InterviewSession.findOneAndDelete({
        _id: sessionId,
        userId,
    });

    if (!interviewSession) {
        throw new ApiError(
            404,
            "Interview session not found."
        );
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            null,
            "Interview session deleted successfully."
        )
    );
});



/**
 * @Name : generateInterviewQuestions
 * @POST : /interview-sessions
 * @description :
 * Generates a interview session using AI
 * @access : Private
 */
const generateInterviewQuestions = asyncHandler(async (req, res) => {
    const userId = req.user?.userId;

    const {
        jobId,
        type,
        difficulty,
    } = req.body;

    if (!userId) {
        throw new ApiError(
            401,
            "Authentication required."
        );
    }

    if (!jobId || !type) {
        throw new ApiError(
            400,
            "Job ID and interview type are required."
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

    const prompt = buildInterviewQuestionPrompt({
        careerProfile,
        jobWorkspace,
        type,
        difficulty: difficulty || "medium",
    });

    const result =
        await generateStructuredResponse(
            prompt,
            InterviewQuestionSchema
        );

    const interviewSession =
        await InterviewSession.create({
            userId,
            jobId,
            type,
            difficulty: difficulty || "medium",
            status: "in-progress",
            questions: result.questions.map(
                (question) => ({
                    question: question.question,
                    category: question.category,
                    userAnswer: "",
                    feedback: "",
                    score: null,
                    strengths: [],
                    improvements: [],
                })
            ),
        });

    return res.status(201).json(
        new ApiResponse(
            201,
            {
                interviewSession,
            },
            "Interview session created successfully."
        )
    );
});


/**
 * @Name : evaluateInterviewAnswer
 * @PATCH : /interview-sessions/:sessionId/questions/:questionId/evaluate
 * @access : Private
 * @description :
 * Evaluates a candidate's answer using Gemini and stores the
 * generated feedback inside the interview question.
 */
const evaluateInterviewAnswer =
    asyncHandler(async (req, res) => {

        const userId = req.user?.userId;

        const {
            sessionId,
            questionId,
        } = req.params;

        const {
            userAnswer,
        } = req.body;


        if (!userId) {

            throw new ApiError(
                401,
                "Authentication required."
            );

        }


        if (!sessionId || !questionId) {

            throw new ApiError(
                400,
                "Interview session ID and question ID are required."
            );

        }


        if (!userAnswer?.trim()) {

            throw new ApiError(
                400,
                "Answer is required."
            );

        }


        const interviewSession =
            await InterviewSession.findOne({
                _id: sessionId,
                userId,
            });


        if (!interviewSession) {

            throw new ApiError(
                404,
                "Interview session not found."
            );

        }


        if (
            interviewSession.status !==
            "in-progress"
        ) {

            throw new ApiError(
                400,
                "This interview session is no longer active."
            );

        }


        const currentQuestion =
            interviewSession.questions.id(
                questionId
            );


        if (!currentQuestion) {

            throw new ApiError(
                404,
                "Interview question not found."
            );

        }


        const jobWorkspace =
            await JobWorkspace.findOne({
                _id: interviewSession.jobId,
                userId,
            });


        if (!jobWorkspace) {

            throw new ApiError(
                404,
                "Job workspace not found."
            );

        }


        const careerProfile =
            await CareerProfile.findOne({
                userId,
            });


        if (!careerProfile) {

            throw new ApiError(
                404,
                "Career profile not found."
            );

        }


        const prompt =
            buildInterviewFeedbackPrompt({

                careerProfile,

                jobWorkspace,

                question:
                    currentQuestion.question,

                userAnswer:
                    userAnswer.trim(),

                difficulty:
                    interviewSession.difficulty,

            });


        const feedback =
            await generateStructuredResponse(
                prompt,
                InterviewFeedbackSchema
            );


        currentQuestion.userAnswer =
            userAnswer.trim();


        currentQuestion.feedback =
            feedback.feedback;


        currentQuestion.score =
            feedback.score;


        currentQuestion.strengths =
            feedback.strengths;


        currentQuestion.improvements =
            feedback.improvements;


        await interviewSession.save();


        return res.status(200).json(

            new ApiResponse(
                200,
                {
                    interviewSession,
                    question: currentQuestion,
                },
                "Interview answer evaluated successfully."
            )

        );

    });


/**
 * @Name : completeInterviewSession
 * @POST : /interview-sessions/:sessionId/complete
 * @access : Private
 * @description :
 * Generate a report of the interview using AI
 */

const completeInterviewSession = asyncHandler(
    async (req, res) => {
        const userId = req.user?.userId;
        const { sessionId } = req.params;

        if (!userId) {
            throw new ApiError(
                401,
                "Authentication required."
            );
        }

        const interviewSession =
            await InterviewSession.findOne({
                _id: sessionId,
                userId,
            });

        if (!interviewSession) {
            throw new ApiError(
                404,
                "Interview session not found."
            );
        }

        if (
            interviewSession.status !==
            "in-progress"
        ) {
            throw new ApiError(
                400,
                "Interview session is already completed or abandoned."
            );
        }

        /*
         * Make sure every question has been answered
         * before generating the final report.
         */
        const unansweredQuestions =
            interviewSession.questions.some(
                (question) =>
                    !question.userAnswer?.trim()
            );

        if (unansweredQuestions) {
            throw new ApiError(
                400,
                "All interview questions must be answered before completing the session."
            );
        }

        /*
         * Make sure every answer has been evaluated.
         */
        const unevaluatedQuestions =
            interviewSession.questions.some(
                (question) =>
                    question.score === null
            );

        if (unevaluatedQuestions) {
            throw new ApiError(
                400,
                "All interview answers must be evaluated before completing the session."
            );
        }

        const jobWorkspace =
            await JobWorkspace.findOne({
                _id: interviewSession.jobId,
                userId,
            });

        if (!jobWorkspace) {
            throw new ApiError(
                404,
                "Job workspace not found."
            );
        }

        const careerProfile =
            await CareerProfile.findOne({
                userId,
            });

        if (!careerProfile) {
            throw new ApiError(
                404,
                "Career profile not found."
            );
        }

        const prompt =
            buildInterviewReportPrompt({
                careerProfile,
                jobWorkspace,
                interviewSession,
            });

        const report =
            await generateStructuredResponse(
                prompt,
                InterviewReportSchema
            );

        /*
         * Calculate the overall interview score
         * from the actual question scores.
         */
        const totalScore =
            interviewSession.questions.reduce(
                (total, question) =>
                    total + question.score,
                0
            );

        const overallScore =
            interviewSession.questions.length > 0
                ? Math.round(
                    (totalScore /
                        (interviewSession.questions.length *
                            10)) *
                    100
                )
                : 0;

        interviewSession.score =
            overallScore;

        interviewSession.feedback =
            report.overallAssessment;

        interviewSession.report =
            report;

        interviewSession.status =
            "completed";

        interviewSession.completedAt =
            new Date();

        await interviewSession.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    interviewSession,
                },
                "Interview completed successfully."
            )
        );
    }
);


export {
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
    completeInterviewSession
};