import { z } from "zod";

const ResumeATSSchema = z.object({
    score: z
        .number()
        .min(0)
        .max(100)
        .describe(
            "The overall ATS compatibility score between the candidate's " +
            "resume and the target job, from 0 to 100. The score should " +
            "primarily reflect important required skill matches, relevant " +
            "experience, keyword coverage, project relevance, and alignment " +
            "with the job responsibilities. Do not inflate the score."
        ),

    matchedKeywords: z
        .array(
            z
                .string()
                .describe(
                    "A meaningful job-related keyword, skill, technology, " +
                    "tool, framework, programming language, or professional " +
                    "competency that is clearly demonstrated in the candidate's resume."
                )
        )
        .describe(
            "Important keywords from the target job that are clearly present " +
            "or demonstrated in the candidate's resume. Avoid duplicates and " +
            "avoid generic words unless they are specifically important to the job."
        ),

    missingKeywords: z
        .array(
            z
                .string()
                .describe(
                    "An important job-related keyword, skill, technology, " +
                    "tool, framework, or competency that is required or " +
                    "meaningfully preferred for the target job but is not " +
                    "clearly demonstrated in the candidate's resume."
                )
        )
        .describe(
            "Important missing keywords or requirements that reduce the resume's " +
            "match for the target job. Prioritize required skills over minor " +
            "preferred skills. Do not include duplicates or mark equivalent " +
            "skills as missing when the resume clearly demonstrates them."
        ),

    strengths: z
        .array(
            z
                .string()
                .describe(
                    "A specific strength in the candidate's resume that improves " +
                    "their suitability for the target job. The strength must be " +
                    "supported by evidence from the resume and relevant to the role."
                )
        )
        .describe(
            "Specific and evidence-based strengths showing where the candidate " +
            "aligns well with the target job. Avoid generic compliments."
        ),

    weaknesses: z
        .array(
            z
                .string()
                .describe(
                    "A specific weakness or limitation in the resume that reduces " +
                    "the candidate's alignment with the target job, such as a " +
                    "missing important skill, weak evidence, limited relevant " +
                    "experience, or poor keyword coverage."
                )
        )
        .describe(
            "Specific weaknesses that materially affect the resume's match for " +
            "this particular job. Focus only on meaningful job-related gaps."
        ),

    suggestions: z
        .array(
            z
                .string()
                .describe(
                    "A practical and truthful recommendation for improving the " +
                    "candidate's resume specifically for the target job. Suggestions " +
                    "must improve presentation or highlight genuine existing " +
                    "qualifications without encouraging fabrication."
                )
        )
        .describe(
            "Specific, practical, and job-focused suggestions for improving the " +
            "resume. Recommendations may include better highlighting relevant " +
            "existing skills, projects, experience, achievements, or keywords. " +
            "Never suggest fabricating qualifications."
        ),
});

export default ResumeATSSchema;