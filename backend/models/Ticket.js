const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  subject: String,
  description: String,
  category: String,
  priority: String,
  status: { type: String, default: 'Open' },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookId: String,
  aiDraftResponse: String,
  adminResponse: String,
  internalNote: String  // ← YE LINE ADD KI HAI STEP 8 MEIN
}, { timestamps: true });

module.exports = mongoose.model('Ticket', ticketSchema);