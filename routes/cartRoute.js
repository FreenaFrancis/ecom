const express = require('express');

const router = express.Router();

const { removeFromCart, getCart, add_to_cart, quantity_inc, quantity_dec } = require('../controllers/cartController');
const verifyToken = require('../middleware/authMiddleware');
const authorizeRoles = require('../middleware/roleMiddleware');

router.post('/addtocart', verifyToken,  add_to_cart);
router.get('/removefromcart/:id', verifyToken, removeFromCart);
router.get('/getcart/:userid', verifyToken,authorizeRoles('customer'), getCart);
router.put('/quantityinc/:cartid', verifyToken,authorizeRoles('customer'), quantity_inc);
router.put('/quantitydec/:cartid', verifyToken,authorizeRoles('customer'), quantity_dec);

module.exports = router;
