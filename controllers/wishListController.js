const wishlistModel = require('../models/wishlistModel');

// Add product to wishlist
const add_wishlist = async (req, res) => {
    try {
        const { slug, productId, name, price, discount, image } = req.body;
        const userId = req.user ? req.user.id : null; // Ensure userId is retrieved

        // Validate required fields
        if (!slug || !userId || !productId || !name || !price || !discount || !image) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: userId, productId, slug, name, price, discount, or image.',
            });
        }

        // Check if the product already exists in the user's wishlist
        const existingProduct = await wishlistModel.findOne({ slug, userId });

        if (existingProduct) {
            return res.status(409).json({
                success: false,
                message: 'Product already exists in the wishlist.',
            });
        }

        // Create wishlist item with userId included
        const newWishlistItem = new wishlistModel({
            userId,
            productId,
            slug,
            name,
            price,
            discount,
            image,
        });

        await newWishlistItem.save();

        res.status(201).json({
            success: true,
            message: 'Product added to wishlist successfully.',
            wishlist: newWishlistItem,
        });

        console.log("Received Wishlist Data:", newWishlistItem);

    } catch (error) {
        console.error('Error in add_wishlist:', error);
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
    if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required to fetch the wishlist.",
        });
      }
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
    try {
        const { wishlistId } = req.params;

        // Check if wishlist item exists
        const wishlistItem = await wishlistModel.findById(wishlistId);
        if (!wishlistItem) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist item not found.',
            });
        }

        // Delete wishlist item
        await wishlistModel.findByIdAndDelete(wishlistId);

        res.status(200).json({
            success: true,
            message: 'Wishlist item removed successfully.',
            wishlistId,
        });

    } catch (error) {
        console.error("Error deleting wishlist:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal server error.",
        });
    }
};



module.exports = { add_wishlist,get_wishlist,delete_wishlist };

