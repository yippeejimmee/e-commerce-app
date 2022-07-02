const router = require('express').Router();
const {
  Tag,
  Product,
  ProductTag
} = require('../../models');

// The `/api/tags` endpoint

//uses get route to find all tags to responds with those tag as well as the Project model associated with that tag
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

//uses get route to respond with Tag with specific req.params.id as well as the Product data associated with that tag
router.get('/:id', async (req, res) => {
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [{
        model: Product
      }]
    });
    //if there is no tag with specific id, respond with status 404 and message below
    if (!tag) {
      res.status(404).json({
        message: 'No tag with this id.'
      });
      return;
    }
  } catch (err) {
    res.status(500).jason(err);
  }
});

//uses post route to crew new tags by taking in the req.body and responds with status 200 and the newTag
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

//uses put route to update a tag with req.body where the tag has the specific req.params.id
router.put('/:id', async (req, res) => {
  try {
    const updateTag = await Tag.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    //if there is no tag with req.params.id, respond with status 400 and that error
    if (!updateTag) {
      throw new Error("No specific ID");
    } else {
      res.status(200).json(updateTag)
    };
  } catch (err) {
    res.status(400).json(err);
  }
});

//uses delete route to delete tags with specific req.params.id 
router.delete('/:id', async (req, res) => {
  const deleteTag = await Tag.destroy({
    where: {
      id: req.params.id,
    },
  });

  res.json(deleteTag);
  // delete on tag by its `id` value
});

module.exports = router;