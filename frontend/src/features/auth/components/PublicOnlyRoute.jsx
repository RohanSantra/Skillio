import { Navigate, Outlet } from "react-router-dom";

import useAuth from "../hooks/useAuth.js";

const PublicOnlyRoute = () => {
    const { isAuthenticated, isInitializing } = useAuth();

    if (isInitializing) {
        return null;
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default PublicOnlyRoute;