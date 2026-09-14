import { z } from "zod";

const InterviewFeedbackSchema = z.object({
    feedback: z
        .string()
        .describe(
            "Detailed but concise feedback explaining how well the " +
            "candidate answered the interview question. Evaluate the " +
            "accuracy, relevance, completeness, reasoning, and clarity " +
            "of the answer."
        ),

    score: z
        .number()
        .min(0)
        .max(10)
        .describe(
            "Score the candidate's answer from 0 to 10. " +
            "0 means the answer is completely incorrect, irrelevant, " +
            "or missing. 10 means the answer is highly accurate, " +
            "complete, relevant, well-reasoned, and clearly communicated."
        ),

    strengths: z
        .array(z.string())
        .describe(
            "Specific things the candidate did well in their answer."
        ),

    improvements: z
        .array(z.string())
        .describe(
            "Specific and actionable improvements the candidate could " +
            "make to provide a stronger interview answer."
        ),
});

export default InterviewFeedbackSchema;