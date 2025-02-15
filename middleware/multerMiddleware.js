// const multer = require('multer');
// const path = require('path');

// // Configure storage for uploaded images
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads/'); // Directory to store images
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// // File filter to allow only images
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const mimeType = allowedTypes.test(file.mimetype);
//   const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());

//   if (mimeType && extName) {
//     return cb(null, true);
//   }

//   cb(new Error('Only JPEG, JPG, and PNG files are allowed.'));
// };

// const upload = multer({ storage, fileFilter });
// module.exports = upload;


// const multer = require('multer');
// const path = require('path');

// // Multer storage configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/'); // Directory to save files
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
//     },
// });

// // Multer instance
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 2 * 1024 * 1024 }, // Limit file size to 2MB
// });

// // Middleware for multiple images
// const uploadMultiple = upload.array('images', 10); // Field name is 'images', max 10 files


// const multer = require('multer');
// const path = require('path');

// // Set up storage configuration for Multer
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Save the file to the 'uploads' folder
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid duplicate names
//     }
// });

// // Define the uploadMultiple middleware
// const uploadMultiple = multer({
//     storage: storage,
// }).array('images', 5); // 'images' should match the field name used in Postman

// const uploadSingle = multer({
//     storage: storage,
// }).single('image');

// module.exports = { uploadMultiple ,uploadSingle};


const multer = require('multer');
const path = require('path');

// Set up storage configuration for Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save the file to the 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to avoid duplicate names
    }
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpg|jpeg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed.'));
    }
};

// Define the uploadMultiple middleware
const uploadMultiple = multer({
    storage: storage,
    fileFilter: fileFilter, // Apply the file filter
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
}).array('images', 5); // 'images' should match the field name used in Postman

const uploadSingle = multer({
    storage: storage,
    fileFilter: fileFilter, // Apply the file filter
    limits: { fileSize: 10 * 1024 * 1024 }  // Limit file size to 5MB
}).single('image');

module.exports = { uploadMultiple, uploadSingle };
