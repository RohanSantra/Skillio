import { create } from "zustand";

const useCoachConversationStore = create(
    (set) => ({

        conversations: [],

        currentConversation: null,

        loading: false,

        error: null,


        /**
         * Set conversations
         */
        setConversations: (conversations) => {
            set({
                conversations,
            });
        },


        /**
         * Set current conversation
         */
        setCurrentConversation: (
            conversation
        ) => {
            set({
                currentConversation:
                    conversation,
            });
        },


        /**
         * Add conversation
         */
        addConversation: (conversation) => {

            set((state) => ({
                conversations: [
                    conversation,
                    ...state.conversations,
                ],

                currentConversation:
                    conversation,
            }));
        },


        /**
         * Update conversation
         */
        updateConversationInStore: (
            updatedConversation
        ) => {

            set((state) => ({
                conversations:
                    state.conversations.map(
                        (conversation) =>
                            conversation._id ===
                                updatedConversation._id
                                ? updatedConversation
                                : conversation
                    ),

                currentConversation:
                    state.currentConversation?._id ===
                        updatedConversation._id
                        ? updatedConversation
                        : state.currentConversation,
            }));
        },


        /**
         * Remove conversation
         */
        removeConversation: (
            conversationId
        ) => {

            set((state) => ({

                conversations:
                    state.conversations.filter(
                        (conversation) =>
                            conversation._id !==
                            conversationId
                    ),

                currentConversation:
                    state.currentConversation?._id ===
                        conversationId
                        ? null
                        : state.currentConversation,

            }));
        },


        /**
         * Loading state
         */
        setLoading: (loading) => {

            set({
                loading,
            });

        },


        /**
         * Error state
         */
        setError: (error) => {

            set({
                error,
            });

        },


        /**
         * Clear error
         */
        clearError: () => {

            set({
                error: null,
            });

        },


        /**
         * Reset store
         */
        resetCoachConversationStore: () => {

            set({
                conversations: [],

                currentConversation: null,

                loading: false,

                error: null,
            });

        },

    })
);

export default useCoachConversationStore;