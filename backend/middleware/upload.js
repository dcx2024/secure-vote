const multer = require('multer');
const path = require('path');
const fs = require('fs');
const AWS=require('aws-sdk')

// Ensure upload directory exists
const uploadPath = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Sanitize original file name
    const safeName = file.originalname
      .replace(/\s+/g, '-')              // Replace spaces with dashes
      .replace(/[^a-zA-Z0-9.-]/g, '');  // Remove unsafe chars
    const ext = path.extname(safeName);
    const baseName = path.basename(safeName, ext);
    cb(null, `${Date.now()}-${baseName}${ext}`);
  }
});

// Initialize upload middleware
const upload = multer({ storage });

module.exports = upload;

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
})

const s3= new AWS.S3();

