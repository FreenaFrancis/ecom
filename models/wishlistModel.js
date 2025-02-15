// const { Schema, model } = require('mongoose')

// const wishlistSchema = new Schema({
//     userId: {
//         type: String,
        
//         ref:'Customer',
//         required: true
//     },
//     productId: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     slug: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     discount: {
//         type: Number,
//         required: true
//     },
//     image: {
//         type: String,
//         required: true
//     },
//     rating: {
//         type: Number,
//         default: 0
//     }
// }, { timestamps: true })

// module.exports = model('wishlists', wishlistSchema)
const mongoose = require('mongoose');
const { Schema, model } = mongoose;  // Correctly import Schema and model

const wishlistSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer', // Ensure this matches the model name for the 'Customer' collection
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

module.exports = model('Wishlist', wishlistSchema);
