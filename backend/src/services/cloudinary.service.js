import { v2 as cloudinary } from "cloudinary";
import config from "../config/config.js";


// =============================================
// Cloudinary Configuration
// =============================================

cloudinary.config({

    cloud_name:
        config.CLOUDINARY_CLOUD_NAME,

    api_key:
        config.CLOUDINARY_API_KEY,

    api_secret:
        config.CLOUDINARY_API_SECRET,

});


// =============================================
// Upload File
// =============================================

const uploadFileToCloudinary = (
    buffer,
    options = {}
) => {

    return new Promise(
        (resolve, reject) => {

            const uploadStream =
                cloudinary.uploader.upload_stream(

                    options,

                    (error, result) => {

                        if (error) {

                            reject(error);

                            return;

                        }

                        resolve(result);

                    }

                );


            uploadStream.end(buffer);

        }
    );

};


// =============================================
// Delete File
// =============================================

const deleteFileFromCloudinary =
    async (publicId) => {

        if (!publicId) {
            return;
        }

        await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "raw",
            }
        );

    };



export {

    uploadFileToCloudinary,

    deleteFileFromCloudinary,

};