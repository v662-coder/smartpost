import multer from "multer";
import fs from "fs";
import path from "path";

const uploadFile = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            const dir = path.join(process.cwd(), process.env.UPLOAD_DIRECTORY || "uploads", file.fieldname);
            // Ensure the destination directory exists so a fresh checkout doesn't 500 on first upload.
            fs.mkdirSync(dir, { recursive: true });
            cb(null, dir);
        },
        filename: function (req, file, cb) {
            const safeOriginalName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, "_");
            cb(null, `${Date.now()}-${safeOriginalName}`)
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: function (req, file, cb) {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (allowed.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG, or WEBP images are allowed"));
        }
    }
})

export default uploadFile