import api from "../../../lib/axios";

const coachConversationApi = {

    /**
     * Get all conversations
     */
    getConversations: async () => {
        const response = await api.get(
            "/coach-conversation/getAll-coach-conversation"
        );

        return response.data;
    },


    /**
     * Get single conversation
     */
    getConversation: async (conversationId) => {
        const response = await api.get(
            `/coach-conversation/${conversationId}`
        );

        return response.data;
    },


    /**
     * Create conversation
     */
    createConversation: async (data) => {
        const response = await api.post(
            "/coach-conversation/create-coach-conversation",
            data
        );

        return response.data;
    },


    /**
     * Update conversation
     */
    updateConversation: async (
        conversationId,
        data
    ) => {
        const response = await api.patch(
            `/coach-conversation/${conversationId}`,
            data
        );

        return response.data;
    },


    /**
     * Delete conversation
     */
    deleteConversation: async (
        conversationId
    ) => {
        const response = await api.delete(
            `/coach-conversation/${conversationId}`
        );

        return response.data;
    },


    /**
     * Add message manually
     */
    addMessage: async (
        conversationId,
        data
    ) => {
        const response = await api.post(
            `/coach-conversation/${conversationId}/messages`,
            data
        );

        return response.data;
    },


    /**
     * Delete message
     */
    deleteMessage: async (
        conversationId,
        messageId
    ) => {
        const response = await api.delete(
            `/coach-conversation/${conversationId}/messages/${messageId}`
        );

        return response.data;
    },


    /**
     * Send message to AI Career Coach
     */
    sendCoachMessage: async (data) => {
        const response = await api.post(
            "/coach-conversation/conversations/message",
            data
        );

        return response.data;
    },

};

export default coachConversationApi;