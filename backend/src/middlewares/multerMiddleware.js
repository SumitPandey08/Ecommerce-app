import multer from 'multer';
import fs from 'fs'; // Import fs to ensure the directory exists

// Define the temporary directory for uploads
const tempUploadDir = './public/temp';

// Ensure the temporary directory exists
if (!fs.existsSync(tempUploadDir)) {
    fs.mkdirSync(tempUploadDir, { recursive: true });
}

// Configure storage for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Specify the directory where uploaded files will be stored temporarily
        cb(null, tempUploadDir);
    },
    filename: function (req, file, cb) {
        // Define how the file should be named to ensure uniqueness
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Initialize multer with the storage configuration
export const upload = multer({
    storage: storage,
    // Optional: Add file size limits
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit (example: adjust as needed)
    },
    // Optional: Filter file types
    fileFilter: (req, file, cb) => {
        // Allow only image files (JPEG, PNG, GIF)
        if (file.mimetype.startsWith('image/jpeg') ||
            file.mimetype.startsWith('image/png') ||
            file.mimetype.startsWith('image/gif')) {
            cb(null, true);
        } else {
            // Reject other file types
            cb(new Error('Only image files (JPEG, PNG, GIF) are allowed!'), false);
        }
    }
});
