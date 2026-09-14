import { z } from "zod";

const AtsAnalysisSchema = z.object({
    score: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "An ATS compatibility score from 0 to 100 representing " +
            "how well the resume aligns with the target job description. " +
            "Consider relevant skills, keywords, experience, qualifications, " +
            "and role alignment."
        ),

    strengths: z
        .array(z.string())
        .describe(
            "Specific aspects of the resume that align strongly with " +
            "the target job. Focus on relevant skills, experience, " +
            "projects, qualifications, and keywords."
        ),

    weaknesses: z
        .array(z.string())
        .describe(
            "Specific weaknesses in the resume relative to the target job. " +
            "Focus on missing or weakly represented requirements, skills, " +
            "keywords, experience, and qualifications."
        ),

    suggestions: z
        .array(z.string())
        .describe(
            "Concrete recommendations for improving the resume's alignment " +
            "with this particular job. Suggestions should be actionable and " +
            "must not recommend falsely adding skills or experience the candidate " +
            "does not possess."
        ),
});

export default AtsAnalysisSchema;