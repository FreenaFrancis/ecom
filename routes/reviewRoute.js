const express=require('express')
const verifyToken = require('../middleware/authMiddleware')
const { addReview,getReviews } = require('../controllers/reviewController')
const router=express.Router()

router.post('/submitreview/:productId',verifyToken,addReview)
router.get('/getreview/:productId',getReviews)

module.exports=router 