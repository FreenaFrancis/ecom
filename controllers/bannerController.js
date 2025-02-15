// // const { uploadSingle } = require('../middleware/multerMiddleware');
// const bannerModel = require('../models/bannerModel');
// const productModel = require('../models/productModel');

// const { uploadSingle } = require('../middleware/multerMiddleware'); // For single image upload

// const createBanner = async (req, res) => {
//     uploadSingle(req, res, async (err) => {
//         if (err) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'File upload error: ' + err.message,
//             });
//         }

//         const { productId, link } = req.body;
//         const image = req.file; // Since only one file is uploaded

//         if (!productId || !image || !link) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'Missing required fields: productId, banner, or link.',
//             });
//         }

//         try {
//             const banner = await bannerModel.create({
//                 productId,
//                 banner: `/uploads/${image.filename}`, // Store the local file path
//                 link,
//             });

//             res.status(201).json({
//                 success: true,
//                 message: 'Banner created successfully.',
//                 banner,
//             });
//         } catch (error) {
//             console.error('Error in createBanner:', error.message);
//             res.status(500).json({
//                 success: false,
//                 message: 'Internal server error.',
//             });
//         }
//     });
// };

// module.exports={createBanner}

const { uploadSingle } = require('../middleware/multerMiddleware');
const bannerModel = require('../models/bannerModel');
const productModel = require('../models/ProductModel');
const fs = require('fs');
const mongoose = require('mongoose');

const createBanner = async (req, res) => {
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(400).json({
                success: false,
                message: 'File upload error: ' + err.message,
            });
        }

        console.log('File uploaded:', req.file);
        const { productId, link } = req.body;

        if (!productId || !req.file || !link) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: productId, image, or link.',
            });
        }

        try {
            const product = await productModel.findById(productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found.',
                });
            }

            const banner = await bannerModel.create({
                productId,
                banner: `/uploads/${req.file.filename}`,
                link: link || product.slug,
            });

            res.status(201).json({
                success: true,
                message: 'Banner created successfully.',
                banner,
            });
        } catch (error) {
            console.error('Error creating banner:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error.',
            });
        }
    });
};

const getbanner=async(req,res)=>{
    try{
        const banners=await bannerModel.find()
        res.status(200).json({success:true,banners})

    }catch(error){
        res.status(500).json({success:false,message:error.message})
        console.error('Error fetching banners:', error);
    }
}


const getbannerbyid=async(req,res)=>{
   try{
    const { productId } = req.params
    const banner = await bannerModel.findOne({ productId });
    if (!banner) {
        return res.status(404).json({
            success: false,
            message: 'Banner not found.',
        });
        }
        res.status(200).json({ success: true, banner });

   }catch(error){
    res.status(500).json({success:false,message:error.message})
   }
}
const updateBanner = async (req, res) => {
    uploadSingle(req, res, async (err) => {
        if (err) {
            console.error('File upload error:', err);
            return res.status(400).json({
                success: false,
                message: 'File upload error: ' + err.message,
            });
        }

        const { bannerId } = req.params; // Ensure this is passed in the route as a param
        const { link } = req.body;

        if (!bannerId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required field: bannerId.',
            });
        }

        try {
            // Fetch the existing banner
            const banner = await bannerModel.findById(bannerId);

            if (!banner) {
                return res.status(404).json({
                    success: false,
                    message: 'Banner not found.',
                });
            }

            // Update the image if a new file is uploaded
            if (req.file) {
                const fs = require('fs');
                const oldBannerPath = banner.banner.replace('/uploads/', 'uploads/');
                if (fs.existsSync(oldBannerPath)) {
                    fs.unlinkSync(oldBannerPath); // Delete old file
                }
                banner.banner = `/uploads/${req.file.filename}`; // Update banner path
            }

            // Update the link if provided
            if (link) {
                banner.link = link;
            }

            // Save changes to the existing banner
            await banner.save();

            res.status(200).json({
                success: true,
                message: 'Banner updated successfully.',
                banner,
            });
        } catch (error) {
            console.error('Error updating banner:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error.',
            });
        }
    });
};






const deleteBanner = async (req, res) => {
    const { bannerId } = req.params;

    // Log the bannerId to see what value is received
    console.log('Received bannerId:', bannerId);

    if (!bannerId) {
        return res.status(400).json({
            success: false,
            message: 'Missing required field: bannerId.',
        });
    }

    // Check if bannerId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(bannerId)) {
        return res.status(400).json({
            success: false,
            message: 'Invalid bannerId.',
        });
    }

    try {
        // Fetch the banner by ID
        const banner = await bannerModel.findById(bannerId);

        if (!banner) {
            return res.status(404).json({
                success: false,
                message: 'Banner not found.',
            });
        }

        // Log the banner object to see what data was fetched
        console.log('Found banner:', banner);

        // Delete the image file from the server
        const oldBannerPath = banner.banner.replace('/uploads/', 'uploads/');
        if (fs.existsSync(oldBannerPath)) {
            fs.unlinkSync(oldBannerPath);  // Remove old file
        }

        // Delete the banner from the database
        await bannerModel.findByIdAndDelete(bannerId);

        res.status(200).json({
            success: true,
            message: 'Banner deleted successfully.',
        });
    } catch (error) {
        console.error('Error deleting banner:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error.',
        });
    }
};





module.exports = { createBanner,getbanner,getbannerbyid,updateBanner,deleteBanner };

