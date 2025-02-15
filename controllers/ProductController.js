const Product = require('../models/ProductModel'); // Assuming the schema is saved in this path

const mongoose=require('mongoose')
const Category=require('../models/categoryModel')
const Seller = require('../models/seller'); // Adjust the path based on your folder structure

const createProduct = async (req, res) => {
    try {
        const { name, category, description, stock, price, discount, shopName, brand } = req.body;

        // Ensure images are uploaded via Multer
        const files = req.files;
        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: 'Images are required' });
        }


        // Generate image paths from uploaded files
        // const images = files.map((file) => file.path);
        const images = files.map((file) => file.path.replace(/\\/g, '/'));
        // Create a slug for the product name
        const slug = name.trim().split(' ').join('-');

        // The sellerId should come from the JWT token (i.e., the authenticated user)
        const sellerId = req.user.id; // Extract sellerId from the authenticated user

        // Save product to the database
        const product = new Product({
            sellerId, // Assign the sellerId from JWT token
            name: name.trim(),
            slug,
            category: category.trim(),
            description: description.trim(),
            stock: parseInt(stock),
            price: parseInt(price),
            discount: parseInt(discount),
            shopName: shopName.trim(),
            brand: brand.trim(),
            images, // Array of image paths
        });

        await product.save();
        res.status(201).json({ success: true, message: 'Product added successfully!', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update Product
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
         // If images are uploaded, normalize the paths
         if (req.files && req.files.length > 0) {
            req.body.images = req.files.map(file => file.path.replace(/\\/g, '/'));
        }
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found!' });
        }
        res.status(200).json({ success: true, message: 'Product updated successfully!', updatedProduct });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        console.log(error);
        
    }
};

// Delete Product
const deleteProduct = async (req, res) => {
    try {
        let { id } = req.params;

        // Clean the ID to remove any unwanted characters like newline
        id = id.trim(); // Trims any surrounding whitespaces or newline characters

        // Check if the ID is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid product ID!' });
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ success: false, message: 'Product not found!' });
        }

        res.status(200).json({ success: true, message: 'Product deleted successfully!' });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
        console.log(error);
        
    }
};


// Get All Products
// Get All Products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name'); // Populate category with its name
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// Get Single Product
const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found!' });
        }
        res.status(200).json({ success: true, product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Search Products
const searchProducts = async (req, res) => {
    try {
        const { query } = req.query;
        const products = await Product.find({ $text: { $search: query } });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Filter Products by Price
const filterByPrice = async (req, res) => {
    try {
        const { min, max } = req.query;
        const products = await Product.find({ price: { $gte: min, $lte: max } });
        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Related Products
// const relatedProducts = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const product = await Product.findById(id);
//         if (!product) {
//             return res.status(404).json({ success: false, message: 'Product not found!' });
//         }
//         const related = await Product.find({
//             category: product.category,
//             _id: { $ne: product._id },
//         });
//         res.status(200).json({ success: true, related });
//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message });
//     }
// };

const relatedProducts = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Product ID:', id);  // Log the product ID
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found!' });
        }
        console.log('Product found:', product);  // Log the found product

        const related = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
        });
        console.log('Related products:', related);  // Log related products

        res.status(200).json({ success: true, related });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};




// Get Product Count
const productCount = async (req, res) => {
    try {
        const count = await Product.countDocuments();
        res.status(200).json({ success: true, count });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Product Category
// const productCategory = async (req, res) => {
//     try {
//         const { category } = req.query;
//         const products = await Product.find({ category });
//         res.status(200).json({ success: true, products });
//     } catch (error) {
//         res.status(400).json({ success: false, message: error.message });
//     }
// };





const productCategory = async (req, res) => {
    try {
        const { category } = req.query; // Category name passed in the query parameter

        // Find products where the category name matches the provided name
        const products = await Product.find({ "category.name": category });

        if (!products.length) {
            return res.status(404).json({ success: false, message: "No products found for this category" });
        }

        res.status(200).json({ success: true, products });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};


// find both category and products
// Global search for products and categories
const SearchCategoryandProducts = async (req, res) => {
    const query = req.query.query;
    try {
        const categories = await Category.find({ name: new RegExp(query, 'i') });
        const products = await Product.find({ name: new RegExp(query, 'i') });

        res.json({ categories, products });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};



// const getSearchedProductsandcategories = async (req, res) => {
//     try {
//         const { search, category } = req.query;

//         let query = {};

//         // Search by product name (case-insensitive)
//         if (search) {
//             query.name = { $regex: search, $options: "i" };
//         }

//         // If category is provided, find the category by slug and filter products by category
//         if (category) {
//             const categoryDoc = await Category.findOne({ slug: category });

//             if (!categoryDoc) {
//                 return res.status(404).json({ message: "Category not found" });
//             }

//             query.category = categoryDoc._id;  // Set the category filter by category _id
//         }

//         // Search for products based on the query
//         const products = await Product.find(query)
//             .populate('category', 'name slug')  // Populate category details
//             .populate('sellerId', 'name email role shopInfo');  // Populate seller details

//         res.json(products);
//     } catch (error) {
//         console.error(error);  // Log the error for easier debugging
//         res.status(500).json({ message: "Server Error", error });
//     }
// };


const getSearchedProductsandcategories = async (req, res) => {
    try {
        const { search, category } = req.query;

        let query = {};

        // Search by product name (case-insensitive)
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }

        // If category is provided, find the category by slug and filter products by category
        if (category) {
            const categoryDoc = await Category.findOne({ slug: category });

            if (!categoryDoc) {
                return res.status(404).json({ message: "Category not found" });
            }

            query.category = categoryDoc._id;  // Set the category filter by category _id
        }

        // Search for products based on the query
        const products = await Product.find(query)
            .populate('category', 'name slug')  // Populate category details
            .populate('sellerId', 'name email role shopInfo');  // Populate seller details

        res.json({ products, categories: [] });  // Return only products, no need to send categories here
    } catch (error) {
        console.error(error);  // Log the error for easier debugging
        res.status(500).json({ message: "Server Error", error });
    }
};
module.exports = {
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
    getSearchedProductsandcategories
};
