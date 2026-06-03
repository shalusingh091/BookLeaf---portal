const express = require('express');
const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === 'admin@test.com' && password === 'password123') {
    return res.json({
      token: 'demo-token-12345',
      user: { email: 'admin@test.com', role: 'admin' }
    });
  }
  
  return res.status(400).json({ msg: 'Invalid credentials' });
});

module.exports = router;