const router = require('express').Router();
const {
  Tag,
  Product,
  ProductTag
} = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  try {
    const tag = await Tag.findAll({
      include: [{
        model: Product
      }]
    });
    res.status(200).json(tag);
  } catch (err) {
    res.status(500).json(err);
  }
  // find all tags
  // be sure to include its associated Product data
});

router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{
        model: Product
      }]
    });
    if (!tag) {
      res.status(404).json({
        message: 'No tag with this id.'
      });
      return;
    }
  } catch (err) {
    res.status(500).jason(err);
  }
  // find a single tag by its `id`
  // be sure to include its associated Product data
});

router.post('/', async (req, res) => {
    try {
      const newTag = await Tag.create({
        tag_name: req.body.tag_name,
      });
      res.status(200).json(newTag);
      // if (req.body)
    } catch (err) {
      res.status(400).json(err);
    }
  }
  // create a new tag
);

router.put('/:id', async (req, res) => {
  try {
    const updateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    if (!updateTag) {
      throw new Error("No specific ID");
    } else {
      res.status(200).json(updateTag)
    };
  } catch (err) {
    res.status(400).json(err);
  }
  // update a tag's name by its `id` value
});

router.delete('/:id', async (req, res) => {
  const deleteTag = await Tag.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.json(deleteTag);
  console.log(deleteTag);
  // delete on tag by its `id` value
});

module.exports = router;