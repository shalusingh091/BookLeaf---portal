const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { 
    type: String, 
    enum: ['student', 'admin', 'author'], 
    default: 'student' 
  },
  college: String,
  cgpa: Number,
  booksIssued: { type: Number, default: 0 },
  dues: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', userSchema);