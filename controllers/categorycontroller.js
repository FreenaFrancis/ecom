const slugify = require('slugify');
const Category= require('../models/categoryModel'); // Assuming your model path
const path = require('path');

const createCategory = async (req, res) => {
  try {
      const { name } = req.body;
      const images = req.files; // Get the uploaded files (multiple files in case of array)

      // Validate the inputs
      if (!name) {
          return res.status(401).send({ message: "Name is required" });
      }

      // Check if images are uploaded
      if (!images || images.length === 0) {
          return res.status(400).send({ message: "At least one image is required" });
      }

      // Check if category with the same name already exists
      const existingCategory = await Category.findOne({ name });
      if (existingCategory) {
          return res.status(200).send({
              success: true,
              message: "Category already exists"
          });
      }

      // Create a new category with the image paths and other details
      const category = await new Category({
          name,
          slug: slugify(name),
          image: images.map(image => image.path) // Save image paths as an array
      }).save();

      // Respond with the new category
      res.status(201).send({
          success: true,
          message: "New category created",
          category
      });
      console.log(category);
      

  } catch (err) {
      console.log(err);
      res.status(500).send({
          success: false,
          err,
          message: "Error in category"
      });
  }
};

  

  const updateCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, slug } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: 'Category ID is required.' });
      }
  
      const updates = { name, slug };
  
      if (req.files && req.files.length > 0) {
        updates.images = req.files.map(file => file.path);
      }
  
      const updatedCategory = await Category.findByIdAndUpdate(id, updates, { new: true });
  
      if (!updatedCategory) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      res.status(200).json({ message: 'Category updated successfully', category: updatedCategory });
    } catch (err) {
      console.error('Error updating category:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  // Delete a category by ID
const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
  
      const deletedCategory = await Category.findByIdAndDelete(id);
  
      if (!deletedCategory) {
        return res.status(404).json({ message: 'Category not found.' });
      }
  
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (err) {
      console.error('Error deleting category:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
  



const getCategoryById = async (req, res) => {
  try {
      const { id } = req.params;

      // Validate if the provided ID is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
          return res.status(400).json({ message: 'Invalid category ID' });
      }

      const category = await Category.findById(id);

      if (!category) {
          return res.status(404).json({ message: 'Category not found' });
      }

      res.status(200).json({ category });
  } catch (err) {
      console.error('Error fetching category:', err);
      res.status(500).json({ message: 'Internal server error' });
  }
};
  const getCategory=(req,res)=>{
      Category.find().then((categories)=>{
          res.send(categories)
          }).catch((err)=>{
            res.status(500).json({ message: 'Internal server error' });
            })
  }


  const singleCategoryController=async(req,res)=>{
    try{
    // const {id}=req.params
    const category=await Category.findOne({slug:req.params.slug})
    res.status(200).send({
        success:true,
        message:"get single category successfully",
        category
    }) 
    }
    catch(error){
        console.log(error);
            res.status(500).send({
                success:false,
                error,
                message:"Error in getting  category"
            })  
    }
    }

  
  module.exports={createCategory,updateCategory,deleteCategory,getCategoryById,getCategory,singleCategoryController}