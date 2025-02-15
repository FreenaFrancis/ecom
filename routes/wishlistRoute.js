const express=require('express')
const verifyToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')
const { add_wishlist,get_wishlist, delete_wishlist } = require('../controllers/wishListController')
const router=express.Router()

router.post('/addwishlist',verifyToken,authorizeRoles('customer'),add_wishlist)
router.get('/getwishlist/:userId',verifyToken,authorizeRoles('customer'),get_wishlist)
router.delete('/deletewishlist/:wishlistId',verifyToken,authorizeRoles('customer'),delete_wishlist)
module.exports=router