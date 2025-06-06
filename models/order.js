const mongoose=require('mongoose')

const orderSchema=mongoose.Schema({
    orderId : {
        type : Schema.ObjectId,
        required : true
    },
    sellerId : {
        type : Schema.ObjectId,
        required : true
    },
    products : {
        type : Array,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    payment_status : {
        type : String,
        required : true
    },
    shippingInfo : {
        type : String,
        required : true
    },
    delivery_status : {
        type : String,
        required : true
    },
    date : {
        type : String,
        required : true
    },
},{timestamps:true})
const orderModel=mongoose.model('orders',orderSchema)
module.exports=orderModel