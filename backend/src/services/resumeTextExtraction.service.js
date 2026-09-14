import { PDFParse } from "pdf-parse";

import mammoth from "mammoth";

import ApiError from "../utils/ApiError.js";


// =====================================================
// Extract Text From PDF
// =====================================================

const extractTextFromPDF = async (buffer) => {

    let parser;

    try {

        parser = new PDFParse({
            data: buffer,
        });


        const result =
            await parser.getText();


        return result?.text?.trim() || "";

    } finally {

        if (parser) {

            await parser.destroy();

        }

    }

};


// =====================================================
// Extract Text From DOCX
// =====================================================

const extractTextFromDOCX = async (buffer) => {

    const result =
        await mammoth.extractRawText({
            buffer,
        });


    return result?.value?.trim() || "";

};


// =====================================================
// Extract Resume Text
// =====================================================

const extractResumeText = async (file) => {

    // -------------------------------------------------
    // Validate File
    // -------------------------------------------------

    if (!file) {

        throw new ApiError(
            400,
            "Resume file is required."
        );

    }


    let extractedText = "";


    // =================================================
    // PDF
    // =================================================

    if (
        file.mimetype ===
        "application/pdf"
    ) {

        extractedText =
            await extractTextFromPDF(
                file.buffer
            );

    }


    // =================================================
    // DOCX
    // =================================================

    else if (

        file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    ) {

        extractedText =
            await extractTextFromDOCX(
                file.buffer
            );

    }


    // =================================================
    // Unsupported File
    // =================================================

    else {

        throw new ApiError(
            400,
            "Unsupported resume file format. Please upload a PDF or DOCX file."
        );

    }


    // =================================================
    // Validate Extracted Text
    // =================================================

    if (!extractedText) {

        throw new ApiError(
            400,
            "Could not extract text from this resume. Please make sure the file contains selectable text."
        );

    }


    return extractedText;

};


export {
    extractResumeText,
};