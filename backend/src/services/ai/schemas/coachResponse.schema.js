import { z } from "zod";

const CoachResponseSchema = z.object({
    message: z
        .string()
        .describe(
            "The Career Coach's response to the user's message. " +
            "Give practical, personalized, and context-aware career guidance. " +
            "The response should directly address the user's question rather " +
            "than giving generic career advice."
        ),

    suggestions: z
        .array(z.string())
        .describe(
            "A short list of useful next actions or suggestions the user " +
            "could consider based on the conversation and available Skillio context. " +
            "Return an empty array when additional suggestions are unnecessary."
        ),
});

export default CoachResponseSchema;