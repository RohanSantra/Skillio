import multer from "multer";

import ApiError from "../utils/ApiError.js";


// =============================================
// Multer Storage
// =============================================

const storage =
    multer.memoryStorage();


// =============================================
// Allowed Resume File Types
// =============================================

const allowedMimeTypes = [

    "application/pdf",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

];


// =============================================
// File Filter
// =============================================

const fileFilter = (
    req,
    file,
    callback
) => {

    if (
        !allowedMimeTypes.includes(
            file.mimetype
        )
    ) {

        return callback(
            new ApiError(
                400,
                "Only PDF and DOCX resume files are allowed."
            )
        );

    }


    callback(
        null,
        true
    );

};


// =============================================
// Upload Configuration
// =============================================

const resumeUpload = multer({

    storage,

    fileFilter,

    limits: {

        fileSize:
            5 * 1024 * 1024,

    },

});



export default resumeUpload;