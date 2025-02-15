const express=require('express')
const {  loginUser, registerUser,  } = require('../controllers/authcontrollers')
const verifyToken = require('../middleware/authMiddleware')
const router=express.Router()
const authorizeRoles=require('../middleware/roleMiddleware')
// router.post('/admin-login',adminLogin,verifyToken)
// router.post('/admin-register',Adminregister)
router.post('/register',registerUser)
router.post('/login',loginUser)


router.get('/admin',verifyToken, authorizeRoles("admin"),(req,res)=>{
    res.send("welcome admin")
})
// both admin and seller can access this router
router.get('/seller',verifyToken,authorizeRoles("admin","seller"),async(req,res)=>{
    res.send("welcome seller")
})
// only user can access this router
router.get('/user', verifyToken,authorizeRoles("customer"),async(req,res)=>{
    res.send("welcome user")
})

module.exports=router