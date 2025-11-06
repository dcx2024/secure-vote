const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Configure AWS SDK v3 S3 client
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Use Multer’s in-memory storage (files stay in memory until uploaded)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image uploads are allowed!'), false);
    }
    cb(null, true);
  },
});

// Helper to upload a file buffer to S3
const uploadToS3 = async (file) => {
  const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `uploads/${fileName}`,
    Body: file.buffer,
    ContentType: file.mimetype,
     // remove this line if you want private uploads
  };

  await s3.send(new PutObjectCommand(params));

  // Return the public S3 file URL
  return `https://${process.env.S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/uploads/${fileName}`;
};

module.exports = { upload, uploadToS3 };
