import { useCallback } from "react";

import coachConversationApi from
    "../services/coachConversation.api";

import useCoachConversationStore from
    "../store/coachConversation.store";


const useCoachConversation = () => {

    const {

        conversations,

        currentConversation,

        loading,

        error,

        setConversations,

        setCurrentConversation,

        addConversation,

        updateConversationInStore,

        removeConversation,

        setLoading,

        setError,

        clearError,

    } = useCoachConversationStore();


    /**
     * Get all conversations
     */
    const getConversations =
        useCallback(async () => {

            try {

                setLoading(true);

                clearError();

                const response =
                    await coachConversationApi.getConversations();

                const conversations =
                    response?.data?.conversations || [];

                setConversations(conversations);

                return conversations;

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to fetch conversations.";

                setError(message);

                throw error;

            } finally {

                setLoading(false);

            }

        }, []);


    /**
     * Get single conversation
     */
    const getConversation =
        useCallback(async (conversationId) => {

            try {

                setLoading(true);

                clearError();

                const response =
                    await coachConversationApi.getConversation(
                        conversationId
                    );

                const conversation =
                    response?.data?.conversation;

                setCurrentConversation(
                    conversation
                );

                return conversation;

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to fetch conversation.";

                setError(message);

                throw error;

            } finally {

                setLoading(false);

            }

        }, []);


    /**
     * Create conversation
     */
    const createConversation =
        useCallback(async (data) => {

            try {

                setLoading(true);

                clearError();

                const response =
                    await coachConversationApi.createConversation(
                        data
                    );

                const conversation =
                    response?.data?.conversation;

                addConversation(conversation);

                return conversation;

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to create conversation.";

                setError(message);

                throw error;

            } finally {

                setLoading(false);

            }

        }, []);


    /**
     * Update conversation
     */
    const updateConversation =
        useCallback(
            async (
                conversationId,
                data
            ) => {

                try {

                    setLoading(true);

                    clearError();

                    const response =
                        await coachConversationApi.updateConversation(
                            conversationId,
                            data
                        );

                    const conversation =
                        response?.data?.conversation;

                    updateConversationInStore(
                        conversation
                    );

                    return conversation;

                } catch (error) {

                    const message =
                        error?.response?.data?.message ||
                        "Failed to update conversation.";

                    setError(message);

                    throw error;

                } finally {

                    setLoading(false);

                }

            },
            []
        );


    /**
     * Delete conversation
     */
    const deleteConversation =
        useCallback(
            async (conversationId) => {

                try {

                    setLoading(true);

                    clearError();

                    await coachConversationApi.deleteConversation(
                        conversationId
                    );

                    removeConversation(
                        conversationId
                    );

                } catch (error) {

                    const message =
                        error?.response?.data?.message ||
                        "Failed to delete conversation.";

                    setError(message);

                    throw error;

                } finally {

                    setLoading(false);

                }

            },
            []
        );


    /**
     * Send message to AI coach
     */
    const sendCoachMessage =
        useCallback(async (data) => {

            try {

                setLoading(true);

                clearError();

                const response =
                    await coachConversationApi.sendCoachMessage(
                        data
                    );

                const conversation =
                    response?.data?.conversation;

                /*
                 * The API can create a completely
                 * new conversation.
                 */

                const alreadyExists =
                    conversations.some(
                        (item) =>
                            item._id ===
                            conversation._id
                    );


                if (alreadyExists) {

                    updateConversationInStore(
                        conversation
                    );

                } else {

                    addConversation(
                        conversation
                    );

                }


                return {
                    conversationId:
                        response?.data?.conversationId,

                    message:
                        response?.data?.message,

                    suggestions:
                        response?.data?.suggestions,

                    conversation,
                };

            } catch (error) {

                const message =
                    error?.response?.data?.message ||
                    "Failed to send message.";

                setError(message);

                throw error;

            } finally {

                setLoading(false);

            }

        }, [conversations]);


    return {

        /* State */

        conversations,

        currentConversation,

        loading,

        error,


        /* Actions */

        getConversations,

        getConversation,

        createConversation,

        updateConversation,

        deleteConversation,

        sendCoachMessage,


        /* Store helpers */

        setCurrentConversation,

        clearError,

    };

};


export default useCoachConversation;