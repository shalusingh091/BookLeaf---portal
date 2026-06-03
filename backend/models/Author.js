const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['author', 'admin'], default: 'author' }, // 'user' nahi 'author'
  bankDetailsLinked: { type: Boolean, default: false },
  package: { type: String, enum: ['Standard Free', 'Bestseller Breakthrough'] },
  joinedDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Author', authorSchema); // 'Author' export karna hai