import { z } from "zod";

const PreparationPlanSchema = z.object({
    title: z
        .string()
        .describe(
            "A concise title for the preparation plan that clearly " +
            "identifies the target role and preparation objective."
        ),

    overview: z
        .string()
        .describe(
            "A personalized overview explaining the candidate's current " +
            "readiness for the target job, the most important areas they " +
            "should focus on, and the overall strategy for becoming ready " +
            "for the position."
        ),

    tasks: z
        .array(
            z.object({
                title: z
                    .string()
                    .describe(
                        "A concise, actionable title describing exactly " +
                        "what the candidate should do."
                    ),

                description: z
                    .string()
                    .describe(
                        "Detailed instructions explaining what the candidate " +
                        "should learn, practice, build, research, or complete. " +
                        "Make the task specific to the target job and candidate's " +
                        "identified gaps rather than giving generic advice."
                    ),

                category: z
                    .enum([
                        "technical",
                        "resume",
                        "behavioral",
                        "system-design",
                        "company",
                        "other",
                    ])
                    .describe(
                        "The preparation category that best describes the task."
                    ),

                priority: z
                    .enum([
                        "low",
                        "medium",
                        "high",
                    ])
                    .describe(
                        "How important the task is for becoming ready for " +
                        "the target position. High priority should be used " +
                        "for important skill gaps or job requirements."
                    ),

                estimatedMinutes: z
                    .number()
                    .int()
                    .min(1)
                    .describe(
                        "A realistic estimate in minutes for completing the task."
                    ),
            })
        )
        .describe(
            "A prioritized set of concrete preparation tasks. Tasks should " +
            "directly address the candidate's skill gaps, job requirements, " +
            "interview preparation needs, resume weaknesses, or company-specific " +
            "preparation. Avoid redundant tasks."
        ),
});

export default PreparationPlanSchema;