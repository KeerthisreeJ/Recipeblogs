const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

const storage = multer.memoryStorage();
const upload = multer({ storage });

const handleImageUpload = async (req, res, next) => {
  if (!req.file) return next();

  try {
    if (process.env.CLOUDINARY_CLOUD_NAME) {
      const uploadPromise = new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'kittyeats' }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        });
        stream.end(req.file.buffer);
      });
      req.uploadedImageUrl = await uploadPromise;
      return next();
    } else {
      const filename = `recipe-${Date.now()}${path.extname(req.file.originalname) || '.jpg'}`;
      fs.writeFileSync(path.join(uploadDir, filename), req.file.buffer);
      req.uploadedImageUrl = `/uploads/${filename}`;
      return next();
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Image upload failed' });
  }
};

module.exports = { upload, handleImageUpload };
