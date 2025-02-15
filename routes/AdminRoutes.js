const express=require('express')
const verifyToken = require('../middleware/authMiddleware')
const authorizeRoles = require('../middleware/roleMiddleware')
const { getSeller, NumberOfSeller } = require('../controllers/AdminController')

const router=express.Router()

router.get('/getallsellers',verifyToken,authorizeRoles("admin"),getSeller)
router.get('/no.ofsellers',verifyToken,authorizeRoles("admin"),NumberOfSeller)

module.exports=router