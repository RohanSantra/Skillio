import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "../features/auth/components/ProtectedRoute.jsx";
import PublicOnlyRoute from "../features/auth/components/PublicOnlyRoute.jsx";

import Login from "../features/auth/pages/Login.jsx";
import Register from "../features/auth/pages/Register.jsx";
import EmailVerification from "../features/auth/pages/EmailVerification.jsx";
import ForgotPassword from "../features/auth/pages/ForgotPassword.jsx";
import ResetPassword from "../features/auth/pages/ResetPassword.jsx";
import ChangePassword from "../features/auth/pages/ChangePassword.jsx";

import LandingPage from "../features/landing/pages/LandingPage.jsx";

import AppLayout from "../components/layout/AppLayout.jsx";

import Dashboard from "../features/dashboard/pages/Dashboard.jsx";
import CareerProfile from "../features/career-profile/pages/CareerProfile.jsx";
import ResumeList from "../features/resume/pages/ResumeList.jsx";
import JobWorkspace from "../features/job-workspace/pages/JobWorkspace.jsx";
import Interview from "../features/interview/pages/Interview.jsx";
import CareerCoach from "../features/career-coach/pages/CareerCoach.jsx";
import Applications from "../features/application/pages/Applications.jsx";
import JobWorkspaceDetails from "../features/job-workspace/pages/JobWorkspaceDetails.jsx";
import ResumeDetails from "../features/resume/pages/ResumeDetails.jsx";
import CreateResume from "../features/resume/pages/CreateResume.jsx";
import PreparationPlans from "../features/preparation/pages/PreparationPlans.jsx";
import PreparationPlanDetails from "../features/preparation/pages/PreparationPlanDetails.jsx";
import InterviewSessionDetails from "../features/interview/pages/InterviewSessionDetails.jsx";
import Settings from "../features/settings/pages/Settings.jsx";
import NotFound from "../features/not_found/pages/NotFound.jsx";

const router = createBrowserRouter([
    /*
     * =========================
     * PUBLIC-ONLY AUTH PAGES
     * =========================
     */

    {
        element: <PublicOnlyRoute />,
        children: [
            {
                path: "/login",
                element: <Login />,
            },
            {
                path: "/register",
                element: <Register />,
            },
            {
                path: "/forgot-password",
                element: <ForgotPassword />,
            },
            {
                path: "/reset-password/:token",
                element: <ResetPassword />,
            },
        ],
    },

    /*
     * =========================
     * EMAIL VERIFICATION
     * =========================
     */

    {
        path: "/verify-email",
        element: <EmailVerification />,
    },

    {
        path: "/verify-email/:token",
        element: <EmailVerification />,
    },

    /*
     * =========================
     * PROTECTED APPLICATION
     * =========================
     */

    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        path: "/dashboard",
                        element: <Dashboard />,
                    },

                    {
                        path: "/career-profile",
                        element: <CareerProfile />,
                    },

                    {
                        path: "/resumes",
                        element: <ResumeList />,
                    },

                    {
                        path: "/resumes/create",
                        element: <CreateResume />
                    },
                    {
                        path: "/resumes/:resumeId",
                        element: < ResumeDetails />
                    },

                    {
                        path: "/job-workspaces",
                        element: <JobWorkspace />,
                    },

                    {
                        path: "/job-workspaces/:jobId",
                        element: <JobWorkspaceDetails />,
                    },

                    {
                        path: "/preparation",
                        element: <PreparationPlans />,
                    },

                    {
                        path: "/preparation-plans/:planId",
                        element: <PreparationPlanDetails />
                    },

                    {
                        path: "/interviews",
                        element: <Interview />,
                    },
                    {
                        path: "/interviews/:sessionId",
                        element: <InterviewSessionDetails />,
                    },
                    {
                        path: "/career-coach",
                        element: <CareerCoach />,
                    },

                    {
                        path: "/applications",
                        element: <Applications />,
                    },

                    {
                        path: "/settings",
                        element: <Settings/>,
                    },

                    {
                        path: "/settings/change-password",
                        element: <ChangePassword />,
                    },
                ],
            },
        ],
    },

    /*
     * =========================
     * LANDING PAGE
     * =========================
     */

    {
        path: "/",
        element: <LandingPage />,
    },

    /*
     * =========================
     * NOT FOUND PAGE
     * =========================
     */
    {
        path:"*" ,
        element:<NotFound />
    }
]);

export default router;