const buildInterviewQuestionPrompt = ({
    careerProfile,
    jobWorkspace,
    type,
    difficulty,
}) => {
    return `
You are Skillio's AI interviewer.

Generate realistic interview questions for the candidate's
target job.

INTERVIEW TYPE:
${type}

DIFFICULTY:
${difficulty}

The questions should be personalized using:

- Candidate career profile
- Candidate skills
- Candidate experience
- Candidate projects
- Target job
- Job description
- Required skills
- Preferred skills
- Job analysis
- Identified skill gaps

IMPORTANT RULES:

1. Questions must be relevant to the selected interview type.

2. Questions should match the requested difficulty.

3. Do not invent candidate experience.

4. If asking about the candidate's experience, use only
   information present in their career profile or resume data.

5. Technical questions should be appropriate for the target role.

6. Behavioral questions should encourage the candidate to
   explain real experiences.

7. System-design questions should be appropriate for the
   candidate's apparent experience level and target role.

8. Resume questions should focus on information actually
   present in the candidate's profile.

9. Job-description questions should be based on the actual
   target job.

10. Avoid duplicate questions.

11. Questions should test understanding rather than simply
    asking the candidate to define obvious terminology.

12. Return a useful number of questions for a practice session.

CANDIDATE:

${JSON.stringify(careerProfile, null, 2)}

TARGET JOB:

${JSON.stringify({
        company: jobWorkspace.company,
        role: jobWorkspace.role,
        jobDescription: jobWorkspace.jobDescription,
        jobAnalysis: jobWorkspace.jobAnalysis,
        jobMatch: jobWorkspace.jobMatch,
        skillGaps: jobWorkspace.skillGaps,
    }, null, 2)}
`;
};

export default buildInterviewQuestionPrompt;