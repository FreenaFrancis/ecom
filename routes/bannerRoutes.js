const express=require('express')
const verifyToken = require('../middleware/authMiddleware')
const router=express.Router()
const authorizeRoles = require('../middleware/roleMiddleware')
const { createBanner, getbanner, getbannerbyid, deleteBanner } = require('../controllers/bannerController')
const {  uploadSingle } = require('../middleware/multerMiddleware')

router.post('/createbanner', verifyToken, authorizeRoles('admin'),  createBanner);
router.get('/getbannerbyid/:productId',verifyToken,authorizeRoles('admin'), getbannerbyid,)
router.put('/updatebanner/:bannerId',verifyToken,authorizeRoles('admin'), createBanner)
// router.delete('/deletebanner/:bannerId',verifyToken,authorizeRoles('admin'),deleteBanner)
router.delete('/deletebanner/:bannerId', verifyToken, authorizeRoles('admin'), deleteBanner);

router.get('/getbanner',getbanner)

module.exports=router


                                                                                         
