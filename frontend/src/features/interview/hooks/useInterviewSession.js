import useInterviewSessionStore
    from "../store/interviewSession.store.js";


const useInterviewSession = () => {

    const {

        interviewSessions,
        currentInterviewSession,
        isLoading,
        error,

        clearError,
        clearCurrentInterviewSession,

        getInterviewSessions,
        getInterviewSession,

        createInterviewSession,
        updateInterviewSession,
        deleteInterviewSession,

        addInterviewQuestion,
        updateInterviewQuestion,
        deleteInterviewQuestion,

        generateInterviewQuestions,
        evaluateInterviewAnswer,
        completeInterviewSession,

    } = useInterviewSessionStore();


    return {

        // =========================
        // STATE
        // =========================

        interviewSessions,

        currentInterviewSession,

        isLoading,

        error,


        // =========================
        // HELPERS
        // =========================

        clearError,

        clearCurrentInterviewSession,


        // =========================
        // SESSION ACTIONS
        // =========================

        getInterviewSessions,

        getInterviewSession,

        createInterviewSession,

        updateInterviewSession,

        deleteInterviewSession,


        // =========================
        // QUESTION ACTIONS
        // =========================

        addInterviewQuestion,

        updateInterviewQuestion,

        deleteInterviewQuestion,


        // =========================
        // AI ACTIONS
        // =========================

        generateInterviewQuestions,

        evaluateInterviewAnswer,

        completeInterviewSession,

    };
};


export default useInterviewSession;