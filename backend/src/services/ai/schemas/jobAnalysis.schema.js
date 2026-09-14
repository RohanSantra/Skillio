import { z } from "zod";

/**
 * @Name : JobAnalysisSchema
 * @description :
 * Defines the exact structured information that Gemini must extract
 * from a job description.
 *
 * The descriptions are intentionally detailed because they guide
 * Gemini when deciding what information belongs in each field.
 */

const JobAnalysisSchema = z.object({

    summary: z
        .string()
        .describe(
            "A concise but informative summary of the job role. " +
            "Explain the main purpose of the position, the type of " +
            "work the candidate will perform, and the primary goal " +
            "of the role."
        ),

    responsibilities: z
        .array(z.string())
        .describe(
            "The main responsibilities and duties expected from " +
            "the candidate. Each item should contain one clear " +
            "responsibility. Use information supported by the job description."
        ),

    requiredSkills: z
        .array(z.string())
        .describe(
            "Skills, technologies, tools, frameworks, programming " +
            "languages, methodologies, and professional competencies " +
            "that are explicitly required for the role. Do not include " +
            "skills that are only described as preferred."
        ),

    preferredSkills: z
        .array(z.string())
        .describe(
            "Skills, technologies, tools, qualifications, or competencies " +
            "described as preferred, desirable, nice-to-have, bonus, or " +
            "additional qualifications. Do not place mandatory requirements here."
        ),

    experienceRequired: z
        .string()
        .describe(
            "The professional experience required for the position. " +
            "Include years and relevant experience areas when specified. " +
            "Return an empty string if no experience requirement is mentioned."
        ),

    educationRequired: z
        .string()
        .describe(
            "The educational qualifications required for the position. " +
            "Include degree and field of study when specified. " +
            "Return an empty string if no education requirement is mentioned."
        ),

    keywords: z
        .array(z.string())
        .describe(
            "Important technical terms, technologies, tools, methodologies, " +
            "domain terminology, and role-specific keywords useful for ATS " +
            "matching, resume optimization, job matching, and skill-gap analysis. " +
            "Avoid generic words."
        ),

});

export default JobAnalysisSchema;