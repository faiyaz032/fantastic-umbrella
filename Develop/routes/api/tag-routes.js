const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
   try {
      const tags = await Tag.findAll({
         include: {
            model: Product,
            attributes: ['product_name', 'price', 'stock', 'category_id'],
         },
      });
      res.json({ status: 'success', message: 'All tags fetched successfully', tags });
   } catch (error) {
      console.log(error);
   }
});

router.get('/:id', async (req, res) => {
   try {
      const tag = await Tag.findOne({
         include: {
            model: Product,
            attributes: ['product_name', 'price', 'stock', 'category_id'],
         },
      });
      res.json({ status: 'success', message: 'Tag fetched successfully', tag });
   } catch (error) {
      console.log(error);
   }
});

router.post('/', async (req, res) => {
   try {
      const newTag = await Tag.create(req.body);

      res.json({ status: 'success', message: 'New tag created successfully', tag: newTag });
   } catch (error) {
      console.log(error);
   }
});

router.put('/:id', async (req, res) => {
   try {
      await Tag.update(req.body, { where: { id: req.params.id } });

      res.json({ status: 'success', message: 'Tag updated successfully' });
   } catch (error) {
      console.log(error);
   }
});

router.delete('/:id', async (req, res) => {
   try {
      await Tag.destroy({ where: { id: req.params.id } });

      res.json({ status: 'success', message: 'Tag deleted successfully' });
   } catch (error) {
      console.log(error);
   }
});

module.exports = router;
