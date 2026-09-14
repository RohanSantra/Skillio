import { v2 as cloudinary } from "cloudinary";
import fs from "fs/promises";

import config from "../config/config.js";

cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
});


// ============================================================
// UPLOAD TO CLOUDINARY
// ============================================================

export const uploadOnCloudinary = async (file) => {
    if (!file) {
        return null;
    }

    try {
        const response = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
        });

        return response;

    } catch (error) {

        console.error(
            "Failed to upload data on Cloudinary:",
            error
        );

        return null;

    } finally {

        // ========================================================
        // ALWAYS DELETE LOCAL TEMPORARY FILE
        //
        // Runs whether Cloudinary upload succeeds OR fails.
        // ========================================================

        try {
            await fs.unlink(file);

        } catch (deleteError) {

            // File may already have been deleted or may not exist.
            console.error(
                "Failed to delete local temporary file:",
                deleteError.message
            );
        }
    }
};


// ============================================================
// DELETE IMAGE FROM CLOUDINARY
// ============================================================

export const deleteOnCloudinary = async (imageURL) => {
    try {
        if (!imageURL) {
            return null;
        }

        const publicId = imageURL
            .split("/")
            .pop()
            .split(".")[0];

        const response =
            await cloudinary.uploader.destroy(publicId);

        return response;

    } catch (error) {

        console.error(
            "Failed to delete data on Cloudinary:",
            error
        );

        return null;
    }
};