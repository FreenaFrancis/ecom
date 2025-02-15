// const { Schema, model } = require('mongoose')

// const productSchema = new Schema({
//     sellerId: {
//         type: Schema.ObjectId,
//         ref:'sellers',
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
//     category: {
//         type: Schema.ObjectId,
//         ref: 'categorys',
//         required: true
//     },
//     brand: {
//         type: String,
//         required: true
//     },
//     price: {
//         type: Number,
//         required: true
//     },
//     stock: {
//         type: Number,
//         required: true
//     },
//     discount: {
//         type: Number,
//         required: true
//     },

//     description: {
//         type: String,
//         required: true
//     },
//     shopName: {
//         type: String,
//         required: true
//     },
//     images: {
//         type: Array,
//         required: true
//     },
//     rating: {
//         type: Number,
//         default: 0
//     }
// }, { timestamps: true })

// productSchema.index({
//     name: 'text',
//     category: 'text',
//     brand: 'text',
//     description: 'text'
// }, {
//     weights: {
//         name: 5,
//         category: 4,
//         brand: 3,
//         description: 2
//     }
// })

// module.exports = model('products', productSchema)

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the product schema
const productSchema = new Schema({
    sellerId: {
        type: Schema.Types.ObjectId, 
        ref: 'Seller',
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
    category: {
        type: Schema.Types.ObjectId,
        ref: 'categorys',
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    shopName: {
        type: String,
        required: true
    },
    images: {
        type: [String],
        required: true
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reviews' }],
    numReviews: {
        type: Number,
        default: 0,
    },
    averageRating: {
        type: Number,
        default: 0,
    },

}, { timestamps: true });

// Full-text indexing
productSchema.index({
    name: 'text',
    category: 'text',
    brand: 'text',
    description: 'text'
}, {
    weights: {
        name: 5,
        category: 4,
        brand: 3,
        description: 2
    }
});

// Check if the model exists before defining it
module.exports = mongoose.models.products || model('products', productSchema);
