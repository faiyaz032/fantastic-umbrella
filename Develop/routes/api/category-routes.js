const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
   try {
      //Fetch categories and their corresponding products
      const categories = await Category.findAll({
         include: {
            model: Product,
            attributes: ['id', 'product_name', 'price', 'stock'],
         },
      });

      //Check if categories exists if not then return a fail response
      if (!categories) return res.status(404).json({ status: 'fail', message: 'No categories found!' });

      //send success response with categories
      res.json({ status: 'success', message: 'Categories fetched successfully', categories });
   } catch (error) {
      console.log(error);
   }
});

router.get('/:id', async (req, res) => {
   try {
      //Get a category with products
      const category = await Category.findOne({
         where: { id: req.params.id },
         include: {
            model: Product,
            attributes: ['id', 'product_name', 'price', 'stock'],
         },
      });

      //check if category fetched successfully or not
      if (!category) return res.status(404).json({ status: 'fail', message: 'Category not found with this ID' });

      //send success response with categories
      res.json({ status: 'success', message: 'Category fetched successfully', category });
   } catch (error) {
      console.log(error);
   }
});

router.post('/', async (req, res) => {
   try {
      //create new category
      const newCateogry = await Category.create({ ...req.body });
      //check if category created successfully
      if (!newCateogry) return res.status(403).json({ status: 'fail', message: 'Failed to create a new category' });

      //send success response
      res.json({ status: 'success', message: 'New category created successfully', category: newCateogry });
   } catch (error) {
      console.log(error);
   }
});

router.put('/:id', async (req, res) => {
   try {
      //update the category
      const updatedCategory = await Category.update(req.body, {
         where: {
            id: req.params.id,
         },
         returning: true,
      });

      //check if updats successfully
      if (!updatedCategory) return res.status(404).json({ status: 'fail', message: 'No category found with this id' });

      //return success response
      res.json({ status: 'success', message: 'Category updated successfully' });
   } catch (error) {
      console.log(error);
   }
});

router.delete('/:id', async (req, res) => {
   try {
      // delete a category
      const deletedCategory = await Category.destroy({
         where: {
            id: req.params.id,
         },
      });

      //check if category deleted successfully
      if (!deletedCategory) return res.status(404).json({ status: 'fail', message: 'No category found with this id' });

      //return success response
      res.json({ status: 'success', message: 'Category deleted successfully' });
   } catch (error) {
      console.log(error);
   }
});

module.exports = router;
