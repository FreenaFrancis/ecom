const { Schema, model } = require('mongoose')

const cartSchema = new Schema({
    userId : {
        type : Schema.ObjectId,
        ref:'customers',
        required : true
    },
    productId : {
        type : Schema.ObjectId,
        ref:"products",
        required : true
    },
    quantity : {
        type : Number,
        required : true
    }
},{timestamps : true})

module.exports = model('cartProducts',cartSchema)