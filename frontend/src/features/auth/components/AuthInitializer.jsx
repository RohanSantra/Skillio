import { useEffect } from "react";

import useAuth from "../hooks/useAuth.js";

const AuthInitializer = ({ children }) => {
    const { initializeAuth } = useAuth();

    useEffect(() => {
        initializeAuth();
    }, [initializeAuth]);

    return children;
};

export default AuthInitializer;