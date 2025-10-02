const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
