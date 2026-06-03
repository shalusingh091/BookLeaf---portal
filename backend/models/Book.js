const mongoose = require('mongoose');
const bookSchema = new mongoose.Schema({
  title: String,
  ISBN: String,
  genre: String,
  publicationDate: Date,
  status: String,
  MRP: Number,
  copiesSold: { type: Number, default: 0 },
  royaltyEarned: { type: Number, default: 0 },
  royaltyPaid: { type: Number, default: 0 },
  royaltyPending: { type: Number, default: 0 },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Book', bookSchema)