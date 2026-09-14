import multer from "multer";
import path from "path";
import fs from "fs";


const uploadDirectory =
    path.resolve("public/temp");


if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(
        uploadDirectory,
        {
            recursive: true,
        }
    );
}


const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },

    filename: function (req, file, cb) {

        const extension =
            path.extname(file.originalname);

        const filename =
            `${Date.now()}-${Math.round(
                Math.random() * 1e9
            )}${extension}`;

        cb(null, filename);
    },

});


const fileFilter = (
    req,
    file,
    cb
) => {

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (
        allowedTypes.includes(
            file.mimetype
        )
    ) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Only JPG, PNG and WebP images are allowed."
            ),
            false
        );
    }
};


const upload = multer({
    storage,
    fileFilter,

    limits: {
        fileSize: 5 * 1024 * 1024,
    },
});


export default upload;