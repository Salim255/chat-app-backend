const multer = require('multer');
const path = require('path');
const AppError = require('../../utils/appError')
const crypto = require('crypto');

// Here we save the photo name locally
/* const upload = multer({
  dest: path.join(__dirname, '../../public/img/users')
});
 */
// To store the image in the local storage
const storageOptions = {
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
}

const multerStorage = multer.diskStorage(storageOptions);

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

const uploadUserPhoto = upload.single('photo');

module.exports = uploadUserPhoto
