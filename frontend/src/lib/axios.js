import axios from "axios";

import useAuthStore from "../features/auth/store/auth.store";


/* =====================================================
   MAIN API INSTANCE
===================================================== */

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },
});


/* =====================================================
   REFRESH API INSTANCE

   Separate instance is important so the refresh request
   does NOT trigger the same response interceptor.
===================================================== */

const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,

    withCredentials: true,

    headers: {
        "Content-Type": "application/json",
    },
});

/*
 * Refresh tokens are rotated by the API. Two concurrent refresh calls would
 * therefore make the second call use an already-replaced cookie and revoke
 * the session. Keep one shared in-flight request for the entire client.
 */
let refreshPromise = null;

const refreshAccessToken = () => {
    if (!refreshPromise) {
        refreshPromise = refreshApi
            .post("/auth/refresh")
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
};


/* =====================================================
   REQUEST INTERCEPTOR

   Automatically attach access token to every request.
===================================================== */

api.interceptors.request.use(
    (config) => {

        const accessToken =
            useAuthStore.getState().accessToken;

        if (accessToken) {

            config.headers.Authorization =
                `Bearer ${accessToken}`;

        }

        return config;

    },

    (error) => Promise.reject(error)
);


/* =====================================================
   TOKEN REFRESH STATE
===================================================== */

let isRefreshing = false;

let failedQueue = [];


/* =====================================================
   PROCESS QUEUE

   If multiple requests fail with 401 while one refresh
   request is already running, we wait and retry them
   after receiving the new token.
===================================================== */

const processQueue = (error, accessToken = null) => {

    failedQueue.forEach((promise) => {

        if (error) {

            promise.reject(error);

        } else {

            promise.resolve(accessToken);

        }

    });

    failedQueue = [];
};

// A list of endpoints that should NEVER trigger token refresh.
const AUTH_ENDPOINTS = [
    "/auth/login",
    "/auth/register",
    "/auth/google",
    "/auth/refresh",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/resend-verification",
];


/* =====================================================
   RESPONSE INTERCEPTOR

   Handles expired access tokens automatically.
===================================================== */

api.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        const status = error?.response?.status;

        const url = originalRequest?.url;

        // Only handle 401
        if (status !== 401) {
            return Promise.reject(error);
        }

        // Don't refresh authentication/public endpoints
        if (
            AUTH_ENDPOINTS.some((endpoint) =>
                url?.includes(endpoint)
            )
        ) {
            return Promise.reject(error);
        }

        // Prevent infinite retry
        if (originalRequest?._retry) {
            return Promise.reject(error);
        }

        // Queue requests while refreshing
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({
                    resolve,
                    reject,
                });
            })
                .then((accessToken) => {
                    originalRequest.headers.Authorization =
                        `Bearer ${accessToken}`;

                    return api(originalRequest);
                })
                .catch((error) =>
                    Promise.reject(error)
                );
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const response =
                await refreshAccessToken();

            const newAccessToken =
                response?.data?.data?.accessToken;

            if (!newAccessToken) {
                throw new Error(
                    "Failed to refresh access token."
                );
            }

            useAuthStore
                .getState()
                .setAccessToken(newAccessToken);

            processQueue(null, newAccessToken);

            originalRequest.headers.Authorization =
                `Bearer ${newAccessToken}`;

            return api(originalRequest);

        } catch (refreshError) {

            processQueue(refreshError);

            useAuthStore
                .getState()
                .clearAuth();

            return Promise.reject(refreshError);

        } finally {

            isRefreshing = false;

        }
    }
);

export { refreshAccessToken, refreshApi };
export default api;
