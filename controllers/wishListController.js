const wishlistModel = require('../models/wishlistModel');

// Add product to wishlist
const add_wishlist = async (req, res) => {
    const { slug,  } = req.body;
    const userId=req.user.id

    // Validate required fields
    if (!slug || !userId) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields: slug and userId.',
        });
    }

    try {
        // Check if the product already exists in the user's wishlist
        const product = await wishlistModel.findOne({ slug, userId });

        if (product) {
            return res.status(409).json({
                success: false,
                message: 'Product already exists in the wishlist.',
            });
        }

        // Add product to wishlist
        const newWishlistItem = await wishlistModel.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Product added to wishlist successfully.',
            wishlist: newWishlistItem,
        });
    } catch (error) {
        console.error('Error in add_wishlist:', error.message);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};


const get_wishlist=async(req,res)=>{
try{
    const {
        userId
    } = req.params;
    const wishlists=await wishlistModel.find({
        userId
    })
    res.status(200).json({success:true,wishlists,  wishlistCount: wishlists.length,
    })

}
catch(error){

    console.error('Error in get_wishlist:',error.message)
    res.status(500).json({success:false,message:'Internal server error.'})
}

}


const delete_wishlist = async (req, res) => {
    const {
        wishlistId
    } = req.params
    try {
        const wishlist = await wishlistModel.findByIdAndDelete(wishlistId)
     
        res.status(200).json({
            success: true,
            message: 'Wishlist item removed successfully.',
            wishlistId
        })
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = { add_wishlist,get_wishlist,delete_wishlist };

