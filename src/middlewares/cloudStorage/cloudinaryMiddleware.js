require('dotenv').config()
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret
});

exports.uploadImage = (req, res, next) => {
  cloudinary.uploader.upload(req.file.buffer, function (err, result) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Error'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Uploaded',
      data: result
    });
  });
}
