import { GoogleGenAI } from "@google/genai";

import config from "../../config/config.js";
import { z } from "zod";

const ai = new GoogleGenAI({
    apiKey: config.GEMINI_API_KEY,
});

/**
 * Generates a structured AI response using Gemini.
 *
 * @param {string} prompt
 * @param {ZodObject} schema
 * @returns {Promise<object>}
 */
const generateStructuredResponse = async (
    prompt,
    schema
) => {
    const responseSchema = z.toJSONSchema(schema);

    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",

        contents: prompt,

        config: {
            responseMimeType: "application/json",
            responseJsonSchema: responseSchema,
        },
    });

    if (!response.text) {
        throw new Error(
            "Gemini returned an empty response."
        );
    }

    let parsedResponse;

    try {
        parsedResponse = JSON.parse(
            response.text
        );
    } catch (error) {
        throw new Error(
            "Gemini returned invalid JSON."
        );
    }

    /*
     * Gemini is constrained by the schema, but we still
     * validate the result independently before allowing
     * it into our application.
     */
    const validationResult = schema.safeParse(
        parsedResponse
    );

    if (!validationResult.success) {
        console.error(
            "Gemini response validation failed:",
            validationResult.error
        );

        throw new Error(
            "Gemini returned an invalid structured response."
        );
    }

    return validationResult.data;
};

export {
    generateStructuredResponse,
};