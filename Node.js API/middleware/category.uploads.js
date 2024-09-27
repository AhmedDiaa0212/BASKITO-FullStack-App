const multer = require("multer"); // Importing multer for file upload handling
const path = require("path"); // Importing path to work with file paths

// Configuring storage options for multer
const storage = multer.diskStorage({
    // Setting the destination folder for uploaded files
    destination: function (req, file, cb) {
        cb(null, "./uploads/categories"); // Files will be saved in the 'uploads/categories' folder
    },
    // Setting the filename for the uploaded file
    filename: function (req, file, cb) {
        // Naming the file with the current timestamp followed by the original file name
        cb(null, Date.now() + "-" + file.originalname);
    },
});

// File filter to validate the file type and size
const fileFilter = (req, file, callback) => {
    const acceptableExt = [".png", ".jpg", ".jpeg"]; // Acceptable file extensions
    // Check if the file has one of the acceptable extensions
    if (!acceptableExt.includes(path.extname(file.originalname))) {
        return callback(new Error("Only .png .jpg .jpeg format allowed!")); // Reject if format is not allowed
    }

    const fileSize = parseInt(req.headers["content-length"]); // Get the file size from the request headers
    // Check if the file size exceeds 1MB (1048576 bytes)
    if (fileSize > 1048576) {
        return callback(new Error("File size is too large!")); // Reject if file is too large
    }

    callback(null, true); // Accept the file if it passes both checks
}

// Setting up multer with the defined storage and file filter
let upload = multer({
    storage: storage, // Using the defined storage configuration
    fileFilter: fileFilter, // Applying the file filter
    fileSize: 1048576, // Limiting the file size to 1MB
});

// Exporting the upload middleware to handle single file uploads for 'categoryImage'
module.exports = upload.single("categoryImage");
