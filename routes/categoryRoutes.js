const express = require('express');
const router = express.Router();
const { uploadMultiple } = require('../middleware/multerMiddleware'); // Adjust the path as needed
const { createCategory, updateCategory, deleteCategory, getCategoryById, getCategory,singleCategoryController } = require('../controllers/categorycontroller');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

// POST route to create category with multiple images
router.post('/categories', (req, res, next) => {
    uploadMultiple(req, res, (err) => {
        if (err) {
            console.error('Multer Error:', err.message);
            return res.status(400).json({ error: err.message });
        }
        next(); // Move to the createCategory function
    });
}, createCategory,verifyToken,authorizeRoles('admin'));

// PUT route to update category with multiple images
router.put('/updateCategory/:id', verifyToken, uploadMultiple, updateCategory); // No need to use .array(), just use the middleware

// DELETE route to remove category
router.delete('/deleteCategory/:id', verifyToken, deleteCategory);

// GET route to fetch category by ID
router.get('/getcategorybyid/:id', getCategoryById);
router.get('/getcategories',getCategory)
router.get('/single-category/:slug',singleCategoryController)

module.exports = router;
