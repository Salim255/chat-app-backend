const multer = require('multer');
const path = require('path');
const AppError = require('../../utils/appError');
const crypto = require('crypto');
const sharp = require('sharp');

// To store the image in the local storage
/* const storageOptions = {
  destination: (req, file, cb) => {
    // The destination of the file
    const destPath = path.resolve(__dirname, '../../public/img/users');
    cb(null, destPath)
  },
  filename: (req, file, cb) => {
    // user+userid+time+file extension(jpeg)
    const extension = file.mimetype.split('/')[1];
    const uniqueSuffix = crypto.randomBytes(8).toString('hex');
    // Its the complete definition of who we want to save our file
    // cb(null, `user-${req?.user?.id}-${Date.now()}-${extension}`)
    cb(null, `user-${uniqueSuffix}-${Date.now()}.${extension}`);
  }
} */

// const multerStorage = multer.diskStorage(storageOptions);
const multerStorage = multer.memoryStorage();
// With memory storage, the image will be stored as a buffer

// The gaol of this function is to test if the uploaded file is an image
// Then we pass true in cb if all is good or we pass false to cb
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image!, Please upload only images.', 400), false);
  }
}

// Here we save the photo name locally
const upload = multer(
  {
    storage: multerStorage,
    fileFilter: multerFilter
  }
);

exports.uploadUserPhoto = upload.single('photo');

// Resize user photo
exports.resizeUserPhoto = (req, res, next) => {
  if (!req.file) return next();

  const uniqueSuffix = crypto.randomBytes(8).toString('hex');
  req.file.filename = `user-${uniqueSuffix}-${Date.now()}.jpeg`;

  // Here we get the image buffer (temp)
  sharp(req.file.buffer)
  // This sharp function will create an object on which
  // We can chain multiple methods
    .resize(500, 500)
    // Resize takes the width and the height
    // As we need square images, then the height need to be the same
    // as the width, so this resize will crop the image
    .toFormat('jpeg')
    // Convert the image to jpeg
    .jpeg({ quality: 90 })
    // .jpeg() to compress the image
    .toFile(path.resolve(__dirname, `../../public/img/users/${req.file.filename}`))
    // To Finally write the image into our disk if needed

  next();
}
