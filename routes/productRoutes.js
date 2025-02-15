const express = require('express');
const router = express.Router();
const {
    createProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getSingleProduct,
    searchProducts,
    filterByPrice,
    relatedProducts,
    productCount,
    productCategory,
    SearchCategoryandProducts,
    getSearchedProductsandcategories,
} = require('../controllers/ProductController');
const { uploadMultiple } = require('../middleware/multerMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

const  verifyToken = require('../middleware/authMiddleware');

// Create Product with image upload
router.post(
    '/createproduct',
    verifyToken,       // Verify token should be applied first
    uploadMultiple,    // Handle file uploads after token verification
    authorizeRoles('admin', 'seller'),  // Check roles
    createProduct      // Then execute the controller
);


// Update Product with optional image upload
router.put('/updateproduct/:id',verifyToken, uploadMultiple, authorizeRoles("admin","seller"),updateProduct,);

// Delete Product
router.delete('/deleteproduct/:id', verifyToken,authorizeRoles("admin","seller"), deleteProduct);

// Get All Products
router.get('/allproducts', getProducts);

// Get Single Product by ID
router.get('/getsingleproduct/:id', getSingleProduct);

// Search Products
router.get('/search', searchProducts);

// Filter Products by Price
router.get('/filter/price', filterByPrice);

// Get Related Products
router.get('/related/:id', relatedProducts);

// Get Product Count
router.get('/count', productCount);

// Get Products by Category
router.get('/category', productCategory);
router.get('/searchproductandcategotory',SearchCategoryandProducts)

// demo search by category and product name
router.get('/searches',getSearchedProductsandcategories)
module.exports = router;
