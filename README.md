# Skillio

Skillio is an AI-powered career development workspace for turning a job search into an organized, measurable preparation workflow. Users can build a reusable career profile, upload and manage resumes, analyze job descriptions, compare their profile against a role, generate preparation plans, practice interviews, chat with an AI career coach, and track applications from one place.

The repository contains two independently runnable applications:

- `frontend`: React 19 single-page application built with Vite.
- `backend`: Express API backed by MongoDB.

## Contents

- [What Skillio does](#what-skillio-does)
- [How the application works](#how-the-application-works)
- [Architecture](#architecture)
- [Technology](#technology)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local development](#local-development)
- [Environment variables](#environment-variables)
- [Available commands](#available-commands)
- [Frontend routes](#frontend-routes)
- [API overview](#api-overview)
- [Authentication and data flow](#authentication-and-data-flow)
- [AI and file-processing pipeline](#ai-and-file-processing-pipeline)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Development guidelines](#development-guidelines)
- [Security notes](#security-notes)

## What Skillio does

### Career profile

The career profile is the user's structured source of truth. It stores a headline, summary, skills, experience, projects, education, and certifications. The profile can be reused by job matching, resume analysis, preparation plans, and the career coach.

### Resume management

Users can upload PDF, DOC, and DOCX resumes, store them in Cloudinary, extract their text, and retain parsed resume data. A user can maintain multiple resumes and mark one as primary. Resume data is kept separate from job-specific ATS analysis so the same resume can be evaluated against multiple roles.

### Job workspaces

A job workspace represents one opportunity and contains the company, role, job description, source, and status. A workspace can hold:

- AI-generated job analysis, including responsibilities, required skills, preferred skills, experience, education, and keywords.
- Profile-to-job matching, including a score, matched skills, missing skills, and strengths.
- Skill gaps with importance, rationale, and recommendations.
- Resume ATS analysis for a selected resume.

### Preparation plans

Preparation plans are associated with a job workspace. They contain an overview and actionable tasks categorized as technical, resume, behavioral, system design, company, or other. Tasks have priorities, estimated time, due dates, completion state, and the plan maintains an overall progress percentage.

### AI interview practice

Users can create interview sessions for a job workspace with technical, resume, job-description, behavioral, or mock interview types and an easy, medium, or hard difficulty. Gemini can generate questions, evaluate answers, and produce a final report with an overall assessment, strengths, weaknesses, recommendations, and category scores.

### Career coach

The career coach supports both general conversations and job-specific conversations. Conversations are stored with user and assistant messages, and may be linked to a job workspace for more contextual guidance.

### Application tracking

Applications are linked to job workspaces and can move through `saved`, `applied`, `interview`, `offer`, and `rejected` states. Each application can include an applied date and notes.

### Account management

The application supports:

- Email/password registration and login.
- Email verification.
- Google sign-in.
- Forgot-password and reset-password flows.
- Access-token refresh and logout.
- Change-password and profile updates, including an avatar upload.

## How the application works

The typical user flow is:

1. Register with email/password or sign in with Google.
2. Verify the email address when using email/password authentication.
3. Complete the career profile or import profile information from an uploaded resume.
4. Upload or create a resume.
5. Create a job workspace and add the role's job description.
6. Run job analysis, profile matching, skill-gap analysis, and resume ATS analysis as needed.
7. Generate a preparation plan for the job workspace.
8. Practice with AI interview sessions and review the final report.
9. Ask the career coach for general or job-specific guidance.
10. Track the application status and notes.

## Architecture

```text
┌──────────────────────────┐
│ React + Vite frontend    │
│ React Router + Zustand   │
└────────────┬─────────────┘
             │ Axios / JSON / multipart
             │ cookies + Bearer access token
┌────────────▼─────────────┐
│ Express API              │
│ routes → controllers     │
│ middleware → services    │
└───────┬─────────┬────────┘
        │         │
        │         ├───────────────┐
        │         │               │
┌───────▼──────┐  ┌──────────────▼─────────────┐
│ MongoDB      │  │ External services          │
│ Mongoose     │  │ Gemini, Cloudinary, Gmail  │
└──────────────┘  └────────────────────────────┘
```

The backend starts by loading and validating environment variables, connecting to MongoDB, and then listening on the configured port. Requests pass through Express middleware, route-level authentication where required, controllers, and service/model layers. The global error middleware converts application errors into API responses.

The frontend is organized by feature. Each feature generally contains its pages, hooks, API service, and Zustand store. The shared Axios client sends credentials, attaches the in-memory access token, refreshes expired access tokens, queues concurrent failed requests during refresh, and clears authentication state when refresh fails.

## Technology

### Frontend

- React 19
- Vite
- React Router
- Zustand
- Axios
- Tailwind CSS via the Vite plugin
- Framer Motion
- Recharts
- Lucide React
- Sonner
- Google OAuth React client

### Backend

- Node.js with ES modules
- Express 5
- MongoDB with Mongoose
- JWT and bcrypt authentication
- Zod response validation
- Google Gemini API
- Cloudinary
- Multer
- PDF Parse and Mammoth for resume text extraction
- Nodemailer with Gmail OAuth2

## Project structure

```text
.
├── frontend/
│   ├── src/
│   │   ├── app/                 # App bootstrap, providers, and route tree
│   │   ├── components/          # Shared layout, branding, and feedback UI
│   │   ├── features/
│   │   │   ├── application/
│   │   │   ├── auth/
│   │   │   ├── career-coach/
│   │   │   ├── career-profile/
│   │   │   ├── dashboard/
│   │   │   ├── interview/
│   │   │   ├── job-workspace/
│   │   │   ├── preparation/
│   │   │   └── resume/
│   │   ├── lib/                 # Shared Axios API client
│   │   └── styles/
│   ├── package.json
│   └── vercel.json
├── backend/
│   ├── src/
│   │   ├── config/              # Environment validation and configuration
│   │   ├── controllers/         # Request handlers
│   │   ├── db/                  # MongoDB connection
│   │   ├── middlewares/         # Auth, uploads, and errors
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # Versioned API route definitions
│   │   ├── services/            # AI, email, storage, and extraction logic
│   │   └── utils/               # Tokens, passwords, responses, and errors
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 20 or a current LTS release.
- npm.
- A MongoDB database, local or hosted.
- A Google Cloud OAuth client for Google sign-in and Gmail OAuth2 email delivery.
- A Gemini API key.
- A Cloudinary account.

The API currently expects all backend configuration values to be present at startup. Missing required values cause the process to fail fast rather than starting with an incomplete configuration.

## Local development

### 1. Clone and install dependencies

```bash
git clone https://github.com/RohanSantra/Skillio.git
cd Skillio

cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure the backend

Create `backend/.env` using the template below and replace every placeholder with a real value.

```dotenv
PORT=3000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=mongodb://127.0.0.1:27017/skillio

ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
REFRESH_TOKEN_SECRET=replace-with-another-long-random-secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GOOGLE_REFRESH_TOKEN=your-gmail-oauth-refresh-token
GOOGLE_USER=your-gmail-address
EMAIL_USER=your-gmail-address

GEMINI_API_KEY=your-gemini-api-key

CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

`EMAIL_USER` is used as the sender address by the email service. It is not currently validated in `backend/src/config/config.js`, but it should still be configured for verification and password-reset email delivery.

### 3. Configure the frontend

Create `frontend/.env`:

```dotenv
VITE_API_URL=http://localhost:3000/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

Only values prefixed with `VITE_` are exposed to the browser. Never put private API keys, JWT secrets, Cloudinary secrets, or Gmail refresh tokens in the frontend environment.

### 4. Start both applications

From one terminal:

```bash
cd backend
npm run dev
```

From another terminal:

```bash
cd frontend
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

For a production-style local run:

```bash
cd backend
npm start

cd ../frontend
npm run build
npm run preview
```

## Environment variables

### Backend

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | Yes | Express listening port. |
| `NODE_ENV` | Recommended | Controls production cookie behavior. |
| `CLIENT_URL` | Yes | Allowed CORS origin and base URL for email links. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `ACCESS_TOKEN_SECRET` | Yes | Signs short-lived access JWTs. |
| `REFRESH_TOKEN_SECRET` | Yes | Signs refresh JWTs. |
| `ACCESS_TOKEN_EXPIRES_IN` | No | Access token lifetime; defaults to `15m`. |
| `REFRESH_TOKEN_EXPIRES_IN` | No | Refresh token lifetime; defaults to `7d`. |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth and Gmail OAuth2 client ID. |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth and Gmail OAuth2 client secret. |
| `GOOGLE_REFRESH_TOKEN` | Yes | Gmail OAuth2 refresh token for sending email. |
| `GOOGLE_USER` | Yes | Gmail account used by Nodemailer. |
| `EMAIL_USER` | Recommended | Sender address used in outgoing email headers. |
| `GEMINI_API_KEY` | Yes | Gemini API access. |
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary storage account. |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API access. |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API access. |

### Frontend

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Backend base URL, including `/api/v1`. |
| `VITE_GOOGLE_CLIENT_ID` | Yes for Google sign-in | Google OAuth client ID used by the browser. |

## Available commands

### Frontend

Run these from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development server with hot reload. |
| `npm run build` | Create the production frontend bundle. |
| `npm run preview` | Serve the production bundle locally. |
| `npm run lint` | Run ESLint. |

### Backend

Run these from `backend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the API with Nodemon. |
| `npm start` | Start the API with Node. |
| `npm test` | Currently exits with a placeholder “no test specified” error; automated backend tests have not been added yet. |

## Frontend routes

### Public routes

- `/` - Landing page.
- `/login` - Sign in.
- `/register` - Create an account.
- `/forgot-password` - Request a password reset.
- `/reset-password/:token` - Set a new password.
- `/verify-email` and `/verify-email/:token` - Verify an email address.

### Protected routes

- `/dashboard` - Career workspace overview.
- `/career-profile` - Manage the reusable career profile.
- `/resumes`, `/resumes/create`, `/resumes/:resumeId` - List, create, and inspect resumes.
- `/job-workspaces`, `/job-workspaces/:jobId` - Manage opportunities and job intelligence.
- `/preparation`, `/preparation-plans/:planId` - Manage preparation plans.
- `/interviews`, `/interviews/:sessionId` - Practice interviews and review sessions.
- `/career-coach` - Chat with the AI career coach.
- `/applications` - Track job applications.
- `/settings` and `/settings/change-password` - Manage account settings.

`ProtectedRoute` guards the authenticated application, while `PublicOnlyRoute` prevents authenticated users from returning to public authentication pages.

## API overview

All API routes are prefixed with `/api/v1`. Protected routes require `Authorization: Bearer <access-token>` and the refresh flow uses an HTTP-only cookie.

| Resource | Base path | Main capabilities |
| --- | --- | --- |
| Auth | `/auth` | Register, login, Google login, verify email, refresh, logout, password reset, profile. |
| Career profile | `/career-profile` | Read, create, update, delete, import from resume, and manage skills, experience, projects, education, and certifications. |
| Resumes | `/resume` | Upload, list, create, read, update, set primary, delete, and parse resumes. |
| Job workspaces | `/job-workspaces` | CRUD, status updates, job analysis, matching, skill gaps, and resume ATS analysis. |
| Preparation plans | `/preparation-plan` | CRUD, generate a plan, and manage tasks. |
| Interview sessions | `/interview-session` | CRUD, generate questions, evaluate answers, and complete sessions. |
| Career coach | `/coach-conversation` | CRUD conversations, manage messages, and send coach messages. |
| Applications | `/application` | CRUD application records and status tracking. |

The exact request validation and response shapes live in the corresponding route, controller, model, and frontend API service files. When adding an endpoint, update both sides of the feature where appropriate.

## Authentication and data flow

1. The user logs in through the frontend.
2. The backend returns an access token and manages the refresh token through a cookie-backed session flow.
3. Zustand stores the current access token in the browser runtime.
4. The shared Axios request interceptor adds the access token to protected requests.
5. When a protected request receives a `401`, the Axios response interceptor makes one shared refresh request.
6. Concurrent requests wait in a queue and retry with the new access token after refresh succeeds.
7. If refresh fails, the client clears authentication state and rejects the pending requests.
8. The backend `authenticate` middleware verifies the access token and attaches `userId` to `req.user`.

The backend uses user-scoped MongoDB records. Feature controllers should continue to filter reads and writes by the authenticated user ID so one user's career data cannot be accessed by another user.

## AI and file-processing pipeline

### Gemini

AI operations are implemented in `backend/src/services/ai/`. Prompt files define feature-specific instructions and Zod schemas define the expected structured output. The Gemini service requests JSON, parses the response, and validates it with the same schema before returning data to a controller.

This pattern is used for job analysis, job matching, skill-gap analysis, ATS analysis, resume parsing, preparation plans, interview questions, interview feedback, interview reports, and career-coach responses.

### Resumes and avatars

1. Multer receives the uploaded file in memory.
2. Resume text extraction uses PDF Parse or Mammoth depending on file type.
3. The original file is uploaded to Cloudinary.
4. MongoDB stores the Cloudinary URL, public ID, metadata, extracted text, and parsed data.
5. The public ID is used when a stored file must be deleted.

Keep upload size and file-type validation aligned between the frontend and the backend upload middleware.

## Deployment

### Frontend on Vercel

The frontend includes `frontend/vercel.json`, which rewrites all paths to `/` so client-side React Router routes work when refreshed. Configure these Vercel environment variables:

```dotenv
VITE_API_URL=https://your-api-domain.example/api/v1
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

Build command: `npm run build`  
Output directory: `dist`  
Root directory: `frontend`

### Backend

Deploy the `backend` directory to a Node.js host that supports long-running Express processes. Configure every backend environment variable in the host's secret/environment configuration, set `NODE_ENV=production`, and set `CLIENT_URL` to the deployed frontend origin.

Also update:

- Google OAuth authorized JavaScript origins and redirect settings.
- Cloudinary credentials and upload configuration.
- Gmail OAuth2 credentials and sender account.
- MongoDB network access rules.
- Frontend `VITE_API_URL` to the deployed API URL.

Because the API uses credentials and cookies, the frontend origin, CORS configuration, cookie security settings, and HTTPS deployment must be consistent.

## Troubleshooting

### API exits immediately

Check that every required backend variable in [Environment variables](#environment-variables) is present. The configuration module intentionally throws when required values are missing.

### Browser reports a CORS or credential error

Confirm that:

- `backend.CLIENT_URL` exactly matches the frontend origin.
- `frontend.VITE_API_URL` points to the API including `/api/v1`.
- The browser is using the same protocol expected by the deployed API.
- Requests are sent with credentials enabled.

### Verification or password-reset email is not delivered

Check the Gmail OAuth2 client, refresh token, `GOOGLE_USER`, and `EMAIL_USER`. Review the backend logs emitted by Nodemailer during transporter verification and message sending.

### AI features fail

Confirm `GEMINI_API_KEY` is valid and that the configured model is available to the account. Inspect the backend response and logs for an empty, invalid, or schema-incompatible Gemini response.

### Resume uploads fail

Check Cloudinary credentials, accepted file type, upload middleware limits, and whether the file can be parsed by PDF Parse or Mammoth.

### A refreshed frontend route returns a 404 in production

Verify that the deployment is using `frontend/vercel.json` or an equivalent SPA fallback rewrite.

## Development guidelines

- Keep feature-specific frontend code inside its feature directory.
- Keep API route registration in `backend/src/app.js` and route handlers in the matching route/controller files.
- Reuse the shared Axios instance instead of creating ad-hoc clients in feature components.
- Add new persisted data as a Mongoose model with explicit user ownership where applicable.
- Use the existing `ApiError`, `ApiResponse`, and `asyncHandler` utilities for consistent API behavior.
- Validate AI output against a Zod schema before storing or returning it.
- Never commit `.env` files, OAuth secrets, JWT secrets, API keys, or uploaded user data.
- Run `npm run lint` and `npm run build` from `frontend/` before submitting frontend changes.
- Add backend tests before relying on `npm test`; the current script is only a placeholder.

## Security notes

- Keep all private credentials on the backend.
- Use long, random, independent values for access and refresh token secrets.
- Use HTTPS in production so secure cookies and credentials are protected in transit.
- Restrict CORS to the deployed frontend origin rather than using a wildcard.
- Treat resumes, career profiles, job descriptions, AI prompts, and AI responses as user data.
- Rotate credentials immediately if an API key, OAuth token, or secret is exposed.
- Review provider retention and privacy policies before using production user data with Gemini, Cloudinary, MongoDB, or Gmail.

## License

The backend package currently declares the ISC license. Confirm the intended repository-wide license before publishing or redistributing the complete project.
