const router = require('express').Router();
const {
  Category,
  Product
} = require('../../models');

// The `/api/categories` endpoint

//the get route used to find all categories and respond with it
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{
        model: Product
      }],
    });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }
  // find all categories
  // be sure to include its associated Products
});

//the get route to return a category with certrain params.id and respond with it
router.get('/:id', async (req, res) => {
  try {
    const categories = await Category.findByPk(req.params.id, {
      include: [{
        model: Product
      }],
    });
    //if there is no category with that id, then res with error 404 and message
    if (!categories) {
      res.status(404).json({
        message: 'No product by this id'
      });
      return;
    }

    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json(err);
  }

});

//uses post route to create category 
router.post('/', async (req, res) => {
  try {
    const category = await Category.create({
      category_id: req.body.category_id,
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(400).json(err);
  }
  // create a new category
});

//uses put route to update the category with the specific params.id
router.put('/:id', async (req, res) => {
  try {
    const category = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    //if there is no category with ID to update, return status 404 and message
    if (!category[0]) {
      res.status(404).json({
        message: 'No category with this id.'
      });
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
  // update a category by its `id` value
});

//uses delete route to delete category with params.id
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const categoryDelete = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });
    //if there is no category with specified params.id, respond with 404 and message
    if (!categoryDelete) {
      res.status(404).json({
        message: 'No category with this id.'
      });
      return;
    }
    res.status(200).json(categoryDelete);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;