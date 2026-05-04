const router = require('express').Router();
const Menu = require('../models/Menu');
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
  res.json(await Menu.find());
});

router.post('/', auth, async (req, res) => {
  await Menu.create(req.body);
  res.send('Added');
});

module.exports = router;