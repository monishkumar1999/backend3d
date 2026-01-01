import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";

const designUpload = multer({
    storage: multerS3({
        s3,
        bucket: process.env.AWS_BUCKET,
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            const name = file.originalname.replace(/\s+/g, "_");
            // Save to users_stickers folder as requested
            cb(null, `users_stickers/${Date.now()}-${name}`);
        },
    }),
});

export default designUpload;
