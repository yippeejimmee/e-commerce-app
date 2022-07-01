const router = require('express').Router();
const {
  Product,
  Category,
  Tag,
  ProductTag
} = require('../../models');

// The `/api/products` endpoint

// get route to retrieve all products using findAll method and res with status 200 and all products in json format
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
    //if there is error, catch and respond with staus 500 and json of that error
    res.status(500).json(err);
  }
});

// get route to return product that has the requested params id 
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{
        model: Category
      }, {
        model: Tag
      }]
    });
    //if there is no product with req params.id, respond with error 404 and message
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

});

// use post route to create new product by inputting the req.body of new product
router.post('/', async (req, res) => {
  try {
    const newProduct = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
      category_id: req.body.category_id,
    });
    //if the new product has 1 or more tag_id, run through each of tag_id and associate with newProduct.id and store inside productTagIdArr
    if (req.body.tag_id.length) {
      const productTagIdArr = req.body.tag_id.map((tag_id) => {
        return {
          product_id: newProduct.id,
          tag_id: tag_id,
        }
      });
      //bulk create tags for ProductTag using the productTagIdArr array
      return ProductTag.bulkCreate(productTagIdArr);
    }
  } catch (err) {
    res.status(400).json(err);
  }

});

// uses put route to update product with specific req.params.id
router.put('/:id', async (req, res) => {
  // update product data
  try {
    //update the products body with req.body where the id matches the req.params.id
    const updateProduct = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    //find all ProductTags that match have the product_id that match the req.params.id and store it inside updateProductTag
    const updateProductTag = await ProductTag.findAll({
      where: {
        product_id: req.params.id
      }
    });
    //iterates through each of the tag_id inside updateProductTag and stores it inside const productTagIds
    const productTagIds = await updateProductTag.map(({
      tag_id
    }) => tag_id);
    // create filtered list of new tag_ids
    const newProductTags = req.body.tagIds
      //looks at req.body.tagIds and filters out ids that are not include in productTagIds
      .filter((tag_id) => !productTagIds.includes(tag_id))
      .map((tag_id) => {
        return {
          product_id: req.params.id,
          tag_id,
        };
      });
    // iterates through tag_id and filters out those that are not included inside the req.body.tagIds
    const productTagsToRemove = ProductTag
      .filter(({
        tag_id
      }) => !req.body.tagIds.includes(tag_id))
      .map(({
        id
      }) => id);

    // run both actions to delete tag_ids that are stored inside productTagsToRemove and creates the new tags inside newProductTags
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

//uses delete route to delete Products that have req.params.id
router.delete('/:id', async (req, res) => {
  const deleteProduct = await Product.destroy({
    where: {
      id: req.params.id,
    },
  })
  res.json(deleteProduct);
});

module.exports = router;