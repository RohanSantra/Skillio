import { z } from "zod";

const JobMatchSchema = z.object({
    score: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "Overall compatibility score between the candidate and the job, " +
            "from 0 to 100. Base the score on how well the candidate's skills, " +
            "experience, projects, education, and other career information match " +
            "the actual requirements of the job. Do not give a high score merely " +
            "because the candidate has some matching skills. Consider the importance " +
            "of each requirement and distinguish critical requirements from minor ones."
        ),

    matchedSkills: z
        .array(z.string())
        .describe(
            "Skills from the candidate's career profile that directly match " +
            "skills or technologies required or preferred by the job. Only include " +
            "skills that are actually present in the candidate data. Do not infer " +
            "skills that are not supported by the candidate's profile."
        ),

    missingSkills: z
        .array(z.string())
        .describe(
            "Important job-required or strongly preferred skills that are absent " +
            "from the candidate's career profile. Prioritize meaningful gaps rather " +
            "than listing every minor difference. Do not mark a skill as missing if " +
            "the candidate clearly demonstrates equivalent experience or knowledge."
        ),

    strengths: z
        .array(z.string())
        .describe(
            "The strongest aspects of the candidate's profile relative to this job. " +
            "Explain meaningful advantages such as relevant technical skills, years " +
            "of experience, directly relevant projects, domain experience, education, " +
            "or combinations of skills that make the candidate particularly suitable."
        ),
});

export default JobMatchSchema;