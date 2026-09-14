import express from "express";

import {
    uploadResume,
    createResume,
    getResumes,
    getResume,
    updateResume,
    setPrimaryResume,
    deleteResume,
    parseResume,
} from "../controllers/resume.controller.js";

import authenticate from "../middlewares/auth.middleware.js";
import resumeUpload from "../middlewares/resumeUpload.middleware.js";


const router = express.Router();


/**
 * @POST : /resume/upload
 *
 * @description :
 *
 * Uploads a PDF or DOCX resume,
 * extracts its text,
 * uploads the file to Cloudinary,
 * and creates the Resume document.
 *
 * @access : Private
 *
 */
router.post("/upload", authenticate, resumeUpload.single("resume"), uploadResume);


/**
 * @GET : /getAll-resume
 * @description :
 * Retrieves all resumes belonging to the authenticated user.
 * @access : Private
 */
router.get("/getAll-resume", authenticate, getResumes);

/**
 * @POST : /create-resume
 * @description :
 * Creates a new resume record for the authenticated user.
 *
 * The resume file information, extracted text, parsed data,
 * and ATS analysis can be stored in the resume record.
 * @access : Private
 */
router.post("/create-resume", authenticate, createResume);

/**
 * @GET : /:resumeId
 * @description :
 * Retrieves a specific resume belonging to the authenticated user.
 * @access : Private
 */
router.get("/:resumeId", authenticate, getResume);

/**
 * @PATCH : /:resumeId
 * @description :
 * Updates the information of a specific resume belonging
 * to the authenticated user.
 * @access : Private
 */
router.patch("/:resumeId", authenticate, updateResume);

/**
 * @PATCH : /:resumeId/primary
 * @description :
 * Sets the selected resume as the primary resume of the
 * authenticated user.
 *
 * Any previously primary resume is automatically changed
 * to non-primary.
 * @access : Private
 */
router.patch("/:resumeId/primary", authenticate, setPrimaryResume);

/**
 * @DELETE : /:resumeId
 * @description :
 * Deletes a specific resume belonging to the authenticated user.
 * @access : Private
 */
router.delete("/:resumeId", authenticate, deleteResume);

/**
 * @POST : /:resumeId/parse
 * @description :
 * Parse the resume file using ai and store in db.
 * @access : Private
 */
router.post("/:resumeId/parse", authenticate, parseResume);




export default router;