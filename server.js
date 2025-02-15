const express =require('express')
const app = express()
const mongoose=require('mongoose')
const cors=require('cors')
const dotenv=require('dotenv').config()
const authRoutes=require('./routes/authRoutes') //importing authRoutes
// const userRoutes=require('./routes/userRoutes')
const categoryRoutes=require('./routes/categoryRoutes')
const productRoutes=require('./routes/productRoutes')
const cartRoutes=require('./routes/cartRoute')
const wishlistRoute=require('./routes/wishlistRoute')
const bannerRoutes=require('./routes/bannerRoutes')
const reviewRoute=require('./routes/reviewRoute')
const adminRoute=require('./routes/AdminRoutes')
const port=7000
const bodyParser=require('body-parser')
const path=require('path')
mongoose.connect('mongodb://localhost:27017/e-com').then(()=>{
    console.log("Connected to database")
}).catch((err)=>{
    console.log(err.message)
})

app.use(express.json())
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'], // Replace with actual URLs of your client and admin/seller apps
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(bodyParser.json())
// app.use('/uploads', express.static('uploads'));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth',authRoutes)
// app.use('/api/user',userRoutes)
app.use('/api/category',categoryRoutes)
app.use('/api/product',productRoutes)
app.use('/api/cart',cartRoutes)
app.use('/api/wish',wishlistRoute)
app.use('/api/banner',bannerRoutes)
app.use('/api/review',reviewRoute)
app.use('/api/admin',adminRoute)

app.get('/',(req,res)=>{
    res.send("hello")
})

app.listen(port,()=>{
    console.log(`server is running at ${port}`)
    
})


