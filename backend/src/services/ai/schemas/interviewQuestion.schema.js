import { z } from "zod";

const InterviewQuestionSchema = z.object({
    questions: z
        .array(
            z.object({
                question: z
                    .string()
                    .describe(
                        "A clear interview question specifically relevant " +
                        "to the candidate's target job, career profile, and " +
                        "selected interview type. The question should be " +
                        "realistic for an actual interview."
                    ),

                category: z
                    .string()
                    .describe(
                        "The category of the interview question, such as " +
                        "technical, behavioral, system-design, resume, " +
                        "job-description, or other."
                    ),
            })
        )
        .describe(
            "A collection of interview questions designed specifically " +
            "for the candidate and target job. Avoid generic questions " +
            "when the available job and candidate information allows " +
            "more personalized questions."
        ),
});

export default InterviewQuestionSchema;