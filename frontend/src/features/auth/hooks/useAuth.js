import { useCallback } from "react";

import useAuthStore from "../store/auth.store.js";
import {
    register as registerApi,
    verifyEmail as verifyEmailApi,
    resendVerificationEmail as resendVerificationEmailApi,
    login as loginApi,
    googleLogin as googleLoginApi,
    refresh as refreshApi,
    getMe as getMeApi,
    logout as logoutApi,
    logoutAll as logoutAllApi,
    forgotPassword as forgotPasswordApi,
    resetPassword as resetPasswordApi,
    changePassword as changePasswordApi,
    updateProfile as updateProfileApi,
} from "../services/auth.api.js";

const useAuth = () => {
    const user = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const isAuthenticated = useAuthStore(
        (state) => state.isAuthenticated
    );
    const isInitializing = useAuthStore(
        (state) => state.isInitializing
    );

    const setAuth = useAuthStore((state) => state.setAuth);
    const setUser = useAuthStore((state) => state.setUser);
    const setAccessToken = useAuthStore(
        (state) => state.setAccessToken
    );
    const clearAuth = useAuthStore(
        (state) => state.clearAuth
    );
    const setInitializing = useAuthStore(
        (state) => state.setInitializing
    );

    // ---------------------------------------------
    // Register
    // ---------------------------------------------

    const register = useCallback(async (data) => {
        return await registerApi(data);
    }, []);

    // ---------------------------------------------
    // Verify email
    // ---------------------------------------------

    const verifyEmail = useCallback(async (token) => {
        const response = await verifyEmailApi(token);

        if (response?.data?.accessToken && response?.data?.user) {
            setAuth({
                user: response.data.user,
                accessToken: response.data.accessToken,
            });
        }

        return response;
    }, [setAuth]);

    // ---------------------------------------------
    // Resend verification email
    // ---------------------------------------------

    const resendVerificationEmail = useCallback(async (email) => {
        return await resendVerificationEmailApi(email);
    }, []);

    // ---------------------------------------------
    // Login
    // ---------------------------------------------

    const login = useCallback(async (data) => {
        const response = await loginApi(data);

        if (response?.data?.accessToken && response?.data?.user) {
            setAuth({
                user: response.data.user,
                accessToken: response.data.accessToken,
            });
        }

        return response;
    }, [setAuth]);

    // ---------------------------------------------
    // Google Login
    // ---------------------------------------------

    const googleLogin = useCallback(async (idToken) => {
        const response = await googleLoginApi(idToken);

        if (response?.data?.accessToken && response?.data?.user) {
            setAuth({
                user: response.data.user,
                accessToken: response.data.accessToken,
            });
        }

        return response;
    }, [setAuth]);

    // ---------------------------------------------
    // Refresh access token
    // ---------------------------------------------

    const refresh = useCallback(async () => {
        const response = await refreshApi();

        if (response?.data?.accessToken) {
            setAccessToken(response.data.accessToken);
        }

        return response;
    }, [setAccessToken]);

    // ---------------------------------------------
    // Get current user
    // ---------------------------------------------

    const getMe = useCallback(async () => {
        const response = await getMeApi();

        if (response?.data?.user) {
            setUser(response.data.user);
        }

        return response;
    }, [setUser]);

    // ---------------------------------------------
    // Update profile
    // ---------------------------------------------
    const updateProfile = useCallback(
    async (formData) => {

        const response =
            await updateProfileApi(formData);

        if (response?.data?.user) {

            setUser(
                response.data.user
            );
        }

        return response;

    },
    [setUser]
);

    // ---------------------------------------------
    // Restore authentication session
    // ---------------------------------------------

    const initializeAuth = useCallback(async () => {

        try {

            setInitializing(true);

            const refreshResponse = await refreshApi();

            const newAccessToken =
                refreshResponse?.data?.accessToken;

            if (!newAccessToken) {

                clearAuth();

                return;

            }

            setAccessToken(newAccessToken);

            const meResponse = await getMeApi();

            const currentUser =
                meResponse?.data?.user;

            if (!currentUser) {

                clearAuth();

                return;

            }

            setAuth({
                user: currentUser,
                accessToken: newAccessToken,
            });

        } catch (error) {

            clearAuth();

        } finally {

            setInitializing(false);

        }

    }, []);

    // ---------------------------------------------
    // Logout
    // ---------------------------------------------

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } finally {
            clearAuth();
        }
    }, [clearAuth]);

    // ---------------------------------------------
    // Logout all sessions
    // ---------------------------------------------

    const logoutAll = useCallback(async () => {
        try {
            await logoutAllApi();
        } finally {
            clearAuth();
        }
    }, [clearAuth]);

    // ---------------------------------------------
    // Forgot password
    // ---------------------------------------------

    const forgotPassword = useCallback(async (email) => {
        return await forgotPasswordApi(email);
    }, []);

    // ---------------------------------------------
    // Reset password
    // ---------------------------------------------

    const resetPassword = useCallback(async (token, password) => {
        return await resetPasswordApi(token, password);
    }, []);

    // ---------------------------------------------
    // Change password
    // ---------------------------------------------

    const changePassword = useCallback(
        async (currentPassword, newPassword) => {
            const response = await changePasswordApi(
                currentPassword,
                newPassword
            );

            return response;
        },
        []
    );

    return {
        user,
        accessToken,
        isAuthenticated,
        isInitializing,

        register,
        verifyEmail,
        resendVerificationEmail,
        login,
        googleLogin,
        refresh,
        getMe,
        initializeAuth,
        logout,
        logoutAll,
        forgotPassword,
        resetPassword,
        changePassword,
        updateProfile
    };
};

export default useAuth;