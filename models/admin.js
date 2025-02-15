// const mongoose=require('mongoose')

// const adminSchema=new mongoose.Schema({
//     name:{type:String,
//         required:true
//     },
//     email:{type:String,
//         required:true,
//         unique:true
//     },
//     password:{
//         type:String,
//         required:true
//     },
//     image:{
// type:String,

//     },
//     role:
//     {
//         type:String,
//         required:true
//     },
//     created_at:{type:Date,default:Date.now}
// })

// const Admin=mongoose.model('Admin',adminSchema)

const { Schema, model } = require('mongoose');

const adminSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
//   image: { type: String, required: true },
  role: { type: String, default: 'admin' }
});

module.exports = model('Admin', adminSchema);
