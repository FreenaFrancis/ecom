



// const express = require('express');
// const User = require('../models/user'); // Renamed 'user' to 'User' to follow naming conventions
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const adminModel=require('../models/admin')
// // Register a new user
// const register = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body; // Match field names in your schema
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ name, email, password: hashedPassword, role });
//     await newUser.save();
//     res.status(201).json({ message: "User created" });
//   } catch (err) {
//     res.status(500).json({ message: "Something went wrong" });
//     console.error(err.message);
//   }
// };

// // Login user
// const login = async (req, res) => {
//   try {
//     const { name, password } = req.body; // Match field names in your schema

//     // Validate input
//     if (!name || !password) {
//       return res.status(400).json({ message: "Name and password are required" });
//     }

//     const user = await User.findOne({ name });
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, user.password);
//     if (!isPasswordCorrect) {
//       return res.status(401).json({ message: "Password is incorrect" });
//     }

//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     res.status(200).json({ token });
//   } catch (err) {
//     res.status(500).json({ message: "Something went wrong" });
//     console.error(err.message);
//   }
// };


// // admin controller
// const admin_Login=async(req,res)=>{
//   const {email,password}=req.body;
//   try{
// const admin=adminModel.findOne({email}).select('+password')
// if (admin) {
//   const match = await bcrypt.compare(password, admin.password)
//   if (match) {
//       const token = await createToken({
//           id: admin.id,
//           role: admin.role
//       })
//       res.cookie('accessToken', token, {
//           expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
//       })
//       responseReturn(res, 200, { token, message: 'Login success' })
//   } else {
//       responseReturn(res, 404, { error: "Password wrong" })
//   }
// } else {
//   responseReturn(res, 404, { error: "Email not found" })
// }
//   }catch(err){

//   }
// }

// module.exports = { register, login,admin_Login };



const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const Admin = require('../models/admin');
const Seller = require('../models/seller');

// Register User
const registerUser = async (req, res) => {
  const { role, name, email, password, method } = req.body;

  try {
    let Model;
    if (role === 'customer') Model = Customer;
    else if (role === 'admin') Model = Admin;
    else if (role === 'seller') Model = Seller;
    else return res.status(400).json({ message: 'Invalid role' });

    const existingUser = await Model.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Model({ name, email, password: hashedPassword, method });
    await newUser.save();

    res.status(201).json({ message: `${role} registered successfully` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await Admin.findOne({ email }).select('password role') ||
//                  await Seller.findOne({ email }).select('password role') ||
//                  await Customer.findOne({ email }).select('password role');

//     if (!user) {
//       return res.status(400).json({ message: 'User not found' });
//     }

//     if (!password) {
//       return res.status(400).json({ message: 'Password is missing' });
//     }

//     // Validate password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Invalid password' });
//     }

//     // Generate JWT token with the user's ID and role
//     // const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
//     const token = jwt.sign(
//       { id: user._id, name: user.name, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );
//     // Send the token to the frontend
//     res.status(200).json({
//       message: 'Login successful',
//       token,
//       name: user.name, // Include the user's name in the response
//       role: user.role, // Include the user's role in the response
//     });
    
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
      const user = await Admin.findOne({ email }).select('password role') ||
                   await Seller.findOne({ email }).select('password role') ||
                   await Customer.findOne({ email }).select('password role');

      if (!user) {
          return res.status(400).json({ message: 'User not found' });
      }

      if (!password) {
          return res.status(400).json({ message: 'Password is missing' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Invalid password' });
      }

      const token = jwt.sign(
          { id: user._id, role: user.role }, // Include role
          process.env.JWT_SECRET,
          { expiresIn: '10d' }
      );

      res.status(200).json({
          message: 'Login successful',
          token,
          role: user.role, // Include role in response for debugging
      });
      console.log("User role during login:", user.role);

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};


module.exports = { registerUser, loginUser };
