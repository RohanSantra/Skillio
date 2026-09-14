import { z } from "zod";

const InterviewReportSchema = z.object({
    overallAssessment: z
        .string()
        .describe(
            "A balanced overall assessment of the candidate's interview " +
            "performance. Summarize their strongest abilities, major weaknesses, " +
            "and overall readiness for the target role. Base the assessment only " +
            "on the questions, answers, and scores provided."
        ),

    strengths: z
        .array(z.string())
        .describe(
            "The candidate's most significant strengths demonstrated during " +
            "the interview. Focus on evidence from their answers such as technical " +
            "knowledge, reasoning, communication, relevant experience, or structured thinking."
        ),

    weaknesses: z
        .array(z.string())
        .describe(
            "The most important weaknesses demonstrated during the interview. " +
            "Identify recurring or meaningful issues rather than isolated minor mistakes."
        ),

    recommendations: z
        .array(z.string())
        .describe(
            "Specific and actionable recommendations that would help the candidate " +
            "improve future interview performance. Recommendations should address " +
            "the weaknesses actually observed in the interview."
        ),

    technicalScore: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "Overall technical performance score from 0 to 100. Evaluate the " +
            "candidate's technical correctness, depth of knowledge, ability to " +
            "apply concepts, and technical reasoning based on the interview answers. " +
            "For interviews without meaningful technical questions, provide a " +
            "reasonable score based on the available evidence."
        ),

    communicationScore: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "Communication performance score from 0 to 100. Evaluate how clearly, " +
            "logically, and effectively the candidate communicated their answers."
        ),

    problemSolvingScore: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "Problem-solving performance score from 0 to 100. Evaluate the " +
            "candidate's reasoning process, ability to break down problems, " +
            "consider alternatives, and reach sensible solutions."
        ),

    confidenceScore: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "Confidence-related performance score from 0 to 100 based only on " +
            "observable characteristics of the candidate's answers, such as clarity, " +
            "decisiveness, structure, and willingness to explain reasoning. Do not " +
            "claim to measure the candidate's actual psychological confidence."
        ),
});

export default InterviewReportSchema;