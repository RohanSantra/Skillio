import { z } from "zod";

const ResumeParseSchema = z.object({
    name: z
        .string()
        .describe(
            "The candidate's full name exactly as it appears " +
            "in the resume. Return an empty string if it cannot " +
            "be confidently identified."
        ),

    email: z
        .string()
        .describe(
            "The candidate's email address found in the resume. " +
            "Return an empty string if none is present."
        ),

    phone: z
        .string()
        .describe(
            "The candidate's phone number found in the resume. " +
            "Return an empty string if none is present."
        ),

    headline: z
        .string()
        .describe(
            "A concise professional headline representing the candidate's " +
            "role or professional identity based only on the resume."
        ),

    summary: z
        .string()
        .describe(
            "A concise professional summary based on information actually " +
            "present in the resume. Do not invent achievements or experience."
        ),

    skills: z
        .array(z.string())
        .describe(
            "Technical and professional skills explicitly mentioned or " +
            "clearly demonstrated in the resume. Avoid duplicate skills."
        ),

    experience: z
        .array(
            z.object({
                company: z
                    .string()
                    .describe(
                        "Company or organization where the candidate worked."
                    ),

                position: z
                    .string()
                    .describe(
                        "Job title or position held by the candidate."
                    ),

                startDate: z
                    .string()
                    .describe(
                        "Employment start date as represented in the resume. " +
                        "Preserve the available level of precision."
                    ),

                endDate: z
                    .string()
                    .describe(
                        "Employment end date as represented in the resume. " +
                        "Use 'Present' when the resume indicates the candidate " +
                        "currently holds the position."
                    ),

                description: z
                    .string()
                    .describe(
                        "A concise description of the candidate's responsibilities " +
                        "and achievements for this position, based only on the resume."
                    ),
            })
        )
        .describe(
            "All relevant professional work experiences found in the resume."
        ),

    projects: z
        .array(
            z.object({
                name: z
                    .string()
                    .describe(
                        "Name of the project."
                    ),

                description: z
                    .string()
                    .describe(
                        "Description of the project based only on the resume."
                    ),

                technologies: z
                    .array(z.string())
                    .describe(
                        "Technologies, programming languages, frameworks, " +
                        "libraries, databases, and tools explicitly associated " +
                        "with the project."
                    ),
            })
        )
        .describe(
            "Projects mentioned in the resume that demonstrate the candidate's skills."
        ),

    education: z
        .array(
            z.object({
                institution: z
                    .string()
                    .describe(
                        "Educational institution attended by the candidate."
                    ),

                degree: z
                    .string()
                    .describe(
                        "Degree or qualification earned or pursued."
                    ),

                fieldOfStudy: z
                    .string()
                    .describe(
                        "Field, specialization, or major associated with the degree."
                    ),

                startDate: z
                    .string()
                    .describe(
                        "Education start date when available."
                    ),

                endDate: z
                    .string()
                    .describe(
                        "Education completion/end date when available."
                    ),
            })
        )
        .describe(
            "Educational qualifications found in the resume."
        ),

    certifications: z
        .array(z.string())
        .describe(
            "Professional certifications explicitly listed in the resume."
        ),
});

export default ResumeParseSchema;