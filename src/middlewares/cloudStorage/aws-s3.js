// npm install @aws-sdk/client-s3
require('dotenv').config();
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Create an S3 service object
const s3 = new S3Client({
  region: process.env.REGION, // Choose the region of your S3 bucket
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

exports.uploadToS3Bucket = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError('No file uploaded.', 400));
  }

  // uploadParams to Upload file into your S3 bucket
  const uploadParams = {
    Bucket: 'intimacy-s3', // S3 bucket name
    Key: `users/${req.file.filename}`, // The name of the file in S3
    Body: req.file.buffer, // The file content (could also be a buffer or stream)
    ContentType: req.file.mimetype,
    ACL: 'public-read'
  };

  // Create a new instance of PutObjectCommand
  const command = new PutObjectCommand(uploadParams)

  // Upload to S3
  await s3.send(command)

  next();
})
