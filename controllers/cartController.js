const cartModel=require('../models/cartModel')
const mongoose=require('mongoose')
const ObjectId = mongoose.Types.ObjectId;



const add_to_cart = async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id; // Assuming user is authenticated and `req.user.id` contains the decoded userId

    try {
        // Check if the product already exists in the user's cart
        const existingProduct = await cartModel.findOne({ userId, productId });

        if (existingProduct) {
            return res.status(400).json({
                success: false,
                message: 'Product already added to the cart'
            });
        }

        // Create a new cart entry
        const newProduct = await cartModel.create({
            userId,
            productId,
            quantity
        });

        return res.status(201).json({
            success: true,
            message: 'Product added to the cart successfully',
            product: newProduct
        });
    } catch (error) {
        console.error('Error occurred during add_to_cart:', error);  // Log the full error for debugging

        return res.status(500).json({
            success: false,
            message: 'Internal server error. Please try again later.',
            error: error.message  // Send the error message in the response for better debugging
        });
    }
};

// get cart








const getCart = async (req, res) => {
    const commissionPercentage = 5;

    try {
        const userId = req.user.id;

        const cartProducts = await cartModel.aggregate([
            {
                $match: {
                    userId: new ObjectId(userId),
                },
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'productId',
                    foreignField: '_id',
                    as: 'products',
                },
            },
        ]);

        if (!cartProducts || cartProducts.length === 0) {
            return res.status(200).json({
                success: true,
                totalItems: 0,
                totalBuyableItems: 0,
                totalPrice: 0,
                groupedBySeller: [],
                outOfStockProducts: [],
            });
        }

        let buyProductItemCount = 0;
        let totalPrice = 0;
        let cartProductCount = 0;

        const outOfStockProducts = cartProducts.filter(
            (p) => p.products[0]?.stock < p.quantity
        );

        outOfStockProducts.forEach((product) => {
            cartProductCount += product.quantity;
        });

        const inStockProducts = cartProducts.filter(
            (p) => p.products[0]?.stock >= p.quantity
        );
        const groupedBySeller = [];

        for (const product of inStockProducts) {
            const { quantity } = product;
            const { price, discount, sellerId, shopName } = product.products[0];

            cartProductCount += quantity;
            buyProductItemCount += quantity;

            const discountedPrice =
                discount > 0 ? price - Math.floor((price * discount) / 100) : price;
            const finalPrice = discountedPrice - Math.floor((discountedPrice * commissionPercentage) / 100);
            totalPrice += finalPrice * quantity;

            const sellerIndex = groupedBySeller.findIndex(
                (group) => group.sellerId === sellerId.toString()
            );

            const productDetails = {
                _id: product._id,
                quantity,
                productInfo: product.products[0],
            };

            if (sellerIndex > -1) {
                groupedBySeller[sellerIndex].price += finalPrice * quantity;
                groupedBySeller[sellerIndex].products.push(productDetails);
            } else {
                groupedBySeller.push({
                    sellerId: sellerId.toString(),
                    shopName,
                    price: finalPrice * quantity,
                    products: [productDetails],
                });
            }
        }

        res.status(200).json({
            success: true,
            totalItems: cartProductCount,
            totalBuyableItems: buyProductItemCount,
            totalPrice,
            groupedBySeller,
            outOfStockProducts,
        });
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

const removeFromCart = async (req, res) => {
    const { cartid } = req.params; // Correct parameter name
    try {
        await cartModel.findByIdAndDelete(cartid)
      res.status(200).json({ success: true, message: 'success' });
    } catch (error) {
        console.log(error.message)
    }
}

const quantity_inc = async (req, res) => {
    const { cartId } = req.params; // Ensure correct parameter name
    try {
        const product = await cartModel.findById(cartId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }
        product.quantity += 1;
        await product.save();
        res.status(200).json({ success: true, message: "Quantity incremented successfully", product });
    } catch (error) {
        console.error("Error in quantity_inc:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Decrement Quantity
const quantity_dec = async (req, res) => {
    const { cartId } = req.params;
    try {
        const product = await cartModel.findById(cartId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Cart item not found" });
        }
        if (product.quantity <= 1) {
            return res.status(400).json({ success: false, message: "Quantity cannot be less than 1" });
        }
        product.quantity -= 1;
        await product.save();
        res.status(200).json({ success: true, message: "Quantity decremented successfully", product });
    } catch (error) {
        console.error("Error in quantity_dec:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
module.exports={add_to_cart,getCart,removeFromCart,quantity_dec,quantity_inc}