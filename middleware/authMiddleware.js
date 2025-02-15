const jwt=require('jsonwebtoken')


// const verifyToken=(req,res,next)=>{
//     const token=req.header('x-auth-token')
//     let authHeader=req.headers.authorization || req.headers.Authorization
//     console.log('Authorization Header:', authHeader);
//     if (authHeader && authHeader.startsWith("Bearer")){
//         const token=authHeader.split(" ")[1];
// if(!token){
//     return res.status(401).json({msg:"Access denied. No token provided."})
// }

// try{

//     const decoded=jwt.verify(token,process.env.JWT_SECRET)
//     req.user=decoded
//     console.log("the decode user is ",req.user);
//     console.log('Decoded Token:', decoded); // Log the decoded token

    
    
    
//     next()
// }catch(err){
//     return res.status(401).json({msg:"Access denied. Invalid token."})
// }
//     }
   
// }


// const verifyToken = (req, res, next) => {
//     // Check for the token in the Authorization header
//     let authHeader = req.headers.authorization || req.headers.Authorization;

//     // If the Authorization header exists and starts with "Bearer"
//     if (authHeader && authHeader.startsWith("Bearer")) {
//         // Extract the token after "Bearer "
//         const token = authHeader.split(" ")[1];

//         // If no token is provided
//         if (!token) {
//             return res.status(401).json({ msg: "Access denied. No token provided." });
//         }

//         try {
//             // Verify the token
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);

//             // Attach the decoded user info to the request object
//             req.user = decoded;
//             console.log("Decoded user:", req.user); // For debugging
//             console.log("Role in token:", req.user.role);


//             next(); // Proceed to the next middleware or route handler
//         } catch (err) {
//             return res.status(401).json({ msg: "Access denied. Invalid token." });
//         }
//     } else {
//         return res.status(401).json({ msg: "Authorization header is missing or malformed." });
//     }
// };

// Middleware to check admin role

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;

    if (authHeader && authHeader.startsWith("Bearer")) {
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ msg: "Access denied. No token provided." });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attach decoded user (with role) to request
            console.log("Decoded user in verifyToken:", req.user);
            next();
        } catch (err) {
            return res.status(401).json({ msg: "Access denied. Invalid token." });
        }
    } else {
        return res.status(401).json({ msg: "Authorization header is missing or malformed." });
    }
};


module.exports=verifyToken

// const isAdmin = (req, res, next) => {
//     if (req.user.role !== "admin") {
//       return res.status(403).json({ error: "Admin access required" });
//     }
//     next();
//   };