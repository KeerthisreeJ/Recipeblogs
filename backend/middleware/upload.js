const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

// Ensure local uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET &&
    process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name'
  );
};

if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Multer memory storage allows buffer inspection and dual upload path
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only images (jpeg, jpg, png, webp, gif) are allowed!'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

// Middleware to process uploaded file (either Cloudinary or local disk)
const handleImageUpload = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    if (isCloudinaryConfigured()) {
      // Upload via stream to Cloudinary
      const uploadStream = () => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'kittyeats',
              transformation: [{ width: 1400, height: 1000, crop: 'limit', quality: 'auto' }]
            },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          stream.end(req.file.buffer);
        });
      };

      const imageUrl = await uploadStream();
      req.uploadedImageUrl = imageUrl;
      return next();
    } else {
      // Local storage fallback
      const ext = path.extname(req.file.originalname) || '.jpg';
      const filename = `recipe-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
      const filePath = path.join(uploadDir, filename);

      fs.writeFileSync(filePath, req.file.buffer);
      // Accessible via static route /uploads/filename
      req.uploadedImageUrl = `/uploads/${filename}`;
      return next();
    }
  } catch (error) {
    console.error('[Image Upload Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process recipe image upload',
      error: error.message
    });
  }
};

module.exports = {
  upload,
  handleImageUpload
};
