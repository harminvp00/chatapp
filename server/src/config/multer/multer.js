
import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";

// get avatar path 
const avatarPath = path.resolve("storage/avatar");

// verify that the path exists
if (!fs.existsSync(avatarPath)) {
  fs.mkdirSync(avatarPath, { recursive: true });
}

// setup for destination, filename 
const storage = multer.diskStorage({

  // destination folder path 
  destination: (req, file, cb) => {
    cb(null, avatarPath);
  },

  // file name 
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const filename = `${crypto.randomUUID()}${extension}`;
    cb(null, filename);
  },
});

// filter for the file 
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and Webp image types allowed"));
  }
};


const upload = multer({
    storage,
    fileFilter,
    limits:{
        fileSize: 2 * 1024 * 1024,
    }
});

export default upload;