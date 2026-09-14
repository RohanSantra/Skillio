import { GoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";
import ErrorToast from "../../../components/feedback/ErrorToast.jsx";

const GoogleAuthButton = () => {
    const { googleLogin } = useAuth();

    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSuccess = async (credentialResponse) => {
        try {
            setError("");

            const idToken = credentialResponse.credential;

            if (!idToken) {
                throw new Error(
                    "Google did not return an authentication token."
                );
            }

            setIsLoading(true);

            await googleLogin(idToken);

            navigate("/dashboard");

        } catch (error) {
            console.error(
                "Google authentication failed:",
                error
            );

            setError(
                error?.response?.data?.message ||
                "Unable to sign in with Google. Please try again."
            );

        } finally {
            setIsLoading(false);
        }
    };

    const handleError = () => {
        setError(
            "Google sign-in was cancelled or failed. Please try again."
        );
    };

    return (
        <div className="google-auth-wrapper">

            <div
                className={
                    isLoading
                        ? "google-button-container google-loading"
                        : "google-button-container"
                }
            >
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    text="continue_with"
                    theme="outline"
                    logo_alignment="left"
                    size="large"
                    shape="rectangular"
                    width="400"
                />
            </div>

            {isLoading && (
                <p className="google-loading-text">
                    Signing you in with Google...
                </p>
            )}

            <ErrorToast error={error} />

        </div>
    );
};

export default GoogleAuthButton;