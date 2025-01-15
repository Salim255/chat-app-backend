// npm install aws-sdk
require('dotenv').config();
const AWS = require('aws-sdk');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION // Choose the region of your S3 bucket
});

exports.uploadToS3Bucket = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError('No file uploaded.', 400));
  }

  // Create an S3 service object
  const s3 = new AWS.S3();

  // uploadParams to Upload file into your S3 bucket
  const uploadParams = {
    Bucket: 'intimacy-s3', // S3 bucket name
    Key: `users/${req.file.filename}`, // The name of the file in S3
    Body: req.file.buffer // The file content (could also be a buffer or stream)
  };

  // Upload to S3
  const data = await s3.upload(uploadParams).promise();

  console.log('====================================');
  console.log('Hello from aws', data);
  console.log('====================================');
  next();
})
