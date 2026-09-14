import api, { refreshAccessToken } from "../../../lib/axios";

const register = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

const verifyEmail = async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    return response.data;
};

const resendVerificationEmail = async (email) => {
    const response = await api.post("/auth/resend-verification", {
        email,
    });

    return response.data;
};

const login = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

const googleLogin = async (idToken) => {
    const response = await api.post("/auth/google", {
        idToken,
    });

    return response.data;
};

const refresh = async () => {
    const response = await refreshAccessToken();
    return response.data;
};

const getMe = async () => {
    const response = await api.get("/auth/me");
    return response.data;
};

const updateProfile = async (formData) => {

    const response = await api.patch(
        "/auth/profile",
        formData,
        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }
    );

    return response.data;
};

const logout = async () => {
    const response = await api.post("/auth/logout");
    return response.data;
};

const logoutAll = async () => {
    const response = await api.post("/auth/logout-all");
    return response.data;
};

const forgotPassword = async (email) => {
    const response = await api.post("/auth/forgot-password", {
        email,
    });

    return response.data;
};

const resetPassword = async (token, password) => {
    const response = await api.post(
        `/auth/reset-password/${token}`,
        {
            password,
        }
    );

    return response.data;
};

const changePassword = async (currentPassword, newPassword) => {
    const response = await api.post("/auth/change-password", {
        currentPassword,
        newPassword,
    });

    return response.data;
};

export {
    register,
    verifyEmail,
    resendVerificationEmail,
    login,
    googleLogin,
    refresh,
    getMe,
    updateProfile,
    logout,
    logoutAll,
    forgotPassword,
    resetPassword,
    changePassword,
};
