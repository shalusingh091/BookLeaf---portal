const express = require('express');
const auth = require('../middleware/auth');
const User = require('../models/User');
const router = express.Router();

router.get('/student', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    const dashboardData = {
      name: user.name,
      university: user.university || 'Delhi University',
      cgpa: user.cgpa || '8.7',
      booksIssued: 3,
      dues: 0,
      notifications: [
        { msg: "New book 'System Design' available", date: "Today" },
        { msg: "Return 'DBMS' by 5th June", date: "2 days ago" }
      ]
    };
    
    res.json(dashboardData);
  } catch (err) {
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;