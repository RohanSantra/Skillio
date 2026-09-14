import { create } from "zustand";

const useAuthStore = create((set) => ({

    user: null,

    accessToken: null,

    isAuthenticated: false,

    isInitializing: true,


    setAuth: ({ user, accessToken }) => {

        set({
            user,
            accessToken,
            isAuthenticated: Boolean(
                user && accessToken
            ),
        });

    },


    setUser: (user) => {

        set((state) => ({
            user,
            isAuthenticated: Boolean(
                user && state.accessToken
            ),
        }));

    },


    setAccessToken: (accessToken) => {

        set({
            accessToken,
        });

    },


    clearAuth: () => {

        set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
        });

    },


    setInitializing: (value) => {

        set({
            isInitializing: value,
        });

    },

}));

export default useAuthStore;