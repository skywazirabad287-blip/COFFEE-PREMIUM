const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// USER LOGIN (hardcoded for now)
const USER = "admin";
// password: admin123
const HASH = "$2b$10$7a8Wz1zFv1v8uZHPsuacFujRsLxgPLZld0dfzpOwLqPNgm6kKiC9W";

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (username !== USER) return res.sendStatus(403);

  const valid = await bcrypt.compare(password, HASH);
  if (!valid) return res.sendStatus(403);

  const token = jwt.sign({ user: username }, process.env.JWT_SECRET, {
    expiresIn: '2h'
  });

  res.json({ token });
});

module.exports = router;
