const router = require('express').Router();
const Menu = require('../models/Menu');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  const items = await Menu.find();
  res.json(items);
});

router.post('/', auth, async (req, res) => {
  await Menu.create(req.body);
  res.send('Item added');
});

module.exports = router;
