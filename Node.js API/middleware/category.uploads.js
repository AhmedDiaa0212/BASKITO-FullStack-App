const { model } = require("mongoose");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads/categories");
    },
    filename: function (req, file, cb) {
        cb(null, Data.now() + "-" + file.originalname);
    },
});

const fileFilter = (req, file, callback) => {
    const acceptableExt = [".png", ".jpg", ".jpeg"];
    if (!acceptableExt.includes(path.extname(file.originalname))) {
        return callback(new Error("Only .png .jpg .jpeg format allowed!"));
    }

    const fileSize = parseInt(req.headers["content-length"]);
    if (fileSize > 1048576) {
        return callback(new Error("File size is too large!"));
    }

    callback(null, true);
}

let upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    fileSize: 1048576,
});

model.exports = upload.single("categoryImage")