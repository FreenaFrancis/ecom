const SellerMedel=require('../models/seller')

const getSeller=async(req,res)=>{
    try{
const sellers=await  SellerMedel.find().then((data)=>{
        res.status(200).json({success:true,data})
    })
    console.log(sellers);
    
    }catch(error){
console.log(error);

    }
}

// sellercount

const NumberOfSeller=async(req,res)=>{
    try{
        const sellers=await  SellerMedel.countDocuments()
        .then((data)=>{
            res.status(200).json({success:true,data})
        })
        console.log(sellers);
        
        }catch(error){
    console.log(error);
    
        }
    }

module.exports={getSeller,NumberOfSeller}