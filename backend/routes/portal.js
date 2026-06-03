const router = require('express').Router();
const Book = require('../models/Book');
const Ticket = require('../models/Ticket');
const auth = require('../middleware/auth');

router.get('/my-books', auth, async (req, res) => {
  try {
    const books = await Book.find({ authorId: req.user.id });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/tickets', auth, async (req, res) => {
  try {
    const tickets = req.user.role === 'admin' 
      ? await Ticket.find().populate('authorId', 'email').sort({ createdAt: -1 })
      : await Ticket.find({ authorId: req.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tickets', auth, async (req, res) => {
  try {
    const ticket = await Ticket.create({ ...req.body, authorId: req.user.id });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/tickets/:id', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Admin only' });
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;