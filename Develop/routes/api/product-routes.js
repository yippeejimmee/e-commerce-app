const router = require('express').Router();
const {
  Product,
  Category,
  Tag,
  ProductTag
} = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  try {
    const product = await Product.findAll({
      include: [{
        model: Category
      }, {
        model: Tag
      }]
    });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
  // find all products
  // be sure to include its associated Category and Tag data
});

// get one product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Category
      }, {
        model: Tag
      }]
    });

    if (!product) {
      res.status(404).json({
        message: 'No product with this id.'
      });
      return;
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
});

// create new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
    });
    if (req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id: tag_id,
        }
      });
      return ProductTag.bulkCreate(productTagIdArr);
    }
  } catch (err) {
    res.status(400).json(err);
  }
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

  // Product.create(req.body)
  //   .then((product) => {
  //     // if there's product tags, we need to create pairings to bulk create in the ProductTag model
  //     if (req.body.tagIds.length) {
  //       const productTagIdArr = req.body.tagIds.map((tag_id) => {
  //         return {
  //           product_id: product.id,
  //           tag_id,
  //         };
  //       });
  //       return ProductTag.bulkCreate(productTagIdArr);
  //     }
  //     // if no product tags, just respond
  //     res.status(200).json(product);
  //   })
  //   .then((productTagIds) => res.status(200).json(productTagIds))
  //   .catch((err) => {
  //     console.log(err);
  //     res.status(400).json(err);
  //   });
});

// update product
router.put('/:id', async (req, res) => {
  // update product data
  try {
    const updateProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    const updateProductTag = await ProductTag.findAll({
      where: {
        product_id: req.params.id
      }
    });
    const productTagIds = await updateProductTag.map(({
      tag_id
    }) => tag_id);
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    // figure out which ones to remove
    const productTagsToRemove = productTags
      .filter(({
        tag_id
      }) => !req.body.tagIds.includes(tag_id))
      .map(({
        id
      }) => id);

    // run both actions
    await Promise.all([
      ProductTag.destroy({
        where: {
          id: productTagsToRemove
        }
      }),
      ProductTag.bulkCreate(newProductTags),
    ])
    res.json()
  } catch (err) {
    res.status(400).json(err);
  };
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
});

module.exports = router;