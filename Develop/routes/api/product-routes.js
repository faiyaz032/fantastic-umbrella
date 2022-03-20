const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
   try {
      const products = await Product.findAll({
         attributes: ['id', 'product_name', 'price', 'stock'],
         include: [
            {
               model: Category,
               attributes: ['category_name'],
            },
            {
               model: Tag,
               attributes: ['tag_name'],
            },
         ],
      });

      res.json({ status: 'success', message: 'All products fetched successfully', products });
   } catch (error) {
      console.log(error);
   }
});

router.get('/:id', async (req, res) => {
   const product = await Product.findOne({
      where: { id: req.params.id },
      attributes: ['id', 'product_name', 'price', 'stock'],
      include: [
         {
            model: Category,
            attributes: ['category_name'],
         },
         {
            model: Tag,
            attributes: ['tag_name'],
         },
      ],
   });
   if (!product) return res.status(404).json({ status: 'fail', message: 'No product found with this id' });
   res.json({ status: 'success', message: 'Product fetched successfully', product });
});

// create new product
router.post('/', async (req, res) => {
   const newProduct = await Product.create(req.body);
   let productTagIds;
   if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
         return {
            product_id: newProduct.id,
            tag_id,
         };
      });
      productTagIds = await ProductTag.bulkCreate(productTagIdArr);
   }
   res.status(200).json({ status: 'success', message: 'Product created successfully', product: newProduct });
});

// update product
router.put('/:id', async (req, res) => {
   const product = Product.update(req.body, {
      where: {
         id: req.params.id,
      },
   });

   const productTags = await ProductTag.findAll({ where: { product_id: req.params.id } });

   const productTagIds = productTags.map(({ tag_id }) => tag_id);

   const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
         return {
            product_id: req.params.id,
            tag_id,
         };
      });

   const productTagsToRemove = productTags
      .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
      .map(({ id }) => id);

   await Promise.all([
      ProductTag.destroy({ where: { id: productTagsToRemove } }),
      ProductTag.bulkCreate(newProductTags),
   ]);

   res.json({ status: 'success', message: 'Product updated successfully', product });
});

router.delete('/:id', async (req, res) => {
   try {
      const deletedProduct = await Product.destroy({
         where: {
            id: req.params.id,
         },
      });

      if (!deletedProduct) return res.status(404).json({ status: 'fail', message: 'No product found with this ID' });

      res.json({ status: 'success', message: 'Product deleted successfully' });
   } catch (error) {
      console.log(error);
   }
});

module.exports = router;
