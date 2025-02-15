// const authorizeRoles=()=>{
//     return(req,res,next)=>{
//         if(!allowedRoles.includes(req.user.role)){
//             return res.status(401).json({msg:"Access denied.."})
//         }
//         next()
//     }
// }

// module.exports=authorizeRoles

// const authorizeRoles = (...allowedRoles) => {
//     return (req, res, next) => {
//         try {
//             if (!allowedRoles.includes(req.user?.role)) {
//                 return res.status(403).json({ msg: "Access denied." });
//             }
//             next();
//             console.log(req.user);

//         } catch (error) {
//             res.status(500).json({ msg: "Internal server error.", error: error.message });
//         }
//     };
// };



const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        try {
            console.log("User in authorizeRoles:", req.user); // Debugging
            console.log("Allowed roles:", allowedRoles); 
            console.log("Role in token:", req.user.role); // Should now be defined
// console.log("Allowed roles:", allowedRoles);
    // Debugging
            if (!allowedRoles.includes(req.user?.role)) {
                return res.status(403).json({ msg: "Access denied. User role is not authorized." });
            }
            next();
        } catch (error) {
            res.status(500).json({ msg: "Internal server error.", error: error.message });
        }
    };
};


// module.exports = authorizeRoles;


module.exports = authorizeRoles;
