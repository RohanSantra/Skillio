import { z } from "zod";

const SkillGapSchema = z.object({
    skillGaps: z
        .array(
            z.object({
                skill: z
                    .string()
                    .describe(
                        "The specific skill, technology, tool, framework, " +
                        "programming language, methodology, or professional " +
                        "competency that the candidate currently lacks or " +
                        "needs to improve for this particular job."
                    ),

                importance: z
                    .enum([
                        "low",
                        "medium",
                        "high",
                        "critical",
                    ])
                    .describe(
                        "The importance of this skill for the target job. " +
                        "Use critical when the skill is fundamental to performing " +
                        "the role or is an explicitly important mandatory requirement. " +
                        "Use high when it is an important required capability. " +
                        "Use medium when it meaningfully improves job readiness but " +
                        "is not fundamental. Use low for minor or less important gaps."
                    ),

                reason: z
                    .string()
                    .describe(
                        "A clear explanation of why this skill represents a gap " +
                        "for the candidate. Compare the job requirement with the " +
                        "candidate's actual career profile and explain what evidence " +
                        "is missing. Do not claim the candidate lacks something when " +
                        "their profile provides evidence that they already possess it."
                    ),

                recommendation: z
                    .string()
                    .describe(
                        "A practical recommendation for closing this specific skill gap. " +
                        "Suggest what the candidate should learn, practice, build, or " +
                        "demonstrate. The recommendation should be relevant to the target " +
                        "job rather than being generic career advice."
                    ),
            })
        )
        .describe(
            "A prioritized list of meaningful skill gaps between the candidate " +
            "and the target job. Focus on skills that materially affect the candidate's " +
            "ability to qualify for or perform the role. Do not include skills that " +
            "the candidate already demonstrates. Avoid duplicate skills."
        ),
});

export default SkillGapSchema;