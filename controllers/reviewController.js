const Product=require('../models/ProductModel')
const Review=require('../models/reviewModel')

const moment = require('moment');
const mongoose = require('mongoose'); // Import mongoose
const { ObjectId } = mongoose.Types; // Extract ObjectId


const addReview = async (req, res) => {
    const { name, rating, comment } = req.body;
    const { productId } = req.params;
    const userId = req.user?.id; // Extract user ID from the token

    try {
        // Validate required fields
        if (!name || !rating || !comment || !productId) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required (name, rating, comment, productId).',
            });
        }

        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found.',
            });
        }

        // Create the review
        const newReview = await Review.create({
            user: userId,
            productId,
            name,
            rating: Number(rating),
            comment,
            createdAt: new Date(),
        });

        // Add the review to the product's reviews array
        product.reviews.push(newReview._id);

        // Recalculate product's average rating
        const reviews = await Review.find({ productId });
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

        product.averageRating = averageRating.toFixed(1);
        product.numReviews = reviews.length;

        await product.save();

        res.status(201).json({
            success: true,
            message: 'Review added successfully!',
            product,
        });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};



const getReviews = async (req, res) => {
    const { productId } = req.params;
    let { pageNo } = req.query;
    pageNo = parseInt(pageNo) || 1; // Default to page 1 if pageNo is not provided
    const limit = 5; // Number of reviews per page
    const skipPage = limit * (pageNo - 1);

    try {
        console.log("Fetching reviews for product ID:", productId);

        // Validate productId
        if (!ObjectId.isValid(productId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        // Aggregate to calculate the distribution of ratings
        let getRating = await Review.aggregate([
            {
                $match: {
                    productId: new ObjectId(productId),
                    rating: { $exists: true },
                },
            },
            {
                $group: {
                    _id: "$rating",
                    count: { $sum: 1 },
                },
            },
        ]);

        // Initialize default rating distribution
        let rating_review = [
            { rating: 5, sum: 0 },
            { rating: 4, sum: 0 },
            { rating: 3, sum: 0 },
            { rating: 2, sum: 0 },
            { rating: 1, sum: 0 },
        ];

        // Update the rating distribution with actual counts
        for (let i = 0; i < rating_review.length; i++) {
            for (let j = 0; j < getRating.length; j++) {
                if (rating_review[i].rating === getRating[j]._id) {
                    rating_review[i].sum = getRating[j].count;
                    break;
                }
            }
        }

        // Fetch all reviews for calculating total reviews
        const totalReviews = await Review.countDocuments({ productId });

        // Fetch paginated reviews
        const reviews = await Review
            .find({ productId })
            .populate("user", "name email")
            .skip(skipPage)
            .limit(limit)
            .sort({ createdAt: -1 });

        // Respond with the data
        res.status(200).json({
            success: true,
            reviews,
            totalReviews,
            rating_review,
            currentPage: pageNo,
            totalPages: Math.ceil(totalReviews / limit),
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch reviews",
            error: error.message,
        });
    }
};
module.exports = { addReview,getReviews };

