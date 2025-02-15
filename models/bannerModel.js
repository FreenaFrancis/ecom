const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Define the banner schema
const bannerSchema = new Schema({
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'products',  // Ensure 'products' model exists
        required: true,
    },
    banner: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Prevent overwriting model if it's already compiled
module.exports = mongoose.models.banners || model('banners', bannerSchema);




// const mongoose=require('mongoose')
// const bannerSchema=mongoose.Schema({
//     productId : {
//         type : Schema.ObjectId,
//         ref:"products",
//         required : true
//     },
//     banner:{type:String,
//         required:true
//     },
//     link:{type:String,
//         required:true
//     }
// })

// module.exports=mongoose.model('banners',bannerSchema)