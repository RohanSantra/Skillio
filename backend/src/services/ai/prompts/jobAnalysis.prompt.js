/**
 * @Name : buildJobAnalysisPrompt
 * @param : jobDescription
 * @description :
 * Creates the instructions used by Gemini to analyze
 * a job description.
 */

const buildJobAnalysisPrompt = (jobDescription) => {
    return `
Analyze the following job description for Skillio.

The extracted information will be used for:

- Job understanding
- Candidate-job matching
- Skill-gap identification
- Resume optimization
- ATS keyword analysis
- Interview preparation
- Personalized career preparation

Follow the provided response schema exactly.

Important instructions:

1. Use only information supported by the job description.

2. Do not invent requirements, skills, qualifications,
   responsibilities, or experience.

3. Clearly distinguish required skills from preferred skills.

4. Avoid duplicate values.

5. Prefer specific technical and professional terminology
   over generic terms.

6. If the job description does not provide information for
   a string field, return an empty string.

7. If the job description does not provide information for
   an array field, return an empty array.

JOB DESCRIPTION:

${jobDescription}
`;
};

export default buildJobAnalysisPrompt;