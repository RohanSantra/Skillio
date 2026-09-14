import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./middlewares/error.middleware.js"

// Routes
import authRoutes from "./routes/auth.routes.js"
import careerProfileRoutes from "./routes/careerProfile.routes.js";
import jobWorkspaceRoutes from "./routes/jobWorkspace.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import preparationPlanRoutes from "./routes/preparationPlan.routes.js";
import interviewSessionRoutes from "./routes/interviewSession.routes.js";
import coachConversationRoutes from "./routes/coachConversation.routes.js"
import applicationRoutes from "./routes/application.routes.js"
import config from "./config/config.js";


const app = express();


app.use(cors({ origin: config.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/career-profile", careerProfileRoutes);
app.use("/api/v1/job-workspaces", jobWorkspaceRoutes);
app.use("/api/v1/resume", resumeRoutes);
app.use("/api/v1/preparation-plan", preparationPlanRoutes);
app.use("/api/v1/interview-session", interviewSessionRoutes);
app.use("/api/v1/coach-conversation", coachConversationRoutes);
app.use("/api/v1/application", applicationRoutes);



/*
 * Global error handler must be registered after all routes.
 */
app.use(errorHandler);

export default app;